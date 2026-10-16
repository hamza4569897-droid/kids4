import { EducationalResource, Category, TrustedSource, ImportCandidate, AdminAuditLog, ContactReport } from '../types/database';
import { INITIAL_CATEGORIES, INITIAL_RESOURCES, INITIAL_TRUSTED_SOURCES, INITIAL_CANDIDATES } from '../data/seedData';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  executeSyncForSource,
  executeSyncAllActiveSources,
  getSyncRuns,
} from './sync/syncEngine';

const STORAGE_KEYS = {
  FAVORITES: 'little_stars_favorites',
  RECENTLY_PLAYED: 'little_stars_recent',
  RESOURCES_OVERRIDE: 'little_stars_resources_v1',
  CATEGORIES_OVERRIDE: 'little_stars_categories_v1',
  SOURCES_OVERRIDE: 'little_stars_sources_v1',
  CANDIDATES_OVERRIDE: 'little_stars_candidates_v1',
  AUDIT_LOGS: 'little_stars_audit_logs',
  REPORTS: 'little_stars_reports',
};

// Safe storage helper with SSR, test environment, and in-memory fallback
const inMemoryStore = new Map<string, string>();

export const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch {
        return inMemoryStore.get(key) || null;
      }
    }
    return inMemoryStore.get(key) || null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, value);
        return;
      } catch {
        // storage quota exceeded or restricted
      }
    }
    inMemoryStore.set(key, value);
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
        return;
      } catch {
        // ignore
      }
    }
    inMemoryStore.delete(key);
  },
};

// URL validation helper protecting against javascript: and unauthorized external schemes
export function sanitizeLaunchUrl(url?: string): { safe: boolean; url: string; reason?: string } {
  if (!url) return { safe: true, url: '' };
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('./')) {
    return { safe: true, url: trimmed };
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { safe: false, url: '', reason: 'بروتوكول غير آمن. يُسمح فقط بروابط HTTPS' };
    }
    return { safe: true, url: parsed.toString() };
  } catch {
    return { safe: false, url: '', reason: 'رابط غير صالح' };
  }
}

// Child Favorites Management (Kept locally on device for child privacy compliance)
export function getFavoriteIds(): string[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(resourceId: string): boolean {
  const current = getFavoriteIds();
  const exists = current.includes(resourceId);
  const updated = exists ? current.filter((id) => id !== resourceId) : [...current, resourceId];
  try {
    safeStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  } catch (err) {
    console.error('فشل في حفظ المفضلة:', err);
  }
  return !exists;
}

export function isFavorite(resourceId: string): boolean {
  return getFavoriteIds().includes(resourceId);
}

// Child Recently Played Management (Kept locally on device)
export function getRecentlyPlayedIds(): string[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordRecentlyPlayed(resourceId: string) {
  const current = getRecentlyPlayedIds().filter((id) => id !== resourceId);
  const updated = [resourceId, ...current].slice(0, 10);
  try {
    safeStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(updated));
  } catch (err) {
    console.error('فشل في حفظ السجل الأخير:', err);
  }
}

// ============================================================================
// Automatic Seeder for Live Supabase Database
// ============================================================================
export async function seedInitialDataToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, message: 'Supabase غير مهيأ بعد.' };
  }

  try {
    // 1. Seed Categories if empty
    const { data: existingCats } = await supabase.from('categories').select('id').limit(1);
    if (!existingCats || existingCats.length === 0) {
      const { error: catErr } = await supabase.from('categories').insert(INITIAL_CATEGORIES);
      if (catErr) console.warn('خطأ في إدخال التصنيفات الأولية في Supabase:', catErr);
    }

    // 2. Seed Educational Resources if empty
    const { data: existingRes } = await supabase.from('educational_resources').select('id').limit(1);
    if (!existingRes || existingRes.length === 0) {
      const { error: resErr } = await supabase.from('educational_resources').insert(INITIAL_RESOURCES);
      if (resErr) console.warn('خطأ في إدخال الأنشطة الأولية في Supabase:', resErr);
    }

    // 3. Seed Trusted Sources if empty
    const { data: existingSrc } = await supabase.from('trusted_sources').select('id').limit(1);
    if (!existingSrc || existingSrc.length === 0) {
      const { error: srcErr } = await supabase.from('trusted_sources').insert(INITIAL_TRUSTED_SOURCES);
      if (srcErr) console.warn('خطأ في إدخال المصادر الأولية في Supabase:', srcErr);
    }

    return { success: true, message: 'تمت تهيئة البيانات الأولية في Supabase بنجاح.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'خطأ أثناء تهيئة البيانات في Supabase.' };
  }
}

// Helper to verify resource safety and public availability
export function isResourcePubliclySafe(resource: EducationalResource): boolean {
  return (
    resource.review_status === 'approved' &&
    Boolean(resource.published_at) &&
    Boolean(resource.safety_reviewed_at)
  );
}

// ============================================================================
// 1. Educational Resources Data Access Layer
// ============================================================================
export async function getResources(forAdmin = false): Promise<EducationalResource[]> {
  let list: EducationalResource[] = [];

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('educational_resources')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        list = (data as any[]).map((r) => {
          const notes: string[] = Array.isArray(r.accessibility_notes) ? r.accessibility_notes : [];
          const extraCategories = notes
            .filter((n) => typeof n === 'string' && n.startsWith('extra_category:'))
            .map((n) => n.replace('extra_category:', ''));
          const cleanNotes = notes.filter((n) => !(typeof n === 'string' && n.startsWith('extra_category:')));
          return {
            ...r,
            accessibility_notes: cleanNotes,
            additional_categories: extraCategories.length > 0 ? extraCategories : undefined,
          };
        });
      } else if (!error && data && data.length === 0) {
        list = INITIAL_RESOURCES;
      }
    } catch (err) {
      console.warn('الرجوع إلى المخزن المؤقت للأنشطة:', err);
    }
  }

  // Local fallback when Supabase data is not yet available
  if (list.length === 0) {
    try {
      const local = safeStorage.getItem(STORAGE_KEYS.RESOURCES_OVERRIDE);
      if (local) {
        list = JSON.parse(local);
      }
    } catch (e) {
      console.error(e);
    }
    if (list.length === 0) {
      list = INITIAL_RESOURCES;
    }
  }

  // For public users (children/parents): strictly filter only approved, published, safety-reviewed resources
  if (!forAdmin) {
    return list.filter(isResourcePubliclySafe);
  }

  return list;
}

export async function getAllResourcesForAdmin(): Promise<EducationalResource[]> {
  return getResources(true);
}

export async function saveResource(resource: EducationalResource): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const {
      additional_categories,
      age_evidence_date,
      age_evidence_source,
      privacy_policy_url,
      supported_platforms,
      has_in_app_ads,
      has_in_app_purchases,
      last_verified_at,
      ...baseColumns
    } = resource;

    const notes = [...(baseColumns.accessibility_notes || [])];
    if (additional_categories && additional_categories.length > 0) {
      const extraTags = additional_categories.map((c) => `extra_category:${c}`);
      baseColumns.accessibility_notes = [
        ...notes.filter((n) => typeof n === 'string' && !n.startsWith('extra_category:')),
        ...extraTags,
      ];
    }
    if (supported_platforms && supported_platforms.length > 0) {
      baseColumns.accessibility_notes.push(`platforms:${JSON.stringify(supported_platforms)}`);
    }

    const { error } = await supabase
      .from('educational_resources')
      .upsert(baseColumns);
    if (error) {
      console.warn('تنبيه في حفظ المورد في Supabase (استخدام المخزن المحلي كبديل):', error.message);
    }
  }

  // Synchronize local cache
  const current = await getResources(true);
  const index = current.findIndex((r) => r.id === resource.id);
  let updated: EducationalResource[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...resource, updated_at: new Date().toISOString() };
  } else {
    updated = [{ ...resource, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, ...current];
  }
  safeStorage.setItem(STORAGE_KEYS.RESOURCES_OVERRIDE, JSON.stringify(updated));
  await recordAuditLog('حفظ أو تعديل نشاط', 'educational_resources', resource.id, { title: resource.title_ar });
}

export async function deleteResource(resourceId: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('educational_resources').delete().eq('id', resourceId);
    if (error) {
      console.warn('تنبيه في حذف المورد من Supabase:', error.message);
    }
  }

  const current = await getResources(true);
  const updated = current.filter((r) => r.id !== resourceId);
  safeStorage.setItem(STORAGE_KEYS.RESOURCES_OVERRIDE, JSON.stringify(updated));
  await recordAuditLog('حذف نشاط تعليمي', 'educational_resources', resourceId, {});
}

// ============================================================================
// 2. Categories Data Access Layer
// ============================================================================
export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (err) {
      console.warn('الرجوع إلى المخزن المحلي للتصنيفات:', err);
    }
  }

  try {
    const local = safeStorage.getItem(STORAGE_KEYS.CATEGORIES_OVERRIDE);
    if (local) return JSON.parse(local);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CATEGORIES;
}

// ============================================================================
// 3. Trusted Sources Layer
// ============================================================================
export async function getTrustedSources(): Promise<TrustedSource[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('trusted_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as TrustedSource[];
      }
    } catch (err) {
      console.warn('الرجوع إلى المصادر المحلية:', err);
    }
  }

  try {
    const local = safeStorage.getItem(STORAGE_KEYS.SOURCES_OVERRIDE);
    if (local) return JSON.parse(local);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_TRUSTED_SOURCES;
}

export async function updateTrustedSource(source: TrustedSource): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('trusted_sources').upsert(source);
    if (error) {
      console.warn('تنبيه في تحديث المصدر في Supabase:', error.message);
    }
  }

  const current = await getTrustedSources();
  const updated = current.map((s) => (s.id === source.id ? source : s));
  safeStorage.setItem(STORAGE_KEYS.SOURCES_OVERRIDE, JSON.stringify(updated));
  await recordAuditLog('تحديث بيانات مصدر موثوق', 'trusted_sources', source.id, { name: source.name });
}

// ============================================================================
// 4. Import Candidates Layer
// ============================================================================
export async function getCandidates(): Promise<ImportCandidate[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('import_candidates')
        .select('*')
        .order('discovered_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ImportCandidate[];
      }
    } catch (err) {
      console.warn('الرجوع إلى المرشحين المحليين:', err);
    }
  }

  try {
    const local = safeStorage.getItem(STORAGE_KEYS.CANDIDATES_OVERRIDE);
    if (local) return JSON.parse(local);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CANDIDATES;
}

export async function approveCandidate(candidateId: string, overrides?: Partial<EducationalResource>): Promise<void> {
  const candidates = await getCandidates();
  const target = candidates.find((c) => c.id === candidateId);
  if (!target) return;

  const newResource: EducationalResource = {
    id: `res-${Date.now()}`,
    slug: (target.title_en || target.title_ar).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `resource-${Date.now()}`,
    title_ar: target.title_ar,
    title_en: target.title_en,
    description_ar: target.description_ar || 'نشاط تعليمي مراجع بعناية من مصادر موثوقة.',
    age_min: target.suggested_age_min || 3,
    age_max: target.suggested_age_max || 6,
    category_id: target.suggested_category_id || 'cat-external-apps',
    content_type: 'external_app',
    launch_type: 'external_tab',
    launch_url: target.candidate_url,
    thumbnail_url: target.thumbnail_url || '/src/assets/images/parent_corner_guide_1791871144873.jpg',
    provider_name: target.provider_name,
    source_url: target.candidate_url,
    source_type: 'manual_review',
    language: 'ar',
    is_free: true,
    learning_objectives: ['تعلم تفاعلي هادف', 'تنمية مهارات التفكير والاستكشاف'],
    estimated_duration_minutes: 10,
    accessibility_notes: ['تم فحص الرابط والتحقق من أمان المحتوى'],
    licensing_status: 'verified_open_license',
    review_status: 'approved',
    safety_reviewed_at: new Date().toISOString(),
    is_featured: false,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };

  await saveResource(newResource);

  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('import_candidates')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', candidateId);
    if (error) {
      console.warn('تحديث حالة المرشح في Supabase:', error.message);
    }
  }

  const updatedCandidates = candidates.map((c) =>
    c.id === candidateId ? { ...c, status: 'approved' as const, reviewed_at: new Date().toISOString() } : c
  );
  safeStorage.setItem(STORAGE_KEYS.CANDIDATES_OVERRIDE, JSON.stringify(updatedCandidates));
  await recordAuditLog('اعتماد مورد تعليمي جديد من الاستيراد', 'import_candidates', candidateId, { title: target.title_ar });
}

export async function rejectCandidate(candidateId: string, reason: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('import_candidates')
      .update({ status: 'rejected', rejection_reason: reason, reviewed_at: new Date().toISOString() })
      .eq('id', candidateId);
    if (error) {
      console.warn('تسجيل رفض المرشح في Supabase:', error.message);
    }
  }

  const candidates = await getCandidates();
  const updatedCandidates = candidates.map((c) =>
    c.id === candidateId ? { ...c, status: 'rejected' as const, rejection_reason: reason, reviewed_at: new Date().toISOString() } : c
  );
  safeStorage.setItem(STORAGE_KEYS.CANDIDATES_OVERRIDE, JSON.stringify(updatedCandidates));
  await recordAuditLog('رفض مورد مرشح', 'import_candidates', candidateId, { reason });
}

// Ingestion Pipeline Simulator / Manual Trigger: Delegates to unified SyncEngine
export async function runSourceSync(
  sourceId: string,
  adminEmail?: string
): Promise<{ success: boolean; itemsFound: number; itemsAdded: number; summary?: string }> {
  const result = await executeSyncForSource(sourceId, adminEmail);
  return {
    success: result.status === 'success',
    itemsFound: result.itemsFound,
    itemsAdded: result.itemsImported,
    summary: result.errorMessage,
  };
}

export {
  executeSyncForSource,
  executeSyncAllActiveSources,
  getSyncRuns,
};

export {
  AGE_BRACKETS,
  matchesAgeBracket,
  getMatchingAgeBrackets,
} from './sync/classifier';

// ============================================================================
// 5. Admin Audit Logs Layer
// ============================================================================
function getDefaultAdminEmail(): string {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_ADMIN_EMAIL) {
      return (import.meta as any).env.VITE_ADMIN_EMAIL.replace(/^["']|["']$/g, '').trim();
    }
  } catch {
    // ignore
  }
  if (typeof process !== 'undefined' && process.env?.VITE_ADMIN_EMAIL) {
    return process.env.VITE_ADMIN_EMAIL.replace(/^["']|["']$/g, '').trim();
  }
  return 'admin@littlestars.local';
}

export async function getAuditLogs(): Promise<AdminAuditLog[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        return data as AdminAuditLog[];
      }
    } catch (err) {
      console.warn('الرجوع إلى سجل التدقيق المحلي:', err);
    }
  }

  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [
      {
        id: 'log-001',
        admin_email: getDefaultAdminEmail(),
        action: 'تهيئة النظام والبيانات الأساسية',
        target_table: 'system',
        details: { status: 'initialized' },
        created_at: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
  } catch {
    return [];
  }
}

export async function recordAuditLog(
  action: string,
  table: string,
  id: string | undefined,
  details: Record<string, any>,
  overrideEmail?: string
) {
  let adminEmail = overrideEmail;
  if (!adminEmail && isSupabaseConfigured() && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        adminEmail = session.user.email;
      }
    } catch {
      // ignore
    }
  }

  const finalAdminEmail = adminEmail || getDefaultAdminEmail();

  const entry: AdminAuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    admin_email: finalAdminEmail,
    action,
    target_table: table,
    target_id: id,
    details,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('admin_audit_logs').insert(entry);
    } catch (err) {
      // Non-fatal if unprivileged
    }
  }

  const current = await getAuditLogs();
  try {
    safeStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([entry, ...current].slice(0, 50)));
  } catch (err) {
    console.error(err);
  }
}

// ============================================================================
// 6. Contact Reports Layer (With Anti-Abuse & Rate-Limiting Controls)
// ============================================================================
const REPORT_RATE_LIMIT_KEY = 'little_stars_report_timestamps';
const MAX_REPORTS_PER_WINDOW = 3;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function checkContactReportRateLimit(): { allowed: boolean; remainingWaitSeconds?: number } {
  try {
    const raw = safeStorage.getItem(REPORT_RATE_LIMIT_KEY);
    const now = Date.now();
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (validTimestamps.length >= MAX_REPORTS_PER_WINDOW) {
      const oldest = Math.min(...validTimestamps);
      const remainingSeconds = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
      return { allowed: false, remainingWaitSeconds: Math.max(remainingSeconds, 1) };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

function recordContactReportSubmission() {
  try {
    const raw = safeStorage.getItem(REPORT_RATE_LIMIT_KEY);
    const now = Date.now();
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    validTimestamps.push(now);
    safeStorage.setItem(REPORT_RATE_LIMIT_KEY, JSON.stringify(validTimestamps));
  } catch {
    // ignore storage quota issues
  }
}

export async function getContactReports(): Promise<ContactReport[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ContactReport[];
      }
    } catch (err) {
      console.warn('الرجوع إلى البلاغات المحلية:', err);
    }
  }

  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function submitContactReport(
  report: Omit<ContactReport, 'id' | 'status' | 'created_at'>
): Promise<{ success: boolean; message?: string }> {
  // Input validations & anti-abuse checks
  const trimmedMessage = (report.message || '').trim();
  if (trimmedMessage.length < 5) {
    throw new Error('يرجى كتابة رسالة واضحة لا تقل عن 5 أحرف.');
  }
  if (trimmedMessage.length > 2000) {
    throw new Error('الرسالة طويلة جداً. الحد الأقصى المسموح به هو 2000 حرف.');
  }

  // Rate-limiting check
  const rateLimit = checkContactReportRateLimit();
  if (!rateLimit.allowed) {
    throw new Error(
      `تم استلام عدة بلاغات مؤخراً. للحماية من الإرسال المتكرر، يرجى الانتظار ${rateLimit.remainingWaitSeconds} ثانية قبل إرسال بلاغ جديد.`
    );
  }

  const newReport: ContactReport = {
    ...report,
    parent_name: (report.parent_name || '').trim().slice(0, 100),
    parent_email: (report.parent_email || '').trim().slice(0, 120),
    message: trimmedMessage,
    id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: 'new', // Strictly forced to 'new'
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('contact_reports').insert(newReport);
      if (error) {
        console.error('خطأ في إرسال البلاغ إلى Supabase:', error);
      }
    } catch (err: any) {
      console.error('استثناء عند إرسال البلاغ إلى Supabase:', err);
    }
  }

  const current = await getContactReports();
  safeStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([newReport, ...current]));
  recordContactReportSubmission();

  return { success: true };
}

export async function updateReportStatus(reportId: string, status: 'new' | 'reviewed' | 'resolved'): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('contact_reports').update({ status }).eq('id', reportId);
    if (error) {
      console.warn('تحديث حالة البلاغ في Supabase:', error.message);
    }
  }

  const current = await getContactReports();
  const updated = current.map((r) => (r.id === reportId ? { ...r, status } : r));
  safeStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
}

// Re-export Content Gap Analyzer tools
export {
  analyzeContentGaps,
  fillContentGaps,
  getGapTargetThreshold,
  setGapTargetThreshold,
  CATEGORY_SOURCE_MAPPING,
} from './sync/gapAnalyzer';
