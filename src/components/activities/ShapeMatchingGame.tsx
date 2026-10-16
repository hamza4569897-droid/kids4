import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../lib/audio';
import { Volume2, RefreshCw, Trophy, ArrowRight, Circle, Square, Triangle, Star, Heart } from 'lucide-react';

interface ShapeItem {
  id: string;
  nameAr: string;
  renderIcon: (className: string) => React.ReactNode;
  colorClass: string;
}

const SHAPES_POOL: ShapeItem[] = [
  {
    id: 'circle',
    nameAr: 'الدائرة',
    colorClass: 'text-amber-500 fill-amber-100',
    renderIcon: (cls) => <Circle className={cls} />,
  },
  {
    id: 'square',
    nameAr: 'المربع',
    colorClass: 'text-blue-500 fill-blue-100',
    renderIcon: (cls) => <Square className={cls} />,
  },
  {
    id: 'triangle',
    nameAr: 'المثلث',
    colorClass: 'text-emerald-500 fill-emerald-100',
    renderIcon: (cls) => <Triangle className={cls} />,
  },
  {
    id: 'star',
    nameAr: 'النجمة',
    colorClass: 'text-yellow-500 fill-yellow-100',
    renderIcon: (cls) => <Star className={cls} />,
  },
  {
    id: 'heart',
    nameAr: 'القلب',
    colorClass: 'text-rose-500 fill-rose-100',
    renderIcon: (cls) => <Heart className={cls} />,
  },
];

export const ShapeMatchingGame: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [targetShape, setTargetShape] = useState<ShapeItem>(SHAPES_POOL[0]);
  const [choices, setChoices] = useState<ShapeItem[]>([]);
  const [round, setRound] = useState<number>(1);
  const [feedback, setFeedback] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const startRound = (r: number) => {
    const shuffled = [...SHAPES_POOL].sort(() => 0.5 - Math.random());
    const roundChoices = shuffled.slice(0, 3);
    const target = roundChoices[Math.floor(Math.random() * roundChoices.length)];

    setTargetShape(target);
    setChoices(roundChoices);
    setFeedback('');

    setTimeout(() => {
      sounds.speakArabic(`اختر شكل ${target.nameAr}`);
    }, 200);
  };

  useEffect(() => {
    startRound(1);
  }, []);

  const handleChoice = (shape: ShapeItem) => {
    sounds.playPop();
    if (shape.id === targetShape.id) {
      sounds.playChime();
      setFeedback(`ممتاز! هذا هو ${shape.nameAr} 🌟`);

      if (round >= 5) {
        sounds.playCheer();
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
        setIsCompleted(true);
      } else {
        setTimeout(() => {
          setRound((r) => r + 1);
          startRound(round + 1);
        }, 1300);
      }
    } else {
      sounds.playTryAgain();
      setFeedback(`هذا شكل جميل، لكننا نبحث عن ${targetShape.nameAr} ✨`);
    }
  };

  const restart = () => {
    setRound(1);
    setIsCompleted(false);
    startRound(1);
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
              title="رجوع"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900">مطابقة الأشكال الهندسية 🔷</h2>
            <p className="text-xs sm:text-sm text-slate-500">مناسبة للأعمار: من 2 إلى 4 سنوات</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-100/70 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
            جولة {round} من 5
          </div>
          <button
            onClick={() => sounds.speakArabic(`اختر شكل ${targetShape.nameAr}`)}
            className="p-2 bg-amber-50 rounded-xl text-amber-700 hover:bg-amber-100 transition"
            title="إعادة نطق السؤال"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <>
          {/* Silhouette target */}
          <div className="text-center py-6 px-4 bg-amber-50/50 rounded-2xl mb-8 flex flex-col items-center">
            <p className="text-slate-600 mb-2 font-medium">أي الأشكال يطابق هذا المسمى؟</p>
            <div className="p-5 bg-white rounded-2xl shadow-sm border border-amber-200 mb-3 flex items-center gap-3">
              <span className="text-2xl font-black text-amber-900">{targetShape.nameAr}</span>
            </div>
            {feedback && <p className="text-emerald-700 font-bold mt-2">{feedback}</p>}
          </div>

          {/* Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {choices.map((shape) => (
              <button
                key={shape.id}
                onClick={() => handleChoice(shape)}
                className="h-44 rounded-3xl bg-amber-50/40 hover:bg-amber-100/50 border-2 border-amber-200/80 hover:border-amber-400 p-6 flex flex-col items-center justify-center gap-4 transition-all transform hover:-translate-y-1 active:scale-95 shadow-xs"
                aria-label={shape.nameAr}
              >
                <div className={`w-20 h-20 flex items-center justify-center ${shape.colorClass}`}>
                  {shape.renderIcon('w-16 h-16 stroke-2')}
                </div>
                <span className="text-lg font-bold text-slate-800">{shape.nameAr}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">أنت عبقري الأشكال! 🌟</h3>
          <p className="text-slate-600 mb-6 text-base">
            لقد تعرفت على كافة الأشكال الهندسية بنجاح مبهر.
          </p>
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            <span>العب مجدداً</span>
          </button>
        </div>
      )}
    </div>
  );
};
