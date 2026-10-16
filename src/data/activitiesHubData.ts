import { AgeGroup } from '../types/worksheet';

export interface ActivityHubCategory {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  badge: string;
  description_ar: string;
  iconName: string;
  colorGradient: string;
  accentColor: string;
  ageBrackets: AgeGroup[];
  skills: string[];
  seoKeywords: string[];
  subActivitiesCount: number;
}

export const ACTIVITY_HUB_CATEGORIES: ActivityHubCategory[] = [
  {
    id: 'hub-arabic-lang',
    slug: 'arabic-language',
    title_ar: 'أنشطة الحروف واللغة العربية',
    title_en: 'Arabic Language & Alphabet',
    badge: 'تأسيس لغوي متين',
    description_ar: 'تعلم هجاء الحروف العربية، تمييز أشكالها ومواقعها، تكوين الكلمات، النطق الصحيح وتتبع رسم الحرف للأصابع الصغيرة.',
    iconName: 'BookOpen',
    colorGradient: 'from-amber-500 to-orange-500',
    accentColor: '#f59e0b',
    ageBrackets: ['2-3', '3-4', '4-5', '5-6'],
    skills: ['التعرف على الحروف', 'مطابقة الحرف بالصورة', 'تمييز الحروف المتشابهة', 'تكوين الكلمات', 'مواقع الحروف', 'تتبع الحروف'],
    seoKeywords: ['حروف الهجاء للأطفال', 'تعليم القراءة للروضة', 'تأسيس اللغة العربية للأطفال', 'ألعاب الحروف العربية التفاعلية'],
    subActivitiesCount: 6,
  },
  {
    id: 'hub-english-lang',
    slug: 'english-language',
    title_ar: 'أنشطة اللغة الإنجليزية',
    title_en: 'English Phonics & Vocabulary',
    badge: 'Phonics & Words',
    description_ar: 'التعرف على الحروف الإنجليزية A-Z، مطابقة الحروف الكبيرة والصغيرة، نطق الكلمات البسيطة، وألعاب المفردات والألوان.',
    iconName: 'Languages',
    colorGradient: 'from-blue-500 to-indigo-600',
    accentColor: '#3b82f6',
    ageBrackets: ['2-3', '3-4', '4-5', '5-6'],
    skills: ['ABC Letters', 'Uppercase & Lowercase', 'First Words', 'Animal Names', 'English Colors & Numbers', 'Phonics Audio'],
    seoKeywords: ['English for preschoolers', 'ABC games for kids', 'learn english alphabet', 'تعليم الإنجليزية للأطفال'],
    subActivitiesCount: 5,
  },
  {
    id: 'hub-math-numbers',
    slug: 'math-numbers',
    title_ar: 'أنشطة الأرقام والرياضيات',
    title_en: 'Numbers & Early Math',
    badge: 'تفكير رياضي مبكر',
    description_ar: 'العد البصري، مطابقة الرقم بالمعدود، المقارنة بين أكثر وأقل، الأشكال الهندسية، الأحجام، والأنماط الهندسية والجمع البسيط.',
    iconName: 'Hash',
    colorGradient: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    ageBrackets: ['2-3', '3-4', '4-5', '5-6'],
    skills: ['العد من 1 إلى 20', 'المقارنة (أكبر وأصغر ومتساوي)', 'تصنيف الأحجام', 'الأشكال الهندسية', 'إكمال الأنماط', 'الجمع والطرح البصري'],
    seoKeywords: ['تعليم الأرقام للأطفال', 'حساب ما قبل الروضة', 'أنشطة العد والمقارنة', 'الأشكال الهندسية للأطفال'],
    subActivitiesCount: 6,
  },
  {
    id: 'hub-colors-shapes',
    slug: 'colors-shapes',
    title_ar: 'أنشطة الألوان والأشكال',
    title_en: 'Colors & Shapes Explorer',
    badge: 'إدراك بصري وتلوين',
    description_ar: 'تمييز الألوان الأساسية والثانوية مع رموز مساعدة، فرز العناصر حسب اللون، مطابقة الأشكال، اكتشاف المختلف، ولوحة رسم حرة.',
    iconName: 'Palette',
    colorGradient: 'from-rose-500 to-pink-600',
    accentColor: '#f43f5e',
    ageBrackets: ['2-3', '3-4', '4-5', '5-6'],
    skills: ['التعرف على الألوان', 'فرز الألوان', 'مطابقة الأشكال', 'اكتشاف الشكل المختلف', 'تسلسل الألوان', 'استوديو التلوين'],
    seoKeywords: ['تعليم الألوان للصغار', 'أنشطة الأشكال الهندسية', 'تلوين للأطفال', 'ألعاب الفرز البصري'],
    subActivitiesCount: 5,
  },
  {
    id: 'hub-animals-nature',
    slug: 'animals-nature',
    title_ar: 'أنشطة الحيوانات والطبيعة',
    title_en: 'Animals & Nature Discoveries',
    badge: 'استكشاف الكائنات والبيئة',
    description_ar: 'التعرف على الحيوانات وبيئاتها وأصواتها، تصنيف الحيوانات الأليفة والبرية، الخضار والفواكه، ودورات الحياة والطقس والفصول.',
    iconName: 'Smile',
    colorGradient: 'from-lime-500 to-emerald-600',
    accentColor: '#84cc16',
    ageBrackets: ['2-3', '3-4', '4-5', '5-6'],
    skills: ['أصوات الحيوانات', 'تصنيف البيئات', 'دورة حياة الفراشة والنبتة', 'الفصول الأربعة', 'الخضار والفواكه', 'طعام الحيوانات'],
    seoKeywords: ['حيوانات المزرعة والغابة للأطفال', 'دورة حياة الفراشة للروضة', 'الفصول الأربعة للأطفال', 'استكشاف الطبيعة'],
    subActivitiesCount: 6,
  },
  {
    id: 'hub-logic-memory',
    slug: 'logic-memory',
    title_ar: 'أنشطة التفكير المنطقي والذاكرة',
    title_en: 'Logic, Memory & Puzzles',
    badge: 'ذكاء وتفكير منطقي',
    description_ar: 'ألعاب الذاكرة ببطاقات متدرجة، اكتشاف الاختلافات بين رسمتين، مطابقة الظلال، ترتيب خطوات المهام اليومية، والمتاهات الذكية.',
    iconName: 'Brain',
    colorGradient: 'from-purple-500 to-violet-600',
    accentColor: '#8b5cf6',
    ageBrackets: ['2-3', '3-4', '4-5', '5-6'],
    skills: ['لعبة الذاكرة', 'اكتشاف الفروق بين صورتين', 'مطابقة الظل', 'اكتشاف العنصر الشاذ', 'تسلسل الأحداث اليومية', 'متاهات الأطفال'],
    seoKeywords: ['ألعاب ذكاء للأطفال 3 سنوات', 'مطابقة الظلال للروضة', 'تمارين الذاكرة البصرية', 'متاهات للأطفال'],
    subActivitiesCount: 6,
  },
  {
    id: 'hub-life-skills',
    slug: 'life-skills-values',
    title_ar: 'أنشطة السلوكيات والقيم والمهارات الحياتية',
    title_en: 'Life Skills, Values & Emotions',
    badge: 'قيم وتربية إيجابية',
    description_ar: 'آداب الطعام والتحية والنظافة، التعرف على المشاعر (فرح، حزن، غضب) والتعامل معها، مشاركة الألعاب، واختيار السلوك الصحيح.',
    iconName: 'Heart',
    colorGradient: 'from-amber-600 to-rose-500',
    accentColor: '#ea580c',
    ageBrackets: ['2-3', '3-4', '4-5', '5-6'],
    skills: ['آداب الطعام والنظافة', 'التعرف على المشاعر', 'مشاركة الألعاب والتعاون', 'مواقف يومية واختيار السلوك الإيجابي', 'قصص أخلاقية مصغرة'],
    seoKeywords: ['آداب الطفل المسلم', 'تربية المشاعر للأطفال', 'تعليم النظافة الشخصية للروضة', 'مهارات حياتية للأطفال'],
    subActivitiesCount: 5,
  },
  {
    id: 'hub-observation-focus',
    slug: 'observation-focus',
    title_ar: 'أنشطة الملاحظة والتركيز',
    title_en: 'Observation & Focus Games',
    badge: 'قوة الملاحظة والدقة',
    description_ar: 'لعبة أين الشيء؟ (البحث عن العناصر المخفية)، عدّ العناصر داخل مشهد جميل، تتبع المسارات الدقيقة، وألغاز البازل المصغرة.',
    iconName: 'Eye',
    colorGradient: 'from-cyan-500 to-sky-600',
    accentColor: '#06b6d4',
    ageBrackets: ['2-3', '3-4', '4-5', '5-6'],
    skills: ['البحث عن الشيء المخفي', 'ابحث وعدّ (I Spy)', 'تتبع الخطوط الحركية', 'تركيب أجزاء الصورة (Mini Puzzle)'],
    seoKeywords: ['أين الشيء المخفي للأطفال', 'تمارين التركيز والانتباه', 'تتبع الخطوط للأصابع', 'بازل أطفال سهل'],
    subActivitiesCount: 4,
  },
  {
    id: 'hub-educational-songs',
    slug: 'educational-songs',
    title_ar: 'محطة الأغاني والأناشيد التعليمية',
    title_en: 'Educational Songs & Nursery Rhymes',
    badge: 'ألحان هادفة بدون إعلانات',
    description_ar: 'أناشيد تربوية لطيفة ومحبوبة للأطفال، خالية من أي إعلانات، مع عرض كلمات النشيد بخط كبير لمساعدة الأمهات والمعلمات على الغناء المشترك.',
    iconName: 'Music',
    colorGradient: 'from-violet-500 to-fuchsia-600',
    accentColor: '#a855f7',
    ageBrackets: ['2-3', '3-4', '4-5', '5-6'],
    skills: ['الإيقاع الصوتي واللغوي', 'حفظ الحروف والأرقام بالأنشودة', 'ترديد أناشيد النظافة والقيم', 'قراءة الكلمات ومتابعة اللحن'],
    seoKeywords: ['أناشيد أطفال بدون إيقاع صاخب', 'نشيد الحروف الهجائية', 'أنشودة النظافة للروضة', 'أغاني تعليمية آمنة للصغار'],
    subActivitiesCount: 6,
  },
  {
    id: 'hub-illustrated-stories',
    slug: 'illustrated-stories',
    title_ar: 'مكتبة الوسائط والقصص المصورة',
    title_en: 'Illustrated Stories & Picture Books',
    badge: 'قصص نوم وتربية خيالية',
    description_ar: 'قصص مصورة خطوة بخطوة برسومات ملونة وأسئلة فهم مبسطة، تعزز الخيال وتغرس حب القراءة المشتركة بين الطفل ووالديه.',
    iconName: 'Sparkles',
    colorGradient: 'from-amber-400 to-yellow-500',
    accentColor: '#eab308',
    ageBrackets: ['2-3', '3-4', '4-5', '5-6'],
    skills: ['الاستماع والتخيل', 'تسلسل القصة (البداية، الوسط، النهاية)', 'أسئلة الفهم الاستيعابي', 'الحوار والمشاركة الوالدية'],
    seoKeywords: ['قصص أطفال قبل النوم', 'قصص مصورة هادفة', 'حكايات تربوية للروضة', 'قراءة تفاعلية للأطفال'],
    subActivitiesCount: 5,
  },
];

// Content for Arabic Language Hub
export interface ArabicWordItem {
  word: string;
  letters: string[];
  meaning: string;
  visual: string;
  age: AgeGroup;
}

export const ARABIC_WORDS_BANK: ArabicWordItem[] = [
  { word: 'أَسَد', letters: ['أ', 'س', 'د'], meaning: 'ملك الغابة القوي', visual: '🦁', age: '3-4' },
  { word: 'بَطَّة', letters: ['ب', 'ط', 'ة'], meaning: 'طائر لطيف يسبح في الماء', visual: '🦆', age: '3-4' },
  { word: 'تُفَّاح', letters: ['ت', 'ف', 'ا', 'ح'], meaning: 'فاكهة لذيذة ومفيدة', visual: '🍎', age: '4-5' },
  { word: 'شَمْس', letters: ['ش', 'م', 'س'], meaning: 'تضيء سماءنا وتمنحنا الدفء', visual: '☀️', age: '3-4' },
  { word: 'كِتَاب', letters: ['ك', 'ت', 'ا', 'ب'], meaning: 'نقرأ فيه قصصاً جميلة', visual: '📖', age: '4-5' },
  { word: 'نَجْمَة', letters: ['ن', 'ج', 'م', 'ة'], meaning: 'تلمع في السماء ليلاً', visual: '⭐', age: '4-5' },
  { word: 'قَمَر', letters: ['ق', 'م', 'ر'], meaning: 'ينير ليلنا بهدوء', visual: '🌙', age: '3-4' },
  { word: 'فَرَاشَة', letters: ['ف', 'ر', 'ا', 'ش', 'ة'], meaning: 'تطير بين الزهور بألوانها البهيجة', visual: '🦋', age: '5-6' },
  { word: 'حَصَان', letters: ['ح', 'ص', 'ا', 'ن'], meaning: 'حيوان وفي وسريع', visual: '🐴', age: '4-5' },
  { word: 'عُصْفُور', letters: ['ع', 'ص', 'ف', 'و', 'ر'], meaning: 'يغرد بصوت عذب في الصباح', visual: '🐦', age: '5-6' },
];

export const ARABIC_SIMILAR_LETTERS = [
  { pair: ['ب', 'ت', 'ث'], desc: 'الباء نقطتها تحت، والتاء نقطتان فوق، والثاء ثلاث نقاط كالمثلث', sample: '🦆 🍎 🦊' },
  { pair: ['ج', 'ح', 'خ'], desc: 'الجيم نقطتها في بطنها، والحاء نظيفة بلا نقاط، والخاء نقطتها فوق رأسها', sample: '🐪 🐴 🐑' },
  { pair: ['د', 'ذ'], desc: 'الدال بلا نقطة، والذال تحمل نقطة واحدة', sample: '🧸 🐺' },
  { pair: ['ر', 'ز'], desc: 'الراء كالزحليقة، والزاي تحمل فوقها نجمة صغيرة (نقطة)', sample: '🪶 🦒' },
  { pair: ['س', 'ش'], desc: 'السين لها ثلاثة أسنان، والشين تزينت بثلاث نقاط لامعة', sample: '🐟 ☀️' },
  { pair: ['ص', 'ض'], desc: 'الصاد قوية بلا نقطة، والضاد اختها المنقوطة', sample: '🚀 🐸' },
  { pair: ['ع', 'غ'], desc: 'العين واسعة بلا نقطة، والغين فوق رأسها نقطة', sample: '🍇 ☁️' },
];

// Content for English Hub
export interface EnglishVocabItem {
  word: string;
  letter: string;
  lower: string;
  visual: string;
  category: string;
  phonicsNote: string;
}

export const ENGLISH_VOCAB_BANK: EnglishVocabItem[] = [
  { word: 'Apple', letter: 'A', lower: 'a', visual: '🍎', category: 'Food', phonicsNote: '/æ/ as in Apple' },
  { word: 'Bear', letter: 'B', lower: 'b', visual: '🐻', category: 'Animals', phonicsNote: '/b/ as in Bear' },
  { word: 'Cat', letter: 'C', lower: 'c', visual: '🐱', category: 'Animals', phonicsNote: '/k/ as in Cat' },
  { word: 'Dog', letter: 'D', lower: 'd', visual: '🐶', category: 'Animals', phonicsNote: '/d/ as in Dog' },
  { word: 'Elephant', letter: 'E', lower: 'e', visual: '🐘', category: 'Animals', phonicsNote: '/e/ as in Elephant' },
  { word: 'Fish', letter: 'F', lower: 'f', visual: '🐟', category: 'Animals', phonicsNote: '/f/ as in Fish' },
  { word: 'Giraffe', letter: 'G', lower: 'g', visual: '🦒', category: 'Animals', phonicsNote: '/dʒ/ as in Giraffe' },
  { word: 'House', letter: 'H', lower: 'h', visual: '🏠', category: 'Objects', phonicsNote: '/h/ as in House' },
  { word: 'Ice Cream', letter: 'I', lower: 'i', visual: '🍦', category: 'Food', phonicsNote: '/aɪ/ as in Ice Cream' },
  { word: 'Juice', letter: 'J', lower: 'j', visual: '🧃', category: 'Food', phonicsNote: '/dʒ/ as in Juice' },
  { word: 'Kite', letter: 'K', lower: 'k', visual: '🪁', category: 'Toys', phonicsNote: '/k/ as in Kite' },
  { word: 'Lion', letter: 'L', lower: 'l', visual: '🦁', category: 'Animals', phonicsNote: '/l/ as in Lion' },
  { word: 'Moon', letter: 'M', lower: 'm', visual: '🌙', category: 'Nature', phonicsNote: '/m/ as in Moon' },
  { word: 'Nest', letter: 'N', lower: 'n', visual: '🪹', category: 'Nature', phonicsNote: '/n/ as in Nest' },
  { word: 'Orange', letter: 'O', lower: 'o', visual: '🍊', category: 'Food', phonicsNote: '/ɒ/ as in Orange' },
  { word: 'Pencil', letter: 'P', lower: 'p', visual: '✏️', category: 'School', phonicsNote: '/p/ as in Pencil' },
  { word: 'Rabbit', letter: 'R', lower: 'r', visual: '🐇', category: 'Animals', phonicsNote: '/r/ as in Rabbit' },
  { word: 'Sun', letter: 'S', lower: 's', visual: '☀️', category: 'Nature', phonicsNote: '/s/ as in Sun' },
  { word: 'Tree', letter: 'T', lower: 't', visual: '🌳', category: 'Nature', phonicsNote: '/t/ as in Tree' },
  { word: 'Umbrella', letter: 'U', lower: 'u', visual: '☂️', category: 'Objects', phonicsNote: '/ʌ/ as in Umbrella' },
  { word: 'Watermelon', letter: 'W', lower: 'w', visual: '🍉', category: 'Food', phonicsNote: '/w/ as in Watermelon' },
  { word: 'Star', letter: 'S', lower: 's', visual: '⭐', category: 'Nature', phonicsNote: '/stɑːr/' },
];

// Content for Songs Station
export interface EducationalSong {
  id: string;
  title: string;
  theme: string;
  emoji: string;
  durationSec: number;
  melodyNotes: number[]; // Frequencies in Hz for gentle chime synth
  verses: string[];
  parentNote: string;
}

export const EDUCATIONAL_SONGS_BANK: EducationalSong[] = [
  {
    id: 'song-letters',
    title: 'نشيد الحروف العربية الجميلة',
    theme: 'تعلم هجاء اللغة العربية',
    emoji: '🎶📖',
    durationSec: 45,
    melodyNotes: [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5],
    verses: [
      'ألفٌ أَرْنَبْ يجري يلعبْ.. يأكلُ جزراً كي لا يتعبْ',
      'باءٌ بَطَّةْ نطتْ نطةْ.. سقطتْ ضحكتْ منها القطةْ',
      'تاءٌ تاجٌ فوقَ الراسِ.. فيهِ الذهبُ وفيهِ الماسِ',
      'ثاءٌ ثعلبْ صادَ دجاجةْ.. هو ماكرٌ يبحثُ عن حاجةْ',
      'حروفُ لغتي ما أحلاها.. نقرؤها دوماً ونراها!',
    ],
    parentNote: 'رددوا مع أطفالكم بصوت هادئ ومبتسم، وأشيروا إلى الحرف الأول في كل بيت شعري.',
  },
  {
    id: 'song-numbers',
    title: 'أنشودة الأرقام المرحة',
    theme: 'العد من 1 إلى 10 بحب',
    emoji: '🔢⭐',
    durationSec: 40,
    melodyNotes: [440, 493.88, 554.37, 587.33, 659.25, 739.99, 830.61, 880],
    verses: [
      'الواحدُ هو ربي.. ليسَ لهُ من شريكِ',
      'والاثنانِ هما ماما وبابا.. حبهما في القلبِ طابَ',
      'والثلاثةُ شمسٌ وماءٌ وزهرةْ.. تنشرُ في الكونِ العِطرا',
      'والأربعةُ أرجلُ الأرنبْ.. يقفزُ في الروضِ ويلعبْ',
      'والخمسةُ أصابعُ كفي.. أعملُ بها وأحيي صفي!',
    ],
    parentNote: 'اطلبوا من الطفل أن يرفع أصابعه مع كل رقم في الأنشودة لتطوير العد البصري الحركي.',
  },
  {
    id: 'song-hygiene',
    title: 'أنشودة النظافة والصابون',
    theme: 'غرس النظافة الشخصية اليومية',
    emoji: '🧼💧',
    durationSec: 35,
    melodyNotes: [523.25, 659.25, 783.99, 659.25, 523.25, 659.25, 783.99],
    verses: [
      'ماءٌ نقيٌّ وصابونْ.. يغسلُ أيدينا بحنونْ',
      'فركٌ فركٌ بينَ الأصابعْ.. نبعدُ عنّا كلَّ الموانعْ',
      'نغسلُ وجهاً نغسلُ أسنانا.. كي نحمي أبداً دنيانا',
      'أنا نظيفٌ وأنا جميلْ.. والنظافةُ هي خيرُ سبيلْ!',
    ],
    parentNote: 'يمكن تشغيل هذه الأنشودة للطفل أثناء وقت غسيل اليدين لمدة 20 ثانية لتشجيعه على الإتقان.',
  },
  {
    id: 'song-colors',
    title: 'أنشودة ألوان الطبيعة',
    theme: 'استكشاف بهجة الألوان حولنا',
    emoji: '🎨🌈',
    durationSec: 40,
    melodyNotes: [587.33, 659.25, 739.99, 880, 739.99, 659.25, 587.33],
    verses: [
      'الأحمرُ لونُ الفراولةْ.. والتفاحةِ اللذيذةِ على الطاولةْ',
      'والأصفرُ لونُ الشمسِ الدافئةْ.. والليمونةِ الصفراءِ الهادئةْ',
      'والأخضرُ شجرٌ ونباتْ.. يبهجُ قلوبَ الكائناتْ',
      'والأزرقُ سماءٌ وبحورْ.. تطيرُ فوقها أجملُ الطيورْ!',
    ],
    parentNote: 'اسألوا الطفل بعد سماع الأنشودة: ما هو لون قميصك؟ ولون غرفتك المفضلة؟',
  },
  {
    id: 'song-morning',
    title: 'أنشودة الصباح المبتسم',
    theme: 'بداية يوم مليء بالنشاط والامتنان',
    emoji: '☀️🐦',
    durationSec: 35,
    melodyNotes: [659.25, 783.99, 880, 987.77, 1046.5, 987.77, 880],
    verses: [
      'أشرقتِ الشمسُ بنورِها.. والعصفورُ شدا على غصونِها',
      'صباحُ الخيرِ يا أمي.. صباحُ النورِ يا أبي',
      'ابتسمُ لأبدأَ يومي جديداً.. وأصنعُ فيه عملاً سديداً',
      'الحمدُ للهِ على الصباحْ.. يومُ فلاحٍ ونجاحْ!',
    ],
    parentNote: 'ممتازة للتشغيل عند الاستيقاظ صباحاً لبث مشاعر السكينة والإيجابية في المنزل.',
  },
];

// Content for Illustrated Stories
export interface IllustratedStoryPage {
  pageNumber: number;
  imageVisual: string;
  title: string;
  paragraphAr: string;
  question: string;
  options: string[];
  correctIndex: number;
  lifeLesson: string;
}

export interface IllustratedStory {
  id: string;
  title: string;
  subtitle: string;
  coverVisual: string;
  targetAge: AgeGroup;
  theme: string;
  pages: IllustratedStoryPage[];
}

export const ILLUSTRATED_STORIES_BANK: IllustratedStory[] = [
  {
    id: 'story-patient-rabbit',
    title: 'الأرنب الصغير الصبور وزهرة البستان',
    subtitle: 'قصة دافئة عن فضيلة الصبر والاهتمام بالنباتات',
    coverVisual: '🐇🌸',
    targetAge: '3-4',
    theme: 'الصبر ورعاية الطبيعة',
    pages: [
      {
        pageNumber: 1,
        imageVisual: '🐇🌱💧',
        title: 'البذرة الصغيرة تحت التراب',
        paragraphAr: 'في يومٍ ربيعيٍّ مشمس، وجد الأرنب سُكَّر بذرة صغيرة وجميلة. وضعها بلطف في التراب وسقاها بقطرات الماء الصافية.',
        question: 'ماذا فعل سُكَّر بالبذرة الصغيرة؟',
        options: ['زرعها في التراب وسقاها بالماء', 'ألقى بها بعيداً', 'خبأها في صندوق الألعاب'],
        correctIndex: 0,
        lifeLesson: 'العناية بالنباتات تبدأ بزرع البذور وسقيها برفق.',
      },
      {
        pageNumber: 2,
        imageVisual: '🐇⏳🌧️',
        title: 'الانتظار والصبر الجميل',
        paragraphAr: 'كل صباح كان سُكَّر يركض نحو الحديقة ليتفقد البذرة. مرت أيام وبقيت تحت الأرض، فقالت له أمه الحكيمة: "اصبر يا بني، فالجمال يحتاج وقتاً لينمو".',
        question: 'ماذا نصحت الأم الحكيمة الأرنب سُكَّر؟',
        options: ['أن يغضب ويذهب', 'أن يصبر ويتعلم الصبر', 'أن يقتلع البذرة'],
        correctIndex: 1,
        lifeLesson: 'الصبر فضيلة تجعلنا ننتظر الأشياء الطيبة بتفاؤل.',
      },
      {
        pageNumber: 3,
        imageVisual: '🌸🐝🎉',
        title: 'الزهرة البديعة تتفتح!',
        paragraphAr: 'وفجأة في الصباح، انفتحت برعمة وردية يانعة ونشرت عطراً فاح في كل البستان! فرح سُكَّر ورقص مع الفراشات شاكراً ربه على هذه النعمة.',
        question: 'كيف شعر سُكَّر عندما تفتحت الزهرة الجميلة؟',
        options: ['شعر بالحزن', 'فرح ورقص وشكر الله', 'لم ينتبه إليها'],
        correctIndex: 1,
        lifeLesson: 'ثمرة الصبر والاهتمام تكون دائماً بهيجة ورائعة.',
      },
    ],
  },
  {
    id: 'story-sharing-bear',
    title: 'الدب بندق وسلة الفراولة اللذيذة',
    subtitle: 'قصة عن فرحة مشاركة الألعاب والطعام مع الأصدقاء',
    coverVisual: '🐻🍓',
    targetAge: '2-3',
    theme: 'المشاركة والتعاون',
    pages: [
      {
        pageNumber: 1,
        imageVisual: '🐻🧺🍓',
        title: 'سلة مليئة بالفراولة الحمراء',
        paragraphAr: 'جمع الدب بندق سلة مليئة بالفراولة الحمراء الشهية. كان بطنه يقرقع من الجوع وفرح بحصاد الغابة اللطيف.',
        question: 'ماذا جمع الدب بندق في سلته؟',
        options: ['فراولة حمراء لذيذة', 'حجارة صغيرة', 'أوراق شجر جافة'],
        correctIndex: 0,
        lifeLesson: 'نحمد الله دائماً على نعمه وطعامه اللذيذ.',
      },
      {
        pageNumber: 2,
        imageVisual: '🐿️🥺🍃',
        title: 'السنجاب الصغير يبحث عن طعام',
        paragraphAr: 'مر بجانبه السنجاب الصغير سمسم، وكان متعباً ويبحث عن حبة جوز فلم يجد. نظر بندق إلى سلته الكبيرة ونظر إلى صديقه.',
        question: 'من مر بجانب الدب بندق؟',
        options: ['السنجاب الصغير سمسم', 'السمكة الذهبية', 'الفيل الضخم'],
        correctIndex: 0,
        lifeLesson: 'ملاحظة مشاعر الآخرين ومساعدتهم من صفات الأصدقاء الطيبين.',
      },
      {
        pageNumber: 3,
        imageVisual: '🐻❤️🐿️🍓',
        title: 'أجمل مشاركة في العالم',
        paragraphAr: 'ابتسم بندق وقال: "تفضل يا سمسم، نصف السلة لك ونصفها لي!". أكلا معاً وضحكا، وشعر بندق بأن الفراولة أصبحت ألذ بعشر مرات عندما شاركها!',
        question: 'ماذا شعر بندق عندما شارك طعامه مع صديقه؟',
        options: ['شعر بالندم', 'شعر أن الفراولة أصبحت ألذ وأجمل بالمشاركة', 'شعر بالغضب'],
        correctIndex: 1,
        lifeLesson: 'المشاركة تزيد المحبة وتجعل الفرحة فرحتين.',
      },
    ],
  },
  {
    id: 'story-water-drop',
    title: 'رحلة قطرة الماء اللطيفة ندى',
    subtitle: 'قصة علمية خيالية عن دورة الماء والمحافظة على النعمة',
    coverVisual: '💧☁️',
    targetAge: '4-5',
    theme: 'العلوم والمحافظة على الماء',
    pages: [
      {
        pageNumber: 1,
        imageVisual: '💧🌊☀️',
        title: 'ندى تسبح في البحر الكبير',
        paragraphAr: 'كانت قطرة الماء ندى تعيش سعيدة في البحر الأزرق، تسبح مع الأسماك وتداعب الشعاب المرجانية تحت أشعة الشمس الدافئة.',
        question: 'أين كانت تعيش قطرة الماء ندى في البداية؟',
        options: ['في البحر الأزرق الكبير', 'في فنجان شاي', 'على قمة الجبل الجليدي'],
        correctIndex: 0,
        lifeLesson: 'المحيطات والبحار هي موطن عظيم للماء والكائنات الحية.',
      },
      {
        pageNumber: 2,
        imageVisual: '☁️🌬️🕊️',
        title: 'الصعود نحو السحاب',
        paragraphAr: 'سخنت الشمس ماء البحر برفق، فتبخرت ندى وتحولت إلى بخار خفيف وصعدت إلى السماء لتجتمع مع رفيقاتها في غيمة بيضاء قطنية.',
        question: 'كيف صعدت ندى إلى الغيمة في السماء؟',
        options: ['تبخرت بفعل دفء الشمس', 'قفزت بالحبل', 'ركبت طائرة ورقية'],
        correctIndex: 0,
        lifeLesson: 'حرارة الشمس تبخر قطرات الماء لتصنع السحب في السماء.',
      },
      {
        pageNumber: 3,
        imageVisual: '🌧️🌱🌻',
        title: 'المطر ينعش الأرض العطشى',
        paragraphAr: 'هبت ريح لطيفة، فهطلت ندى مع قطرات المطر على شجرة برتقال عطشى. ارتوت الشجرة وأخرجت زهوراً بيضاء، وشكرت ندى ربها على رحلتها المباركة.',
        question: 'إلى أين هطلت ندى في النهاية؟',
        options: ['على شجرة برتقال عطشى لتسقيها', 'في بئر مهجور', 'على صخرة بعيدة'],
        correctIndex: 0,
        lifeLesson: 'الماء سر الحياة، ونحن نحافظ على كل قطرة ماء بلا إسراف.',
      },
    ],
  },
];
