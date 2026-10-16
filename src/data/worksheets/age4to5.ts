import { Worksheet } from '../../types/worksheet';

export const worksheetsAge4to5: Worksheet[] = [
  {
    id: 'ws-4-01',
    title: 'مطابقة الحروف العربية بصور الكلمات الشائعة (ج - ح - خ)',
    slug: 'arabic-letters-jeem-haa-khaa-matching',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'arabic_letters',
    activityTypeLabel: 'الحروف العربية',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متوسط',
    objective: 'التمييز بين الحروف المتشابهة في الرسم (ج، ح، خ) بحسب موضع النقطة وربط كل حرف بصورته.',
    skillsMeasured: ['التمييز البصري للحروف المتشابهة', 'الوعي الصوتي للمبتدئين'],
    answerMethod: 'توصيل الحرف بالصورة التي يبدأ اسمها به',
    parentInstructions: 'اسأل طفلك: أين النقطة في حرف الجيم؟ في بطنه كحبة التمر! ج.. جمل في الصحراء.',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل كل حرف بالصورة التي يبدأ اسمها بهذا الحرف:',
        matchPairs: [
          { leftId: 'jeem', leftLabel: 'حرف الجيم (ج)', leftVisual: 'ج', rightId: 'camel', rightLabel: 'جَمَل', rightVisual: '🐪' },
          { leftId: 'haa', leftLabel: 'حرف الحاء (ح)', leftVisual: 'ح', rightId: 'whale', rightLabel: 'حُوت', rightVisual: '🐋' },
          { leftId: 'khaa', leftLabel: 'حرف الخاء (خ)', leftVisual: 'خ', rightId: 'sheep', rightLabel: 'خَرُوف', rightVisual: '🐑' }
        ]
      }
    ]
  },
  {
    id: 'ws-4-02',
    title: 'تتبع الحروف الهجائية بالأسهم: الدال والذال (د - ذ)',
    slug: 'tracing-letters-daal-dhaal',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'arabic_letters',
    activityTypeLabel: 'الحروف العربية',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'متوسط',
    objective: 'تدريب عضلات الأصابع على كتابة المنحنى الزاوي لحرفي الدال والذال بدقة.',
    skillsMeasured: ['التحكم الحركي الدقيق للقلم', 'اتباع اتجاه الكتابة من اليمين لليسار'],
    answerMethod: 'تتبع النقاط باتجاه السهم وكتابة الحرف',
    parentInstructions: 'نبدأ من الأعلى وننزل بميل ثم نمشي على السطر نحو اليسار: د.. دراجة!',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'تتبع بالقلم خط حرف الدال (د) والذال (ذ) بالنقاط المنظمة ✏️',
        tracingPaths: [
          { label: 'مسار حرف الدال', shape: 'letter', content: 'د' },
          { label: 'مسار حرف الذال مع نقطته', shape: 'letter', content: 'ذ' }
        ]
      }
    ]
  },
  {
    id: 'ws-4-03',
    title: 'Letter Phonics Matching: (E, F, G)',
    slug: 'english-letters-e-f-g-matching',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'english_letters',
    activityTypeLabel: 'الحروف الإنجليزية',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متوسط',
    objective: 'ربط الحروف الإنجليزية E و F و G بصوتيات البداية مع الصور المألوفة.',
    skillsMeasured: ['Phonemic awareness', 'Letter-sound correspondence', 'Visual matching'],
    answerMethod: 'Connect letter to corresponding picture',
    parentInstructions: 'Encourage your child to make the sound: /e/ for elephant, /f/ for fish, /g/ for grapes!',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'Match each uppercase letter to its beginning-sound picture:',
        matchPairs: [
          { leftId: 'e', leftLabel: 'Letter E', leftVisual: 'E', rightId: 'elephant', rightLabel: 'Elephant', rightVisual: '🐘' },
          { leftId: 'f', leftLabel: 'Letter F', leftVisual: 'F', rightId: 'fish', rightLabel: 'Fish', rightVisual: '🐟' },
          { leftId: 'g', leftLabel: 'Letter G', leftVisual: 'G', rightId: 'grapes', rightLabel: 'Grapes', rightVisual: '🍇' }
        ]
      }
    ]
  },
  {
    id: 'ws-4-04',
    title: 'عد الكواكب والنجوم حتى ١٠ وربط الرقم بالكمية',
    slug: 'counting-up-to-10-space-theme',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'counting_quantities',
    activityTypeLabel: 'العد والكميات',
    layoutType: 'number_grid',
    layoutLabel: 'شبكة أرقام وكميات',
    difficulty: 'متوسط',
    objective: 'عد مجموعات مصورة بين 6 و 10 وتحديد الرقم العربي المناسب بدقة.',
    skillsMeasured: ['العد الفردي حتى 10', 'مفهوم ثبات الكمية', 'التعرف على الأرقام 6-10'],
    answerMethod: 'عد العناصر واختيار الرمز الرقمي الصحيح',
    parentInstructions: 'عد النجوم الساطعة بإصبعك وتأكد من عدم تخطي أي نجمة!',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: 'عد الشهب المتلألئة في الفضاء: ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐',
        visual: '⭐⭐⭐⭐⭐⭐⭐',
        options: [
          { id: 'six', label: '٦ (ستة)', visual: '6️⃣', isCorrect: false },
          { id: 'seven', label: '٧ (سبعة)', visual: '7️⃣', isCorrect: true },
          { id: 'eight', label: '٨ (ثمانية)', visual: '8️⃣', isCorrect: false }
        ],
        correctAnswer: 'seven'
      },
      {
        id: 'q2',
        prompt: 'عد الصواريخ الفضائية: 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀',
        visual: '🚀🚀🚀🚀🚀🚀🚀🚀',
        options: [
          { id: 'eight', label: '٨ (ثمانية)', visual: '8️⃣', isCorrect: true },
          { id: 'nine', label: '٩ (تسعة)', visual: '9️⃣', isCorrect: false }
        ],
        correctAnswer: 'eight'
      }
    ]
  },
  {
    id: 'ws-4-05',
    title: 'تتبع الأرقام وكتابتها: الأرقام (٤ - ٥ - ٦)',
    slug: 'tracing-numbers-four-five-six',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'line_tracing',
    activityTypeLabel: 'تتبع الخطوط',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'متوسط',
    objective: 'تدريب يد الطفل على المنحنيات الخاصة بالأرقام العربية ٤ و ٥ و ٦.',
    skillsMeasured: ['الكتابة المبكرة للأرقام', 'التحكم الحركي بالأصابع'],
    answerMethod: 'تتبع الخطوط المنقطة للأرقام',
    parentInstructions: 'الرقم ٤ نصف دائرة ونصف دائرة، والرقم ٥ دائرة مغلقة كالحلقة!',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'تتبع الأرقام العربية بدقة: ٤ ، ٥ ، ٦ على السطر ✍️',
        tracingPaths: [
          { label: 'الرقم أربعة', shape: 'number', content: '٤' },
          { label: 'الرقم خمسة', shape: 'number', content: '٥' },
          { label: 'الرقم ستة', shape: 'number', content: '٦' }
        ]
      }
    ]
  },
  {
    id: 'ws-4-06',
    title: 'إكمال الأنماط الثلاثية (ABC): دائرة، مربع، مثلث',
    slug: 'three-element-patterns-abc',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'complete_pattern',
    activityTypeLabel: 'أكمل النمط',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'متوسط',
    objective: 'اكتشاف قاعدة النمط الثلاثي المتكرر وإكمال العنصرين التاليين.',
    skillsMeasured: ['التفكير النمطي المتقدم', 'الذاكرة البصرية التتابعية'],
    answerMethod: 'اختيار الشكلين المكملين للمتسلسلة',
    parentInstructions: 'دائرة.. مربع.. مثلث.. دائرة.. مربع.. ماذا يأتي الآن؟ رائع.. إنه المثلث!',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: '🔴 🟦 🔺 🔴 🟦 ... ما الشكل الناقص الذي يعيد تكرار النمط؟',
        options: [
          { id: 'triangle', label: 'مثلث أحمر', visual: '🔺', isCorrect: true },
          { id: 'star', label: 'نجمة ذهبية', visual: '⭐', isCorrect: false }
        ],
        correctAnswer: 'triangle'
      }
    ]
  },
  {
    id: 'ws-4-07',
    title: 'اكتشف العنصر الدخيل: تصنيف الحيوانات والنباتات',
    slug: 'odd-one-out-animals-vs-plants-age4',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'odd_one_out',
    activityTypeLabel: 'اكتشف المختلف',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'فصل عالم الحيوان عن عالم النبات بناء على خصائص التغذية والحركة.',
    skillsMeasured: ['التصنيف البيولوجي الأساسي', 'التحليل والاستنتاج المنطقي'],
    answerMethod: 'وضع دائرة على العنصر الذي لا ينتمي للمجموعة',
    parentInstructions: 'هنا أسد وزرافة وفيل.. وتفاحة حمراء تنمو على الشجرة! من لا يمشي مع الحيوانات؟',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'ضع دائرة حول الشيء الذي ينتمي لعالم النباتات وسط حيوانات الغابة:',
        options: [
          { id: 'lion', label: 'أسد', visual: '🦁', isCorrect: false },
          { id: 'giraffe', label: 'زرافة', visual: '🦒', isCorrect: false },
          { id: 'apple', label: 'تفاحة نباتية', visual: '🍎', isCorrect: true }
        ],
        correctAnswer: 'apple',
        explanationOrHint: 'التفاح نبات ثمر، بينما البقية حيوانات برية حية!'
      }
    ]
  },
  {
    id: 'ws-4-08',
    title: 'تصنيف الكائنات: أين يعيش هذا الكائن؟ (اليابسة أم الماء)',
    slug: 'habitat-classification-land-vs-sea',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'categorization',
    activityTypeLabel: 'التصنيف',
    layoutType: 'classification_table',
    layoutLabel: 'جدول تصنيف',
    difficulty: 'متوسط',
    objective: 'تصنيف الحيوانات إلى حيوانات مائية تتنفس بالخياشيم وحيوانات برية تعيش في الغابات والمزارع.',
    skillsMeasured: ['فهم البيئات الطبيعية', 'التصنيف المنهجي متعدد العناصر'],
    answerMethod: 'وضع كل حيوان في موطنه المناسب',
    parentInstructions: 'القرش والأخطبوط يسبحان في الأعماق، بينما الحصان يركض في الحقل الأخضر!',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'حدد الحيوانات التي تعيش وتتنفس دائماً في أعماق البحار:',
        options: [
          { id: 'whale', label: 'حوت أزرق ضخم', visual: '🐋', isCorrect: true },
          { id: 'horse', label: 'حصان سريع', visual: '🐎', isCorrect: false },
          { id: 'octopus', label: 'أخطبوط ذو أذرع متعددة', visual: '🐙', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'ws-4-09',
    title: 'ترتيب الأحداث اليومية: كيف نقضي يومنا بنشاط؟',
    slug: 'daily-routine-sequencing-four-steps',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'event_sequencing',
    activityTypeLabel: 'ترتيب الأحداث',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'متوسط',
    objective: 'ترتيب أربع مراحل زمنية ليوم الطفل: الاستيقاظ، تنظيف الأسنان، اللعب والتعلم، ثم النوم ليلاً.',
    skillsMeasured: ['الإدراك الزمني التتابعي', 'تنظيم الوقت الذاتي'],
    answerMethod: 'ترتيب البطاقات من ١ إلى ٤',
    parentInstructions: 'ماذا نفعل بعد أن ننهض من السرير؟ نغسل أسناننا بالفرشاة والمعجون!',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'رتب أحداث اليوم النموذجي بالترتيب الصحيح:',
        sequenceSteps: [
          { id: 'step1', label: '١. الاستيقاظ مع شروق الشمس', visual: '🌅 ⏰', order: 1 },
          { id: 'step2', label: '٢. تفريش الأسنان وتناول الإفطار', visual: '🪥 🍳', order: 2 },
          { id: 'step3', label: '٣. التعلم واللعب المفيد في الروضة', visual: '🎨 📚', order: 3 },
          { id: 'step4', label: '٤. قراءة قصة والنوم في سريري المريح', visual: '🌙 🛌', order: 4 }
        ]
      }
    ]
  },
  {
    id: 'ws-4-10',
    title: 'لغز المتاهة الملتوية: أرنب الحقل نحو جحر الأمان',
    slug: 'twisting-maze-rabbit-burrow',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'mazes',
    activityTypeLabel: 'المتاهات',
    layoutType: 'maze_path',
    layoutLabel: 'مسار متاهة',
    difficulty: 'متوسط',
    objective: 'التغلب على 3 مفارق طرق مسدودة لاختيار المسار الوحيد الموصل للهدف.',
    skillsMeasured: ['التفكير الاستباقي', 'حل المشكلات المكانية', 'المثابرة'],
    answerMethod: 'رسم المسار الصحيح المفتوح',
    parentInstructions: 'انظر بعينيك أولاً قبل أن ترسم بالقلم لتتأكد من عدم وجود صخرة تسد الطريق.',
    isAssessment: false,
    themeColor: 'orange',
    questions: [
      {
        id: 'q1',
        prompt: 'ابحث عن الطريق السالك من بين الممرات المتشعبة ليصل الأرنب 🐰 إلى جحره 🕳️',
        visual: '🐰 ─── 🧱 (طريق مغلق) | ─── 🕳️ (طريق سالك)'
      }
    ]
  },
  {
    id: 'ws-4-11',
    title: 'التلوين الموجه بالأرقام: لوحة الحديقة الزاهية (Color by Number)',
    slug: 'color-by-number-garden-age4',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'directed_coloring',
    activityTypeLabel: 'التلوين الموجه',
    layoutType: 'coloring_canvas',
    layoutLabel: 'ورقة تلوين',
    difficulty: 'متوسط',
    objective: 'الربط بين مفتاح الألوان المرقم وتلوين المساحات المخصصة (١ = أصفر، ٢ = أخضر، ٣ = أزرق).',
    skillsMeasured: ['اتباع الرموز والإرشادات', 'الدقة الحركية للأصابع', 'التركيز الموجه'],
    answerMethod: 'تلوين كل جزء بحسب الرقم المحدد في الدليل',
    parentInstructions: 'رقم ١ للشمس ولتلات الورد، ورقم ٢ لأوراق الشجر والعشب الأخضر!',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'دليل الألوان: (١ = أصفر 🟡) - (٢ = أخضر 🟢) - (٣ = أزرق 🔵). لوّن المشهد بدقة!',
        visual: '🌻 ☀️ 🌳'
      }
    ]
  },
  {
    id: 'ws-4-12',
    title: 'لغز بصري: اكتشف ٥ فروق في حديقة الألعاب',
    slug: 'five-differences-playground-puzzle',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'visual_puzzles',
    activityTypeLabel: 'الألغاز البصرية',
    layoutType: 'visual_puzzle',
    layoutLabel: 'أحجية بصرية',
    difficulty: 'متوسط',
    objective: 'اكتشاف فروق دقيقة في تفاصيل الملابس ولون الكرات وموقع الطيور.',
    skillsMeasured: ['التمييز البصري المجهري', 'الذاكرة الصورية', 'التركيز المطول'],
    answerMethod: 'وضع دائرة على كل فرق يتم اكتشافه',
    parentInstructions: 'قارن بين الصورتين عموداً بعمود.. هل قبعة الطفل في الصورة الثانية حمراء أم زرقاء؟',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'ما الفرق الواضح بين الصورتين في قبعة الطفل؟',
        options: [
          { id: 'diff_cap', label: 'تغير لون القبعة من أحمر إلى أزرق', visual: '🧢', isCorrect: true },
          { id: 'no_diff', label: 'لا يوجد أي تغيير', visual: '❌', isCorrect: false }
        ],
        correctAnswer: 'diff_cap'
      }
    ]
  },
  {
    id: 'ws-4-13',
    title: 'نشاط قص ولصق قابل للطباعة: ابنِ بيتك الجميل بالأشكال',
    slug: 'cut-and-paste-build-a-house',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'school_readiness',
    activityTypeLabel: 'الاستعداد للمدرسة',
    layoutType: 'cut_and_paste',
    layoutLabel: 'نشاط قص ولصق قابل للطباعة عند ملاءمته للعمر',
    difficulty: 'متوسط',
    objective: 'قص الأشكال الهندسية بمقص أطفال آمن ولصقها لتكوين بيت كامل (مربع للجدران، مثلث للسقف، مستطيل للباب).',
    skillsMeasured: ['مهارات المقص الآمن', 'التنسيق ثنائي اليدين', 'التكامل البصري المكاني'],
    answerMethod: 'قص ولصق الأشكال أو سحبها وإفلاتها على الشاشة',
    parentInstructions: 'راقب طفلك أثناء استخدام مقص الأمان ذي الحواف البلاستيكية، وشجعه على محاذاة الأضلاع.',
    isAssessment: false,
    themeColor: 'indigo',
    cutAndPasteAvailable: true,
    questions: [
      {
        id: 'q1',
        prompt: 'طابق قطع البناء: أي شكل يمثل سقف المنزل المائل في الأعلى؟',
        options: [
          { id: 'roof', label: 'المثلث الكبير (سقف البيت)', visual: '🔺', isCorrect: true },
          { id: 'door', label: 'المستطيل الطويل (الباب)', visual: '🚪', isCorrect: false }
        ],
        correctAnswer: 'roof'
      }
    ]
  },
  {
    id: 'ws-4-14',
    title: 'العلوم والطبيعة: الحواس الخمس وكيف نستكشف العالم بها',
    slug: 'five-senses-matching-age4',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'science_nature',
    activityTypeLabel: 'العلوم والطبيعة',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متوسط',
    objective: 'ربط كل عضو حسي (عين، أذن، أنف، لسان، يد) بوظيفته الإدراكية في الحياة اليومية.',
    skillsMeasured: ['المعرفة التشريحية الأولية', 'ربط السبب بالنتيجة الحركية الحواسية'],
    answerMethod: 'توصيل العضو بالحاسة والشيء المحسوس',
    parentInstructions: 'بماذا نشم رائحة الوردة العطرة؟ بأنفنا الجميل! وبماذا نسمع صوت العصفور؟ بآذاننا!',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل العضو بالحاسة التي نستكشف بها الأشياء:',
        matchPairs: [
          { leftId: 'eye', leftLabel: 'العين (البصر)', leftVisual: '👁️', rightId: 'rainbow', rightLabel: 'رؤية قوس قزح البديع', rightVisual: '🌈' },
          { leftId: 'ear', leftLabel: 'الأذن (السمع)', leftVisual: '👂', rightId: 'bell', rightLabel: 'سماع رنين الجرس', rightVisual: '🔔' },
          { leftId: 'nose', leftLabel: 'الأنف (الشم)', leftVisual: '👃', rightId: 'flower', rightLabel: 'شم عطر الوردة الزكية', rightVisual: '🌹' }
        ]
      }
    ]
  },
  {
    id: 'ws-4-15',
    title: 'المهارات الحياتية: تنظيم ألعابي وترتيب غرفتي',
    slug: 'organizing-toys-responsibility',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'life_skills',
    activityTypeLabel: 'المهارات الحياتية',
    layoutType: 'classification_table',
    layoutLabel: 'جدول تصنيف',
    difficulty: 'متوسط',
    objective: 'غرس قيمة تحمل المسؤولية وترتيب الألعاب في صناديقها بعد الانتهاء من اللعب.',
    skillsMeasured: ['المسؤولية الذاتية', 'التنظيم المكاني للأغراض'],
    answerMethod: 'اختيار السلوك الإيجابي الصحيح',
    parentInstructions: 'بعد أن ننهي اللعب بالمكعبات.. هل نتركها مبعثرة على الأرض أم نجمعها في الصندوق؟',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'ما التصرف الصحيح بعد انتهاء وقت اللعب الممتع؟',
        options: [
          { id: 'pack', label: 'أضع الدمى والمكعبات داخل صندوق الألعاب بلطف', visual: '📦 🧸', isCorrect: true },
          { id: 'leave', label: 'أتركها مبعثرة على السجاد ليتعثر بها أخي', visual: '⚠️', isCorrect: false }
        ],
        correctAnswer: 'pack'
      }
    ]
  },
  {
    id: 'ws-4-16',
    title: 'فهم المشاعر والتعاطف: صديقي حزين.. ماذا أفعل؟',
    slug: 'empathy-helping-sad-friend',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'emotions',
    activityTypeLabel: 'المشاعر',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'بناء التعاطف والمشاركة الوجدانية ومساعدة الصديق عند بكائه أو سقوطه.',
    skillsMeasured: ['الذكاء العاطفي الاجتماعي', 'التعاطف ومساعدة الأقران'],
    answerMethod: 'اختيار السلوك المساعد للصديق',
    parentInstructions: 'إذا وقع صديقك وبكى.. كيف تريحه وتسعد قلبه؟ نشاركه اللعبة ونساعده على الوقوف!',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'سقط صديقنا في الملعب وبدأ بالبكاء.. كيف نساعده بمحبة؟',
        options: [
          { id: 'help', label: 'أمد يدي له، أسأله إن كان بخير وأشاركه لعبتي المفضلة', visual: '🤝 🧸', isCorrect: true },
          { id: 'laugh', label: 'أضحك عليه وأتركه وحيداً', visual: '❌', isCorrect: false }
        ],
        correctAnswer: 'help'
      }
    ]
  },
  {
    id: 'ws-4-17',
    title: 'قصة مصورة: النملة النشيطة التي جمعت الحبوب',
    slug: 'busy-ant-story-comprehension',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'picture_stories',
    activityTypeLabel: 'القصص المصورة',
    layoutType: 'comic_strip',
    layoutLabel: 'قصة مصورة متعددة المراحل',
    difficulty: 'متوسط',
    objective: 'قراءة وفهم أحداث قصة مصورة قصيرة والإجابة عن سؤال استيعابي حول حب العمل.',
    skillsMeasured: ['الفهم القرائي المبكر', 'استخلاص العبرة الأخلاقية'],
    answerMethod: 'الإجابة عن السؤال المصور',
    parentInstructions: 'كانت النملة الصغيرة تحمل حبة قمح أكبر من جسمها بابتسامة وعزم.. ما الذي ساعدها؟ صبرها ونشاطها!',
    isAssessment: false,
    themeColor: 'orange',
    questions: [
      {
        id: 'q1',
        prompt: 'ماذا كانت النملة الصغيرة تحمل وتخزن لفصل الشتاء الممطر؟',
        visual: '🐜 🌾 🏠',
        options: [
          { id: 'grain', label: 'حبوب قمح مغذية', visual: '🌾', isCorrect: true },
          { id: 'ice', label: 'قطع من الثلج البارد', visual: '🧊', isCorrect: false }
        ],
        correctAnswer: 'grain'
      }
    ]
  },
  {
    id: 'ws-4-18',
    title: 'الاستعداد للقراءة: مطابقة أصوات الحروف الأولى (صوت البداية)',
    slug: 'beginning-sounds-phonemic-awareness',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'school_readiness',
    activityTypeLabel: 'الاستعداد للمدرسة',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متوسط',
    objective: 'عزل الصوت الأول في الكلمة المنطوقة وربطه بالحرف المكتوب (س = سمكة، ش = شمس).',
    skillsMeasured: ['الوعي الفونولوجي', 'عزل المقاطع الصوتية الأولى'],
    answerMethod: 'توصيل الحرف بالصورة التي يبدأ بصوتها',
    parentInstructions: 'انطق بوضوح: سسسسس.. سمكة! شششش.. شمس! دعه يلاحظ صوت البداية.',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل الحرف بالصورة التي تبدأ بنفس الصوت:',
        matchPairs: [
          { leftId: 'seen', leftLabel: 'حرف السين (س)', leftVisual: 'س', rightId: 'fish', rightLabel: 'سَمَكَة', rightVisual: '🐟' },
          { leftId: 'sheen', leftLabel: 'حرف الشين (ش)', leftVisual: 'ش', rightId: 'sun', rightLabel: 'شَمْس', rightVisual: '☀️' }
        ]
      }
    ]
  },
  {
    id: 'ws-4-19',
    title: 'تفكير منطقي: تحديد العلاقات والسبب والنتيجة',
    slug: 'cause-and-effect-logic-age4',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'logical_thinking',
    activityTypeLabel: 'التفكير المنطقي',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'ربط الحدث بالنتيجة المنطقية المترتبة عليه (السماء تمطر غزيراً ➔ الأرض تصبح موحلة والزهور ترتوي).',
    skillsMeasured: ['الاستدلال السببي', 'التفكير الاستنتاجي'],
    answerMethod: 'اختيار النتيجة الصحيحة للحدث الموضح',
    parentInstructions: 'إذا سكبنا الماء على التراب الجاف.. ماذا يحدث له؟ يصبح طيناً طرياً!',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'وضعت الأم كعكة لذيذة في الفرن الساخن.. ماذا سيحدث بعد قليل؟',
        options: [
          { id: 'bake', label: 'تصبح ناضجة وتفوح رائحتها الزكية', visual: '🎂 😋', isCorrect: true },
          { id: 'freeze', label: 'تتحول إلى قالب ثلج متجمد', visual: '🧊', isCorrect: false }
        ],
        correctAnswer: 'bake'
      }
    ]
  },
  {
    id: 'ws-4-20',
    title: 'توصيل الأضداد: فوق وتحت، داخل وخارج',
    slug: 'spatial-opposites-up-down-in-out',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'matching',
    activityTypeLabel: 'التوصيل',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متوسط',
    objective: 'استيعاب المفاهيم المكانية والأضداد (فوق الطاولة مقابل تحت الطاولة).',
    skillsMeasured: ['الإدراك المكاني', 'المفردات اللغوية المتقابلة'],
    answerMethod: 'توصيل كل صورة بنقيضها المباشر',
    parentInstructions: 'العصفور فوق الشجرة.. وأين يقف الأرنب؟ تحت الشجرة في الظل!',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل كل مفهوم بمفهومه المعاكس (الضد):',
        matchPairs: [
          { leftId: 'inside', leftLabel: 'القطة داخل الصندوق', leftVisual: '📦🐱', rightId: 'outside', rightLabel: 'القطة خارج الصندوق', rightVisual: '🐱📦' },
          { leftId: 'hot', leftLabel: 'شمس حارة جداً', leftVisual: '🔥', rightId: 'cold', rightLabel: 'رجل ثلج بارد', rightVisual: '⛄' }
        ]
      }
    ]
  },
  {
    id: 'ws-4-21',
    title: 'مقارنة الأعداد: من لديه حبات حلوى أكثر؟ (أكبر وأصغر)',
    slug: 'number-comparison-more-vs-less',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'counting_quantities',
    activityTypeLabel: 'العد والكميات',
    layoutType: 'number_grid',
    layoutLabel: 'شبكة أرقام وكميات',
    difficulty: 'متوسط',
    objective: 'مقارنة مجموعتين عدديتين وتحديد المجموعة الأكثر أو الأقل عدداً.',
    skillsMeasured: ['مفهوم المقارنة الكمية (أكثر من / أقل من)', 'العد والتقييم الحسابي'],
    answerMethod: 'اختيار الصحن الذي يحتوي على عدد أكبر',
    parentInstructions: 'عد الحبات في الصحن الأول ثم في الصحن الثاني.. أيهما فيه قطع أكثر؟',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'أي سلة تحتوي على عدد أكبر من الفراولة الشهية؟',
        options: [
          { id: 'five_strawberries', label: 'سلة بها ٥ فراولات (🍓🍓🍓🍓🍓)', visual: '🍓x5', isCorrect: true },
          { id: 'two_strawberries', label: 'سلة بها فراولتان فقط (🍓🍓)', visual: '🍓x2', isCorrect: false }
        ],
        correctAnswer: 'five_strawberries'
      }
    ]
  },
  {
    id: 'ws-4-22',
    title: 'تتبع الحروف الهجائية: حرفا الراء والزاي (ر - ز)',
    slug: 'tracing-letters-raa-zay',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'arabic_letters',
    activityTypeLabel: 'الحروف العربية',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'متوسط',
    objective: 'كتابة حرف الراء كزحليقة انسيابية وحرف الزاي بنقطته اللامعة.',
    skillsMeasured: ['الانسيابية في حركة اليد', 'التمييز بين الراء والزاي'],
    answerMethod: 'تتبع منحنى الحرف وتلوين الزهرة والرمانة',
    parentInstructions: 'تزحلق بالقلم من الأعلى إلى أسفل السطر مثل زحليقة الحديقة: ر.. رمان!',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'تتبع حرف الراء (ر) وحرف الزاي (ز) المنقطين ✏️',
        tracingPaths: [
          { label: 'حرف الراء', shape: 'letter', content: 'ر' },
          { label: 'حرف الزاي', shape: 'letter', content: 'ز' }
        ]
      }
    ]
  },
  {
    id: 'ws-4-23',
    title: 'تتبع الأشكال الهندسية المعقدة: المعين والنجمة',
    slug: 'tracing-diamond-and-star',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'line_tracing',
    activityTypeLabel: 'تتبع الخطوط',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'متوسط',
    objective: 'التدريب على رسم الخطوط المائلة ذات الزوايا الدقيقة (شكل المعين والنجمة).',
    skillsMeasured: ['الدقة الهندسية لليد', 'رسم الخطوط المائلة المتلاقية'],
    answerMethod: 'توصيل النقاط لتشكيل المعين والنجمة',
    parentInstructions: 'امشِ مع الخط المائل للأعلى ثم انحدر للأسفل بدقة!',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل النقاط لتشكل طائرة ورقية معينة ونجمة لامعة 🪁 ⭐',
        tracingPaths: [
          { label: 'شكل المعين (طائرة ورقية)', shape: 'zigzag' }
        ]
      }
    ]
  },
  {
    id: 'ws-4-24',
    title: 'دورة حياة الفراشة البديعة: من يرقة إلى فراشة تطير',
    slug: 'butterfly-life-cycle-science',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'science_nature',
    activityTypeLabel: 'العلوم والطبيعة',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'متوسط',
    objective: 'فهم مراحل التحول المذهلة: بيضة ➔ يرقة خضراء ➔ شرنقة ➔ فراشة تطير بأجنحة ملونة.',
    skillsMeasured: ['التحول الحيوي البيئي', 'التسلسل العلمي المتدرج'],
    answerMethod: 'ترتيب المراحل من ١ إلى ٤',
    parentInstructions: 'كانت بيضة صغيرة على ورقة شجر.. خرجت منها دودة لطيفة.. ثم نامت في شرنقة حتى أصبحت فراشة تطير في السماء!',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'رتب مراحل نمو الفراشة الرائعة:',
        sequenceSteps: [
          { id: 'egg', label: '١. بيضة صغيرة على ورقة النبات', visual: '🍃 🥚', order: 1 },
          { id: 'caterpillar', label: '٢. يرقة خضراء تأكل أوراق الشجر', visual: '🐛', order: 2 },
          { id: 'chrysalis', label: '٣. شرنقة نائمة ودافئة', visual: '🪵', order: 3 },
          { id: 'butterfly', label: '٤. فراشة بديعة تطير في البستان', visual: '🦋', order: 4 }
        ]
      }
    ]
  },
  {
    id: 'ws-4-25',
    title: 'الأمان في المنزل: ما الأدوات التي لا نلمسها وحدنا؟',
    slug: 'home-safety-hazard-awareness',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'life_skills',
    activityTypeLabel: 'المهارات الحياتية',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'توعية الطفل بعدم لمس الأدوات الحادة أو المقابس الكهربائية والحرارية دون إشراف الوالدين.',
    skillsMeasured: ['السلامة المنزلية والوقاية', 'الوعي بالمخاطر'],
    answerMethod: 'وضع علامة تحذير على الأدوات الخطيرة',
    parentInstructions: 'هل نلمس مقبس الكهرباء أو سكين المطبخ؟ أبداً! نطلب مساعدة ماما وبابا دائماً.',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'أي من هذه الأشياء خطيرة ويجب ألا نلمسها أبداً بمفردنا؟',
        options: [
          { id: 'outlet', label: 'مقبس الكهرباء والأسلاك المكشوفة', visual: '🔌 ⚡', isCorrect: true },
          { id: 'teddy', label: 'دبدوب القماش الآمن', visual: '🧸', isCorrect: false }
        ],
        correctAnswer: 'outlet'
      }
    ]
  },
  {
    id: 'ws-4-26',
    title: 'حكاية الدب الذي تعلم الاستئذان قبل أخذ الألعاب',
    slug: 'manners-asking-permission-story',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'picture_stories',
    activityTypeLabel: 'القصص المصورة',
    layoutType: 'comic_strip',
    layoutLabel: 'قصة مصورة متعددة المراحل',
    difficulty: 'متوسط',
    objective: 'غرس آداب الاستئذان واستخدام الكلمات المهذبة (من فضلك، شكراً).',
    skillsMeasured: ['الآداب الاجتماعية وحسن الخلق', 'التواصل اللفظي المهذب'],
    answerMethod: 'اختيار العبارة المؤدبة التي يقولها الطفل',
    parentInstructions: 'عندما نريد استعارة لعبة صديقنا.. ماذا نقول له بأدب؟ "من فضلك، هل يمكنني أن ألعب بها معك؟"',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'ما الكلمة اللطيفة والمهذبة التي نقولها عندما نطلب لعبة من صديقنا؟',
        options: [
          { id: 'please', label: '"من فضلك، هل تسمح لي بمشاركتك؟"', visual: '🌸 🤝', isCorrect: true },
          { id: 'snatch', label: 'أخطفها من يده وأركض بعيداً', visual: '❌', isCorrect: false }
        ],
        correctAnswer: 'please'
      }
    ]
  },
  {
    id: 'ws-4-27',
    title: 'لغز الظلال المعقدة: طابق الحيوان بشبح ظله بين التفاصيل',
    slug: 'complex-animal-shadows-matching',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'pair_matching',
    activityTypeLabel: 'المطابقة',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'مطابقة حيوانات ذات قرون وذيول مميزة بظلالها المتقاربة.',
    skillsMeasured: ['التمييز الإدراكي الدقيق', 'تجاهل المشتتات البصرية'],
    answerMethod: 'توصيل الحيوان بظله المتطابق',
    parentInstructions: 'انظر لقرون الغزال الطويلة.. أين الظل الذي يملك نفس القرون المتفرعة؟',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل الحيوان بظله الصحيح بدقة:',
        matchPairs: [
          { leftId: 'deer', leftLabel: 'غزال ذو قرون', leftVisual: '🦌', rightId: 'deer_shadow', rightLabel: 'ظل الغزال', rightVisual: '⚫🦌' },
          { leftId: 'camel', leftLabel: 'جمل بسنامين', leftVisual: '🐫', rightId: 'camel_shadow', rightLabel: 'ظل الجمل', rightVisual: '⚫🐫' }
        ]
      }
    ]
  },
  {
    id: 'ws-4-28',
    title: 'تلوين موجه: تلوين حديقة الحيوان وفق خريطة الأرقام',
    slug: 'directed-coloring-zoo-map',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'directed_coloring',
    activityTypeLabel: 'التلوين الموجه',
    layoutType: 'coloring_canvas',
    layoutLabel: 'ورقة تلوين',
    difficulty: 'متوسط',
    objective: 'الالتزام بمخطط تلوين متعدد الألوان (أصفر للزرافة، بني للقرد، رمادي للفيل).',
    skillsMeasured: ['اتباع التعليمات المركبة', 'التمييز بين كائنات متعددة في ورقة واحدة'],
    answerMethod: 'تلوين كل حيوان بلونه المخصص',
    parentInstructions: 'الزرافة باللون الأصفر مع بقع بنية، والقرد باللون البني اللطيف.',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'لوّن حيوانات الحديقة: الزرافة 🦒 بالأصفر، والقرد 🐒 بالبني، والبحيرة 🌊 بالأزرق.',
        visual: '🦒 🐒 🌊'
      }
    ]
  },
  {
    id: 'ws-4-29',
    title: 'الاستعداد للمدرسة: تمييز الكلمات التي تبدأ بنفس الصوت',
    slug: 'rhyme-and-alliteration-readiness',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'school_readiness',
    activityTypeLabel: 'الاستعداد للمدرسة',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'تحديد الكلمات التي تبدأ بنفس الصوت الفونيمي وملاحظة الإيقاع الصوتي.',
    skillsMeasured: ['الوعي الفونيمي المتقدم', 'تمييز القوافي البسيطة'],
    answerMethod: 'اختيار الكلمة التي تبدأ بنفس صوت الحرف المستهدف',
    parentInstructions: 'كلمة "بَطَّة" تبدأ بصوت (ب).. أي كلمة أخرى تبدأ بنفس الصوت؟ بَـ.. بَيْت أم قَـ.. قَلَم؟',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: 'أي كلمة تبدأ بنفس صوت كلمة (بَطَّة 🦆) بحرف الباء؟',
        options: [
          { id: 'bayt', label: 'بَيْت (ب)', visual: '🏠', isCorrect: true },
          { id: 'qalam', label: 'قَلَم (ق)', visual: '✏️', isCorrect: false }
        ],
        correctAnswer: 'bayt'
      }
    ]
  },
  {
    id: 'ws-4-30',
    title: 'اختبار تشخيصي متقدم لمرحلة ما قبل المدرسة (٤ - ٥ سنوات)',
    slug: 'preschool-development-assessment-age-4',
    ageGroup: '4-5',
    ageGroupLabel: 'من 4 سنوات إلى أقل من 5 سنوات',
    activityType: 'comprehensive_assessment',
    activityTypeLabel: 'اختبارات شاملة',
    layoutType: 'assessment_suite',
    layoutLabel: 'اختبار مصور متعدد الأنشطة',
    difficulty: 'متوسط',
    objective: 'تقييم شامل لمهارات الوعي الصوتي للحروف، العد حتى 10، حل الألغاز البصرية، وترتيب خطوات الحياة اليومية.',
    skillsMeasured: ['الوعي بالحروف الهجائية', 'العد والكميات 1-10', 'الترتيب المنطقي للأحداث', 'التمييز بين الحواس الخمس'],
    answerMethod: 'حل الطفل للأنشطة بمساعدة وتوجيه من ولي الأمر مع تسجيل النقاط',
    parentInstructions: 'هذا الاختبار يقيس مدى جاهزية طفلك لمرحلة التمهيدي المتقدم. شجعه وقدم له مكافأة معنوية عند الانتهاء!',
    isAssessment: true,
    assessmentGuide: {
      totalScore: 4,
      evaluationCriteria: [
        'يميز الحرف بصوته وصورته المقترنة',
        'يعد بدقة حتى 7 عناصر مصورة دون خطأ',
        'يرتب خطوات غسل اليدين أو نمو النبات',
        'يميز الحاسة المستخدمة لاكتشاف الشيء'
      ],
      answerKey: [
        'السؤال 1: الحرف ج (جمل)',
        'السؤال 2: الرقم ٦ (ست كرات)',
        'السؤال 3: السلوك الصحيح (وضع الدمى في الصندوق)',
        'السؤال 4: العين (لرؤية قوس قزح)'
      ],
      teacherNotes: 'الطفل في هذا العمر يبدأ بربط الأصوات بالرموز. لا نطلب منه تهجئة الكلمات بل تمييز صوت البداية.'
    },
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: '١. أي حرف يبدأ به اسم الجمل الصحراوي الصبور (جَمَل 🐪)؟',
        options: [
          { id: 'j', label: 'حرف الجيم (ج)', visual: 'ج', isCorrect: true },
          { id: 'd', label: 'حرف الدال (د)', visual: 'د', isCorrect: false }
        ],
        correctAnswer: 'j'
      },
      {
        id: 'q2',
        prompt: '٢. عد الكرات الرياضية الملونة: ⚽ ⚽ ⚽ ⚽ ⚽ ⚽',
        options: [
          { id: 'five', label: '٥', visual: '5️⃣', isCorrect: false },
          { id: 'six', label: '٦ (ست كرات)', visual: '6️⃣', isCorrect: true }
        ],
        correctAnswer: 'six'
      },
      {
        id: 'q3',
        prompt: '٣. ما السلوك الذي يعبر عن الترتيب والمسؤولية؟',
        options: [
          { id: 'organize', label: 'وضع الألعاب في مكانها المخصص بعد اللعب', visual: '📦', isCorrect: true },
          { id: 'mess', label: 'رمي الألعاب على الأرض', visual: '⚠️', isCorrect: false }
        ],
        correctAnswer: 'organize'
      },
      {
        id: 'q4',
        prompt: '٤. أي حاسة نستخدمها لرؤية ألوان قوس قزح الخلابة في السماء؟',
        options: [
          { id: 'eye', label: 'العين (حاسة البصر)', visual: '👁️', isCorrect: true },
          { id: 'ear', label: 'الأذن (حاسة السمع)', visual: '👂', isCorrect: false }
        ],
        correctAnswer: 'eye'
      }
    ]
  }
];
