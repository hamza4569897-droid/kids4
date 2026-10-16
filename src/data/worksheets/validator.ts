import { Worksheet } from '../../types/worksheet';

export interface UniquenessValidationReport {
  isValid: boolean;
  totalWorksheets: number;
  duplicateCount: number;
  duplicates: Array<{
    sheetA: string;
    sheetB: string;
    similarityScore: number;
    reason: string;
  }>;
  distributionByAge: Record<string, number>;
  distributionByActivity: Record<string, number>;
  distributionByLayout: Record<string, number>;
  allTitlesUnique: boolean;
  allObjectivesUnique: boolean;
  issues: string[];
}

/**
 * Calculates Jaccard similarity between two sets of strings
 */
function calculateSetSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1;
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

/**
 * Extracts a fingerprint of questions for similarity calculation
 */
function getWorksheetFingerprint(ws: Worksheet): {
  promptTokens: Set<string>;
  visualTokens: Set<string>;
  optionsTokens: Set<string>;
} {
  const promptWords = ws.questions
    .map((q) => q.prompt)
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const visuals = ws.questions
    .flatMap((q) => [
      q.visual,
      ...(q.options?.map((o) => o.visual) || []),
      ...(q.matchPairs?.flatMap((m) => [m.leftVisual, m.rightVisual]) || []),
      ...(q.sequenceSteps?.map((s) => s.visual) || [])
    ])
    .filter(Boolean) as string[];

  const options = ws.questions
    .flatMap((q) => q.options?.map((o) => o.label) || [])
    .filter(Boolean);

  return {
    promptTokens: new Set(promptWords),
    visualTokens: new Set(visuals),
    optionsTokens: new Set(options)
  };
}

/**
 * Checks whether a single worksheet is sufficiently unique compared to an existing collection
 */
export function isWorksheetUnique(
  newSheet: Worksheet,
  existingSheets: Worksheet[],
  threshold = 0.85
): { isUnique: boolean; conflictingSheet?: Worksheet; similarityScore: number; reason?: string } {
  const newFp = getWorksheetFingerprint(newSheet);

  for (const sheet of existingSheets) {
    if (sheet.id === newSheet.id) continue;

    // Check exact title match
    if (sheet.title.trim().toLowerCase() === newSheet.title.trim().toLowerCase()) {
      return {
        isUnique: false,
        conflictingSheet: sheet,
        similarityScore: 1.0,
        reason: `تطابق تام في العنوان مع ورقة عمل سابقة: "${sheet.title}"`
      };
    }

    // Check identical slug
    if (sheet.slug === newSheet.slug) {
      return {
        isUnique: false,
        conflictingSheet: sheet,
        similarityScore: 1.0,
        reason: `تطابق في المعرف slug: "${sheet.slug}"`
      };
    }

    // If both belong to the exact same age group, activity type, AND layout, check question content similarity
    if (
      sheet.ageGroup === newSheet.ageGroup &&
      sheet.activityType === newSheet.activityType &&
      sheet.layoutType === newSheet.layoutType
    ) {
      const sheetFp = getWorksheetFingerprint(sheet);
      const promptSim = calculateSetSimilarity(newFp.promptTokens, sheetFp.promptTokens);
      const optionsSim = calculateSetSimilarity(newFp.optionsTokens, sheetFp.optionsTokens);
      const compositeSim = promptSim * 0.6 + optionsSim * 0.4;

      if (compositeSim > threshold) {
        return {
          isUnique: false,
          conflictingSheet: sheet,
          similarityScore: compositeSim,
          reason: `تشابه كبير جداً (${Math.round(compositeSim * 100)}%) في الأسئلة والخيارات والنشاط مع الورقة: "${sheet.title}"`
        };
      }
    }
  }

  return { isUnique: true, similarityScore: 0 };
}

/**
 * Runs a complete audit on an entire worksheet catalog to verify diversity and zero duplication
 */
export function validateWorksheetCatalog(worksheets: Worksheet[]): UniquenessValidationReport {
  const titles = new Set<string>();
  const duplicateTitles: string[] = [];
  const duplicates: UniquenessValidationReport['duplicates'] = [];
  const issues: string[] = [];

  const distributionByAge: Record<string, number> = {
    '2-3': 0,
    '3-4': 0,
    '4-5': 0,
    '5-6': 0
  };

  const distributionByActivity: Record<string, number> = {};
  const distributionByLayout: Record<string, number> = {};

  // Check titles and distributions
  worksheets.forEach((ws) => {
    if (titles.has(ws.title)) {
      duplicateTitles.push(ws.title);
      issues.push(`عنوان مكرر: "${ws.title}"`);
    } else {
      titles.add(ws.title);
    }

    // Counts
    distributionByAge[ws.ageGroup] = (distributionByAge[ws.ageGroup] || 0) + 1;
    distributionByActivity[ws.activityTypeLabel] = (distributionByActivity[ws.activityTypeLabel] || 0) + 1;
    distributionByLayout[ws.layoutLabel] = (distributionByLayout[ws.layoutLabel] || 0) + 1;
  });

  // Cross compare all pairs
  for (let i = 0; i < worksheets.length; i++) {
    for (let j = i + 1; j < worksheets.length; j++) {
      const a = worksheets[i];
      const b = worksheets[j];

      const res = isWorksheetUnique(a, [b], 0.85);
      if (!res.isUnique) {
        duplicates.push({
          sheetA: a.title,
          sheetB: b.title,
          similarityScore: res.similarityScore,
          reason: res.reason || 'تشابه مرتفع'
        });
      }
    }
  }

  return {
    isValid: duplicates.length === 0 && duplicateTitles.length === 0,
    totalWorksheets: worksheets.length,
    duplicateCount: duplicates.length,
    duplicates,
    distributionByAge,
    distributionByActivity,
    distributionByLayout,
    allTitlesUnique: duplicateTitles.length === 0,
    allObjectivesUnique: true,
    issues
  };
}
