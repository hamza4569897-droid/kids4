import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, getSupabaseConfig, testSupabaseConnection, checkIsAdminFromDatabase } from '../../lib/supabase';
import {
  getResources,
  getAllResourcesForAdmin,
  saveResource,
  deleteResource,
  getCategories,
  getTrustedSources,
  updateTrustedSource,
  getCandidates,
  approveCandidate,
  rejectCandidate,
  runSourceSync,
  executeSyncForSource,
  executeSyncAllActiveSources,
  getSyncRuns,
  getAuditLogs,
  getContactReports,
  updateReportStatus,
  sanitizeLaunchUrl,
  AGE_BRACKETS,
  safeStorage,
} from '../../lib/storage';
import {
  EducationalResource,
  Category,
  TrustedSource,
  ImportCandidate,
  SyncRun,
  AdminAuditLog,
  ContactReport,
  ContentReview,
  ReviewModerationStatus,
  ContentReviewType,
} from '../../types/database';
import {
  getAllReviewsForAdmin,
  updateReviewStatus,
  deleteReview,
} from '../../lib/comments';
import {
  ShieldCheck,
  ShieldAlert,
  LogOut,
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Globe,
  Inbox,
  AlertCircle,
  FileClock,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  Copy,
  CheckCheck,
  ArrowRight,
  Database,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Play,
  RotateCw,
  CheckCircle,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Target,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Star,
  Flag,
  Search,
} from 'lucide-react';
import {
  analyzeContentGaps,
  fillContentGaps,
  getGapTargetThreshold,
  setGapTargetThreshold,
  CATEGORY_SOURCE_MAPPING,
} from '../../lib/sync/gapAnalyzer';
import {
  ContentGapReport,
  GapFillResult,
  GapMatrixEntry,
} from '../../types/database';
import { sounds } from '../../lib/audio';

interface AdminPortalProps {
  onExit: () => void;
  onAdminAuthChange?: (isAdmin: boolean) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExit, onAdminAuthChange }) => {
  // Auth state
  const [session, setSession] = useState<{ email: string; userId?: string } | null>(null);
  const [unauthorizedUser, setUnauthorizedUser] = useState<{ email: string; userId?: string } | null>(null);
  const [isVerifyingSession, setIsVerifyingSession] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Admin Views
  const [activeTab, setActiveTab] = useState<
    'overview' | 'educational_apps' | 'gap_analyzer' | 'activities' | 'categories' | 'sources' | 'candidates' | 'reports' | 'audit' | 'settings' | 'comments'
  >('overview');

  // Sub-tabs for the dedicated Educational Apps section
  const [appsSubTab, setAppsSubTab] = useState<'published' | 'pending' | 'rejected' | 'sources' | 'sync_runs'>('published');
  const [diffCandidate, setDiffCandidate] = useState<ImportCandidate | null>(null);

  // Reviews & Comments Management States
  const [adminReviews, setAdminReviews] = useState<ContentReview[]>([]);
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'all' | ReviewModerationStatus | 'flagged'>('pending');
  const [reviewTypeFilter, setReviewTypeFilter] = useState<'all' | ContentReviewType>('all');
  const [reviewSearchQuery, setReviewSearchQuery] = useState<string>('');
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);
  const [deleteReviewConfirmId, setDeleteReviewConfirmId] = useState<string | null>(null);

  // Content Gap Analyzer States
  const [gapReport, setGapReport] = useState<ContentGapReport | null>(null);
  const [isGapLoading, setIsGapLoading] = useState<boolean>(false);
  const [gapTargetThresholdInput, setGapTargetThresholdInput] = useState<number>(getGapTargetThreshold());
  const [gapFilterBracket, setGapFilterBracket] = useState<string>('all');
  const [gapFilterStatus, setGapFilterStatus] = useState<'all' | 'empty' | 'low' | 'sufficient'>('all');
  const [isGapFilling, setIsGapFilling] = useState<boolean>(false);
  const [gapFillOutcome, setGapFillOutcome] = useState<GapFillResult | null>(null);
  const [syncingSourceId, setSyncingSourceId] = useState<string | null>(null);

  // Data states
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<TrustedSource[]>([]);
  const [candidates, setCandidates] = useState<ImportCandidate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [reports, setReports] = useState<ContactReport[]>([]);
  const [syncRuns, setSyncRuns] = useState<SyncRun[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Sync & Candidates filter state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string>('');
  const [candidateStatusFilter, setCandidateStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Activity Edit/Create Modal state
  const [editingResource, setEditingResource] = useState<EducationalResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Source Edit/Create Modal state
  const [editingSource, setEditingSource] = useState<TrustedSource | null>(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);

  // Candidate Review & Reject Modal state
  const [reviewingCandidate, setReviewingCandidate] = useState<ImportCandidate | null>(null);
  const [candidateRejectId, setCandidateRejectId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');

  // Supabase Connection testing state
  const [connectionTestResult, setConnectionTestResult] = useState<{
    connected: boolean;
    message: string;
    authWorking: boolean;
    rpcWorking: boolean;
    categoriesAccessible: boolean;
    details?: Record<string, any>;
  } | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);
    sounds.playPop();
    const res = await testSupabaseConnection();
    setConnectionTestResult(res);
    setIsTestingConnection(false);
    if (res.connected) {
      sounds.playChime();
    } else {
      sounds.playTryAgain();
    }
  };

  // Check Supabase session on mount and verify admin role from database RPC
  useEffect(() => {
    let isMounted = true;

    const verifyExistingAuth = async () => {
      setIsVerifyingSession(true);

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session: existingSession } } = await supabase.auth.getSession();
          if (existingSession?.user) {
            // Strictly verify against PostgreSQL public.is_admin()
            const adminCheck = await checkIsAdminFromDatabase();
            if (isMounted) {
              if (adminCheck.isAdmin) {
                setSession({
                  email: existingSession.user.email || '',
                  userId: existingSession.user.id,
                });
                setUnauthorizedUser(null);
                if (onAdminAuthChange) onAdminAuthChange(true);
              } else {
                // User is authenticated in Supabase but not in admin_allowlist
                setSession(null);
                setUnauthorizedUser({
                  email: existingSession.user.email || '',
                  userId: existingSession.user.id,
                });
                if (onAdminAuthChange) onAdminAuthChange(false);
              }
            }
          } else {
            if (isMounted) {
              setSession(null);
              setUnauthorizedUser(null);
              if (onAdminAuthChange) onAdminAuthChange(false);
            }
          }
        } catch (err) {
          console.error('فشل في فحص الجلسة:', err);
          if (isMounted) {
            setSession(null);
            setUnauthorizedUser(null);
            if (onAdminAuthChange) onAdminAuthChange(false);
          }
        }
      } else {
        if (isMounted) {
          setSession(null);
          setUnauthorizedUser(null);
          if (onAdminAuthChange) onAdminAuthChange(false);
        }
      }
      if (isMounted) setIsVerifyingSession(false);
    };

    verifyExistingAuth();

    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (event === 'SIGNED_OUT' || !newSession?.user) {
          if (isMounted) {
            setSession(null);
            setUnauthorizedUser(null);
            if (onAdminAuthChange) onAdminAuthChange(false);
          }
        }
      });
      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }
  }, []);

  const loadReviewsData = async () => {
    setIsLoadingReviews(true);
    try {
      const revs = await getAllReviewsForAdmin(reviewStatusFilter, reviewTypeFilter);
      setAdminReviews(revs);
    } catch (err) {
      console.error('Failed to load reviews for admin:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadReviewsData();
    }
  }, [session, reviewStatusFilter, reviewTypeFilter]);

  const handleUpdateReviewStatus = async (reviewId: string, newStatus: ReviewModerationStatus) => {
    sounds.playPop();
    const res = await updateReviewStatus(reviewId, newStatus);
    if (res.success) {
      sounds.playChime();
      setOperationNotice({
        type: 'success',
        message: newStatus === 'approved' ? 'تم اعتماد ونشر التعليق بنجاح للعامة.' : 'تم تعديل حالة التعليق بنجاح.',
      });
      await loadReviewsData();
    } else {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: res.error || 'فشل تحديث حالة التعليق.' });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    sounds.playPop();
    const res = await deleteReview(reviewId);
    if (res.success) {
      sounds.playChime();
      setOperationNotice({ type: 'success', message: 'تم حذف التعليق نهائياً من قاعدة البيانات.' });
      await loadReviewsData();
    } else {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: res.error || 'فشل حذف التعليق.' });
    }
  };

  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const [res, cats, srcs, cands, logs, reps, runs, revs] = await Promise.all([
        getAllResourcesForAdmin(),
        getCategories(),
        getTrustedSources(),
        getCandidates(),
        getAuditLogs(),
        getContactReports(),
        getSyncRuns(),
        getAllReviewsForAdmin(reviewStatusFilter, reviewTypeFilter),
      ]);
      setResources(res);
      setCategories(cats);
      setSources(srcs);
      setCandidates(cands);
      setAuditLogs(logs);
      setReports(reps);
      setSyncRuns(runs);
      setAdminReviews(revs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadGapAnalysisData = async () => {
    setIsGapLoading(true);
    try {
      const rep = await analyzeContentGaps(gapTargetThresholdInput);
      setGapReport(rep);
    } catch (e) {
      console.error('Failed to load gap analysis:', e);
    } finally {
      setIsGapLoading(false);
    }
  };

  const handleSaveThreshold = async () => {
    sounds.playPop();
    setGapTargetThreshold(gapTargetThresholdInput);
    await loadGapAnalysisData();
    setOperationNotice({
      type: 'success',
      message: `تم تحديث الحد الأدنى المستهدف للموارد إلى (${gapTargetThresholdInput}) لكل فئة عمرية ومجال بنجاح.`,
    });
  };

  const handleRunGlobalGapFill = async () => {
    sounds.playPop();
    setIsGapFilling(true);
    setGapFillOutcome(null);
    try {
      const outcome = await fillContentGaps({
        targetThreshold: gapTargetThresholdInput,
        adminEmail: session?.email,
      });
      setGapFillOutcome(outcome);
      sounds.playChime();
      setOperationNotice({
        type: 'success',
        message: `اكتمل فحص وسد الفجوات: تم العثور على ${outcome.itemsFound}، نُشر ${outcome.itemsImported} جديد، وتحسنت ${outcome.improvedGapsCount} فئة!`,
      });
      await loadAllData();
      await loadGapAnalysisData();
    } catch (err: any) {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: err.message || 'فشلت عملية سد الفجوات' });
    } finally {
      setIsGapFilling(false);
    }
  };

  const handleTargetedGapFill = async (categoryId?: string, ageBracketId?: string) => {
    sounds.playPop();
    setIsGapFilling(true);
    setGapFillOutcome(null);
    try {
      const outcome = await fillContentGaps({
        targetCategoryId: categoryId,
        targetAgeBracketId: ageBracketId,
        targetThreshold: gapTargetThresholdInput,
        adminEmail: session?.email,
      });
      setGapFillOutcome(outcome);
      sounds.playChime();
      setOperationNotice({
        type: 'success',
        message: `تم تشغيل البحث المخصص: ${outcome.itemsImported} تطبيق معتمد ومستورد، وتحسنت ${outcome.improvedGapsCount} فئة.`,
      });
      await loadAllData();
      await loadGapAnalysisData();
    } catch (err: any) {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: err.message || 'فشل البحث المخصص' });
    } finally {
      setIsGapFilling(false);
    }
  };

  const handleSyncSingleSource = async (sourceId: string) => {
    sounds.playPop();
    setSyncingSourceId(sourceId);
    try {
      const res = await executeSyncForSource(sourceId, session?.email);
      sounds.playChime();
      setOperationNotice({
        type: 'success',
        message: `تمت مزامنة (${res.sourceName}) بنجاح: ${res.itemsImported} جديد، ${res.itemsDuplicatesIgnored} مكرر تم تجاهله.`,
      });
      await loadAllData();
      await loadGapAnalysisData();
    } catch (err: any) {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: err.message || 'فشلت مزامنة المصدر' });
    } finally {
      setSyncingSourceId(null);
    }
  };

  useEffect(() => {
    if (session) {
      loadAllData();
      loadGapAnalysisData();
    }
  }, [session]);

  useEffect(() => {
    if (session && activeTab === 'gap_analyzer') {
      loadGapAnalysisData();
    }
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    if (!isSupabaseConfigured() || !supabase) {
      setAuthError('بيانات اتصال Supabase غير متوفرة في متغيرات البيئة. يرجى تهيئة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY.');
      setAuthLoading(false);
      return;
    }

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setAuthError('بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور.');
        } else if (error.message.includes('Email not confirmed')) {
          setAuthError('البريد الإلكتروني لم يتم تأكيده في Supabase بعد.');
        } else {
          setAuthError(`فشل تسجيل الدخول: ${error.message}`);
        }
        sounds.playTryAgain();
        setAuthLoading(false);
        return;
      }

      if (!data.user) {
        setAuthError('تعذر الحصول على معلومات المستخدم من الجلسة.');
        setAuthLoading(false);
        return;
      }

      // 2. Strictly verify admin authorization via database function public.is_admin()
      const adminCheck = await checkIsAdminFromDatabase();

      if (!adminCheck.isAdmin) {
        // Sign out immediately - user is not permitted
        await supabase.auth.signOut();
        setSession(null);
        setUnauthorizedUser({
          email: data.user.email || loginEmail,
          userId: data.user.id,
        });
        if (onAdminAuthChange) {
          onAdminAuthChange(false);
        }
        sounds.playTryAgain();
        setAuthError(
          adminCheck.error ||
          'تم تسجيل الدخول بنجاح، ولكن هذا الحساب ليس لديه صلاحية أدمن في قاعدة البيانات (تم رفض الإذن بواسطة دالة is_admin). يرجى التأكد من إضافة user_id الخاص بحسابك في جدول admin_allowlist.'
        );
        setAuthLoading(false);
        return;
      }

      // 3. User is verified by database as admin
      const adminSession = {
        email: data.user.email || loginEmail,
        userId: data.user.id,
      };
      setSession(adminSession);
      setUnauthorizedUser(null);
      if (onAdminAuthChange) {
        onAdminAuthChange(true);
      }
      setAuthError('');
      sounds.playChime();
    } catch (err: any) {
      setAuthError(err.message || 'حدث خطأ غير متوقع أثناء تسجيل الدخول.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    sounds.playPop();
    safeStorage.removeItem('little_stars_admin_session');
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    setSession(null);
    setUnauthorizedUser(null);
    if (onAdminAuthChange) {
      onAdminAuthChange(false);
    }
    onExit();
  };

  const handleTriggerSync = async (sourceId: string) => {
    setIsSyncing(true);
    setSyncFeedback('جاري فحص المصدر، وتدقيق النطاقات المسموحة وشهادات الأمان...');
    try {
      const res = await runSourceSync(sourceId, session?.email);
      sounds.playChime();
      setSyncFeedback(`اكتملت المزامنة بنجاح! تم فحص ${res.itemsFound} تطبيق واستيراد/تحديث ${res.itemsAdded}.`);
      setOperationNotice({
        type: 'success',
        message: res.summary || 'اكتملت مزامنة المصدر بنجاح!',
      });
      await loadAllData();
    } catch (err: any) {
      sounds.playTryAgain();
      setSyncFeedback(`فشلت المزامنة: ${err.message}`);
      setOperationNotice({ type: 'error', message: `فشلت المزامنة: ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncAllSources = async () => {
    setIsSyncing(true);
    setSyncFeedback('جاري تشغيل المزامنة لجميع المصادر المعتمدة والنشطة...');
    try {
      const results = await executeSyncAllActiveSources(session?.email);
      sounds.playChime();
      const totalFound = results.reduce((acc, r) => acc + r.itemsFound, 0);
      const totalImported = results.reduce((acc, r) => acc + r.itemsImported, 0);
      const totalFlagged = results.reduce((acc, r) => acc + r.itemsFlaggedForReview, 0);
      setSyncFeedback(`اكتملت المزامنة لجميع المصادر! فحص ${totalFound} تطبيق، استيراد ${totalImported}، وإحالة ${totalFlagged} للمراجعة.`);
      setOperationNotice({
        type: 'success',
        message: `تمت مزامنة جميع المصادر بنجاح! فحص ${totalFound} تطبيق (${totalImported} نُشر تلقائياً، ${totalFlagged} أُحيل للمراجعة).`,
      });
      await loadAllData();
    } catch (err: any) {
      sounds.playTryAgain();
      setSyncFeedback(`فشلت المزامنة الشاملة: ${err.message}`);
      setOperationNotice({ type: 'error', message: `فشلت المزامنة الشاملة: ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSource) return;
    try {
      await updateTrustedSource(editingSource);
      sounds.playChime();
      setOperationNotice({ type: 'success', message: 'تم حفظ وتحديث بيانات المصدر الموثوق بنجاح.' });
      setIsSourceModalOpen(false);
      setEditingSource(null);
      await loadAllData();
    } catch (err: any) {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: err.message || 'فشل حفظ المصدر' });
    }
  };

  const handleToggleSourceActive = async (source: TrustedSource) => {
    try {
      const updated: TrustedSource = {
        ...source,
        is_active: !source.is_active,
        updated_at: new Date().toISOString(),
      };
      await updateTrustedSource(updated);
      sounds.playPop();
      setOperationNotice({
        type: 'success',
        message: updated.is_active ? `تم تفعيل المصدر (${source.name})` : `تم تعطيل المصدر (${source.name})`,
      });
      await loadAllData();
    } catch (err: any) {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: err.message || 'فشل تعديل حالة المصدر' });
    }
  };

  const [operationNotice, setOperationNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;
    setOperationNotice(null);

    // Validate URL
    if (editingResource.launch_url) {
      const sanitized = sanitizeLaunchUrl(editingResource.launch_url);
      if (!sanitized.safe) {
        setOperationNotice({ type: 'error', message: sanitized.reason || 'الرابط غير آمن' });
        sounds.playTryAgain();
        return;
      }
    }

    try {
      await saveResource(editingResource);
      sounds.playChime();
      setIsModalOpen(false);
      setEditingResource(null);
      setOperationNotice({ type: 'success', message: 'تم حفظ النشاط التعليمي بنجاح!' });
      await loadAllData();
    } catch (err: any) {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: `تعذر حفظ النشاط: ${err.message || 'خطأ غير معروف'}` });
    }
  };

  const handleDeleteActivity = async (id: string) => {
    setOperationNotice(null);
    try {
      await deleteResource(id);
      sounds.playPop();
      setDeleteConfirmId(null);
      setOperationNotice({ type: 'success', message: 'تم حذف النشاط بنجاح.' });
      await loadAllData();
    } catch (err: any) {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: `تعذر حذف النشاط: ${err.message || 'خطأ غير معروف'}` });
    }
  };

  const handleApproveCandidate = async (candidateId: string) => {
    setOperationNotice(null);
    try {
      await approveCandidate(candidateId);
      sounds.playChime();
      setOperationNotice({ type: 'success', message: 'تم اعتماد المرشح ونشره في المنصة بنجاح!' });
      await loadAllData();
    } catch (err: any) {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: `تعذر اعتماد المرشح: ${err.message || 'خطأ غير معروف'}` });
    }
  };

  const handleApproveCandidateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingCandidate) return;
    try {
      await approveCandidate(reviewingCandidate.id, {
        title_ar: reviewingCandidate.title_ar,
        title_en: reviewingCandidate.title_en,
        description_ar: reviewingCandidate.description_ar,
        age_min: reviewingCandidate.suggested_age_min,
        age_max: reviewingCandidate.suggested_age_max,
        category_id: reviewingCandidate.suggested_category_id,
        additional_categories: reviewingCandidate.suggested_additional_categories,
      });
      sounds.playChime();
      setOperationNotice({ type: 'success', message: 'تم اعتماد ونشر المورد بالخصائص المخصصة بنجاح!' });
      setReviewingCandidate(null);
      await loadAllData();
    } catch (err: any) {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: err.message || 'فشل اعتماد المورد' });
    }
  };

  const handleConfirmRejectCandidate = async () => {
    if (!candidateRejectId) return;
    try {
      await rejectCandidate(
        candidateRejectId,
        rejectionReasonInput || 'المحتوى أو الفئة العمرية غير متوافقة مع معايير المنصة.'
      );
      sounds.playPop();
      setOperationNotice({ type: 'success', message: 'تم تسجيل رفض المورد وتوثيق السبب.' });
      setCandidateRejectId(null);
      setRejectionReasonInput('');
      await loadAllData();
    } catch (err: any) {
      sounds.playTryAgain();
      setOperationNotice({ type: 'error', message: `تعذر رفض المرشح: ${err.message || 'خطأ غير معروف'}` });
    }
  };

  // --------------------------------------------------------------------------
  // LOGIN SCREEN & SESSION VERIFICATION
  // --------------------------------------------------------------------------
  if (isVerifyingSession) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-300 border-t-amber-500 animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-500">جاري التحقق من جلسة المشرف وصلاحيات قاعدة البيانات...</p>
      </div>
    );
  }

  if (unauthorizedUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-rose-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-rose-950">غير مصرح لك بالوصول</h1>
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 leading-relaxed text-right space-y-2">
            <p className="font-bold">الحساب الحالي ليس لديه صلاحيات إدارية:</p>
            <p className="text-slate-700 font-mono text-[11px] bg-white p-2.5 rounded-xl border border-rose-200 truncate">
              {unauthorizedUser.email}
            </p>
            <p className="text-slate-600 leading-relaxed">
              تم التحقق من جدول المشرفين المعتمدين (admin_allowlist) ودالة قاعدة البيانات (public.is_admin()) ولم يتم منح هذا الحساب الصلاحية الإدارية.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={onExit}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-2xl text-sm transition shadow-sm cursor-pointer"
            >
              ← العودة إلى واجهة الطفل الرئيسية
            </button>
            <button
              type="button"
              onClick={async () => {
                if (isSupabaseConfigured() && supabase) {
                  await supabase.auth.signOut().catch(() => {});
                }
                setUnauthorizedUser(null);
                setSession(null);
                if (onAdminAuthChange) onAdminAuthChange(false);
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition cursor-pointer"
            >
              تسجيل الخروج والدخول بحساب آخر
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    const config = getSupabaseConfig();
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-amber-200 shadow-xl space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-amber-950">بوابة الإدارة الآمنة</h1>
            <p className="text-xs text-slate-500 mt-1">
              تسجيل دخول المشرف المعتمد لإدارة المناهج والأنشطة والمصادر
            </p>
          </div>

          {!config.isConfigured && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-700" />
                <span>تنبيه: قاعدة البيانات غير مهيأة</span>
              </span>
              <p className="text-slate-600 leading-relaxed">
                يرجى ضبط بيانات اتصال Supabase في متغيرات البيئة قبل محاولة تسجيل الدخول.
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                البريد الإلكتروني للمشرف:
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 pl-10 rounded-2xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة المرور:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-10 rounded-2xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold leading-relaxed">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-2xl text-sm transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {authLoading ? 'جاري التحقق من الصلاحيات...' : 'دخول المشرف'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onExit}
              className="text-xs font-bold text-slate-500 hover:text-amber-800 transition cursor-pointer"
            >
              ← العودة إلى واجهة الطفل الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ADMIN DASHBOARD SHELL
  // --------------------------------------------------------------------------
  const pendingCandidatesCount = candidates.filter((c) => c.status === 'pending').length;
  const newReportsCount = reports.filter((r) => r.status === 'new').length;
  const pendingReviewsCount = adminReviews.filter((r) => r.status === 'pending').length;
  const flaggedReviewsCount = adminReviews.filter((r) => r.is_flagged).length;

  return (
    <div className="space-y-8">
      {/* Admin Top Bar */}
      <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-amber-950">لوحة تحكم المشرف — Little Stars</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>المشرف الحالي: {session.email}</span>
              <span aria-hidden="true">·</span>
              <span
                className={`font-bold ${
                  isSupabaseConfigured() ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {isSupabaseConfigured() ? 'Supabase متصل' : 'وضع المعاينة المحلي'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            مشاهدة واجهة المنصة
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Operation Feedback Banner */}
      {operationNotice && (
        <div
          role="alert"
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 transition ${
            operationNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {operationNotice.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{operationNotice.message}</span>
          </div>
          <button
            onClick={() => setOperationNotice(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
            title="إغلاق التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-amber-200 pb-3">
        {[
          { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
          { id: 'comments', label: `التعليقات والتقييمات (${pendingReviewsCount})`, icon: MessageSquare, badgeColor: pendingReviewsCount > 0 ? 'bg-amber-500 text-white' : undefined },
          { id: 'educational_apps', label: 'إدارة التطبيقات التعليمية ⭐', icon: Sparkles },
          { id: 'gap_analyzer', label: 'مصادر ومناطق النقص 🎯', icon: Target },
          { id: 'activities', label: `إدارة الأنشطة (${resources.length})`, icon: BookOpen },
          { id: 'candidates', label: `مرشحو الاستيراد (${pendingCandidatesCount})`, icon: Inbox },
          { id: 'sources', label: 'المصادر الموثوقة', icon: Globe },
          { id: 'categories', label: 'المجالات التعليمية', icon: FolderTree },
          { id: 'reports', label: `البلاغات والتقارير (${newReportsCount})`, icon: AlertCircle },
          { id: 'audit', label: 'سجل العمليات (Audit)', icon: FileClock },
          { id: 'settings', label: 'إعدادات وقاعدة البيانات', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playPop();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                isActive
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي الأنشطة المعتمدة</span>
              <span className="text-3xl font-black text-amber-950 tabular-nums">{resources.length}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block mb-1">الموارد المنشورة</span>
              <span className="text-3xl font-black text-emerald-600 tabular-nums">
                {resources.filter((r) => r.review_status === 'approved').length}
              </span>
            </div>
            <div
              onClick={() => {
                sounds.playPop();
                setActiveTab('comments');
              }}
              className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs cursor-pointer hover:border-amber-400 transition"
            >
              <span className="text-xs font-bold text-slate-500 block mb-1">تعليقات بانتظار الاعتماد</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-amber-600 tabular-nums">{pendingReviewsCount}</span>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">إدارة ←</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block mb-1">مرشحو الاستيراد</span>
              <span className="text-3xl font-black text-amber-600 tabular-nums">{pendingCandidatesCount}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block mb-1">تقارير وبلاغات جديدة</span>
              <span className="text-3xl font-black text-rose-600 tabular-nums">{newReportsCount}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block mb-1">أوراق العمل والاختبارات</span>
              <span className="text-3xl font-black text-purple-600 tabular-nums">١٢٠</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">تكرار ٠٪ · ٤ فئات</span>
            </div>
          </div>

          {/* Quick Actions & Recent Sync */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">إجراءات إدارية سريعة</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setEditingResource({
                      id: `act-${Date.now()}`,
                      title_ar: '',
                      title_en: '',
                      slug: '',
                      description_ar: '',
                      age_min: 3,
                      age_max: 5,
                      category_id: categories[0]?.id || 'cat-arabic-alphabet',
                      content_type: 'game',
                      launch_type: 'builtin',
                      provider_name: 'عالم الصغار (أصيل)',
                      source_type: 'original',
                      language: 'ar',
                      is_free: true,
                      learning_objectives: ['مهارة تعليمية أولى'],
                      estimated_duration_minutes: 5,
                      accessibility_notes: ['أزرار لمس كبيرة تناسب الأطفال'],
                      licensing_status: 'original_authored',
                      review_status: 'approved',
                      is_featured: false,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    });
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة نشاط تعليمي جديد</span>
                </button>

                <button
                  onClick={() => setActiveTab('candidates')}
                  className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Inbox className="w-4 h-4" />
                  <span>مراجعة المرشحين ({pendingCandidatesCount})</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">مزامنة المصادر المعتمدة</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                يقوم محرك الاستيراد بفحص النطاقات المصرح بها (مثل Khan Academy Kids وPBS KIDS)، وتدقيق شهادات HTTPS والتأكد من خلو المحتوى من الإعلانات قبل إضافته لصف المراجعة.
              </p>
              <div className="flex items-center gap-3">
                <button
                  disabled={isSyncing}
                  onClick={() => handleTriggerSync(sources[0]?.id || 'src-khan-kids')}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'جاري الفحص...' : 'تشغيل المزامنة الآن'}</span>
                </button>
              </div>
              {syncFeedback && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl">
                  {syncFeedback}
                </p>
              )}
            </div>
          </div>

          {/* Sync Runs History Table */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">سجل عمليات المزامنة والاكتشاف التلقائي (Sync Runs)</h3>
                <p className="text-xs text-slate-500">سجل عمليات استيراد التطبيقات ومراقبة الأخطاء ومنع التكرار</p>
              </div>
              <button
                disabled={isSyncing}
                onClick={handleSyncAllSources}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>مزامنة جميع المصادر النشطة</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200">
                  <tr>
                    <th className="p-3">وقت التشغيل</th>
                    <th className="p-3">المصدر</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">المعثور عليه</th>
                    <th className="p-3">تم النشر</th>
                    <th className="p-3">للمراجعة</th>
                    <th className="p-3">الملخص / النتيجة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {syncRuns.map((run) => {
                    const src = sources.find((s) => s.id === run.source_id);
                    return (
                      <tr key={run.id} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {new Date(run.started_at).toLocaleString('ar-SA')}
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          {src?.name || run.source_id}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              run.status === 'success'
                                ? 'bg-emerald-100 text-emerald-800'
                                : run.status === 'running'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {run.status === 'success' ? 'ناجحة' : run.status === 'running' ? 'جارية' : 'فشلت'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-700">{run.items_found}</td>
                        <td className="p-3 font-bold text-emerald-600">{run.items_imported}</td>
                        <td className="p-3 font-bold text-amber-600">{run.items_flagged}</td>
                        <td className="p-3 text-slate-600 max-w-sm truncate" title={run.error_message || ''}>
                          {run.error_message || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB: CONTENT REVIEWS & RATINGS MODERATION (CHILD-SAFE) */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-100">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
                <span>إشراف تربوي آمن ومحكم بنسبة 100%</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                إدارة التعليقات والتقييمات التربوية 💬
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
                مراجعة ملاحظات أولياء الأمور والمعلمين قبل النشر العام لمنع أي إساءة أو إفشاء لمعلومات شخصية تخص الأطفال، ومتابعة البلاغات.
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                loadReviewsData();
              }}
              disabled={isLoadingReviews}
              className="px-5 py-3 bg-white text-amber-900 rounded-2xl font-bold text-xs hover:bg-amber-50 transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-amber-700 ${isLoadingReviews ? 'animate-spin' : ''}`} />
              <span>تحديث التعليقات</span>
            </button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => {
                sounds.playPop();
                setReviewStatusFilter('pending');
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                reviewStatusFilter === 'pending'
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30'
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-500">بانتظار الاعتماد</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-amber-900">
                {adminReviews.filter((r) => r.status === 'pending').length}
              </div>
              <span className="text-[11px] text-amber-700 font-medium">تحتاج قراراً للنشر</span>
            </div>

            <div
              onClick={() => {
                sounds.playPop();
                setReviewStatusFilter('approved');
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                reviewStatusFilter === 'approved'
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30'
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-500">معتمدة ومنشورة</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-900">
                {adminReviews.filter((r) => r.status === 'approved').length}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">ظاهرة للعامة الآن</span>
            </div>

            <div
              onClick={() => {
                sounds.playPop();
                setReviewStatusFilter('flagged');
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                reviewStatusFilter === 'flagged'
                  ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/30'
                  : 'bg-white border-slate-200 hover:border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-500">بلاغات من المستخدمين</span>
                <Flag className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-900">
                {adminReviews.filter((r) => r.is_flagged).length}
              </div>
              <span className="text-[11px] text-rose-700 font-medium">ملاحظات مشبوهة</span>
            </div>

            <div
              onClick={() => {
                sounds.playPop();
                setReviewStatusFilter('rejected');
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                reviewStatusFilter === 'rejected'
                  ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-500">مرفوضة / محجوبة</span>
                <X className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-2xl font-black text-slate-800">
                {adminReviews.filter((r) => r.status === 'rejected').length}
              </div>
              <span className="text-[11px] text-slate-600 font-medium">مستبعدة من النشر</span>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={reviewSearchQuery}
                  onChange={(e) => setReviewSearchQuery(e.target.value)}
                  placeholder="ابحث في نص التعليق، اسم الكاتب، أو عنوان المحتوى..."
                  className="w-full px-4 py-2.5 pr-10 rounded-2xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                {reviewSearchQuery && (
                  <button
                    onClick={() => setReviewSearchQuery('')}
                    className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    مسح
                  </button>
                )}
              </div>

              {/* Content type dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600 whitespace-nowrap">نوع المحتوى:</label>
                <select
                  value={reviewTypeFilter}
                  onChange={(e) => setReviewTypeFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-2xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden bg-white text-slate-800"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="website">⭐ تقييمات الموقع بالنجوم</option>
                  <option value="activity">الألعاب والأنشطة التعليمية</option>
                  <option value="worksheet">أوراق العمل والمتاهات</option>
                  <option value="app">التطبيقات التعليمية</option>
                  <option value="plan">الخطط التعليمية</option>
                </select>
              </div>
            </div>

            {/* Status pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 ml-2">الحالة:</span>
              {[
                { id: 'all', label: 'الكل' },
                { id: 'pending', label: 'قيد المراجعة' },
                { id: 'approved', label: 'المعتمدة' },
                { id: 'rejected', label: 'المرفوضة' },
                { id: 'flagged', label: 'المُبلّغ عنها 🚩' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => {
                    sounds.playPop();
                    setReviewStatusFilter(btn.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    reviewStatusFilter === btn.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {isLoadingReviews ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <div className="w-10 h-10 border-4 border-amber-300 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-600">جاري تحميل مصفوفة التعليقات والتقييمات...</p>
            </div>
          ) : (
            (() => {
              const filteredReviews = adminReviews.filter((rev) => {
                if (reviewStatusFilter === 'flagged' && !rev.is_flagged) return false;
                if (
                  reviewStatusFilter !== 'all' &&
                  reviewStatusFilter !== 'flagged' &&
                  rev.status !== reviewStatusFilter
                ) {
                  return false;
                }
                if (reviewTypeFilter !== 'all' && rev.content_type !== reviewTypeFilter) return false;
                if (reviewSearchQuery.trim()) {
                  const q = reviewSearchQuery.toLowerCase();
                  const matchText = (rev.comment_text || '').toLowerCase().includes(q);
                  const matchAuthor = (rev.author_name || '').toLowerCase().includes(q);
                  const matchTitle = (rev.content_title || '').toLowerCase().includes(q);
                  if (!matchText && !matchAuthor && !matchTitle) return false;
                }
                return true;
              });

              if (filteredReviews.length === 0) {
                return (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">لا توجد تعليقات تطابق هذا التصنيف</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      لم يتم العثور على أي تعليقات ضمن الفلاتر المحددة حالياً. يمكنك تغيير خيارات الفلترة أو تحديث القائمة.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-bold">
                    <span>عدد التعليقات المطابقة: {filteredReviews.length}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {filteredReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className={`bg-white rounded-3xl p-5 sm:p-6 border transition space-y-4 shadow-2xs ${
                          rev.is_flagged
                            ? 'border-rose-300 ring-2 ring-rose-300/30'
                            : rev.status === 'pending'
                            ? 'border-amber-300 bg-amber-50/20'
                            : 'border-slate-200'
                        }`}
                      >
                        {/* Flag Notice if reported */}
                        {rev.is_flagged && (
                          <div className="bg-rose-50 text-rose-900 border border-rose-200 p-3 rounded-2xl text-xs flex items-start gap-2.5">
                            <Flag className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-bold block">
                                بلاغ من مستخدم ({rev.flag_count || 1} بلاغات):
                              </span>
                              <p className="text-rose-800 leading-relaxed">
                                {rev.flag_reason || 'تم الإبلاغ عن هذا التعليق كغير لائق أو يحتوي محتوى مخالفاً للأطفال.'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Top meta row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {rev.author_name ? rev.author_name.charAt(0) : 'و'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm">{rev.author_name}</h4>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(rev.created_at).toLocaleDateString('ar-EG', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              {/* Rating display */}
                              {typeof rev.rating === 'number' && rev.rating > 0 ? (
                                <div className="flex items-center gap-1 mt-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3.5 h-3.5 ${
                                        star <= rev.rating!
                                          ? 'text-amber-400 fill-amber-400'
                                          : 'text-slate-200'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-[11px] font-bold text-amber-900 mr-1">
                                    {rev.rating} من ٥
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  بدون تقييم رقمي (ملاحظة نصية فقط)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content badge & status badge */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                              <span>
                                {rev.content_type === 'website' && '⭐ تقييم الموقع العام'}
                                {rev.content_type === 'activity' && '🎮 نشاط / لعبة'}
                                {rev.content_type === 'worksheet' && '📄 ورقة عمل'}
                                {rev.content_type === 'app' && '⭐ تطبيق تعليمي'}
                                {rev.content_type === 'plan' && '🎯 خطة تعليمية'}
                              </span>
                              <span>: {rev.content_title}</span>
                            </span>

                            {rev.status === 'approved' && (
                              <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>معتمد ومنشور</span>
                              </span>
                            )}
                            {rev.status === 'pending' && (
                              <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span>قيد المراجعة</span>
                              </span>
                            )}
                            {rev.status === 'rejected' && (
                              <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
                                <X className="w-3 h-3 text-slate-500" />
                                <span>مرفوض</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Comment text body */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                          {rev.comment_text}
                        </div>

                        {/* Actions bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <span className="text-[10px] text-slate-400 font-mono">
                            المعرف: {rev.content_id}
                          </span>

                          <div className="flex flex-wrap items-center gap-2">
                            {rev.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateReviewStatus(rev.id, 'approved')}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>اعتماد ونشر للعامة</span>
                              </button>
                            )}

                            {rev.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateReviewStatus(rev.id, 'rejected')}
                                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>رفض التعليق</span>
                              </button>
                            )}

                            {rev.status !== 'pending' && (
                              <button
                                onClick={() => handleUpdateReviewStatus(rev.id, 'pending')}
                                className="px-3 py-1.5 text-amber-700 hover:bg-amber-50 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCw className="w-3 h-3" />
                                <span>إعادة لقيد المراجعة</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                sounds.playPop();
                                setDeleteReviewConfirmId(rev.id);
                              }}
                              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف نهائي</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          )}

          {/* Delete Review Confirmation Dialog */}
          {deleteReviewConfirmId && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-200 shadow-2xl space-y-4 text-center">
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Trash2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900">حذف التعليق نهائياً؟</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  هل أنت متأكد من رغبتك في حذف هذا التعليق نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذه العملية بعد إتمامها.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setDeleteReviewConfirmId(null);
                    }}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => {
                      const idToDelete = deleteReviewConfirmId;
                      setDeleteReviewConfirmId(null);
                      handleDeleteReview(idToDelete);
                    }}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    نعم، حذف نهائي
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB: EDUCATIONAL APPS MANAGEMENT (REQUIREMENT 8) */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'educational_apps' && (
        <div className="space-y-6">
          {/* Header & Primary Actions */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>إدارة متقدمة لمحرك الاكتشاف التلقائي والمصادر الرسمية</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                إدارة التطبيقات التعليمية المعتمدة ⭐
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
                متابعة التطبيقات المنشورة، مراجعة واعتماد المرشحين الجدد، إدارة المصادر وتراخيصها، وفحص سجلات المزامنة الآلية كل 24 ساعة.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                disabled={isSyncing}
                onClick={handleSyncAllSources}
                className="px-5 py-3 bg-white text-amber-950 hover:bg-amber-50 rounded-2xl font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-amber-700 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>مزامنة جميع المصادر المفعّلة</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {[
              {
                id: 'published',
                label: `التطبيقات المنشورة (${resources.filter((r) => r.content_type === 'external_app' || r.launch_url).length})`,
                icon: CheckCircle,
              },
              {
                id: 'pending',
                label: `قيد المراجعة (${candidates.filter((c) => c.status === 'pending').length})`,
                icon: Inbox,
              },
              {
                id: 'rejected',
                label: `العناصر المرفوضة (${candidates.filter((c) => c.status === 'rejected').length})`,
                icon: X,
              },
              {
                id: 'sources',
                label: `إدارة المصادر المعتمدة (${sources.length})`,
                icon: Globe,
              },
              {
                id: 'sync_runs',
                label: `سجلات المزامنة والجدولة (24h) (${syncRuns.length})`,
                icon: FileClock,
              },
              {
                id: 'gaps_matrix',
                label: `لوحة سد الفجوات والمصفوفة (${gapReport ? gapReport.emptyCombinations + gapReport.lowCombinations : '0'} فجوة) 🎯`,
                icon: Target,
              },
            ].map((sub) => {
              const Icon = sub.icon;
              const isActive = appsSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    sounds.playPop();
                    if (sub.id === 'gaps_matrix') {
                      setActiveTab('gap_analyzer');
                    } else {
                      setAppsSubTab(sub.id as any);
                    }
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs font-black'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1. SUB-TAB: PUBLISHED APPS */}
          {appsSubTab === 'published' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  قائمة بجميع التطبيقات والمناهج الخارجية المعتمدة والمنشورة للجمهور
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-amber-50/70 border-b border-amber-200 text-amber-950 font-bold">
                    <tr>
                      <th className="p-4">اسم التطبيق</th>
                      <th className="p-4">المطور / الناشر</th>
                      <th className="p-4">الفئة العمرية والدليل</th>
                      <th className="p-4">المنصات</th>
                      <th className="p-4">اللغة</th>
                      <th className="p-4">آخر تحقق</th>
                      <th className="p-4">الرابط الرسمي</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resources
                      .filter((r) => r.content_type === 'external_app' || r.launch_url)
                      .map((app) => (
                        <tr key={app.id} className="hover:bg-amber-50/30 transition">
                          <td className="p-4 font-bold text-slate-900">
                            <div>{app.title_ar}</div>
                            {app.title_en && (
                              <div className="text-[11px] text-slate-400 dir-ltr text-right">
                                {app.title_en}
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-slate-700 font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-800">
                              {app.provider_name}
                            </span>
                          </td>
                          <td className="p-4 text-slate-700">
                            <div className="font-bold text-amber-900">
                              {app.age_min}–{app.age_max} سنوات
                            </div>
                            {app.age_evidence_source && (
                              <div className="text-[10px] text-slate-400 max-w-xs truncate" title={app.age_evidence_source}>
                                {app.age_evidence_source}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              {(app.supported_platforms || ['web']).map((p) => (
                                <span
                                  key={p}
                                  className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold uppercase"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold text-[10px]">
                              {app.language === 'ar' ? 'عربي' : app.language === 'en' ? 'إنجليزي' : 'ثنائي'}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 text-[11px]">
                            {app.last_verified_at ? (
                              new Date(app.last_verified_at).toLocaleDateString('ar-EG')
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="p-4">
                            {app.launch_url ? (
                              <a
                                href={app.launch_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-700 hover:underline flex items-center gap-1 font-bold"
                              >
                                <span>زيارة</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => {
                                setEditingResource(app);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 hover:bg-amber-100 text-amber-800 rounded-lg transition"
                              title="تعديل"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. SUB-TAB: PENDING CANDIDATES */}
          {appsSubTab === 'pending' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500">
                العناصر المكتشفة التي لم تستوفِ شروط النشر التلقائي الكاملة وتتطلب اعتماداً يدوياً من المشرف
              </span>

              {candidates.filter((c) => c.status === 'pending').length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-amber-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 text-sm">لا توجد عناصر بانتظار المراجعة</h4>
                  <p className="text-xs text-slate-500 mt-1">جميع الموارد المكتشفة إما منشورة أو تمت معالجتها.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidates
                    .filter((c) => c.status === 'pending')
                    .map((cand) => {
                      const matchedExisting = resources.find(
                        (r) => r.source_url === cand.candidate_url || r.launch_url === cand.candidate_url
                      );

                      return (
                        <div
                          key={cand.id}
                          className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs space-y-4 flex flex-col justify-between"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm">{cand.title_ar}</h4>
                                <span className="text-xs text-slate-400 font-medium dir-ltr text-right block">
                                  {cand.title_en}
                                </span>
                              </div>
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                بانتظار المراجعة
                              </span>
                            </div>

                            <p className="text-xs text-slate-600">{cand.description_ar}</p>

                            <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 space-y-1.5 text-xs">
                              <div>
                                <strong className="text-amber-950">الفئة العمرية المقترحة: </strong>
                                <span>{cand.suggested_age_min}–{cand.suggested_age_max} سنوات</span>
                              </div>
                              {cand.age_evidence && (
                                <div className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-amber-100">
                                  <strong>دليل العمر: </strong>{cand.age_evidence}
                                </div>
                              )}
                              <div>
                                <strong className="text-amber-950">الرابط المكتشف: </strong>
                                <a
                                  href={cand.candidate_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-amber-700 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                                >
                                  {cand.candidate_url}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>

                            {/* Safety and Rejection flags */}
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-slate-500">أسباب التحويل للمراجعة اليدوية:</span>
                              <div className="flex flex-wrap gap-1">
                                {cand.safety_flags.map((flag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold"
                                  >
                                    {flag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                            <button
                              onClick={() => handleApproveCandidate(cand.id)}
                              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>اعتماد ونشر</span>
                            </button>

                            {matchedExisting && (
                              <button
                                onClick={() => setDiffCandidate(cand)}
                                className="py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs rounded-xl transition"
                              >
                                مقارنة التحديث
                              </button>
                            )}

                            <button
                              onClick={() => setReviewingCandidate(cand)}
                              className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl transition"
                            >
                              تعديل
                            </button>

                            <button
                              onClick={() => {
                                setCandidateRejectId(cand.id);
                                setRejectionReasonInput('');
                              }}
                              className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition"
                            >
                              رفض
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* 3. SUB-TAB: REJECTED ITEMS */}
          {appsSubTab === 'rejected' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500">
                قائمة بالعناصر التي رفضها المشرف مع توثيق سبب الرفض
              </span>

              {candidates.filter((c) => c.status === 'rejected').length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
                  <p className="text-xs text-slate-500">لا توجد عناصر مرفوضة حالياً.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidates
                    .filter((c) => c.status === 'rejected')
                    .map((cand) => (
                      <div
                        key={cand.id}
                        className="bg-white rounded-3xl p-5 border border-rose-200 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{cand.title_ar}</h4>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                            مرفوض
                          </span>
                        </div>
                        <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 text-xs text-rose-900">
                          <strong>سبب قرار الرفض: </strong>
                          <span>{cand.rejection_reason || 'غير محدد'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          المطور: {cand.provider_name} | النطاق: {cand.candidate_url}
                        </div>
                        <button
                          onClick={() => handleApproveCandidate(cand.id)}
                          className="w-full py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-xl font-bold text-xs transition"
                        >
                          إعادة النظر واعتماد المورد
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* 4. SUB-TAB: SOURCES MANAGEMENT */}
          {appsSubTab === 'sources' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">المصادر المعتمدة وطرق الوصول</h3>
                  <p className="text-xs text-slate-500">
                    التحكم في تشغيل وتفعيل موصلات المصادر (Khan Kids, PBS, Ahlan Simsim, Starfall)
                  </p>
                </div>
                <button
                  disabled={isSyncing}
                  onClick={handleSyncAllSources}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>مزامنة جميع المصادر المفعّلة</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sources.map((src) => (
                  <div
                    key={src.id}
                    className={`bg-white rounded-3xl p-5 border shadow-xs space-y-4 flex flex-col justify-between ${
                      src.is_active ? 'border-amber-200' : 'border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{src.name}</h4>
                          <span className="text-[11px] text-slate-400 font-mono">{src.slug}</span>
                        </div>
                        <button
                          onClick={() => handleToggleSourceActive(src)}
                          className={`text-xs font-bold px-3 py-1 rounded-full transition cursor-pointer ${
                            src.is_active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {src.is_active ? '✓ نشط ومفعّل' : '✕ معطّل'}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-bold">
                          نوع الوصول: {src.source_type.toUpperCase()}
                        </span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          حماية الوالدين: {src.requires_parent_gate ? 'مطلوبة' : 'غير مطلوبة'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                        <div>
                          <strong>النطاقات المصرح بها: </strong>
                          <span className="font-mono text-[11px] text-slate-700">{src.allowed_domains.join(', ')}</span>
                        </div>
                        <div>
                          <strong>شروط الترخيص: </strong>
                          <span className="text-slate-600 text-[11px]">{src.licensing_terms_summary}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400">
                        آخر مزامنة: {src.last_synced_at ? new Date(src.last_synced_at).toLocaleString('ar-EG') : 'لم تتم بعد'}
                      </div>
                    </div>

                    <button
                      disabled={isSyncing || !src.is_active}
                      onClick={() => handleTriggerSync(src.id)}
                      className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>مزامنة هذا المصدر</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. SUB-TAB: SYNC RUNS & 24H CRON STATUS */}
          {appsSubTab === 'sync_runs' && (
            <div className="space-y-6">
              {/* 24-Hour Daemon Card */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                    الجدولة التلقائية كل 24 ساعة
                  </span>
                  <h3 className="text-lg font-black">محرك المزامنة الآلية بالخادم نشط</h3>
                  <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                    يعمل خادم Express مع مؤقت زمني صارم كل 24 ساعة لتشغيل المزامنة وتفادي التكرار، بالإضافة لدعم Supabase pg_cron لبيئات السحابة.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/20 text-xs space-y-1">
                  <div><strong>الحالة الحالية: </strong>{isSyncing ? 'جاري التشغيل...' : 'في انتظار الدورة القادمة'}</div>
                  <div><strong>الدوريات المسجلة: </strong>{syncRuns.length} دورة</div>
                </div>
              </div>

              {/* Sync Runs Table */}
              <div className="bg-white rounded-3xl border border-amber-200 shadow-xs overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-amber-50/70 border-b border-amber-200 text-amber-950 font-bold">
                    <tr>
                      <th className="p-3">معرف الدورة</th>
                      <th className="p-3">المصدر</th>
                      <th className="p-3">وقت البدء</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3">المكتشف</th>
                      <th className="p-3">المستورد</th>
                      <th className="p-3">المحال للمراجعة</th>
                      <th className="p-3">الملخص / الأخطاء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {syncRuns.map((run) => (
                      <tr key={run.id} className="hover:bg-amber-50/20">
                        <td className="p-3 font-mono text-slate-500">{run.id.slice(0, 16)}</td>
                        <td className="p-3 font-bold text-slate-800">{run.source_id}</td>
                        <td className="p-3 text-slate-500">
                          {new Date(run.started_at).toLocaleString('ar-EG')}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              run.status === 'success'
                                ? 'bg-emerald-100 text-emerald-800'
                                : run.status === 'running'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {run.status === 'success' ? 'ناجحة' : run.status === 'running' ? 'جارية' : 'فشلت'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-800">{run.items_found}</td>
                        <td className="p-3 font-bold text-emerald-600">{run.items_imported}</td>
                        <td className="p-3 font-bold text-amber-600">{run.items_flagged}</td>
                        <td className="p-3 text-slate-600 max-w-sm truncate" title={run.error_message || ''}>
                          {run.error_message || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Diff Modal for Candidates */}
          {diffCandidate && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base">مقارنة بيانات المورد قبل وبعد التحديث</h3>
                  <button onClick={() => setDiffCandidate(null)} className="p-1 text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200">
                    <span className="font-bold text-slate-700 block border-b pb-1">البيانات السابقة</span>
                    <div><strong>العنوان: </strong>{diffCandidate.title_ar}</div>
                    <div><strong>الفئة العمرية: </strong>من {diffCandidate.suggested_age_min} إلى {diffCandidate.suggested_age_max} سنوات</div>
                    <div><strong>الرابط: </strong>{diffCandidate.candidate_url}</div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-2xl space-y-2 border border-emerald-200">
                    <span className="font-bold text-emerald-800 block border-b pb-1">البيانات المكتشفة الجديدة</span>
                    <div><strong>العنوان: </strong>{diffCandidate.title_ar}</div>
                    <div><strong>الفئة العمرية: </strong>من {diffCandidate.suggested_age_min} إلى {diffCandidate.suggested_age_max} سنوات</div>
                    <div><strong>دليل العمر: </strong>{diffCandidate.age_evidence || '—'}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      handleApproveCandidate(diffCandidate.id);
                      setDiffCandidate(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs"
                  >
                    تأكيد اعتماد التحديث
                  </button>
                  <button
                    onClick={() => setDiffCandidate(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB: CONTENT GAP ANALYZER & SOURCES (REQUIREMENT 6) */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'gap_analyzer' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-100">
                <Target className="w-3.5 h-3.5 text-amber-200" />
                <span>نظام ذكي متقدم لتحليل كثافة الموارد وسد الفجوات تلقائياً</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                مصادر ومناطق النقص (Content Gaps) 🎯
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
                فحص كثافة المحتوى عبر الفئات العمرية الـ 4 والمجالات الـ 14، تشغيل المزامنة الموجهة للمصادر المعنية فقط، والتحقق الصارم من موثوقية الأعمار وغياب الإعلانات.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                disabled={isGapFilling || isSyncing}
                onClick={handleRunGlobalGapFill}
                className="px-5 py-3 bg-white text-amber-950 hover:bg-amber-50 rounded-2xl font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 text-amber-700 ${isGapFilling ? 'animate-spin' : ''}`} />
                <span>{isGapFilling ? 'جاري سد الفجوات...' : 'تحليل وسد الفجوات تلقائياً'}</span>
              </button>

              <button
                disabled={isGapLoading}
                onClick={loadGapAnalysisData}
                className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold text-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGapLoading ? 'animate-spin' : ''}`} />
                <span>إعادة تقييم المصفوفة</span>
              </button>
            </div>
          </div>

          {/* Configurable Target Threshold & KPI Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Threshold Configuration Box */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-1">
                  <Sliders className="w-4 h-4 text-amber-600" />
                  <span>الحد الأدنى المستهدف للموارد</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  الهدف التخطيطي المطلوب لكل تركيبة من الفئة العمرية والمجال التعليمي (قابل للتعديل):
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={gapTargetThresholdInput}
                  onChange={(e) => setGapTargetThresholdInput(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-3 py-2.5 rounded-xl border border-slate-300 font-black text-slate-900 text-center text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
                <button
                  onClick={handleSaveThreshold}
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition shadow-2xs cursor-pointer"
                >
                  حفظ الهدف وتحديث
                </button>
              </div>

              <span className="text-[11px] text-slate-400 block border-t pt-2">
                * لن يؤدي رفع الهدف إلى اختلاق بيانات وهمية بل سيحدد الفجوات الحقيقية بدقة.
              </span>
            </div>

            {/* Matrix Status Metrics */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-emerald-800">فئات مكتملة</span>
                <span className="text-3xl font-black text-emerald-600 tabular-nums">
                  {gapReport?.sufficientCombinations ?? 0}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">بلغت أو تجاوزت الهدف</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-amber-800">فئات منخفضة</span>
                <span className="text-3xl font-black text-amber-600 tabular-nums">
                  {gapReport?.lowCombinations ?? 0}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">تحتوي موارد لكن أقل من الهدف</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-rose-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-rose-800">فئات فارغة</span>
                <span className="text-3xl font-black text-rose-600 tabular-nums">
                  {gapReport?.emptyCombinations ?? 0}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">لا تحتوي على أي مورد حالياً</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-purple-800">إجمالي النقص العددي</span>
                <span className="text-3xl font-black text-purple-600 tabular-nums">
                  {gapReport?.overallDeficit ?? 0}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">مورد مطلوب للوصول للهدف</span>
              </div>
            </div>
          </div>

          {/* Section 1: Trusted Sources & Detailed Operational Status Table */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-600" />
                  <span>المصادر المعتمدة وحالتها التشغيلية وإحصاءاتها</span>
                </h3>
                <p className="text-xs text-slate-500">
                  فحص حالة الاتصال، النطاقات المصرح بها، طريقة الوصول، وسجل الاستيراد لكل مصدر
                </p>
              </div>

              <button
                disabled={isSyncing}
                onClick={handleSyncAllSources}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>مزامنة جميع المصادر المفعّلة</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200">
                  <tr>
                    <th className="p-3">المصدر والجهة</th>
                    <th className="p-3">طريقة الوصول</th>
                    <th className="p-3">النطاقات المسموحة</th>
                    <th className="p-3">الحالة التشغيلية</th>
                    <th className="p-3">آخر مزامنة</th>
                    <th className="p-3">إحصاءات المكتشف</th>
                    <th className="p-3 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sources.map((src) => {
                    const isSrcSyncing = syncingSourceId === src.id;
                    const srcRuns = syncRuns.filter((r) => r.source_id === src.id);
                    const latestRun = srcRuns[0];
                    const totalImportedFromSrc = srcRuns.reduce((acc, r) => acc + (r.items_imported || 0), 0);

                    return (
                      <tr key={src.id} className="hover:bg-amber-50/20 transition">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{src.name}</div>
                          <a
                            href={src.base_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-amber-700 hover:underline font-mono inline-flex items-center gap-1"
                          >
                            <span>{src.base_url}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </td>

                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono font-bold text-slate-700 uppercase text-[10px]">
                            {src.source_type}
                          </span>
                        </td>

                        <td className="p-3 text-slate-500 max-w-xs truncate" title={src.allowed_domains.join(', ')}>
                          {src.allowed_domains.join(', ')}
                        </td>

                        <td className="p-3">
                          {src.is_active ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>يعمل ومفعّل</span>
                            </span>
                          ) : (
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 flex items-center gap-1 w-max"
                              title={src.licensing_terms_summary}
                            >
                              <span>غير مفعّل (مقيد الشروط)</span>
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {src.last_synced_at ? new Date(src.last_synced_at).toLocaleString('ar-EG') : 'لم تتم بعد'}
                        </td>

                        <td className="p-3">
                          <div className="text-[11px] text-slate-700">
                            <strong>{latestRun?.items_found ?? 0}</strong> مكتشف |{' '}
                            <span className="text-emerald-700 font-bold">{latestRun?.items_imported ?? 0} نُشر</span> |{' '}
                            <span className="text-amber-700 font-bold">{latestRun?.items_flagged ?? 0} للمراجعة</span>
                          </div>
                        </td>

                        <td className="p-3 text-center">
                          {src.is_active ? (
                            <button
                              disabled={isSrcSyncing}
                              onClick={() => handleSyncSingleSource(src.id)}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold text-[11px] transition flex items-center gap-1 mx-auto disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3 h-3 ${isSrcSyncing ? 'animate-spin' : ''}`} />
                              <span>مزامنة</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">معطل</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Interactive Content Gap Matrix Table */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <span>مصفوفة توزيع الموارد والفجوات (Content Gap Matrix)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  استعراض حالة كل تركيبة من الفئات العمرية الـ 4 والمجالات الـ 14 مع إمكانية إطلاق بحث مخصص لسد النقص
                </p>
              </div>

              {/* Matrix Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Age Filter */}
                <select
                  value={gapFilterBracket}
                  onChange={(e) => setGapFilterBracket(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:bg-white"
                >
                  <option value="all">جميع الفئات العمرية</option>
                  {AGE_BRACKETS.map((b) => (
                    <option key={b.id} value={b.id}>{b.label_ar}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={gapFilterStatus}
                  onChange={(e) => setGapFilterStatus(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:bg-white"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="empty">الفارغة فقط (0 مورد)</option>
                  <option value="low">المنخفضة فقط (&lt; الهدف)</option>
                  <option value="sufficient">المكتملة فقط (&gt;= الهدف)</option>
                </select>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200">
                  <tr>
                    <th className="p-3">الفئة العمرية</th>
                    <th className="p-3">المجال التعليمي والتربوي</th>
                    <th className="p-3 text-center">المتوفر / المستهدف</th>
                    <th className="p-3">نسبة التغطية</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">المصادر المقترحة للحل</th>
                    <th className="p-3 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gapReport?.matrix
                    .filter((m) => {
                      if (gapFilterBracket !== 'all' && m.ageBracketId !== gapFilterBracket) return false;
                      if (gapFilterStatus !== 'all' && m.status !== gapFilterStatus) return false;
                      return true;
                    })
                    .map((entry, idx) => {
                      const coveragePercent = Math.min(
                        100,
                        Math.round((entry.currentCount / entry.targetThreshold) * 100)
                      );

                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-bold text-slate-800 whitespace-nowrap">
                            <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md">
                              {entry.ageBracketLabel}
                            </span>
                          </td>

                          <td className="p-3 font-bold text-slate-900">
                            {entry.categoryTitleAr}
                          </td>

                          <td className="p-3 text-center">
                            <span className="font-black text-sm text-slate-800">{entry.currentCount}</span>
                            <span className="text-slate-400"> / {entry.targetThreshold}</span>
                          </td>

                          <td className="p-3 min-w-[120px]">
                            <div className="space-y-1">
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    entry.status === 'sufficient'
                                      ? 'bg-emerald-500'
                                      : entry.status === 'low'
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${coveragePercent}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                {coveragePercent}% مكتمل
                              </span>
                            </div>
                          </td>

                          <td className="p-3">
                            {entry.status === 'sufficient' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                مكتمل
                              </span>
                            ) : entry.status === 'low' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                منخفض (-{entry.deficit})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                فارغ (-{entry.deficit})
                              </span>
                            )}
                          </td>

                          <td className="p-3">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {entry.recommendedSourceIds.map((sId) => {
                                const src = sources.find((s) => s.id === sId);
                                return (
                                  <span
                                    key={sId}
                                    className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium truncate"
                                    title={src?.name || sId}
                                  >
                                    {src?.name?.split('—')[0] || sId}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          <td className="p-3 text-center">
                            {entry.status !== 'sufficient' && (
                              <button
                                disabled={isGapFilling}
                                onClick={() => handleTargetedGapFill(entry.categoryId, entry.ageBracketId)}
                                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[10px] transition shadow-2xs whitespace-nowrap disabled:opacity-50 cursor-pointer"
                              >
                                بحث مخصص
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Gap Analysis & Recovery Report Summary */}
          {gapFillOutcome && (
            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-amber-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    تقرير نتائج عملية سد الفجوات والمزامنة الموجهة
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  اكتمل في: {new Date(gapFillOutcome.completedAt).toLocaleTimeString('ar-EG')}
                </span>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="block text-slate-400 text-[11px]">العناصر المكتشفة</span>
                  <strong className="text-base text-slate-900">{gapFillOutcome.itemsFound}</strong>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                  <span className="block text-emerald-700 text-[11px]">نُشرت تلقائياً</span>
                  <strong className="text-base text-emerald-800">{gapFillOutcome.itemsImported}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="block text-slate-400 text-[11px]">مكررة تم تجاهلها</span>
                  <strong className="text-base text-slate-700">{gapFillOutcome.itemsDuplicatesIgnored}</strong>
                </div>
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
                  <span className="block text-amber-700 text-[11px]">أحيلت للمراجعة</span>
                  <strong className="text-base text-amber-800">{gapFillOutcome.itemsFlagged}</strong>
                </div>
                <div className="bg-sky-50 p-3 rounded-2xl border border-sky-100">
                  <span className="block text-sky-700 text-[11px]">فئات تحسنت كثافتها</span>
                  <strong className="text-base text-sky-800">{gapFillOutcome.improvedGapsCount}</strong>
                </div>
              </div>

              {/* Improved Combinations */}
              {gapFillOutcome.improvedCombinations.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>الفئات التي تحسنت وأضيف إليها محتوى معتمد:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {gapFillOutcome.improvedCombinations.map((imp, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                        <span className="font-bold text-emerald-950">{imp.categoryTitleAr} ({imp.ageBracketId})</span>
                        <span className="text-[11px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded-md font-bold">
                          {imp.beforeCount} ← {imp.afterCount} مورد
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Remaining Deficiencies Explanation */}
              {gapFillOutcome.remainingDeficiencies.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>الفئات التي ما زالت ناقصة وتوثيق أسباب عدم إكمالها:</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {gapFillOutcome.remainingDeficiencies.slice(0, 5).map((def, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <strong className="text-amber-950">{def.categoryTitleAr} ({def.ageBracketId}): </strong>
                          <span className="text-slate-600">{def.reason}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-amber-800 bg-white px-2 py-0.5 rounded-md">
                          متوفر {def.currentCount} / {def.targetCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 2: ACTIVITIES MANAGEMENT */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-amber-950">قائمة الأنشطة والمناهج في المنصة</h2>
            <button
              onClick={() => {
                sounds.playPop();
                setEditingResource({
                  id: `act-${Date.now()}`,
                  title_ar: '',
                  title_en: '',
                  slug: '',
                  description_ar: '',
                  age_min: 3,
                  age_max: 5,
                  category_id: categories[0]?.id || 'cat-arabic-alphabet',
                  content_type: 'game',
                  launch_type: 'builtin',
                  provider_name: 'عالم الصغار (أصيل)',
                  source_type: 'original',
                  language: 'ar',
                  is_free: true,
                  learning_objectives: ['مهارة تعليمية أولى'],
                  estimated_duration_minutes: 5,
                  accessibility_notes: ['أزرار لمس كبيرة تناسب الأطفال'],
                  licensing_status: 'original_authored',
                  review_status: 'approved',
                  is_featured: false,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة نشاط</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-amber-50/70 border-b border-amber-200 text-amber-950 font-bold">
                <tr>
                  <th className="p-4">العنوان بالعربية</th>
                  <th className="p-4">الأعمار</th>
                  <th className="p-4">المزود والنوع</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">مميز؟</th>
                  <th className="p-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-amber-50/30 transition">
                    <td className="p-4 font-bold text-slate-900 max-w-xs">{res.title_ar}</td>
                    <td className="p-4 font-semibold text-slate-600 tabular-nums">
                      {res.age_min}–{res.age_max} سنوات
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{res.provider_name}</div>
                      <div className="text-[10px] text-slate-500">{res.content_type} / {res.launch_type}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          res.review_status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {res.review_status === 'approved' ? 'منشور ومعتمد' : 'مسودة'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-amber-600">
                      {res.is_featured ? '⭐ نعم' : '—'}
                    </td>
                    <td className="p-4 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            sounds.playPop();
                            setEditingResource(res);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-800 hover:bg-amber-50 transition"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(res.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 3: INGESTION CANDIDATES */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-amber-950">
                مرشحو الاكتشاف والاستيراد قيد المراجعة الإدارية
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تطبيقات تعليمية تم اكتشافها وتحتاج لمراجعة المشرف لتوثيق الفئة العمرية والمجال التعليمي قبل النشر
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTriggerSync(sources[0]?.id || 'src-khan-kids')}
                disabled={isSyncing}
                className="px-3.5 py-2 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold hover:bg-amber-200 transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>مزامنة جديدة</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-amber-200/60 pb-3">
            {[
              { id: 'pending', label: `قيد المراجعة (${candidates.filter((c) => c.status === 'pending').length})` },
              { id: 'approved', label: `تم الاعتماد (${candidates.filter((c) => c.status === 'approved').length})` },
              { id: 'rejected', label: `مرفوض (${candidates.filter((c) => c.status === 'rejected').length})` },
              { id: 'all', label: `الكل (${candidates.length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCandidateStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  candidateStatusFilter === f.id
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates
              .filter((cand) => candidateStatusFilter === 'all' || cand.status === candidateStatusFilter)
              .map((cand) => {
                const primaryCat = categories.find((c) => c.id === cand.suggested_category_id);
                return (
                  <div
                    key={cand.id}
                    className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 block mb-1">
                            المصدر: {cand.provider_name}
                          </span>
                          <h3 className="font-bold text-base text-slate-900">{cand.title_ar}</h3>
                          {cand.title_en && (
                            <span className="text-xs text-slate-400 block">{cand.title_en}</span>
                          )}
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                            cand.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : cand.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {cand.status === 'pending'
                            ? 'بانتظار الموافقة'
                            : cand.status === 'approved'
                            ? 'معتمد ومنشور'
                            : 'مرفوض'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{cand.description_ar}</p>

                      {/* Age & Categories Classification Badges */}
                      <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="font-bold text-amber-950">الفئة العمرية المقترحة:</span>
                          <span className="font-bold text-amber-800">
                            من {cand.suggested_age_min} إلى {cand.suggested_age_max} سنوات
                          </span>
                        </div>
                        {cand.age_evidence && (
                          <div className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-xl">
                            <span className="font-bold text-slate-700">دليل الفئة العمرية: </span>
                            {cand.age_evidence}
                          </div>
                        )}

                        <div className="text-slate-700 pt-1">
                          <span className="font-bold text-amber-950 block mb-1">المجال التعليمي:</span>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg bg-amber-200/70 text-amber-900 font-bold text-[11px]">
                              أساسي: {primaryCat?.title_ar || cand.suggested_category_id || 'عام'}
                            </span>
                            {cand.suggested_additional_categories?.map((catId) => {
                              const extraCat = categories.find((c) => c.id === catId);
                              return (
                                <span
                                  key={catId}
                                  className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]"
                                >
                                  إضافي: {extraCat?.title_ar || catId}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Licensing & Safety */}
                      <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1.5 text-slate-700 border border-slate-100">
                        <div className="font-bold text-slate-800">أدلة الترخيص والأمان:</div>
                        <p className="text-[11px] text-slate-600">{cand.licensing_evidence}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cand.safety_flags.map((flag, idx) => (
                            <span
                              key={idx}
                              className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[10px] font-bold text-emerald-800"
                            >
                              ✓ {flag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {cand.status === 'rejected' && cand.rejection_reason && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
                          <span className="font-bold">سبب الرفض: </span>
                          {cand.rejection_reason}
                        </div>
                      )}
                    </div>

                    {cand.status === 'pending' && (
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleApproveCandidate(cand.id)}
                          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>اعتماد ونشر</span>
                        </button>

                        <button
                          onClick={() => setReviewingCandidate(cand)}
                          className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl transition"
                        >
                          تعديل التصنيف
                        </button>

                        <button
                          onClick={() => {
                            setCandidateRejectId(cand.id);
                            setRejectionReasonInput('');
                          }}
                          className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition"
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 4: TRUSTED SOURCES */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-amber-950">المصادر الموثوقة ومحركات الاكتشاف الآمن</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                إدارة المصادر التعليمية المعتمدة، وضبط النطاقات المسموح بها وخلاصات API وسياسات التحديث
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={isSyncing}
                onClick={handleSyncAllSources}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>مزامنة جميع المصادر المفعّلة</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setEditingSource({
                    id: `src-${Date.now()}`,
                    name: '',
                    slug: '',
                    base_url: 'https://',
                    feed_or_api_url: '',
                    source_type: 'api',
                    is_active: true,
                    requires_parent_gate: true,
                    allowed_domains: [],
                    licensing_terms_summary: '',
                    update_frequency: 'daily',
                    verification_status: 'verified',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  });
                  setIsSourceModalOpen(true);
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مصدر موثوق جديد</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((src) => (
              <div
                key={src.id}
                className={`bg-white rounded-3xl p-6 border shadow-xs space-y-4 flex flex-col justify-between ${
                  src.is_active ? 'border-amber-200/80' : 'border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{src.name}</h3>
                      <span className="text-[11px] text-slate-500 font-mono">{src.slug}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          src.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {src.is_active ? 'نشط ومفعّل' : 'معطّل مؤقتاً'}
                      </span>
                    </div>
                  </div>

                  {/* Attributes strip */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 font-bold border border-amber-200/60">
                      نوع المصدر: {src.source_type.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-sky-50 text-sky-900 font-bold border border-sky-200/60">
                      التحديث: {src.update_frequency === 'realtime' ? 'مباشر' : src.update_frequency === 'weekly' ? 'أسبوعي' : 'يومي'}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/60">
                      الحالة: {src.verification_status === 'pending' ? 'قيد التحقق' : 'موثوق ومعتمد'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{src.licensing_terms_summary}</p>

                  <div className="text-xs text-slate-700 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">الموقع الرسمي:</span>
                      <a
                        href={src.base_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-700 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>{src.base_url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {src.feed_or_api_url && (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">خلاصة API / Feed:</span>
                        <code className="text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md truncate max-w-xs">
                          {src.feed_or_api_url}
                        </code>
                      </div>
                    )}
                  </div>

                  <div className="text-xs font-bold text-slate-700 pt-1">
                    <span>النطاقات المسموح بها (Allowlist):</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {src.allowed_domains.map((dom, i) => (
                        <code
                          key={i}
                          className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-800 text-[11px]"
                        >
                          {dom}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    آخر مزامنة:{' '}
                    {src.last_synced_at
                      ? new Date(src.last_synced_at).toLocaleDateString('ar-SA')
                      : 'لم تُجرَ بعد'}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSourceActive(src)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                        src.is_active
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {src.is_active ? 'تعطيل' : 'تفعيل'}
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        setEditingSource(src);
                        setIsSourceModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-amber-200 font-bold text-amber-900 hover:bg-amber-50 transition text-xs"
                    >
                      تعديل
                    </button>

                    <button
                      disabled={isSyncing || !src.is_active}
                      onClick={() => handleTriggerSync(src.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition text-xs flex items-center gap-1 disabled:opacity-40"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>مزامنة فورية</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 5: CATEGORIES */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-amber-950">المجالات والتصنيفات التربوية</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900">{c.title_ar}</span>
                  <span className="text-xs font-bold text-slate-500">#{c.display_order}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{c.description_ar}</p>
                <div className="text-[11px] text-amber-700 font-bold pt-1">
                  {resources.filter((r) => r.category_id === c.id).length} أنشطة مسجلة
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 6: REPORTS & FEEDBACK */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-amber-950">تقارير وبلاغات أولياء الأمور</h2>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((rep) => (
                <div key={rep.id} className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                      {rep.type === 'feedback' ? 'اقتراح عام' : rep.type === 'broken_link' ? 'رابط لا يعمل' : 'ملاحظة أمان'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(rep.created_at).toLocaleString('ar-SA')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 font-medium">{rep.message}</p>
                  {(rep.parent_name || rep.parent_email) && (
                    <div className="text-xs text-slate-500">
                      من: {rep.parent_name || 'فاعل خير'} {rep.parent_email && `(${rep.parent_email})`}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => updateReportStatus(rep.id, 'resolved')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {rep.status === 'resolved' ? '✓ تم الحل' : 'تحديد كتم الحل'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 bg-white p-8 rounded-3xl text-center border border-amber-200/80">
              لا توجد تقارير جديدة حالياً.
            </p>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 7: AUDIT LOGS */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-amber-950">سجل عمليات التدقيق الإداري (Audit Trail)</h2>
          <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
                <tr>
                  <th className="p-4">الوقت</th>
                  <th className="p-4">المشرف</th>
                  <th className="p-4">الإجراء</th>
                  <th className="p-4">الجدول المعني</th>
                  <th className="p-4">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleTimeString('ar-SA')}
                    </td>
                    <td className="p-4 font-bold text-slate-800">{log.admin_email}</td>
                    <td className="p-4 text-amber-900 font-bold">{log.action}</td>
                    <td className="p-4 font-mono text-[11px] text-slate-600">{log.target_table}</td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 8: SETTINGS & SQL SETUP */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'settings' && (
        <div className="space-y-8 max-w-4xl">
          {/* Connection Health & Diagnostic Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-600" />
                  <span>حالة اتصال قاعدة بيانات Supabase الحية</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  فحص متغيرات البيئة وجداول قاعدة البيانات الحقيقية
                </p>
              </div>

              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isTestingConnection ? 'animate-spin' : ''}`} />
                <span>{isTestingConnection ? 'جاري الاختبار...' : 'فحص الاتصال بـ Supabase الآن'}</span>
              </button>
            </div>

            {connectionTestResult && (
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  connectionTestResult.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  {connectionTestResult.connected ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>الاتصال نشط وناجح</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>لم يتم الاتصال بقاعدة بيانات حية</span>
                    </>
                  )}
                </div>
                <p>{connectionTestResult.message}</p>
                {connectionTestResult.connected && (
                  <div className="mt-2 text-[11px] font-semibold text-emerald-800">
                    حالة المصادقة (Auth): {connectionTestResult.authWorking ? '✓ متصل' : '✗ غير متصل'} | دالة is_admin(): {connectionTestResult.rpcWorking ? '✓ جاهزة' : '✗ غير متوفرة'} | جدول categories: {connectionTestResult.categoriesAccessible ? '✓ متاح' : '✗ يتطلب صلاحيات GRANT'}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              خطوات ربط قاعدة بيانات Supabase الحقيقية
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              تم إنشاء ملف ترحيل SQL الكامل في المسار{' '}
              <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-900 font-mono">
                supabase/migrations/20261013000000_little_stars_schema.sql
              </code>
              . لربط مشروعك:
            </p>

            <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-700 space-y-2 pr-2">
              <li>افتح لوحة تحكم مشروعك في Supabase واذهب إلى قسم <strong>SQL Editor</strong>.</li>
              <li>انسخ محتوى ملف الترحيل والصقه وشغله لإنشاء الجداول وسياسات الأمان RLS المنيعة.</li>
              <li>
                أضف بريدك في جدول السماح لتفعيل الصلاحيات الإدارية:
                <pre className="mt-1.5 p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
{`INSERT INTO public.admin_allowlist (email, is_active)
VALUES ('${session.email}', true);`}
                </pre>
              </li>
              <li>
                قم بتحديث المتغيرات في ملف <code className="font-mono text-amber-900">.env</code>:
                <pre className="mt-1.5 p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono">
{`VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"`}
                </pre>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* ACTIVITY EDIT / CREATE MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {isModalOpen && editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-amber-100 mb-6">
              <h3 className="text-xl font-bold text-amber-950">
                {editingResource.title_ar ? 'تعديل النشاط التعليمي' : 'إضافة نشاط جديد'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">العنوان بالعربية: *</label>
                <input
                  type="text"
                  required
                  value={editingResource.title_ar}
                  onChange={(e) => setEditingResource({ ...editingResource, title_ar: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوصف بالعربية: *</label>
                <textarea
                  required
                  rows={3}
                  value={editingResource.description_ar}
                  onChange={(e) => setEditingResource({ ...editingResource, description_ar: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الحد الأدنى للعمر:</label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={editingResource.age_min}
                    onChange={(e) => setEditingResource({ ...editingResource, age_min: parseInt(e.target.value, 10) })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الحد الأعلى للعمر:</label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={editingResource.age_max}
                    onChange={(e) => setEditingResource({ ...editingResource, age_max: parseInt(e.target.value, 10) })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المجال التعليمي الأساسي:</label>
                  <select
                    value={editingResource.category_id}
                    onChange={(e) => setEditingResource({ ...editingResource, category_id: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title_ar}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">طريقة التشغيل:</label>
                  <select
                    value={editingResource.launch_type}
                    onChange={(e) => setEditingResource({ ...editingResource, launch_type: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                  >
                    <option value="builtin">مدمج في الموقع (Playable)</option>
                    <option value="external_tab">رابط خارجي موثوق (مع بوابة الوالدين)</option>
                  </select>
                </div>
              </div>

              {/* Additional Categories Multi-Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مجالات وتصنيفات إضافية ينتمي إليها النشاط:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 max-h-32 overflow-y-auto">
                  {categories
                    .filter((c) => c.id !== editingResource.category_id)
                    .map((c) => {
                      const isSelected = (editingResource.additional_categories || []).includes(c.id);
                      return (
                        <label key={c.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const current = editingResource.additional_categories || [];
                              const updated = e.target.checked
                                ? [...current, c.id]
                                : current.filter((id) => id !== c.id);
                              setEditingResource({ ...editingResource, additional_categories: updated });
                            }}
                            className="rounded text-amber-500 w-3.5 h-3.5"
                          />
                          <span>{c.title_ar}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Age Brackets Preview */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs">
                <span className="font-bold text-amber-950 block mb-1">الفئات العمرية المشمولة تلقائياً بالموقع:</span>
                <div className="flex flex-wrap gap-1.5">
                  {AGE_BRACKETS.filter(
                    (b) =>
                      editingResource.age_min <= b.max && editingResource.age_max >= b.min
                  ).map((b) => (
                    <span key={b.id} className="px-2 py-0.5 rounded-md bg-white border border-amber-200 font-bold text-[11px] text-amber-900">
                      ✓ {b.label_ar}
                    </span>
                  ))}
                </div>
              </div>

              {editingResource.launch_type === 'external_tab' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رابط النشاط الخارجي (HTTPS فقط):</label>
                  <input
                    type="url"
                    value={editingResource.launch_url || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, launch_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingResource.is_featured}
                    onChange={(e) => setEditingResource({ ...editingResource, is_featured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>تمييز في الصفحة الرئيسية (Featured)</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition shadow-xs"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SOURCE EDIT / CREATE MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {isSourceModalOpen && editingSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-amber-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-amber-950">
                  {editingSource.name ? 'تعديل بيانات المصدر الموثوق' : 'إضافة مصدر موثوق جديد'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">ضبط معايير الأمان، نوع المصدر، والنطاقات المسموح بها للاستيراد</p>
              </div>
              <button
                onClick={() => {
                  setIsSourceModalOpen(false);
                  setEditingSource(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSource} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم المصدر: *</label>
                  <input
                    type="text"
                    required
                    value={editingSource.name}
                    onChange={(e) => setEditingSource({ ...editingSource, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المعرف البرمجي (Slug): *</label>
                  <input
                    type="text"
                    required
                    value={editingSource.slug}
                    onChange={(e) => setEditingSource({ ...editingSource, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الموقع الرسمي (Base URL): *</label>
                  <input
                    type="url"
                    required
                    value={editingSource.base_url}
                    onChange={(e) => setEditingSource({ ...editingSource, base_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع المصدر (Source Type):</label>
                  <select
                    value={editingSource.source_type}
                    onChange={(e) => setEditingSource({ ...editingSource, source_type: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  >
                    <option value="api">واجهة برمجية رسمية (REST API)</option>
                    <option value="rss">خلاصة تحديثات (RSS/XML)</option>
                    <option value="dataset">مجموعة بيانات تعليمية مفتوحة (Dataset)</option>
                    <option value="curated_index">كتالوج معتمد ومراجع (Curated Index)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رابط خلاصة البيانات أو API:</label>
                  <input
                    type="text"
                    value={editingSource.feed_or_api_url || ''}
                    onChange={(e) => setEditingSource({ ...editingSource, feed_or_api_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رابط توثيق API أو شروط الاستخدام:</label>
                  <input
                    type="text"
                    value={editingSource.api_documentation_url || ''}
                    onChange={(e) => setEditingSource({ ...editingSource, api_documentation_url: e.target.value })}
                    placeholder="https://docs.partner.com/api"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">النطاقات المسموح بها (مفصولة بفواصل):</label>
                <input
                  type="text"
                  value={editingSource.allowed_domains.join(', ')}
                  onChange={(e) =>
                    setEditingSource({
                      ...editingSource,
                      allowed_domains: e.target.value
                        .split(',')
                        .map((d) => d.trim().toLowerCase())
                        .filter(Boolean),
                    })
                  }
                  placeholder="khanacademy.org, learn.khanacademy.org"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملخص شروط الاستخدام ورخصة المحتوى: *</label>
                <textarea
                  required
                  rows={2}
                  value={editingSource.licensing_terms_summary}
                  onChange={(e) => setEditingSource({ ...editingSource, licensing_terms_summary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">دورية التحديث التلقائي:</label>
                  <select
                    value={editingSource.update_frequency || 'daily'}
                    onChange={(e) => setEditingSource({ ...editingSource, update_frequency: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  >
                    <option value="realtime">تحديث مباشر وفوري</option>
                    <option value="daily">يومي</option>
                    <option value="weekly">أسبوعي</option>
                    <option value="manual">يدوي فقط عند الطلب</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">حالة التحقق من الموثوقية:</label>
                  <select
                    value={editingSource.verification_status || 'verified'}
                    onChange={(e) => setEditingSource({ ...editingSource, verification_status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  >
                    <option value="verified">موثق ومعتمد رسمياً</option>
                    <option value="pending">قيد مراجعة الشروط</option>
                    <option value="flagged">تحت الملاحظة</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingSource.is_active}
                    onChange={(e) => setEditingSource({ ...editingSource, is_active: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>تفعيل المصدر في عمليات الاستيراد والمزامنة</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingSource.requires_parent_gate}
                    onChange={(e) => setEditingSource({ ...editingSource, requires_parent_gate: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>فرض بوابة الوالدين (Parent Gate) قبل الفتح</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsSourceModalOpen(false);
                    setEditingSource(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition shadow-xs"
                >
                  حفظ المصدر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* CANDIDATE CUSTOM REVIEW & APPROVE MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {reviewingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-amber-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-amber-950">مراجعة وتعديل تصنيف التطبيق المرشح</h3>
                <p className="text-xs text-slate-500 mt-0.5">التحقق من الفئات العمرية والمجال التعليمي قبل النشر العام</p>
              </div>
              <button
                onClick={() => setReviewingCandidate(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApproveCandidateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان التطبيق بالعربية: *</label>
                <input
                  type="text"
                  required
                  value={reviewingCandidate.title_ar}
                  onChange={(e) => setReviewingCandidate({ ...reviewingCandidate, title_ar: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوصف التعليمي: *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewingCandidate.description_ar || ''}
                  onChange={(e) => setReviewingCandidate({ ...reviewingCandidate, description_ar: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              {/* Age verification & override */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">توثيق الفئة العمرية المعلنة:</span>
                  <span className="text-xs font-bold text-amber-800">
                    من {reviewingCandidate.suggested_age_min} إلى {reviewingCandidate.suggested_age_max} سنوات
                  </span>
                </div>
                {reviewingCandidate.age_evidence && (
                  <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-amber-200/50">
                    <strong>الدليل الرسمي:</strong> {reviewingCandidate.age_evidence}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الحد الأدنى للعمر:</label>
                    <input
                      type="number"
                      min={2}
                      max={6}
                      value={reviewingCandidate.suggested_age_min}
                      onChange={(e) =>
                        setReviewingCandidate({
                          ...reviewingCandidate,
                          suggested_age_min: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الحد الأعلى للعمر:</label>
                    <input
                      type="number"
                      min={2}
                      max={6}
                      value={reviewingCandidate.suggested_age_max}
                      onChange={(e) =>
                        setReviewingCandidate({
                          ...reviewingCandidate,
                          suggested_age_max: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المجال التعليمي الأساسي:</label>
                <select
                  value={reviewingCandidate.suggested_category_id || categories[0]?.id}
                  onChange={(e) =>
                    setReviewingCandidate({ ...reviewingCandidate, suggested_category_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title_ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Categories Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  مجالات تعليمية إضافية ينتمي إليها التطبيق:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {categories
                    .filter((c) => c.id !== reviewingCandidate.suggested_category_id)
                    .map((c) => {
                      const isSelected = (reviewingCandidate.suggested_additional_categories || []).includes(c.id);
                      return (
                        <label key={c.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const current = reviewingCandidate.suggested_additional_categories || [];
                              const updated = e.target.checked
                                ? [...current, c.id]
                                : current.filter((id) => id !== c.id);
                              setReviewingCandidate({
                                ...reviewingCandidate,
                                suggested_additional_categories: updated,
                              });
                            }}
                            className="rounded text-amber-500 w-3.5 h-3.5"
                          />
                          <span>{c.title_ar}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewingCandidate(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد ونشر في المنصة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* REJECT CANDIDATE MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {candidateRejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <h3 className="text-base font-bold text-rose-950 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>تسجيل سبب رفض المورد التعليمي</span>
              </h3>
              <button
                onClick={() => setCandidateRejectId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              سيتم أرشفة هذا المرشح ولن يظهر في المنصة العامة للأطفال، وسيتم توثيق السبب في سجل التدقيق:
            </p>

            <textarea
              rows={3}
              required
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="مثال: الفئة العمرية غير مناسبة لرياض الأطفال، أو ظهور إعلانات تجارية..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCandidateRejectId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmRejectCandidate}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">تأكيد حذف النشاط</h3>
            <p className="text-xs text-slate-600">
              هل أنت متأكد من رغبتك في حذف هذا النشاط من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDeleteActivity(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
