import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Eye,
  Search,
  CheckCircle2,
  Award,
  Layers,
  Edit3
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { AgeGroup } from '../../types/worksheet';

interface ObservationFocusHubProps {
  onBack?: () => void;
  onOpenWorksheet?: () => void;
  initialAge?: AgeGroup;
}

type TabType = 'hidden_item' | 'i_spy_count' | 'motor_tracing' | 'mini_puzzle';

// Hidden Item Scenes
const HIDDEN_SCENES = [
  {
    title: 'في حديقة الفراشات والزهور 🌸',
    targetItem: 'نحلة صغيرة',
    targetEmoji: '🐝',
    sceneItems: [
      { emoji: '🌸', x: '15%', y: '20%' },
      { emoji: '🌿', x: '35%', y: '50%' },
      { emoji: '🦋', x: '60%', y: '25%' },
      { emoji: '🐝', x: '78%', y: '70%', isTarget: true },
      { emoji: '🌻', x: '25%', y: '75%' },
      { emoji: '🐞', x: '45%', y: '20%' },
      { emoji: '🌺', x: '85%', y: '30%' },
    ],
  },
  {
    title: 'في أعماق البحر الأزرق 🌊',
    targetItem: 'نجمة البحر اللامعة',
    targetEmoji: '⭐',
    sceneItems: [
      { emoji: '🐟', x: '20%', y: '30%' },
      { emoji: '🐠', x: '50%', y: '20%' },
      { emoji: '🦀', x: '30%', y: '70%' },
      { emoji: '⭐', x: '82%', y: '75%', isTarget: true },
      { emoji: '🐙', x: '65%', y: '55%' },
      { emoji: '🐡', x: '15%', y: '65%' },
    ],
  },
];

// Mini Puzzle Pieces
const PUZZLE_SAMPLES = [
  { name: 'سيارة السباق الحمراء', visual: '🏎️', parts: ['عجلات قوية', 'هيكل أحمر', 'مقود سريع', 'أضواء لامعة'] },
  { name: 'البيت الدافئ', visual: '🏡', parts: ['سقف مثلث', 'باب خشبي', 'نافذة زرقاء', 'حديقة زهور'] },
];

export const ObservationFocusHubActivity: React.FC<ObservationFocusHubProps> = ({
  onBack,
  onOpenWorksheet,
  initialAge = '3-4',
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAge);
  const [activeTab, setActiveTab] = useState<TabType>('hidden_item');
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  // 1. Hidden Item State
  const [sceneIndex, setSceneIndex] = useState(0);

  // 2. I Spy & Count State
  const [targetCountItem, setTargetCountItem] = useState({ name: 'البط الصغير', emoji: '🦆', count: 4 });
  const [spyScene, setSpyScene] = useState([
    '🦆', '🐸', '🦆', '🌿', '🦆', '💧', '🦆', '🌸', '🐸'
  ]);

  // 3. Motor Line Tracing State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineType, setLineType] = useState<'wave' | 'zigzag' | 'loops'>('wave');

  const currentScene = HIDDEN_SCENES[sceneIndex % HIDDEN_SCENES.length];

  const handleItemClick = (isTarget?: boolean) => {
    sounds.playPop();
    if (isTarget) {
      sounds.playCheer();
      setFeedback(`وجدت ${currentScene.targetItem} ${currentScene.targetEmoji} ببراعة! قوة ملاحظتك مدهشة 🌟👏`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 35, spread: 60 });
      sounds.speakArabic(`ممتاز! وجدت ${currentScene.targetItem}`);
      setTimeout(() => {
        setSceneIndex((prev) => prev + 1);
        setFeedback('');
      }, 2000);
    } else {
      sounds.playTryAgain();
      setFeedback(`ابحث عن: ${currentScene.targetItem} ${currentScene.targetEmoji} في المشهد 😊`);
    }
  };

  const handlePickSpyCount = (num: number) => {
    sounds.playPop();
    if (num === targetCountItem.count) {
      sounds.playCheer();
      setFeedback(`عدّ دقيق وملاحظة مذهلة! العدد هو (${num}) 🌟🎉`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 35, spread: 60 });
    } else {
      sounds.playTryAgain();
      setFeedback(`المس كل ${targetCountItem.emoji} وعدّها واحدة تلو الأخرى 😊`);
    }
  };

  // Motor line canvas draw
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
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#06b6d4';
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cyan-200/80 shadow-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyan-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 transition"
              title="رجوع إلى مركز الأنشطة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full">
              الملاحظة والتركيز والانتباه 🔍👁️
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              تمارين العين واليد ودقة الملاحظة
            </h2>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-cyan-50 border border-cyan-200 px-3.5 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-extrabold text-cyan-900">{stars} وسام تركيز</span>
          </div>
          {onOpenWorksheet && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorksheet();
              }}
              className="text-xs font-bold text-cyan-700 bg-cyan-100/70 hover:bg-cyan-200 px-3 py-1.5 rounded-xl transition"
            >
              📄 ورقة عمل الملاحظة
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'hidden_item', label: 'أين الشيء؟ (البحث عن المخفي)', icon: Search },
            { id: 'i_spy_count', label: 'ابحث وعدّ (I Spy)', icon: Eye },
            { id: 'motor_tracing', label: 'تتبع المسارات الحركية', icon: Edit3 },
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
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-cyan-50 text-slate-700 hover:bg-cyan-100'
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
                  ? 'bg-white text-cyan-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {age === '2-3' ? '2-3 سنوات' : age === '3-4' ? '3-4 سنوات' : age === '4-5' ? '4-5 سنوات' : '5-6 سنوات'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Where is the Item? */}
      {activeTab === 'hidden_item' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 px-4 py-2 rounded-2xl">
              <span className="text-sm sm:text-base font-extrabold text-slate-800">
                ابحث عن: <span className="text-cyan-700 text-lg font-black">[{currentScene.targetItem} {currentScene.targetEmoji}]</span> داخل الرسمة!
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentScene.title}</p>
          </div>

          {/* Interactive Scene Canvas */}
          <div className="relative w-full max-w-xl h-72 sm:h-80 mx-auto rounded-3xl bg-gradient-to-b from-cyan-50 via-sky-50 to-emerald-50/40 border-2 border-cyan-200 shadow-inner overflow-hidden select-none">
            {currentScene.sceneItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleItemClick(item.isTarget)}
                style={{ top: item.y, left: item.x }}
                className="absolute text-4xl sm:text-5xl hover:scale-125 transition-transform cursor-pointer"
              >
                {item.emoji}
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-cyan-800 animate-bounce">{feedback}</p>}
        </div>
      )}

      {/* TAB 2: I Spy & Count */}
      {activeTab === 'i_spy_count' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              كم عدداً من <span className="text-cyan-700">({targetCountItem.name} {targetCountItem.emoji})</span> ترى في الصورة؟
            </h3>
            <p className="text-xs text-slate-500">عدّ البطات الصفراء فقط وتجاهل باقي الكائنات اللطيفة.</p>
          </div>

          <div className="p-6 rounded-3xl bg-cyan-50/60 border border-cyan-200 max-w-lg mx-auto flex flex-wrap items-center justify-center gap-4 text-4xl sm:text-5xl">
            {spyScene.map((emoji, idx) => (
              <span key={idx} className="hover:scale-110 transition cursor-pointer select-none">
                {emoji}
              </span>
            ))}
          </div>

          {/* Answer Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {[2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => handlePickSpyCount(num)}
                className="w-16 h-16 rounded-2xl bg-white border-2 border-cyan-300 hover:border-cyan-600 hover:scale-110 active:scale-95 text-3xl font-black text-cyan-950 shadow-sm transition cursor-pointer"
              >
                {num}
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-cyan-800 animate-bounce">{feedback}</p>}
        </div>
      )}

      {/* TAB 3: Motor Line Tracing */}
      {activeTab === 'motor_tracing' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              تتبع الخطوط والمسارات المنحنية 〰️
            </h3>
            <p className="text-xs text-slate-500">
              ارسم مسار الفأرة أو إصبعك من البداية إلى النهاية لتدريب التناسق البصري الحركي.
            </p>
          </div>

          <div className="relative w-full max-w-lg h-56 mx-auto rounded-3xl border-4 border-dashed border-cyan-300 bg-cyan-50/40 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Background Faint Guides */}
            <div className="absolute inset-0 flex items-center justify-between px-8 text-slate-300 text-4xl select-none pointer-events-none">
              <span>🚗</span>
              <span className="text-5xl font-black opacity-30">〰️〰️〰️</span>
              <span>🏁</span>
            </div>

            <canvas
              ref={canvasRef}
              width={480}
              height={220}
              className="absolute inset-0 cursor-crosshair touch-none"
              onMouseDown={handleStartDraw}
              onMouseMove={handleDrawMove}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
              onTouchStart={handleStartDraw}
              onTouchMove={handleDrawMove}
              onTouchEnd={() => setIsDrawing(false)}
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
              <span>مسح الخط</span>
            </button>
            <button
              onClick={() => {
                sounds.playCheer();
                setStars((prev) => prev + 1);
                confetti({ particleCount: 30, spread: 60 });
              }}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>وصلت إلى خط النهاية!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
