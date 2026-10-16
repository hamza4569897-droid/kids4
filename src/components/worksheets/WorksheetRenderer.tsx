import React, { useState } from 'react';
import {
  Printer,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Worksheet, WorksheetQuestionItem } from '../../types/worksheet';
import { sounds } from '../../lib/audio';

interface WorksheetRendererProps {
  worksheet: Worksheet;
  mode: 'preview' | 'interactive';
  onClose?: () => void;
  onPrint?: () => void;
}

export const WorksheetRenderer: React.FC<WorksheetRendererProps> = ({
  worksheet,
  mode: initialMode,
  onClose,
  onPrint
}) => {
  const [activeMode, setActiveMode] = useState<'preview' | 'interactive'>(initialMode);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);

  // Interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [activeMatchingLeft, setActiveMatchingLeft] = useState<string | null>(null);
  const [completedMatches, setCompletedMatches] = useState<Record<string, string>>({});
  const [interactiveScore, setInteractiveScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Handle option selection
  const handleSelectOption = (questionId: string, optionId: string, isCorrect?: boolean) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    if (isCorrect) {
      sounds.playSuccess();
      setInteractiveScore((prev) => prev + 1);

      // Check if all questions are answered correctly
      const newAnswers = { ...selectedAnswers, [questionId]: optionId };
      const allCorrect = worksheet.questions.every((q) => {
        if (!q.options) return true;
        const ans = newAnswers[q.id];
        return q.options.find((o) => o.id === ans)?.isCorrect;
      });

      if (allCorrect) {
        setIsCompleted(true);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    } else {
      sounds.playPop();
    }
  };

  // Handle matching pairs
  const handleMatchClick = (side: 'left' | 'right', id: string) => {
    sounds.playPop();
    if (side === 'left') {
      setActiveMatchingLeft(id);
    } else if (side === 'right' && activeMatchingLeft) {
      // Connect pair
      setCompletedMatches((prev) => ({ ...prev, [activeMatchingLeft]: id }));
      setActiveMatchingLeft(null);
      sounds.playSuccess();
    }
  };

  const handleResetInteractive = () => {
    setSelectedAnswers({});
    setActiveMatchingLeft(null);
    setCompletedMatches({});
    setInteractiveScore(0);
    setIsCompleted(false);
    sounds.playPop();
  };

  const handlePrint = () => {
    sounds.playPop();
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar (Hidden in print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="العودة للقائمة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-slate-900">{worksheet.title}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{worksheet.ageGroupLabel}</span>
              <span>·</span>
              <span>{worksheet.activityTypeLabel}</span>
              <span>·</span>
              <span>{worksheet.layoutLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeMode === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              جاهزة للطباعة 🖨️
            </button>
            <button
              onClick={() => setActiveMode('interactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeMode === 'interactive'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              حل تفاعلي 🎮
            </button>
          </div>

          {activeMode === 'interactive' && (
            <button
              onClick={handleResetInteractive}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition text-xs font-bold flex items-center gap-1 border border-slate-200"
              title="إعادة تعيين النشاط"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">إعادة</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الورقة (A4)</span>
          </button>
        </div>
      </div>

      {/* Completion Banner (Interactive mode) */}
      {activeMode === 'interactive' && isCompleted && (
        <div className="print:hidden bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
              ⭐
            </div>
            <div>
              <h4 className="text-base font-bold text-emerald-900">أحسنت صنعاً يا بطل! تم إكمال الورقة بنجاح 🌟</h4>
              <p className="text-xs text-emerald-700">لقد أجبت بذكاء وإتقان رائعين على هذا النشاط.</p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition"
          >
            اطبع شهادتك الآن
          </button>
        </div>
      )}

      {/* Printable Sheet Frame (Standard A4 ratio) */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-10 max-w-3xl mx-auto shadow-md print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:rounded-none">
        {/* Worksheet Header: Title, Student info, Date */}
        <header className="border-b-2 border-slate-800 pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">⭐</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  عالم الصغار — Little Stars
                </h1>
                <p className="text-[11px] text-slate-500">
                  {worksheet.title} · {worksheet.ageGroupLabel}
                </p>
              </div>
            </div>

            <div className="text-left text-xs text-slate-500">
              <div className="border border-slate-300 rounded-lg px-3 py-1 font-mono text-[10px] bg-slate-50">
                A4 Printable
              </div>
            </div>
          </div>

          {/* Student Name & Date Lines */}
          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <span>اسم الطفل البطل:</span>
              <span className="inline-block w-44 border-b-2 border-dotted border-slate-400"></span>
            </div>
            <div className="flex items-center gap-2">
              <span>التاريخ:</span>
              <span className="inline-block w-24 border-b-2 border-dotted border-slate-400"></span>
            </div>
            <div className="flex items-center gap-1 text-amber-500 text-sm">
              <span>التقييم:</span>
              <span>☆☆☆</span>
            </div>
          </div>
        </header>

        {/* Objective & Parent Instructions Banner */}
        <section className="mb-6 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-1.5 print:bg-slate-50 print:border-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
            <span>الهدف التعليمي:</span>
            <span className="font-normal text-slate-700">{worksheet.objective}</span>
          </div>
          <div className="flex items-start gap-1.5 text-slate-600">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">إرشادات ولي الأمر: </strong>
              {worksheet.parentInstructions}
            </span>
          </div>
        </section>

        {/* Dynamic Exercise Body (Renders based on layout and questions) */}
        <main className="space-y-8 min-h-[380px]">
          {worksheet.questions.map((question, qIdx) => (
            <div key={question.id} className="space-y-4">
              {/* Question Prompt */}
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {qIdx + 1}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {question.prompt}
                </h3>
              </div>

              {/* Render Type 1: Matching Pairs */}
              {question.matchPairs && (
                <div className="border border-slate-300 rounded-2xl p-6 bg-white space-y-4">
                  <div className="grid grid-cols-2 gap-8 items-center max-w-lg mx-auto">
                    {/* Left Column */}
                    <div className="space-y-3">
                      {question.matchPairs.map((pair) => {
                        const isMatched = !!completedMatches[pair.leftId];
                        const isSelected = activeMatchingLeft === pair.leftId;

                        return (
                          <button
                            key={pair.leftId}
                            onClick={() => handleMatchClick('left', pair.leftId)}
                            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition text-right ${
                              isMatched
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                : isSelected
                                ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300'
                                : 'bg-slate-50 border-slate-300 hover:border-slate-400'
                            }`}
                          >
                            <span className="text-3xl">{pair.leftVisual}</span>
                            <span className="text-xs font-bold text-slate-800">{pair.leftLabel}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      {question.matchPairs.map((pair) => {
                        const isMatched = Object.values(completedMatches).includes(pair.rightId);

                        return (
                          <button
                            key={pair.rightId}
                            onClick={() => handleMatchClick('right', pair.rightId)}
                            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition text-right ${
                              isMatched
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                : activeMatchingLeft
                                ? 'bg-amber-50/50 border-amber-300 hover:bg-amber-100'
                                : 'bg-slate-50 border-slate-300'
                            }`}
                          >
                            <span className="text-3xl">{pair.rightVisual}</span>
                            <span className="text-xs font-bold text-slate-800">{pair.rightLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Render Type 2: Options Grid (Odd one out / Multiple Choice / Patterns) */}
              {question.options && !question.matchPairs && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {question.options.map((option) => {
                    const isSelected = selectedAnswers[question.id] === option.id;
                    const showCorrectStatus = isSelected && option.isCorrect;
                    const showWrongStatus = isSelected && !option.isCorrect;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(question.id, option.id, option.isCorrect)}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition text-center relative ${
                          showCorrectStatus
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300'
                            : showWrongStatus
                            ? 'bg-rose-50 border-rose-400 text-rose-900'
                            : 'bg-white border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {option.visual && (
                          <span className="text-4xl select-none filter drop-shadow-xs">
                            {option.visual}
                          </span>
                        )}
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {option.label}
                        </span>

                        {showCorrectStatus && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute top-2 right-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Render Type 3: Tracing Paths */}
              {question.tracingPaths && (
                <div className="border-2 border-dashed border-slate-400 rounded-2xl p-8 bg-slate-50 text-center space-y-4">
                  <div className="text-xs font-bold text-slate-500 mb-2">
                    تتبع النقاط بالقلم بهدوء ودقة باتجاه الأسهم ✏️
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-8 py-4">
                    {question.tracingPaths.map((tp, idx) => (
                      <div
                        key={idx}
                        className="p-6 bg-white border-2 border-slate-300 rounded-2xl flex flex-col items-center gap-3 min-w-[140px]"
                      >
                        <div className="text-7xl font-mono font-black text-slate-700 tracking-widest select-none border-b-2 border-dashed border-slate-300 pb-2">
                          {tp.content || '···'}
                        </div>
                        <span className="text-xs text-slate-600 font-medium">{tp.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Render Type 4: Sequence Steps */}
              {question.sequenceSteps && (
                <div className="border border-slate-300 rounded-2xl p-6 bg-white space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {question.sequenceSteps.map((step) => (
                      <div
                        key={step.id}
                        className="border-2 border-slate-200 rounded-xl p-4 flex flex-col items-center text-center gap-2 bg-slate-50"
                      >
                        <span className="text-4xl select-none">{step.visual}</span>
                        <p className="text-xs font-bold text-slate-800 leading-tight">{step.label}</p>
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-xs font-bold text-slate-500 mt-2">
                          {step.order}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </main>

        {/* Answer Key Dropdown (For Parents / Teachers) */}
        {worksheet.assessmentGuide && (
          <div className="mt-8 pt-4 border-t border-slate-200 text-xs print:hidden">
            <button
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className="flex items-center justify-between w-full p-3 bg-slate-100 rounded-xl text-slate-700 font-bold hover:bg-slate-200 transition"
            >
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>دليل المعلم وولي الأمر ومفتاح الإجابات النموذجية</span>
              </span>
              {showAnswerKey ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAnswerKey && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mt-2 space-y-2">
                <p className="font-bold text-slate-800">ملاحظات التقييم:</p>
                <p className="text-slate-600">{worksheet.assessmentGuide.teacherNotes}</p>
                <p className="font-bold text-slate-800 pt-2">الإجابات الصحيحة:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {worksheet.assessmentGuide.answerKey.map((key, i) => (
                    <li key={i}>{key}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Worksheet Footer (Printed on Paper) */}
        <footer className="mt-10 pt-4 border-t-2 border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div>
            <span>منصة عالم الصغار — Little Stars</span>
            <span className="mx-1">|</span>
            <span>رخصة استخدام منزلي ومدرسي مجاني</span>
          </div>
          <div className="font-mono text-[10px]">littlestars.local</div>
        </footer>
      </div>
    </div>
  );
};
