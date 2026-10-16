import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Hash,
  Shapes,
  Maximize2,
  CheckCircle2,
  Award,
  ChevronLeft
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { AgeGroup } from '../../types/worksheet';

interface MathNumbersHubProps {
  onBack?: () => void;
  onOpenWorksheet?: () => void;
  initialAge?: AgeGroup;
}

type MathTab = 'counting' | 'comparison' | 'shapes' | 'sizes' | 'patterns' | 'addition';

const SHAPES_DATA = [
  { name: 'دائرة', nameEn: 'Circle', visual: '⚪', sides: 'منحنية بلا أضلاع', sample: 'العجلة والساعة والبيتزا' },
  { name: 'مربع', nameEn: 'Square', visual: '⬛', sides: '4 أضلاع متساوية', sample: 'نافذة وصندوق الهدايا' },
  { name: 'مثلث', nameEn: 'Triangle', visual: '🔺', sides: '3 أضلاع و3 زوايا', sample: 'قطعة البيتزا وهرم العصير' },
  { name: 'مستطيل', nameEn: 'Rectangle', visual: '▭', sides: 'ضلعان طويلان وضلعان قصيران', sample: 'الباب والشاشة والكتاب' },
  { name: 'نجمة', nameEn: 'Star', visual: '⭐', sides: 'أطراف لامعة جميلة', sample: 'نجوم السماء المضيئة' },
  { name: 'بيضاوي', nameEn: 'Oval', visual: '🥚', sides: 'شكل بيضاوي متناسق', sample: 'البيضة وحبة الأفوكادو' },
];

export const MathNumbersHubActivity: React.FC<MathNumbersHubProps> = ({
  onBack,
  onOpenWorksheet,
  initialAge = '3-4',
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAge);
  const [activeTab, setActiveTab] = useState<MathTab>('counting');
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  // 1. Counting State
  const [targetCount, setTargetCount] = useState<number>(3);
  const [itemEmoji, setItemEmoji] = useState<string>('🍎');
  const [countChoices, setCountChoices] = useState<number[]>([]);

  // 2. Comparison State
  const [leftQty, setLeftQty] = useState<number>(4);
  const [rightQty, setRightQty] = useState<number>(2);

  // 3. Patterns State
  const [patternItems, setPatternItems] = useState<string[]>(['🍎', '🍌', '🍎', '🍌']);
  const [missingPatternAnswer, setMissingPatternAnswer] = useState<string>('🍎');
  const [patternChoices, setPatternChoices] = useState<string[]>(['🍎', '🍌', '🍇']);

  // 4. Visual Addition State (for older kids)
  const [addA, setAddA] = useState<number>(2);
  const [addB, setAddB] = useState<number>(3);

  // Counting round generator
  const initCountingRound = () => {
    const max = selectedAge === '2-3' ? 3 : selectedAge === '3-4' ? 5 : selectedAge === '4-5' ? 10 : 15;
    const count = Math.floor(Math.random() * max) + 1;
    const emojis = ['🍎', '⭐', '🦆', '🎈', '🚗', '🍓', '🧁'];
    const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const choices = [count];
    while (choices.length < 3) {
      const r = Math.floor(Math.random() * (max + 2)) + 1;
      if (!choices.includes(r)) choices.push(r);
    }
    choices.sort(() => 0.5 - Math.random());

    setTargetCount(count);
    setItemEmoji(chosenEmoji);
    setCountChoices(choices);
    setFeedback('');
    sounds.speakArabic(`كم عدداً من ${chosenEmoji} ترى على الشاشة؟`);
  };

  // Comparison round generator
  const initComparisonRound = () => {
    const a = Math.floor(Math.random() * 6) + 1;
    let b = Math.floor(Math.random() * 6) + 1;
    // ensure variety
    setLeftQty(a);
    setRightQty(b);
    setFeedback('');
    sounds.speakArabic(`قارن بين المجموعتين: أين نجد أكثر؟`);
  };

  // Pattern round generator
  const initPatternRound = () => {
    const pairs = [
      { a: '🔴', b: '🔵' },
      { a: '⭐', b: '🌙' },
      { a: '🍎', b: '🍌' },
      { a: '🚗', b: '✈️' },
    ];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    // Pattern: A B A B ? -> answer is A
    setPatternItems([pair.a, pair.b, pair.a, pair.b]);
    setMissingPatternAnswer(pair.a);
    setPatternChoices([pair.a, pair.b, '🟢'].sort(() => 0.5 - Math.random()));
    setFeedback('');
  };

  // Addition generator
  const initAdditionRound = () => {
    const a = Math.floor(Math.random() * 4) + 1;
    const b = Math.floor(Math.random() * 4) + 1;
    setAddA(a);
    setAddB(b);
    setFeedback('');
    sounds.speakArabic(`اجمع العناصر: ${a} زائد ${b}`);
  };

  useEffect(() => {
    if (activeTab === 'counting') initCountingRound();
    else if (activeTab === 'comparison') initComparisonRound();
    else if (activeTab === 'patterns') initPatternRound();
    else if (activeTab === 'addition') initAdditionRound();
  }, [activeTab, selectedAge]);

  const handlePickCount = (num: number) => {
    sounds.playPop();
    if (num === targetCount) {
      sounds.playChime();
      setFeedback(`عدّ ممتاز! العدد هو (${num}) بالضبط! 🌟👏`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 30, spread: 60 });
      sounds.speakArabic(`أحسنت! العدد ${num}`);
      setTimeout(initCountingRound, 1500);
    } else {
      sounds.playTryAgain();
      setFeedback(`عدّ ثانية بهدوء يا بطل، المس كل عنصر وعدّ بأصابعك 😊`);
    }
  };

  const handleComparisonAnswer = (answer: 'left' | 'right' | 'equal') => {
    sounds.playPop();
    let isCorrect = false;
    if (answer === 'left' && leftQty > rightQty) isCorrect = true;
    else if (answer === 'right' && rightQty > leftQty) isCorrect = true;
    else if (answer === 'equal' && leftQty === rightQty) isCorrect = true;

    if (isCorrect) {
      sounds.playCheer();
      setFeedback(`إجابة صحيحة وذكية! المقارنة دقيقة 🌟`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 35, spread: 60 });
      setTimeout(initComparisonRound, 1600);
    } else {
      sounds.playTryAgain();
      setFeedback(`انظر مجدداً: المجموعة الأولى (${leftQty}) والثانية (${rightQty}) 😊`);
    }
  };

  const handlePatternChoice = (item: string) => {
    sounds.playPop();
    if (item === missingPatternAnswer) {
      sounds.playCheer();
      setFeedback(`عبقري! أكملت النمط بنجاح 🌟🎉`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 35, spread: 60 });
      setTimeout(initPatternRound, 1600);
    } else {
      sounds.playTryAgain();
      setFeedback(`فكر في الترتيب المتكرر وحاول ثانية 😊`);
    }
  };

  const handleAdditionChoice = (sum: number) => {
    sounds.playPop();
    if (sum === addA + addB) {
      sounds.playCheer();
      setFeedback(`ممتاز جداً! ${addA} + ${addB} = ${sum} 🌟👏`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 40, spread: 70 });
      setTimeout(initAdditionRound, 1600);
    } else {
      sounds.playTryAgain();
      setFeedback(`اجمع كل العناصر معاً وحاول ثانية 😊`);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition"
              title="رجوع إلى مركز الأنشطة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              الرياضيات والتفكير الحسابي 🔢
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              عالم الأرقام والأشكال والمقادير
            </h2>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-extrabold text-emerald-900">{stars} نجمة رياضية</span>
          </div>
          {onOpenWorksheet && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorksheet();
              }}
              className="text-xs font-bold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition"
            >
              📄 ورقة عمل حسابية
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'counting', label: 'عدّ الأشياء', icon: Hash },
            { id: 'comparison', label: 'المقارنة (أكثر / أقل)', icon: Maximize2 },
            { id: 'shapes', label: 'الأشكال الهندسية', icon: Shapes },
            { id: 'patterns', label: 'إكمال الأنماط', icon: CheckCircle2 },
            { id: 'addition', label: 'الجمع البصري', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab.id as MathTab);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-slate-700 hover:bg-emerald-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Age Level Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {(['2-3', '3-4', '4-5', '5-6'] as AgeGroup[]).map((age) => (
            <button
              key={age}
              onClick={() => {
                sounds.playPop();
                setSelectedAge(age);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                selectedAge === age
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {age === '2-3' ? '2-3 سنوات' : age === '3-4' ? '3-4 سنوات' : age === '4-5' ? '4-5 سنوات' : '5-6 سنوات'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Counting Objects */}
      {activeTab === 'counting' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              كم عدداً من العناصر ترى في الصندوق؟ 📦
            </h3>
            <p className="text-xs text-slate-500">عدّ العناصر بإصبعك ثم اضغط على الرقم المطابق.</p>
          </div>

          {/* Visual Container */}
          <div className="max-w-lg mx-auto min-h-36 p-6 rounded-3xl bg-emerald-50/70 border-2 border-dashed border-emerald-300 flex flex-wrap items-center justify-center gap-4 shadow-inner">
            {Array.from({ length: targetCount }).map((_, idx) => (
              <span
                key={idx}
                onClick={() => {
                  sounds.playPop();
                  sounds.speakArabic(String(idx + 1));
                }}
                className="text-5xl hover:scale-125 transition-transform cursor-pointer select-none"
              >
                {itemEmoji}
              </span>
            ))}
          </div>

          {/* Number Choices */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {countChoices.map((num) => (
              <button
                key={num}
                onClick={() => handlePickCount(num)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-emerald-300 hover:border-emerald-600 hover:scale-110 active:scale-95 text-3xl font-black text-emerald-950 shadow-sm transition cursor-pointer"
              >
                {num}
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-emerald-800 animate-bounce">{feedback}</p>}
        </div>
      )}

      {/* TAB 2: Comparison (More / Less / Equal) */}
      {activeTab === 'comparison' && (
        <div className="space-y-6 text-center py-4">
          <h3 className="text-lg font-black text-slate-800">
            أين تجد العدد الأكبر؟ أم أن المجموعتين متساويتان؟
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* Left Box */}
            <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 space-y-2">
              <span className="text-xs font-bold text-amber-800">المجموعة أ</span>
              <div className="flex flex-wrap items-center justify-center gap-2 min-h-16">
                {Array.from({ length: leftQty }).map((_, i) => (
                  <span key={i} className="text-3xl">⭐</span>
                ))}
              </div>
              <span className="text-lg font-black text-slate-700 block">({leftQty})</span>
            </div>

            {/* Right Box */}
            <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-300 space-y-2">
              <span className="text-xs font-bold text-blue-800">المجموعة ب</span>
              <div className="flex flex-wrap items-center justify-center gap-2 min-h-16">
                {Array.from({ length: rightQty }).map((_, i) => (
                  <span key={i} className="text-3xl">⭐</span>
                ))}
              </div>
              <span className="text-lg font-black text-slate-700 block">({rightQty})</span>
            </div>
          </div>

          {/* Action Choice Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleComparisonAnswer('left')}
              className="px-5 py-3 rounded-2xl bg-white border-2 border-amber-400 hover:bg-amber-100 font-black text-sm text-amber-900 transition hover:scale-105 active:scale-95"
            >
              المجموعة (أ) أكثر
            </button>
            <button
              onClick={() => handleComparisonAnswer('equal')}
              className="px-5 py-3 rounded-2xl bg-white border-2 border-emerald-400 hover:bg-emerald-100 font-black text-sm text-emerald-900 transition hover:scale-105 active:scale-95"
            >
              المجموعتان متساويتان (=)
            </button>
            <button
              onClick={() => handleComparisonAnswer('right')}
              className="px-5 py-3 rounded-2xl bg-white border-2 border-blue-400 hover:bg-blue-100 font-black text-sm text-blue-900 transition hover:scale-105 active:scale-95"
            >
              المجموعة (ب) أكثر
            </button>
          </div>

          {feedback && <p className="text-base font-extrabold text-emerald-800 animate-bounce">{feedback}</p>}
        </div>
      )}

      {/* TAB 3: Geometric Shapes */}
      {activeTab === 'shapes' && (
        <div className="space-y-4 py-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              تعرّف على الأشكال الهندسية المحيطة بنا 🔺⚪⬛
            </h3>
            <p className="text-xs text-slate-500">انقر على أي شكل لسماع اسمه وخصائصه وأمثلة عليه من حياتنا اليومية.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {SHAPES_DATA.map((shape) => (
              <button
                key={shape.name}
                onClick={() => {
                  sounds.playPop();
                  sounds.speakArabic(`شكل ${shape.name}: ${shape.sides}`);
                  setFeedback(`شكل ${shape.name}: ${shape.sides} - مثل ${shape.sample}`);
                }}
                className="p-4 rounded-3xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 transition text-center space-y-2 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              >
                <span className="text-5xl block">{shape.visual}</span>
                <span className="text-base font-black text-slate-900 block">{shape.name}</span>
                <span className="text-[11px] text-slate-500 block">{shape.nameEn}</span>
              </button>
            ))}
          </div>

          {feedback && (
            <div className="max-w-md mx-auto p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <p className="text-sm font-black text-emerald-900">{feedback}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Pattern Completion */}
      {activeTab === 'patterns' && (
        <div className="space-y-6 text-center py-4">
          <h3 className="text-lg font-black text-slate-800">
            أكمل النمط المتكرر: ما هو العنصر التالي؟ 🔄
          </h3>

          <div className="flex items-center justify-center gap-3 sm:gap-4 py-3 bg-emerald-50/50 max-w-lg mx-auto rounded-3xl border border-emerald-200">
            {patternItems.map((item, idx) => (
              <span key={idx} className="text-4xl sm:text-5xl">{item}</span>
            ))}
            <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-dashed border-emerald-500 bg-white flex items-center justify-center text-3xl font-black text-emerald-600 shadow-inner">
              ؟
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            {patternChoices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handlePatternChoice(choice)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-emerald-300 hover:border-emerald-600 hover:scale-110 active:scale-95 text-4xl shadow-sm transition flex items-center justify-center cursor-pointer"
              >
                {choice}
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-emerald-800 animate-bounce">{feedback}</p>}
        </div>
      )}

      {/* TAB 5: Visual Addition */}
      {activeTab === 'addition' && (
        <div className="space-y-6 text-center py-4">
          <h3 className="text-lg font-black text-slate-800">
            الجمع البصري الممتع: كم يساوي مجموع التفاحات؟ 🍎
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4 py-4 bg-emerald-50/60 max-w-xl mx-auto rounded-3xl border border-emerald-200">
            {/* Part A */}
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
              {Array.from({ length: addA }).map((_, i) => (
                <span key={i} className="text-3xl">🍎</span>
              ))}
              <span className="font-black text-lg text-emerald-900 mr-2">({addA})</span>
            </div>

            <span className="text-3xl font-black text-emerald-700">+</span>

            {/* Part B */}
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
              {Array.from({ length: addB }).map((_, i) => (
                <span key={i} className="text-3xl">🍎</span>
              ))}
              <span className="font-black text-lg text-emerald-900 mr-2">({addB})</span>
            </div>

            <span className="text-3xl font-black text-emerald-700">=</span>
            <span className="w-14 h-14 rounded-2xl border-2 border-dashed border-emerald-600 bg-white flex items-center justify-center text-2xl font-black text-emerald-700">
              ؟
            </span>
          </div>

          {/* Sum Choices */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {[addA + addB - 1, addA + addB, addA + addB + 2]
              .filter((n) => n > 0)
              .sort(() => 0.5 - Math.random())
              .map((sumVal) => (
                <button
                  key={sumVal}
                  onClick={() => handleAdditionChoice(sumVal)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-emerald-300 hover:border-emerald-600 hover:scale-110 active:scale-95 text-3xl font-black text-emerald-900 shadow-sm transition cursor-pointer"
                >
                  {sumVal}
                </button>
              ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-emerald-800 animate-bounce">{feedback}</p>}
        </div>
      )}
    </div>
  );
};
