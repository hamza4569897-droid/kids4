/**
 * Content Gap Analyzer for Little Stars (عالم الصغار)
 * Intelligently audits resource distribution across the 4 age brackets and 14 educational domains,
 * maps deficiencies to verified partner sources, executes targeted synchronization,
 * and reports before/after recovery metrics with rigorous COPPA/safety guardrails.
 */

import { AGE_BRACKETS, matchesAgeBracket, AgeBracket } from './classifier';
import { INITIAL_CATEGORIES } from '../../data/seedData';
import {
  getResources,
  getTrustedSources,
  recordAuditLog,
  isResourcePubliclySafe,
  safeStorage,
  getCategories,
} from '../storage';
import { executeSyncForSource } from './syncEngine';
import { ContentGapReport, GapMatrixEntry, GapFillResult } from '../../types/database';

const STORAGE_KEYS = {
  GAP_TARGET_THRESHOLD: 'little_stars_gap_target_threshold',
  LAST_GAP_REPORT: 'little_stars_last_gap_report',
};

const DEFAULT_TARGET_THRESHOLD = 5;

/**
 * Expert domain-to-source mapping for targeted gap resolution.
 * Each educational category is linked to official partner repositories that genuinely produce that content.
 */
export const CATEGORY_SOURCE_MAPPING: Record<string, string[]> = {
  'cat-arabic-alphabet': ['src-ahlan-simsim', 'src-rawdatuna', 'src-gdl-stories'],
  'cat-english-alphabet': ['src-starfall', 'src-khan-kids', 'src-cbeebies'],
  'cat-numbers-math': ['src-khan-kids', 'src-starfall', 'src-cbeebies', 'src-pbs-kids'],
  'cat-colors-shapes': ['src-pbs-kids', 'src-ahlan-simsim', 'src-khan-kids', 'src-starfall'],
  'cat-animals-nature': ['src-pbs-kids', 'src-cbeebies', 'src-khan-kids', 'src-nasa-kids'],
  'cat-science-discovery': ['src-nasa-kids', 'src-pbs-kids', 'src-khan-kids'],
  'cat-memory-focus': ['src-khan-kids', 'src-rawdatuna', 'src-cbeebies', 'src-pbs-kids'],
  'cat-drawing-coloring': ['src-khan-kids', 'src-pbs-kids', 'src-cbeebies'],
  'cat-stories-audio': ['src-gdl-stories', 'src-ahlan-simsim', 'src-starfall'],
  'cat-life-skills': ['src-cbeebies', 'src-rawdatuna', 'src-ahlan-simsim', 'src-pbs-kids'],
  'cat-emotions-social': ['src-ahlan-simsim', 'src-pbs-kids'],
  'cat-songs-music': ['src-ahlan-simsim', 'src-starfall', 'src-pbs-kids', 'src-cbeebies'],
  'cat-language-learning': ['src-gdl-stories', 'src-starfall', 'src-khan-kids', 'src-rawdatuna'],
  'cat-problem-solving': ['src-scratchjr', 'src-pbs-kids', 'src-cbeebies', 'src-khan-kids'],
};

/**
 * Gets the admin-configured minimum target threshold per category/age combination.
 */
export function getGapTargetThreshold(): number {
  try {
    const saved = safeStorage.getItem(STORAGE_KEYS.GAP_TARGET_THRESHOLD);
    if (saved) {
      const val = parseInt(saved, 10);
      if (!isNaN(val) && val > 0) return val;
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_TARGET_THRESHOLD;
}

/**
 * Sets the minimum target threshold per category/age combination.
 */
export function setGapTargetThreshold(threshold: number): void {
  const safeVal = Math.max(1, Math.min(50, Math.floor(threshold)));
  safeStorage.setItem(STORAGE_KEYS.GAP_TARGET_THRESHOLD, safeVal.toString());
}

/**
 * Analyzes content distribution and identifies gaps across the 4 age brackets and 14 categories.
 * Excludes duplicates, broken links, unverified age records, or unapproved candidate items.
 */
export async function analyzeContentGaps(targetThreshold?: number): Promise<ContentGapReport> {
  const threshold = targetThreshold ?? getGapTargetThreshold();
  const [allResources, categories, sources] = await Promise.all([
    getResources(true), // Load all resources
    getCategories(),
    getTrustedSources(),
  ]);

  // Publicly safe & approved resources only
  const validResources = allResources.filter(isResourcePubliclySafe);

  // Active categories only (exclude generic auxiliary buckets like worksheets)
  const educationalCategories = categories.filter(
    (c) => c.id !== 'cat-worksheets' && c.id !== 'cat-external-apps'
  );

  const matrix: GapMatrixEntry[] = [];
  let emptyCount = 0;
  let lowCount = 0;
  let sufficientCount = 0;
  let overallDeficit = 0;

  for (const bracket of AGE_BRACKETS) {
    for (const cat of educationalCategories) {
      // Find all valid approved resources covering this specific bracket and category
      const matched = validResources.filter((r) => {
        const matchesAge = matchesAgeBracket(r, bracket.id);
        const matchesCat =
          r.category_id === cat.id || (r.additional_categories || []).includes(cat.id);
        return matchesAge && matchesCat;
      });

      const count = matched.length;
      const deficit = Math.max(0, threshold - count);
      overallDeficit += deficit;

      let status: 'empty' | 'low' | 'sufficient' = 'sufficient';
      if (count === 0) {
        status = 'empty';
        emptyCount++;
      } else if (count < threshold) {
        status = 'low';
        lowCount++;
      } else {
        sufficientCount++;
      }

      // Map recommended sources for this category
      const rawRecSources = CATEGORY_SOURCE_MAPPING[cat.id] || [];
      // Keep only active registered sources
      const availableSources = rawRecSources.filter((sId) => {
        const s = sources.find((src) => src.id === sId);
        return s && s.is_active;
      });

      matrix.push({
        ageBracketId: bracket.id,
        ageBracketLabel: bracket.label_ar,
        categoryId: cat.id,
        categoryTitleAr: cat.title_ar,
        currentCount: count,
        targetThreshold: threshold,
        deficit,
        status,
        recommendedSourceIds: availableSources.length > 0 ? availableSources : rawRecSources,
        sampleResourceTitles: matched.slice(0, 3).map((m) => m.title_ar),
      });
    }
  }

  // Aggregate deficits by Category
  const categoryDeficitMap = new Map<string, { titleAr: string; totalDeficit: number; currentCount: number }>();
  matrix.forEach((entry) => {
    const existing = categoryDeficitMap.get(entry.categoryId) || {
      titleAr: entry.categoryTitleAr,
      totalDeficit: 0,
      currentCount: 0,
    };
    existing.totalDeficit += entry.deficit;
    existing.currentCount += entry.currentCount;
    categoryDeficitMap.set(entry.categoryId, existing);
  });

  const topDeficientCategories = Array.from(categoryDeficitMap.entries())
    .map(([categoryId, data]) => ({ categoryId, ...data }))
    .sort((a, b) => b.totalDeficit - a.totalDeficit);

  // Aggregate deficits by Age Bracket
  const bracketDeficitMap = new Map<string, { label: string; totalDeficit: number; currentCount: number }>();
  matrix.forEach((entry) => {
    const existing = bracketDeficitMap.get(entry.ageBracketId) || {
      label: entry.ageBracketLabel,
      totalDeficit: 0,
      currentCount: 0,
    };
    existing.totalDeficit += entry.deficit;
    existing.currentCount += entry.currentCount;
    bracketDeficitMap.set(entry.ageBracketId, existing);
  });

  const topDeficientBrackets = Array.from(bracketDeficitMap.entries())
    .map(([bracketId, data]) => ({ bracketId, ...data }))
    .sort((a, b) => b.totalDeficit - a.totalDeficit);

  const report: ContentGapReport = {
    timestamp: new Date().toISOString(),
    targetThreshold: threshold,
    totalCombinations: matrix.length,
    emptyCombinations: emptyCount,
    lowCombinations: lowCount,
    sufficientCombinations: sufficientCount,
    overallDeficit,
    matrix,
    topDeficientCategories,
    topDeficientBrackets,
  };

  try {
    safeStorage.setItem(STORAGE_KEYS.LAST_GAP_REPORT, JSON.stringify(report));
  } catch (e) {
    console.error(e);
  }

  return report;
}

export interface FillGapsOptions {
  targetAgeBracketId?: string;
  targetCategoryId?: string;
  specificSourceIds?: string[];
  targetThreshold?: number;
  adminEmail?: string;
}

/**
 * Intelligently fills content gaps:
 * 1. Analyzes current deficiencies before sync.
 * 2. Identifies and executes sync on relevant sources only.
 * 3. Applies strict deduplication and safety verification.
 * 4. Re-computes gap analysis after sync.
 * 5. Compares before and after, returning an audited summary of improvements and remaining gaps.
 */
export async function fillContentGaps(options: FillGapsOptions = {}): Promise<GapFillResult> {
  const startedAt = new Date().toISOString();
  const threshold = options.targetThreshold ?? getGapTargetThreshold();

  // 1. Snapshot Before Sync
  const beforeReport = await analyzeContentGaps(threshold);

  // 2. Determine Which Sources to Trigger
  const sourcesToTrigger = new Set<string>();

  if (options.specificSourceIds && options.specificSourceIds.length > 0) {
    options.specificSourceIds.forEach((id) => sourcesToTrigger.add(id));
  } else if (options.targetCategoryId) {
    // Targeted sync for a single category
    const mapped = CATEGORY_SOURCE_MAPPING[options.targetCategoryId] || [];
    mapped.forEach((id) => sourcesToTrigger.add(id));
  } else {
    // Global deficit-driven sync: gather sources for all empty or low categories
    beforeReport.matrix
      .filter((m) => m.status !== 'sufficient')
      .forEach((m) => {
        m.recommendedSourceIds.forEach((sId) => sourcesToTrigger.add(sId));
      });
  }

  // Fallback if none found: sync all active sources
  if (sourcesToTrigger.size === 0) {
    const allSources = await getTrustedSources();
    allSources.filter((s) => s.is_active).forEach((s) => sourcesToTrigger.add(s.id));
  }

  // Filter sources to ensure they are active
  const allSources = await getTrustedSources();
  const activeSources = allSources.filter((s) => s.is_active && sourcesToTrigger.has(s.id));

  let itemsFound = 0;
  let itemsNew = 0;
  let itemsUpdated = 0;
  let itemsImported = 0;
  let itemsDuplicatesIgnored = 0;
  let itemsFlagged = 0;
  const triggeredSourceIds: string[] = [];

  // 3. Execute Discovery & Sync on the selected sources
  for (const src of activeSources) {
    triggeredSourceIds.push(src.id);
    try {
      const res = await executeSyncForSource(src.id, options.adminEmail || 'gap_analyzer_engine');
      itemsFound += res.itemsFound;
      itemsNew += res.itemsNew;
      itemsUpdated += res.itemsUpdated;
      itemsImported += res.itemsImported;
      itemsDuplicatesIgnored += res.itemsDuplicatesIgnored;
      itemsFlagged += res.itemsFlaggedForReview;
    } catch (err) {
      console.error(`خطأ أثناء مزامنة المصدر (${src.name}) لسد الفجوة:`, err);
    }
  }

  // 4. Snapshot After Sync
  const afterReport = await analyzeContentGaps(threshold);
  const completedAt = new Date().toISOString();

  // 5. Compare Before and After
  const improvedCombinations: GapFillResult['improvedCombinations'] = [];
  const remainingDeficiencies: GapFillResult['remainingDeficiencies'] = [];

  afterReport.matrix.forEach((afterEntry) => {
    const beforeEntry = beforeReport.matrix.find(
      (b) => b.ageBracketId === afterEntry.ageBracketId && b.categoryId === afterEntry.categoryId
    );

    const beforeCount = beforeEntry ? beforeEntry.currentCount : 0;
    const afterCount = afterEntry.currentCount;

    if (afterCount > beforeCount) {
      improvedCombinations.push({
        ageBracketId: afterEntry.ageBracketId,
        categoryId: afterEntry.categoryId,
        categoryTitleAr: afterEntry.categoryTitleAr,
        beforeCount,
        afterCount,
      });
    }

    if (afterEntry.status !== 'sufficient') {
      let reason = 'المصادر المتاحة حالياً لا توفر تطبيقات مجانية معتمدة إضافية بدون إعلانات لهذه الفئة.';
      if (afterEntry.currentCount === 0) {
        reason = 'فئة فارغة: لم يتم العثور على أي تطبيق مجاني موثق دليل عمره بدقة ومطابق لمعايير COPPA حتى الآن.';
      } else {
        reason = `تم توفير ${afterEntry.currentCount} من أصل الهدف (${threshold})، ونظام الأمان يمنع اختلاق بيانات وهمية.`;
      }

      remainingDeficiencies.push({
        ageBracketId: afterEntry.ageBracketId,
        categoryId: afterEntry.categoryId,
        categoryTitleAr: afterEntry.categoryTitleAr,
        currentCount: afterEntry.currentCount,
        targetCount: threshold,
        reason,
      });
    }
  });

  // Record Admin Audit Log
  await recordAuditLog(
    'fill_content_gaps',
    'educational_resources',
    undefined,
    {
      triggeredSources: triggeredSourceIds,
      itemsImported,
      improvedGapsCount: improvedCombinations.length,
      remainingDeficienciesCount: remainingDeficiencies.length,
      threshold,
    },
    options.adminEmail || 'system_gap_analyzer'
  );

  return {
    startedAt,
    completedAt,
    targetThreshold: threshold,
    triggeredSources: triggeredSourceIds,
    itemsFound,
    itemsNew,
    itemsUpdated,
    itemsImported,
    itemsDuplicatesIgnored,
    itemsFlagged,
    improvedGapsCount: improvedCombinations.length,
    improvedCombinations,
    remainingDeficiencies,
    beforeSummary: {
      empty: beforeReport.emptyCombinations,
      low: beforeReport.lowCombinations,
      sufficient: beforeReport.sufficientCombinations,
    },
    afterSummary: {
      empty: afterReport.emptyCombinations,
      low: afterReport.lowCombinations,
      sufficient: afterReport.sufficientCombinations,
    },
  };
}
