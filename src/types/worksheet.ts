export type AgeGroup = '2-3' | '3-4' | '4-5' | '5-6';

export type WorksheetActivityType =
  | 'matching' // توصيل
  | 'pair_matching' // مطابقة
  | 'categorization' // تصنيف
  | 'odd_one_out' // اكتشف المختلف
  | 'complete_pattern' // أكمل النمط
  | 'counting_quantities' // العد والكميات
  | 'arabic_letters' // الحروف العربية
  | 'english_letters' // الحروف الإنجليزية
  | 'mazes' // المتاهات
  | 'directed_coloring' // التلوين الموجه
  | 'line_tracing' // تتبع الخطوط
  | 'visual_puzzles' // الألغاز البصرية
  | 'event_sequencing' // ترتيب الأحداث
  | 'science_nature' // العلوم والطبيعة
  | 'life_skills' // المهارات الحياتية
  | 'emotions' // المشاعر
  | 'picture_stories' // القصص المصورة
  | 'school_readiness' // الاستعداد للمدرسة
  | 'logical_thinking' // التفكير المنطقي
  | 'comprehensive_assessment'; // اختبارات شاملة

export type WorksheetLayoutType =
  | 'matching_board'
  | 'card_grid'
  | 'maze_path'
  | 'scene_discovery'
  | 'group_clusters'
  | 'sequence_strip'
  | 'number_grid'
  | 'tracing_sheet'
  | 'classification_table'
  | 'comic_strip'
  | 'coloring_canvas'
  | 'visual_puzzle'
  | 'cut_and_paste'
  | 'assessment_suite';

export type WorksheetDifficulty = 'مبتدئ' | 'متوسط' | 'متقدم';

export interface WorksheetQuestionItem {
  id: string;
  prompt: string;
  visual?: string; // emoji or SVG key or text illustration
  options?: Array<{
    id: string;
    label: string;
    visual?: string;
    isCorrect?: boolean;
  }>;
  correctAnswer?: string;
  matchPairs?: Array<{
    leftId: string;
    leftLabel: string;
    leftVisual: string;
    rightId: string;
    rightLabel: string;
    rightVisual: string;
  }>;
  sequenceSteps?: Array<{
    id: string;
    label: string;
    visual: string;
    order: number;
  }>;
  tracingPaths?: Array<{
    label: string;
    shape: 'straight' | 'curve' | 'zigzag' | 'circle' | 'letter' | 'number';
    content?: string;
  }>;
  classificationGroups?: Array<{
    groupName: string;
    items: Array<{ id: string; label: string; visual: string }>;
  }>;
  explanationOrHint?: string;
}

export interface Worksheet {
  id: string;
  title: string;
  slug: string;
  ageGroup: AgeGroup;
  ageGroupLabel: string; // e.g. "من سنتين إلى أقل من 3 سنوات"
  activityType: WorksheetActivityType;
  activityTypeLabel: string; // e.g. "التوصيل"
  layoutType: WorksheetLayoutType;
  layoutLabel: string; // e.g. "لوحة مطابقة بالصور"
  difficulty: WorksheetDifficulty;
  objective: string; // الهدف التعليمي الدقيق
  skillsMeasured: string[]; // المهارات المقاسة
  answerMethod: string; // طريقة الإجابة (إشارة، توصيل، تلوين، دوائر، كتابة)
  parentInstructions: string; // إرشادات موجهة لولي الأمر / المعلم
  isAssessment: boolean; // هل هي ورقة اختبار تقييمي؟
  assessmentGuide?: {
    totalScore: number;
    evaluationCriteria: string[];
    answerKey: string[];
    teacherNotes: string;
  };
  questions: WorksheetQuestionItem[];
  themeColor: 'amber' | 'emerald' | 'sky' | 'purple' | 'rose' | 'orange' | 'indigo' | 'teal';
  cutAndPasteAvailable?: boolean;
}

export interface WorksheetFilterState {
  ageGroup: AgeGroup | 'all';
  activityType: WorksheetActivityType | 'all';
  difficulty: WorksheetDifficulty | 'all';
  searchQuery: string;
  onlyAssessments: boolean;
  onlyInteractive: boolean;
}
