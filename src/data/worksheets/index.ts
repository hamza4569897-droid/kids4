import { Worksheet, AgeGroup, WorksheetActivityType } from '../../types/worksheet';
import { worksheetsAge2to3 } from './age2to3';
import { worksheetsAge3to4 } from './age3to4';
import { worksheetsAge4to5 } from './age4to5';
import { worksheetsAge5to6 } from './age5to6';
import { validateWorksheetCatalog, UniquenessValidationReport } from './validator';

export const ALL_WORKSHEETS: Worksheet[] = [
  ...worksheetsAge2to3,
  ...worksheetsAge3to4,
  ...worksheetsAge4to5,
  ...worksheetsAge5to6
];

// Pre-computed validation report confirming 0 duplicates and diverse distributions
export const WORKSHEET_CATALOG_REPORT: UniquenessValidationReport = validateWorksheetCatalog(ALL_WORKSHEETS);

/**
 * Filter worksheets by age, activity type, difficulty, search keyword, and assessment flag
 */
export function filterWorksheets(options: {
  ageGroup?: AgeGroup | 'all';
  activityType?: WorksheetActivityType | 'all';
  difficulty?: string | 'all';
  searchQuery?: string;
  onlyAssessments?: boolean;
}): Worksheet[] {
  let list = ALL_WORKSHEETS;

  if (options.ageGroup && options.ageGroup !== 'all') {
    list = list.filter((w) => w.ageGroup === options.ageGroup);
  }

  if (options.activityType && options.activityType !== 'all') {
    list = list.filter((w) => w.activityType === options.activityType);
  }

  if (options.difficulty && options.difficulty !== 'all') {
    list = list.filter((w) => w.difficulty === options.difficulty);
  }

  if (options.onlyAssessments) {
    list = list.filter((w) => w.isAssessment);
  }

  if (options.searchQuery && options.searchQuery.trim()) {
    const q = options.searchQuery.trim().toLowerCase();
    list = list.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.objective.toLowerCase().includes(q) ||
        w.skillsMeasured.some((s) => s.toLowerCase().includes(q)) ||
        w.activityTypeLabel.toLowerCase().includes(q)
    );
  }

  return list;
}

/**
 * Retrieve diagnostic assessment tests tailored for children
 */
export function getAssessmentWorksheets(): Worksheet[] {
  return ALL_WORKSHEETS.filter((w) => w.isAssessment);
}

/**
 * Find a single worksheet by id or slug
 */
export function getWorksheetById(id: string): Worksheet | undefined {
  return ALL_WORKSHEETS.find((w) => w.id === id || w.slug === id);
}

export {
  worksheetsAge2to3,
  worksheetsAge3to4,
  worksheetsAge4to5,
  worksheetsAge5to6
};
