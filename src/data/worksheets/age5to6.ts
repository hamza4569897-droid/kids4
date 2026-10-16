import { Worksheet } from '../../types/worksheet';

export const worksheetsAge5to6: Worksheet[] = [
  {
    id: 'ws-5-01',
    title: 'أصوات الحروف والمدود القصيرة: الفتحة والضمة والكسرة (بَ - بُ - بِ)',
    slug: 'arabic-short-vowels-fatha-damma-kasra',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'arabic_letters',
    activityTypeLabel: 'الحروف العربية',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متقدم',
    objective: 'التمييز بين الحركات القصيرة الثلاث وربط حركة الحرف بالكلمة المنطوقة بدقة.',
    skillsMeasured: ['الوعي الصوتي والفونولوجي المتقدم', 'قراءة الحركات القصيرة'],
    answerMethod: 'توصيل الحرف المشكول بالصورة المطابقة لحركته',
    parentInstructions: 'انطق مع طفلك: بَـ.. بَطَّة (فتحة نفتح الفم بها)، بُـ.. بُرتقالة (ضمة نضم الشفتين)، بِـ.. بِطِّيخ (كسرة نبتسم بها)!',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل الحرف مع حركته بالصورة المناسبة لنطقه:',
        matchPairs: [
          { leftId: 'ba_fatha', leftLabel: 'بَ (فتحة)', leftVisual: 'بَ', rightId: 'duck', rightLabel: 'بَطَّة', rightVisual: '🦆' },
          { leftId: 'bu_damma', leftLabel: 'بُ (ضمة)', leftVisual: 'بُ', rightId: 'orange', rightLabel: 'بُرْتُقَال', rightVisual: '🍊' },
          { leftId: 'bi_kasra', leftLabel: 'بِ (كسرة)', leftVisual: 'بِ', rightId: 'watermelon', rightLabel: 'بِطِّيخ', rightVisual: '🍉' }
        ]
      }
    ]
  },
  {
    id: 'ws-5-02',
    title: 'تتبع وكتابة الكلمات الثلاثية البسيطة: (كَتَبَ - رَسَمَ - قَرَأَ)',
    slug: 'tracing-three-letter-arabic-words',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'arabic_letters',
    activityTypeLabel: 'الحروف العربية',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'متقدم',
    objective: 'ربط الحروف لتشكيل كلمة ثلاثية متصلة على السطر مع مراعاة تناسق الحروف.',
    skillsMeasured: ['التحكم الحركي الدقيق في الكتابة', 'اتصال الحروف على السطر'],
    answerMethod: 'تتبع الكلمات المنقطة بقلم الرصاص',
    parentInstructions: 'شجع طفلك على عدم رفع القلم إلا بعد إنهاء رسم الكلمة ثم وضع النقط والحركات.',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'تتبع بقلمك كلمة (قَلَم ✏️) وكلمة (كِتَاب 📖) على السطر بخط جميل',
        tracingPaths: [
          { label: 'كلمة قلم', shape: 'letter', content: 'قَلَم' },
          { label: 'كلمة كتاب', shape: 'letter', content: 'كِتَاب' }
        ]
      }
    ]
  },
  {
    id: 'ws-5-03',
    title: 'English Phonics: Rhyming CVC Words (-at family: Cat, Hat, Bat)',
    slug: 'english-cvc-rhyming-words-at-family',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'english_letters',
    activityTypeLabel: 'الحروف الإنجليزية',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متقدم',
    objective: 'Read and identify rhyming three-letter CVC words ending in -at.',
    skillsMeasured: ['Phonemic blending', 'Sight word reading', 'Rhyme recognition'],
    answerMethod: 'Circle words that rhyme with CAT',
    parentInstructions: 'Sound it out together: /k/ /æ/ /t/ = CAT! What rhymes with cat? Hat! Bat!',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: 'Which word rhymes with CAT 🐱 and ends with the -at sound?',
        options: [
          { id: 'hat', label: 'HAT 🎩', visual: '🎩', isCorrect: true },
          { id: 'dog', label: 'DOG 🐶', visual: '🐶', isCorrect: false },
          { id: 'bat', label: 'BAT 🦇', visual: '🦇', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'ws-5-04',
    title: 'مزرعة الجمع البسيط: كم حبة فاكهة في المجموع؟ (١ + ٣ = ٤)',
    slug: 'simple-addition-fruits-up-to-10',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'counting_quantities',
    activityTypeLabel: 'العد والكميات',
    layoutType: 'number_grid',
    layoutLabel: 'شبكة أرقام وكميات',
    difficulty: 'متقدم',
    objective: 'استيعاب مفهوم الجمع بضم مجموعتين مصورتين وعد الناتج الكلي حتى ١٠.',
    skillsMeasured: ['العمليات الحسابية الأولية (الجمع +)', 'تمثيل المعادلات بالصور'],
    answerMethod: 'عد المجموعتين معاً وكتابة أو اختيار الناتج',
    parentInstructions: 'لدينا تفاحتان اثنتان في الصحن، وأضفنا إليهما ثلاث تفاحات أخرى.. كم أصبح لدينا الآن؟ نعدها جميعاً: خمسة!',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'احسب ناتج الجمع: تفاحتان + ٣ تفاحات (🍎🍎 + 🍎🍎🍎) = ؟',
        options: [
          { id: 'four', label: '٤', visual: '4️⃣', isCorrect: false },
          { id: 'five', label: '٥ (خمس تفاحات)', visual: '5️⃣', isCorrect: true },
          { id: 'six', label: '٦', visual: '6️⃣', isCorrect: false }
        ],
        correctAnswer: 'five'
      },
      {
        id: 'q2',
        prompt: 'احسب ناتج الجمع: ٤ نجوم + ٢ نجمتان (⭐⭐⭐⭐ + ⭐⭐) = ؟',
        options: [
          { id: 'six', label: '٦ (ست نجوم)', visual: '6️⃣', isCorrect: true },
          { id: 'seven', label: '٧', visual: '7️⃣', isCorrect: false }
        ],
        correctAnswer: 'six'
      }
    ]
  },
  {
    id: 'ws-5-05',
    title: 'حديقة الطرح البسيط: كم بالوناً بقي بعد الفرقعة؟ (٥ - ٢ = ٣)',
    slug: 'simple-subtraction-balloons-visual',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'counting_quantities',
    activityTypeLabel: 'العد والكميات',
    layoutType: 'number_grid',
    layoutLabel: 'شبكة أرقام وكميات',
    difficulty: 'متقدم',
    objective: 'استيعاب مفهوم الطرح بحذف عناصر من المجموعة وعد المتبقي.',
    skillsMeasured: ['عملية الطرح الحسابية (-)', 'الاستدلال الحسابي العكسي'],
    answerMethod: 'شطب العناصر المحذوفة وعد الباقي',
    parentInstructions: 'كان مع الطفل ٥ بالونات طائرة.. فرقع اثنان منها! كم بالوناً بقي سليماً في يده؟',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: '٥ بالونات أخذنا منها بالونين (٥ - ٢ = ؟): كم بالوناً متبقياً؟',
        visual: '🎈 🎈 🎈 💥 💥',
        options: [
          { id: 'two', label: '٢', visual: '2️⃣', isCorrect: false },
          { id: 'three', label: '٣ (ثلاث بالونات متبقية)', visual: '3️⃣', isCorrect: true },
          { id: 'four', label: '٤', visual: '4️⃣', isCorrect: false }
        ],
        correctAnswer: 'three'
      }
    ]
  },
  {
    id: 'ws-5-06',
    title: 'مقارنة الأعداد بإشارة التمساح الجائع: (> أو < أو =)',
    slug: 'greater-than-less-than-symbols',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'logical_thinking',
    activityTypeLabel: 'التفكير المنطقي',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متقدم',
    objective: 'استخدام إشارات المقارنة الرياضية (أكبر من >، أصغر من <، يساوي =) بين الأعداد حتى 20.',
    skillsMeasured: ['مقارنة الأعداد المجردة', 'استيعاب الرموز الرياضية'],
    answerMethod: 'اختيار الرمز الرياضي المناسب',
    parentInstructions: 'فم التمساح الجائع يفتح دائماً باتجاه العدد الأكبر ليأكله!',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'قارن بين العددين: ٨ و ٥ (أي اتجاه يفتح فم التمساح الجائع؟)',
        options: [
          { id: 'gt', label: '٨ أكبر من ٥ ( ٨ > ٥ )', visual: '🐊 ➔ ٨', isCorrect: true },
          { id: 'lt', label: '٨ أصغر من ٥ ( ٨ < ٥ )', visual: '❌', isCorrect: false }
        ],
        correctAnswer: 'gt'
      },
      {
        id: 'q2',
        prompt: 'قارن بين العددين: ٦ و ٦',
        options: [
          { id: 'eq', label: '٦ يساوي ٦ ( ٦ = ٦ )', visual: '🟰', isCorrect: true },
          { id: 'diff', label: 'غير متساويين', visual: '≠', isCorrect: false }
        ],
        correctAnswer: 'eq'
      }
    ]
  },
  {
    id: 'ws-5-07',
    title: 'قطار الأرقام التصاعدية والتنازلية حتى ٢٠',
    slug: 'number-train-sequences-up-to-20',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'complete_pattern',
    activityTypeLabel: 'أكمل النمط',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'متقدم',
    objective: 'إكمال الأرقام المفقودة في متتالية تصاعدية أو تنازلية حتى الرقم 20.',
    skillsMeasured: ['العد القفزي والتسلسلي', 'معرفة السابق واللاحق للرقم'],
    answerMethod: 'كتابة الرقم المفقود في عربة القطار',
    parentInstructions: 'عربات القطار مرتبة: ١٠، ١١، ١٢.. ما الرقم الذي يركب العربة التالية؟',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'ما الرقم المفقود في عربة القطار: ١١ ، ١٢ ، [ ؟ ] ، ١٤ ، ١٥ ؟',
        options: [
          { id: 'thirteen', label: '١٣ (ثلاثة عشر)', visual: '1️⃣3️⃣', isCorrect: true },
          { id: 'sixteen', label: '١٦', visual: '1️⃣6️⃣', isCorrect: false }
        ],
        correctAnswer: 'thirteen'
      }
    ]
  },
  {
    id: 'ws-5-08',
    title: 'متاهة القلعة المعقدة: وصول الفارس الشجاع إلى مفتاح البوابة',
    slug: 'complex-castle-maze-with-dead-ends',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'mazes',
    activityTypeLabel: 'المتاهات',
    layoutType: 'maze_path',
    layoutLabel: 'مسار متاهة',
    difficulty: 'متقدم',
    objective: 'حل متاهة هندسية متعددة التفرعات (5 مسارات مسدودة ومسار واحد صحيح).',
    skillsMeasured: ['التفكير الاستراتيجي التخطيطي', 'الصبر وحل المشكلات المعقدة'],
    answerMethod: 'تتبع المسار الصحيح وتلوينه',
    parentInstructions: 'شجع طفلك على استكشاف المتاهة بالعين أولاً قبل وضع القلم على الورقة.',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: 'ساعِد الفارس الصغير 🛡️ في المرور عبر ممرات القلعة للوصول إلى مفتاح البوابة الذهبي 🗝️',
        visual: '🛡️ 🏰 ➔ [متاهة متشعبة] ➔ 🗝️'
      }
    ]
  },
  {
    id: 'ws-5-09',
    title: 'العلوم والطبيعة: الفصول الأربعة ومظاهر الطقس والملابس',
    slug: 'four-seasons-weather-clothing-science',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'science_nature',
    activityTypeLabel: 'العلوم والطبيعة',
    layoutType: 'classification_table',
    layoutLabel: 'جدول تصنيف',
    difficulty: 'متقدم',
    objective: 'الربط بين الفصول الأربعة (الربيع، الصيف، الخريف، الشتاء) والطقس ونوع الملابس المناسبة.',
    skillsMeasured: ['المعرفة المناخية والبيئية', 'التصنيف المتقدم متعدد الأبعاد'],
    answerMethod: 'توصيل كل فصل بمظهره الطبيعي',
    parentInstructions: 'متى تتساقط أوراق الأشجار الصفراء؟ في الخريف! ومتى تتفتح الأزهار؟ في الربيع البديع!',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل كل فصل من فصول السنة بما يميزه في الطبيعة:',
        matchPairs: [
          { leftId: 'spring', leftLabel: 'فصل الربيع المزهر', leftVisual: '🌸', rightId: 'flowers', rightLabel: 'تتفتح الأزهار وتغرد الطيور', rightVisual: '🌷🐦' },
          { leftId: 'summer', leftLabel: 'فصل الصيف الحار', leftVisual: '☀️', rightId: 'beach', rightLabel: 'شمس ساطعة وسباحة في البحر', rightVisual: '🏖️🍉' },
          { leftId: 'winter', leftLabel: 'فصل الشتاء البارد', leftVisual: '❄️', rightId: 'snow', rightLabel: 'تساقط الأمطار والثلوج', rightVisual: '⛄🌧️' }
        ]
      }
    ]
  },
  {
    id: 'ws-5-10',
    title: 'العلوم والطبيعة: حالات المادة الثلاث (صلبة، سائلة، غازية)',
    slug: 'states-of-matter-solid-liquid-gas',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'science_nature',
    activityTypeLabel: 'العلوم والطبيعة',
    layoutType: 'classification_table',
    layoutLabel: 'جدول تصنيف',
    difficulty: 'متقدم',
    objective: 'التعرف على حالات الماء: الثلج الصلب، والماء السائل، وبخار الماء الغازي.',
    skillsMeasured: ['المفاهيم الفيزيائية المبكرة', 'الملاحظة والتجريب العلمي'],
    answerMethod: 'تصنيف العناصر حسب حالتها الفيزيائية',
    parentInstructions: 'مكعب الثلج قاسٍ وصلب، والماء ينسكب ويجري في الكوب، وبخار الشاي يتصاعد في الهواء كالغاز!',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'أي من هذه الأشياء يعتبر مادة سائلة نرتشفها وتأخذ شكل الكوب؟',
        options: [
          { id: 'water', label: 'الماء وعصير البرتقال الطازج', visual: '💧 🧃', isCorrect: true },
          { id: 'rock', label: 'الحجر الصلب القاسي', visual: '🪨', isCorrect: false }
        ],
        correctAnswer: 'water'
      }
    ]
  },
  {
    id: 'ws-5-11',
    title: 'قصة مصورة وفهم المقروء: الصقر الصغير الذي تعلم الطيران بثقة',
    slug: 'young-falcon-learning-to-fly-story',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'picture_stories',
    activityTypeLabel: 'القصص المصورة',
    layoutType: 'comic_strip',
    layoutLabel: 'قصة مصورة متعددة المراحل',
    difficulty: 'متقدم',
    objective: 'قراءة قصة مصورة من 4 مشاهد واستنتاج مشاعر البطل وحل المشكلة بالعزيمة.',
    skillsMeasured: ['الفهم القرائي المعمق', 'التحليل السردي والشخصيات'],
    answerMethod: 'الإجابة عن أسئلة الفهم والاختيار من متعدد',
    parentInstructions: 'اقرأ القصة مع طفلك ودعه يصف مشاعر الصقر عندما خاف في البداية، وكيف شجعته أمه حتى حلق في الأعالي!',
    isAssessment: false,
    themeColor: 'orange',
    questions: [
      {
        id: 'q1',
        prompt: 'كيف استطاع الصقر الصغير أن يطير فوق الغيوم؟',
        visual: '🦅 🪹 🏔️ 🌤️',
        options: [
          { id: 'courage', label: 'وثق بنفسه، فرد جناحيه بقوة وشجعته أمه الحنونة', visual: '⭐ 🦅', isCorrect: true },
          { id: 'sleep', label: 'بقي نائماً في العش ولم يجرب أبداً', visual: '❌', isCorrect: false }
        ],
        correctAnswer: 'courage'
      }
    ]
  },
  {
    id: 'ws-5-12',
    title: 'الاستعداد للمدرسة الابتدائية: التمييز بين الحروف المتشابهة صوتاً (س مقابل ص، د مقابل ض)',
    slug: 'sound-distinction-seen-saad-daal-daad',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'school_readiness',
    activityTypeLabel: 'الاستعداد للمدرسة',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متقدم',
    objective: 'التمييز السمعي والنطقي بين الحروف المرققة (س، د) والحروف المفخمة (ص، ض).',
    skillsMeasured: ['مخارج الحروف والصفات الصوتية', 'التهيئة للإملاء السليم'],
    answerMethod: 'اختيار الحرف المفخم أو المرقق المناسب للصورة',
    parentInstructions: 'انطق بصوت واضح ومفخم: صصصص.. صَـقْر! ثم انطق مرققاً: سسسس.. سَـمَكَة!',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'أي حرف مفخم يبدأ به اسم هذا الطائر الجارح القوي: (صَـقْر 🦅)؟',
        options: [
          { id: 'saad', label: 'حرف الصاد المفخم (ص)', visual: 'ص', isCorrect: true },
          { id: 'seen', label: 'حرف السين المرقق (س)', visual: 'س', isCorrect: false }
        ],
        correctAnswer: 'saad'
      }
    ]
  },
  {
    id: 'ws-5-13',
    title: 'تفكير منطقي وحل المشكلات: إيجاد النصف الآخر للأشكال المتناظرة',
    slug: 'symmetry-line-drawing-shapes',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'logical_thinking',
    activityTypeLabel: 'التفكير المنطقي',
    layoutType: 'visual_puzzle',
    layoutLabel: 'أحجية بصرية',
    difficulty: 'متقدم',
    objective: 'رسم الشطر المتناظر بدقة عبر خط التماثل الرأسي (مثل الفراشة أو ورقة الشجر).',
    skillsMeasured: ['الإدراك المكاني المتناظر', 'الرسم المتوازن'],
    answerMethod: 'إكمال رسم النصف الأيسر ليتطابق مع النصف الأيمن تماماً',
    parentInstructions: 'خط التماثل يشبه المرآة السحرية.. كل خط في اليمين يقابله خط مماثل في اليسار!',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'أي جناح يكمل فراشتنا الجميلة ليصبح الجانبان متطابقين تماماً؟ 🦋',
        options: [
          { id: 'sym_wing', label: 'جناح ملون بنفس النقاط والألوان التوأم', visual: '🦋', isCorrect: true },
          { id: 'diff_wing', label: 'جناح دائري بلون مختلف كلياً', visual: '❌', isCorrect: false }
        ],
        correctAnswer: 'sym_wing'
      }
    ]
  },
  {
    id: 'ws-5-14',
    title: 'المهارات الحياتية: إشارة المرور والعبور الآمن للشارع',
    slug: 'traffic-lights-street-safety',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'life_skills',
    activityTypeLabel: 'المهارات الحياتية',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متقدم',
    objective: 'معرفة دلالات ألوان إشارة المرور (أحمر = قف، أصفر = استعد، أخضر = انطلق) وقواعد عبور ممر المشاة.',
    skillsMeasured: ['السلامة المرورية والمجتمعية', 'اتباع القوانين العامة'],
    answerMethod: 'توصيل لون الإشارة بالفعل الصحيح',
    parentInstructions: 'عندما تضيء الإشارة باللون الأحمر.. ماذا تفعل السيارات؟ تقف تماماً حتى يعبر المشاة بأمان!',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'ماذا يعني الضوء الأحمر في إشارة المرور؟',
        options: [
          { id: 'stop', label: 'قِف ولا تعبر (خطر)', visual: '🔴 🛑', isCorrect: true },
          { id: 'go', label: 'انطلق بسرعة', visual: '🟢', isCorrect: false }
        ],
        correctAnswer: 'stop'
      }
    ]
  },
  {
    id: 'ws-5-15',
    title: 'تنظيم المشاعر وحل النزاعات: ماذا أفعل عندما أغضب؟',
    slug: 'emotional-regulation-calm-down-kit',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'emotions',
    activityTypeLabel: 'المشاعر',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متقدم',
    objective: 'تعلم استراتيجيات التهدئة الذاتية: التنفس العميق، شرب الماء، والتعبير بالكلمات الهادئة بدل الصراخ.',
    skillsMeasured: ['الضبط الانفعالي الذاتي', 'حل المشكلات بدون عنف'],
    answerMethod: 'اختيار تقنية التهدئة الصحية',
    parentInstructions: 'عندما نشعر بالغضب يغلي في صدورنا.. نأخذ نفساً عميقاً كأننا نشم وردة ونطفئ شمعة!',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'إذا شعرت بالغضب الشديد لأن لعبتي انكسرت.. ما التصرف الذكي الذي يهدئني؟',
        options: [
          { id: 'breathe', label: 'آخذ نفساً عميقاً، وأتحدث مع ماما بهدوء لتساعدني في إصلاحها', visual: '🧘 💧 🗣️', isCorrect: true },
          { id: 'yell', label: 'أصرخ وأرمي الأشياء على الأرض', visual: '❌', isCorrect: false }
        ],
        correctAnswer: 'breathe'
      }
    ]
  },
  {
    id: 'ws-5-16',
    title: 'تلوين فني موجه: ماندالا الأشكال الهندسية المتناظرة',
    slug: 'geometric-mandala-directed-coloring',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'directed_coloring',
    activityTypeLabel: 'التلوين الموجه',
    layoutType: 'coloring_canvas',
    layoutLabel: 'ورقة تلوين',
    difficulty: 'متقدم',
    objective: 'تلوين تصميم هندسي متناظر باتباع قاعدة ألوان ثابتة لكل طبقة دائرية.',
    skillsMeasured: ['التركيز الحركي الفائق', 'التذوق الفني والتناسق اللوني'],
    answerMethod: 'تلوين المثلثات الخارجية والدوائر الداخلية بالألوان المخصصة',
    parentInstructions: 'لون كل المثلثات باللون الأزرق وكل الدوائر باللون الذهبي للحصول على سجادة بديعة.',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: 'لوّن ماندالا النجوم المتناظرة بدقة متناهية دون الخروج عن الخطوط 🎨 🌸',
        visual: '🌸 💠 ✨'
      }
    ]
  },
  {
    id: 'ws-5-17',
    title: 'نشاط قص وتركيب بازل الساعة: تعلم قراءة الوقت بالساعات الكاملة',
    slug: 'cut-and-paste-clock-telling-time',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'school_readiness',
    activityTypeLabel: 'الاستعداد للمدرسة',
    layoutType: 'cut_and_paste',
    layoutLabel: 'نشاط قص ولصق قابل للطباعة عند ملاءمته للعمر',
    difficulty: 'متقدم',
    objective: 'تركيب عقارب الساعة وفهم أن العقرب القصير للساعات والعقرب الطويل للدقائق (الساعة الثالثة تماماً).',
    skillsMeasured: ['قراءة الوقت البسيط', 'التركيب المكاني للأرقام 1-12'],
    answerMethod: 'تركيب العقارب أو قراءة الوقت المصور',
    parentInstructions: 'عندما يشير العقرب القصير إلى ٣ والطويل إلى ١٢، كم تكون الساعة الآن؟ الثالثة تماماً!',
    isAssessment: false,
    themeColor: 'sky',
    cutAndPasteAvailable: true,
    questions: [
      {
        id: 'q1',
        prompt: 'العقرب القصير عند ٤ والعقرب الطويل عند ١٢.. كم الساعة الآن؟',
        options: [
          { id: 'four_o_clock', label: 'الساعة الرابعة تماماً (4:00)', visual: '🕓', isCorrect: true },
          { id: 'six_o_clock', label: 'الساعة السادسة', visual: '🕕', isCorrect: false }
        ],
        correctAnswer: 'four_o_clock'
      }
    ]
  },
  {
    id: 'ws-5-18',
    title: 'العلوم والطبيعة: الكواكب والمجموعة الشمسية المدهشة',
    slug: 'solar-system-planets-science-age5',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'science_nature',
    activityTypeLabel: 'العلوم والطبيعة',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متقدم',
    objective: 'التعرف على كوكب الأرض الأزرق والشمس المشرقة والقمر الفضي ومدار الكواكب.',
    skillsMeasured: ['المعرفة الفلكية الأولية', 'إدراك كوكبنا الأرض وموقعه'],
    answerMethod: 'توصيل الكوكب باسمه وخصائصه',
    parentInstructions: 'نحن نعيش على كوكب الأرض الجميل المليء بالبحار والأشجار، والقمر يدور حولنا في كل ليلة!',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: 'أي كوكب نعيش عليه وتوجد به المحيطات الزرقاء والجبال والهواء النقي؟',
        options: [
          { id: 'earth', label: 'كوكب الأرض 🌍', visual: '🌍', isCorrect: true },
          { id: 'mars', label: 'كوكب المريخ الأحمر 🔴', visual: '🔴', isCorrect: false }
        ],
        correctAnswer: 'earth'
      }
    ]
  },
  {
    id: 'ws-5-19',
    title: 'المهارات الحياتية: إعداد شطيرة صحية بالخطوات المتسلسلة',
    slug: 'making-healthy-sandwich-life-skills',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'life_skills',
    activityTypeLabel: 'المهارات الحياتية',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'متقدم',
    objective: 'تطبيق خطوات إعداد وجبة خفيفة ومستقلة: شريحة الخبز، الجبن، الخس والطماطم، ثم إغلاق الشطيرة.',
    skillsMeasured: ['الاعتماد على النفس والاستقلالية', 'التسلسل العملي للأنشطة'],
    answerMethod: 'ترتيب خطوات تحضير الشطيرة من ١ إلى ٤',
    parentInstructions: 'دع طفلك يجرب إعداد شطيرته بنفسه تحت إشرافك لتعزيز ثقته واعتماده على نفسه!',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'رتب خطوات إعداد شطيرتك الشهية والصحية:',
        sequenceSteps: [
          { id: 'bread', label: '١. نضع شريحة الخبز الأسمر الصحي', visual: '🍞', order: 1 },
          { id: 'cheese', label: '٢. نضع شريحة الجبن اللذيذة', visual: '🧀', order: 2 },
          { id: 'veggies', label: '٣. نضيف أوراق الخس وشرائح الطماطم الطازجة', visual: '🥬 🍅', order: 3 },
          { id: 'eat', label: '٤. نغلق الشطيرة ونقول "بسم الله" ونتناولها بسعادة', visual: '🥪 😋', order: 4 }
        ]
      }
    ]
  },
  {
    id: 'ws-5-20',
    title: 'التفكير المنطقي: مصفوفة الأشكال والألوان (مصفوفة 3×3)',
    slug: 'logic-matrix-shapes-and-colors-3x3',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'logical_thinking',
    activityTypeLabel: 'التفكير المنطقي',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متقدم',
    objective: 'حل مصفوفة منطقية ثنائية المعايير (الشكل في الصف + اللون في العمود).',
    skillsMeasured: ['التفكير التجريدي والمنطقي', 'تقاطع المجموعات والمعايير'],
    answerMethod: 'اختيار العنصر الذي يطابق شرط الصف والعمود معاً',
    parentInstructions: 'انظر للصف: كله دوائر! وانظر للعمود: كله أخضر! إذن ما العنصر المطلوب؟ دائرة خضراء!',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'ما الشكل الذي يجمع بين (شكل النجمة ⭐) و(اللون الأحمر 🔴) في تقاطع الصف والعمود؟',
        options: [
          { id: 'red_star', label: 'نجمة حمراء ⭐🔴', visual: '⭐ (أحمر)', isCorrect: true },
          { id: 'blue_square', label: 'مربع أزرق', visual: '🟦', isCorrect: false }
        ],
        correctAnswer: 'red_star'
      }
    ]
  },
  {
    id: 'ws-5-21',
    title: 'تتبع الحروف الهجائية المتقدمة: حرف الضاد وحرف الظاء (ض - ظ)',
    slug: 'tracing-letters-daad-zhaa',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'arabic_letters',
    activityTypeLabel: 'الحروف العربية',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'متقدم',
    objective: 'كتابة حرف الضاد مع سنة الحرف وصحن الحرف، وحرف الظاء بعصاه ونقطته.',
    skillsMeasured: ['الدقة الخطية في الرسم الهجائي', 'التمييز بين الحروف المفخمة'],
    answerMethod: 'تتبع الحرف على السطر وكتابته ثلاث مرات',
    parentInstructions: 'ض.. ضفدع أخضر! وظ.. ظبي رشيق! اكتب الحرفين مع مراعاة النقطة وعصا الظاء.',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'تتبع حرف الضاد (ض 🐸) وحرف الظاء (ظ 🦌) بالنقاط المنظمة ✏️',
        tracingPaths: [
          { label: 'حرف الضاد', shape: 'letter', content: 'ض' },
          { label: 'حرف الظاء', shape: 'letter', content: 'ظ' }
        ]
      }
    ]
  },
  {
    id: 'ws-5-22',
    title: 'English Sight Words: Read and Circle (the, and, is, in, you)',
    slug: 'english-sight-words-read-and-circle',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'english_letters',
    activityTypeLabel: 'الحروف الإنجليزية',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متقدم',
    objective: 'Recognize high-frequency kindergarten sight words in short phrases.',
    skillsMeasured: ['Sight word automaticity', 'Early sentence reading'],
    answerMethod: 'Identify and match the target sight word',
    parentInstructions: 'Read aloud together: "The sun is hot!" Find the word "THE".',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'Find and select the sight word "AND" 🔤:',
        options: [
          { id: 'and', label: 'AND', visual: '✨ AND', isCorrect: true },
          { id: 'cat', label: 'CAT', visual: '🐱 CAT', isCorrect: false },
          { id: 'big', label: 'BIG', visual: '🐘 BIG', isCorrect: false }
        ],
        correctAnswer: 'and'
      }
    ]
  },
  {
    id: 'ws-5-23',
    title: 'ترتيب الأعداد حتى 20: من الأصغر إلى الأكبر',
    slug: 'ascending-order-numbers-up-to-20',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'counting_quantities',
    activityTypeLabel: 'العد والكميات',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'متقدم',
    objective: 'ترتيب مجموعة من 4 أعداد غير متتالية (مثال: ٣، ٧، ١٢، ١٨) تصاعدياً.',
    skillsMeasured: ['القيمة المكانية والترتيب العددي', 'التحليل الرياضي المتسلسل'],
    answerMethod: 'ترتيب الأرقام من الأصغر إلى الأكبر',
    parentInstructions: 'أي رقم هو الأصغر الذي نبدأ به؟ ثلاثة! ومن يأتي بعده؟ سبعة!',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'رتب الأعداد التالية تصاعدياً من الأصغر إلى الأكبر: (١٥ ، ٤ ، ٩)',
        options: [
          { id: 'correct_order', label: '٤ ثم ٩ ثم ١٥', visual: '٤ ➔ ٩ ➔ ١٥', isCorrect: true },
          { id: 'wrong_order', label: '١٥ ثم ٤ ثم ٩', visual: '❌', isCorrect: false }
        ],
        correctAnswer: 'correct_order'
      }
    ]
  },
  {
    id: 'ws-5-24',
    title: 'أحجية الملاحظة والتركيز: اكتشف ٧ اختلافات دقيقة بين الصورتين',
    slug: 'seven-differences-detailed-room-scene',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'visual_puzzles',
    activityTypeLabel: 'الألغاز البصرية',
    layoutType: 'visual_puzzle',
    layoutLabel: 'أحجية بصرية',
    difficulty: 'متقدم',
    objective: 'اكتشاف فروق مجهرية في مشهد غرفة الأطفال (عقارب الساعة، عدد الكتب، وجه الدمية).',
    skillsMeasured: ['الانتباه المركز والمستمر', 'الفحص البصري الدقيق المنظم'],
    answerMethod: 'تحديد أماكن الاختلافات السبعة',
    parentInstructions: 'امسح المشهد من الأعلى للأسفل: تفحص الرفوف، النافذة، السرير، وألعاب الأرضية.',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'ما التغيير الموجود في رف الكتب في الصورة الثانية؟',
        options: [
          { id: 'book_missing', label: 'كتاب أزرق مفقود من فوق الرف', visual: '📚 ❌', isCorrect: true },
          { id: 'no_change', label: 'الكتب متطابقة تماماً', visual: '✔️', isCorrect: false }
        ],
        correctAnswer: 'book_missing'
      }
    ]
  },
  {
    id: 'ws-5-25',
    title: 'العلوم والطبيعة: الكائنات الحية واحتياجاتها الأربعة للنمو',
    slug: 'living-things-basic-needs-science',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'science_nature',
    activityTypeLabel: 'العلوم والطبيعة',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متقدم',
    objective: 'التعرف على احتياجات النبات والحيوان الأساسية: الماء، الغذاء، الهواء النظيف، وضوء الشمس.',
    skillsMeasured: ['المفاهيم البيئية الحيوية', 'ربط الكائن الحي ببيئته'],
    answerMethod: 'توصيل الاحتياجات الأساسية بنبتة الحديقة',
    parentInstructions: 'ماذا تحتاج الشجرة الصغيرة لكي تصبح كبيرة وتثمر؟ ماء، وهواء، وشمس دافئة وتربة صالحة!',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'ما الذي تحتاجه النبتة لكي تعيش وتكبر خضراء مورقة؟',
        options: [
          { id: 'sun_water', label: 'ضوء الشمس الساطع والماء والتربة ☀️ 💧 🪴', visual: '☀️ 💧 🪴', isCorrect: true },
          { id: 'dark_box', label: 'صندوق مغلق ومظلم بدون هواء', visual: '📦', isCorrect: false }
        ],
        correctAnswer: 'sun_water'
      }
    ]
  },
  {
    id: 'ws-5-26',
    title: 'الاستعداد للمدرسة الابتدائية: الاستماع واتباع التعليمات متعددة الأوامر',
    slug: 'following-multi-step-directions-school-ready',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'school_readiness',
    activityTypeLabel: 'الاستعداد للمدرسة',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متقدم',
    objective: 'تنفيذ أمر مركب من 3 خطوات متتابعة (ضع دائرة على المثلث، ثم لوّن المربع بالأحمر، ثم ضع خطاً تحت الدائرة).',
    skillsMeasured: ['الذاكرة السمعية العاملة', 'الانتباه والامتثال للتوجيهات'],
    answerMethod: 'تنفيذ الأوامر بالترتيب الدقيق',
    parentInstructions: 'اقرأ التعليمات مرة واحدة بوضوح ودع طفلك ينفذ الخطوات الثلاث بدون تذكير إضافي.',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'الأمر المركب: "اختر المثلث ثم انقر على اللون الأزرق"',
        options: [
          { id: 'blue_tri', label: 'مثلث أزرق 🔺🔵', visual: '🔺🔵', isCorrect: true },
          { id: 'red_sq', label: 'مربع أحمر', visual: '🟦🔴', isCorrect: false }
        ],
        correctAnswer: 'blue_tri'
      }
    ]
  },
  {
    id: 'ws-5-27',
    title: 'قصة مصورة: فريق النحل الذي بنى الخلية بالتعاون',
    slug: 'cooperation-bees-hive-story',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'picture_stories',
    activityTypeLabel: 'القصص المصورة',
    layoutType: 'comic_strip',
    layoutLabel: 'قصة مصورة متعددة المراحل',
    difficulty: 'متقدم',
    objective: 'استيعاب قيمة التعاون والعمل الجماعي وأثره في إنجاز المهام الكبيرة.',
    skillsMeasured: ['القيم الإنسانية والاجتماعية', 'الاستنتاج الأخلاقي من القصة'],
    answerMethod: 'اختيار العبرة المستفادة من القصة المصورة',
    parentInstructions: 'كل نحلة أحضرت رحيقاً قليلاً.. وعندما وضعوا الرحيق معاً امتلأت الخلية بعسل شهي! ما سر نجاحهم؟ التعاون!',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'ما الذي ساعد النحل على إنتاج العسل اللذيذ وملء الخلية؟',
        visual: '🐝 🐝 🐝 🍯 🌺',
        options: [
          { id: 'coop', label: 'التعاون ومساعدة بعضهم البعض بروح الفريق', visual: '🤝 🍯', isCorrect: true },
          { id: 'quarrel', label: 'التشاجر والكسل', visual: '❌', isCorrect: false }
        ],
        correctAnswer: 'coop'
      }
    ]
  },
  {
    id: 'ws-5-28',
    title: 'التفكير المنطقي: أي ظل ثلاثي الأبعاد يطابق هذا المجسم؟',
    slug: '3d-shapes-shadow-perspective-cube-sphere',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'logical_thinking',
    activityTypeLabel: 'التفكير المنطقي',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متقدم',
    objective: 'التمييز بين المجسمات ثلاثية الأبعاد (مكعب، كرة، أسطوانة) ومساقط ظلالها الهندسية.',
    skillsMeasured: ['الإدراك الفراغي المجسم', 'التفكير الهندسي المتقدم'],
    answerMethod: 'توصيل المكعب بظله المربع والأسطوانة بظلها الدائري',
    parentInstructions: 'انظر لعلبة المناديل التي تشبه متوازي المستطيلات.. إذا سلطنا عليها الضوء، ما شكل ظلها على الجدار؟',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: 'ما شكل الظل الذي تسقطه كرة القدم الدائرية ⚽ على الأرض؟',
        options: [
          { id: 'circle_shadow', label: 'ظل دائري منتظم ⭕', visual: '⭕', isCorrect: true },
          { id: 'square_shadow', label: 'ظل مربع مستقيم ⬛', visual: '⬛', isCorrect: false }
        ],
        correctAnswer: 'circle_shadow'
      }
    ]
  },
  {
    id: 'ws-5-29',
    title: 'تلوين موجه: خريطة العالم وقاراته بألوان المفتاح الجغرافي',
    slug: 'world-map-continents-coloring-age5',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'directed_coloring',
    activityTypeLabel: 'التلوين الموجه',
    layoutType: 'coloring_canvas',
    layoutLabel: 'ورقة تلوين',
    difficulty: 'متقدم',
    objective: 'تلوين اليابسة بالأخضر والبني والمحيطات بالأزرق للتعرف على كوكب الأرض.',
    skillsMeasured: ['الوعي الجغرافي المبكر', 'التناسق اللوني المكاني'],
    answerMethod: 'تلوين المحيطات واليابسة وفق المفتاح المحدد',
    parentInstructions: 'الأزرق للمحيطات الشاسعة، والأخضر للغابات، والأصفر للصحاري الذهبية.',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'لوّن المحيطات المائية باللون الأزرق 🌊 واليابسة بالأخضر والبرتقالي 🌍',
        visual: '🌍 🌊 🏝️'
      }
    ]
  },
  {
    id: 'ws-5-30',
    title: 'اختبار تشخيصي متكامل للجاهزية للمدرسة الابتدائية (٥ - ٦ سنوات)',
    slug: 'school-readiness-comprehensive-assessment-age-5',
    ageGroup: '5-6',
    ageGroupLabel: 'من 5 سنوات إلى 6 سنوات',
    activityType: 'comprehensive_assessment',
    activityTypeLabel: 'اختبارات شاملة',
    layoutType: 'assessment_suite',
    layoutLabel: 'اختبار مصور متعدد الأنشطة',
    difficulty: 'متقدم',
    objective: 'التقييم الشامل للاستعداد للالتحاق بالصف الأول الابتدائي: كتابة وقراءة الحركات، الجمع والطرح حتى 10، التفكير المنطقي، واستيعاب الآداب المدرسية.',
    skillsMeasured: ['الوعي القرائي والكتابي', 'المهارات الحسابية الأساسية (+ و -)', 'الاستدلال المنطقي وحل المسائل', 'النضج الانفعالي والاجتماعي'],
    answerMethod: 'إجابة كتابية وشكوكية للطفل مع توثيق النتائج في دليل التصحيح',
    parentInstructions: 'هذا الاختبار بمثابة بطاقة تفوق وتهنئة لطفلك قبل دخوله المدرسة. احتفل بإنجازاته واعتبر أي خطأ فرصة لمزيد من اللعب والتعلم!',
    isAssessment: true,
    assessmentGuide: {
      totalScore: 4,
      evaluationCriteria: [
        'يميز الحركات القصيرة ويقرأ كلمات ثلاثية بسيطة',
        'يجري عمليات الجمع والطرح حتى الرقم 10 بصرياً',
        'يميز السلوك المدرسي السليم (رفع اليد للاستئذان)',
        'يحل مسألة منطقية مكونة من خطوتين'
      ],
      answerKey: [
        'السؤال 1: الحرف بَ المفتوح (بَـطَّة)',
        'السؤال 2: ناتج الجمع ٥ (خمس حبات)',
        'السؤال 3: السلوك الصحيح (رفع اليد للاستئذان في الصف)',
        'السؤال 4: كوكب الأرض (🌍)'
      ],
      teacherNotes: 'أداء 3 من 4 يوضح جاهزية ممتازة ومطمئنة تماماً للمدرسة الابتدائية.'
    },
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: '١. أي حرف مشكول تبدأ به كلمة (بَطَّة 🦆)؟',
        options: [
          { id: 'ba_fatha', label: 'بَ (بالفتحة)', visual: 'بَ', isCorrect: true },
          { id: 'bi_kasra', label: 'بِ (بالكسرة)', visual: 'بِ', isCorrect: false }
        ],
        correctAnswer: 'ba_fatha'
      },
      {
        id: 'q2',
        prompt: '٢. احسب ناتج العملية الحسابية: ٣ تفاحات + ٢ تفاحتان = ؟',
        options: [
          { id: 'five', label: '٥ تفاحات (خمسة)', visual: '5️⃣', isCorrect: true },
          { id: 'six', label: '٦', visual: '6️⃣', isCorrect: false }
        ],
        correctAnswer: 'five'
      },
      {
        id: 'q3',
        prompt: '٣. ما التصرف المهذب في الفصل عندما نريد الإجابة عن سؤال المعلم؟',
        options: [
          { id: 'raise_hand', label: 'أرفع يدي بأدب وأنتظر إذنه المبتسم 🙋‍♂️', visual: '🙋‍♂️', isCorrect: true },
          { id: 'shout', label: 'أصرخ بأعلى صوتي دون استئذان', visual: '❌', isCorrect: false }
        ],
        correctAnswer: 'raise_hand'
      },
      {
        id: 'q4',
        prompt: '٤. على أي كوكب بديع نعيش ونرى سماءه الزرقاء وبحاره؟',
        options: [
          { id: 'earth', label: 'كوكب الأرض 🌍', visual: '🌍', isCorrect: true },
          { id: 'sun', label: 'الشمس الحارقة ☀️', visual: '☀️', isCorrect: false }
        ],
        correctAnswer: 'earth'
      }
    ]
  }
];
