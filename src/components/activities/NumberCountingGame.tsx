import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../lib/audio';
import { Volume2, RefreshCw, Trophy, ArrowRight, Sparkles } from 'lucide-react';

const ARABIC_DIGITS: { [key: number]: string } = {
  1: '١',
  2: '٢',
  3: '٣',
  4: '٤',
  5: '٥',
  6: '٦',
  7: '٧',
  8: '٨',
  9: '٩',
  10: '١٠',
};

const OBJECTS_EMOJIS = ['⭐', '🍎', '🐥', '🎈', '🍓', '🚗'];

export const NumberCountingGame: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [targetCount, setTargetCount] = useState<number>(3);
  const [emoji, setEmoji] = useState<string>('⭐');
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [choices, setChoices] = useState<number[]>([]);
  const [round, setRound] = useState<number>(1);
  const [feedback, setFeedback] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const startRound = (r: number) => {
    // Generate count between 1 and 6 for toddlers, or up to 8
    const count = Math.floor(Math.random() * 6) + 1;
    const selectedEmoji = OBJECTS_EMOJIS[Math.floor(Math.random() * OBJECTS_EMOJIS.length)];

    // Generate 3 choices including targetCount
    const pool = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => n !== count);
    const shuffledPool = pool.sort(() => 0.5 - Math.random());
    const roundChoices = [count, shuffledPool[0], shuffledPool[1]].sort(() => 0.5 - Math.random());

    setTargetCount(count);
    setEmoji(selectedEmoji);
    setTappedIndices([]);
    setChoices(roundChoices);
    setFeedback('');

    setTimeout(() => {
      sounds.speakArabic(`كم عدداً ترى على الشاشة؟ هيا نعد معاً!`);
    }, 200);
  };

  useEffect(() => {
    startRound(1);
  }, []);

  const handleTapObject = (index: number) => {
    sounds.playPop();
    if (!tappedIndices.includes(index)) {
      const next = [...tappedIndices, index];
      setTappedIndices(next);
      sounds.speakArabic(ARABIC_DIGITS[next.length] || String(next.length));
    }
  };

  const handleChoice = (picked: number) => {
    sounds.playPop();
    if (picked === targetCount) {
      sounds.playChime();
      setFeedback(`إجابة صحيحة! العدد هو ${picked} (${ARABIC_DIGITS[picked]}) 🌟`);

      if (round >= 5) {
        sounds.playCheer();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        setIsCompleted(true);
      } else {
        setTimeout(() => {
          setRound((r) => r + 1);
          startRound(round + 1);
        }, 1400);
      }
    } else {
      sounds.playTryAgain();
      setFeedback(`حاول مرة أخرى يا بطل، المس العناصر لكي تعدها بسهولة ✨`);
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
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900">عد النجوم والمرح 🔢</h2>
            <p className="text-xs sm:text-sm text-slate-500">مناسبة للأعمار: من 2 إلى 5 سنوات</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-100/70 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
            جولة {round} من 5
          </div>
          <button
            onClick={() => sounds.speakArabic(`كم عدداً ترى على الشاشة؟`)}
            className="p-2 bg-amber-50 rounded-xl text-amber-700 hover:bg-amber-100 transition"
            title="إعادة السؤال"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <>
          {/* Objects to count */}
          <div className="text-center py-6 px-4 bg-amber-50/40 rounded-2xl mb-8">
            <p className="text-slate-600 mb-4 font-medium text-sm sm:text-base">
              المس العناصر وعدها بصوت عالٍ:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 min-h-[120px]">
              {Array.from({ length: targetCount }).map((_, idx) => {
                const isTapped = tappedIndices.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleTapObject(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl transition-all transform hover:scale-110 active:scale-95 shadow-xs ${
                      isTapped ? 'bg-amber-200/70 scale-105 ring-2 ring-amber-400' : 'bg-white'
                    }`}
                  >
                    <span>{emoji}</span>
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className="mt-4 inline-flex items-center gap-2 text-base font-bold text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span>{feedback}</span>
              </div>
            )}
          </div>

          {/* Number choices */}
          <div className="text-center mb-3">
            <p className="text-slate-700 font-bold text-base mb-3">اختر الرقم الصحيح:</p>
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto">
              {choices.map((num) => (
                <button
                  key={num}
                  onClick={() => handleChoice(num)}
                  className="h-24 sm:h-28 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-black text-3xl sm:text-4xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <span className="font-serif">{ARABIC_DIGITS[num]}</span>
                  <span className="text-xs font-semibold text-slate-500 mt-1">({num})</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">ما شاء الله، بطل الحساب! 🌟</h3>
          <p className="text-slate-600 mb-6 text-base">
            لقد أتقنت عد العناصر والربط بالأرقام بدقة وسرعة رائعة!
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
