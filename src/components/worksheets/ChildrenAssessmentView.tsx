import React, { useState } from 'react';
import {
  Printer,
  Download,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Eye,
  Check,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ComprehensiveAssessment, AssessmentSection } from '../../data/worksheets/assessmentsData';
import { sounds } from '../../lib/audio';

interface ChildrenAssessmentViewProps {
  assessment: ComprehensiveAssessment;
  onBack: () => void;
}

export const ChildrenAssessmentView: React.FC<ChildrenAssessmentViewProps> = ({
  assessment,
  onBack
}) => {
  // View mode: 'test_sheet' (ورقة الاختبار للطفل) | 'correction_guide' (دليل التصحيح المنفصل) | 'interactive' (الحل التفاعلي على الشاشة)
  const [viewMode, setViewMode] = useState<'test_sheet' | 'correction_guide' | 'interactive'>('test_sheet');

  // Interactive quiz answers
  const [interactiveAnswers, setInteractiveAnswers] = useState<Record<string, string>>({});
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [activeLeftPair, setActiveLeftPair] = useState<string | null>(null);
  const [completedSequences, setCompletedSequences] = useState<Record<string, number[]>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [earnedScore, setEarnedScore] = useState<number>(0);

  // Print handler
  const handlePrint = (target: 'test' | 'guide') => {
    sounds.playPop();
    const originalTitle = document.title;
    if (target === 'guide') {
      document.title = `دليل-تصحيح-${assessment.title}`;
      setViewMode('correction_guide');
    } else {
      document.title = `ورقة-اختبار-${assessment.title}`;
      setViewMode('test_sheet');
    }

    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 150);
  };

  // Download separate correction guide as formatted text/markdown
  const handleDownloadCorrectionGuide = () => {
    sounds.playPop();
    const guide = assessment.correctionGuide;

    let content = `========================================================================\n`;
    content += `      عالم الصغار (Little Stars) - دليل التصحيح وسلم التقدير المنفصل\n`;
    content += `========================================================================\n\n`;
    content += `اسم الاختبار: ${assessment.title}\n`;
    content += `الفئة العمرية المستهدفة: ${assessment.ageGroupLabel}\n`;
    content += `الدرجة الإجمالية للاختبار: ${assessment.totalPoints} درجات\n`;
    content += `المهارات المستهدفة:\n${assessment.targetSkills.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}\n\n`;

    content += `------------------------------------------------------------------------\n`;
    content += `١. إرشادات التقييم الحركي والشفهي للمربي:\n`;
    content += `------------------------------------------------------------------------\n`;
    content += `${assessment.oralMotorEvaluationGuide}\n\n`;
    content += `ضوابط التقييم المرن:\n`;
    guide.oralMotorRubric.forEach((r, i) => {
      content += `  - ${r}\n`;
    });
    content += `\n`;

    content += `------------------------------------------------------------------------\n`;
    content += `٢. مفتاح الإجابات النموذجية لكل نشاط:\n`;
    content += `------------------------------------------------------------------------\n`;
    guide.answerKeySummary.forEach((sec, idx) => {
      content += `\n[ ${sec.sectionTitle} ] (${sec.sectionType})\n`;
      sec.answers.forEach((ans, aIdx) => {
        content += `  س ${aIdx + 1}: ${ans.question}\n`;
        content += `    ✓ الإجابة الصحيحة: ${ans.correct} ${ans.visualAnswer ? `[ ${ans.visualAnswer} ]` : ''}\n`;
        content += `    ملاحظة التقدير: ${ans.note}\n`;
      });
    });

    content += `\n------------------------------------------------------------------------\n`;
    content += `٣. سلم التقدير وتوزيع الدرجات:\n`;
    content += `------------------------------------------------------------------------\n`;
    guide.scoringRubric.forEach((lvl) => {
      content += `• المستوى: ${lvl.level} (الدرجة: ${lvl.scoreRange} | ${lvl.percentage})\n`;
      content += `  الوصف: ${lvl.description}\n`;
      content += `  التوصية: ${lvl.recommendedAction}\n\n`;
    });

    content += `------------------------------------------------------------------------\n`;
    content += `٤. خطة الدعم والتوصيات التربوية:\n`;
    content += `------------------------------------------------------------------------\n`;
    guide.remedialRecommendations.forEach((rec, i) => {
      content += `  ${i + 1}. ${rec}\n`;
    });

    content += `\n========================================================================\n`;
    content += `تم التوليد بواسطة منصة عالم الصغار - حقوق الطبع محفوظة للاستخدام التعليمي\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `دليل-تصحيح-${assessment.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    sounds.playSuccess();
  };

  // Interactive option click
  const handleSelectInteractiveOption = (itemId: string, optionId: string, isCorrect?: boolean) => {
    setInteractiveAnswers((prev) => ({ ...prev, [itemId]: optionId }));
    if (isCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playPop();
    }
  };

  // Interactive matching
  const handleInteractiveMatch = (side: 'left' | 'right', id: string) => {
    sounds.playPop();
    if (side === 'left') {
      setActiveLeftPair(id);
    } else if (side === 'right' && activeLeftPair) {
      setMatchedPairs((prev) => ({ ...prev, [activeLeftPair]: id }));
      setActiveLeftPair(null);
      sounds.playSuccess();
    }
  };

  // Finish interactive quiz
  const handleCalculateScore = () => {
    let score = 0;
    assessment.sections.forEach((sec) => {
      sec.items.forEach((item) => {
        if (item.options) {
          const chosen = interactiveAnswers[item.id];
          const isCorrect = item.options.find((o) => o.id === chosen)?.isCorrect;
          if (isCorrect) score += sec.points / sec.items.length;
        } else if (item.matchPairs) {
          const allMatched = item.matchPairs.every((p) => matchedPairs[p.leftId] === p.rightId);
          if (allMatched) score += sec.points / sec.items.length;
        } else {
          score += sec.points / sec.items.length;
        }
      });
    });

    setEarnedScore(Math.round(score));
    setShowResults(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const resetInteractive = () => {
    setInteractiveAnswers({});
    setMatchedPairs({});
    setActiveLeftPair(null);
    setCompletedSequences({});
    setShowResults(false);
    setEarnedScore(0);
    sounds.playPop();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar (Hidden in print) */}
      <div className="print:hidden bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
              title="العودة للاختبارات"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {assessment.ageGroupLabel}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {assessment.totalPoints} درجات · {assessment.sections.length} أنشطة متنوعة
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">{assessment.title}</h2>
            </div>
          </div>

          {/* Primary View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center">
              <button
                onClick={() => {
                  sounds.playPop();
                  setViewMode('test_sheet');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'test_sheet'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>ورقة اختبار الطفل</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setViewMode('correction_guide');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'correction_guide'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-600" />
                <span>دليل التصحيح المنفصل</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setViewMode('interactive');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'interactive'
                    ? 'bg-white text-purple-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>حل تفاعلي على الشاشة</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>متوافق مع الطباعة الورقية A4 والملاحظة الشفهية والحركية</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Print test */}
            <button
              onClick={() => handlePrint('test')}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-3.5 rounded-xl transition shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة ورقة الاختبار</span>
            </button>

            {/* Print separate guide */}
            <button
              onClick={() => handlePrint('guide')}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3.5 rounded-xl transition shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة دليل التصحيح المنفصل</span>
            </button>

            {/* Download Guide TXT */}
            <button
              onClick={handleDownloadCorrectionGuide}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 px-3 rounded-xl transition"
              title="تنزيل دليل التصحيح وسلم الدرجات كملف نصي"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>تنزيل الدليل (TXT)</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: TEST SHEET (ورقة اختبار الطفل القابلة للطباعة)
         ========================================================================= */}
      {viewMode === 'test_sheet' && (
        <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-md p-6 sm:p-10 max-w-4xl mx-auto space-y-8 font-sans print:border-none print:shadow-none print:p-0 print:max-w-none">
          {/* Printable A4 Header */}
          <div className="border-b-2 border-slate-800 pb-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  منصة عالم الصغار · اختبار تشخيصي وتقييمي
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  {assessment.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">{assessment.subtitle}</p>
              </div>

              {/* Score Box */}
              <div className="text-center p-3 border-2 border-slate-800 rounded-2xl bg-amber-50/50 min-w-[130px]">
                <span className="text-[11px] font-bold text-slate-600 block">الدرجة الكلية</span>
                <span className="text-2xl font-black text-slate-900">___ / {assessment.totalPoints}</span>
                <div className="flex justify-center gap-0.5 mt-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            </div>

            {/* Student Info Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs font-bold border-t border-slate-200">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">اسم البطل الصغير:</span>
                <span className="text-slate-800">...........................</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">العمر:</span>
                <span className="text-slate-800">{assessment.ageGroupLabel}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">التاريخ:</span>
                <span className="text-slate-800">.... / .... / ٢٠٢...</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">المعلم / ولي الأمر:</span>
                <span className="text-slate-800">...........................</span>
              </div>
            </div>

            {/* Parent Warm Guidance Note */}
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">إرشاد تربوي للأهل والمعلمين:</strong>
                <span>{assessment.instructionsForParent}</span>
              </div>
            </div>
          </div>

          {/* Test Sections (Multi-Activity: Matching, Pair Matching, Multiple Choice, Odd-one-out, Counting, Sequencing) */}
          <div className="space-y-8">
            {assessment.sections.map((section, sIndex) => (
              <div
                key={section.id}
                className="p-5 rounded-2xl border-2 border-slate-200 bg-white space-y-4 print:border-slate-400 print:p-3"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                      {sIndex + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{section.title}</h3>
                      <p className="text-xs text-slate-500">{section.instructions}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    ({section.points} درجات)
                  </span>
                </div>

                {/* Section Content based on Type */}

                {/* 1. MATCHING ACTIVITY (توصيل بالأعمدة) */}
                {section.type === 'matching' && (
                  <div className="space-y-4 pt-2">
                    {section.items.map((item) => (
                      <div key={item.id} className="space-y-3">
                        <div className="text-xs font-bold text-slate-700">{item.prompt}</div>
                        {item.matchPairs && (
                          <div className="grid grid-cols-2 gap-8 py-2">
                            {/* Left Column */}
                            <div className="space-y-3">
                              {item.matchPairs.map((p) => (
                                <div
                                  key={p.leftId}
                                  className="p-3 rounded-xl border-2 border-slate-300 bg-slate-50/50 flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl">{p.leftVisual}</span>
                                    <span className="text-xs font-bold text-slate-800">{p.left}</span>
                                  </div>
                                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-800 bg-white" />
                                </div>
                              ))}
                            </div>

                            {/* Right Column (Shuffled visually for printing test) */}
                            <div className="space-y-3">
                              {item.matchPairs
                                .slice()
                                .reverse()
                                .map((p) => (
                                  <div
                                    key={p.rightId}
                                    className="p-3 rounded-xl border-2 border-slate-300 bg-slate-50/50 flex items-center justify-between"
                                  >
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-800 bg-white" />
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-800">{p.right}</span>
                                      <span className="text-2xl">{p.rightVisual}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. PAIR MATCHING / SHADOWS (مطابقة الصور والظلال) */}
                {section.type === 'pair_matching' && (
                  <div className="space-y-4 pt-2">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50/50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500">س{itemIdx + 1}:</span>
                          {item.visual && (
                            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center text-3xl shadow-xs">
                              {item.visual}
                            </div>
                          )}
                          <span className="text-xs font-bold text-slate-800">{item.prompt}</span>
                        </div>

                        {/* Options */}
                        {item.options && (
                          <div className="flex flex-wrap gap-2">
                            {item.options.map((opt) => (
                              <div
                                key={opt.id}
                                className="px-3 py-2 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center gap-2 cursor-pointer"
                              >
                                {opt.visual && <span className="text-xl">{opt.visual}</span>}
                                <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                                <div className="w-4 h-4 rounded-full border border-slate-400" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. MULTIPLE CHOICE / ILLUSTRATED QUESTIONS (أسئلة مصورة) */}
                {section.type === 'multiple_choice' && (
                  <div className="space-y-4 pt-2">
                    {section.items.map((item, qIdx) => (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-50/50 border border-slate-200 space-y-2">
                        <div className="text-xs font-bold text-slate-900">
                          س{qIdx + 1}. {item.prompt}
                        </div>
                        {item.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                            {item.options.map((opt) => (
                              <div
                                key={opt.id}
                                className="p-2.5 rounded-xl border-2 border-slate-300 bg-white flex items-center gap-2.5"
                              >
                                <div className="w-4 h-4 rounded-full border-2 border-slate-400 shrink-0" />
                                {opt.visual && <span className="text-2xl shrink-0">{opt.visual}</span>}
                                <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. ODD ONE OUT (اكتشف المختلف) */}
                {section.type === 'odd_one_out' && (
                  <div className="space-y-4 pt-2">
                    {section.items.map((item, idx) => (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-50/50 border border-slate-200 space-y-2">
                        <div className="text-xs font-bold text-slate-800">
                          المجموعة ({idx + 1}): {item.prompt}
                        </div>
                        {item.options && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                            {item.options.map((opt) => (
                              <div
                                key={opt.id}
                                className="p-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-center space-y-1.5"
                              >
                                <div className="text-3xl">{opt.visual}</div>
                                <div className="text-xs font-bold text-slate-700">{opt.label}</div>
                                <div className="w-4 h-4 rounded-full border border-slate-400 mx-auto" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. COUNTING & QUANTITIES (العد والكميات) */}
                {section.type === 'counting' && (
                  <div className="space-y-4 pt-2">
                    {section.items.map((item, cIdx) => (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-50/50 border border-slate-200 space-y-3">
                        <div className="text-xs font-bold text-slate-800">
                          س{cIdx + 1}: {item.prompt}
                        </div>
                        {item.options && (
                          <div className="flex flex-wrap items-center gap-3">
                            {item.options.map((opt) => (
                              <div
                                key={opt.id}
                                className="px-4 py-2 rounded-xl border-2 border-slate-300 bg-white flex items-center gap-2"
                              >
                                <div className="w-4 h-4 rounded-full border border-slate-400" />
                                <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                              </div>
                            ))}
                            <div className="mr-auto text-xs font-bold text-slate-500">
                              مربع كتابة الرقم: [ ______ ]
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 6. SEQUENCING & PATTERNS (الترتيب والأنماط) */}
                {section.type === 'sequencing' && (
                  <div className="space-y-4 pt-2">
                    {section.items.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-50/50 border border-slate-200 space-y-3">
                        <div className="text-xs font-bold text-slate-800">{item.prompt}</div>
                        {item.sequence && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {item.sequence.map((step) => (
                              <div
                                key={step.id}
                                className="p-3 rounded-xl border-2 border-slate-300 bg-white text-center space-y-2"
                              >
                                <div className="text-3xl">{step.visual}</div>
                                <div className="text-xs font-bold text-slate-700">{step.label}</div>
                                <div className="border border-slate-400 rounded-lg p-1 text-xs font-bold text-slate-400">
                                  الخطوة رقم: ( ____ )
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {item.options && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.options.map((opt) => (
                              <div
                                key={opt.id}
                                className="px-3 py-1.5 rounded-xl border-2 border-slate-300 bg-white flex items-center gap-2"
                              >
                                <div className="w-4 h-4 rounded-full border border-slate-400" />
                                {opt.visual && <span className="text-lg">{opt.visual}</span>}
                                <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 7. OBSERVATION CHECKLIST (بطاقة الملاحظة الشفهية والحركية) */}
                {section.type === 'observation_checklist' && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg">
                      📌 يُسجل المعلم أو ولي الأمر ملاحظته بناءً على إشارة الطفل أو نطقه دون إلزامه بالقلم.
                    </p>
                    <div className="space-y-2">
                      {section.items.map((item, obsIdx) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                        >
                          <span className="text-xs font-bold text-slate-800">
                            {obsIdx + 1}. {item.prompt}
                          </span>
                          <div className="flex items-center gap-3 shrink-0 text-xs font-bold">
                            <label className="flex items-center gap-1 text-emerald-700 cursor-pointer">
                              <input type="checkbox" className="rounded-sm" />
                              <span>متقن (⭐⭐)</span>
                            </label>
                            <label className="flex items-center gap-1 text-amber-700 cursor-pointer">
                              <input type="checkbox" className="rounded-sm" />
                              <span>قيد التطور (⭐)</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Printable Footer */}
          <div className="pt-6 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div>
              <span>منصة عالم الصغار - مرخصة للاستخدام المنزلي والمدرسي</span>
            </div>
            <div className="text-center font-bold text-slate-800">
              🌟 أحسنت يا بطل! كل محاولة تقربك من التميز والنجاح 🌟
            </div>
            <div>
              <span>صفحة ١ من ١</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: SEPARATE CORRECTION GUIDE & RUBRIC (دليل التصحيح المنفصل للأهل والمعلم)
         ========================================================================= */}
      {viewMode === 'correction_guide' && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-md p-6 sm:p-10 max-w-4xl mx-auto space-y-8 font-sans print:border-none print:shadow-none print:p-0 print:max-w-none">
          {/* Header */}
          <div className="border-b-2 border-emerald-800 pb-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  وثيقة إرشادية وتصحيحية مستقلة · خاص بولي الأمر والمعلم 📋
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  دليل التصحيح وسلم التقدير المنفصل: {assessment.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  الفئة: {assessment.ageGroupLabel} · الدرجة الكلية: {assessment.totalPoints} درجات
                </p>
              </div>

              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 block">
                  دليل مستقل للتحميل والطباعة
                </span>
              </div>
            </div>

            {/* Target Skills Pills */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-500 block mb-1.5">المهارات المستهدفة بالقياس:</span>
              <div className="flex flex-wrap gap-1.5">
                {assessment.targetSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 1: Answer Key Summary (مفتاح الإجابات النموذجية) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-lg border-b border-slate-200 pb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h2>١. مفتاح الإجابات النموذجية والتفسير التربوي</h2>
            </div>

            <div className="space-y-4">
              {assessment.correctionGuide.answerKeySummary.map((sec, idx) => (
                <div key={idx} className="bg-emerald-50/40 rounded-2xl border border-emerald-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {sec.sectionTitle}
                    </h3>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      نوع النشاط: {sec.sectionType}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead>
                        <tr className="border-b border-emerald-200 text-slate-600 font-bold">
                          <th className="py-2 px-3">السؤال / العنصر</th>
                          <th className="py-2 px-3">الإجابة النموذجية</th>
                          <th className="py-2 px-3">الملاحظة وطريقة احتساب الدرجة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-100 font-medium">
                        {sec.answers.map((ans, aIdx) => (
                          <tr key={aIdx} className="hover:bg-emerald-100/30">
                            <td className="py-2.5 px-3 font-bold text-slate-800">{ans.question}</td>
                            <td className="py-2.5 px-3 text-emerald-900 font-bold">
                              {ans.visualAnswer && <span className="ml-1 text-base">{ans.visualAnswer}</span>}
                              {ans.correct}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 text-[11px]">{ans.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Scoring Rubric (سلم التقدير وتوزيع المستويات) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-lg border-b border-slate-200 pb-2">
              <Award className="w-5 h-5 text-amber-600" />
              <h2>٢. سلم التقدير وتوزيع الدرجات ومستويات الإتقان</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assessment.correctionGuide.scoringRubric.map((rubric, rIdx) => (
                <div
                  key={rIdx}
                  className={`p-4 rounded-2xl border-2 space-y-2 ${
                    rIdx === 0
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : rIdx === 1
                      ? 'border-amber-300 bg-amber-50/50'
                      : 'border-sky-300 bg-sky-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{rubric.level}</span>
                    <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {rubric.scoreRange}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rubric.description}</p>
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 block">التوصية اللاحقة:</span>
                    <span className="text-xs font-bold text-slate-800">{rubric.recommendedAction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Oral & Motor Evaluation Guidelines (إرشادات التقييم الحركي والشفهي) */}
          <div className="space-y-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3>٣. ضوابط التقييم الحركي والشفهي (مراعاة الفروق العمرية دون ضغط)</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
              {assessment.correctionGuide.oralMotorRubric.map((r, i) => (
                <li key={i} className="leading-relaxed">
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Remedial Plan & Recommendations (خطة الدعم والتطوير) */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <h3>٤. مقترحات الأنشطة الداعمة من منصة عالم الصغار</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {assessment.correctionGuide.remedialRecommendations.map((rec, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Guide Footer */}
          <div className="pt-4 border-t border-slate-300 text-center text-xs text-slate-500">
            منصة عالم الصغار · دليل التصحيح التربوي المعتمد · قابل للحفظ والأرشفة للملف الإنمائي للطفل
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: INTERACTIVE SCREEN SOLVER (الحل التفاعلي للأطفال على الشاشة)
         ========================================================================= */}
      {viewMode === 'interactive' && (
        <div className="bg-white rounded-3xl border border-purple-200 shadow-md p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                وضع الحل التفاعلي الصوتي 🎮
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{assessment.title}</h2>
            </div>
            <button
              onClick={resetInteractive}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition text-xs font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة البدء</span>
            </button>
          </div>

          {/* Interactive Sections */}
          <div className="space-y-6">
            {assessment.sections.map((sec, sIdx) => (
              <div key={sec.id} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-purple-950">
                    النشاط {sIdx + 1}: {sec.title}
                  </h3>
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    {sec.typeLabel}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {sec.items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2">
                        {item.visual && <span className="text-2xl">{item.visual}</span>}
                        <span className="text-xs font-bold text-slate-800">{item.prompt}</span>
                      </div>

                      {/* Options */}
                      {item.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {item.options.map((opt) => {
                            const isSelected = interactiveAnswers[item.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleSelectInteractiveOption(item.id, opt.id, opt.isCorrect)}
                                className={`p-3 rounded-xl border-2 text-right transition flex items-center gap-2 ${
                                  isSelected
                                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold'
                                    : 'border-slate-200 hover:border-purple-300 bg-white text-slate-700'
                                }`}
                              >
                                {opt.visual && <span className="text-xl">{opt.visual}</span>}
                                <span className="text-xs">{opt.label}</span>
                                {isSelected && <Check className="w-4 h-4 text-purple-600 mr-auto" />}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Matching */}
                      {item.matchPairs && (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-slate-500 block">اختر من هنا:</span>
                            {item.matchPairs.map((p) => {
                              const isSelected = activeLeftPair === p.leftId;
                              const isMatched = !!matchedPairs[p.leftId];
                              return (
                                <button
                                  key={p.leftId}
                                  onClick={() => handleInteractiveMatch('left', p.leftId)}
                                  className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold transition flex items-center justify-between ${
                                    isSelected
                                      ? 'bg-amber-100 border-amber-500 text-amber-900'
                                      : isMatched
                                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                      : 'bg-white border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>
                                    {p.leftVisual} {p.left}
                                  </span>
                                  {isMatched && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                </button>
                              );
                            })}
                          </div>

                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-slate-500 block">وصله بما يناسبه هنا:</span>
                            {item.matchPairs
                              .slice()
                              .reverse()
                              .map((p) => {
                                const isMatchedToThis = Object.values(matchedPairs).includes(p.rightId);
                                return (
                                  <button
                                    key={p.rightId}
                                    onClick={() => handleInteractiveMatch('right', p.rightId)}
                                    className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold transition flex items-center justify-between ${
                                      isMatchedToThis
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                        : 'bg-white border-slate-200 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span>
                                      {p.rightVisual} {p.right}
                                    </span>
                                    {isMatchedToThis && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              بعد إجابة الطفل، اضغط على زر التقييم لاحتساب النتيجة والاحتفال بالنجوم.
            </span>
            <button
              onClick={handleCalculateScore}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-xs text-sm"
            >
              <Award className="w-5 h-5" />
              <span>احتساب نتيجة البطل والاحتفال 🌟</span>
            </button>
          </div>

          {/* Results Modal / Card */}
          {showResults && (
            <div className="p-6 rounded-3xl bg-linear-to-r from-amber-400 via-orange-400 to-amber-500 text-white text-center space-y-3 shadow-lg">
              <span className="text-4xl block">🎉 ⭐ 🏆</span>
              <h3 className="text-2xl font-black">أحسنت يا بطل عالم الصغار!</h3>
              <p className="text-sm font-bold text-amber-50">
                حققت نتيجة رائعة: {earnedScore} من {assessment.totalPoints} درجات!
              </p>
              <div className="flex justify-center gap-1 text-yellow-200 text-xl">
                ★★★★★
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
