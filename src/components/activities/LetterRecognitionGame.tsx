import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../lib/audio';
import { Volume2, RefreshCw, Trophy, ArrowRight, Sparkles } from 'lucide-react';

interface LetterItem {
  letter: string;
  nameAr: string;
  wordAr: string;
  emoji: string;
}

const LETTERS_POOL: LetterItem[] = [
  { letter: 'أ', nameAr: 'ألف', wordAr: 'أَرْنَب', emoji: '🐇' },
  { letter: 'ب', nameAr: 'باء', wordAr: 'بَطَّة', emoji: '🦆' },
  { letter: 'ت', nameAr: 'تاء', wordAr: 'تُفَّاحَة', emoji: '🍎' },
  { letter: 'ث', nameAr: 'ثاء', wordAr: 'ثَعْلَب', emoji: '🦊' },
  { letter: 'ج', nameAr: 'جيم', wordAr: 'جَمَل', emoji: '🐪' },
  { letter: 'ح', nameAr: 'حاء', wordAr: 'حِصَان', emoji: '🐴' },
  { letter: 'د', nameAr: 'دال', wordAr: 'دُبّ', emoji: '🧸' },
  { letter: 'س', nameAr: 'سين', wordAr: 'سَمَكَة', emoji: '🐟' },
  { letter: 'ش', nameAr: 'شين', wordAr: 'شَمْس', emoji: '☀️' },
  { letter: 'ك', nameAr: 'كاف', wordAr: 'كِتَاب', emoji: '📖' },
  { letter: 'م', nameAr: 'ميم', wordAr: 'مَوْز', emoji: '🍌' },
  { letter: 'ن', nameAr: 'نون', wordAr: 'نَجْمَة', emoji: '⭐' },
];

export const LetterRecognitionGame: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [target, setTarget] = useState<LetterItem>(LETTERS_POOL[0]);
  const [choices, setChoices] = useState<LetterItem[]>([]);
  const [round, setRound] = useState<number>(1);
  const [feedback, setFeedback] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const startRound = (r: number) => {
    const shuffled = [...LETTERS_POOL].sort(() => 0.5 - Math.random());
    const roundChoices = shuffled.slice(0, 3);
    const targetItem = roundChoices[Math.floor(Math.random() * roundChoices.length)];

    setTarget(targetItem);
    setChoices(roundChoices);
    setFeedback('');

    setTimeout(() => {
      sounds.speakArabic(`أين حرف ${targetItem.nameAr}؟ مثل كلمة ${targetItem.wordAr}`);
    }, 250);
  };

  useEffect(() => {
    startRound(1);
  }, []);

  const handleChoice = (item: LetterItem) => {
    sounds.playPop();
    if (item.letter === target.letter) {
      sounds.playChime();
      setFeedback(`ممتاز! حرف ${item.nameAr}: ${item.wordAr} ${item.emoji} 🌟`);

      if (round >= 5) {
        sounds.playCheer();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        setIsCompleted(true);
      } else {
        setTimeout(() => {
          setRound((prev) => prev + 1);
          startRound(round + 1);
        }, 1500);
      }
    } else {
      sounds.playTryAgain();
      setFeedback(`حاول مجدداً يا بطل، نبحث عن حرف ${target.nameAr} ✨`);
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
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900">حروف الهجاء العجيبة 🔤</h2>
            <p className="text-xs sm:text-sm text-slate-500">مناسبة للأعمار: من 3 إلى 6 سنوات</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-100/70 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
            جولة {round} من 5
          </div>
          <button
            onClick={() => sounds.speakArabic(`أين حرف ${target.nameAr}؟ مثل ${target.wordAr}`)}
            className="p-2 bg-amber-50 rounded-xl text-amber-700 hover:bg-amber-100 transition"
            title="إعادة نطق الحرف"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <>
          {/* Target card */}
          <div className="text-center py-6 px-4 bg-amber-50/50 rounded-2xl mb-8 flex flex-col items-center">
            <span className="text-5xl sm:text-6xl mb-2">{target.emoji}</span>
            <p className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
              أين حرف <span className="text-amber-600 underline decoration-amber-300">({target.nameAr})</span>؟
            </p>
            <p className="text-slate-500 text-sm">مثل كلمة: <span className="font-bold text-slate-700">{target.wordAr}</span></p>

            {feedback && (
              <div className="mt-4 inline-flex items-center gap-2 text-base font-bold text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span>{feedback}</span>
              </div>
            )}
          </div>

          {/* Letter Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {choices.map((item) => (
              <button
                key={item.letter}
                onClick={() => handleChoice(item)}
                className="h-44 rounded-3xl bg-amber-50/30 hover:bg-amber-100/60 border-2 border-amber-200 hover:border-amber-400 p-6 flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-xs"
              >
                <span className="text-6xl sm:text-7xl font-black text-amber-950 font-serif leading-none">
                  {item.letter}
                </span>
                <span className="text-xs font-bold text-slate-500">حرف {item.nameAr}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">مبارك يا بطل الحروف! 🌟</h3>
          <p className="text-slate-600 mb-6 text-base">
            لقد تعرفت على الحروف العربية وربطتها بالكلمات المصورة بامتياز!
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
