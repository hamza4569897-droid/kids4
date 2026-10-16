/**
 * Little Stars — Automated Discovery & Ingestion Sync Engine
 * Coordinates discovery, deduplication, auto-classification, and database ingestion.
 */

import { supabase, isSupabaseConfigured } from '../supabase';
import {
  TrustedSource,
  EducationalResource,
  ImportCandidate,
  SyncRun,
} from '../../types/database';
import {
  getTrustedSources,
  updateTrustedSource,
  saveResource,
  recordAuditLog,
  getAllResourcesForAdmin,
  getCandidates,
} from '../storage';
import { fetchCandidatesFromSource } from './sourceConnectors';
import { classifyDiscoveredApp } from './classifier';
import { evaluateAutoPublish } from './gatekeeper';

export interface SyncRunDetailedResult {
  runId: string;
  sourceId: string;
  sourceName: string;
  status: 'success' | 'failed';
  itemsFound: number;
  itemsNew: number;
  itemsUpdated: number;
  itemsDuplicatesIgnored: number;
  itemsImported: number;
  itemsFlaggedForReview: number;
  errorMessage?: string;
  startedAt: string;
  completedAt: string;
}

/**
 * Executes discovery and synchronization for a single trusted source.
 */
export async function executeSyncForSource(
  sourceId: string,
  adminEmail?: string
): Promise<SyncRunDetailedResult> {
  const sources = await getTrustedSources();
  const source = sources.find((s) => s.id === sourceId);

  if (!source) {
    throw new Error(`المصدر المعرف برقم (${sourceId}) غير موجود في النظام.`);
  }

  if (!source.is_active) {
    throw new Error(`المصدر (${source.name}) معطل حالياً. يرجى تفعيله أولاً من لوحة الأدمن قبل المزامنة.`);
  }

  const runId = `run-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const startedAt = new Date().toISOString();

  // Initialize sync run record
  const initialRunRecord: SyncRun = {
    id: runId,
    source_id: source.id,
    started_at: startedAt,
    status: 'running',
    items_found: 0,
    items_imported: 0,
    items_flagged: 0,
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('sync_runs').insert(initialRunRecord);
    } catch (e) {
      console.warn('تعذر تسجيل بدء المزامنة في Supabase:', e);
    }
  }

  let itemsFound = 0;
  let itemsNew = 0;
  let itemsUpdated = 0;
  let itemsDuplicatesIgnored = 0;
  let itemsImported = 0;
  let itemsFlaggedForReview = 0;

  try {
    // 1. Fetch raw candidates from source connector
    const rawApps = await fetchCandidatesFromSource(source);
    itemsFound = rawApps.length;

    // 2. Fetch existing resources and candidates for deduplication
    let existingResources: EducationalResource[] = [];
    let existingCandidates: ImportCandidate[] = [];

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: resData, error: resErr } = await supabase.from('educational_resources').select('*');
        if (!resErr && resData && resData.length > 0) {
          existingResources = resData as EducationalResource[];
        } else {
          existingResources = await getAllResourcesForAdmin();
        }

        const { data: candData, error: candErr } = await supabase.from('import_candidates').select('*');
        if (!candErr && candData && candData.length > 0) {
          existingCandidates = candData as ImportCandidate[];
        } else {
          existingCandidates = await getCandidates();
        }
      } catch (e) {
        console.warn('تعذر استعلام البيانات السابقة لمنع التكرار:', e);
        existingResources = await getAllResourcesForAdmin();
        existingCandidates = await getCandidates();
      }
    } else {
      existingResources = await getAllResourcesForAdmin();
      existingCandidates = await getCandidates();
    }

    // 3. Process each discovered app through deduplication, classifier & gatekeeper
    for (const rawApp of rawApps) {
      const normalizedSlug = (rawApp.external_id || rawApp.title_en)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if exists in educational_resources
      const existingRes = existingResources.find(
        (r) =>
          r.source_url === rawApp.url ||
          r.launch_url === rawApp.url ||
          r.slug === normalizedSlug
      );

      // Check if exists in import_candidates
      const existingCand = existingCandidates.find(
        (c) =>
          c.candidate_url === rawApp.url ||
          (c.external_id && c.external_id === rawApp.external_id)
      );

      // Run classification
      const classification = classifyDiscoveredApp(rawApp);
      // Run auto-publish gatekeeper
      const evaluation = evaluateAutoPublish(rawApp, classification, source);

      if (existingRes) {
        // App already published in educational_resources: Check for updates
        const needsUpdate =
          existingRes.description_ar !== (rawApp.description_ar || existingRes.description_ar) ||
          existingRes.title_ar !== (rawApp.title_ar || existingRes.title_ar) ||
          JSON.stringify(existingRes.supported_platforms || []) !== JSON.stringify(classification.supported_platforms || []);

        if (needsUpdate) {
          const updatedResource: EducationalResource = {
            ...existingRes,
            title_ar: rawApp.title_ar || existingRes.title_ar,
            description_ar: rawApp.description_ar || existingRes.description_ar,
            supported_platforms: classification.supported_platforms,
            last_verified_at: classification.last_verified_at,
            age_evidence_source: classification.ageVerificationEvidence,
            updated_at: new Date().toISOString(),
          };
          await saveResource(updatedResource);
          itemsUpdated++;
        } else {
          // Exactly identical: safely ignore duplicate
          itemsDuplicatesIgnored++;
        }
        continue;
      }

      if (existingCand) {
        // App already waiting in candidates list: duplicate ignored
        itemsDuplicatesIgnored++;
        continue;
      }

      // Brand new discovery!
      itemsNew++;

      if (evaluation.canAutoPublish) {
        // Auto-Publish Criteria satisfied 100%!
        const newResource: EducationalResource = {
          id: `res-auto-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title_ar: rawApp.title_ar || rawApp.title_en,
          title_en: rawApp.title_en,
          slug: normalizedSlug || `app-${Date.now()}`,
          description_ar:
            rawApp.description_ar ||
            `تطبيق تعليمي تفاعلي معتمد ومراجع من ${source.name} للأطفال في سن الروضة.`,
          description_en: rawApp.description_en,
          age_min: classification.age_min,
          age_max: classification.age_max,
          category_id: classification.categoryId,
          additional_categories: classification.additionalCategories,
          content_type: 'external_app',
          launch_type: 'external_tab',
          launch_url: rawApp.url,
          thumbnail_url: rawApp.thumbnail_url,
          provider_name: rawApp.developer_name || source.name,
          source_url: rawApp.url,
          source_type: source.source_type === 'api' ? 'api' : 'partner_dataset',
          language: classification.detectedLanguage,
          is_free: rawApp.is_free !== false,
          learning_objectives: classification.learningObjectives,
          estimated_duration_minutes: 10,
          accessibility_notes: [
            ...classification.safetyFlags,
            ...evaluation.passedChecks,
          ],
          licensing_status: 'official_partner',
          review_status: 'approved',
          safety_reviewed_at: new Date().toISOString(),
          is_featured: false,
          published_at: new Date().toISOString(),
          supported_platforms: classification.supported_platforms,
          last_verified_at: classification.last_verified_at,
          age_evidence_source: classification.ageVerificationEvidence,
          age_evidence_date: new Date().toISOString(),
          privacy_policy_url: rawApp.privacy_policy_url,
          has_in_app_ads: false,
          has_in_app_purchases: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        await saveResource(newResource);
        itemsImported++;
      } else {
        // Did not satisfy all auto-publish rules: Route to import_candidates for human admin review
        const newCandidate: ImportCandidate = {
          id: `cand-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          source_id: source.id,
          external_id: rawApp.external_id,
          title_ar: rawApp.title_ar || rawApp.title_en,
          title_en: rawApp.title_en,
          description_ar: rawApp.description_ar || 'تطبيق جديد بحاجة لاعتماد المشرف.',
          candidate_url: rawApp.url,
          thumbnail_url: rawApp.thumbnail_url,
          provider_name: rawApp.developer_name || source.name,
          suggested_age_min: classification.age_min,
          suggested_age_max: classification.age_max,
          suggested_category_id: classification.categoryId,
          suggested_additional_categories: classification.additionalCategories,
          supported_platforms: classification.supported_platforms,
          licensing_evidence: rawApp.licensing_terms || source.licensing_terms_summary,
          age_evidence: classification.ageVerificationEvidence,
          safety_flags: [
            ...classification.safetyFlags,
            `درجة الأمان: ${evaluation.safetyScore}%`,
            ...(evaluation.rejectionOrFlagReason ? [`ملحوظة مراجعة: ${evaluation.rejectionOrFlagReason}`] : []),
          ],
          status: 'pending',
          discovered_at: new Date().toISOString(),
        };

        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('import_candidates').insert(newCandidate);
          } catch (e) {
            console.warn('تعذر حفظ المرشح في Supabase:', e);
          }
        }
        itemsFlaggedForReview++;
      }
    }

    const completedAt = new Date().toISOString();

    // Summary details formatted for sync_runs
    const runSummary = `تم بنجاح: ${itemsNew} جديد (${itemsImported} نُشر تلقائياً، ${itemsFlaggedForReview} بحاجة لمراجعة)، ${itemsUpdated} تم تحديثه، ${itemsDuplicatesIgnored} مكرر تم تجاهله.`;

    // 4. Update sync_runs record
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('sync_runs')
          .update({
            completed_at: completedAt,
            status: 'success',
            items_found: itemsFound,
            items_imported: itemsImported,
            items_flagged: itemsFlaggedForReview,
            error_message: runSummary,
          })
          .eq('id', runId);
      } catch (e) {
        console.warn('تعذر تحديث sync_runs في Supabase:', e);
      }
    }

    // 5. Update source last_synced_at
    source.last_synced_at = completedAt;
    await updateTrustedSource(source);

    // 6. Record audit log
    await recordAuditLog(
      'مزامنة واكتشاف التطبيقات التعليمية',
      'trusted_sources',
      source.id,
      {
        source: source.name,
        itemsFound,
        itemsImported,
        itemsFlaggedForReview,
        itemsUpdated,
        itemsDuplicatesIgnored,
      },
      adminEmail
    );

    return {
      runId,
      sourceId: source.id,
      sourceName: source.name,
      status: 'success',
      itemsFound,
      itemsNew,
      itemsUpdated,
      itemsDuplicatesIgnored,
      itemsImported,
      itemsFlaggedForReview,
      errorMessage: runSummary,
      startedAt,
      completedAt,
    };
  } catch (err: any) {
    const completedAt = new Date().toISOString();
    const errorMsg = `فشلت المزامنة: ${err.message || 'خطأ غير معروف'}`;

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('sync_runs')
          .update({
            completed_at: completedAt,
            status: 'failed',
            items_found: itemsFound,
            items_imported: itemsImported,
            items_flagged: itemsFlaggedForReview,
            error_message: errorMsg,
          })
          .eq('id', runId);
      } catch {
        // ignore
      }
    }

    await recordAuditLog(
      'فشل مزامنة المصدر',
      'trusted_sources',
      source.id,
      { error: errorMsg },
      adminEmail
    );

    return {
      runId,
      sourceId: source.id,
      sourceName: source.name,
      status: 'failed',
      itemsFound,
      itemsNew,
      itemsUpdated,
      itemsDuplicatesIgnored,
      itemsImported,
      itemsFlaggedForReview,
      errorMessage: errorMsg,
      startedAt,
      completedAt,
    };
  }
}

/**
 * Triggers sync across all active sources.
 */
export async function executeSyncAllActiveSources(
  adminEmail?: string
): Promise<SyncRunDetailedResult[]> {
  const sources = await getTrustedSources();
  const activeSources = sources.filter((s) => s.is_active);
  const results: SyncRunDetailedResult[] = [];

  for (const src of activeSources) {
    try {
      const res = await executeSyncForSource(src.id, adminEmail);
      results.push(res);
    } catch (e: any) {
      results.push({
        runId: `run-err-${Date.now()}`,
        sourceId: src.id,
        sourceName: src.name,
        status: 'failed',
        itemsFound: 0,
        itemsNew: 0,
        itemsUpdated: 0,
        itemsDuplicatesIgnored: 0,
        itemsImported: 0,
        itemsFlaggedForReview: 0,
        errorMessage: e.message || 'خطأ في تشغيل المصدر',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });
    }
  }

  return results;
}

/**
 * Retrieves latest sync run history from Supabase with local fallback.
 */
export async function getSyncRuns(): Promise<SyncRun[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('sync_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        return data as SyncRun[];
      }
    } catch {
      // ignore
    }
  }

  return [
    {
      id: 'run-seed-1',
      source_id: 'src-khan-kids',
      started_at: new Date(Date.now() - 3600000).toISOString(),
      completed_at: new Date(Date.now() - 3540000).toISOString(),
      status: 'success',
      items_found: 3,
      items_imported: 2,
      items_flagged: 1,
      error_message: 'اكتملت المزامنة بنجاح واستوردت التطبيقات المعتمدة.',
    },
  ];
}
