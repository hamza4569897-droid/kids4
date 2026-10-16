import { supabase, isSupabaseConfigured, checkIsAdminFromDatabase } from './supabase';

export interface AdminAuthState {
  isChecking: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { email: string; id: string } | null;
  error?: string;
}

/**
 * Checks current authentication and database admin authority.
 * Strictly uses PostgreSQL RPC function public.is_admin() and admin_allowlist.
 * Never relies on client-side state, unverified email checks, or localStorage spoofing.
 */
export async function getAdminAuthStatus(): Promise<AdminAuthState> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      isChecking: false,
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      error: 'قاعدة بيانات Supabase غير مهيأة.',
    };
  }

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session || !session.user) {
      return {
        isChecking: false,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
      };
    }

    const adminCheck = await checkIsAdminFromDatabase();

    return {
      isChecking: false,
      isAuthenticated: true,
      isAdmin: Boolean(adminCheck.isAdmin),
      user: {
        email: session.user.email || '',
        id: session.user.id,
      },
      error: adminCheck.error,
    };
  } catch (err: any) {
    return {
      isChecking: false,
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      error: err.message || 'حدث خطأ أثناء التحقق من الصلاحيات.',
    };
  }
}

/**
 * Subscribes to Supabase Auth state changes and re-evaluates database is_admin() authority.
 */
export function subscribeToAdminAuth(
  onStatusChange: (status: AdminAuthState) => void
): () => void {
  if (!isSupabaseConfigured() || !supabase) {
    onStatusChange({
      isChecking: false,
      isAuthenticated: false,
      isAdmin: false,
      user: null,
    });
    return () => {};
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, _session) => {
      if (event === 'SIGNED_OUT' || !_session?.user) {
        onStatusChange({
          isChecking: false,
          isAuthenticated: false,
          isAdmin: false,
          user: null,
        });
      } else {
        const status = await getAdminAuthStatus();
        onStatusChange(status);
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}
