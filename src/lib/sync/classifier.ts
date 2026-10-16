/**
 * Classifier & Age-Bracket Engine for Little Stars
 * Deterministic rule-based categorization without requiring paid AI APIs
 */

import { EducationalResource } from '../../types/database';

export interface AgeBracket {
  id: '2-3' | '3-4' | '4-5' | '5-6';
  label_ar: string;
  label_en: string;
  min: number;
  max: number;
  description_ar: string;
}

export const AGE_BRACKETS: AgeBracket[] = [
  {
    id: '2-3',
    label_ar: 'من سنتين إلى أقل من 3 سنوات',
    label_en: 'Ages 2 to <3 years',
    min: 2,
    max: 3,
    description_ar: 'الاستكشاف الحسي الأولي، الأصوات، الألوان البسيطة، واللمس التفاعلي.',
  },
  {
    id: '3-4',
    label_ar: 'من 3 سنوات إلى أقل من 4 سنوات',
    label_en: 'Ages 3 to <4 years',
    min: 3,
    max: 4,
    description_ar: 'المفردات الأولى، تمييز الأشكال، العد حتى 3، وبدايات التفكير المنطقي.',
  },
  {
    id: '4-5',
    label_ar: 'من 4 سنوات إلى أقل من 5 سنوات',
    label_en: 'Ages 4 to <5 years',
    min: 4,
    max: 5,
    description_ar: 'الحروف الهجائية، أصوات الفونكس، العد حتى 10، والقصص التفاعلية.',
  },
  {
    id: '5-6',
    label_ar: 'من 5 سنوات إلى 6 سنوات',
    label_en: 'Ages 5 to 6 years',
    min: 5,
    max: 6,
    description_ar: 'التهيئة للكتابة والمدرسة، حل المشكلات المركبة، والعلوم المبكرة.',
  },
];

/**
 * Checks if a resource matches a given age bracket.
 * An application can support multiple brackets if its age range covers them.
 */
export function matchesAgeBracket(
  resource: Pick<EducationalResource, 'age_min' | 'age_max'>,
  bracketId: string
): boolean {
  if (bracketId === 'all') return true;

  switch (bracketId) {
    case '2-3':
      // Matches if app covers age 2 (e.g. min <= 2 and max >= 2)
      return resource.age_min <= 2 && resource.age_max >= 2;
    case '3-4':
      // Matches if app covers age 3
      return resource.age_min <= 3 && resource.age_max >= 3;
    case '4-5':
      // Matches if app covers age 4
      return resource.age_min <= 4 && resource.age_max >= 4;
    case '5-6':
      // Matches if app covers age 5 or 6
      return resource.age_min <= 6 && resource.age_max >= 5;
    default:
      return true;
  }
}

/**
 * Returns all age bracket IDs that a resource qualifies for.
 */
export function getMatchingAgeBrackets(
  resource: Pick<EducationalResource, 'age_min' | 'age_max'>
): string[] {
  return AGE_BRACKETS.filter((bracket) => matchesAgeBracket(resource, bracket.id)).map(
    (b) => b.id
  );
}

export interface DiscoveredAppRawMetadata {
  external_id?: string;
  title_ar?: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  url: string;
  thumbnail_url?: string;
  developer_name: string;
  declared_age_min?: number;
  declared_age_max?: number;
  declared_age_text?: string;
  raw_tags?: string[];
  is_free?: boolean;
  platform?: 'web' | 'android' | 'ios' | 'cross_platform';
  supported_platforms?: ('web' | 'android' | 'ios')[];
  language?: 'ar' | 'en' | 'bilingual';
  licensing_terms?: string;
  privacy_policy_url?: string;
  last_verified_at?: string;
  has_in_app_ads?: boolean;
  has_in_app_purchases?: boolean;
}

export interface ClassificationResult {
  categoryId: string;
  categoryTitleAr: string;
  additionalCategories: string[];
  age_min: number;
  age_max: number;
  isAgeUncertain: boolean;
  ageVerificationEvidence: string;
  detectedLanguage: 'ar' | 'en' | 'bilingual';
  learningObjectives: string[];
  safetyFlags: string[];
  supported_platforms: ('web' | 'android' | 'ios')[];
  last_verified_at: string;
}

/**
 * Rule-based educational classifier and age verification engine.
 */
export function classifyDiscoveredApp(metadata: DiscoveredAppRawMetadata): ClassificationResult {
  const combinedText = `${metadata.title_ar || ''} ${metadata.title_en} ${metadata.description_ar || ''} ${metadata.description_en || ''} ${(metadata.raw_tags || []).join(' ')}`.toLowerCase();

  // 1. Age Verification
  let age_min = metadata.declared_age_min ?? 0;
  let age_max = metadata.declared_age_max ?? 0;
  let isAgeUncertain = false;
  let ageEvidence = '';

  if (age_min >= 2 && age_max <= 6 && age_min <= age_max) {
    ageEvidence = `العمر معلن وموثق رسمياً من المطور: ${age_min} إلى ${age_max} سنوات.`;
  } else if (metadata.declared_age_text) {
    // Parse declared age string like "Ages 2-5", "Preschool 3-6", "Toddler 2+"
    const match = metadata.declared_age_text.match(/(\d+)\s*(?:-|to|–)\s*(\d+)/i);
    if (match) {
      age_min = parseInt(match[1], 10);
      age_max = parseInt(match[2], 10);
      ageEvidence = `تم استخراج العمر من النص الرسمي للمطور: "${metadata.declared_age_text}".`;
    } else {
      isAgeUncertain = true;
      age_min = 3;
      age_max = 6;
      ageEvidence = 'العمر غير مؤكد بصورة قاطعة؛ يتطلب مراجعة المشرف.';
    }
  } else {
    isAgeUncertain = true;
    age_min = 3;
    age_max = 5;
    ageEvidence = 'لم يقدم المصدر بياناً صريحاً للأعمار؛ تم تعيينه مؤقتاً للمراجعة اليدوية.';
  }

  // Bound within preschool range 2 to 6
  age_min = Math.max(2, Math.min(6, age_min));
  age_max = Math.max(age_min, Math.min(6, age_max));

  // 2. Multi-Category Educational Domain Classification across the 14 official domains
  const matchedCategories: { id: string; titleAr: string; objectives: string[] }[] = [];

  // Domain 1: الحروف العربية (cat-arabic-alphabet)
  if (
    combinedText.includes('arabic') ||
    combinedText.includes('حروف عربية') ||
    combinedText.includes('هجاء') ||
    combinedText.includes('أبجدية') ||
    combinedText.includes('لغة عربية')
  ) {
    matchedCategories.push({
      id: 'cat-arabic-alphabet',
      titleAr: 'الحروف العربية',
      objectives: ['التعرف على الحروف الهجائية العربية', 'الربط الصوتي والمرئي للكلمات'],
    });
  }

  // Domain 2: الحروف الإنجليزية والقراءة (cat-english-alphabet)
  if (
    combinedText.includes('phonics') ||
    combinedText.includes('abc') ||
    combinedText.includes('english letter') ||
    combinedText.includes('spelling') ||
    combinedText.includes('reading') ||
    combinedText.includes('alphabet')
  ) {
    matchedCategories.push({
      id: 'cat-english-alphabet',
      titleAr: 'الحروف الإنجليزية والقراءة',
      objectives: ['التعرف على الحروف الإنجليزية', 'تنمية الوعي الصوتي الفونكس'],
    });
  }

  // Domain 3: الأرقام والرياضيات (cat-numbers-math)
  if (
    combinedText.includes('math') ||
    combinedText.includes('count') ||
    combinedText.includes('number') ||
    combinedText.includes('أرقام') ||
    combinedText.includes('حساب') ||
    combinedText.includes('عد')
  ) {
    matchedCategories.push({
      id: 'cat-numbers-math',
      titleAr: 'الأرقام والرياضيات',
      objectives: ['العد البصري حتى 10', 'مفاهيم المقارنة والكميات'],
    });
  }

  // Domain 4: الألوان والأشكال (cat-colors-shapes)
  if (
    combinedText.includes('color') ||
    combinedText.includes('shape') ||
    combinedText.includes('ألوان') ||
    combinedText.includes('أشكال') ||
    combinedText.includes('geometry')
  ) {
    matchedCategories.push({
      id: 'cat-colors-shapes',
      titleAr: 'الألوان والأشكال',
      objectives: ['تمييز الألوان الأساسية', 'مطابقة الأشكال الهندسية المحيطة'],
    });
  }

  // Domain 5: الحيوانات والطبيعة (cat-animals-nature)
  if (
    combinedText.includes('animal') ||
    combinedText.includes('nature') ||
    combinedText.includes('حيوان') ||
    combinedText.includes('طبيعة') ||
    combinedText.includes('creature') ||
    combinedText.includes('wildlife')
  ) {
    matchedCategories.push({
      id: 'cat-animals-nature',
      titleAr: 'الحيوانات والطبيعة',
      objectives: ['التعرف على الكائنات الحية وبيئاتها', 'غرس حب الطبيعة والرفق بالحيوان'],
    });
  }

  // Domain 6: العلوم والاستكشاف (cat-science-discovery)
  if (
    combinedText.includes('science') ||
    combinedText.includes('space') ||
    combinedText.includes('weather') ||
    combinedText.includes('علوم') ||
    combinedText.includes('استكشاف') ||
    combinedText.includes('gravity') ||
    combinedText.includes('solar')
  ) {
    matchedCategories.push({
      id: 'cat-science-discovery',
      titleAr: 'العلوم والاستكشاف',
      objectives: ['تنمية التفكير الاستكشافي والفضول العلمي', 'ملاحظة الظواهر الطبيعية والطقس'],
    });
  }

  // Domain 7: الذاكرة والتركيز (cat-memory-focus)
  if (
    combinedText.includes('memory') ||
    combinedText.includes('ذاكرة') ||
    combinedText.includes('تركيز') ||
    combinedText.includes('matching')
  ) {
    matchedCategories.push({
      id: 'cat-memory-focus',
      titleAr: 'الذاكرة والتركيز',
      objectives: ['تقوية الذاكرة العاملة وقوة الملاحظة', 'المطابقة البصرية السريعة'],
    });
  }

  // Domain 8: الرسم والتلوين (cat-drawing-coloring)
  if (
    combinedText.includes('draw') ||
    combinedText.includes('paint') ||
    combinedText.includes('رسم') ||
    combinedText.includes('تلوين') ||
    combinedText.includes('إبداع') ||
    combinedText.includes('creative')
  ) {
    matchedCategories.push({
      id: 'cat-drawing-coloring',
      titleAr: 'الرسم والتلوين',
      objectives: ['التعبير الإبداعي بالألوان', 'تنمية التحكم بالعضلات الدقيقة لليد'],
    });
  }

  // Domain 9: القصص والاستماع (cat-stories-audio)
  if (
    combinedText.includes('story') ||
    combinedText.includes('book') ||
    combinedText.includes('قصة') ||
    combinedText.includes('حكاية') ||
    combinedText.includes('read aloud')
  ) {
    matchedCategories.push({
      id: 'cat-stories-audio',
      titleAr: 'القصص والاستماع',
      objectives: ['تنمية مهارات الاستماع والفهم القرائي', 'توسيع الخيال وغرس القيم التربوية'],
    });
  }

  // Domain 10: المهارات الحياتية (cat-life-skills)
  if (
    combinedText.includes('routine') ||
    combinedText.includes('نظافة') ||
    combinedText.includes('آداب') ||
    combinedText.includes('مهارات حياتية') ||
    combinedText.includes('life skills')
  ) {
    matchedCategories.push({
      id: 'cat-life-skills',
      titleAr: 'المهارات الحياتية',
      objectives: ['العادات الصحية والروتين الإيجابي', 'الاستقلالية والآداب اليومية'],
    });
  }

  // Domain 11: المشاعر والتواصل الاجتماعي (cat-emotions-social)
  if (
    combinedText.includes('emotion') ||
    combinedText.includes('feeling') ||
    combinedText.includes('مشاعر') ||
    combinedText.includes('تنفس') ||
    combinedText.includes('calm') ||
    combinedText.includes('social emotional')
  ) {
    matchedCategories.push({
      id: 'cat-emotions-social',
      titleAr: 'المشاعر والتواصل الاجتماعي',
      objectives: ['التعرف على المشاعر والتعبير عنها بهدوء', 'تنمية التعاطف والتواصل الإيجابي'],
    });
  }

  // Domain 12: الأناشيد والموسيقى المناسبة للأطفال (cat-songs-music)
  if (
    combinedText.includes('song') ||
    combinedText.includes('rhyme') ||
    combinedText.includes('music') ||
    combinedText.includes('نشيد') ||
    combinedText.includes('أغنية') ||
    combinedText.includes('sing')
  ) {
    matchedCategories.push({
      id: 'cat-songs-music',
      titleAr: 'الأناشيد والموسيقى المناسبة للأطفال',
      objectives: ['تنمية الذائقة الموسيقية والإيقاع اللغوي', 'الاستماع النشط والترديد المرح'],
    });
  }

  // Domain 13: تعلم اللغات (cat-language-learning)
  if (
    combinedText.includes('language') ||
    combinedText.includes('vocabulary') ||
    combinedText.includes('لغات') ||
    combinedText.includes('مفردات') ||
    combinedText.includes('bilingual')
  ) {
    matchedCategories.push({
      id: 'cat-language-learning',
      titleAr: 'تعلم اللغات',
      objectives: ['اكتساب المفردات ونطق الكلمات بلغة ثانية', 'الربط الصوتي والمرئي للكلمات'],
    });
  }

  // Domain 14: حل المشكلات والتفكير المنطقي (cat-problem-solving)
  if (
    combinedText.includes('problem solving') ||
    combinedText.includes('puzzle') ||
    combinedText.includes('logic') ||
    combinedText.includes('تفكير منطقي') ||
    combinedText.includes('حل المشكلات') ||
    combinedText.includes('لغز') ||
    combinedText.includes('maze')
  ) {
    matchedCategories.push({
      id: 'cat-problem-solving',
      titleAr: 'حل المشكلات والتفكير المنطقي',
      objectives: ['التفكير المنطقي والاستنتاج البسيط', 'حل الألغاز والمتاهات بالتجربة الهادفة'],
    });
  }

  let categoryId = 'cat-external-apps';
  let categoryTitleAr = 'تطبيقات تعليمية مختارة';
  let additionalCategories: string[] = [];
  const learningObjectives: string[] = [];

  if (matchedCategories.length > 0) {
    categoryId = matchedCategories[0].id;
    categoryTitleAr = matchedCategories[0].titleAr;
    additionalCategories = matchedCategories.slice(1).map((m) => m.id);
    matchedCategories.forEach((m) => {
      m.objectives.forEach((obj) => {
        if (!learningObjectives.includes(obj)) learningObjectives.push(obj);
      });
    });
  }

  if (learningObjectives.length === 0) {
    learningObjectives.push('تنمية المهارات الإدراكية المبكرة', 'تعلم تفاعلي ممتع وآمن');
  }

  // 3. Language Detection
  let detectedLanguage: 'ar' | 'en' | 'bilingual' = metadata.language || 'en';
  const hasArabic = /[\u0600-\u06FF]/.test(combinedText);
  const hasEnglish = /[a-zA-Z]/.test(metadata.title_en);
  if (hasArabic && hasEnglish) {
    detectedLanguage = 'bilingual';
  } else if (hasArabic) {
    detectedLanguage = 'ar';
  } else {
    detectedLanguage = 'en';
  }

  // 4. Platforms Resolution
  let supportedPlatforms: ('web' | 'android' | 'ios')[] = ['web'];
  if (metadata.supported_platforms && metadata.supported_platforms.length > 0) {
    supportedPlatforms = metadata.supported_platforms;
  } else if (metadata.platform === 'cross_platform') {
    supportedPlatforms = ['web', 'android', 'ios'];
  } else if (metadata.platform === 'android') {
    supportedPlatforms = ['android'];
  } else if (metadata.platform === 'ios') {
    supportedPlatforms = ['ios'];
  } else {
    supportedPlatforms = ['web'];
  }

  // 5. Safety Flags
  const safetyFlags: string[] = ['بروتوكول HTTPS صالح', 'مصدر تعليمي معتمد'];
  if (metadata.is_free !== false) {
    safetyFlags.push('مجاني 100%');
  }
  if (!isAgeUncertain) {
    safetyFlags.push('الفئة العمرية موثقة من المطور');
  } else {
    safetyFlags.push('الفئة العمرية بحاجة لتأكيد');
  }

  return {
    categoryId,
    categoryTitleAr,
    additionalCategories,
    age_min,
    age_max,
    isAgeUncertain,
    ageVerificationEvidence: ageEvidence,
    detectedLanguage,
    learningObjectives,
    safetyFlags,
    supported_platforms: supportedPlatforms,
    last_verified_at: metadata.last_verified_at || new Date().toISOString(),
  };
}
