import { AgeGroup } from '../../types/worksheet';

export interface AssessmentSectionItem {
  id: string;
  prompt: string;
  visual?: string;
  correctAnswer: string;
  explanation?: string;
  matchPairs?: Array<{
    leftId: string;
    left: string;
    leftVisual: string;
    rightId: string;
    right: string;
    rightVisual: string;
  }>;
  options?: Array<{
    id: string;
    label: string;
    visual?: string;
    isCorrect?: boolean;
  }>;
  countTarget?: number;
  sequence?: Array<{
    id: string;
    label: string;
    visual: string;
    order: number;
  }>;
}

export interface AssessmentSection {
  id: string;
  type: 'matching' | 'pair_matching' | 'multiple_choice' | 'odd_one_out' | 'counting' | 'sequencing' | 'observation_checklist';
  typeLabel: string;
  title: string;
  instructions: string;
  points: number;
  items: AssessmentSectionItem[];
}

export interface ComprehensiveAssessment {
  id: string;
  title: string;
  subtitle: string;
  ageGroup: AgeGroup;
  ageGroupLabel: string;
  targetSkills: string[];
  instructionsForParent: string;
  oralMotorEvaluationGuide: string; // إرشادات التقييم الحركي والشفهي لولي الأمر
  totalPoints: number;
  sections: AssessmentSection[];
  correctionGuide: {
    overview: string;
    answerKeySummary: Array<{
      sectionTitle: string;
      sectionType: string;
      answers: Array<{
        question: string;
        correct: string;
        visualAnswer?: string;
        note: string;
      }>;
    }>;
    scoringRubric: Array<{
      level: string;
      scoreRange: string;
      percentage: string;
      description: string;
      recommendedAction: string;
    }>;
    oralMotorRubric: string[];
    remedialRecommendations: string[];
  };
}

export const PRESET_ASSESSMENTS: ComprehensiveAssessment[] = [
  // 1. عمر من سنتين إلى أقل من 3 سنوات
  {
    id: 'assessment-age-2-3',
    title: 'اختبار التقييم النمائي الشامل للصغار',
    subtitle: 'قياس التمييز البصري، الإشارة، مطابقة الصور، والتعرف على العناصر المألوفة',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من ٣ سنوات',
    targetSkills: [
      'التمييز البصري للأشكال والألوان الأساسية',
      'مطابقة الصور المأثورة والحيوانات',
      'الإشارة والتسمية الشفهية دون إجبار على الكتابة',
      'إدراك المفاهيم اليومية (طعام، أصوات، أحجام)'
    ],
    instructionsForParent: 'اجلس بمحاذاة طفلك في بيئة هادئة وابتسم. اقرأ السؤال بنبرة تشويقية ودعه يشير بإصبعه أو ينطق الكلمة. لا تصحح له بحدة، بل شجّعه على كل محاولة.',
    oralMotorEvaluationGuide: 'يُعتمد على حركة إصبع الطفل أو نظرة عينه أو النطق الصوتي للحيوان/الشيء كإجابة معتمدة وصحيحة دون الحاجة لمسك القلم.',
    totalPoints: 20,
    sections: [
      {
        id: 'sec-2-1',
        type: 'pair_matching',
        typeLabel: 'المطابقة البصرية',
        title: 'النشاط الأول: مطابقة الصور المتشابهة',
        instructions: 'أشر بإصبعك إلى الصورة التي تشبه الصورة الأولى تماماً',
        points: 5,
        items: [
          {
            id: 'item-2-1-1',
            prompt: 'أين الصورة المطابقة للقطة اللطيفة؟',
            visual: '🐱',
            correctAnswer: 'قطة',
            explanation: 'مطابقة بصرية مباشرة لعنصر أليف',
            options: [
              { id: 'opt-1', label: 'قطة مماثلة', visual: '🐱', isCorrect: true },
              { id: 'opt-2', label: 'سيارة', visual: '🚗', isCorrect: false },
              { id: 'opt-3', label: 'تفاحة', visual: '🍎', isCorrect: false }
            ]
          },
          {
            id: 'item-2-1-2',
            prompt: 'أين الكرة الصفراء المطابقة؟',
            visual: '🟡',
            correctAnswer: 'دائرة صفراء',
            explanation: 'مطابقة اللون والشكل الهندسي الدائري',
            options: [
              { id: 'opt-1', label: 'مربع أزرق', visual: '🟦', isCorrect: false },
              { id: 'opt-2', label: 'دائرة صفراء', visual: '🟡', isCorrect: true },
              { id: 'opt-3', label: 'مثلث أحمر', visual: '🔺', isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 'sec-2-2',
        type: 'matching',
        typeLabel: 'التوصيل البسيط',
        title: 'النشاط الثاني: إطعام الحيوانات المألوفة',
        instructions: 'صل بين كل حيوان وطعامه المفضل (أو أشر بإصبعك من الحيوان إلى طعامه)',
        points: 5,
        items: [
          {
            id: 'item-2-2-1',
            prompt: 'صل الحيوان بطعامه اللذيذ',
            correctAnswer: 'الأرنب يأكل الجزرة، القطة تشرب الحليب، القرد يأكل الموزة',
            matchPairs: [
              { leftId: 'l1', left: 'الأرنب', leftVisual: '🐰', rightId: 'r1', right: 'جزرة', rightVisual: '🥕' },
              { leftId: 'l2', left: 'القطة', leftVisual: '🐱', rightId: 'r2', right: 'حليب', rightVisual: '🥛' },
              { leftId: 'l3', left: 'القرد', leftVisual: '🐵', rightId: 'r3', right: 'موزة', rightVisual: '🍌' }
            ]
          }
        ]
      },
      {
        id: 'sec-2-3',
        type: 'multiple_choice',
        typeLabel: 'الأسئلة المصورة واختيار الصور',
        title: 'النشاط الثالث: التعرف على الأشياء اليومية',
        instructions: 'انظر إلى الصور واختر الإجابة الصحيحة',
        points: 5,
        items: [
          {
            id: 'item-2-3-1',
            prompt: 'ما الذي نرتديه في أرجلنا عند الخروج؟',
            correctAnswer: 'الحذاء',
            explanation: 'إدراك وظائف الأشياء المألوفة',
            options: [
              { id: 'mc-1', label: 'الحذاء', visual: '👟', isCorrect: true },
              { id: 'mc-2', label: 'الملعقة', visual: '🥄', isCorrect: false },
              { id: 'mc-3', label: 'الساعة', visual: '⏰', isCorrect: false }
            ]
          },
          {
            id: 'item-2-3-2',
            prompt: 'أي فاكهة لونها أحمر ومقرمشة ولذيذة؟',
            correctAnswer: 'التفاحة الحمراء',
            explanation: 'التمييز بين الفواكه والألوان المألوفة',
            options: [
              { id: 'mc-4', label: 'موز أصفر', visual: '🍌', isCorrect: false },
              { id: 'mc-5', label: 'تفاحة حمراء', visual: '🍎', isCorrect: true },
              { id: 'mc-6', label: 'خيار أخضر', visual: '🥒', isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 'sec-2-4',
        type: 'observation_checklist',
        typeLabel: 'فحص الملاحظة الشفهية والحركية',
        title: 'النشاط الرابع: بطاقة الملاحظة التفاعلية لولي الأمر',
        instructions: 'يتحقق المربي من استجابات الطفل التعبيرية والحركية ويسجل الملاحظة',
        points: 5,
        items: [
          {
            id: 'item-2-4-1',
            prompt: 'يقلد الطفل صوت حيوان واحد على الأقل (مثلاً مواء القطة مياو أو نباح الكلب)',
            correctAnswer: 'متحقق بالكامل',
            explanation: 'يقيس التطور اللغوي والسمعي'
          },
          {
            id: 'item-2-4-2',
            prompt: 'يشير الطفل بسبابته بثقة عند سؤاله "أين عينك؟" أو "أين أنفك؟"',
            correctAnswer: 'متحقق بالكامل',
            explanation: 'يقيس الوعي الجسدي والتركيز الحركي'
          }
        ]
      }
    ],
    correctionGuide: {
      overview: 'هذا الاختبار مخصص للأطفال في مرحلة ما قبل الروضة المبكرة. التقييم هنا تقييم استكشافي تشجيعي وليس امتحاناً مدرسياً.',
      answerKeySummary: [
        {
          sectionTitle: 'النشاط الأول: المطابقة البصرية',
          sectionType: 'pair_matching',
          answers: [
            { question: 'الصورة المطابقة للقطة 🐱', correct: 'القطة 🐱', visualAnswer: '🐱', note: 'نقطتان ونصف للإشارة الصحيحة أو نطق كلمة قطة' },
            { question: 'الدائرة الصفراء المطابقة 🟡', correct: 'الدائرة الصفراء 🟡', visualAnswer: '🟡', note: 'نقطتان ونصف للتمييز البصري الدقيق' }
          ]
        },
        {
          sectionTitle: 'النشاط الثاني: التوصيل البسيط',
          sectionType: 'matching',
          answers: [
            { question: 'الأرنب 🐰', correct: 'الجزرة 🥕', visualAnswer: '🐰 ➡️ 🥕', note: 'درجة ونصف لكل توصيل أو إشارة متبادلة' },
            { question: 'القطة 🐱', correct: 'الحليب 🥛', visualAnswer: '🐱 ➡️ 🥛', note: 'درجة ونصف' },
            { question: 'القرد 🐵', correct: 'الموزة 🍌', visualAnswer: '🐵 ➡️ 🍌', note: 'درجتان' }
          ]
        },
        {
          sectionTitle: 'النشاط الثالث: الأسئلة المصورة',
          sectionType: 'multiple_choice',
          answers: [
            { question: 'ما نرتديه في القدم', correct: 'الحذاء 👟', visualAnswer: '👟', note: 'نقطتان ونصف لإدراك وظيفة الملابس' },
            { question: 'فاكهة حمراء مقرمشة', correct: 'التفاحة الحمراء 🍎', visualAnswer: '🍎', note: 'نقطتان ونصف للتمييز الحسي' }
          ]
        },
        {
          sectionTitle: 'النشاط الرابع: بطاقة الملاحظة الشفهية والحركية',
          sectionType: 'observation_checklist',
          answers: [
            { question: 'تقليد صوت حيوان', correct: 'إصدار صوت معبر', note: 'نقطتان ونصف لتحفيز النطق والمحاكاة' },
            { question: 'الإشارة إلى أعضاء الوجه', correct: 'إشارة واضحة بالسبابة', note: 'نقطتان ونصف للتنسيق العصبي الحركي' }
          ]
        }
      ],
      scoringRubric: [
        {
          level: 'نجم النجوم النامي (متميز جداً)',
          scoreRange: '١٨ - ٢٠ درجة',
          percentage: '٩٠٪ - ١٠٠٪',
          description: 'الطفل يمتلك مهارات تمييز بصري وتركيز استثنائية بالنسبة لسنه، وتفاعله الاجتماعي واللغوي ممتاز.',
          recommendedAction: 'قدّم له أوراق الفئة العمرية التالية (٣-٤ سنوات) مع التركيز على الألوان والأشكال الهندسية.'
        },
        {
          level: 'مستكشف صغير نشيط (جيد جداً)',
          scoreRange: '١٣ - ١٧ درجة',
          percentage: '٦٥٪ - ٨٥٪',
          description: 'الطفل يدرك الصور الأساسية ولكنه قد يتردد في التوصيل أو يشتت انتباهه سريعاً وهو أمر طبيعي.',
          recommendedAction: 'كرر معه ألعاب المطابقة الحقيقية في البيت (مطابقة الجوارب، تصنيف الفواكه في المطبخ).'
        },
        {
          level: 'براعم تحتاج رعاية وتشجيع (قيد التطوير)',
          scoreRange: 'أقل من ١٣ درجة',
          percentage: 'أقل من ٦٥٪',
          description: 'الطفل يحتاج إلى مزيد من الوقت والألعاب الحسية الملموسة لتثبيت مسميات الأشياء وتسميتها.',
          recommendedAction: 'استخدم بطاقات الحيوانات الكبيرة وأشر معه يومياً، وابتعد تماماً عن استخدام الشاشات المجهدة.'
        }
      ],
      oralMotorRubric: [
        'عدم إجبار الطفل على مسك القلم: الإشارة بالإصبع أو لمس الصورة كافٍ بنسبة ١٠٠٪.',
        'النطق التقريبي للكلمات مقبول بالكامل (مثل "تووووت" للقطار أو "مياو" للقطة).',
        'إذا تشتت انتباه الطفل بعد ٥ دقائق، خذ استراحة وافرك يديه والعب لعبة ترفيهية ثم أكمل.'
      ],
      remedialRecommendations: [
        'تصفح قسم أوراق عمل الفئة (٢-٣ سنوات) - نشاط المطابقة وتتبع المسارات العريضة.',
        'لعبة الألوان المنزلية: ابحث معي عن كل ما هو أصفر في الغرفة.',
        'قراءة قصة مصورة يومياً قبل النوم لمدة ٥ إلى ١٠ دقائق لتعزيز الحصيلة اللغوية.'
      ]
    }
  },

  // 2. عمر من 3 سنوات إلى أقل من 4 سنوات
  {
    id: 'assessment-age-3-4',
    title: 'اختبار المهارات الاستكشافية والمنطقية',
    subtitle: 'قياس مطابقة الأشكال، اكتشاف المختلف، العد الأولي (١-٣)، وتصنيف البيئات',
    ageGroup: '3-4',
    ageGroupLabel: 'من ٣ سنوات إلى أقل من ٤ سنوات',
    targetSkills: [
      'التعرف على الأشكال الهندسية الأساسية (دائرة، مربع، مثلث)',
      'اكتشاف العنصر الدخيل والمختلف في المجموعة',
      'العد الحسي حتى ٣ وربط الكمية بالمدلول',
      'التمييز بين الحجم الكبير والصغير'
    ],
    instructionsForParent: 'ساعد طفلك بقراءة رأس السؤال فقط ودعه يحل بمفرده. استخدم عبارات مشجعة مثل: "ما أروع تفكيرك!"، ولا تعطه الإجابة بشكل مباشر.',
    oralMotorEvaluationGuide: 'يستطيع طفل هذه المرحلة مسك قلم تلوين عريض ووضع دائرة بسيطة أو الإشارة بوضوح تام.',
    totalPoints: 20,
    sections: [
      {
        id: 'sec-3-1',
        type: 'odd_one_out',
        typeLabel: 'اكتشف المختلف',
        title: 'النشاط الأول: اكتشف الصورة التي لا تنتمي للمجموعة',
        instructions: 'انظر إلى كل صف، وضع علامة أو دائرة حول الصورة المختلفة تماماً',
        points: 5,
        items: [
          {
            id: 'item-3-1-1',
            prompt: 'أي صورة تختلف عن بقية الفواكه الشهية؟',
            correctAnswer: 'السيارة',
            explanation: 'السيارة وسيلة مواصلات بينما البقية فواكه تؤكل',
            options: [
              { id: 'opt-3-1', label: 'تفاحة', visual: '🍎', isCorrect: false },
              { id: 'opt-3-2', label: 'موزة', visual: '🍌', isCorrect: false },
              { id: 'opt-3-3', label: 'سيارة', visual: '🚗', isCorrect: true },
              { id: 'opt-3-4', label: 'برتقالة', visual: '🍊', isCorrect: false }
            ]
          },
          {
            id: 'item-3-1-2',
            prompt: 'أي حيوان لا يعيش في البحر ويسبح في الماء؟',
            correctAnswer: 'الدب البري',
            explanation: 'الدب حيوان بري بينما الأسماك كائنات بحرية',
            options: [
              { id: 'opt-3-5', label: 'سمكة ملونة', visual: '🐠', isCorrect: false },
              { id: 'opt-3-6', label: 'حوت أزرق', visual: '🐳', isCorrect: false },
              { id: 'opt-3-7', label: 'دب الغابة', visual: '🐻', isCorrect: true },
              { id: 'opt-3-8', label: 'أخطبوط', visual: '🐙', isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 'sec-3-2',
        type: 'matching',
        typeLabel: 'التوصيل الهندسي والظلال',
        title: 'النشاط الثاني: توصيل الأشكال الهندسية بما يشبهها',
        instructions: 'صل بين كل شكل هندسي والشيء الذي يمتلك نفس شكله في الحياة',
        points: 5,
        items: [
          {
            id: 'item-3-2-1',
            prompt: 'صل الشكل الهندسي بالعنصر الحقيقي المشابه',
            correctAnswer: 'الدائرة تشبه ساعة الحائط، المربع يشبه الهدية، المثلث يشبه شريحة البيتزا',
            matchPairs: [
              { leftId: 'l1', left: 'دائرة 🟡', leftVisual: '🟡', rightId: 'r1', right: 'ساعة حائط ⏰', rightVisual: '⏰' },
              { leftId: 'l2', left: 'مربع 🟩', leftVisual: '🟩', rightId: 'r2', right: 'صندوق هدية 🎁', rightVisual: '🎁' },
              { leftId: 'l3', left: 'مثلث 🔺', leftVisual: '🔺', rightId: 'r3', right: 'شريحة بيتزا 🍕', rightVisual: '🍕' }
            ]
          }
        ]
      },
      {
        id: 'sec-3-3',
        type: 'counting',
        typeLabel: 'العد والكميات',
        title: 'النشاط الثالث: عد العناصر حتى الرقم ٣',
        instructions: 'عدّ النجوم والبالونات ثم اختر الرقم الصحيح',
        points: 5,
        items: [
          {
            id: 'item-3-3-1',
            prompt: 'كم بالوناً جميلاً ترى في الصورة؟ 🎈 🎈',
            countTarget: 2,
            correctAnswer: '٢ (اثنان)',
            explanation: 'عد عنصرين متطابقين',
            options: [
              { id: 'c-1', label: '١', visual: '🎈', isCorrect: false },
              { id: 'c-2', label: '٢ (اثنان)', visual: '🎈🎈', isCorrect: true },
              { id: 'c-3', label: '٣', visual: '🎈🎈🎈', isCorrect: false }
            ]
          },
          {
            id: 'item-3-3-2',
            prompt: 'كم نجمة ذهبية لامعة تلمع في السماء؟ ⭐ ⭐ ⭐',
            countTarget: 3,
            correctAnswer: '٣ (ثلاثة)',
            explanation: 'عد ثلاثة عناصر والتعرف على رمز الرقم ٣',
            options: [
              { id: 'c-4', label: '١', visual: '⭐', isCorrect: false },
              { id: 'c-5', label: '٢', visual: '⭐⭐', isCorrect: false },
              { id: 'c-6', label: '٣ (ثلاثة)', visual: '⭐⭐⭐', isCorrect: true }
            ]
          }
        ]
      },
      {
        id: 'sec-3-4',
        type: 'multiple_choice',
        typeLabel: 'التمييز بين الحجم والمفاهيم',
        title: 'النشاط الرابع: تمييز الحجم (كبير / صغير)',
        instructions: 'اختر الصورة الأكبر حجماً في كل سؤال',
        points: 5,
        items: [
          {
            id: 'item-3-4-1',
            prompt: 'أي حيوان هو "الأكبر حجماً"؟ الفيل الضخم أم النملة الصغيرة؟',
            correctAnswer: 'الفيل الضخم',
            explanation: 'مقارنة الحجم بين كبير وصغير',
            options: [
              { id: 'sz-1', label: 'الفيل الضخم 🐘', visual: '🐘', isCorrect: true },
              { id: 'sz-2', label: 'النملة الصغيرة 🐜', visual: '🐜', isCorrect: false }
            ]
          },
          {
            id: 'item-3-4-2',
            prompt: 'أي وسيلة نقل تتسع لركاب أكثر وحجمها كبير جداً؟',
            correctAnswer: 'الطائرة الكبيرة',
            explanation: 'إدراك السعة والحجم النسبي',
            options: [
              { id: 'sz-3', label: 'الدراجة الهوائية 🚲', visual: '🚲', isCorrect: false },
              { id: 'sz-4', label: 'الطائرة الكبيرة ✈️', visual: '✈️', isCorrect: true }
            ]
          }
        ]
      }
    ],
    correctionGuide: {
      overview: 'دليل تصحيح اختبار المهارات الاستكشافية للأطفال في عمر ٣ إلى ٤ سنوات. يركز على الوعي الرياضي والملاحظة البصرية الدقيقة.',
      answerKeySummary: [
        {
          sectionTitle: 'النشاط الأول: اكتشف المختلف',
          sectionType: 'odd_one_out',
          answers: [
            { question: 'المختلف بين الفواكه', correct: 'السيارة 🚗', visualAnswer: '🚗', note: 'نقطتان ونصف للتعليل بأن السيارة جماد وليست طعاماً' },
            { question: 'المختلف بين حيوانات البحر', correct: 'الدب 🐻', visualAnswer: '🐻', note: 'نقطتان ونصف لتمييز البيئة البرية عن المائية' }
          ]
        },
        {
          sectionTitle: 'النشاط الثاني: التوصيل الهندسي',
          sectionType: 'matching',
          answers: [
            { question: 'الدائرة 🟡', correct: 'ساعة الحائط ⏰', visualAnswer: '🟡 ➡️ ⏰', note: 'درجة ونصف للربط الشكلي' },
            { question: 'المربع 🟩', correct: 'الهدية 🎁', visualAnswer: '🟩 ➡️ 🎁', note: 'درجة ونصف' },
            { question: 'المثلث 🔺', correct: 'البيتزا 🍕', visualAnswer: '🔺 ➡️ 🍕', note: 'درجتان' }
          ]
        },
        {
          sectionTitle: 'النشاط الثالث: العد والكميات',
          sectionType: 'counting',
          answers: [
            { question: 'عد البالونات 🎈🎈', correct: 'الرقم ٢', visualAnswer: '٢', note: 'نقطتان ونصف للعد التنازلي أو التصاعدي الصحيح' },
            { question: 'عد النجوم ⭐⭐⭐', correct: 'الرقم ٣', visualAnswer: '٣', note: 'نقطتان ونصف لربط الأعداد بالكمية' }
          ]
        },
        {
          sectionTitle: 'النشاط الرابع: الحجم والمفاهيم',
          sectionType: 'multiple_choice',
          answers: [
            { question: 'الحيوان الأكبر', correct: 'الفيل 🐘', visualAnswer: '🐘', note: 'نقطتان ونصف لتمييز الكبير والصغير' },
            { question: 'المركبة الأكبر', correct: 'الطائرة ✈️', visualAnswer: '✈️', note: 'نقطتان ونصف' }
          ]
        }
      ],
      scoringRubric: [
        {
          level: 'عالم رياضيات وملاحظ بارع (متميز)',
          scoreRange: '١٨ - ٢٠ درجة',
          percentage: '٩٠٪ - ١٠٠٪',
          description: 'الطفل يمتلك فهماً منطقياً ممتازاً للأشكال والأرقام الأولى ومفهوم التمايز والتصنيف.',
          recommendedAction: 'انتقل به إلى تمارين العد حتى ٥ وحل المتاهات البسيطة وإكمال الأنماط المتكررة.'
        },
        {
          level: 'متعلم متفوق ومثابر (جيد جداً)',
          scoreRange: '١٤ - ١٧ درجة',
          percentage: '٧٠٪ - ٨٥٪',
          description: 'يجيد العد والتمييز ولكنه قد يخلط بين بعض الأشكال مثل المربع والمستطيل أو يستعجل في العد.',
          recommendedAction: 'اجعله يلمس المكعبات بيده ويعدها واحداً تلو الآخر لتثبيت التناظر الأحادي.'
        },
        {
          level: 'يحتاج تدريباً حسياً إضافياً (مستوى تأسيسي)',
          scoreRange: 'أقل من ١٤ درجة',
          percentage: 'أقل من ٧٠٪',
          description: 'قد يواجه صعوبة في الربط المجرد بين رمز الرقم والكمية المعدودة.',
          recommendedAction: 'قم بطباعة أوراق تتبع الأرقام والخطوط من قسم أوراق العمل ومارس العد بالأصابع والألعاب اليومية.'
        }
      ],
      oralMotorRubric: [
        'إذا لم يستطع الطفل رسم خط التوصيل، دعه يضع إصبعه على الشكل الأول ثم يحركه للشكل الثاني.',
        'شجع الطفل على العد بصوت مرتفع: "واحد... اثنان!" لتعزيز الذاكرة العاملة.',
        'امدح تركيز الطفل وليس فقط النتيجة الصحيحة لبناء الثقة بالنفس.'
      ],
      remedialRecommendations: [
        'أوراق عمل مطابقة الأشكال وتصنيف الأطعمة والحيوانات للفئة (٣-٤ سنوات).',
        'نشاط تلوين الأشكال الهندسية بألوان موجهة.',
        'لعبة الكنز المنزلي: إيجاد ٣ ملاعق أو ٣ ألعاب في السلة.'
      ]
    }
  },

  // 3. عمر من 4 سنوات إلى أقل من 5 سنوات
  {
    id: 'assessment-age-4-5',
    title: 'اختبار الاستعداد اللغوي والمعرفي',
    subtitle: 'قياس مطابقة الحروف بالصور، إكمال الأنماط، العد حتى ٥، وترتيب الأحداث',
    ageGroup: '4-5',
    ageGroupLabel: 'من ٤ سنوات إلى أقل من ٥ سنوات',
    targetSkills: [
      'ربط الحروف العربية بالصور الدالة عليها (أ، ب، ت، ث)',
      'إكمال الأنماط البصرية المتكررة (أحمر، أزرق، أحمر...)',
      'العد الحسابي حتى ٥ وربط الرمز بالكمية',
      'ترتيب الأحداث والتسلسل المنطقي (خطوات غسل اليدين / دورة بذرة)'
    ],
    instructionsForParent: 'هذا الاختبار يهيئ الطفل للروضة التمهيدية. وفر للطفل قلماً ملوناً ومكاناً مريحاً. لا تتحدث أثناء تفكيره واترك له فرصة التأمل والتركيز.',
    oralMotorEvaluationGuide: 'يستطيع الطفل مسك قلم الرصاص بشكل سليم ووضع خطوط مستقيمة للتوصيل وتحديد الدوائر بوضوح.',
    totalPoints: 20,
    sections: [
      {
        id: 'sec-4-1',
        type: 'matching',
        typeLabel: 'الحروف والكلمات',
        title: 'النشاط الأول: مطابقة الحرف بالصورة التي يبدأ بها',
        instructions: 'صل بين كل حرف عربي والصورة التي تبدأ بصوته اللطيف',
        points: 5,
        items: [
          {
            id: 'item-4-1-1',
            prompt: 'صل الحرف بالصورة المناسبة',
            correctAnswer: 'أ أسد، ب بطة، ت تفاحة',
            matchPairs: [
              { leftId: 'l1', left: 'حرف ( أ )', leftVisual: '🅰️ أ', rightId: 'r1', right: 'أسد شجاع 🦁', rightVisual: '🦁' },
              { leftId: 'l2', left: 'حرف ( ب )', leftVisual: '🅱️ ب', rightId: 'r2', right: 'بطة تسبح 🦆', rightVisual: '🦆' },
              { leftId: 'l3', left: 'حرف ( ت )', leftVisual: '🆃 ت', rightId: 'r3', right: 'تفاحة حمراء 🍎', rightVisual: '🍎' }
            ]
          }
        ]
      },
      {
        id: 'sec-4-2',
        type: 'sequencing',
        typeLabel: 'إكمال الأنماط والتسلسل',
        title: 'النشاط الثاني: إكمال النمط المتكرر',
        instructions: 'انظر إلى تسلسل الأشكال، واختر الشكل الذي يكمل النمط بشكل صحيح',
        points: 5,
        items: [
          {
            id: 'item-4-2-1',
            prompt: 'ما الشكل التالي في النمط: 🟡 🟦 🟡 🟦 [ ؟ ]',
            correctAnswer: 'الدائرة الصفراء 🟡',
            explanation: 'نمط متناوب ثنائي (أ - ب - أ - ب - [أ])',
            options: [
              { id: 'pat-1', label: 'دائرة صفراء 🟡', visual: '🟡', isCorrect: true },
              { id: 'pat-2', label: 'مربع أزرق 🟦', visual: '🟦', isCorrect: false },
              { id: 'pat-3', label: 'مثلث أخضر 🔺', visual: '🔺', isCorrect: false }
            ]
          },
          {
            id: 'item-4-2-2',
            prompt: 'ما العنصر التالي في النمط: 🌞 🌙 🌞 🌙 [ ؟ ]',
            correctAnswer: 'الشمس المشرقة 🌞',
            explanation: 'نمط نهار وليل متكرر',
            options: [
              { id: 'pat-4', label: 'الشمس المشرقة 🌞', visual: '🌞', isCorrect: true },
              { id: 'pat-5', label: 'القمر المنير 🌙', visual: '🌙', isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 'sec-4-3',
        type: 'counting',
        typeLabel: 'العد والكميات حتى ٥',
        title: 'النشاط الثالث: عد الكميات وتحديد الرقم الصحيح',
        instructions: 'عدّ الفواكه والسيارات ثم ضع دائرة حول الرقم المناسب',
        points: 5,
        items: [
          {
            id: 'item-4-3-1',
            prompt: 'كم تفاحة شهية في هذه السلة؟ 🍎 🍎 🍎 🍎',
            countTarget: 4,
            correctAnswer: '٤ (أربعة)',
            explanation: 'عد ٤ عناصر وكتابة أو اختيار الرقم ٤',
            options: [
              { id: 'cnt-1', label: '٣', visual: '🍎🍎🍎', isCorrect: false },
              { id: 'cnt-2', label: '٤ (أربعة)', visual: '🍎🍎🍎🍎', isCorrect: true },
              { id: 'cnt-3', label: '٥', visual: '🍎🍎🍎🍎🍎', isCorrect: false }
            ]
          },
          {
            id: 'item-4-3-2',
            prompt: 'كم سيارة في موقف السيارات؟ 🚗 🚗 🚗 🚗 🚗',
            countTarget: 5,
            correctAnswer: '٥ (خمسة)',
            explanation: 'عد عناصر حتى الرقم ٥ وربطها بالرمز المكتوب',
            options: [
              { id: 'cnt-4', label: '٤', visual: '🚗🚗🚗🚗', isCorrect: false },
              { id: 'cnt-5', label: '٥ (خمسة)', visual: '🚗🚗🚗🚗🚗', isCorrect: true },
              { id: 'cnt-6', label: '٦', visual: '🚗🚗🚗🚗🚗🚗', isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 'sec-4-4',
        type: 'multiple_choice',
        typeLabel: 'الترتيب المنطقي والمهارات الحياتية',
        title: 'النشاط الرابع: ترتيب الأحداث اليومية',
        instructions: 'ماذا نفعل أولاً عند الاستعداد للنوم ليلاً؟',
        points: 5,
        items: [
          {
            id: 'item-4-4-1',
            prompt: 'قبل النوم ليلاً، ما الخطوة الصحية الأولى للحفاظ على أسناننا؟',
            correctAnswer: 'تنظيف الأسنان بالفرشاة والمعجون 🪥',
            explanation: 'ترتيب العادات الصحية اليومية',
            options: [
              { id: 'ev-1', label: 'تنظيف الأسنان بالفرشاة والمعجون 🪥', visual: '🪥', isCorrect: true },
              { id: 'ev-2', label: 'اللعب بالكرة في الحديقة ⚽', visual: '⚽', isCorrect: false },
              { id: 'ev-3', label: 'تناول الحلوى الكثيرة 🍬', visual: '🍬', isCorrect: false }
            ]
          },
          {
            id: 'item-4-4-2',
            prompt: 'ماذا يحتاج النبات الصغير لكي ينمو ويصبح شجرة كبيرة وثماراً؟',
            correctAnswer: 'الماء وأشعة الشمس 💧☀️',
            explanation: 'مفاهيم العلوم والطبيعة للطفل',
            options: [
              { id: 'ev-4', label: 'الماء وأشعة الشمس 💧☀️', visual: '🌱💧☀️', isCorrect: true },
              { id: 'ev-5', label: 'العصير المثلج والمثلجات 🍦', visual: '🍦', isCorrect: false }
            ]
          }
        ]
      }
    ],
    correctionGuide: {
      overview: 'دليل تصحيح اختبار الاستعداد اللغوي والمعرفي (عمر ٤-٥ سنوات). يقيس نضج الطفل للاستعداد لمرحلة رياض الأطفال.',
      answerKeySummary: [
        {
          sectionTitle: 'النشاط الأول: الحروف والكلمات',
          sectionType: 'matching',
          answers: [
            { question: 'حرف أ', correct: 'أسد 🦁', visualAnswer: 'أ ➡️ 🦁', note: 'درجة ونصف للتمييز الصوتي الأولي' },
            { question: 'حرف ب', correct: 'بطة 🦆', visualAnswer: 'ب ➡️ 🦆', note: 'درجة ونصف' },
            { question: 'حرف ت', correct: 'تفاحة 🍎', visualAnswer: 'ت ➡️ 🍎', note: 'درجتان' }
          ]
        },
        {
          sectionTitle: 'النشاط الثاني: إكمال الأنماط',
          sectionType: 'sequencing',
          answers: [
            { question: 'نمط الدائرة والمربع', correct: 'الدائرة الصفراء 🟡', visualAnswer: '🟡', note: 'نقطتان ونصف للإدراك التتابعي' },
            { question: 'نمط الشمس والقمر', correct: 'الشمس المشرقة 🌞', visualAnswer: '🌞', note: 'نقطتان ونصف' }
          ]
        },
        {
          sectionTitle: 'النشاط الثالث: العد والكميات',
          sectionType: 'counting',
          answers: [
            { question: 'عد ٤ تفاحات', correct: 'الرقم ٤', visualAnswer: '٤', note: 'نقطتان ونصف للعد الدقيق وتحديد الرمز' },
            { question: 'عد ٥ سيارات', correct: 'الرقم ٥', visualAnswer: '٥', note: 'نقطتان ونصف لسلامة العد' }
          ]
        },
        {
          sectionTitle: 'النشاط الرابع: الترتيب المنطقي',
          sectionType: 'multiple_choice',
          answers: [
            { question: 'الخطوة الأولى قبل النوم', correct: 'تنظيف الأسنان 🪥', visualAnswer: '🪥', note: 'نقطتان ونصف لإدراك السلوك الصحي' },
            { question: 'حاجة النبات للنمو', correct: 'الماء والشمس 🌱', visualAnswer: '💧☀️', note: 'نقطتان ونصف للوعي البيئي' }
          ]
        }
      ],
      scoringRubric: [
        {
          level: 'جاهزية تمهيدية ممتازة (مستوى متقدم)',
          scoreRange: '١٨ - ٢٠ درجة',
          percentage: '٩٠٪ - ١٠٠٪',
          description: 'الطفل مؤهل تماماً لدخول التمهيدي ويمتلك وعياً فونولوجياً (صوتياً) وحسابياً راسخاً.',
          recommendedAction: 'ادعمه في كتابة الحروف بأشكالها المختلفة وتدريبات الجمع البسيط بالصور.'
        },
        {
          level: 'أداء واعد ومستقر (مستوى متوسط مرتفع)',
          scoreRange: '١٤ - ١٧ درجة',
          percentage: '٧٠٪ - ٨٥٪',
          description: 'يعرف الحروف والعد ولكنه قد يتعثر في الأنماط أو يحتاج تذكيراً بالصوت الأولي للكلمة.',
          recommendedAction: 'استخدم بطاقات الحروف المجسمة والتلوين الموجه من مكتبة أوراق العمل.'
        },
        {
          level: 'يحتاج تعزيز المهارات التأسيسية (مستوى داعم)',
          scoreRange: 'أقل من ١٤ درجة',
          percentage: 'أقل من ٧٠٪',
          description: 'يحتاج مزيداً من التدريب على ربط رمز الحرف بالصوت ومهارة تتبع الأنماط المتكررة.',
          recommendedAction: 'ركز على أوراق عمل تتبع الحروف وقصص الحيوانات لربط الحروف بالبيئة اليومية.'
        }
      ],
      oralMotorRubric: [
        'راقب قبضة القلم: هل يمسك القلم بالقبضة الثلاثية الصحيحة أم بقبضة الكف؟ وجهه بلطف دون توتر.',
        'اطلب من الطفل نطق صوت الحرف (أَ... بـَ... تَ...) وليس فقط اسم الحرف المجرد.',
        'اسمح للطفل بتلوين الإجابة إذا كان يفضل التلوين على وضع الدائرة.'
      ],
      remedialRecommendations: [
        'تصفح أوراق عمل الحروف العربية (تتبع وتوصيل الحروف بالكلمات).',
        'متاهات الأرقام والعد حتى ٥ من قسم أوراق العمل.',
        'تدريبات ترتيب أحداث القصة المصورة لتعزيز التفكير المنطقي.'
      ]
    }
  },

  // 4. عمر من 5 سنوات إلى 6 سنوات
  {
    id: 'assessment-age-5-6',
    title: 'اختبار الاستعداد الشامل للمدرسة والصف الأول',
    subtitle: 'قياس الوعي الصوتي، الحساب الأولي، التفكير المنطقي، واستيعاب القصص المصورة',
    ageGroup: '5-6',
    ageGroupLabel: 'من ٥ سنوات إلى ٦ سنوات',
    targetSkills: [
      'تمييز أصوات الحروف وحركات المد القصير (الفتحة والضمة والكسرة)',
      'الجمع والطرح البسيط ضمن النطاق من ١ إلى ١٠ ومقارنة الأعداد',
      'فهم تسلسل القصة المصورة والسبب والنتيجة',
      'الاستكشاف العلمي وحل المشكلات والاستعداد للمدرسة'
    ],
    instructionsForParent: 'هذا الاختبار بمثابة فحص تشخيصي ممتع لجاهزية الطفل للصف الأول الابتدائي. أعطه الوقت الكافي، وشجّعه على التفكير بصوت مسموع وشرح سبب اختياره.',
    oralMotorEvaluationGuide: 'يستطيع الطفل التحكم الدقيق في القلم، ورسم المسارات، وكتابة الأرقام والحروف أو وضع علامات صحيحة.',
    totalPoints: 20,
    sections: [
      {
        id: 'sec-5-1',
        type: 'multiple_choice',
        typeLabel: 'الوعي الصوتي واللغوي',
        title: 'النشاط الأول: تمييز أصوات الحروف وبداية الكلمات',
        instructions: 'استمع إلى الكلمة أو اقرأها واختر الحرف المناسب بالتشكيل الصحيح',
        points: 5,
        items: [
          {
            id: 'item-5-1-1',
            prompt: 'كلمة «بُرْتُقَال» 🍊 تبدأ بحرف الباء مع أي حركة صوتية؟',
            correctAnswer: 'بُـ (الباء المضمومة)',
            explanation: 'التمييز بين حركات المد القصير (فتحة، ضمة، كسرة)',
            options: [
              { id: 'ph-1', label: 'بَـ (فتحة)', visual: 'بَـ', isCorrect: false },
              { id: 'ph-2', label: 'بُـ (ضمة)', visual: 'بُـ', isCorrect: true },
              { id: 'ph-3', label: 'بِـ (كسرة)', visual: 'بِـ', isCorrect: false }
            ]
          },
          {
            id: 'item-5-1-2',
            prompt: 'أي كلمة من الكلمات التالية تنتهي بنفس الصوت القافيّ لكلمة «صَدِيق»؟',
            correctAnswer: 'فَرِيق ⚽',
            explanation: 'الوعي بالقوافي والأصوات الأخيرة',
            options: [
              { id: 'ph-4', label: 'فَرِيق ⚽', visual: 'فريق', isCorrect: true },
              { id: 'ph-5', label: 'قَلَم ✏️', visual: 'قلم', isCorrect: false },
              { id: 'ph-6', label: 'كِتَاب 📖', visual: 'كتاب', isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 'sec-5-2',
        type: 'counting',
        typeLabel: 'الجمع والمقارنة الحسابية',
        title: 'النشاط الثاني: الجمع البسيط ومقارنة الكميات',
        instructions: 'احسب ناتج الجمع التالي باستخدام الصور، واختر الرقم الصحيح',
        points: 5,
        items: [
          {
            id: 'item-5-2-1',
            prompt: 'لديك ٣ تفاحات 🍎🍎🍎 وأعطتك أمك تفاحتين إضافيتين 🍎🍎. كم تفاحة معك الآن؟ (٣ + ٢ = ؟)',
            correctAnswer: '٥ تفاحات',
            countTarget: 5,
            explanation: 'عملية الجمع ضمن نطاق الرقم ٥',
            options: [
              { id: 'math-1', label: '٤', visual: '🍎🍎🍎🍎', isCorrect: false },
              { id: 'math-2', label: '٥ تفاحات (٣ + ٢ = ٥)', visual: '🍎🍎🍎🍎🍎', isCorrect: true },
              { id: 'math-3', label: '٦', visual: '🍎🍎🍎🍎🍎🍎', isCorrect: false }
            ]
          },
          {
            id: 'item-5-2-2',
            prompt: 'أي مجموعة تحتوي على عدد "أكبر" من العناصر؟',
            correctAnswer: 'مجموعة النجوم (٦ نجوم)',
            explanation: 'مقارنة الكميات بين مجموعتين',
            options: [
              { id: 'math-4', label: '٣ بالونات 🎈🎈🎈', visual: '🎈🎈🎈', isCorrect: false },
              { id: 'math-5', label: '٦ نجوم لامعة ⭐⭐⭐⭐⭐⭐', visual: '⭐⭐⭐⭐⭐⭐', isCorrect: true }
            ]
          }
        ]
      },
      {
        id: 'sec-5-3',
        type: 'matching',
        typeLabel: 'العلوم والطبيعة',
        title: 'النشاط الثالث: ربط أجزاء النبات بوظيفتها في الطبيعة',
        instructions: 'صل بين كل جزء من النبات ودوره الرائع في حياته',
        points: 5,
        items: [
          {
            id: 'item-5-3-1',
            prompt: 'صل الجزء بوظيفته في نمو النبات',
            correctAnswer: 'الجذور تمتص الماء من التربة، الأوراق تصنع الغذاء بالضوء، الساق يحمل النبتة',
            matchPairs: [
              { leftId: 'l1', left: 'الجذور في التربة 🌾', leftVisual: '🌾', rightId: 'r1', right: 'امتصاص الماء والغذاء 💧', rightVisual: '💧' },
              { leftId: 'l2', left: 'الأوراق الخضراء 🍃', leftVisual: '🍃', rightId: 'r2', right: 'صنع الغذاء بضوء الشمس ☀️', rightVisual: '☀️' },
              { leftId: 'l3', left: 'الزهرة الملونة 🌸', leftVisual: '🌸', rightId: 'r3', right: 'إنتاج البذور والثمار الشهية 🍎', rightVisual: '🍎' }
            ]
          }
        ]
      },
      {
        id: 'sec-5-4',
        type: 'sequencing',
        typeLabel: 'القصص المصورة والتفكير المنطقي',
        title: 'النشاط الرابع: تسلسل قصة زراعة النبتة الجميلة',
        instructions: 'رتّب مراحل نمو النبتة من البداية حتى تصبح زهرة متفتحة (١، ٢، ٣)',
        points: 5,
        items: [
          {
            id: 'item-5-4-1',
            prompt: 'رتب خطوات نمو النبتة: البذرة، البرعم الصغير، الزهرة المزهرة',
            correctAnswer: '١: وضع البذرة وسقيها، ٢: ظهور البرعم الأخضر، ٣: تفتح الزهرة',
            sequence: [
              { id: 'sq-1', label: 'وضع البذرة في التراب وسقيها بالماء', visual: '🌰💧', order: 1 },
              { id: 'sq-2', label: 'خروج البرعم الصغير فوق الأرض', visual: '🌱', order: 2 },
              { id: 'sq-3', label: 'تفتح الزهرة الجميلة وتكون الثمرة', visual: '🌻', order: 3 }
            ]
          }
        ]
      }
    ],
    correctionGuide: {
      overview: 'دليل تصحيح اختبار الجاهزية للمدرسة والصف الأول (عمر ٥ إلى ٦ سنوات). تم بناؤه وفق معايير مناهج الطفولة المبكرة الوطنية والدولية.',
      answerKeySummary: [
        {
          sectionTitle: 'النشاط الأول: الوعي الصوتي واللغوي',
          sectionType: 'multiple_choice',
          answers: [
            { question: 'صوت بداية بُرتغال', correct: 'بُـ (ضمة)', visualAnswer: 'بُـ', note: 'نقطتان ونصف للوعي الصوتي الدقيق بالحركات' },
            { question: 'قافية صديق', correct: 'فريق ⚽', visualAnswer: 'فريق', note: 'نقطتان ونصف للتمييز الفونولوجي' }
          ]
        },
        {
          sectionTitle: 'النشاط الثاني: الجمع والمقارنة',
          sectionType: 'counting',
          answers: [
            { question: 'ناتج ٣ + ٢', correct: '٥ تفاحات', visualAnswer: '٥', note: 'نقطتان ونصف للحل الحسابي التراكمي' },
            { question: 'المجموعة الأكبر', correct: '٦ نجوم ⭐', visualAnswer: '٦ نجوم', note: 'نقطتان ونصف لمقارنة الأعداد' }
          ]
        },
        {
          sectionTitle: 'النشاط الثالث: العلوم والطبيعة',
          sectionType: 'matching',
          answers: [
            { question: 'الجذور', correct: 'امتصاص الماء 💧', visualAnswer: '🌾 ➡️ 💧', note: 'درجة ونصف للربط الوظيفي' },
            { question: 'الأوراق', correct: 'صنع الغذاء بالشمس ☀️', visualAnswer: '🍃 ➡️ ☀️', note: 'درجة ونصف' },
            { question: 'الزهرة', correct: 'إنتاج البذور 🌸', visualAnswer: '🌸 ➡️ 🍎', note: 'درجتان' }
          ]
        },
        {
          sectionTitle: 'النشاط الرابع: تسلسل القصة المصورة',
          sectionType: 'sequencing',
          answers: [
            { question: 'ترتيب دورة نمو النبات', correct: 'البذرة (١) ⬅️ البرعم (٢) ⬅️ الزهرة (٣)', visualAnswer: '🌰 ➡️ 🌱 ➡️ 🌻', note: '٥ درجات كاملة للترتيب الزمني والمنطقي السليم' }
          ]
        }
      ],
      scoringRubric: [
        {
          level: 'جاهزية كاملة ومتميزة للمدرسة (مستوى تفوق)',
          scoreRange: '١٨ - ٢٠ درجة',
          percentage: '٩٠٪ - ١٠٠٪',
          description: 'الطفل يمتلك كافة مقومات النجاح للصف الأول، من لغة وتفكير حسابي ووعي بيئي وتسلسل منطقي ممتاز.',
          recommendedAction: 'زوّده بكتب القراءة السهلة، وأوراق الجمع والطرح والقصص المصورة من مكتبة أوراق العمل.'
        },
        {
          level: 'جاهزية جيدة مع حاجة لممارسة بسيطة (مستوى متوسط)',
          scoreRange: '١٤ - ١٧ درجة',
          percentage: '٧٠٪ - ٨٥٪',
          description: 'يمتلك المهارات الأساسية ولكنه قد يخطئ في تشكيل الحروف أو يحتاج وقتاً أطول في العد والمقارنة.',
          recommendedAction: 'كرر معه تدريبات الحركات القصيرة بالصوت، والعد بالألعاب والقطع النقدية البسيطة.'
        },
        {
          level: 'يحتاج خطة دعم وتهيئة قبل بدء العام الدراسي',
          scoreRange: 'أقل من ١٤ درجة',
          percentage: 'أقل من ٧٠٪',
          description: 'يحتاج الطفل إلى تقوية التركيز والوعي الصوتي بالحروف والمهارات الرياضية الأولية.',
          recommendedAction: 'تطبيق أوراق عمل الاستعداد للمدرسة وأوراق الحروف والأرقام للفئة ٥-٦ بانتظام وبشكل يومي وممتع.'
        }
      ],
      oralMotorRubric: [
        'تحقق من وضوح خط الطفل وسرعة استجابته دون توتر.',
        'شجع الطفل على قراءة الكلمات البسيطة بتهجئة صوتية هادئة.',
        'تقبل الترتيب المنطقي إذا برره الطفل بفكرة ذكية ومقنعة.'
      ],
      remedialRecommendations: [
        'أوراق عمل الحروف والمدود والكلمات البسيطة للفئة ٥-٦ سنوات.',
        'مجموعة أوراق الجمع والطرح المصورة للأطفال.',
        'قصص مصورة وتدريبات التفكير المنطقي وحل المتاهات المتقدمة.'
      ]
    }
  }
];

// Question Bank for Custom Test Builder
export interface QuestionBankItem {
  id: string;
  type: AssessmentSection['type'];
  ageGroup: AgeGroup;
  title: string;
  prompt: string;
  options?: Array<{ id: string; label: string; visual?: string; isCorrect?: boolean }>;
  matchPairs?: Array<{ leftId: string; left: string; leftVisual: string; rightId: string; right: string; rightVisual: string }>;
  sequence?: Array<{ id: string; label: string; visual: string; order: number }>;
  countTarget?: number;
  correctAnswer: string;
  explanation: string;
}

export const QUESTION_BANK: QuestionBankItem[] = [
  // Matching items
  {
    id: 'qb-match-1',
    type: 'matching',
    ageGroup: '2-3',
    title: 'توصيل الحيوانات بصغارها',
    prompt: 'صل كل أم بصغيرها اللطيف',
    correctAnswer: 'القطة بصغيرها الهرير، الكلب بالجرو، البطة بالفرخ',
    explanation: 'إدراك الرعاية وعلاقة الأم بصغيرها',
    matchPairs: [
      { leftId: 'l1', left: 'القطة 🐱', leftVisual: '🐱', rightId: 'r1', right: 'هرير صغير 🐾', rightVisual: '🐾' },
      { leftId: 'l2', left: 'البطة 🦆', leftVisual: '🦆', rightId: 'r2', right: 'فرخ بط صغير 🐥', rightVisual: '🐥' }
    ]
  },
  {
    id: 'qb-match-2',
    type: 'matching',
    ageGroup: '3-4',
    title: 'توصيل الأدوات بأصحاب المهن',
    prompt: 'صل كل أداة بالشخص الذي يستخدمها في عمله',
    correctAnswer: 'الطبيب بالسماعة، النجار بالمطرقة، الطاهي بالمغرفة',
    explanation: 'التعرف على المهن والأدوات المجتمعية',
    matchPairs: [
      { leftId: 'm1', left: 'الطبيب 👨‍⚕️', leftVisual: '👨‍⚕️', rightId: 'mr1', right: 'السماعة الطبية 🩺', rightVisual: '🩺' },
      { leftId: 'm2', left: 'الطاهي 👨‍🍳', leftVisual: '👨‍🍳', rightId: 'mr2', right: 'قبعة الطهي والمغرفة 🍳', rightVisual: '🍳' }
    ]
  },
  {
    id: 'qb-match-3',
    type: 'matching',
    ageGroup: '4-5',
    title: 'توصيل الحروف بالكلمات (س - ش - ص)',
    prompt: 'صل الحرف بالصورة المناسبة التي تبدأ به',
    correctAnswer: 'س سيارة، ش شمس، ص صقر',
    explanation: 'ربط الحروف بالصور',
    matchPairs: [
      { leftId: 's1', left: 'حرف ( س )', leftVisual: 'س', rightId: 'sr1', right: 'سيارة سريعة 🚗', rightVisual: '🚗' },
      { leftId: 's2', left: 'حرف ( ش )', leftVisual: 'ش', rightId: 'sr2', right: 'شمس مشرقة ☀️', rightVisual: '☀️' }
    ]
  },

  // Pair Matching / Shadows
  {
    id: 'qb-pair-1',
    type: 'pair_matching',
    ageGroup: '2-3',
    title: 'مطابقة الألوان الأساسية',
    prompt: 'أشر إلى المكعب الذي يطابق لون المكعب الأحمر 🔴',
    correctAnswer: 'المكعب الأحمر 🔴',
    explanation: 'التمييز بين الألوان',
    options: [
      { id: 'p1', label: 'أحمر 🔴', visual: '🔴', isCorrect: true },
      { id: 'p2', label: 'أزرق 🔵', visual: '🔵', isCorrect: false },
      { id: 'p3', label: 'أخضر 🟢', visual: '🟢', isCorrect: false }
    ]
  },
  {
    id: 'qb-pair-2',
    type: 'pair_matching',
    ageGroup: '3-4',
    title: 'مطابقة الحيوان بظله الأسود',
    prompt: 'أي ظل يطابق شكل الفيل 🐘 بالضبط؟',
    correctAnswer: 'ظل الفيل بخرطومه الطويل',
    explanation: 'الإدراك البصري للشكل والظل',
    options: [
      { id: 'sh-1', label: 'ظل الفيل 🐘', visual: '🐘 (ظل)', isCorrect: true },
      { id: 'sh-2', label: 'ظل الزرافة 🦒', visual: '🦒 (ظل)', isCorrect: false },
      { id: 'sh-3', label: 'ظل القرد 🐵', visual: '🐵 (ظل)', isCorrect: false }
    ]
  },

  // Odd One Out
  {
    id: 'qb-odd-1',
    type: 'odd_one_out',
    ageGroup: '3-4',
    title: 'اكتشاف الكائن غير الطائر',
    prompt: 'أي حيوان من هؤلاء لا يمتلك أجنحة ولا يطير في السماء؟',
    correctAnswer: 'السلحفاة الزاحفة',
    explanation: 'تصنيف الطيور والزواحف',
    options: [
      { id: 'od-1', label: 'عصفور 🐦', visual: '🐦', isCorrect: false },
      { id: 'od-2', label: 'فراشة 🦋', visual: '🦋', isCorrect: false },
      { id: 'od-3', label: 'سلحفاة 🐢', visual: '🐢', isCorrect: true }
    ]
  },
  {
    id: 'qb-odd-2',
    type: 'odd_one_out',
    ageGroup: '4-5',
    title: 'اكتشاف الأداة غير المدرسية',
    prompt: 'أي شيء لا نضعه في الحقيبة المدرسية للأدوات؟',
    correctAnswer: 'المقلاة المطبخية 🍳',
    explanation: 'التمييز بين أدوات الدراسة والمطبخ',
    options: [
      { id: 'od-4', label: 'قلم رصاص ✏️', visual: '✏️', isCorrect: false },
      { id: 'od-5', label: 'دفتر رسم 📒', visual: '📒', isCorrect: false },
      { id: 'od-6', label: 'مقلاة مطبخ 🍳', visual: '🍳', isCorrect: true },
      { id: 'od-7', label: 'ممحاة ملونة 🧼', visual: '🧼', isCorrect: false }
    ]
  },

  // Illustrated Multiple Choice
  {
    id: 'qb-mc-1',
    type: 'multiple_choice',
    ageGroup: '2-3',
    title: 'الصوت اليومي',
    prompt: 'من الذي يقول "كوكو كوكو" في الصباح الباكر؟ 🌅',
    correctAnswer: 'الديك النشيط 🐓',
    explanation: 'الربط الصوتي والبيئي',
    options: [
      { id: 'mc-a', label: 'الديك 🐓', visual: '🐓', isCorrect: true },
      { id: 'mc-b', label: 'السمكة 🐟', visual: '🐟', isCorrect: false },
      { id: 'mc-c', label: 'الخروف 🐑', visual: '🐑', isCorrect: false }
    ]
  },
  {
    id: 'qb-mc-2',
    type: 'multiple_choice',
    ageGroup: '4-5',
    title: 'الحواس الخمس',
    prompt: 'بأي حاسة نشم رائحة الوردة العطرة والخبز الساخن؟',
    correctAnswer: 'الأنف بحاسة الشم 👃',
    explanation: 'التعرف على أعضاء الحواس',
    options: [
      { id: 'mc-d', label: 'الأنف 👃', visual: '👃', isCorrect: true },
      { id: 'mc-e', label: 'الأذن 👂', visual: '👂', isCorrect: false },
      { id: 'mc-f', label: 'العين 👁️', visual: '👁️', isCorrect: false }
    ]
  },
  {
    id: 'qb-mc-3',
    type: 'multiple_choice',
    ageGroup: '5-6',
    title: 'الطقس وفصول السنة',
    prompt: 'في أي فصل من فصول السنة تتساقط أوراق الأشجار الصفراء؟',
    correctAnswer: 'فصل الخريف 🍂',
    explanation: 'فهم فصول السنة الأربعة',
    options: [
      { id: 'mc-g', label: 'الخريف 🍂', visual: '🍂', isCorrect: true },
      { id: 'mc-h', label: 'الربيع 🌸', visual: '🌸', isCorrect: false },
      { id: 'mc-i', label: 'الصيف ☀️', visual: '☀️', isCorrect: false }
    ]
  },

  // Counting
  {
    id: 'qb-cnt-1',
    type: 'counting',
    ageGroup: '3-4',
    title: 'عد الأسماك في الحوض',
    prompt: 'كم سمكة تسبح في الحوض؟ 🐠 🐠 🐠',
    countTarget: 3,
    correctAnswer: '٣ (ثلاثة)',
    explanation: 'عد حتى الرقم ٣',
    options: [
      { id: 'cnt-a', label: '٢', visual: '🐠🐠', isCorrect: false },
      { id: 'cnt-b', label: '٣ (ثلاثة)', visual: '🐠🐠🐠', isCorrect: true }
    ]
  },
  {
    id: 'qb-cnt-2',
    type: 'counting',
    ageGroup: '5-6',
    title: 'الطرح البسيط بالصور',
    prompt: 'كان على الغصن ٥ عصافير 🐦🐦🐦🐦🐦، طار منها اثنان 🕊️🕊️. كم عصفوراً بقي؟ (٥ - ٢ = ؟)',
    countTarget: 3,
    correctAnswer: '٣ عصافير (٥ - ٢ = ٣)',
    explanation: 'عملية الطرح الحسي',
    options: [
      { id: 'cnt-c', label: '٢', visual: '🐦🐦', isCorrect: false },
      { id: 'cnt-d', label: '٣ عصافير', visual: '🐦🐦🐦', isCorrect: true },
      { id: 'cnt-e', label: '٤', visual: '🐦🐦🐦🐦', isCorrect: false }
    ]
  },

  // Sequencing
  {
    id: 'qb-seq-1',
    type: 'sequencing',
    ageGroup: '4-5',
    title: 'ترتيب خطوات غسل اليدين بالماء والصابون',
    prompt: 'رتّب خطوات غسل اليدين الصحيحة للوقاية من الجراثيم',
    correctAnswer: '١: وضع الصابون، ٢: فرك اليدين، ٣: التجفيف بالمنشفة',
    explanation: 'ترتيب الخطوات الصحية والنظافة الشخصية',
    sequence: [
      { id: 'sq-a', label: 'وضع الصابون والماء', visual: '🧼💧', order: 1 },
      { id: 'sq-b', label: 'فرك الأصابع واليدين جيداً', visual: '🤲', order: 2 },
      { id: 'sq-c', label: 'التجفيف بمنشفة نظيفة', visual: '🧖', order: 3 }
    ]
  }
];
