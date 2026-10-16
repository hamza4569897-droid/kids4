import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RefreshCw,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Edit3,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { AgeGroup } from '../../types/worksheet';
import { ARABIC_WORDS_BANK, ARABIC_SIMILAR_LETTERS } from '../../data/activitiesHubData';

interface ArabicLanguageHubProps {
  onBack?: () => void;
  onOpenWorksheet?: () => void;
  initialAge?: AgeGroup;
}

type ActivityTab = 'recognition' | 'word_builder' | 'similar_letters' | 'letter_positions' | 'tracing';

const ALPHABET = [
  { letter: 'أ', name: 'ألف', word: 'أَرْنَب', emoji: '🐇' },
  { letter: 'ب', name: 'باء', word: 'بَطَّة', emoji: '🦆' },
  { letter: 'ت', name: 'تاء', word: 'تُفَّاح', emoji: '🍎' },
  { letter: 'ث', name: 'ثاء', word: 'ثَعْلَب', emoji: '🦊' },
  { letter: 'ج', name: 'جيم', word: 'جَمَل', emoji: '🐪' },
  { letter: 'ح', name: 'حاء', word: 'حِصَان', emoji: '🐴' },
  { letter: 'خ', name: 'خاء', word: 'خَرُوف', emoji: '🐑' },
  { letter: 'د', name: 'دال', word: 'دُبّ', emoji: '🧸' },
  { letter: 'ذ', name: 'ذال', word: 'ذِئْب', emoji: '🐺' },
  { letter: 'ر', name: 'راء', word: 'رِيشَة', emoji: '🪶' },
  { letter: 'ز', name: 'زاي', word: 'زَرَافَة', emoji: '🦒' },
  { letter: 'س', name: 'سين', word: 'سَمَكَة', emoji: '🐟' },
  { letter: 'ش', name: 'شين', word: 'شَمْس', emoji: '☀️' },
  { letter: 'ص', name: 'صاد', word: 'صَقْر', emoji: '🦅' },
  { letter: 'ض', name: 'ضاد', word: 'ضِفْدَع', emoji: '🐸' },
  { letter: 'ط', name: 'طاء', word: 'طَيَّارَة', emoji: '✈️' },
  { letter: 'ظ', name: 'ظاء', word: 'ظَرْف', emoji: '✉️' },
  { letter: 'ع', name: 'عين', word: 'عَيْن', emoji: '👁️' },
  { letter: 'غ', name: 'غين', word: 'غَيْمَة', emoji: '☁️' },
  { letter: 'ف', name: 'فاء', word: 'فَرَاشَة', emoji: '🦋' },
  { letter: 'ق', name: 'قاف', word: 'قَمَر', emoji: '🌙' },
  { letter: 'ك', name: 'كاف', word: 'كِتَاب', emoji: '📖' },
  { letter: 'ل', name: 'لام', word: 'لَيْمُون', emoji: '🍋' },
  { letter: 'م', name: 'ميم', word: 'مَوْز', emoji: '🍌' },
  { letter: 'ن', name: 'نون', word: 'نَجْمَة', emoji: '⭐' },
  { letter: 'هـ', name: 'هاء', word: 'هِلَال', emoji: '🌙' },
  { letter: 'و', name: 'واو', word: 'وَرْدَة', emoji: '🌹' },
  { letter: 'ي', name: 'ياء', word: 'يَد', emoji: '✋' },
];

export const ArabicLanguageHubActivity: React.FC<ArabicLanguageHubProps> = ({
  onBack,
  onOpenWorksheet,
  initialAge = '3-4',
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAge);
  const [activeTab, setActiveTab] = useState<ActivityTab>('recognition');
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  // 1. Recognition State
  const [targetLetter, setTargetLetter] = useState(ALPHABET[0]);
  const [letterChoices, setLetterChoices] = useState<typeof ALPHABET>([]);

  // 2. Word Builder State
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [assembledLetters, setAssembledLetters] = useState<string[]>([]);

  // 3. Similar Letters State
  const [similarIndex, setSimilarIndex] = useState(0);
  const [similarChoiceFeedback, setSimilarChoiceFeedback] = useState<string>('');

  // 4. Tracing Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tracingLetter, setTracingLetter] = useState(ALPHABET[0]);

  // Init recognition round
  const startRecognitionRound = () => {
    const pool = selectedAge === '2-3' ? ALPHABET.slice(0, 8) : ALPHABET;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const choicesCount = selectedAge === '2-3' ? 2 : selectedAge === '3-4' ? 3 : 4;
    const roundChoices = shuffled.slice(0, choicesCount);
    const target = roundChoices[Math.floor(Math.random() * roundChoices.length)];

    setTargetLetter(target);
    setLetterChoices(roundChoices);
    setFeedback('');

    sounds.speakArabic(`أين حرف ${target.name}؟ مثل ${target.word}`);
  };

  // Init word builder
  const startWordBuilder = (idx: number) => {
    const currentWord = ARABIC_WORDS_BANK[idx % ARABIC_WORDS_BANK.length];
    const letters = [...currentWord.letters];
    const scrambled = [...letters].sort(() => 0.5 - Math.random());
    setScrambledLetters(scrambled);
    setAssembledLetters([]);
    setFeedback('');
    sounds.speakArabic(`رتب حروف كلمة: ${currentWord.word}`);
  };

  useEffect(() => {
    if (activeTab === 'recognition') {
      startRecognitionRound();
    } else if (activeTab === 'word_builder') {
      startWordBuilder(activeWordIndex);
    }
  }, [activeTab, selectedAge]);

  const handleLetterPick = (item: (typeof ALPHABET)[0]) => {
    sounds.playPop();
    if (item.letter === targetLetter.letter) {
      sounds.playChime();
      setFeedback(`أحسنت يا بطل! حرف ${item.name}: ${item.word} ${item.emoji} 🌟`);
      setStars((prev) => prev + 1);

      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
      });

      setTimeout(() => {
        startRecognitionRound();
      }, 1500);
    } else {
      sounds.playTryAgain();
      setFeedback(`حاول ثانية يا صغيري، ابحث عن حرف ${targetLetter.name} 😊`);
      sounds.speakArabic(`حاول ثانية، أين حرف ${targetLetter.name}؟`);
    }
  };

  const handlePickScrambled = (letter: string, index: number) => {
    sounds.playPop();
    const newScrambled = [...scrambledLetters];
    newScrambled.splice(index, 1);
    const newAssembled = [...assembledLetters, letter];

    setScrambledLetters(newScrambled);
    setAssembledLetters(newAssembled);

    const currentWord = ARABIC_WORDS_BANK[activeWordIndex % ARABIC_WORDS_BANK.length];
    if (newAssembled.length === currentWord.letters.length) {
      const isCorrect = newAssembled.join('') === currentWord.letters.join('');
      if (isCorrect) {
        sounds.playCheer();
        setFeedback(`رائع جداً! كوّنت كلمة (${currentWord.word}) بنجاح! 🌟👏`);
        setStars((prev) => prev + 2);
        confetti({ particleCount: 50, spread: 70 });
        sounds.speakArabic(`ممتاز! كلمة ${currentWord.word}`);
      } else {
        sounds.playTryAgain();
        setFeedback(`حروف قريبة، اضغط على إعادة لترتيب الكلمة بشكل صحيح 😊`);
      }
    }
  };

  // Tracing Canvas Handlers
  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#f59e0b';
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const handleEndDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    sounds.playPop();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition"
              title="رجوع إلى مركز الأنشطة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              اللغة العربية وتأسيس القراءة 📖
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              عالم الحروف والكلمات العربية
            </h2>
          </div>
        </div>

        {/* Stars Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-extrabold text-amber-900">{stars} نجمة إنجاز</span>
          </div>
          {onOpenWorksheet && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorksheet();
              }}
              className="text-xs font-bold text-amber-700 bg-amber-100/70 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition"
            >
              📄 ورقة عمل للطباعة
            </button>
          )}
        </div>
      </div>

      {/* Age & Sub-Activity Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Activity Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'recognition', label: 'التعرف على الحرف', icon: BookOpen },
            { id: 'word_builder', label: 'تكوين الكلمات', icon: Layers },
            { id: 'similar_letters', label: 'الحروف المتشابهة', icon: CheckCircle2 },
            { id: 'tracing', label: 'تتبع ورسم الحرف', icon: Edit3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab.id as ActivityTab);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
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
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {age === '2-3' ? '2-3 سنوات' : age === '3-4' ? '3-4 سنوات' : age === '4-5' ? '4-5 سنوات' : '5-6 سنوات'}
            </button>
          ))}
        </div>
      </div>

      {/* MODE 1: Letter Recognition */}
      {activeTab === 'recognition' && (
        <div className="space-y-6 text-center py-4">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
            <Volume2
              className="w-5 h-5 text-amber-600 cursor-pointer hover:scale-110 transition"
              onClick={() => sounds.speakArabic(`أين حرف ${targetLetter.name}؟ مثل ${targetLetter.word}`)}
            />
            <span className="text-sm sm:text-base font-extrabold text-slate-800">
              أين حرف <span className="text-amber-600 text-xl font-black">({targetLetter.name})</span> مثل {targetLetter.word} {targetLetter.emoji}؟
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
            {letterChoices.map((item) => (
              <button
                key={item.letter}
                onClick={() => handleLetterPick(item)}
                className="w-24 h-28 sm:w-32 sm:h-36 rounded-3xl bg-gradient-to-b from-amber-50 to-amber-100/80 border-2 border-amber-300 hover:border-amber-500 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 shadow-sm group cursor-pointer"
              >
                <span className="text-4xl sm:text-5xl font-black text-amber-900 group-hover:text-amber-600 transition">
                  {item.letter}
                </span>
                <span className="text-xs font-bold text-slate-500">{item.name}</span>
              </button>
            ))}
          </div>

          {feedback && (
            <p className="text-base font-extrabold text-amber-800 animate-bounce">{feedback}</p>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playPop();
                startRecognitionRound();
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تغيير الحرف المستهدف</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: Word Builder */}
      {activeTab === 'word_builder' && (
        <div className="space-y-6 text-center py-4">
          {(() => {
            const currentWord = ARABIC_WORDS_BANK[activeWordIndex % ARABIC_WORDS_BANK.length];
            return (
              <>
                <div className="space-y-2">
                  <span className="text-5xl">{currentWord.visual}</span>
                  <h3 className="text-lg font-black text-slate-800">
                    رتّب حروف كلمة: <span className="text-amber-600">{currentWord.word}</span>
                  </h3>
                  <p className="text-xs text-slate-500">{currentWord.meaning}</p>
                </div>

                {/* Assembled Boxes */}
                <div className="flex items-center justify-center gap-3 py-2">
                  {currentWord.letters.map((_, i) => (
                    <div
                      key={i}
                      className="w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/50 flex items-center justify-center text-3xl sm:text-4xl font-black text-amber-900 shadow-inner"
                    >
                      {assembledLetters[i] || ''}
                    </div>
                  ))}
                </div>

                {/* Scrambled Choices */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  {scrambledLetters.map((l, i) => (
                    <button
                      key={i}
                      onClick={() => handlePickScrambled(l, i)}
                      className="w-14 h-16 sm:w-16 sm:h-20 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-3xl sm:text-4xl shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {feedback && (
                  <p className="text-sm sm:text-base font-extrabold text-amber-800">{feedback}</p>
                )}

                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      startWordBuilder(activeWordIndex);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>إعادة المحاولة</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playPop();
                      setActiveWordIndex((prev) => prev + 1);
                      startWordBuilder(activeWordIndex + 1);
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>الكلمة التالية</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* MODE 3: Similar Letters Distinction */}
      {activeTab === 'similar_letters' && (
        <div className="space-y-6 py-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              لعبة التمييز بين الحروف المتشابهة في الشكل 🔍
            </h3>
            <p className="text-xs text-slate-500">
              ساعد طفلك على ملاحظة عدد النقاط ومكانها (فوق، تحت، أو بلا نقاط).
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-amber-50/60 rounded-3xl p-6 border border-amber-200 space-y-5">
            {(() => {
              const currentGroup = ARABIC_SIMILAR_LETTERS[similarIndex % ARABIC_SIMILAR_LETTERS.length];
              return (
                <>
                  <div className="flex items-center justify-center gap-6">
                    {currentGroup.pair.map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          sounds.playPop();
                          const item = ALPHABET.find((a) => a.letter === l);
                          if (item) sounds.speakArabic(`حرف ${item.name}`);
                          setSimilarChoiceFeedback(`حرف (${l}): ${item?.word || ''}`);
                        }}
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-white border-2 border-amber-400 hover:border-amber-600 hover:scale-105 transition flex flex-col items-center justify-center shadow-xs"
                      >
                        <span className="text-4xl sm:text-5xl font-black text-amber-900">{l}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-amber-100 text-center space-y-1">
                    <p className="text-sm font-bold text-slate-800">{currentGroup.desc}</p>
                    <p className="text-2xl pt-1">{currentGroup.sample}</p>
                  </div>

                  {similarChoiceFeedback && (
                    <p className="text-center text-sm font-bold text-amber-800">{similarChoiceFeedback}</p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setSimilarIndex((prev) => (prev > 0 ? prev - 1 : ARABIC_SIMILAR_LETTERS.length - 1));
                        setSimilarChoiceFeedback('');
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-amber-800 transition"
                    >
                      ← المجموعة السابقة
                    </button>
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setSimilarIndex((prev) => prev + 1);
                        setSimilarChoiceFeedback('');
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    >
                      <span>المجموعة التالية</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODE 4: Tracing Canvas */}
      {activeTab === 'tracing' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              تتبع شكل الحرف بالأصابع أو الفأرة ✏️
            </h3>
            <p className="text-xs text-slate-500">
              تمرين رائع لتقوية العضلات الدقيقة لليد والاستعداد لمسك القلم.
            </p>
          </div>

          {/* Letter Picker Bar */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {ALPHABET.slice(0, 10).map((item) => (
              <button
                key={item.letter}
                onClick={() => {
                  sounds.playPop();
                  setTracingLetter(item);
                  clearCanvas();
                  sounds.speakArabic(`تتبع حرف ${item.name}`);
                }}
                className={`w-10 h-10 rounded-xl font-black text-lg transition shrink-0 ${
                  tracingLetter.letter === item.letter
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {item.letter}
              </button>
            ))}
          </div>

          {/* Canvas Box with faint guideline */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto rounded-3xl border-4 border-dashed border-amber-300 bg-amber-50/40 overflow-hidden shadow-inner flex items-center justify-center select-none">
            {/* Background Faint Letter */}
            <span className="absolute text-[160px] font-black text-amber-200/70 select-none pointer-events-none">
              {tracingLetter.letter}
            </span>

            {/* Drawing Canvas */}
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="absolute inset-0 cursor-crosshair touch-none"
              onMouseDown={handleStartDraw}
              onMouseMove={handleDrawMove}
              onMouseUp={handleEndDraw}
              onMouseLeave={handleEndDraw}
              onTouchStart={handleStartDraw}
              onTouchMove={handleDrawMove}
              onTouchEnd={handleEndDraw}
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sounds.playPop();
                clearCanvas();
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>مسح اللوحة</span>
            </button>
            <button
              onClick={() => {
                sounds.playChime();
                setStars((prev) => prev + 1);
                confetti({ particleCount: 35, spread: 60 });
              }}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>انتهيت من التتبع!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
