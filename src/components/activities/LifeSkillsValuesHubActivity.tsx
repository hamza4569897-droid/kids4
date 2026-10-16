import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Heart,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { AgeGroup } from '../../types/worksheet';

interface LifeSkillsValuesHubProps {
  onBack?: () => void;
  onOpenWorksheet?: () => void;
  initialAge?: AgeGroup;
}

type TabType = 'manners' | 'emotions' | 'scenarios';

const MANNERS_CARDS = [
  {
    title: 'آداب الطعام والشراب',
    saying: 'بسم الله، ونأكل باليد اليمنى مما يمانا',
    visual: '🍽️✨',
    desc: 'نغسل أيدينا قبل الأكل، ونسمي بالله، ونمضغ طعامنا بهدوء وفم مغلق.',
  },
  {
    title: 'إلقاء التحية الطيبة',
    saying: 'السلام عليكم ورحمة الله وبركاته',
    visual: '🤝😊',
    desc: 'نبتسم حين نلتقي بالناس ونلقي السلام بلطف ووجه بشوش.',
  },
  {
    title: 'مشاركة الألعاب مع الأصدقاء',
    saying: 'اللعب المشترك يضاعف الفرحة والمرح',
    visual: '🧸🎨',
    desc: 'نتبادل الأدوار بلطف ونعتني بألعابنا ولا ننتزعها من رفاقنا.',
  },
  {
    title: 'قول كلمة شكراً ومن فضلك',
    saying: 'كلمات لطيفة تبهج القلوب',
    visual: '💖🌟',
    desc: 'عندما نطلب شيئاً نقول (من فضلك)، وعندما يساعدنا أحد نقول (شكراً لك).',
  },
];

const EMOTIONS_DATA = [
  { emotion: 'سعيد', emoji: '😄', desc: 'أشعر بالفرح في قلبي وأبتسم!', advice: 'شارك سعادتك بابتسامة وكلمة طيبة لمن حولك.' },
  { emotion: 'حزين', emoji: '😢', desc: 'تسيل دمعة صغيرة وأحتاج إلى حضن دافئ.', advice: 'من الطبيعي أن نحزن، اطلب حضناً دافئاً من والدتك وتحدث عما يضايقك.' },
  { emotion: 'غاضب', emoji: '😠', desc: 'أشعر بحرارة في رأسي وأرغب في الصراخ.', advice: 'خذ 3 أنفاس عميقة واشرب رشفة ماء لتشعر بالهدوء.' },
  { emotion: 'متفاجئ', emoji: '😲', desc: 'عيناي واسعتان لشيء لم أتوقعه!', advice: 'شارك دهشتك مع والديك واستكشف الشيء الجديد بأمان.' },
  { emotion: 'هادئ ومطمئن', emoji: '😌', desc: 'قلبي مرتاح وأستمتع بالسكينة.', advice: 'استمتع بوقت الهدوء والقراءة والتأمل الجميل.' },
];

const SCENARIOS_DATA = [
  {
    situation: 'رأيت صديقك في الروضة يبكي لأن دميته سقطت على الأرض، ماذا تفعل؟',
    visual: '🧸😢',
    options: [
      { text: 'أساعده في التقاط دميته وأواسيه بابتسامة دافئة', isCorrect: true },
      { text: 'أتجاهله وأذهب للعب بمفردي', isCorrect: false },
    ],
    feedback: 'ما شاء الله عليك! الرحمة والمساعدة من أعظم الصفات النبيلة 🌟',
  },
  {
    situation: 'انتهيت من اللعب بمكعبات البناء في غرفتك، ماذا تصنع؟',
    visual: '🧱📦',
    options: [
      { text: 'أعيد ترتيب المكعبات داخل صندوقها المخصص', isCorrect: true },
      { text: 'أتركها مبعثرة على الأرض لترتبها أمي', isCorrect: false },
    ],
    feedback: 'بطل حقيقي! النظام وترتيب الألعاب يجعل بيتنا جميلاً 🌟',
  },
  {
    situation: 'قدمت لك معلمتك هدية جميلة أو قطعة حلوى لذيذة، ماذا تقول لها؟',
    visual: '🎁👩‍🏫',
    options: [
      { text: 'أبتسم وأقول: شكراً جزيلاً يا معلمتي!', isCorrect: true },
      { text: 'آخذها وأجري دون أن أقول شيئاً', isCorrect: false },
    ],
    feedback: 'رائع جداً! شكر الناس من حسن الأدب والتربية الرفيعة 🌟',
  },
];

export const LifeSkillsValuesHubActivity: React.FC<LifeSkillsValuesHubProps> = ({
  onBack,
  onOpenWorksheet,
  initialAge = '3-4',
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAge);
  const [activeTab, setActiveTab] = useState<TabType>('manners');
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  // Scenario State
  const [scenarioIndex, setScenarioIndex] = useState<number>(0);

  const handleScenarioPick = (isCorrect: boolean) => {
    sounds.playPop();
    const curr = SCENARIOS_DATA[scenarioIndex % SCENARIOS_DATA.length];
    if (isCorrect) {
      sounds.playCheer();
      setFeedback(curr.feedback);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 35, spread: 60 });
      sounds.speakArabic(curr.feedback);
      setTimeout(() => {
        setScenarioIndex((prev) => (prev + 1) % SCENARIOS_DATA.length);
        setFeedback('');
      }, 2200);
    } else {
      sounds.playTryAgain();
      setFeedback('فكر يا طيب: ما هو التصرف الأكثر مودة ولطفاً؟ 😊');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-orange-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-800 transition"
              title="رجوع إلى مركز الأنشطة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
              السلوكيات والقيم والمشاعر ❤️🌱
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              آداب الصغار والتربية الإيجابية والمشاعر
            </h2>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-extrabold text-orange-900">{stars} وسام أخلاق</span>
          </div>
          {onOpenWorksheet && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorksheet();
              }}
              className="text-xs font-bold text-orange-700 bg-orange-100/70 hover:bg-orange-200 px-3 py-1.5 rounded-xl transition"
            >
              📄 ورقة عمل السلوكيات
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'manners', label: 'الآداب اليومية', icon: ShieldCheck },
            { id: 'emotions', label: 'التعرف على المشاعر', icon: Smile },
            { id: 'scenarios', label: 'اختر السلوك الصحيح', icon: Heart },
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
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-orange-50 text-slate-700 hover:bg-orange-100'
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
                  ? 'bg-white text-orange-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {age === '2-3' ? '2-3 سنوات' : age === '3-4' ? '3-4 سنوات' : age === '4-5' ? '4-5 سنوات' : '5-6 سنوات'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Manners Cards */}
      {activeTab === 'manners' && (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              آداب وقيم نبيلة تنير حياة طفلي 🌟
            </h3>
            <p className="text-xs text-slate-500">انقر على أي أدب للاستماع لنصيحته الدافئة وطريقة تطبيقه في البيت.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2">
            {MANNERS_CARDS.map((card) => (
              <button
                key={card.title}
                onClick={() => {
                  sounds.playPop();
                  sounds.speakArabic(`${card.title}: ${card.saying}. ${card.desc}`);
                  setFeedback(`${card.title}: ${card.desc}`);
                }}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-orange-50/70 border border-slate-200 hover:border-orange-400 transition text-right space-y-2 hover:scale-102 cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{card.visual}</span>
                  <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                    أدب إسلامي وتربوي
                  </span>
                </div>
                <h4 className="font-black text-base text-slate-800">{card.title}</h4>
                <p className="text-xs font-bold text-orange-800 bg-white p-2 rounded-xl border border-orange-100">
                  {card.saying}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
              </button>
            ))}
          </div>

          {feedback && (
            <p className="text-center text-sm font-bold text-orange-950 bg-orange-50 p-3 rounded-2xl max-w-lg mx-auto">
              {feedback}
            </p>
          )}
        </div>
      )}

      {/* TAB 2: Emotion Recognition */}
      {activeTab === 'emotions' && (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-800">
              مشاعري أصدقائي: كيف أشعر وكيف أتعامل مع شعوري؟ 💖
            </h3>
            <p className="text-xs text-slate-500">ساعد طفلك على تسمية مشاعره دون خجل وتوجيهها بهدوء.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {EMOTIONS_DATA.map((item) => (
              <button
                key={item.emotion}
                onClick={() => {
                  sounds.playPop();
                  sounds.speakArabic(`شعور ${item.emotion}: ${item.desc}. ${item.advice}`);
                  setFeedback(`شعور ${item.emotion}: ${item.advice}`);
                }}
                className="p-4 rounded-3xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-400 transition text-center space-y-2 hover:scale-105 cursor-pointer shadow-xs"
              >
                <span className="text-5xl block">{item.emoji}</span>
                <h4 className="font-black text-base text-slate-800">{item.emotion}</h4>
                <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
              </button>
            ))}
          </div>

          {feedback && (
            <div className="max-w-lg mx-auto p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center">
              <p className="text-xs sm:text-sm font-extrabold text-orange-900 leading-relaxed">{feedback}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Scenario Decision Making */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6 text-center py-4">
          {(() => {
            const currentScenario = SCENARIOS_DATA[scenarioIndex % SCENARIOS_DATA.length];
            return (
              <div className="max-w-xl mx-auto space-y-6 bg-gradient-to-b from-orange-50/70 to-white p-6 sm:p-8 rounded-3xl border border-orange-200">
                <span className="text-6xl block">{currentScenario.visual}</span>
                <h3 className="text-lg font-black text-slate-800 leading-relaxed">
                  {currentScenario.situation}
                </h3>

                <div className="space-y-3 pt-2">
                  {currentScenario.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleScenarioPick(opt.isCorrect)}
                      className="w-full p-4 rounded-2xl bg-white hover:bg-orange-50 border-2 border-slate-200 hover:border-orange-400 transition text-right font-black text-sm text-slate-800 shadow-xs cursor-pointer flex items-center gap-3"
                    >
                      <span className="w-6 h-6 rounded-full border border-orange-400 flex items-center justify-center text-xs font-bold text-orange-600 shrink-0">
                        {idx + 1}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>

                {feedback && <p className="text-base font-extrabold text-orange-800 animate-bounce">{feedback}</p>}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
