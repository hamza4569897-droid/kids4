import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Brain,
  CheckCircle2,
  Award,
  Layers,
  Eye,
  Clock
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { AgeGroup } from '../../types/worksheet';

interface LogicMemoryHubProps {
  onBack?: () => void;
  onOpenWorksheet?: () => void;
  initialAge?: AgeGroup;
}

type TabType = 'memory' | 'shadow' | 'daily_routine' | 'differences';

const ROUTINE_STEPS = [
  { id: '1', title: 'الاستيقاظ والابتسام', visual: '☀️🛌', order: 1 },
  { id: '2', title: 'غسل الوجه والأسنان', visual: '🪥💧', order: 2 },
  { id: '3', title: 'تناول الفطور الصحي', visual: '🍳🥛', order: 3 },
  { id: '4', title: 'ارتداء الملابس والانطلاق', visual: '🎒👟', order: 4 },
];

const SHADOW_PAIRS = [
  { item: 'فيل لطيف', visual: '🐘', shadow: '⬛ (ظل الفيل بخرطومه الطويل)', emoji: '🐘' },
  { item: 'طائرة محلقة', visual: '✈️', shadow: '⬛ (ظل الطائرة بأجنحتها)', emoji: '✈️' },
  { item: 'فراشة رقيقة', visual: '🦋', shadow: '⬛ (ظل الفراشة بأجنحتها المنحنية)', emoji: '🦋' },
  { item: 'شجرة مثمرة', visual: '🌳', shadow: '⬛ (ظل الشجرة بجذعها وأغصانها)', emoji: '🌳' },
];

interface MemoryCard {
  id: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const LogicMemoryHubActivity: React.FC<LogicMemoryHubProps> = ({
  onBack,
  onOpenWorksheet,
  initialAge = '3-4',
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAge);
  const [activeTab, setActiveTab] = useState<TabType>('memory');
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  // 1. Memory Game State
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // 2. Routine Sequence State
  const [routineItems, setRoutineItems] = useState(ROUTINE_STEPS);
  const [pickedSequence, setPickedSequence] = useState<typeof ROUTINE_STEPS>([]);

  // 3. Shadow Matching State
  const [shadowPair, setShadowPair] = useState(SHADOW_PAIRS[0]);
  const [shadowChoices, setShadowChoices] = useState<typeof SHADOW_PAIRS>([]);

  // Initialize Memory Game based on age
  const initMemoryGame = () => {
    const emojisPool = ['🍎', '🍌', '🚗', '⭐', '🐶', '🐱'];
    // 2-3 years: 2 pairs (4 cards: 2x2)
    // 3-4 years: 3 pairs (6 cards: 2x3)
    // 4-5 years: 4 pairs (8 cards: 2x4)
    // 5-6 years: 6 pairs (12 cards: 3x4)
    const pairsCount = selectedAge === '2-3' ? 2 : selectedAge === '3-4' ? 3 : selectedAge === '4-5' ? 4 : 6;
    const selectedEmojis = emojisPool.slice(0, pairsCount);
    const deck: MemoryCard[] = [];

    selectedEmojis.forEach((emoji, i) => {
      deck.push({ id: `${i}-a`, emoji, isFlipped: false, isMatched: false });
      deck.push({ id: `${i}-b`, emoji, isFlipped: false, isMatched: false });
    });

    deck.sort(() => 0.5 - Math.random());
    setCards(deck);
    setFlippedIndices([]);
    setFeedback('');
  };

  // Initialize Shadow Matching
  const initShadowRound = () => {
    const shuffled = [...SHADOW_PAIRS].sort(() => 0.5 - Math.random());
    const target = shuffled[0];
    const choices = shuffled.slice(0, 3).sort(() => 0.5 - Math.random());

    setShadowPair(target);
    setShadowChoices(choices);
    setFeedback('');
    sounds.speakArabic(`ما هو الشيء الذي يطابق هذا الظل؟`);
  };

  useEffect(() => {
    if (activeTab === 'memory') initMemoryGame();
    else if (activeTab === 'shadow') initShadowRound();
    else if (activeTab === 'daily_routine') {
      setRoutineItems([...ROUTINE_STEPS].sort(() => 0.5 - Math.random()));
      setPickedSequence([]);
      setFeedback('');
    }
  }, [activeTab, selectedAge]);

  // Memory Card Click
  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) return;
    sounds.playPop();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].emoji === newCards[secondIdx].emoji) {
        sounds.playChime();
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);

        // Check if all matched
        if (newCards.every((c) => c.isMatched)) {
          sounds.playCheer();
          setFeedback('رائع يا ذكي! طابقت جميع البطاقات بنجاح! 🌟👏');
          setStars((prev) => prev + 2);
          confetti({ particleCount: 40, spread: 70 });
        }
      } else {
        sounds.playTryAgain();
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handlePickRoutineStep = (step: (typeof ROUTINE_STEPS)[0]) => {
    sounds.playPop();
    const nextOrder = pickedSequence.length + 1;
    if (step.order === nextOrder) {
      sounds.playChime();
      const newSequence = [...pickedSequence, step];
      setPickedSequence(newSequence);
      setRoutineItems(routineItems.filter((item) => item.id !== step.id));

      if (newSequence.length === ROUTINE_STEPS.length) {
        sounds.playCheer();
        setFeedback('ترتيب مثالي! يومك منظم وجميل مثل الكبار! 🌟🎉');
        setStars((prev) => prev + 2);
        confetti({ particleCount: 40, spread: 70 });
      }
    } else {
      sounds.playTryAgain();
      setFeedback(`ما هي الخطوة رقم (${nextOrder}) في الصباح؟ فكر مجدداً 😊`);
    }
  };

  const handleShadowSelect = (item: (typeof SHADOW_PAIRS)[0]) => {
    sounds.playPop();
    if (item.visual === shadowPair.visual) {
      sounds.playCheer();
      setFeedback(`مطابقة ظل مذهلة! هذا ظل ${shadowPair.item} ${shadowPair.visual} 🌟👏`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 30, spread: 60 });
      setTimeout(initShadowRound, 1600);
    } else {
      sounds.playTryAgain();
      setFeedback('انظر إلى تفاصيل الظل وحجمه بدقة، وحاول مجدداً 😊');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200/80 shadow-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-800 transition"
              title="رجوع إلى مركز الأنشطة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              التفكير المنطقي والذاكرة 🧠💡
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              ألعاب الذاكرة البصرية والمطابقة المنطقية
            </h2>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-extrabold text-purple-900">{stars} وسام ذكاء</span>
          </div>
          {onOpenWorksheet && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorksheet();
              }}
              className="text-xs font-bold text-purple-700 bg-purple-100/70 hover:bg-purple-200 px-3 py-1.5 rounded-xl transition"
            >
              📄 ورقة عمل الذاكرة
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'memory', label: 'لعبة بطاقات الذاكرة', icon: Brain },
            { id: 'shadow', label: 'مطابقة الظلال', icon: Eye },
            { id: 'daily_routine', label: 'تسلسل الروتين اليومي', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab.id as TabType);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 text-slate-700 hover:bg-purple-100'
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
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {age === '2-3' ? '2-3 سنوات' : age === '3-4' ? '3-4 سنوات' : age === '4-5' ? '4-5 سنوات' : '5-6 سنوات'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Memory Game */}
      {activeTab === 'memory' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              اقلب البطاقات وابحث عن الصورتين المتطابقتين! 🃏
            </h3>
            <p className="text-xs text-slate-500">
              شبكة ملائمة لعمر {selectedAge} سنوات لتنشيط الذاكرة قصيرة المدى.
            </p>
          </div>

          <div
            className={`grid gap-3 sm:gap-4 max-w-lg mx-auto ${
              cards.length <= 4 ? 'grid-cols-2 max-w-xs' : cards.length <= 6 ? 'grid-cols-3 max-w-sm' : 'grid-cols-4'
            }`}
          >
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-3xl border-2 text-4xl sm:text-5xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                  card.isFlipped || card.isMatched
                    ? 'bg-purple-100 border-purple-400 rotate-0'
                    : 'bg-purple-600 border-purple-700 hover:bg-purple-500 text-transparent'
                }`}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '⭐'}
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-purple-800 animate-bounce">{feedback}</p>}

          <button
            onClick={() => {
              sounds.playPop();
              initMemoryGame();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>لعبة جديدة</span>
          </button>
        </div>
      )}

      {/* TAB 2: Shadow Matching */}
      {activeTab === 'shadow' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-2">
            <div className="w-28 h-28 mx-auto rounded-3xl bg-slate-900 text-slate-600 flex items-center justify-center text-6xl shadow-inner select-none filter contrast-200">
              {shadowPair.visual}
            </div>
            <h3 className="text-lg font-black text-slate-800">
              من صاحب هذا الظل الداكن؟
            </h3>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2">
            {shadowChoices.map((choice) => (
              <button
                key={choice.item}
                onClick={() => handleShadowSelect(choice)}
                className="w-24 h-28 sm:w-28 sm:h-32 rounded-3xl bg-white border-2 border-purple-200 hover:border-purple-600 hover:scale-105 active:scale-95 transition flex flex-col items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span className="text-5xl">{choice.visual}</span>
                <span className="text-xs font-black text-slate-700">{choice.item}</span>
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-purple-800 animate-bounce">{feedback}</p>}
        </div>
      )}

      {/* TAB 3: Daily Routine Sequencing */}
      {activeTab === 'daily_routine' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              رتب خطوات الصباح الجميل بالترتيب الصحيح 🌅
            </h3>
            <p className="text-xs text-slate-500">اختر الخطوة الأولى أولاً، ثم التي تليها حتى يكتمل يومك بنجاح.</p>
          </div>

          {/* Finished Steps Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-3 min-h-16 p-4 rounded-3xl bg-purple-50/60 border border-purple-200 max-w-2xl mx-auto">
            {pickedSequence.length === 0 && (
              <span className="text-xs font-bold text-slate-400">انقر على أول شيء تفعله في الصباح...</span>
            )}
            {pickedSequence.map((step, idx) => (
              <div
                key={step.id}
                className="px-4 py-2.5 rounded-2xl bg-white border border-purple-300 shadow-2xs flex items-center gap-2 text-xs font-bold text-purple-950 animate-fadeIn"
              >
                <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center text-[10px] font-black">
                  {idx + 1}
                </span>
                <span className="text-lg">{step.visual}</span>
                <span>{step.title}</span>
              </div>
            ))}
          </div>

          {/* Remaining Options */}
          {routineItems.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {routineItems.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handlePickRoutineStep(step)}
                  className="p-4 rounded-3xl bg-white border-2 border-slate-200 hover:border-purple-500 hover:scale-105 active:scale-95 transition flex items-center gap-3 shadow-xs cursor-pointer"
                >
                  <span className="text-3xl">{step.visual}</span>
                  <span className="font-black text-sm text-slate-800">{step.title}</span>
                </button>
              ))}
            </div>
          )}

          {feedback && <p className="text-base font-extrabold text-purple-800 animate-bounce">{feedback}</p>}
        </div>
      )}
    </div>
  );
};
