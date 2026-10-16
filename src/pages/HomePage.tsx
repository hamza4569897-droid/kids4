import React, { useState } from 'react';
import { Category, EducationalResource } from '../types/database';
import { ActivityCard } from '../components/common/ActivityCard';
import {
  Search,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Shield,
  Clock,
  Printer,
  Hash,
  Palette,
  Smile,
  Brain,
  BookMarked,
  CheckCircle2,
  CalendarCheck,
  Star,
  Award,
  Gamepad2,
  FileText,
} from 'lucide-react';
import { sounds } from '../lib/audio';
import { matchesAgeBracket } from '../lib/storage';
import { getLatestApprovedReviews } from '../lib/comments';
import { ContentReview } from '../types/database';
import { SiteRatingWidget } from '../components/common/SiteRatingWidget';

interface HomePageProps {
  categories: Category[];
  resources: EducationalResource[];
  favorites: string[];
  recentlyPlayed: string[];
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: EducationalResource) => void;
  onSelectCategory: (categoryId: string) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  resources,
  favorites,
  recentlyPlayed,
  onToggleFavorite,
  onSelectResource,
  onSelectCategory,
  onNavigate,
}) => {
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [latestReviews, setLatestReviews] = useState<ContentReview[]>([]);

  React.useEffect(() => {
    getLatestApprovedReviews(2).then((revs) => setLatestReviews(revs));
  }, []);

  // Daily Learning Plan Checkbox state (stored in session/local state for motivation)
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({
    reading: false,
    math: false,
    worksheet: false,
  });

  const toggleTask = (taskKey: string) => {
    sounds.playPop();
    setCompletedTasks((prev) => {
      const next = { ...prev, [taskKey]: !prev[taskKey] };
      // If newly completed all 3, play fan-fare or pop
      if (!prev[taskKey] && Object.values({ ...next, [taskKey]: true }).filter(Boolean).length === 3) {
        sounds.playFanfare();
      }
      return next;
    });
  };

  const completedCount = Object.values(completedTasks).filter(Boolean).length;

  const ageFilteredResources = resources.filter((r) => {
    if (selectedAge === 'all') return true;
    return matchesAgeBracket(r, selectedAge);
  });

  const searchedResources = ageFilteredResources.filter((r) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.title_ar.toLowerCase().includes(query) ||
      r.description_ar.toLowerCase().includes(query) ||
      (r.title_en && r.title_en.toLowerCase().includes(query))
    );
  });

  const featured = searchedResources.filter((r) => r.is_featured).slice(0, 4);
  const recentItems = resources.filter((r) => recentlyPlayed.includes(r.id)).slice(0, 4);

  // 6 Core Learning Areas for "ابدأ التعلم"
  const CORE_LEARNING_AREAS = [
    {
      id: 'arabic-lang',
      title: 'الحروف واللغة العربية',
      subtitle: 'هجاء وأصوات وتتبع الحروف',
      icon: BookOpen,
      iconBg: 'bg-amber-100 text-amber-700',
      borderHover: 'hover:border-amber-400',
      action: () => onNavigate('activities_hub', 'arabic-language'),
    },
    {
      id: 'math-numbers',
      title: 'الأرقام والرياضيات',
      subtitle: 'عد بصري، مقارنة، وأشكال',
      icon: Hash,
      iconBg: 'bg-emerald-100 text-emerald-700',
      borderHover: 'hover:border-emerald-400',
      action: () => onNavigate('activities_hub', 'math-numbers'),
    },
    {
      id: 'colors-shapes',
      title: 'الألوان والأشكال',
      subtitle: 'فرز الألوان واستوديو التلوين',
      icon: Palette,
      iconBg: 'bg-rose-100 text-rose-700',
      borderHover: 'hover:border-rose-400',
      action: () => onNavigate('activities_hub', 'colors-shapes'),
    },
    {
      id: 'animals-nature',
      title: 'العلوم والطبيعة',
      subtitle: 'أصوات الحيوانات والفصول',
      icon: Smile,
      iconBg: 'bg-teal-100 text-teal-700',
      borderHover: 'hover:border-teal-400',
      action: () => onNavigate('activities_hub', 'animals-nature'),
    },
    {
      id: 'illustrated-stories',
      title: 'القصص المصورة',
      subtitle: 'حكايات هادفة ومسلية للصغار',
      icon: BookMarked,
      iconBg: 'bg-indigo-100 text-indigo-700',
      borderHover: 'hover:border-indigo-400',
      action: () => onNavigate('activities_hub', 'illustrated-stories'),
    },
    {
      id: 'logic-memory',
      title: 'الذاكرة والتفكير',
      subtitle: 'ألعاب الذكاء ومطابقة الظلال',
      icon: Brain,
      iconBg: 'bg-purple-100 text-purple-700',
      borderHover: 'hover:border-purple-400',
      action: () => onNavigate('activities_hub', 'logic-memory'),
    },
  ];

  // 4 Age Brackets
  const AGE_CARDS = [
    {
      id: '2-3',
      label: '2 – 3 سنوات',
      stage: 'الاستكشاف واللعب الحسي',
      desc: 'الأصوات الأولى والألوان والتعرف على الحيوانات',
      color: 'border-amber-300 hover:border-amber-500',
      badge: 'مرحلة البدايات',
    },
    {
      id: '3-4',
      label: '3 – 4 سنوات',
      stage: 'الكلمات والأشكال الأولى',
      desc: 'نطق الحروف، العد البصري حتى 5، وفرز الألوان',
      color: 'border-emerald-300 hover:border-emerald-500',
      badge: 'ما قبل الروضة',
    },
    {
      id: '4-5',
      label: '4 – 5 سنوات',
      stage: 'التهيئة للروضة',
      desc: 'تمييز الحروف وتتبعها، الأرقام حتى 10، وألعاب الذاكرة',
      color: 'border-sky-300 hover:border-sky-500',
      badge: 'مرحلة الروضة',
    },
    {
      id: '5-6',
      label: '5 – 6 سنوات',
      stage: 'التأسيس المدرسي',
      desc: 'تكوين الكلمات، الجمع البسيط، والتفكير المنطقي',
      color: 'border-purple-300 hover:border-purple-500',
      badge: 'التمهيدي للمدرسة',
    },
  ];

  return (
    <div className="space-y-16">
      {/* 2. قسم ترحيبي Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-100/70 via-amber-50/40 to-white p-6 sm:p-12 border border-amber-200/80 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 bg-amber-200/70 text-amber-950 px-4 py-1.5 rounded-full text-xs font-black shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>منصة عربية تعليمية آمنة للأطفال من عمر 2 إلى 6 سنوات</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-amber-950 leading-tight">
              عالم الصغار — حيث يبدأ حب المعرفة والمرح! 🌟
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
              اكتشف ألعاباً تفاعلية أصيلة، وقصصاً ممتعة، وتدريبات للحروف والأرقام، وأوراق عمل قابلة للطباعة صُممت خصيصاً لأيدي الصغار وعقولهم المبدعة دون أي إعلانات تجارية.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sounds.playPop();
                  document.getElementById('start-learning')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-sm sm:text-base shadow-md transition hover:scale-102 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>ابدأ رحلة التعلم</span>
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  onNavigate('printables');
                }}
                className="px-5 py-3.5 bg-white hover:bg-amber-50 text-slate-800 border border-amber-200 rounded-2xl font-bold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-600" />
                <span>أوراق عمل مجانية (120 ورقة)</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative max-w-md pt-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن لعبة، قصة، أو نشاط..."
                className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-white border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm font-medium shadow-2xs"
              />
              <Search className="w-5 h-5 text-amber-700 absolute top-5.5 right-4 pointer-events-none" />
            </div>
          </div>

          {/* Hero Mascot / Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-lg border-4 border-white">
              <img
                src="/src/assets/images/hero_preschool_stars_1791871144333.jpg"
                alt="عالم الصغار المبهج"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. قسم «اختر عمر طفلك» */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>محتوى مدروس وفق المرحلة التطورية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
              اختر عمر طفلك
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              اضغط على المرحلة العمرية المناسبة لتخصيص الأنشطة والمستويات
            </p>
          </div>

          {selectedAge !== 'all' && (
            <button
              onClick={() => {
                sounds.playPop();
                setSelectedAge('all');
              }}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 underline self-start sm:self-auto cursor-pointer"
            >
              عرض جميع الأعمار (2–6 سنوات)
            </button>
          )}
        </div>

        {/* 4 Compact Age Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGE_CARDS.map((age) => {
            const isSelected = selectedAge === age.id;
            return (
              <button
                key={age.id}
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge(isSelected ? 'all' : age.id);
                }}
                className={`p-5 rounded-3xl text-right transition-all duration-200 border-2 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                    : 'bg-white hover:bg-amber-50/50 border-amber-200/80 shadow-2xs hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {age.badge}
                    </span>
                    <span className="text-base font-extrabold">⭐</span>
                  </div>
                  <h3 className={`text-lg font-black leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {age.label}
                  </h3>
                  <div className={`text-xs font-bold mt-1 ${isSelected ? 'text-amber-100' : 'text-amber-800'}`}>
                    {age.stage}
                  </div>
                </div>

                <p className={`text-xs mt-3 leading-relaxed ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                  {age.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. قسم «ابدأ التعلم» (4 إلى 6 بطاقات رئيسية فقط) */}
      <section id="start-learning" className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>الركائز الأساسية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950">ابدأ التعلم</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ٦ مجالات رئيسية مختارة بعناية لتأسيس عقول الصغار باللغة العربية
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onNavigate('activities_hub');
            }}
            className="text-xs sm:text-sm font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>عرض كل المجالات (10 مجالات)</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Unified Primary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CORE_LEARNING_AREAS.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.id}
                onClick={() => {
                  sounds.playPop();
                  area.action();
                }}
                className={`group bg-white rounded-3xl p-6 border border-amber-200/80 hover:shadow-md transition-all duration-200 cursor-pointer flex items-start gap-4 ${area.borderHover}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform ${area.iconBg}`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-800 transition">
                    {area.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {area.subtitle}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:translate-x-[-4px] transition-transform">
                    <span>دخول الأنشطة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. قسم «خطة اليوم التعليمية» */}
      <section
        id="learning-plan"
        className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-white rounded-3xl p-6 sm:p-10 border-2 border-amber-300/80 shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
          <div className="space-y-1 text-right">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-200/60 px-3 py-1 rounded-full">
              <CalendarCheck className="w-4 h-4 text-amber-700" />
              <span>روتين ٣٠ دقيقة متوازن وممتع</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
              خطة اليوم التعليمية ⭐
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              جدول يومي خفيف ومحبب للطفل دون إجهاد، مقسم إلى ٣ مهام تفاعلية
            </p>
          </div>

          {/* Progress Stars Meter */}
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-amber-200/80 shadow-2xs self-start sm:self-auto">
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-6 h-6 transition-all ${
                    completedCount >= starIdx
                      ? 'fill-amber-400 text-amber-500 scale-110'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-slate-800">
                {completedCount === 3
                  ? 'رائع! أكملت كل المهام 🎉'
                  : `أنجزت ${completedCount} من 3 مهام`}
              </div>
              <div className="text-[10px] text-slate-500">حافظ على استمرارية الإنجاز</div>
            </div>
          </div>
        </div>

        {/* 3 Interactive Daily Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Task 1 */}
          <div
            className={`p-5 rounded-2xl border transition-all text-right flex flex-col justify-between ${
              completedTasks.reading
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-white border-amber-200/80 hover:border-amber-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                  ١٠ دقائق · لغة
                </span>
                <button
                  onClick={() => toggleTask('reading')}
                  className="p-1 rounded-full text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                  title={completedTasks.reading ? 'إلغاء التحديد' : 'تحديد كمكتمل'}
                >
                  <CheckCircle2
                    className={`w-6 h-6 ${
                      completedTasks.reading ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                    }`}
                  />
                </button>
              </div>
              <h3 className="text-base font-black text-slate-900">📖 هجاء الحروف وقصة اليوم</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                الاستماع إلى صوت حرف اليوم وتتبع شكله للأصابع مع كلمة بسيطة مصورة.
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                onNavigate('activities_hub', 'arabic-language');
              }}
              className="mt-4 w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              ابدأ نشاط الحروف ←
            </button>
          </div>

          {/* Task 2 */}
          <div
            className={`p-5 rounded-2xl border transition-all text-right flex flex-col justify-between ${
              completedTasks.math
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-white border-amber-200/80 hover:border-amber-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                  ١٠ دقائق · حساب وذكاء
                </span>
                <button
                  onClick={() => toggleTask('math')}
                  className="p-1 rounded-full text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                  title={completedTasks.math ? 'إلغاء التحديد' : 'تحديد كمكتمل'}
                >
                  <CheckCircle2
                    className={`w-6 h-6 ${
                      completedTasks.math ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                    }`}
                  />
                </button>
              </div>
              <h3 className="text-base font-black text-slate-900">🔢 لعبة العد ومطابقة الأرقام</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                عد الحيوانات الظاهرة في الشاشة ومطابقة الرقم الصحيح ومقارنة الأحجام.
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                onNavigate('activities_hub', 'math-numbers');
              }}
              className="mt-4 w-full py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              ابدأ لعبة الأرقام ←
            </button>
          </div>

          {/* Task 3 */}
          <div
            className={`p-5 rounded-2xl border transition-all text-right flex flex-col justify-between ${
              completedTasks.worksheet
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-white border-amber-200/80 hover:border-amber-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black bg-rose-100 text-rose-900 px-2.5 py-1 rounded-full">
                  ١٠ دقائق · نشاط ورقي
                </span>
                <button
                  onClick={() => toggleTask('worksheet')}
                  className="p-1 rounded-full text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                  title={completedTasks.worksheet ? 'إلغاء التحديد' : 'تحديد كمكتمل'}
                >
                  <CheckCircle2
                    className={`w-6 h-6 ${
                      completedTasks.worksheet ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                    }`}
                  />
                </button>
              </div>
              <h3 className="text-base font-black text-slate-900">🎨 تلوين ورقة عمل وتوصيل</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                ورقة عمل قابلة للطباعة بحجم A4 لتقوية عضلات اليد الدقيقة ومسك القلم.
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                onNavigate('printables');
              }}
              className="mt-4 w-full py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              اختر ورقة عمل اليوم ←
            </button>
          </div>
        </div>
      </section>

      {/* 6. قسم «أوراق عمل مجانية» */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-1">
              <Printer className="w-3.5 h-3.5 text-emerald-700" />
              <span>جاهزة للطباعة مقاس A4</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
              أوراق عمل واختبارات مجانية للطباعة 🖨️
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              أكثر من ١٢٠ ورقة عمل واختبار تشخيصي مقسمة للأعمار من ٢ إلى ٦ سنوات مع دليل تصحيح
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onNavigate('printables');
            }}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>عرض المكتبة كاملة (١٢٠ ورقة)</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Sample Worksheet Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'تتبع الحروف الهجائية والتنقيط',
              age: 'عمر 3-4 سنوات',
              desc: 'تمارين رسم الحروف بالأصابع والقلم مع كلمات مصورة ملونة.',
              type: 'لغة وتتبع',
            },
            {
              title: 'العد البصري ومطابقة الكميات',
              age: 'عمر 4-5 سنوات',
              desc: 'عد الكائنات اللطيفة وتوصيل كل مجموعة بالرقم الصحيح.',
              type: 'رياضيات وأرقام',
            },
            {
              title: 'تلوين الأشكال واكتشاف المختلف',
              age: 'عمر 2-3 سنوات',
              desc: 'تمرينات بصرية سهلة لتلوين الدائرة والمربع وتمييز الألوان.',
              type: 'ألوان وأشكال',
            },
            {
              title: 'اختبار تقييم الجاهزية المدرسية',
              age: 'عمر 5-6 سنوات',
              desc: 'اختبار تشخيصي شامل للقدرات المعرفية واللغوية قبل الروضة.',
              type: 'اختبار تشخيصي',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                sounds.playPop();
                onNavigate('printables');
              }}
              className="bg-white rounded-3xl p-5 border border-emerald-200/80 hover:border-emerald-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between text-right"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    {item.type}
                  </span>
                  <Printer className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <div className="text-[11px] font-bold text-amber-700 mt-1">
                  {item.age}
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>معاينة وطباعة A4</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. قسم «ألعاب وأنشطة مميزة» */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full mb-1">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>جاهزة للتشغيل الفوري</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950 flex items-center gap-2">
              <span>ألعاب وأنشطة مميزة</span>
              {selectedAge !== 'all' && (
                <span className="text-xs bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                  عمر {selectedAge} سنوات
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              أنشطة تفاعلية أصلية بدون إعلانات مع مؤثرات صوتية لطيفة
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onNavigate('browse');
            }}
            className="text-xs sm:text-sm font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>مشاهدة الكل ({resources.length})</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((res) => (
              <ActivityCard
                key={res.id}
                resource={res}
                isFavorite={favorites.includes(res.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectResource}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-amber-200 text-center space-y-3">
            <p className="text-sm font-bold text-slate-700">
              لا توجد أنشطة تطابق البحث الحالي
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAge('all');
              }}
              className="text-xs font-bold text-amber-700 underline cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </section>

      {/* Short Reviews Callout: Latest approved feedback from parents */}
      {latestReviews.length > 0 && (
        <section className="bg-white/80 rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-xs space-y-4 text-right">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <h3 className="text-base sm:text-lg font-black text-amber-950">
                من تجارب أولياء الأمور والمعلمين
              </h3>
            </div>
            <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold">
              تجارب حقيقية معتمدة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center">
                      {rev.author_name.charAt(0) || 'و'}
                    </div>
                    <span className="text-xs font-black text-slate-800">{rev.author_name}</span>
                  </div>
                  {rev.rating && (
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating! ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-bold text-amber-800">نشاط: {rev.content_title}</div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">"{rev.comment_text}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* قسم تقييم موقع عالم الصغار بالنجوم */}
      <section className="my-2">
        <SiteRatingWidget />
      </section>

      {/* 8. قسم قصير لأولياء الأمور */}
      <section className="bg-amber-100/50 rounded-3xl p-6 sm:p-8 border border-amber-200/90 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3 text-right">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-200/60 px-3 py-1 rounded-full">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>خاص بالآباء والأمهات والمربين</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            ركن الوالدين — توجيهات الشاشة والتربية الإيجابية 👨‍👩‍👧
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            توصي منظمة الصحة العالمية والجمعيات التربوية بأن لا يتجاوز وقت الشاشة للأطفال دون ٦ سنوات ساعة يومياً من المحتوى عالي الجودة وبمشاركة الوالدين. يوفر ركن الوالدين نصائح عملية لتحويل اللعب الرقمي إلى تواصل أسري دافئ.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playPop();
                onNavigate('parents');
              }}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-sm transition active:scale-95 text-xs sm:text-sm cursor-pointer"
            >
              <span>زيارة دليل أولياء الأمور</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="md:col-span-4 flex justify-center">
          <div className="w-full max-w-xs aspect-4/3 rounded-2xl overflow-hidden shadow-md border-2 border-white">
            <img
              src="/src/assets/images/parent_corner_guide_1791871144873.jpg"
              alt="قراءة دافئة مع الوالدين"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

