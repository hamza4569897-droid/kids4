import { Worksheet } from '../../types/worksheet';

export const worksheetsAge3to4: Worksheet[] = [
  {
    id: 'ws-3-01',
    title: 'تطابق الأشكال الهندسية الأساسية مع أشكال الحياة',
    slug: 'geometric-shapes-real-life-matching',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'matching',
    activityTypeLabel: 'التوصيل',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'مبتدئ',
    objective: 'ربط الشكل الهندسي المجرد (دائرة، مربع، مثلث) بأشياء واقعية في بيئة الطفل.',
    skillsMeasured: ['التمييز الشكلي الهندسي', 'الربط بالبيئة الواقعية', 'التآزر الحركي البصري'],
    answerMethod: 'توصيل كل شكل هندسي بالعنصر المماثل له',
    parentInstructions: 'اسأل طفلك: ما شكل شريحة البيتزا؟ وما شكل ساعة الحائط المدورة؟ وصلاها معاً!',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل كل شكل هندسي بالشيء الذي يشبهه تماماً:',
        matchPairs: [
          { leftId: 'circle', leftLabel: 'دائرة صفراء', leftVisual: '🟡', rightId: 'clock', rightLabel: 'ساعة حائط مدورة', rightVisual: '⏰' },
          { leftId: 'square', leftLabel: 'مربع أزرق', leftVisual: '🟦', rightId: 'gift', rightLabel: 'صندوق هدية مربع', rightVisual: '🎁' },
          { leftId: 'triangle', leftLabel: 'مثلث أحمر', leftVisual: '🔺', rightId: 'pizza', rightLabel: 'شريحة بيتزا مثلثة', rightVisual: '🍕' }
        ]
      }
    ]
  },
  {
    id: 'ws-3-02',
    title: 'توصيل الألوان المبهجة بعناصر الطبيعة',
    slug: 'nature-colors-matching-age3',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'matching',
    activityTypeLabel: 'التوصيل',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'مبتدئ',
    objective: 'تعزيز إدراك الألوان الأساسية والثانوية (أخضر، برتقالي، أزرق).',
    skillsMeasured: ['التمييز اللوني الموسع', 'المطابقة الإدراكية'],
    answerMethod: 'رسم خط توصيل بين بقعة اللون والعنصر الطبيعي',
    parentInstructions: 'أين نجد اللون الأخضر في الطبيعة؟ نعم، على أوراق الشجر!',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل اللون بما يناسبه في الطبيعة:',
        matchPairs: [
          { leftId: 'green', leftLabel: 'أخضر نضر', leftVisual: '🟢', rightId: 'leaf', rightLabel: 'ورقة شجر', rightVisual: '🍃' },
          { leftId: 'orange', leftLabel: 'برتقالي مشرق', leftVisual: '🟠', rightId: 'orange_fruit', rightLabel: 'حبة برتقال', rightVisual: '🍊' },
          { leftId: 'blue', leftLabel: 'أزرق هادئ', leftVisual: '🔵', rightId: 'water_drop', rightLabel: 'قطرة ماء صافية', rightVisual: '💧' }
        ]
      }
    ]
  },
  {
    id: 'ws-3-03',
    title: 'تصنيف الأطعمة الصحية مقابل الحلويات السكرية',
    slug: 'healthy-foods-vs-sweets-age3',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'categorization',
    activityTypeLabel: 'التصنيف',
    layoutType: 'classification_table',
    layoutLabel: 'جدول تصنيف',
    difficulty: 'متوسط',
    objective: 'تصنيف المأكولات إلى غذاء يقوي الجسم وحلويات نقلل منها لحماية الأسنان.',
    skillsMeasured: ['الوعي الصحي والغذائي', 'التصنيف الثنائي المتقدم'],
    answerMethod: 'تحديد الأطعمة الصحية بنجمة والحلويات بدائرة',
    parentInstructions: 'ما الذي يجعل عضلاتنا قوية وأسناننا بيضاء لامعة؟ الحليب والتفاح أم المصاصات؟',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'ضع إشارة صح بجانب الطعام الصحي الذي يبني أجسامنا بقوة:',
        options: [
          { id: 'milk', label: 'كوب حليب طازج', visual: '🥛', isCorrect: true },
          { id: 'apple', label: 'تفاحة حمراء', visual: '🍎', isCorrect: true },
          { id: 'candy', label: 'حلوى مصاص ملونة', visual: '🍭', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'ws-3-04',
    title: 'تصنيف وسائل النقل: في البر أم في البحر؟',
    slug: 'transportation-land-vs-water',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'categorization',
    activityTypeLabel: 'التصنيف',
    layoutType: 'classification_table',
    layoutLabel: 'جدول تصنيف',
    difficulty: 'متوسط',
    objective: 'التمييز بين المركبات التي تسير على الطريق وتلك التي تبحر فوق الأمواج.',
    skillsMeasured: ['المعرفة البيئية', 'التصنيف حسب بيئة الحركة'],
    answerMethod: 'تحديد مركبات الطريق وتوصيل السفن بالماء',
    parentInstructions: 'هل يمكن للسيارة أن تغوص في البحر؟ وأين تمشي السفينة الضخمة؟',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'أي من هذه المركبات تبحر في ماء البحر؟',
        options: [
          { id: 'boat', label: 'سفينة / قارب', visual: '🚢', isCorrect: true },
          { id: 'car', label: 'سيارة تسير في الشارع', visual: '🚗', isCorrect: false },
          { id: 'sailboat', label: 'مركب شراعي', visual: '⛵', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'ws-3-05',
    title: 'اكتشف المختلف: طائر وسط حيوانات تمشي',
    slug: 'odd-one-out-flying-bird',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'odd_one_out',
    activityTypeLabel: 'اكتشف المختلف',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'تحليل الخصائص الحركية واكتشاف الكائن الذي يطير بأجنحة بين كائنات تمشي بأربع أرجل.',
    skillsMeasured: ['التحليل المنطقي الأولي', 'استبعاد العنصر الشاذ'],
    answerMethod: 'وضع دائرة حول من يستطيع الطيران في السماء',
    parentInstructions: 'الخروف يمشي، والبقرة تمشي.. لكن صديقنا هنا يرفرف بجناحيه عالياً!',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'من الكائن المختلف الذي يطير بجناحيه في الهواء؟',
        options: [
          { id: 'sheep', label: 'خروف أليف', visual: '🐑', isCorrect: false },
          { id: 'bird', label: 'عصفور يطير', visual: '🦅', isCorrect: true },
          { id: 'cow', label: 'بقرة في الحقل', visual: '🐄', isCorrect: false }
        ],
        correctAnswer: 'bird'
      }
    ]
  },
  {
    id: 'ws-3-06',
    title: 'مقارنة الأحجام: أيهما كبير وأيهما صغير؟',
    slug: 'big-vs-small-comparison-age3',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'odd_one_out',
    activityTypeLabel: 'اكتشف المختلف',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'مبتدئ',
    objective: 'إدراك مفهوم الحجم النسبي (كبير جداً مقابل صغير ولطيف).',
    skillsMeasured: ['المقارنة البصرية للأحجام', 'المفاهيم المكانية والكمية'],
    answerMethod: 'اختيار الحيوان الكبير ذي الحجم الضخم',
    parentInstructions: 'انظر إلى الفيل الضخم.. وقارنه بالفأر الصغير الحجم! أيهما الأكبر؟',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'اختر الحيوان الكبير جداً (الضخم):',
        options: [
          { id: 'elephant', label: 'فيل ضخم كبير', visual: '🐘', isCorrect: true },
          { id: 'mouse', label: 'فأر صغير الحجم', visual: '🐭', isCorrect: false }
        ],
        correctAnswer: 'elephant'
      },
      {
        id: 'q2',
        prompt: 'اختر الشيء الصغير اللطيف:',
        options: [
          { id: 'ant', label: 'نملة صغيرة', visual: '🐜', isCorrect: true },
          { id: 'truck', label: 'شاحنة نقل كبيرة', visual: '🚛', isCorrect: false }
        ],
        correctAnswer: 'ant'
      }
    ]
  },
  {
    id: 'ws-3-07',
    title: 'إكمال نمط الأشكال المزدوج (دائرة - مربع - دائرة)',
    slug: 'pattern-shapes-circle-square',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'complete_pattern',
    activityTypeLabel: 'أكمل النمط',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'متوسط',
    objective: 'تحديد العنصر المفقود في نمط هندسي منتظم.',
    skillsMeasured: ['التفكير الاستقرائي البسيط', 'متابعة المتتاليات البصرية'],
    answerMethod: 'اختيار الشكل الهندسي الذي يأتي في الفراغ',
    parentInstructions: 'دائرة.. مربع.. دائرة.. مربع.. ما الشكل الذي نضعه تالياً؟',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: '🟡 🟦 🟡 🟦 ... ما الشكل المناسب لإكمال هذا الصف الجميل؟',
        options: [
          { id: 'circle', label: 'دائرة صفراء', visual: '🟡', isCorrect: true },
          { id: 'triangle', label: 'مثلث أحمر', visual: '🔺', isCorrect: false }
        ],
        correctAnswer: 'circle'
      }
    ]
  },
  {
    id: 'ws-3-08',
    title: 'نمط فواكه الحديقة (تفاحة - موزة - تفاحة)',
    slug: 'fruit-pattern-apple-banana',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'complete_pattern',
    activityTypeLabel: 'أكمل النمط',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'متوسط',
    objective: 'تطبيق التفكير النمطي على فواكه ملموسة يحبها الطفل.',
    skillsMeasured: ['الملاحظة والتوقع', 'التسلسل البصري'],
    answerMethod: 'وضع علامة على الفاكهة الصحيحة في نهاية الصف',
    parentInstructions: 'تفاحة حمراء.. موزة صفراء.. تفاحة حمراء.. حان دور من الآن؟',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: '🍎 🍌 🍎 🍌 ... ماذا تأكل اللعبة اللطيفة الآن؟',
        options: [
          { id: 'apple', label: 'تفاحة حمراء', visual: '🍎', isCorrect: true },
          { id: 'watermelon', label: 'بطيخ كبير', visual: '🍉', isCorrect: false }
        ],
        correctAnswer: 'apple'
      }
    ]
  },
  {
    id: 'ws-3-09',
    title: 'مزرعة الأرقام: التعرف على الأرقام من ١ إلى ٣',
    slug: 'numbers-farm-one-to-three',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'counting_quantities',
    activityTypeLabel: 'العد والكميات',
    layoutType: 'number_grid',
    layoutLabel: 'شبكة أرقام وكميات',
    difficulty: 'متوسط',
    objective: 'الربط الأكيد بين الرموز المكتوبة (١، ٢، ٣) والكميات المصورة المقابلة.',
    skillsMeasured: ['التعرف على الأرقام 1-3', 'العد الإفرادي المتطابق'],
    answerMethod: 'توصيل كل مجموعة بالرقم المكتوب المطابق',
    parentInstructions: 'عد الأزهار مع طفلك بالإصبع ثم صِلها بالرقم العربي الصحيح.',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل كل مجموعة فراشات وزهور برقمها الصحيح:',
        matchPairs: [
          { leftId: 'one_sun', leftLabel: 'شمس واحدة (☀️)', leftVisual: '☀️', rightId: 'num1', rightLabel: 'الرقم واحد (١)', rightVisual: '1️⃣' },
          { leftId: 'two_flowers', leftLabel: 'زهرتان (🌸🌸)', leftVisual: '🌸🌸', rightId: 'num2', rightLabel: 'الرقم اثنان (٢)', rightVisual: '2️⃣' },
          { leftId: 'three_bees', leftLabel: 'ثلاث نحلات (🐝🐝🐝)', leftVisual: '🐝🐝🐝', rightId: 'num3', rightLabel: 'الرقم ثلاثة (٣)', rightVisual: '3️⃣' }
        ]
      }
    ]
  },
  {
    id: 'ws-3-10',
    title: 'عد حتى ٥: كم بالوناً ملوناً في السماء؟',
    slug: 'counting-balloons-up-to-five',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'counting_quantities',
    activityTypeLabel: 'العد والكميات',
    layoutType: 'number_grid',
    layoutLabel: 'شبكة أرقام وكميات',
    difficulty: 'متوسط',
    objective: 'تنمية مهارة العد حتى 5 عناصر ملونة دون تكرار أو إغفال.',
    skillsMeasured: ['العد التسلسلي 1-5', 'الإحاطة بالكميات'],
    answerMethod: 'عد البالونات واختيار الرقم الصحيح',
    parentInstructions: 'المس كل بالون بالدور: واحد، اثنان، ثلاثة، أربعة، خمسة!',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'عد البالونات الملونة التي تطير في الهواء: 🎈 🎈 🎈 🎈',
        visual: '🎈 🎈 🎈 🎈',
        options: [
          { id: 'three', label: '٣ بالونات', visual: '3️⃣', isCorrect: false },
          { id: 'four', label: '٤ بالونات', visual: '4️⃣', isCorrect: true },
          { id: 'five', label: '٥ بالونات', visual: '5️⃣', isCorrect: false }
        ],
        correctAnswer: 'four'
      }
    ]
  },
  {
    id: 'ws-3-11',
    title: 'حرف التاء (ت) والتفاحة اللذيذة',
    slug: 'arabic-letter-taa-apple',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'arabic_letters',
    activityTypeLabel: 'الحروف العربية',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'متوسط',
    objective: 'التعرف على حرف التاء بنقطتيه الاثنتين كعينين مبتسمتين.',
    skillsMeasured: ['التمييز البصري لحرف التاء', 'الربط بالصوت والكلمة'],
    answerMethod: 'تلوين النقطتين وتتبع مسار الحرف',
    parentInstructions: 'حرف التاء له نقطتان جميلتان في الأعلى، مثل عينين ضاحكتين! ت.. تفاحة!',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'ت.. تُفَّاحَة! أين حرف التاء الذي يحمل نقطتين في قلبه؟',
        options: [
          { id: 't', label: 'ت (تفاحة)', visual: 'ت', isCorrect: true },
          { id: 'b', label: 'ب (بطة)', visual: 'ب', isCorrect: false }
        ],
        correctAnswer: 't'
      }
    ]
  },
  {
    id: 'ws-3-12',
    title: 'حرف الثاء (ث) وثعلب الصحراء الذكي',
    slug: 'arabic-letter-thaa-fox',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'arabic_letters',
    activityTypeLabel: 'الحروف العربية',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'التعرف على حرف الثاء بنقاطه الثلاث وصوته اللثوي اللطيف.',
    skillsMeasured: ['النطق الصحيح لحرف الثاء', 'التمييز بين ب وت وث'],
    answerMethod: 'عد النقاط الثلاث والإشارة إلى الثعلب',
    parentInstructions: 'أخرج طرف لسانك برقة وقل: ث.. ثعلب.. كم نقطة فوق حرف الثاء؟ ثلاث نقاط!',
    isAssessment: false,
    themeColor: 'orange',
    questions: [
      {
        id: 'q1',
        prompt: 'كم نقطة تزيّن تاج حرف الثاء (ث)؟',
        options: [
          { id: 'three_dots', label: '٣ نقاط في الأعلى', visual: 'ث', isCorrect: true },
          { id: 'one_dot', label: 'نقطة واحدة فقط', visual: 'ب', isCorrect: false }
        ],
        correctAnswer: 'three_dots'
      }
    ]
  },
  {
    id: 'ws-3-13',
    title: 'Letter C for Cat (قطة تموء)',
    slug: 'letter-c-for-cat-age3',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'english_letters',
    activityTypeLabel: 'الحروف الإنجليزية',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'ربط الحرف C بصوت القط وكلمة Cat وتتبع القوس المفتوح.',
    skillsMeasured: ['التعرف على C كقوس نصف دائري', 'المفردات الصوتية الإنجليزية'],
    answerMethod: 'تتبع الحرف C ونطق الكلمة',
    parentInstructions: 'Curve your finger like letter C and meow like a cute cat!',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'Letter C is for Cat! Which one is the fluffy cat? 🐱',
        options: [
          { id: 'cat', label: 'Cat (C)', visual: '🐱', isCorrect: true },
          { id: 'dog', label: 'Dog (D)', visual: '🐶', isCorrect: false }
        ],
        correctAnswer: 'cat'
      }
    ]
  },
  {
    id: 'ws-3-14',
    title: 'Letter D for Duck (بطة صفراء)',
    slug: 'letter-d-for-duck-age3',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'english_letters',
    activityTypeLabel: 'الحروف الإنجليزية',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'التعرف على شكل الحرف D وصوته مع كلمة Duck.',
    skillsMeasured: ['التمييز البصري للحرف D', 'الصوتيات التمهيدية'],
    answerMethod: 'اختيار الحرف D المطابق للبطة',
    parentInstructions: 'Say: D is for Duck! Quack, quack, quack!',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'D is for Duck! Find letter D:',
        options: [
          { id: 'd', label: 'Letter D', visual: '🦆 D', isCorrect: true },
          { id: 'a', label: 'Letter A', visual: '🍎 A', isCorrect: false }
        ],
        correctAnswer: 'd'
      }
    ]
  },
  {
    id: 'ws-3-15',
    title: 'متاهة حديقة الفراشات إلى زهرة التوليب',
    slug: 'butterfly-tulip-short-maze',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'mazes',
    activityTypeLabel: 'المتاهات',
    layoutType: 'maze_path',
    layoutLabel: 'مسار متاهة',
    difficulty: 'متوسط',
    objective: 'حل متاهة بسيطة ذات مسار واحد وتفرع خادع قصير.',
    skillsMeasured: ['التفكير التخطيطي الأولي', 'التآزر الحركي البصري'],
    answerMethod: 'رسم خط بالقلم داخل ممر الحديقة',
    parentInstructions: 'إذا وصلنا لطريق مغلق بالحجارة، نرجع ونمشي في الطريق المفتوح حتى الزهرة!',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'ساعِد الفراشة الملونة 🦋 على تجنب الحائط الحجري والوصول إلى الزهرة 🌷',
        visual: '🦋 ➔ [ممر حديقة مفتوح] ➔ 🌷'
      }
    ]
  },
  {
    id: 'ws-3-16',
    title: 'متاهة سيارة الإطفاء إلى مكان الحريق البسيط',
    slug: 'firetruck-water-hose-maze',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'mazes',
    activityTypeLabel: 'المتاهات',
    layoutType: 'maze_path',
    layoutLabel: 'مسار متاهة',
    difficulty: 'متوسط',
    objective: 'متابعة الطريق السريع لسيارة الإطفاء الشجاعة.',
    skillsMeasured: ['الانتباه للمسارات', 'مفهوم مساعدة الآخرين'],
    answerMethod: 'تتبع الطريق بالقلم الملون',
    parentInstructions: 'سيارة الإطفاء تطلق صفارتها: وي يو وي يو! لنساعدها في اختيار الطريق الصحيح.',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'قد سيارة الإطفاء 🚒 عبر الشارع الخالي حتى تصل إلى خزان الماء 💧',
        visual: '🚒 ═════🛣️═════ 💧'
      }
    ]
  },
  {
    id: 'ws-3-17',
    title: 'تلوين موجه: قوس قزح بألوانه الثلاثة الأساسية',
    slug: 'rainbow-three-stripes-coloring',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'directed_coloring',
    activityTypeLabel: 'التلوين الموجه',
    layoutType: 'coloring_canvas',
    layoutLabel: 'ورقة تلوين',
    difficulty: 'متوسط',
    objective: 'تلوين ثلاثة أقواس محددة وفق ألوان موجهة (أحمر، أصفر، أزرق).',
    skillsMeasured: ['اتباع التعليمات متعددة الخطوات', 'التحكم في مساحة القوس'],
    answerMethod: 'تلوين كل قوس بلونه المخصص',
    parentInstructions: 'القوس الأول بالأحمر، القوس الثاني بالأصفر، والقوس الثالث بالأزرق السماوي!',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'لوّن أقواس قوس قزح: الأحمر في الأعلى، ثم الأصفر، ثم الأزرق 🌈',
        visual: '🌈'
      }
    ]
  },
  {
    id: 'ws-3-18',
    title: 'تلوين السمكة الذهبية داخل الحوض الزجاجي',
    slug: 'golden-fish-aquarium-coloring',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'directed_coloring',
    activityTypeLabel: 'التلوين الموجه',
    layoutType: 'coloring_canvas',
    layoutLabel: 'ورقة تلوين',
    difficulty: 'متوسط',
    objective: 'تلوين بطن السمكة بالبرتقالي وفقاعات الهواء بالأزرق الفاتح.',
    skillsMeasured: ['التحكم الحركي الدقيق', 'تنسيق الألوان المستقلة'],
    answerMethod: 'تلوين السمكة والفقاعات بالأقلوان المحددة',
    parentInstructions: 'اجعل السمكة تبتسم بلونها البرتقالي المبهج والفقاعات تسبح نحو الأعلى.',
    isAssessment: false,
    themeColor: 'orange',
    questions: [
      {
        id: 'q1',
        prompt: 'لوّن السمكة بالبرتقالي 🐟 وفقاعات الماء بالأزرق الصافي 🫧',
        visual: '🐟 🫧'
      }
    ]
  },
  {
    id: 'ws-3-19',
    title: 'تتبع الخطوط المتعرجة (زجزاج): قفزات الضفدع الصغير',
    slug: 'zigzag-frog-hops-tracing',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'line_tracing',
    activityTypeLabel: 'تتبع الخطوط',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'متوسط',
    objective: 'التدريب على تغيير اتجاه القلم في زوايا حادة ومائلة (خطوط الزجزاج).',
    skillsMeasured: ['المرونة الحركية وتغيير زاوية القلم', 'الاستعداد للكتابة'],
    answerMethod: 'تتبع خطوط القفزات المنقطة صعوداً وهبوطاً',
    parentInstructions: 'الضفدع يقفز للأعلى ثم للأسفل: فوق، تحت، فوق، تحت! ارسم القفزات معاً.',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'تتبع قفزات الضفدع المنقطة: 🐸 ⋀⋁⋀⋁ 🪷',
        tracingPaths: [
          { label: 'خط زجزاج متعرج', shape: 'zigzag' }
        ]
      }
    ]
  },
  {
    id: 'ws-3-20',
    title: 'تتبع الدوائر والمنحنيات: عجلات السيارة وحلزون الرمال',
    slug: 'circle-tracing-car-wheels',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'line_tracing',
    activityTypeLabel: 'تتبع الخطوط',
    layoutType: 'tracing_sheet',
    layoutLabel: 'صفحة تتبع حروف',
    difficulty: 'متوسط',
    objective: 'إغلاق الدائرة الحركية برسم مسارات دائرية كاملة تبدأ وتنتهي عند نفس النقطة.',
    skillsMeasured: ['التحكم الدوراني لمعصم اليد', 'الإغلاق الشكلي المحكم'],
    answerMethod: 'رسم الدوائر المنقطة لعجلات السيارة',
    parentInstructions: 'ابدأ من النقطة الخضراء ودر بالقلم حتى تعود إليها مجدداً!',
    isAssessment: false,
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: 'ارسم عجلات السيارة الدائرية عبر تتبع النقاط الدائرية 🚗 ⭕ ⭕',
        tracingPaths: [
          { label: 'مسار دائري كامل', shape: 'circle' }
        ]
      }
    ]
  },
  {
    id: 'ws-3-21',
    title: 'اكتشف 3 فروق لطيفة بين صورتي الحديقة',
    slug: 'three-differences-garden-puzzle',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'visual_puzzles',
    activityTypeLabel: 'الألغاز البصرية',
    layoutType: 'visual_puzzle',
    layoutLabel: 'أحجية بصرية',
    difficulty: 'متوسط',
    objective: 'المقارنة الفاحصة بين مشهدين متجاورين واكتشاف عنصر مفقود بسيط.',
    skillsMeasured: ['قوة الملاحظة البصرية', 'المسح الإدراكي للصورة'],
    answerMethod: 'وضع دائرة على الاختلاف المكتشف',
    parentInstructions: 'انظر للصورة الأولى، ثم الصورة الثانية.. هل ترى الفراشة التي طارت واختفت؟',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'ما الشيء الذي يظهر في الصورة الأولى ويغيب في الثانية؟',
        options: [
          { id: 'sun_missing', label: 'الشمس المبتسمة في السماء', visual: '☀️', isCorrect: true },
          { id: 'tree_same', label: 'الشجرة الكبيرة (موجودة)', visual: '🌳', isCorrect: false }
        ],
        correctAnswer: 'sun_missing'
      }
    ]
  },
  {
    id: 'ws-3-22',
    title: 'أحجية نصف التفاحة والبرتقالة: طابق الشطرين',
    slug: 'half-fruits-matching-puzzle',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'visual_puzzles',
    activityTypeLabel: 'الألغاز البصرية',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متوسط',
    objective: 'إدراك الجزء والكل عبر جمع نصفي الفاكهة المقسومة.',
    skillsMeasured: ['إدراك العلاقة بين الجزء والكل', 'الإكمال الهندسي الطبيعي'],
    answerMethod: 'توصيل نصف الفاكهة بنصفها الآخر المكمل',
    parentInstructions: 'قطعنا التفاحة بالسكين لنصفين.. أين النصف الذي يكمل هذه التفاحة؟',
    isAssessment: false,
    themeColor: 'rose',
    questions: [
      {
        id: 'q1',
        prompt: 'صِل كل نصف فاكهة بنصفه التوأم المكمل له:',
        matchPairs: [
          { leftId: 'apple_left', leftLabel: 'نصف تفاحة', leftVisual: '🍎', rightId: 'apple_right', rightLabel: 'النصف المكمل للتفاحة', rightVisual: '🍎' },
          { leftId: 'lemon_left', leftLabel: 'نصف ليمونة', leftVisual: '🍋', rightId: 'lemon_right', rightLabel: 'النصف المكمل لليمونة', rightVisual: '🍋' }
        ]
      }
    ]
  },
  {
    id: 'ws-3-23',
    title: 'ترتيب خطوات زراعة بذرة الزهرة في الأصيص',
    slug: 'planting-seed-event-sequence',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'event_sequencing',
    activityTypeLabel: 'ترتيب الأحداث',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'متوسط',
    objective: 'فهم تسلسل خطوات زراعة النبات: نضع البذرة، نسقيها بالماء، فتكبر زهرة مشرقة.',
    skillsMeasured: ['الترتيب الزمني المنطقي (أولاً ثم أخيراً)', 'استيعاب دورات الطبيعة'],
    answerMethod: 'ترتيب الصور من ١ إلى ٣',
    parentInstructions: 'ماذا نفعل أولاً لكي تنمو الوردة؟ نضع البذرة في التراب ثم نسقيها بالماء!',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'رتب خطوات نمو الزهرة الجميلة من البداية حتى النهاية:',
        sequenceSteps: [
          { id: 's1', label: '١. نغرس البذرة في التربة', visual: '🌱', order: 1 },
          { id: 's2', label: '٢. نسقيها بمرش الماء', visual: '🪴💧', order: 2 },
          { id: 's3', label: '٣. تتفتح زهرة حمراء ملونة', visual: '🌸', order: 3 }
        ]
      }
    ]
  },
  {
    id: 'ws-3-24',
    title: 'أجزاء النبتة الصغيرة: الجذور والساق والورقة',
    slug: 'plant-parts-roots-stem-leaf',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'science_nature',
    activityTypeLabel: 'العلوم والطبيعة',
    layoutType: 'matching_board',
    layoutLabel: 'لوحة مطابقة بالصور',
    difficulty: 'متوسط',
    objective: 'التعرف المبدئي على الأجزاء البسيطة للنبات ووظيفة كل جزء.',
    skillsMeasured: ['الاستكشاف العلمي التمهيدي', 'المفردات البيولوجية المبسطة'],
    answerMethod: 'الإشارة إلى الجذور تحت التراب والساق والورقة الخضراء',
    parentInstructions: 'أين تختبئ الجذور التي تشرب الماء؟ تحت التراب الداكن! وأين الأوراق الخضراء؟',
    isAssessment: false,
    themeColor: 'emerald',
    questions: [
      {
        id: 'q1',
        prompt: 'أشر إلى جزء النبتة الذي يشرب الماء من داخل التربة:',
        options: [
          { id: 'roots', label: 'الجذور تحت التراب', visual: '🪴', isCorrect: true },
          { id: 'flower', label: 'البتلات الملونة', visual: '🌷', isCorrect: false }
        ],
        correctAnswer: 'roots'
      }
    ]
  },
  {
    id: 'ws-3-25',
    title: 'مهاراتي الحياتية: غسل اليدين بالماء والصابون',
    slug: 'handwashing-steps-life-skills',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'life_skills',
    activityTypeLabel: 'المهارات الحياتية',
    layoutType: 'sequence_strip',
    layoutLabel: 'تسلسل أفقي أو رأسي',
    difficulty: 'متوسط',
    objective: 'إتقان روتين غسل اليدين بعد اللعب وقبل تناول الطعام للقضاء على الجراثيم.',
    skillsMeasured: ['العادات الصحية والوقائية', 'النظافة والاستقلالية الشخصية'],
    answerMethod: 'تحديد أدوات غسل اليدين الصحيحة',
    parentInstructions: 'نفتح الصنبور، نضع الصابون ونفرك حتى تخرج رغوة كثيرة تغسل كل الأوساخ!',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'ماذا نستخدم لغسل أيدينا قبل تناول الطعام؟',
        options: [
          { id: 'soap', label: 'الماء والصابون النظيف', visual: '🧼', isCorrect: true },
          { id: 'sand', label: 'الرمل والأتربة', visual: '🏖️', isCorrect: false }
        ],
        correctAnswer: 'soap'
      }
    ]
  },
  {
    id: 'ws-3-26',
    title: 'تحديد المشاعر: متى يشعر صديقنا بالفرح أو الخوف؟',
    slug: 'emotions-scared-surprised-happy',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'emotions',
    activityTypeLabel: 'المشاعر',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'التعرف على مشاعر المفاجأة والخوف عند سماع صوت رعد قوي.',
    skillsMeasured: ['التسمية العاطفية', 'التعاطف الوجداني'],
    answerMethod: 'اختيار الوجه المعبر عن الموقف',
    parentInstructions: 'عندما انطفأ النور فجأة شعر الأرنب بالخوف.. أي وجه يظهر مشاعر الخوف؟',
    isAssessment: false,
    themeColor: 'amber',
    questions: [
      {
        id: 'q1',
        prompt: 'أي وجه يعبر عن الخوف عند سماع صوت مفاجئ؟',
        options: [
          { id: 'scared', label: 'وجه خائف يتطلع بحذر', visual: '😨', isCorrect: true },
          { id: 'happy', label: 'وجه يضحك بمرح', visual: '😄', isCorrect: false }
        ],
        correctAnswer: 'scared'
      }
    ]
  },
  {
    id: 'ws-3-27',
    title: 'قصة مصورة: القطة الصغيرة والكرة الصوفية',
    slug: 'kitten-and-yarn-ball-story',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'picture_stories',
    activityTypeLabel: 'القصص المصورة',
    layoutType: 'comic_strip',
    layoutLabel: 'قصة مصورة متعددة المراحل',
    difficulty: 'متوسط',
    objective: 'استيعاب أحداث قصة قصيرة متسلسلة واستنتاج نهاية القصة.',
    skillsMeasured: ['الاستيعاب السمعي البصري', 'الاستنتاج السببي'],
    answerMethod: 'اختيار اللعبة التي دحرجتها القطة',
    parentInstructions: 'رأت القطة كرة صوف ملونة.. دحرجتها بأقدامها فتدحرجت تحت الأريكة ولحقت بها!',
    isAssessment: false,
    themeColor: 'purple',
    questions: [
      {
        id: 'q1',
        prompt: 'بماذا كانت القطة الصغيرة تلعب بمرح وسرور؟',
        visual: '🐱 🧶 🛋️',
        options: [
          { id: 'yarn', label: 'كرة صوف ناعمة', visual: '🧶', isCorrect: true },
          { id: 'book', label: 'كتاب كبير', visual: '📖', isCorrect: false }
        ],
        correctAnswer: 'yarn'
      }
    ]
  },
  {
    id: 'ws-3-28',
    title: 'الاستعداد للروضة: حقيبتي المدرسية وأدواتي',
    slug: 'school-readiness-backpack-items',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'school_readiness',
    activityTypeLabel: 'الاستعداد للمدرسة',
    layoutType: 'scene_discovery',
    layoutLabel: 'مشهد كبير يحتوي على عناصر مطلوب اكتشافها',
    difficulty: 'متوسط',
    objective: 'التعرف على الأدوات التي نضعها في حقيبة الروضة مقابل ما نتركه بالمنزل.',
    skillsMeasured: ['الاستعداد النفسي للروضة', 'تنظيم المقتنيات الشخصية'],
    answerMethod: 'وضع إشارة على ما يوضع داخل الحقيبة',
    parentInstructions: 'غداً نذهب للروضة لنلعب ونتعلم! ما الذي نضعه في الحقيبة؟ زجاجة الماء ودفتر التلوين!',
    isAssessment: false,
    themeColor: 'teal',
    questions: [
      {
        id: 'q1',
        prompt: 'ماذا تضع في حقيبتك الصغيرة عندما تذهب إلى الروضة؟',
        options: [
          { id: 'crayons', label: 'ألوان شمعية ودفتر رسم', visual: '🖍️', isCorrect: true },
          { id: 'water', label: 'زجاجة ماء نظيفة', visual: '🧃', isCorrect: true },
          { id: 'pan', label: 'مقلاة طهي الطعام', visual: '🍳', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'ws-3-29',
    title: 'تفكير منطقي: ما الشيء الذي لا يمكن أن يكون مبللاً؟',
    slug: 'logical-thinking-what-cannot-be-wet',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'logical_thinking',
    activityTypeLabel: 'التفكير المنطقي',
    layoutType: 'card_grid',
    layoutLabel: 'شبكة بطاقات',
    difficulty: 'متوسط',
    objective: 'تطوير التفكير المنطقي المبكر عبر استنتاج الخصائص الفيزيائية البسيطة.',
    skillsMeasured: ['التفكير الاستنتاجي', 'إدراك العلاقات بين الأشياء'],
    answerMethod: 'اختيار الشيء الذي يحمينا من المطر',
    parentInstructions: 'عندما تمطر السماء، ما الذي نفتحه فوق رؤوسنا لنبقى جافين؟',
    isAssessment: false,
    themeColor: 'sky',
    questions: [
      {
        id: 'q1',
        prompt: 'ما الذي نفتحه فوقنا في المطر لنحمي رؤوسنا وملابسنا من البلل؟',
        options: [
          { id: 'umbrella', label: 'المظلة الملونة', visual: '☂️', isCorrect: true },
          { id: 'sponge', label: 'الإسفنجة التي تمتص الماء', visual: '🧽', isCorrect: false }
        ],
        correctAnswer: 'umbrella'
      }
    ]
  },
  {
    id: 'ws-3-30',
    title: 'اختبار تشخيصي متكامل لمرحلة الروضة الأولى (٣ - ٤ سنوات)',
    slug: 'kindergarten-readiness-assessment-age-3',
    ageGroup: '3-4',
    ageGroupLabel: 'من 3 سنوات إلى أقل من 4 سنوات',
    activityType: 'comprehensive_assessment',
    activityTypeLabel: 'اختبارات شاملة',
    layoutType: 'assessment_suite',
    layoutLabel: 'اختبار مصور متعدد الأنشطة',
    difficulty: 'متوسط',
    objective: 'تقييم مهارات الأشكال، تمييز الألوان، العد حتى 5، والتمييز بين الكبير والصغير.',
    skillsMeasured: ['الاستيعاب المفاهيمي', 'العد 1-5', 'التمييز الشكلي', 'التفكير المنطقي'],
    answerMethod: 'إجابة الطفل شفهياً أو بالإشارة وقيام ولي الأمر بتسجيل النتيجة',
    parentInstructions: 'قدم هذا الاختبار كلعبة نجوم مشجعة. لكل إجابة صحيحة ضع له نجمة ذهبية ملونة!',
    isAssessment: true,
    assessmentGuide: {
      totalScore: 4,
      evaluationCriteria: [
        'يسمي الأشكال الأساسية (دائرة، مربع، مثلث)',
        'يعد حتى 4 عناصر مصورة بدقة',
        'يميز الحجم النسبي (أكبر من وأصغر من)',
        'يكمل نمطاً بسيطاً من عنصرين'
      ],
      answerKey: [
        'السؤال 1: المثلث (🔺)',
        'السؤال 2: 4 تفاحات',
        'السؤال 3: الفيل (الأكبر)',
        'السؤال 4: المربع الأزرق (🟦)'
      ],
      teacherNotes: 'إذا أخطأ الطفل في العد، دعه يمسك بيده 4 ألعاب حقيقية لتجسيد المفهوم حسياً.'
    },
    themeColor: 'indigo',
    questions: [
      {
        id: 'q1',
        prompt: '١. أي من هذه الأشكال هو المثلث ذو الزوايا الثلاث؟',
        options: [
          { id: 'tri', label: 'مثلث', visual: '🔺', isCorrect: true },
          { id: 'sqr', label: 'مربع', visual: '🟦', isCorrect: false }
        ],
        correctAnswer: 'tri'
      },
      {
        id: 'q2',
        prompt: '٢. كم تفاحة تراها هنا في السلة؟ 🍎 🍎 🍎 🍎',
        options: [
          { id: 'three', label: '٣', visual: '3️⃣', isCorrect: false },
          { id: 'four', label: '٤', visual: '4️⃣', isCorrect: true }
        ],
        correctAnswer: 'four'
      },
      {
        id: 'q3',
        prompt: '٣. من الحيوان الأكبر حجماً بين هذين الاثنين؟',
        options: [
          { id: 'eleph', label: 'فيل', visual: '🐘', isCorrect: true },
          { id: 'cat', label: 'قطة', visual: '🐱', isCorrect: false }
        ],
        correctAnswer: 'eleph'
      },
      {
        id: 'q4',
        prompt: '٤. أكمل النمط: 🟡 🟦 🟡 ... ما الذي يأتي الآن؟',
        options: [
          { id: 'sq', label: 'مربع أزرق', visual: '🟦', isCorrect: true },
          { id: 'cir', label: 'دائرة صفراء', visual: '🟡', isCorrect: false }
        ],
        correctAnswer: 'sq'
      }
    ]
  }
];
