import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe environment getter compatible with Vite browser bundling and test runners
const getEnvVar = (name: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[name]) {
      return (import.meta as any).env[name];
    }
  } catch {
    // ignore
  }
  if (typeof process !== 'undefined' && process.env?.[name]) {
    return process.env[name] || '';
  }
  return '';
};

const rawUrl = getEnvVar('VITE_SUPABASE_URL').replace(/^["']|["']$/g, '').trim();
export const cleanSupabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const rawKey = getEnvVar('VITE_SUPABASE_ANON_KEY').replace(/^["']|["']$/g, '').trim();
export const supabaseAnonKey = rawKey;

/**
 * Validates whether Supabase environment variables are provided and not placeholders.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!cleanSupabaseUrl || !supabaseAnonKey) return false;
  if (
    cleanSupabaseUrl === '' ||
    supabaseAnonKey === '' ||
    cleanSupabaseUrl.includes('your-project.supabase.co') ||
    supabaseAnonKey.includes('your-anon-key') ||
    !cleanSupabaseUrl.startsWith('https://')
  ) {
    return false;
  }
  return true;
};

// Singleton Supabase Client instance
let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    clientInstance = createClient(cleanSupabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.error('فشل في تهيئة عميل Supabase:', err);
  }
}

export const supabase = clientInstance;

/**
 * Returns current Supabase connection configuration status.
 */
export const getSupabaseConfig = () => ({
  url: cleanSupabaseUrl || '',
  anonKeyPresent: Boolean(supabaseAnonKey && !supabaseAnonKey.includes('your-anon-key')),
  isConfigured: isSupabaseConfigured(),
  configuredEmail: getEnvVar('VITE_ADMIN_EMAIL').replace(/^["']|["']$/g, '').trim(),
});

/**
 * Verifies whether the currently authenticated user has admin authority
 * strictly by invoking the database RPC function `is_admin()`.
 * Never relies on client-side state, email matching, or localStorage.
 */
export const checkIsAdminFromDatabase = async (): Promise<{
  isAdmin: boolean;
  userId?: string;
  email?: string;
  error?: string;
}> => {
  if (!isSupabaseConfigured() || !supabase) {
    return { isAdmin: false, error: 'قاعدة بيانات Supabase غير مهيأة بعد في متغيرات البيئة.' };
  }

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session || !session.user) {
      return { isAdmin: false, error: 'لا توجد جلسة مصادقة نشطة.' };
    }

    // Call PostgreSQL RPC function public.is_admin()
    const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');
    if (rpcError) {
      console.error('خطأ دالة is_admin:', rpcError);
      return {
        isAdmin: false,
        userId: session.user.id,
        email: session.user.email,
        error: `خطأ في فحص صلاحية الأدمن من قاعدة البيانات: ${rpcError.message}`,
      };
    }

    const verifiedAdmin = Boolean(isAdmin);
    return {
      isAdmin: verifiedAdmin,
      userId: session.user.id,
      email: session.user.email,
      error: verifiedAdmin
        ? undefined
        : 'تم تسجيل الدخول بنجاح، ولكن هذا الحساب ليس مسجلاً كمسؤول في جدول admin_allowlist (تم رفض الإذن بواسطة دالة is_admin).',
    };
  } catch (err: any) {
    return {
      isAdmin: false,
      error: err.message || 'حدث خطأ غير متوقع أثناء فحص الصلاحية.',
    };
  }
};

/**
 * Tests live connection against the Supabase database.
 */
export const testSupabaseConnection = async (): Promise<{
  connected: boolean;
  message: string;
  authWorking: boolean;
  rpcWorking: boolean;
  categoriesAccessible: boolean;
  details?: Record<string, any>;
}> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      connected: false,
      authWorking: false,
      rpcWorking: false,
      categoriesAccessible: false,
      message: 'بيانات اعتماد Supabase غير متوفرة في متغيرات البيئة.',
    };
  }

  try {
    // 1. Test Auth endpoint
    const { error: authError } = await supabase.auth.getSession();
    const authWorking = !authError;

    // 2. Test is_admin RPC endpoint
    const { data: isAnonAdmin, error: rpcError } = await supabase.rpc('is_admin');
    const rpcWorking = !rpcError;

    // 3. Test Categories table query
    const { count: catCount, error: catError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    const categoriesAccessible = !catError;

    if (authWorking && rpcWorking) {
      return {
        connected: true,
        authWorking: true,
        rpcWorking: true,
        categoriesAccessible,
        message: categoriesAccessible
          ? 'تم الاتصال بـ Supabase وAuth ودالة is_admin() والجداول بنجاح!'
          : `تم الاتصال بـ Supabase وAuth بنجاح، ولكن قراءة جدول categories تتطلب منح صلاحية: ${catError?.message || ''}`,
        details: {
          catCount: catCount || 0,
          catError: catError ? catError.message : null,
          isAnonAdmin,
        },
      };
    }

    return {
      connected: false,
      authWorking,
      rpcWorking,
      categoriesAccessible,
      message: `فشل التحقق من الاتصال: ${authError?.message || rpcError?.message || 'خطأ غير معروف'}`,
    };
  } catch (err: any) {
    return {
      connected: false,
      authWorking: false,
      rpcWorking: false,
      categoriesAccessible: false,
      message: `خطأ في الاتصال: ${err.message || 'خطأ غير معروف'}`,
    };
  }
};
