import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  CheckCircle2,
  Trash2,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { AgeGroup } from '../../types/worksheet';
import {
  ComprehensiveAssessment,
  AssessmentSection,
  QUESTION_BANK,
  QuestionBankItem
} from '../../data/worksheets/assessmentsData';
import { sounds } from '../../lib/audio';

interface ChildrenAssessmentBuilderProps {
  onAssessmentCreated: (assessment: ComprehensiveAssessment) => void;
  onCancel: () => void;
}

export const ChildrenAssessmentBuilder: React.FC<ChildrenAssessmentBuilderProps> = ({
  onAssessmentCreated,
  onCancel
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('3-4');
  const [testTitle, setTestTitle] = useState<string>('اختبار المهارات المتكاملة المخصص');
  const [testSubtitle, setTestSubtitle] = useState<string>('اختبار متعدد الأنشطة يجمع بين التوصيل والمطابقة والأسئلة المصورة');

  // Selected Activity Types to include
  const [includedTypes, setIncludedTypes] = useState<Record<string, boolean>>({
    matching: true,
    pair_matching: true,
    multiple_choice: true,
    odd_one_out: true,
    counting: false,
    sequencing: false,
    observation_checklist: true
  });

  // Custom skills tags
  const [skills, setSkills] = useState<string[]>([
    'التمييز البصري والتركيز',
    'الربط المنطقي بين العناصر',
    'الاستجابة الحركية والشفهية'
  ]);
  const [newSkillText, setNewSkillText] = useState<string>('');

  // Preset suggestions
  const handleApplyPreset = (presetName: string) => {
    sounds.playPop();
    if (presetName === 'visual_focus') {
      setTestTitle('اختبار التركيز والمطابقة البصرية');
      setTestSubtitle('قياس دقة الملاحظة، إدراك الظلال، واكتشاف العنصر المختلف');
      setIncludedTypes({
        matching: true,
        pair_matching: true,
        multiple_choice: true,
        odd_one_out: true,
        counting: false,
        sequencing: false,
        observation_checklist: true
      });
      setSkills(['الملاحظة البصرية الدقيقة', 'تمييز الأشكال والظلال', 'اكتشاف المختلف']);
    } else if (presetName === 'math_logic') {
      setTestTitle('اختبار الوعي الرياضي والتفكير المنطقي');
      setTestSubtitle('قياس العد، مقارنة الكميات، إكمال الأنماط والتسلسل اليومي');
      setIncludedTypes({
        matching: true,
        pair_matching: false,
        multiple_choice: true,
        odd_one_out: false,
        counting: true,
        sequencing: true,
        observation_checklist: true
      });
      setSkills(['العد الحسي للكميات', 'إكمال الأنماط', 'المقارنة بين كبير وصغير']);
    } else if (presetName === 'school_ready') {
      setTestTitle('اختبار التهيئة الشاملة والاستعداد المكتبي');
      setTestSubtitle('فحص الحروف، الوعي الصوتي، المهارات الحياتية، واتباع التعليمات');
      setIncludedTypes({
        matching: true,
        pair_matching: true,
        multiple_choice: true,
        odd_one_out: true,
        counting: true,
        sequencing: true,
        observation_checklist: true
      });
      setSkills(['الوعي الصوتي بالحروف', 'الترتيب المنطقي', 'الانتباه واتباع التعليمات']);
    }
  };

  const handleToggleType = (typeKey: string) => {
    sounds.playPop();
    setIncludedTypes((prev) => ({ ...prev, [typeKey]: !prev[typeKey] }));
  };

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    sounds.playPop();
    setSkills((prev) => [...prev, newSkillText.trim()]);
    setNewSkillText('');
  };

  const handleRemoveSkill = (idx: number) => {
    sounds.playPop();
    setSkills((prev) => prev.filter((_, i) => i !== idx));
  };

  // Build the complete assessment object
  const handleGenerateAssessment = () => {
    sounds.playSuccess();

    // Map age label
    const ageLabels: Record<AgeGroup, string> = {
      '2-3': 'من سنتين إلى أقل من ٣ سنوات',
      '3-4': 'من ٣ سنوات إلى أقل من ٤ سنوات',
      '4-5': 'من ٤ سنوات إلى أقل من ٥ سنوات',
      '5-6': 'من ٥ سنوات إلى ٦ سنوات'
    };

    // Filter questions from bank or generate contextual questions
    const sections: AssessmentSection[] = [];
    let sectionCounter = 1;

    // 1. MATCHING SECTION
    if (includedTypes.matching) {
      sections.push({
        id: `custom-sec-${sectionCounter}`,
        type: 'matching',
        typeLabel: 'التوصيل',
        title: `النشاط ${sectionCounter}: التوصيل بين العناصر المرتبطة`,
        instructions: 'صل بين كل عنصر وما يناسبه في العمود المقابل بوضوح',
        points: 5,
        items: [
          {
            id: `item-m-${Date.now()}-1`,
            prompt: 'صل كل عنصر بقرينه المناسب في الطبيعة أو البيئة اليومية',
            correctAnswer: 'توصيل سليم ودقيق لجميع الأزواج',
            matchPairs:
              selectedAge === '2-3'
                ? [
                    { leftId: 'cl1', left: 'عصفور يغرد', leftVisual: '🐦', rightId: 'cr1', right: 'عش فوق الغصن', rightVisual: '🪹' },
                    { leftId: 'cl2', left: 'نحلة نشيطة', leftVisual: '🐝', rightId: 'cr2', right: 'خلية عسل لذيذ', rightVisual: '🍯' }
                  ]
                : [
                    { leftId: 'cl3', left: 'فرشاة الأسنان', leftVisual: '🪥', rightId: 'cr3', right: 'معجون الأسنان', rightVisual: '🧼' },
                    { leftId: 'cl4', left: 'قلم الرسم', leftVisual: '✏️', rightId: 'cr4', right: 'دفتر الرسم الأبيض', rightVisual: '📒' },
                    { leftId: 'cl5', left: 'المطر الغزير', leftVisual: '🌧️', rightId: 'cr5', right: 'المظلة الملونة', rightVisual: '☂️' }
                  ]
          }
        ]
      });
      sectionCounter++;
    }

    // 2. PAIR MATCHING SECTION
    if (includedTypes.pair_matching) {
      sections.push({
        id: `custom-sec-${sectionCounter}`,
        type: 'pair_matching',
        typeLabel: 'المطابقة البصرية والظلال',
        title: `النشاط ${sectionCounter}: مطابقة الصور والظلال`,
        instructions: 'ضع علامة أو أشر بإصبعك إلى الصورة التي تطابق النموذج تماماً',
        points: 5,
        items: [
          {
            id: `item-pm-${Date.now()}-1`,
            prompt: 'أي صورة من الخيارات تشبه الصورة النموذجية؟',
            visual: selectedAge === '2-3' ? '🧸' : '🚀',
            correctAnswer: selectedAge === '2-3' ? 'دبدوب الألعاب 🧸' : 'صاروخ الفضاء 🚀',
            explanation: 'مطابقة بصرية دقيقة',
            options: [
              { id: 'op1', label: selectedAge === '2-3' ? 'دبدوب 🧸' : 'صاروخ 🚀', visual: selectedAge === '2-3' ? '🧸' : '🚀', isCorrect: true },
              { id: 'op2', label: 'كرة ملونة ⚽', visual: '⚽', isCorrect: false },
              { id: 'op3', label: 'كتاب 📖', visual: '📖', isCorrect: false }
            ]
          }
        ]
      });
      sectionCounter++;
    }

    // 3. MULTIPLE CHOICE SECTION
    if (includedTypes.multiple_choice) {
      sections.push({
        id: `custom-sec-${sectionCounter}`,
        type: 'multiple_choice',
        typeLabel: 'الأسئلة المصورة',
        title: `النشاط ${sectionCounter}: الأسئلة المصورة والاختيار الذكي`,
        instructions: 'انظر جيداً إلى السؤال والصور، ثم ضع دائرة حول الإجابة الصحيحة',
        points: 5,
        items: [
          {
            id: `item-mc-${Date.now()}-1`,
            prompt: selectedAge === '2-3'
              ? 'أين الفاكهة الصفراء الحلوة التي يحبها القرد؟'
              : 'ما هو الشيء الذي نستخدمه لحماية رؤوسنا من حرارة الشمس في الصيف؟',
            correctAnswer: selectedAge === '2-3' ? 'الموزة 🍌' : 'القبعة الصيفية 👒',
            explanation: 'إدراك المفاهيم اليومية',
            options: selectedAge === '2-3'
              ? [
                  { id: 'mco-1', label: 'موز أصفر 🍌', visual: '🍌', isCorrect: true },
                  { id: 'mco-2', label: 'تفاحة حمراء 🍎', visual: '🍎', isCorrect: false }
                ]
              : [
                  { id: 'mco-3', label: 'قبعة صيفية 👒', visual: '👒', isCorrect: true },
                  { id: 'mco-4', label: 'معطف شتوي 🧥', visual: '🧥', isCorrect: false },
                  { id: 'mco-5', label: 'قفازات صوفية 🧤', visual: '🧤', isCorrect: false }
                ]
          }
        ]
      });
      sectionCounter++;
    }

    // 4. ODD ONE OUT SECTION
    if (includedTypes.odd_one_out) {
      sections.push({
        id: `custom-sec-${sectionCounter}`,
        type: 'odd_one_out',
        typeLabel: 'اكتشف المختلف',
        title: `النشاط ${sectionCounter}: اكتشاف العنصر الدخيل`,
        instructions: 'ضع علامة (X) على العنصر الذي لا ينتمي للمجموعة',
        points: 5,
        items: [
          {
            id: `item-od-${Date.now()}-1`,
            prompt: 'أي صورة من هذه الصور ليست من الحيوانات الأليفة؟',
            correctAnswer: 'الطائرة ✈️ (وسيلة نقل وليست كائناً حياً)',
            explanation: 'التصنيف والتمييز الفئوي',
            options: [
              { id: 'odd-1', label: 'خروف 🐑', visual: '🐑', isCorrect: false },
              { id: 'odd-2', label: 'طائرة ✈️', visual: '✈️', isCorrect: true },
              { id: 'odd-3', label: 'حصان 🐴', visual: '🐴', isCorrect: false }
            ]
          }
        ]
      });
      sectionCounter++;
    }

    // 5. COUNTING SECTION
    if (includedTypes.counting) {
      sections.push({
        id: `custom-sec-${sectionCounter}`,
        type: 'counting',
        typeLabel: 'العد والكميات',
        title: `النشاط ${sectionCounter}: عد العناصر والكميات`,
        instructions: 'عدّ العناصر بدقة ثم حدد الرقم الصحيح',
        points: 5,
        items: [
          {
            id: `item-cnt-${Date.now()}-1`,
            prompt: 'كم بالوناً ملوناً ترى في الصورة؟ 🎈 🎈 🎈 🎈',
            countTarget: 4,
            correctAnswer: '٤ (أربعة بالونات)',
            explanation: 'العد الصحيح للكميات',
            options: [
              { id: 'cnt-1', label: '٣', visual: '🎈🎈🎈', isCorrect: false },
              { id: 'cnt-2', label: '٤ (أربعة)', visual: '🎈🎈🎈🎈', isCorrect: true },
              { id: 'cnt-3', label: '٥', visual: '🎈🎈🎈🎈🎈', isCorrect: false }
            ]
          }
        ]
      });
      sectionCounter++;
    }

    // 6. SEQUENCING SECTION
    if (includedTypes.sequencing) {
      sections.push({
        id: `custom-sec-${sectionCounter}`,
        type: 'sequencing',
        typeLabel: 'ترتيب الأحداث والأنماط',
        title: `النشاط ${sectionCounter}: الترتيب المنطقي والتسلسل`,
        instructions: 'رتب الخطوات من البداية إلى النهاية بالأرقام (١، ٢، ٣)',
        points: 5,
        items: [
          {
            id: `item-sq-${Date.now()}-1`,
            prompt: 'رتب مراحل تناول الفاكهة اللذيذة: الغسل، التقشير، الأكل',
            correctAnswer: '١: غسل الفاكهة بالماء، ٢: تقشيرها بلطف، ٣: تناولها والحمد لله',
            sequence: [
              { id: 'seq-1', label: 'غسل الفاكهة بالماء النظيف', visual: '🍎💧', order: 1 },
              { id: 'seq-2', label: 'تقشير التفاحة وتقطيعها', visual: '🔪🍎', order: 2 },
              { id: 'seq-3', label: 'تناولها والاستمتاع بطعمها', visual: '😋', order: 3 }
            ]
          }
        ]
      });
      sectionCounter++;
    }

    // 7. OBSERVATION CHECKLIST
    if (includedTypes.observation_checklist) {
      sections.push({
        id: `custom-sec-${sectionCounter}`,
        type: 'observation_checklist',
        typeLabel: 'بطاقة الملاحظة الشفهية والحركية',
        title: `النشاط ${sectionCounter}: بطاقة الملاحظة الشفهية والتعبيرية للمربي`,
        instructions: 'يتحقق المعلم أو ولي الأمر من تفاعل الطفل الشفهي وحركة يده',
        points: 5,
        items: [
          {
            id: `item-obs-${Date.now()}-1`,
            prompt: 'يُبدي الطفل تركيزاً واهتماماً بالورقة ويشير بثقة دون تردد أو خوف',
            correctAnswer: 'متحقق بدرجة ممتازة',
            explanation: 'ملاحظة سلوكية وحركية'
          },
          {
            id: `item-obs-${Date.now()}-2`,
            prompt: 'يُعبّر الطفل شفهياً عن اسم عنصر واحد على الأقل بصوته الطبيعي',
            correctAnswer: 'متحقق بالكامل',
            explanation: 'ملاحظة التطور اللغوي'
          }
        ]
      });
    }

    const totalCalculatedPoints = sections.reduce((acc, sec) => acc + sec.points, 0);

    // Build the separate correction guide dynamically
    const dynamicCorrectionGuide = {
      overview: `دليل تصحيح مخصص تم توليده لاختبار "${testTitle}" للفئة العمرية (${ageLabels[selectedAge]}).`,
      answerKeySummary: sections.map((sec) => ({
        sectionTitle: sec.title,
        sectionType: sec.typeLabel,
        answers: sec.items.map((item) => ({
          question: item.prompt,
          correct: item.correctAnswer,
          note: `يُمنح الطفل كامل الدرجة (${sec.points / sec.items.length}) عند التحديد أو الإشارة الصائبة.`
        }))
      })),
      scoringRubric: [
        {
          level: 'إتقان استثنائي ومتميز (نجم عالم الصغار)',
          scoreRange: `${Math.round(totalCalculatedPoints * 0.9)} - ${totalCalculatedPoints} درجة`,
          percentage: '٩٠٪ - ١٠٠٪',
          description: 'الطفل يمتلك ثقة عالية في الإجابة ودقة ملاحظة فائقة.',
          recommendedAction: 'متابعة تشجيع الطفل بأوراق عمل متقدمة وإشراكه في تحديات التفكير والقصص المصورة.'
        },
        {
          level: 'أداء نمائي جيد جداً (مستكشف واعد)',
          scoreRange: `${Math.round(totalCalculatedPoints * 0.7)} - ${Math.round(totalCalculatedPoints * 0.89)} درجة`,
          percentage: '٧٠٪ - ٨٩٪',
          description: 'يجيب بشكل صحيح على أغلب الأنشطة مع تردد خفيف في بعض المفاهيم.',
          recommendedAction: 'تكرار النشاط بأسلوب ترفيهي ولعب الأدوار في المنزل.'
        },
        {
          level: 'يحتاج تشجيعاً ودعماً حسياً إضافياً',
          scoreRange: `أقل من ${Math.round(totalCalculatedPoints * 0.7)} درجة`,
          percentage: 'أقل من ٧٠٪',
          description: 'يحتاج الطفل إلى بيئة هادئة والمزيد من وقت التركيز مع التوجيه اللطيف.',
          recommendedAction: 'استخدام أوراق التلوين وتتبع الخطوط البسيطة لتثبيت المفاهيم.'
        }
      ],
      oralMotorRubric: [
        'قبول الإشارة بالإصبع أو اللمس كإجابة رسمية في جميع الأنشطة.',
        'عدم محاسبة الطفل على استقامة خط التوصيل طالما وصل بين العنصرين المقصودين.',
        'تشجيع الطفل وإعطاؤه استراحة قصيرة إذا لوحظ عليه التشتت أو التعب.'
      ],
      remedialRecommendations: [
        'تصفح أوراق العمل المماثلة من منصة عالم الصغار لنفس الفئة العمرية.',
        'تكرار أنشطة التوصيل والمطابقة باستخدام ألعاب وأشياء حقيقية ملموسة.',
        'تعزيز الثقة بالثناء على الجهد والمحاولة الإيجابية.'
      ]
    };

    const newAssessment: ComprehensiveAssessment = {
      id: `custom-assessment-${Date.now()}`,
      title: testTitle,
      subtitle: testSubtitle,
      ageGroup: selectedAge,
      ageGroupLabel: ageLabels[selectedAge],
      targetSkills: skills,
      instructionsForParent: 'قدم الاختبار لطفلك كلعبة تشويقية. دعه يكتشف الصور بحرية وسجل إجاباته بود وتشجيع مستمر.',
      oralMotorEvaluationGuide: 'يُعتمد على الإشارة باليد، النطق الشفهي، أو وضع علامة بأي قلم مفضل لدى الطفل.',
      totalPoints: totalCalculatedPoints,
      sections,
      correctionGuide: dynamicCorrectionGuide
    };

    onAssessmentCreated(newAssessment);
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200 shadow-md p-6 sm:p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>منشئ ومخصّص اختبارات الأطفال الذكي 🛠️</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            إنشاء اختبار متعدد الأنشطة مع دليل تصحيح مستقل
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            اختر الفئة العمرية ونوع الأنشطة المطلوبة (توصيل، مطابقة، أسئلة مصورة، عد، ترتيب) لإنشاء اختبار قابل للطباعة مصحوباً بدليل تصحيح منفصل بضغطة واحدة.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold self-start sm:self-center"
        >
          إلغاء والعودة
        </button>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-700 block">
          ⚡ قوالب تشخيصية مقترحة سريعة (جاهزة بنقرة واحدة):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleApplyPreset('visual_focus')}
            className="p-3.5 rounded-2xl border-2 border-amber-200 hover:border-amber-400 bg-amber-50/40 text-right space-y-1 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 group-hover:text-amber-800">
                اختبار التركيز والمطابقة البصرية
              </span>
              <span className="text-base">👁️</span>
            </div>
            <p className="text-[11px] text-slate-500">
              يجمع بين: المطابقة، الظلال، واكتشف المختلف، مع بطاقة الملاحظة.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('math_logic')}
            className="p-3.5 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 bg-emerald-50/40 text-right space-y-1 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800">
                اختبار الوعي الرياضي والتفكير المنطقي
              </span>
              <span className="text-base">🔢</span>
            </div>
            <p className="text-[11px] text-slate-500">
              يجمع بين: التوصيل، العد، إكمال الأنماط، ومقارنة الأحجام.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('school_ready')}
            className="p-3.5 rounded-2xl border-2 border-sky-200 hover:border-sky-400 bg-sky-50/40 text-right space-y-1 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-950 group-hover:text-sky-800">
                اختبار التهيئة الشاملة للمدرسة
              </span>
              <span className="text-base">🎒</span>
            </div>
            <p className="text-[11px] text-slate-500">
              يجمع كافة الأنشطة: الحروف، الأصوات، الترتيب، والعد.
            </p>
          </button>
        </div>
      </div>

      {/* Step 1: Age Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 block">
          ١. حدد الفئة العمرية المستهدفة للاختبار:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedAge('2-3')}
            className={`p-3 rounded-2xl border-2 transition text-center ${
              selectedAge === '2-3'
                ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="block text-sm">٢ - ٣ سنوات</span>
            <span className="text-[10px] text-slate-500">تمييز بصري وإشارة</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAge('3-4')}
            className={`p-3 rounded-2xl border-2 transition text-center ${
              selectedAge === '3-4'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="block text-sm">٣ - ٤ سنوات</span>
            <span className="text-[10px] text-slate-500">أشكال، ألوان وعد أولي</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAge('4-5')}
            className={`p-3 rounded-2xl border-2 transition text-center ${
              selectedAge === '4-5'
                ? 'border-sky-500 bg-sky-50 text-sky-950 shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="block text-sm">٤ - ٥ سنوات</span>
            <span className="text-[10px] text-slate-500">حروف، أنماط وكميات</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAge('5-6')}
            className={`p-3 rounded-2xl border-2 transition text-center ${
              selectedAge === '5-6'
                ? 'border-purple-500 bg-purple-50 text-purple-950 shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="block text-sm">٥ - ٦ سنوات</span>
            <span className="text-[10px] text-slate-500">تهيئة للمدرسة وأصوات</span>
          </button>
        </div>
      </div>

      {/* Step 2: Title and Subtitle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">عنوان الاختبار:</label>
          <input
            type="text"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            placeholder="مثال: اختبار الاستعداد اللغوي والملاحظة"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">وصف أو هدف فرعي:</label>
          <input
            type="text"
            value={testSubtitle}
            onChange={(e) => setTestSubtitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            placeholder="مثال: قياس التوصيل والمطابقة والأسئلة المصورة"
          />
        </div>
      </div>

      {/* Step 3: Select Activity Types to Combine */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 block">
            ٢. حدد أنواع الأنشطة المراد دمجها داخل ورقة الاختبار (متعدد الأنشطة):
          </label>
          <span className="text-[11px] text-slate-500">
            تم تفعيل{' '}
            <strong className="text-amber-700">
              {Object.values(includedTypes).filter(Boolean).length}
            </strong>{' '}
            أنشطة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Matching */}
          <div
            onClick={() => handleToggleType('matching')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
              includedTypes.matching
                ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🔗</span>
              <div>
                <span className="text-xs block">نشاط التوصيل بالأعمدة</span>
                <span className="text-[10px] text-slate-500 font-normal">توصيل حيوان بطعامه أو أداة بمهنة</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includedTypes.matching}
              onChange={() => {}}
              className="rounded-sm text-amber-600"
            />
          </div>

          {/* Pair Matching */}
          <div
            onClick={() => handleToggleType('pair_matching')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
              includedTypes.pair_matching
                ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎭</span>
              <div>
                <span className="text-xs block">المطابقة البصرية والظلال</span>
                <span className="text-[10px] text-slate-500 font-normal">مطابقة الصور المتشابهة أو الأشكال بظلها</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includedTypes.pair_matching}
              onChange={() => {}}
              className="rounded-sm text-amber-600"
            />
          </div>

          {/* Multiple Choice */}
          <div
            onClick={() => handleToggleType('multiple_choice')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
              includedTypes.multiple_choice
                ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🖼️</span>
              <div>
                <span className="text-xs block">الأسئلة المصورة والخيارات</span>
                <span className="text-[10px] text-slate-500 font-normal">سؤال مصور وبدائل مصورة كبيرة ومناسبة</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includedTypes.multiple_choice}
              onChange={() => {}}
              className="rounded-sm text-amber-600"
            />
          </div>

          {/* Odd One Out */}
          <div
            onClick={() => handleToggleType('odd_one_out')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
              includedTypes.odd_one_out
                ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🔍</span>
              <div>
                <span className="text-xs block">اكتشف المختلف (الدخيل)</span>
                <span className="text-[10px] text-slate-500 font-normal">استخراج العنصر الذي لا ينتمي للمجموعة</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includedTypes.odd_one_out}
              onChange={() => {}}
              className="rounded-sm text-amber-600"
            />
          </div>

          {/* Counting */}
          <div
            onClick={() => handleToggleType('counting')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
              includedTypes.counting
                ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🔢</span>
              <div>
                <span className="text-xs block">العد والكميات والأرقام</span>
                <span className="text-[10px] text-slate-500 font-normal">عد العناصر وكتابة أو اختيار الرقم</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includedTypes.counting}
              onChange={() => {}}
              className="rounded-sm text-amber-600"
            />
          </div>

          {/* Sequencing */}
          <div
            onClick={() => handleToggleType('sequencing')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
              includedTypes.sequencing
                ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🔄</span>
              <div>
                <span className="text-xs block">ترتيب الأحداث والأنماط</span>
                <span className="text-[10px] text-slate-500 font-normal">ترتيب خطوات مصورة أو إكمال نمط متكرر</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includedTypes.sequencing}
              onChange={() => {}}
              className="rounded-sm text-amber-600"
            />
          </div>

          {/* Observation Checklist */}
          <div
            onClick={() => handleToggleType('observation_checklist')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-3 ${
              includedTypes.observation_checklist
                ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📋</span>
              <div>
                <span className="text-xs block">بطاقة الملاحظة الشفهية والحركية (خاصة بالأهل والمعلم)</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  تسمح بتقييم استجابة ونطق وإشارة الطفل دون إجباره على الكتابة بالقلم
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includedTypes.observation_checklist}
              onChange={() => {}}
              className="rounded-sm text-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Step 4: Skills Measured */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 block">
          ٣. المهارات المستهدفة بالقياس في هذا الاختبار:
        </label>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, idx) => (
            <span
              key={idx}
              className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 border border-amber-300"
            >
              <span>{s}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(idx)}
                className="text-amber-700 hover:text-amber-950"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 max-w-md">
          <input
            type="text"
            value={newSkillText}
            onChange={(e) => setNewSkillText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            placeholder="أضف مهارة جديدة..."
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            إضافة
          </button>
        </div>
      </div>

      {/* Notice on Separate Correction Guide */}
      <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">دليل تصحيح منفصل ومستقل تلقائي:</strong>
          <span>
            عند الضغط على توليد الاختبار، سيقوم النظام تلقائياً بإنشاء ورقة الاختبار للطفل، وبشكل منفصل سيتم إعداد
            «دليل التصحيح وسلم التقدير» الذي يحتوي على مفتاح الإجابات، معايير التقييم الحركي والشفهي، وخطة الدعم،
            مع إمكانية طباعته أو تنزيله كملف نصي منفصل.
          </span>
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          إلغاء والعودة لقائمة الاختبارات
        </button>

        <button
          type="button"
          onClick={handleGenerateAssessment}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3.5 px-8 rounded-2xl transition shadow-md text-sm"
        >
          <Sparkles className="w-5 h-5" />
          <span>توليد ورقة الاختبار ودليل التصحيح فوراً 🚀</span>
        </button>
      </div>
    </div>
  );
};
