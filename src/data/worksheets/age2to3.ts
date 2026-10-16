import { Worksheet } from '../../types/worksheet';

export const worksheetsAge2to3: Worksheet[] = [
  {
    id: 'ws-2-01',
    title: 'مطابقة الأم بصغيرها في المزرعة',
    slug: 'farm-mothers-and-babies',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'matching',
    activityTypeLabel: 'التوصيل',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'مبتدئ',
    objective: 'التعرف على الحيوانات الأليفة وصغارها، وتنمية التآزر البصري الحركي عبر التوصيل البسيط.',
    skillsMeasured: ['التمييز البصري', 'معرفة الكائنات الحية', 'التآزر البصري الحركي'],
    answerMethod: 'رسم خط عريض أو الإشارة بالإصبع بمساعدة الوالدين',
    parentInstructions: 'اسأل طفلك بصوت مشجع: أين القطة الكبيرة؟ وأين قطتها الصغيرة؟ دعه يشير بإصبعه أولاً ثم ارسما خطاً معاً.',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل بين الحيوان الكبير وصغيره الجميل',
        matchPairs: [
          { leftId: 'cat_mom', leftLabel: 'قطة كبيرة', leftVisual: '🐱', rightId: 'cat_baby', rightLabel: 'هريرة صغيرة', rightVisual: '🐾' },
          { leftId: 'cow_mom', leftLabel: 'بقرة حنونة', leftVisual: '🐮', rightId: 'cow_baby', rightLabel: 'عجل صغير', rightVisual: '🥛' },
          { leftId: 'hen_mom', leftLabel: 'دجاجة', leftVisual: '🐔', rightId: 'hen_baby', rightLabel: 'كتكوت أصفر', rightVisual: '🐥' }
        ],
        explanationOrHint: 'القطة تبحث عن صغيرها، والكتكوت ينادي على الدجاجة!'
      }
    ]
  },
  {
    id: 'ws-2-02',
    title: 'أين يعيش كل حيوان؟ (مأوى الحيوانات)',
    slug: 'animal-homes-toddler',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'matching',
    activityTypeLabel: 'التوصيل',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'مبتدئ',
    objective: 'ربط الحيوان بموطنه البسيط والمألوف للطفل.',
    skillsMeasured: ['الربط المنطقي الأولي', 'المفردات البيئية', 'التركيز البصري'],
    answerMethod: 'الإشارة أو رسم خط مباشر',
    parentInstructions: 'شجّع طفلك على تقليد صوت العصفور وصوت السمكة، ثم ساعده في إيصال كل صديق لبيته.',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'ساعِد الحيوانات على العودة إلى بيوتها الدافئة',
        matchPairs: [
          { leftId: 'bird', leftLabel: 'عصفور يطير', leftVisual: '🐦', rightId: 'nest', rightLabel: 'عش على الشجرة', rightVisual: '🪹' },
          { leftId: 'fish', leftLabel: 'سمكة سريعة', leftVisual: '🐟', rightId: 'sea', rightLabel: 'حوض الماء', rightVisual: '🌊' },
          { leftId: 'bee', leftLabel: 'نحلة نشيطة', leftVisual: '🐝', rightId: 'hive', rightLabel: 'خلية عسل', rightVisual: '🍯' }
        ]
      }
    ]
  },
  {
    id: 'ws-2-03',
    title: 'طعام الحيوانات اللذيذ',
    slug: 'animal-favorite-foods',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'matching',
    activityTypeLabel: 'التوصيل',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'مبتدئ',
    objective: 'التعرف على الأطعمة المفضلة للأرنب والكلب والقرود.',
    skillsMeasured: ['الملاحظة البصرية', 'الإدراك البيئي', 'التنسيق الحركي'],
    answerMethod: 'إشارة شفهية أو خط عريض',
    parentInstructions: 'ماذا يأكل الأرنب الأبيض ذو الأذنين الطويلتين؟ نعم.. جزرة مقرمشة!',
    isAssessment: false,
    themeColor: 'orange',
    questions: [
      {
        id: 'q1',
        prompt: 'اختر الطعام المناسب لكل حيوان جائع',
        matchPairs: [
          { leftId: 'rabbit', leftLabel: 'أرنب يقفز', leftVisual: '🐰', rightId: 'carrot', rightLabel: 'جزرة برتقالية', rightVisual: '🥕' },
          { leftId: 'monkey', leftLabel: 'قرد مرح', leftVisual: '🐵', rightId: 'banana', rightLabel: 'موزة صفراء', rightVisual: '🍌' },
          { leftId: 'mouse', leftLabel: 'فأر صغير', leftVisual: '🐭', rightId: 'cheese', rightLabel: 'قطعة جبن', rightVisual: '🧀' }
        ]
      }
    ]
  },
  {
    id: 'ws-2-04',
    title: 'تطابق ظلال الألعاب المفضلة',
    slug: 'toy-shadow-matching',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'pair_matching',
    activityTypeLabel: 'المطابقة',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'مبتدئ',
    objective: 'مطابقة صورة اللعبة الملونة بظلها الأسود لتعزيز التمييز الإدراكي للهيئة العامة.',
    skillsMeasured: ['تمييز الصور والظلال', 'إدراك المحيط والشكل الخارجي'],
    answerMethod: 'وضع دائرة أو إشارة على الظل المطابق',
    parentInstructions: 'انظر إلى شكل الكرة المدوّر.. أين نجد ظلها الدائري في الأسفل؟',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل كل لعبة ملونة بظلها الصحيح',
        matchPairs: [
          { leftId: 'ball', leftLabel: 'كرة قدم', leftVisual: '⚽', rightId: 'ball_shadow', rightLabel: 'ظل الكرة', rightVisual: '⚫' },
          { leftId: 'teddy', leftLabel: 'دبدوب لطيف', leftVisual: '🧸', rightId: 'teddy_shadow', rightLabel: 'ظل الدبدوب', rightVisual: '🐻‍❄️' },
          { leftId: 'car', leftLabel: 'سيارة صغيرة', leftVisual: '🚗', rightId: 'car_shadow', rightLabel: 'ظل السيارة', rightVisual: '⬛' }
        ]
      }
    ]
  },
  {
    id: 'ws-2-05',
    title: 'التوأمان المتشابهان: ابحث عن الصديق المطابق',
    slug: 'identical-twins-shapes',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'pair_matching',
    activityTypeLabel: 'المطابقة',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'مبتدئ',
    objective: 'تحديد صورتين متطابقتين تماماً بين 3 خيارات.',
    skillsMeasured: ['المطابقة 1:1', 'الانتباه للتفاصيل الدقيقة', 'التمييز البصري'],
    answerMethod: 'النقر على الصورة المطابقة أو وضع إشارة عليها',
    parentInstructions: 'نريد أن نجد القبعة التي تشبه هذه القبعة بالضبط!',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'أي صورة تشبه هذه النجمة تماماً؟',
        visual: '⭐',
        options: [
          { id: 'opt1', label: 'نجمة ذهبية', visual: '⭐', isCorrect: true },
          { id: 'opt2', label: 'قمر هلال', visual: '🌙', isCorrect: false },
          { id: 'opt3', label: 'سحابة زرقاء', visual: '☁️', isCorrect: false }
        ],
        correctAnswer: 'opt1'
      }
    ]
  },
  {
    id: 'ws-2-06',
    title: 'ألواني الأولى: الأحمر والأصفر',
    slug: 'primary-colors-red-yellow',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'pair_matching',
    activityTypeLabel: 'المطابقة',
    layoutType: 'group_clusters',
    layoutLabel: 'صور موزعة في مجموعات',
    difficulty: 'مبتدئ',
    objective: 'التمييز البصري الحاسم بين اللونين الأساسيين: الأحمر والأصفر.',
    skillsMeasured: ['معرفة الألوان', 'التصنيف اللوني المبدئي'],
    answerMethod: 'الإشارة إلى العنصر الأحمر ثم الأصفر',
    parentInstructions: 'اجعل الطفل يمسك قلم تلوين أحمر ويشير إلى الفراولة، ثم يمسك الأصفر ويشير إلى الموزة.',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'اختر الفاكهة ذات اللون الأحمر اللامع',
        options: [
          { id: 'c1', label: 'فراولة حمراء', visual: '🍓', isCorrect: true },
          { id: 'c2', label: 'موزة صفراء', visual: '🍌', isCorrect: false }
        ],
        correctAnswer: 'c1'
      },
      {
        id: 'q2',
        prompt: 'اختر الشيء الذي يضيء باللون الأصفر',
        options: [
          { id: 'c3', label: 'شمس صفراء', visual: '☀️', isCorrect: true },
          { id: 'c4', label: 'تفاحة حمراء', visual: '🍎', isCorrect: false }
        ],
        correctAnswer: 'c3'
      }
    ]
  },
  {
    id: 'ws-2-07',
    title: 'سلة الفواكه وسلة الخضار',
    slug: 'fruits-and-veggies-baskets',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'categorization',
    activityTypeLabel: 'التصنيف',
    layoutType: 'classification_table',
    layoutLabel: 'جدول تصنيف',
    difficulty: 'مبتدئ',
    objective: 'تصنيف الأطعمة اليومية إلى فواكه حلوة وخضروات طازجة.',
    skillsMeasured: ['التصنيف الثنائي', 'المفردات الغذائية اليومية'],
    answerMethod: 'وضع دائرة على الفواكه والإشارة إلى الخضار',
    parentInstructions: 'أين نضع التفاحة اللذيذة؟ في سلة الفواكه! وأين نضع الجزر؟ في سلة الخضار.',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'حدد الأطعمة التي تنتمي إلى سلة الفواكه',
        options: [
          { id: 'apple', label: 'تفاح', visual: '🍎', isCorrect: true },
          { id: 'carrot', label: 'جزر', visual: '🥕', isCorrect: false },
          { id: 'grapes', label: 'عنب', visual: '🍇', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'ws-2-08',
    title: 'فرز أصدقاء الحيوانات عن ألعاب الصندوق',
    slug: 'animals-vs-toys-sorting',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'categorization',
    activityTypeLabel: 'التصنيف',
    layoutType: 'group_clusters',
    layoutLabel: 'صور موزعة في مجموعات',
    difficulty: 'مبتدئ',
    objective: 'التمييز بين الكائنات الحية (الحيوانات) والجمادات (الألعاب المصنوعة).',
    skillsMeasured: ['التمييز بين الكائن الحي والجماد', 'الملاحظة الإدراكية'],
    answerMethod: 'الإشارة إلى كل حيوان حي يتنفس ويتحرك',
    parentInstructions: 'هل الدبدوب الحقيقي يركض مثل الكلب الصغير؟ دعنا نكتشف الحيوانات الحقيقية!',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'أي من هؤلاء حيوان حقيقي يمشي وله صوت؟',
        options: [
          { id: 'puppy', label: 'جرو صغير', visual: '🐶', isCorrect: true },
          { id: 'toy_car', label: 'سيارة لعبة', visual: '🚗', isCorrect: false },
          { id: 'duck', label: 'بطة تسبح', visual: '🦆', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'ws-2-09',
    title: 'ملابس الصيف وملابس الشتاء الدافئة',
    slug: 'summer-vs-winter-clothes',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'categorization',
    activityTypeLabel: 'التصنيف',
    layoutType: 'classification_table',
    layoutLabel: 'جدول تصنيف',
    difficulty: 'مبتدئ',
    objective: 'التعرف على ملابس البرد الدافئة وملابس الحر الخفيفة.',
    skillsMeasured: ['الوعي الذاتي والبيئي', 'مهارات الحياة اليومية'],
    answerMethod: 'الإشارة إلى ما نرتديه عندما يكون الجو بارداً وممطراً',
    parentInstructions: 'عندما تمطر السماء ونشعر بالبرد.. ماذا نرتدي لحماية أجسادنا؟',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'اختر الملابس الدافئة لفصل الشتاء',
        options: [
          { id: 'coat', label: 'معطف ثقيل', visual: '🧥', isCorrect: true },
          { id: 'scarf', label: 'وشاح دافئ', visual: '🧣', isCorrect: true },
          { id: 'swimwear', label: 'لباس بحر خفيف', visual: '🩳', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'ws-2-10',
    title: 'من لا ينتمي إلى الحديقة؟ (اكتشف المختلف)',
    slug: 'odd-one-out-garden',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'odd_one_out',
    activityTypeLabel: 'اكتشف المختلف',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'مبتدئ',
    objective: 'اكتشاف العنصر الغريب بين 3 عناصر تنتمي لفئة واحدة.',
    skillsMeasured: ['التمييز الإدراكي', 'اكتشاف الاستثناء'],
    answerMethod: 'وضع دائرة على العنصر الدخيل',
    parentInstructions: 'لدينا زهرة جميلة، وشجرة خضراء.. وسيارة تصدر صوتاً! من لا ينمو في الحديقة؟',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'ضع دائرة حول العنصر المختلف الذي لا ينتمي للنباتات:',
        options: [
          { id: 'flower', label: 'وردة', visual: '🌸', isCorrect: false },
          { id: 'tree', label: 'شجرة', visual: '🌳', isCorrect: false },
          { id: 'bus', label: 'حافلة', visual: '🚌', isCorrect: true }
        ],
        correctAnswer: 'bus',
        explanationOrHint: 'الحافلة وسيلة نقل وليست نباتاً ينمو في التربة!'
      }
    ]
  },
  {
    id: 'ws-2-11',
    title: 'أي بطة ذات لون مختلف؟',
    slug: 'different-duckling-color',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'odd_one_out',
    activityTypeLabel: 'اكتشف المختلف',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'مبتدئ',
    objective: 'ملاحظة الاختلاف اللوني المباشر في صف من العناصر المتشابهة.',
    skillsMeasured: ['الملاحظة البصرية', 'تمييز الألوان المتباينة'],
    answerMethod: 'النقر أو الإشارة إلى البطة المتميزة',
    parentInstructions: 'جميع الكتاكيت هنا صفراء مشرقة.. باستثناء كتكوت واحد! أين هو؟',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'ابحث عن الطائر المختلف في اللون:',
        options: [
          { id: 'chick1', label: 'كتكوت أصفر', visual: '🐥', isCorrect: false },
          { id: 'chick2', label: 'كتكوت أصفر', visual: '🐥', isCorrect: false },
          { id: 'parrot', label: 'ببغاء ملون', visual: '🦜', isCorrect: true },
          { id: 'chick3', label: 'كتكوت أصفر', visual: '🐥', isCorrect: false }
        ],
        correctAnswer: 'parrot'
      }
    ]
  },
  {
    id: 'ws-2-12',
    title: 'أكمل نمط الخرز الملون (أحمر - أزرق)',
    slug: 'simple-bead-pattern-red-blue',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'complete_pattern',
    activityTypeLabel: 'أكمل النمط',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'مبتدئ',
    objective: 'التعرف على التكرار النمطي البسيط (أ - ب - أ - ب).',
    skillsMeasured: ['التفكير النمطي الأولي', 'التنبؤ البصري'],
    answerMethod: 'اختيار اللون التالي في الصف',
    parentInstructions: 'قل للطفل بإيقاع صوتي ممتع: دائرة حمراء، دائرة زرقاء.. حمراء، زرقاء.. ما التالي الآن؟',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'ما الدائرة التي تأتي تالياً في خيط الخرز؟',
        options: [
          { id: 'red', label: 'دائرة حمراء', visual: '🔴', isCorrect: true },
          { id: 'blue', label: 'دائرة زرقاء', visual: '🔵', isCorrect: false }
        ],
        correctAnswer: 'red',
        explanationOrHint: '🔴 🔵 🔴 🔵 🔴'
      }
    ]
  },
  {
    id: 'ws-2-13',
    title: 'نجمة وقمر في السماء: ما التالي؟',
    slug: 'star-moon-pattern',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'complete_pattern',
    activityTypeLabel: 'أكمل النمط',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'مبتدئ',
    objective: 'استيعاب النمط البصري الثنائي وتطبيقه على أشكال السماء.',
    skillsMeasured: ['الربط البصري المتسلسل', 'الذاكرة العاملة اللحظية'],
    answerMethod: 'الإشارة إلى النجمة أو القمر لإكمال الصف',
    parentInstructions: 'نجمة.. قمر.. نجمة.. قمر.. دور من الآن؟',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: '⭐ 🌙 ⭐ 🌙 ... ماذا نضع في المربع الفارغ؟',
        options: [
          { id: 'star', label: 'نجمة ذهبية', visual: '⭐', isCorrect: true },
          { id: 'cloud', label: 'سحابة', visual: '☁️', isCorrect: false }
        ],
        correctAnswer: 'star'
      }
    ]
  },
  {
    id: 'ws-2-14',
    title: 'واحد واثنان فقط! عد الأصابع والدمى',
    slug: 'counting-one-and-two-toddler',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'counting_quantities',
    activityTypeLabel: 'العد والكميات',
    layoutType: 'number_grid',
    layoutLabel: 'شبكة أرقام وكميات',
    difficulty: 'مبتدئ',
    objective: 'الربط الحسي والعددي بين كمية عنصر واحد (١) وعنصرين (٢).',
    skillsMeasured: ['الوعي الكمي الأولي', 'العد بالأصابع', 'التعرف على الرقمين 1 و 2'],
    answerMethod: 'العد بصوت مسموع مع الإشارة بالإصبع',
    parentInstructions: 'اجعل الطفل يرفع إصبعاً واحداً، ثم إصبعين، ونعد الدمى معاً!',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'كم تفاحة شهية تراها في الصورة؟ 🍎',
        visual: '🍎',
        options: [
          { id: 'one', label: '١ (واحدة)', visual: '1️⃣', isCorrect: true },
          { id: 'two', label: '٢ (اثنتان)', visual: '2️⃣', isCorrect: false }
        ],
        correctAnswer: 'one'
      },
      {
        id: 'q2',
        prompt: 'كم فراشة تطير هنا؟ 🦋 🦋',
        visual: '🦋 🦋',
        options: [
          { id: 'one', label: '١', visual: '1️⃣', isCorrect: false },
          { id: 'two', label: '٢ (اثنتان)', visual: '2️⃣', isCorrect: true }
        ],
        correctAnswer: 'two'
      }
    ]
  },
  {
    id: 'ws-2-15',
    title: 'كم عصفوراً يقف على الغصن؟ (١ - ٢ - ٣)',
    slug: 'birds-on-branch-counting',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'counting_quantities',
    activityTypeLabel: 'العد والكميات',
    layoutType: 'number_grid',
    layoutLabel: 'شبكة أرقام وكميات',
    difficulty: 'مبتدئ',
    objective: 'توسيع العد حتى 3 عصافير بربط الصورة بالعدد المنطوق.',
    skillsMeasured: ['العد الشفهي 1-3', 'مطابقة العدد بالمعدود'],
    answerMethod: 'الإشارة إلى الرقم الصحيح',
    parentInstructions: 'المس كل عصفور بإصبع طفلك وقلا معاً: واحد.. اثنان.. ثلاثة!',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'عد العصافير المغردة: 🐦 🐦 🐦',
        visual: '🐦 🐦 🐦',
        options: [
          { id: 'n2', label: 'اثنان (٢)', visual: '2️⃣', isCorrect: false },
          { id: 'n3', label: 'ثلاثة (٣)', visual: '3️⃣', isCorrect: true }
        ],
        correctAnswer: 'n3'
      }
    ]
  },
  {
    id: 'ws-2-16',
    title: 'بستان الحروف: صوت الأرنب بحرف الألف (أ)',
    slug: 'arabic-letter-alif-toddler',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'arabic_letters',
    activityTypeLabel: 'الحروف العربية',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'مبتدئ',
    objective: 'التعرف الصوتي والبصري الأولي على حرف الألف وشكله كعصا مستقيمة.',
    skillsMeasured: ['الوعي الفونيمي الأولي', 'التعرف على شكل حرف الألف'],
    answerMethod: 'تمرير الإصبع على الحرف الكبير ونطق (أ)',
    parentInstructions: 'مرر إصبع طفلك من أعلى إلى أسفل على حرف (أ) وقل له: أ.. أرنب يقفز!',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'أ.. أَرْنَب! مرر إصبعك من الأعلى إلى الأسفل على حرف الألف الكبير',
        visual: 'أ',
        tracingPaths: [
          { label: 'عصا الألف من أعلى لأسفل', shape: 'straight', content: 'أ' }
        ]
      }
    ]
  },
  {
    id: 'ws-2-17',
    title: 'حرف الباء (ب) والبطة التي تسبح',
    slug: 'arabic-letter-baa-toddler',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'arabic_letters',
    activityTypeLabel: 'الحروف العربية',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'مبتدئ',
    objective: 'التعرف على حرف الباء كصحن تحته نقطة مائية وبطة.',
    skillsMeasured: ['التمييز الشكلي للحرف', 'الربط بين الحرف والصوت'],
    answerMethod: 'الإشارة إلى النقطة أسفل حرف الباء',
    parentInstructions: 'أين النقطة الصغيرة التي تختبئ تحت صحن الباء؟ دع طفلك ينقر عليها!',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'ب.. بَطَّة! انظر إلى صحن الباء والنقطة تحته',
        visual: 'ب 🦆'
      }
    ]
  },
  {
    id: 'ws-2-18',
    title: 'Letter A for Apple (تفاحة حمراء)',
    slug: 'letter-a-for-apple-toddler',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'english_letters',
    activityTypeLabel: 'الحروف الإنجليزية',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'مبتدئ',
    objective: 'التعرف السمعي والبصري على الحرف الإنجليزي A مع كلمة Apple.',
    skillsMeasured: ['التعرف على الحرف الكبير A', 'المفردات الثنائية'],
    answerMethod: 'الإشارة إلى التفاحة والحرف A',
    parentInstructions: 'Say with your child: A is for Apple! Ah-Ah-Apple!',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'Look at big letter A and the yummy red apple 🍎',
        visual: 'A 🍎'
      }
    ]
  },
  {
    id: 'ws-2-19',
    title: 'Letter B for Ball (كرة تدور)',
    slug: 'letter-b-for-ball-toddler',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'english_letters',
    activityTypeLabel: 'الحروف الإنجليزية',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'مبتدئ',
    objective: 'التعرف على الحرف الإنجليزي B وربطه بكرة اللعب Ball.',
    skillsMeasured: ['التمييز البصري للحرف B', 'الربط الصوتي'],
    answerMethod: 'النقر على الكرة المدورة',
    parentInstructions: 'Bounce the ball and say: B is for Ball! Buh-Buh-Ball!',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'Point to the bouncing ball with letter B ⚽',
        visual: 'B ⚽'
      }
    ]
  },
  {
    id: 'ws-2-20',
    title: 'متاهة الأرنب العريض إلى الجزرة',
    slug: 'wide-maze-rabbit-carrot',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'mazes',
    activityTypeLabel: 'المتاهات',
    layoutType: 'maze_path',
    layoutLabel: 'مسار متاهة',
    difficulty: 'مبتدئ',
    objective: 'تتبع مسار عريض ومفتوح دون تفرعات معقدة لمساعدة الأرنب.',
    skillsMeasured: ['التوجيه المكاني', 'التحكم الحركي الدقيق البسيط'],
    answerMethod: 'تتبع المسار بالإصبع أو قلم الشمع',
    parentInstructions: 'ارسم مع طفلك خطاً وسط الطريق العريض دون لمس الجدران.',
    isAssessment: false,
    themeColor: 'orange',
    questions: [
      {
        id: 'q1',
        prompt: 'ممر واسع: خذ الأرنب 🐰 مباشرة إلى الجزرة الشهية 🥕!',
        visual: '🐰 ───🛤️─── 🥕'
      }
    ]
  },
  {
    id: 'ws-2-21',
    title: 'طريق النحلة الزنانة إلى الزهرة',
    slug: 'wide-maze-bee-to-flower',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'mazes',
    activityTypeLabel: 'المتاهات',
    layoutType: 'maze_path',
    layoutLabel: 'مسار متاهة',
    difficulty: 'مبتدئ',
    objective: 'تتبع مسار مموج عريض يساعد في تقوية مرونة معصم اليد.',
    skillsMeasured: ['حركة المعصم الانسيابية', 'التركيز المستمر لمسافة قصيرة'],
    answerMethod: 'رسم خط متموج يقلد طيران النحلة',
    parentInstructions: 'قل "ززززز" بصوت النحلة واجعل الطفل يقودها حتى تحط على بتلات الزهرة.',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'طر مع النحلة 🐝 في الخط المموج حتى تصل إلى الزهرة 🌸',
        visual: '🐝 ~~~~~~ 🌸'
      }
    ]
  },
  {
    id: 'ws-2-22',
    title: 'تلوين موجه: الشمس الذهبية المشرقة',
    slug: 'color-the-bright-sun',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'directed_coloring',
    activityTypeLabel: 'التلوين الموجه',
    layoutType: 'coloring_canvas',
    layoutLabel: 'ورقة تلوين',
    difficulty: 'مبتدئ',
    objective: 'تلوين مساحة دائرية كبيرة باللون الأصفر لتدريب مسكة القلم الأولى.',
    skillsMeasured: ['التلوين داخل حدود مرنة', 'تمييز اللون الأصفر'],
    answerMethod: 'تلوين قرص الشمس بالأصفر',
    parentInstructions: 'أعطِ طفلك قلم شمع أصفر سميكاً ودعه يملأ بطن الشمس بالدفء!',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'لوّن قرص الشمس الكبير باللون الأصفر المبهج ☀️',
        visual: '☀️'
      }
    ]
  },
  {
    id: 'ws-2-23',
    title: 'تلوين موجه: تفاحتي الحمراء المقرمشة',
    slug: 'color-red-apple-toddler',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'directed_coloring',
    activityTypeLabel: 'التلوين الموجه',
    layoutType: 'coloring_canvas',
    layoutLabel: 'ورقة تلوين',
    difficulty: 'مبتدئ',
    objective: 'تلوين التفاحة بالأحمر والورقة الخضراء الصغيرة.',
    skillsMeasured: ['التنسيق الحركي اليدوي', 'التمييز بين مساحة كبيرة ومساحة صغيرة'],
    answerMethod: 'تلوين بالأحمر والأخضر',
    parentInstructions: 'الأحمر للفاكهة، والأخضر للورقة العلوية.',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'التفاحة الشهية تنتظر لونها الأحمر اللامع! 🍎',
        visual: '🍎'
      }
    ]
  },
  {
    id: 'ws-2-24',
    title: 'تتبع خطوط المطر الهابط من الغيوم',
    slug: 'rain-lines-downward-tracing',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'line_tracing',
    activityTypeLabel: 'تتبع الخطوط',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'مبتدئ',
    objective: 'رسم خطوط مستقيمة عمودية من الأعلى إلى الأسفل لمحاكاة المطر.',
    skillsMeasured: ['التوجيه الحركي من أعلى لأسفل', 'التحكم المبدئي بالقلم'],
    answerMethod: 'وصل النقاط الرأسية',
    parentInstructions: 'تسقط قطرات المطر: تك تك تك من السحابة إلى الأرض.. انزل بالقلم لأسفل!',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'تتبع خط المطر المنقط من السحابة ☁️ إلى الزهرة 🌷',
        tracingPaths: [
          { label: 'خط هابط رأسي', shape: 'straight' }
        ]
      }
    ]
  },
  {
    id: 'ws-2-25',
    title: 'تتبع أمواج البحر الواسعة',
    slug: 'ocean-waves-tracing-toddler',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'line_tracing',
    activityTypeLabel: 'تتبع الخطوط',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'مبتدئ',
    objective: 'تحريك اليد في منحنيات أفقية ناعمة تحاكي موج البحر.',
    skillsMeasured: ['مرونة حركة اليد الأفقية', 'الانسيابية الحركية'],
    answerMethod: 'تتبع المنحنى بالإصبع أو القلم',
    parentInstructions: 'الموج يصعد ويهبط بلطف.. دع طفلك يقلد حركة القارب فوق الماء.',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'ساعِد القارب ⛵ على الإبحار فوق الأمواج المنقطة 🌊',
        tracingPaths: [
          { label: 'موجة بحرية عريضة', shape: 'curve' }
        ]
      }
    ]
  },
  {
    id: 'ws-2-26',
    title: 'أين أذنا الأرنب؟ (إكمال الجزء الناقص)',
    slug: 'rabbit-missing-ears-puzzle',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'visual_puzzles',
    activityTypeLabel: 'الألغاز البصرية',
    layoutType: 'visual_puzzle',
    layoutLabel: 'أحجية بصرية',
    difficulty: 'مبتدئ',
    objective: 'ملاحظة غياب جزء أساسي في صورة الحيوان واختيار الجزء المكمل.',
    skillsMeasured: ['الإغلاق البصري', 'إدراك أجزاء الجسم للحيوانات'],
    answerMethod: 'اختيار الأذنين من بين الخيارات المعروضة',
    parentInstructions: 'انظر للأرنب.. رأسه جميل ولكن شيئاً ما ينقصه ليسمع به الأصوات! ما هو؟',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'ما الجزء الناقص في وجه الأرنب الصغير؟',
        options: [
          { id: 'ears', label: 'أذنان طويلتان', visual: '🐰', isCorrect: true },
          { id: 'tail', label: 'جناح طائر', visual: '🪶', isCorrect: false }
        ],
        correctAnswer: 'ears'
      }
    ]
  },
  {
    id: 'ws-2-27',
    title: 'مشاعري الأولى: وجه سعيد ووجه حزين',
    slug: 'emotions-happy-vs-sad-toddler',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'emotions',
    activityTypeLabel: 'المشاعر',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'مبتدئ',
    objective: 'تمييز تعبير الفرح والابتسام عن تعبير الحزن لدى الأطفال.',
    skillsMeasured: ['الذكاء العاطفي المبكر', 'قراءة تعابير الوجه'],
    answerMethod: 'الإشارة إلى الوجه السعيد المبتسم',
    parentInstructions: 'أرِ طفلك ابتسامتك الجميلة! أين الطفل المبتسم الذي يلعب بسعادة؟',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'أشر إلى الوجه الذي يبتسم بسعادة وفرح:',
        options: [
          { id: 'happy', label: 'وجه مبتسم وسعيد', visual: '😊', isCorrect: true },
          { id: 'sad', label: 'وجه حزين يبكي', visual: '😢', isCorrect: false }
        ],
        correctAnswer: 'happy'
      }
    ]
  },
  {
    id: 'ws-2-28',
    title: 'روتيني اللطيف: أستيقظ وأغسل وجهي بالماء',
    slug: 'morning-routine-wash-face',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'life_skills',
    activityTypeLabel: 'المهارات الحياتية',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'مبتدئ',
    objective: 'غرس عادة النظافة الصباحية والانتعاش بغسل الوجه واليدين.',
    skillsMeasured: ['مهارات العناية بالذات', 'الترتيب الزمني البسيط للأحداث'],
    answerMethod: 'الإشارة إلى ما نفعله بعد الاستيقاظ مباشرة',
    parentInstructions: 'عندما نفتح عيوننا في الصباح.. نبتسم للشمس ثم نغسل وجوهنا بالماء النظيف والصابون!',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'ماذا نفعل بعد الاستيقاظ من النوم مباشرة لنكون نظيفين ومنتعشين؟',
        options: [
          { id: 'wash', label: 'نغسل الوجه بالماء والصابون', visual: '🧼', isCorrect: true },
          { id: 'mud', label: 'نلعب في الطين', visual: '🪨', isCorrect: false }
        ],
        correctAnswer: 'wash'
      }
    ]
  },
  {
    id: 'ws-2-29',
    title: 'قصة مصورة: الدبدوب الذي وجد جرّة العسل',
    slug: 'bear-and-honey-picture-story',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'picture_stories',
    activityTypeLabel: 'القصص المصورة',
    layoutType: 'comic_strip',
    layoutLabel: 'قصة مصورة متعددة المراحل',
    difficulty: 'مبتدئ',
    objective: 'الاستماع لقصة مصورة من 3 لقطات والإجابة عن سؤال بصري مباشر.',
    skillsMeasured: ['الاستماع الفعال', 'الفهم القرائي المصور', 'الربط السببي'],
    answerMethod: 'الإشارة إلى الصورة التي توضح ماذا أكل الدبدوب',
    parentInstructions: 'اقرأ القصة لطفلك: كان الدبدوب جائعاً.. شم رائحة لذيذة.. فوجد عسلاً حلواً وتشاركه مع أمه!',
    isAssessment: false,
    themeColor: 'orange',
    questions: [
      {
        id: 'q1',
        prompt: 'ماذا وجد الدبدوب في الغابة وأكله بسعادة؟',
        visual: '🐻 🍯 🌲',
        options: [
          { id: 'honey', label: 'جرّة عسل لذيذة', visual: '🍯', isCorrect: true },
          { id: 'shoe', label: 'حذاء قديم', visual: '👟', isCorrect: false }
        ],
        correctAnswer: 'honey'
      }
    ]
  },
  {
    id: 'ws-2-30',
    title: 'اختبار تشخيصي شامل: استكشاف مهارات الطفل (سنتين - 3 سنوات)',
    slug: 'toddler-developmental-assessment-age-2',
    ageGroup: '2-3',
    ageGroupLabel: 'من سنتين إلى أقل من 3 سنوات',
    activityType: 'comprehensive_assessment',
    activityTypeLabel: 'اختبارات شاملة',
    layoutType: 'assessment_suite',
    layoutLabel: 'اختبار مصور متعدد الأنشطة',
    difficulty: 'مبتدئ',
    objective: 'تقييم شامل لمهارات الإشارة، التمييز اللوني، التعرف على الحيوانات، والتحكم الحركي للطفل بعمر سنتين.',
    skillsMeasured: ['الاستجابة الشفهية', 'التمييز البصري الحركي', 'التصنيف البسيط', 'الانتباه المشترك'],
    answerMethod: 'ملاحظة ولي الأمر وتقييم النقاط عبر الملاحظة المباشرة',
    parentInstructions: 'هذا التقييم ممتع وخالٍ من أي توتر. اطرح الأسئلة بروح اللعب ولا تصحح للطفل بعصبية، بل دوّن استجاباته الفورية.',
    isAssessment: true,
    assessmentGuide: {
      totalScore: 4,
      evaluationCriteria: [
        'يستطيع الإشارة إلى الحيوان عند نطق اسمه',
        'يميز بين اللون الأحمر والأصفر',
        'يستطيع تتبع مسار عريض بإصبعه دون تشتت',
        'يبدي فهماً لقصة مصورة من خلال اختيار العنصر المألوف'
      ],
      answerKey: [
        'السؤال 1: الإشارة إلى القطة (🐱)',
        'السؤال 2: اختيار اللون الأحمر (🔴)',
        'السؤال 3: إيصال الأرنب للجزرة',
        'السؤال 4: اختيار العسل'
      ],
      teacherNotes: 'للأطفال في عمر السنتين، الإشارة والتفاعل اللفظي هما المعيار الحقيقي وليس الكتابة بالقلم.'
    },
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: '١. أين القطة التي تقول "مياو"؟ أشر إليها بإصبعك:',
        options: [
          { id: 'cat', label: 'قطة', visual: '🐱', isCorrect: true },
          { id: 'car', label: 'سيارة', visual: '🚗', isCorrect: false }
        ],
        correctAnswer: 'cat'
      },
      {
        id: 'q2',
        prompt: '٢. أي من هذين الشيئين لونه أحمر مثل الفراولة؟',
        options: [
          { id: 'red_ball', label: 'كرة حمراء', visual: '🔴', isCorrect: true },
          { id: 'blue_block', label: 'مكعب أزرق', visual: '🟦', isCorrect: false }
        ],
        correctAnswer: 'red_ball'
      },
      {
        id: 'q3',
        prompt: '٣. هل يستطيع طفلك تتبع هذا الخط بإصبعه بهدوء؟',
        visual: '🐰 ────── 🥕',
        options: [
          { id: 'yes', label: 'نعم، تتبعه بنجاح وبابتسامة', visual: '⭐', isCorrect: true },
          { id: 'help', label: 'احتاج إلى مساعدة وإمساك بيده', visual: '🤝', isCorrect: true }
        ]
      },
      {
        id: 'q4',
        prompt: '٤. أين الوجه المبتسم السعيد؟',
        options: [
          { id: 'happy', label: 'وجه سعيد', visual: '😊', isCorrect: true },
          { id: 'sad', label: 'وجه يبكي', visual: '😢', isCorrect: false }
        ],
        correctAnswer: 'happy'
      }
    ]
  }
];
