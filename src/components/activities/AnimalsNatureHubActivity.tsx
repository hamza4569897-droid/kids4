import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Smile,
  CheckCircle2,
  Award,
  Sun,
  Layers,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { AgeGroup } from '../../types/worksheet';

interface AnimalsNatureHubProps {
  onBack?: () => void;
  onOpenWorksheet?: () => void;
  initialAge?: AgeGroup;
}

type TabType = 'classify' | 'foods_sounds' | 'life_cycle' | 'seasons';

const ANIMALS_DB = [
  { name: 'القطة', category: 'pets', catName: 'حيوان أليف ومزرعة', sound: 'مواء (مياو)', food: 'الحليب والسمك 🐟', habitat: 'المنزل والمزرعة', emoji: '🐱' },
  { name: 'الأسد', category: 'wild', catName: 'حيوان بري في الغابة', sound: 'زئير قوي', food: 'اللحوم 🥩', habitat: 'السافانا والغابات', emoji: '🦁' },
  { name: 'الدلفين', category: 'marine', catName: 'كائن بحري ومائي', sound: 'صفير ونقر لطيف', food: 'الأسماك الصغيرة 🐟', habitat: 'المحيطات والبحار', emoji: '🐬' },
  { name: 'العصفور', category: 'birds', catName: 'طيور محلقة', sound: 'تغريد وزقزقة', food: 'الحبوب والبذور 🌾', habitat: 'الأشجار والحدائق', emoji: '🐦' },
  { name: 'البقرة', category: 'pets', catName: 'حيوان أليف ومزرعة', sound: 'خوار', food: 'العشب الأخضر 🌿', habitat: 'المزرعة', emoji: '🐮' },
  { name: 'الفيل', category: 'wild', catName: 'حيوان بري في الغابة', sound: 'نهيم الفيل', food: 'أوراق الشجر والموز 🍌', habitat: 'الغابات الإفريقية', emoji: '🐘' },
  { name: 'الأخطبوط', category: 'marine', catName: 'كائن بحري ومائي', sound: 'حركة هادئة تحت الماء', food: 'القشريات والسرطان 🦀', habitat: 'أعماق البحار', emoji: '🐙' },
  { name: 'البطة', category: 'birds', catName: 'طيور تسبح وتحلق', sound: 'بطبطة (واك واك)', food: 'الحبوب والنباتات المائية 🌱', habitat: 'البحيرات والمزارع', emoji: '🦆' },
];

const BUTTERFLY_CYCLE = [
  { step: 1, title: 'البيضة الصغيرة', desc: 'تضع الفراشة بيضتها على ورقة الشجر الخضراء.', visual: '🥚🍃' },
  { step: 2, title: 'اليرقة الجائعة', desc: 'تخرج يرقة صغيرة تأكل أوراق الشجر لتنمو وتكبر.', visual: '🐛🍃' },
  { step: 3, title: 'الشرنقة الهادئة', desc: 'تلتف اليرقة في غطاء دافئ وتنام لتتحول.', visual: '🪵✨' },
  { step: 4, title: 'الفراشة البديعة!', desc: 'تخرج فراشة ملونة بأجنحة ساحرة تطير بين الزهور!', visual: '🦋🌸' },
];

const SEASONS_DATA = [
  { name: 'فصل الربيع', emoji: '🌸🌱', weather: 'معتدل ومزهر', desc: 'تتفتح فيه الزهور وتخضر الحقول وتغرد الطيور.' },
  { name: 'فصل الصيف', emoji: '☀️🏖️', weather: 'حار ومشمس', desc: 'نذهب فيه إلى الشاطئ ونستمتع بالسباحة والفواكه المنعشة.' },
  { name: 'فصل الخريف', emoji: '🍂🍁', weather: 'مائل للبرودة ورياح خفيفة', desc: 'تتساقط فيه أوراق الشجر الصفراء وتهب نسائم لطيفة.' },
  { name: 'فصل الشتاء', emoji: '🌧️⛄', weather: 'بارد وممطر', desc: 'تهطل فيه الأمطار والثلوج ونرتدي المعاطف الدافئة.' },
];

export const AnimalsNatureHubActivity: React.FC<AnimalsNatureHubProps> = ({
  onBack,
  onOpenWorksheet,
  initialAge = '3-4',
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAge);
  const [activeTab, setActiveTab] = useState<TabType>('classify');
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  // 1. Classification State
  const [currentAnimal, setCurrentAnimal] = useState(ANIMALS_DB[0]);

  // 2. Life Cycle State
  const [cycleIndex, setCycleIndex] = useState(0);

  const initAnimalRound = () => {
    const shuffled = [...ANIMALS_DB].sort(() => 0.5 - Math.random());
    setCurrentAnimal(shuffled[0]);
    setFeedback('');
    sounds.speakArabic(`أين يعيش ${shuffled[0].name}؟ أهو حيوان أليف، بري، أم بحري؟`);
  };

  useEffect(() => {
    if (activeTab === 'classify') initAnimalRound();
  }, [activeTab, selectedAge]);

  const handleClassifyPick = (category: string) => {
    sounds.playPop();
    if (category === currentAnimal.category) {
      sounds.playCheer();
      setFeedback(`تصنيف عبقري! ${currentAnimal.name} هو ${currentAnimal.catName} 🌟👏`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 30, spread: 60 });
      sounds.speakArabic(`أحسنت! ${currentAnimal.name} هو ${currentAnimal.catName}`);
      setTimeout(initAnimalRound, 1600);
    } else {
      sounds.playTryAgain();
      setFeedback(`فكر مجدداً: أين نجد ${currentAnimal.name} عادةً؟ 😊`);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-lime-200/80 shadow-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-lime-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-lime-50 hover:bg-lime-100 text-lime-800 transition"
              title="رجوع إلى مركز الأنشطة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-lime-700 bg-lime-100 px-3 py-1 rounded-full">
              الحيوانات والطبيعة والاكتشاف 🦁🌿
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              عالم الحيوانات اللطيفة وأسرار الطبيعة
            </h2>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-lime-50 border border-lime-200 px-3.5 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-extrabold text-lime-900">{stars} وسام طبيعة</span>
          </div>
          {onOpenWorksheet && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorksheet();
              }}
              className="text-xs font-bold text-lime-700 bg-lime-100/70 hover:bg-lime-200 px-3 py-1.5 rounded-xl transition"
            >
              📄 ورقة عمل الحيوانات
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'classify', label: 'تصنيف بيئة الحيوان', icon: Smile },
            { id: 'foods_sounds', label: 'أصوات وطعام الحيوانات', icon: Volume2 },
            { id: 'life_cycle', label: 'دورة حياة الفراشة', icon: Layers },
            { id: 'seasons', label: 'الفصول الأربعة والطقس', icon: Sun },
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
                    ? 'bg-lime-600 text-white shadow-xs'
                    : 'bg-lime-50 text-slate-700 hover:bg-lime-100'
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
                  ? 'bg-white text-lime-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {age === '2-3' ? '2-3 سنوات' : age === '3-4' ? '3-4 سنوات' : age === '4-5' ? '4-5 سنوات' : '5-6 سنوات'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Animal Classification */}
      {activeTab === 'classify' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-2">
            <span className="text-7xl block">{currentAnimal.emoji}</span>
            <h3 className="text-2xl font-black text-slate-800">
              {currentAnimal.name}
            </h3>
            <p className="text-xs text-slate-500">اختر البيئة المناسبة التي ينتمي إليها هذا الحيوان:</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto pt-2">
            {[
              { id: 'pets', label: 'أليف ومزرعة 🏡', color: 'border-amber-300 hover:bg-amber-50' },
              { id: 'wild', label: 'بري وغابة 🌴', color: 'border-emerald-300 hover:bg-emerald-50' },
              { id: 'marine', label: 'بحري ومائي 🌊', color: 'border-sky-300 hover:bg-sky-50' },
              { id: 'birds', label: 'طيور محلقة 🪶', color: 'border-violet-300 hover:bg-violet-50' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleClassifyPick(cat.id)}
                className={`p-4 rounded-3xl bg-white border-2 font-black text-sm text-slate-800 transition hover:scale-105 active:scale-95 shadow-xs cursor-pointer ${cat.color}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-lime-800 animate-bounce">{feedback}</p>}
        </div>
      )}

      {/* TAB 2: Foods & Sounds */}
      {activeTab === 'foods_sounds' && (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              ماذا تأكل الحيوانات وما هي أصواتها؟ 🐾
            </h3>
            <p className="text-xs text-slate-500">انقر على بطاقة أي حيوان للاستماع لخصائصه الممتعة.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {ANIMALS_DB.slice(0, 8).map((animal) => (
              <button
                key={animal.name}
                onClick={() => {
                  sounds.playPop();
                  sounds.speakArabic(`${animal.name}: صوته ${animal.sound}، وطعامه المفضل هو ${animal.food}`);
                  setFeedback(`${animal.name}: صوته (${animal.sound}) وطعامه (${animal.food})`);
                }}
                className="p-4 rounded-3xl bg-slate-50 hover:bg-lime-50/70 border border-slate-200 hover:border-lime-400 transition text-right space-y-2 hover:scale-102 cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{animal.emoji}</span>
                  <span className="text-xs bg-lime-100 text-lime-800 px-2 py-0.5 rounded-full font-bold">
                    {animal.catName.split(' ')[0]}
                  </span>
                </div>
                <h4 className="font-black text-base text-slate-800">{animal.name}</h4>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p>🔊 الصوت: {animal.sound}</p>
                  <p>🍽️ الطعام: {animal.food}</p>
                </div>
              </button>
            ))}
          </div>

          {feedback && (
            <p className="text-center text-sm font-bold text-lime-900 bg-lime-50 p-2.5 rounded-2xl max-w-md mx-auto">
              {feedback}
            </p>
          )}
        </div>
      )}

      {/* TAB 3: Life Cycle of Butterfly */}
      {activeTab === 'life_cycle' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              معجزة الطبيعة: كيف تتحول اليرقة إلى فراشة ملونة؟ 🦋
            </h3>
            <p className="text-xs text-slate-500">تتبع الخطوات الأربع بالترتيب وشاهد جمال التطور والنمو.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2">
            {BUTTERFLY_CYCLE.map((step, idx) => (
              <div
                key={step.step}
                onClick={() => {
                  sounds.playPop();
                  sounds.speakArabic(`المرحلة ${step.step}: ${step.title}. ${step.desc}`);
                }}
                className="p-5 rounded-3xl bg-emerald-50/50 border-2 border-emerald-200 hover:border-emerald-500 transition text-center space-y-2 shadow-xs cursor-pointer hover:scale-105"
              >
                <span className="inline-block text-xs font-black bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full">
                  المرحلة {step.step}
                </span>
                <span className="text-5xl block py-1">{step.visual}</span>
                <h4 className="font-black text-base text-slate-800">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              sounds.playCheer();
              setStars((prev) => prev + 1);
              confetti({ particleCount: 30, spread: 60 });
            }}
            className="px-6 py-2.5 rounded-2xl bg-lime-600 hover:bg-lime-700 text-white font-bold text-xs transition shadow-xs"
          >
            سبحان الله العظيم! أتممت الاستكشاف 🌟
          </button>
        </div>
      )}

      {/* TAB 4: Four Seasons */}
      {activeTab === 'seasons' && (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              الفصول الأربعة وتقلبات الطقس الجميل ☀️🍂🌸🌧️
            </h3>
            <p className="text-xs text-slate-500">انقر على الفصل لتتعرف على أجوائه ومميزاته.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {SEASONS_DATA.map((season) => (
              <button
                key={season.name}
                onClick={() => {
                  sounds.playPop();
                  sounds.speakArabic(`${season.name}: الجو ${season.weather}. ${season.desc}`);
                  setFeedback(`${season.name}: الجو ${season.weather} - ${season.desc}`);
                }}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 transition text-center space-y-2 hover:scale-105 cursor-pointer shadow-xs"
              >
                <span className="text-5xl block">{season.emoji}</span>
                <h4 className="font-black text-lg text-slate-800">{season.name}</h4>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block">
                  {season.weather}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{season.desc}</p>
              </button>
            ))}
          </div>

          {feedback && (
            <p className="text-center text-sm font-bold text-slate-800 bg-amber-50 p-2.5 rounded-2xl max-w-lg mx-auto">
              {feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
