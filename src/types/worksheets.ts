export type AgeGroupId = '2-3' | '3-4' | '4-5' | '5-6';

export type WorksheetCategoryId =
  | 'arabic-letters'
  | 'english-letters'
  | 'math-numbers'
  | 'colors-shapes'
  | 'animals-nature'
  | 'drawing-coloring'
  | 'matching-memory'
  | 'mazes-puzzles'
  | 'science-discovery'
  | 'life-skills'
  | 'emotions-communication'
  | 'islamic-values';

export type DifficultyLevel = 'beginner' | 'easy' | 'medium' | 'advanced';

export type ExerciseType =
  | 'tracing'
  | 'coloring'
  | 'matching'
  | 'counting'
  | 'maze'
  | 'pattern'
  | 'sorting'
  | 'comparison'
  | 'word_building'
  | 'etiquette'
  | 'science_cycle';

export interface WorksheetExerciseData {
  instructions: string;
  bannerEmoji: string;
  accentColor: string; // e.g. '#f59e0b', '#3b82f6', '#10b981'
  items?: {
    id: string;
    label?: string;
    sublabel?: string;
    icon?: string;
    targetValue?: string;
    shapeType?: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'rectangle';
    colorCode?: string;
    dottedText?: string;
    pairId?: string;
    svgIllustration?: string;
    count?: number;
    options?: string[];
  }[];
  columns?: {
    leftCol: { id: string; text: string; icon?: string }[];
    rightCol: { id: string; text: string; icon?: string; matchId: string }[];
  };
  mazeData?: {
    startLabel: string;
    startIcon: string;
    endLabel: string;
    endIcon: string;
    difficultyGridSize: number; // 3 to 6
    pathDescription: string;
  };
  wordData?: {
    targetWord: string;
    breakdown: string[];
    meaningIcon: string;
    vowelsHint?: string;
  };
  etiquetteSteps?: {
    stepNumber: number;
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface Worksheet {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  ageGroupId: AgeGroupId;
  ageRangeAr: string;
  category: WorksheetCategoryId;
  categoryAr: string;
  categoryIcon: string;
  difficulty: DifficultyLevel;
  difficultyAr: string;
  difficultyBadgeColor: string;
  summaryAr: string;
  learningObjectiveAr: string;
  parentTipAr: string;
  exerciseType: ExerciseType;
  exerciseData: WorksheetExerciseData;
  downloadsCount: number;
  printCount: number;
  featured: boolean;
  keywords: string[];
}

export interface AgeGroupMeta {
  id: AgeGroupId;
  titleAr: string;
  subtitleAr: string;
  badge: string;
  icon: string;
  color: string;
  accentBg: string;
  descriptionAr: string;
}

export interface CategoryMeta {
  id: WorksheetCategoryId;
  titleAr: string;
  icon: string;
  color: string;
  bgLight: string;
}
