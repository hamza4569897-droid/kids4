import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../lib/audio';
import { RefreshCw, Trophy, ArrowRight, Check } from 'lucide-react';

interface SortItem {
  id: string;
  nameAr: string;
  emoji: string;
  category: 'fruit' | 'veg';
}

const ITEMS_POOL: SortItem[] = [
  { id: '1', nameAr: 'تفاحة', emoji: '🍎', category: 'fruit' },
  { id: '2', nameAr: 'جزرة', emoji: '🥕', category: 'veg' },
  { id: '3', nameAr: 'موزة', emoji: '🍌', category: 'fruit' },
  { id: '4', nameAr: 'خيار', emoji: '🥒', category: 'veg' },
  { id: '5', nameAr: 'فراولة', emoji: '🍓', category: 'fruit' },
  { id: '6', nameAr: 'طماطم', emoji: '🍅', category: 'veg' },
];

export const SortingGame: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [remainingItems, setRemainingItems] = useState<SortItem[]>(ITEMS_POOL);
  const [selectedItem, setSelectedItem] = useState<SortItem | null>(null);
  const [fruitBasket, setFruitBasket] = useState<SortItem[]>([]);
  const [vegBasket, setVegBasket] = useState<SortItem[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSelectItem = (item: SortItem) => {
    sounds.playPop();
    sounds.speakArabic(item.nameAr);
    setSelectedItem(item);
    setFeedback(`اخترت: ${item.nameAr}، أين نضعها؟`);
  };

  const handlePlaceInBasket = (basketType: 'fruit' | 'veg') => {
    if (!selectedItem) {
      sounds.playTryAgain();
      setFeedback('المس عنصراً أولاً ثم ضعه في الصندوق المناسب!');
      return;
    }

    if (selectedItem.category === basketType) {
      sounds.playChime();
      const current = selectedItem;
      setSelectedItem(null);
      setRemainingItems((prev) => prev.filter((i) => i.id !== current.id));

      if (basketType === 'fruit') {
        setFruitBasket((prev) => [...prev, current]);
      } else {
        setVegBasket((prev) => [...prev, current]);
      }

      setFeedback(`رائع! ${current.nameAr} وُضعت في مكانها الصحيح 🌟`);

      // Check win condition
      if (remainingItems.length === 1) {
        sounds.playCheer();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        setIsCompleted(true);
      }
    } else {
      sounds.playTryAgain();
      setFeedback(`مهلاً يا بطل، هل ${selectedItem.nameAr} من ${basketType === 'fruit' ? 'الفواكه' : 'الخضروات'}؟`);
    }
  };

  const restart = () => {
    setRemainingItems(ITEMS_POOL);
    setSelectedItem(null);
    setFruitBasket([]);
    setVegBasket([]);
    setFeedback('');
    setIsCompleted(false);
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
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900">فرز وتصنيف الفواكه والخضار 🧺</h2>
            <p className="text-xs sm:text-sm text-slate-500">المس العنصر ثم اختر الصندوق المناسب له</p>
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <>
          {feedback && (
            <div className="mb-4 text-center text-sm font-bold text-amber-900 bg-amber-50 py-2 px-4 rounded-full">
              {feedback}
            </div>
          )}

          {/* Items Pool */}
          <div className="mb-8 p-4 bg-amber-50/40 rounded-2xl border border-amber-200">
            <p className="text-xs font-bold text-slate-600 mb-3 text-center">العناصر المطلوب تصنيفها:</p>
            <div className="flex flex-wrap items-center justify-center gap-3 min-h-[70px]">
              {remainingItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm transition-all transform active:scale-95 shadow-xs ${
                    selectedItem?.id === item.id
                      ? 'bg-amber-500 text-white ring-4 ring-amber-300 scale-105'
                      : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span>{item.nameAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Destination Baskets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Fruit Basket */}
            <button
              onClick={() => handlePlaceInBasket('fruit')}
              className="h-56 rounded-3xl bg-rose-50/60 hover:bg-rose-100/70 border-2 border-dashed border-rose-300 p-5 flex flex-col items-center justify-between transition-all group"
            >
              <div className="text-center">
                <span className="text-4xl">🧺 🍎</span>
                <h3 className="text-lg font-black text-rose-950 mt-1">صندوق الفواكه اللذيذة</h3>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {fruitBasket.map((f) => (
                  <span key={f.id} className="text-2xl" title={f.nameAr}>
                    {f.emoji}
                  </span>
                ))}
                {fruitBasket.length === 0 && <span className="text-xs text-rose-400">انقر هنا لوضع الفاكهة</span>}
              </div>
              <span className="text-xs font-bold text-rose-700 bg-white px-3 py-1 rounded-full shadow-2xs">
                {fruitBasket.length} عناصر
              </span>
            </button>

            {/* Veg Basket */}
            <button
              onClick={() => handlePlaceInBasket('veg')}
              className="h-56 rounded-3xl bg-emerald-50/60 hover:bg-emerald-100/70 border-2 border-dashed border-emerald-300 p-5 flex flex-col items-center justify-between transition-all group"
            >
              <div className="text-center">
                <span className="text-4xl">🧺 🥕</span>
                <h3 className="text-lg font-black text-emerald-950 mt-1">صندوق الخضار المفيدة</h3>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {vegBasket.map((v) => (
                  <span key={v.id} className="text-2xl" title={v.nameAr}>
                    {v.emoji}
                  </span>
                ))}
                {vegBasket.length === 0 && <span className="text-xs text-emerald-400">انقر هنا لوضع الخضار</span>}
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-full shadow-2xs">
                {vegBasket.length} عناصر
              </span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">فرز مثالي لا مثيل له! 🌟</h3>
          <p className="text-slate-600 mb-6 text-base">
            لقد ميزت بين الفواكه والخضراوات وصنفت كل الأطعمة بنجاح!
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
