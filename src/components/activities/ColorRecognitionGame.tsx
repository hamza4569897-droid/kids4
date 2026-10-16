import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../lib/audio';
import { Volume2, RefreshCw, Trophy, ArrowRight } from 'lucide-react';

interface ColorItem {
  id: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  bgClass: string;
}

const COLORS_POOL: ColorItem[] = [
  { id: 'red', nameAr: 'الأحمر', nameEn: 'Red', hex: '#EF4444', bgClass: 'bg-red-500 hover:bg-red-600' },
  { id: 'blue', nameAr: 'الأزرق', nameEn: 'Blue', hex: '#3B82F6', bgClass: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'yellow', nameAr: 'الأصفر', nameEn: 'Yellow', hex: '#FACC15', bgClass: 'bg-yellow-400 hover:bg-yellow-500' },
  { id: 'green', nameAr: 'الأخضر', nameEn: 'Green', hex: '#10B981', bgClass: 'bg-emerald-500 hover:bg-emerald-600' },
  { id: 'purple', nameAr: 'البنفسجي', nameEn: 'Purple', hex: '#A855F7', bgClass: 'bg-purple-500 hover:bg-purple-600' },
  { id: 'orange', nameAr: 'البرتقالي', nameEn: 'Orange', hex: '#F97316', bgClass: 'bg-orange-500 hover:bg-orange-600' },
  { id: 'pink', nameAr: 'الوردي', nameEn: 'Pink', hex: '#EC4899', bgClass: 'bg-pink-400 hover:bg-pink-500' },
];

export const ColorRecognitionGame: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [targetColor, setTargetColor] = useState<ColorItem>(COLORS_POOL[0]);
  const [choices, setChoices] = useState<ColorItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'retry' | null }>({
    message: '',
    type: null,
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const startNewRound = (currentRound: number) => {
    // Pick 3 or 4 colors
    const shuffled = [...COLORS_POOL].sort(() => 0.5 - Math.random());
    const roundChoices = shuffled.slice(0, 4);
    const target = roundChoices[Math.floor(Math.random() * roundChoices.length)];

    setTargetColor(target);
    setChoices(roundChoices);
    setFeedback({ message: '', type: null });

    // Announce target color in Arabic
    setTimeout(() => {
      sounds.speakArabic(`أين اللون ${target.nameAr}؟`);
    }, 200);
  };

  useEffect(() => {
    startNewRound(1);
  }, []);

  const handleChoice = (color: ColorItem) => {
    sounds.playPop();
    if (color.id === targetColor.id) {
      sounds.playChime();
      setFeedback({ message: `أحسنت يا بطل! هذا هو اللون ${color.nameAr}! 🌟`, type: 'success' });
      setScore((s) => s + 1);

      if (round >= 5) {
        sounds.playCheer();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setIsCompleted(true);
      } else {
        setTimeout(() => {
          setRound((r) => r + 1);
          startNewRound(round + 1);
        }, 1400);
      }
    } else {
      sounds.playTryAgain();
      setFeedback({ message: `حاول مرة أخرى، ابحث عن اللون ${targetColor.nameAr} ✨`, type: 'retry' });
    }
  };

  const handleRestart = () => {
    setScore(0);
    setRound(1);
    setIsCompleted(false);
    startNewRound(1);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-500 hover:bg-amber-50 hover:text-amber-700 transition"
              title="رجوع للقائمة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900">لعبة استكشاف الألوان 🎨</h2>
            <p className="text-xs sm:text-sm text-slate-500">مناسبة للأعمار: من 2 إلى 4 سنوات</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-100/70 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
            جولة {round} من 5
          </div>
          <button
            onClick={() => sounds.speakArabic(`أين اللون ${targetColor.nameAr}؟`)}
            className="p-2 bg-amber-50 rounded-xl text-amber-700 hover:bg-amber-100 transition"
            title="إعادة نطق السؤال"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <>
          {/* Target Question */}
          <div className="text-center py-6 px-4 bg-amber-50/60 rounded-2xl mb-8">
            <p className="text-lg sm:text-xl text-slate-700 mb-2">أين هو اللون المطلوب؟</p>
            <div className="inline-flex items-center gap-2 bg-white px-6 py-2.5 rounded-full shadow-sm border border-amber-200">
              <span
                className="w-5 h-5 rounded-full inline-block shadow-inner"
                style={{ backgroundColor: targetColor.hex }}
              />
              <span className="text-2xl font-extrabold text-amber-900">{targetColor.nameAr}</span>
            </div>

            {feedback.message && (
              <div
                className={`mt-4 text-base font-bold transition-all ${
                  feedback.type === 'success' ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {feedback.message}
              </div>
            )}
          </div>

          {/* Balloon / Circle choices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {choices.map((c) => (
              <button
                key={c.id}
                onClick={() => handleChoice(c)}
                className={`h-36 sm:h-44 rounded-3xl ${c.bgClass} text-white font-bold text-lg sm:text-xl shadow-md hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 focus:ring-4 focus:ring-amber-300`}
                aria-label={c.nameAr}
              >
                <span className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner">
                  🎈
                </span>
                <span>{c.nameAr}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* Completion View */
        <div className="text-center py-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-amber-900 mb-2">رائع جداً يا صغيري! 🌟</h3>
          <p className="text-slate-600 mb-6 text-base">
            لقد ميزت جميع الألوان بنجاح وأتممت الجولات الخمسة ببراعة!
          </p>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            <span>العب مرة أخرى</span>
          </button>
        </div>
      )}
    </div>
  );
};
