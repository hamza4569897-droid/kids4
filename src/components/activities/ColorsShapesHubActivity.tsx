import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Palette,
  Eye,
  CheckCircle2,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { AgeGroup } from '../../types/worksheet';

interface ColorsShapesHubProps {
  onBack?: () => void;
  onOpenWorksheet?: () => void;
  initialAge?: AgeGroup;
}

type TabType = 'colors' | 'match_objects' | 'sort_colors' | 'odd_shape' | 'mini_studio';

const COLOR_ITEMS = [
  { id: 'red', nameAr: 'أحمر', hex: '#ef4444', icon: '🔴', sample: 'فراولة وتفاح وطماطم 🍓🍎🍅', shapeCue: 'دائرة' },
  { id: 'yellow', nameAr: 'أصفر', hex: '#eab308', icon: '🟡', sample: 'شمس وموز وليمون ☀️🍌🍋', shapeCue: 'نجمة' },
  { id: 'blue', nameAr: 'أزرق', hex: '#3b82f6', icon: '🔵', sample: 'بحر وسماء ودلفين 🌊☁️🐬', shapeCue: 'مربع' },
  { id: 'green', nameAr: 'أخضر', hex: '#22c55e', icon: '🟢', sample: 'شجرة وورقة وخيار 🌳🍃🥒', shapeCue: 'مثلث' },
  { id: 'orange', nameAr: 'برتقالي', hex: '#f97316', icon: '🟠', sample: 'برتقال وجزر وثعلب 🍊🥕🦊', shapeCue: 'معين' },
  { id: 'purple', nameAr: 'بنفسجي', hex: '#a855f7', icon: '🟣', sample: 'عنب وباذنجان 🍇🍆', shapeCue: 'بيضاوي' },
];

const OBJECTS_BY_COLOR = [
  { item: 'فراولة', emoji: '🍓', colorId: 'red', colorName: 'أحمر' },
  { item: 'موزة', emoji: '🍌', colorId: 'yellow', colorName: 'أصفر' },
  { item: 'قطرة ماء', emoji: '💧', colorId: 'blue', colorName: 'أزرق' },
  { item: 'ورقة شجر', emoji: '🍃', colorId: 'green', colorName: 'أخضر' },
  { item: 'جزرة', emoji: '🥕', colorId: 'orange', colorName: 'برتقالي' },
  { item: 'عنب', emoji: '🍇', colorId: 'purple', colorName: 'بنفسجي' },
];

export const ColorsShapesHubActivity: React.FC<ColorsShapesHubProps> = ({
  onBack,
  onOpenWorksheet,
  initialAge = '3-4',
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAge);
  const [activeTab, setActiveTab] = useState<TabType>('colors');
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  // 1. Color Match to Object State
  const [targetObject, setTargetObject] = useState(OBJECTS_BY_COLOR[0]);
  const [colorChoices, setColorChoices] = useState(COLOR_ITEMS.slice(0, 3));

  // 2. Odd Shape Discovery State
  const [oddShapesSet, setOddShapesSet] = useState<string[]>(['⬛', '⬛', '⚪', '⬛']);
  const [oddCorrectIndex, setOddCorrectIndex] = useState<number>(2);

  // 3. Mini Coloring Studio State
  const [selectedFillColor, setSelectedFillColor] = useState<string>('#ef4444');
  const [starColor, setStarColor] = useState<string>('#ffffff');
  const [circleColor, setCircleColor] = useState<string>('#ffffff');
  const [heartColor, setHeartColor] = useState<string>('#ffffff');

  const initObjectMatchRound = () => {
    const shuffledObjs = [...OBJECTS_BY_COLOR].sort(() => 0.5 - Math.random());
    const obj = shuffledObjs[0];
    const correctColor = COLOR_ITEMS.find((c) => c.id === obj.colorId)!;
    const distractors = COLOR_ITEMS.filter((c) => c.id !== obj.colorId).sort(() => 0.5 - Math.random()).slice(0, 2);
    const choices = [correctColor, ...distractors].sort(() => 0.5 - Math.random());

    setTargetObject(obj);
    setColorChoices(choices);
    setFeedback('');
    sounds.speakArabic(`ما هو لون ${obj.item}؟`);
  };

  const initOddShapeRound = () => {
    const normalShapes = ['⬛', '🔺', '⭐', '⚪'];
    const normal = normalShapes[Math.floor(Math.random() * normalShapes.length)];
    let odd = normalShapes[Math.floor(Math.random() * normalShapes.length)];
    while (odd === normal) {
      odd = normalShapes[Math.floor(Math.random() * normalShapes.length)];
    }

    const arr = [normal, normal, normal, normal];
    const oddIdx = Math.floor(Math.random() * 4);
    arr[oddIdx] = odd;

    setOddShapesSet(arr);
    setOddCorrectIndex(oddIdx);
    setFeedback('');
    sounds.speakArabic('المس الشكل المختلف الذي لا ينتمي للمجموعة');
  };

  useEffect(() => {
    if (activeTab === 'match_objects') initObjectMatchRound();
    else if (activeTab === 'odd_shape') initOddShapeRound();
  }, [activeTab, selectedAge]);

  const handlePickColor = (color: typeof COLOR_ITEMS[0]) => {
    sounds.playPop();
    if (color.id === targetObject.colorId) {
      sounds.playChime();
      setFeedback(`إجابة صحيحة! لون ${targetObject.item} هو ${color.nameAr} 🌟👏`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 30, spread: 60 });
      sounds.speakArabic(`ممتاز! لون ${color.nameAr}`);
      setTimeout(initObjectMatchRound, 1500);
    } else {
      sounds.playTryAgain();
      setFeedback(`فكر مجدداً يا بطل: ما هو لون ${targetObject.item} الطبيعي؟ 😊`);
    }
  };

  const handlePickOddShape = (index: number) => {
    sounds.playPop();
    if (index === oddCorrectIndex) {
      sounds.playCheer();
      setFeedback('ملاحظة بارعة! اكتشفت الشكل المختلف بنجاح 🌟🎉');
      setStars((prev) => prev + 1);
      confetti({ particleCount: 35, spread: 60 });
      setTimeout(initOddShapeRound, 1600);
    } else {
      sounds.playTryAgain();
      setFeedback('هذا شكل مكرر، ابحث عن الشكل الوحيد المختلف 😊');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 transition"
              title="رجوع إلى مركز الأنشطة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
              الألوان والأشكال والإدراك البصري 🎨
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              عالم الألوان البهيجة واستكشاف الأشكال
            </h2>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-extrabold text-rose-900">{stars} إنجاز ملون</span>
          </div>
          {onOpenWorksheet && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorksheet();
              }}
              className="text-xs font-bold text-rose-700 bg-rose-100/70 hover:bg-rose-200 px-3 py-1.5 rounded-xl transition"
            >
              📄 ورقة تلوين وأشكال
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'colors', label: 'دليل الألوان والبيئة', icon: Palette },
            { id: 'match_objects', label: 'مطابقة الشيء بلونه', icon: CheckCircle2 },
            { id: 'odd_shape', label: 'اكتشف الشكل المختلف', icon: Eye },
            { id: 'mini_studio', label: 'استوديو التلوين السهل', icon: Layers },
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
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-rose-50 text-slate-700 hover:bg-rose-100'
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
                  ? 'bg-white text-rose-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {age === '2-3' ? '2-3 سنوات' : age === '3-4' ? '3-4 سنوات' : age === '4-5' ? '4-5 سنوات' : '5-6 سنوات'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Colors & Environment Guide */}
      {activeTab === 'colors' && (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              استكشف الألوان المبهجة وأمثلتها في الطبيعة 🌈
            </h3>
            <p className="text-xs text-slate-500">
              تم تزويد كل لون باسمه وشكل هندسي مرافق حتى يسهل على جميع الأطفال تمييزه بوضوح.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {COLOR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playPop();
                  sounds.speakArabic(`اللون ${item.nameAr}: ${item.sample}`);
                  setFeedback(`اللون ${item.nameAr}: نراه في ${item.sample}`);
                }}
                className="p-5 rounded-3xl border-2 border-slate-100 hover:border-rose-400 bg-slate-50/50 hover:bg-white transition text-right flex items-center gap-4 hover:scale-102 cursor-pointer shadow-xs"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md shrink-0"
                  style={{ backgroundColor: item.hex }}
                >
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-slate-900">{item.nameAr}</span>
                    <span className="text-[11px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md">
                      رمز: {item.shapeCue}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{item.sample}</p>
                </div>
              </button>
            ))}
          </div>

          {feedback && (
            <p className="text-center text-sm font-bold text-rose-800 bg-rose-50 p-2.5 rounded-2xl max-w-md mx-auto">
              {feedback}
            </p>
          )}
        </div>
      )}

      {/* TAB 2: Match Object to Color */}
      {activeTab === 'match_objects' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-2">
            <span className="text-7xl block">{targetObject.emoji}</span>
            <h3 className="text-xl font-black text-slate-800">
              ما هو لون <span className="text-rose-600 font-extrabold">{targetObject.item}</span>؟
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {colorChoices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handlePickColor(choice)}
                className="px-6 py-4 rounded-3xl bg-white border-2 border-slate-200 hover:border-rose-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xs cursor-pointer"
              >
                <span className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: choice.hex }} />
                <span className="text-lg font-black text-slate-800">{choice.nameAr}</span>
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-rose-800 animate-bounce">{feedback}</p>}
        </div>
      )}

      {/* TAB 3: Spot the Odd Shape */}
      {activeTab === 'odd_shape' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              اكتشف الشكل المختلف الذي لا ينتمي للمجموعة! 🔍
            </h3>
            <p className="text-xs text-slate-500">ثلاثة أشكال متطابقة وشكل واحد فقط فريد ومختلف.</p>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-6 py-4">
            {oddShapesSet.map((shape, idx) => (
              <button
                key={idx}
                onClick={() => handlePickOddShape(idx)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-rose-50/60 border-2 border-rose-200 hover:border-rose-500 hover:scale-110 active:scale-95 text-4xl sm:text-5xl shadow-xs transition flex items-center justify-center cursor-pointer"
              >
                {shape}
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-rose-800 animate-bounce">{feedback}</p>}
        </div>
      )}

      {/* TAB 4: Mini Coloring Studio */}
      {activeTab === 'mini_studio' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              استوديو التلوين السريع: لوّن الأشكال اللطيفة! 🎨
            </h3>
            <p className="text-xs text-slate-500">اختر لوناً من اللوحة أدناه ثم انقر على الشكل لملئه فوراً.</p>
          </div>

          {/* Color Palette */}
          <div className="flex items-center justify-center gap-3">
            {COLOR_ITEMS.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sounds.playPop();
                  setSelectedFillColor(c.hex);
                }}
                className={`w-10 h-10 rounded-full transition-transform ${
                  selectedFillColor === c.hex ? 'scale-125 ring-4 ring-offset-2 ring-rose-400' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.nameAr}
              />
            ))}
          </div>

          {/* Shapes to Color */}
          <div className="flex flex-wrap items-center justify-center gap-6 py-4">
            {/* Star */}
            <button
              onClick={() => {
                sounds.playPop();
                setStarColor(selectedFillColor);
              }}
              className="p-6 rounded-3xl border-2 border-slate-200 hover:scale-105 transition cursor-pointer shadow-xs"
              style={{ backgroundColor: starColor }}
            >
              <span className="text-6xl select-none">⭐</span>
              <span className="text-xs font-bold block mt-2 text-slate-800">نجمة لامعة</span>
            </button>

            {/* Circle */}
            <button
              onClick={() => {
                sounds.playPop();
                setCircleColor(selectedFillColor);
              }}
              className="p-6 rounded-3xl border-2 border-slate-200 hover:scale-105 transition cursor-pointer shadow-xs"
              style={{ backgroundColor: circleColor }}
            >
              <span className="text-6xl select-none">⚪</span>
              <span className="text-xs font-bold block mt-2 text-slate-800">كرة دائرية</span>
            </button>

            {/* Heart */}
            <button
              onClick={() => {
                sounds.playPop();
                setHeartColor(selectedFillColor);
              }}
              className="p-6 rounded-3xl border-2 border-slate-200 hover:scale-105 transition cursor-pointer shadow-xs"
              style={{ backgroundColor: heartColor }}
            >
              <span className="text-6xl select-none">❤️</span>
              <span className="text-xs font-bold block mt-2 text-slate-800">قلب محب</span>
            </button>
          </div>

          <button
            onClick={() => {
              sounds.playCheer();
              setStars((prev) => prev + 1);
              confetti({ particleCount: 30, spread: 60 });
            }}
            className="px-6 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition shadow-xs"
          >
            حفظ إبداع التلوين! 🌟
          </button>
        </div>
      )}
    </div>
  );
};
