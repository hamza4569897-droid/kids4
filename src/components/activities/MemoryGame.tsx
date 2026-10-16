import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../lib/audio';
import { RefreshCw, Trophy, ArrowRight, Settings } from 'lucide-react';

interface Card {
  id: number;
  emoji: string;
  nameAr: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARDS_POOL = [
  { emoji: '🐱', nameAr: 'قطة' },
  { emoji: '🐶', nameAr: 'كلب' },
  { emoji: '🐰', nameAr: 'أرنب' },
  { emoji: '🦁', nameAr: 'أسد' },
  { emoji: '🐬', nameAr: 'دلفين' },
  { emoji: '🐥', nameAr: 'كتكوت' },
];

export const MemoryGame: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [totalPairs, setTotalPairs] = useState<number>(3); // 3 pairs = 6 cards default
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  const initGame = (pairsCount: number) => {
    const selected = CARDS_POOL.slice(0, pairsCount);
    const deck: Card[] = [];

    selected.forEach((item, idx) => {
      deck.push({ id: idx * 2, emoji: item.emoji, nameAr: item.nameAr, isFlipped: false, isMatched: false });
      deck.push({ id: idx * 2 + 1, emoji: item.emoji, nameAr: item.nameAr, isFlipped: false, isMatched: false });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame(totalPairs);
  }, [totalPairs]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    sounds.playPop();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;

      if (cards[first].emoji === cards[second].emoji) {
        sounds.playChime();
        sounds.speakArabic(cards[first].nameAr);
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].isMatched = true;
            updated[second].isMatched = true;

            const allMatched = updated.every((c) => c.isMatched);
            if (allMatched) {
              sounds.playCheer();
              confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
              setIsWon(true);
            }
            return updated;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        sounds.playTryAgain();
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].isFlipped = false;
            updated[second].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-100">
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
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900">لعبة بطاقات الذاكرة المرحة 🧠</h2>
            <p className="text-xs sm:text-sm text-slate-500">حركات: {moves}</p>
          </div>
        </div>

        {/* Parent difficulty selector */}
        <div className="flex items-center gap-2 bg-amber-50/70 p-1.5 rounded-2xl border border-amber-200">
          <Settings className="w-4 h-4 text-amber-700 ml-1" />
          <span className="text-xs font-bold text-slate-600">المستوى:</span>
          {[2, 3, 4, 6].map((p) => (
            <button
              key={p}
              onClick={() => setTotalPairs(p)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                totalPairs === p
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              {p * 2} بطاقات
            </button>
          ))}
        </div>
      </div>

      {!isWon ? (
        <div
          className={`grid gap-3 sm:gap-4 mb-6 ${
            totalPairs <= 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3 sm:grid-cols-4'
          }`}
        >
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-28 sm:h-36 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-xs ${
                card.isFlipped || card.isMatched
                  ? 'bg-amber-100/70 border-2 border-amber-300 scale-100'
                  : 'bg-amber-400 hover:bg-amber-500 text-white border-2 border-amber-500'
              }`}
              disabled={card.isFlipped || card.isMatched}
              aria-label={card.isFlipped || card.isMatched ? card.nameAr : 'بطاقة مخفية'}
            >
              {card.isFlipped || card.isMatched ? (
                <>
                  <span className="text-4xl sm:text-5xl">{card.emoji}</span>
                  <span className="text-xs font-bold text-amber-900 mt-1">{card.nameAr}</span>
                </>
              ) : (
                <span className="text-3xl text-amber-100/80 font-black">⭐</span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">ذاكرة حديدية خارقة! 🌟</h3>
          <p className="text-slate-600 mb-6 text-base">
            لقد طابقت جميع البطاقات خلال {moves} محاولة فقط!
          </p>
          <button
            onClick={() => initGame(totalPairs)}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            <span>العب جولة جديدة</span>
          </button>
        </div>
      )}
    </div>
  );
};
