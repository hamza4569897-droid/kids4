import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Globe,
  Smartphone,
  Laptop,
  Apple,
  Heart,
  Sparkles,
  Info,
  RotateCcw,
  Check,
  Lock,
  Layers,
  MessageSquare,
  X,
} from 'lucide-react';
import { EducationalResource, Category, GapFillResult } from '../types/database';
import { AGE_BRACKETS, matchesAgeBracket, getMatchingAgeBrackets } from '../lib/sync/classifier';
import { ParentGateModal } from '../components/common/ParentGateModal';
import { sounds } from '../lib/audio';
import { fillContentGaps } from '../lib/sync/gapAnalyzer';
import { getDomainAppropriateImage } from '../lib/appImages';
import { ContentReviewsSection } from '../components/common/ContentReviewsSection';

interface EducationalAppsPageProps {
  resources: EducationalResource[];
  categories: Category[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: EducationalResource) => void;
  onReloadResources?: () => Promise<void>;
}

export const EducationalAppsPage: React.FC<EducationalAppsPageProps> = ({
  resources,
  categories,
  favorites,
  onToggleFavorite,
  onSelectResource,
  onReloadResources,
}) => {
  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAgeBracket, setSelectedAgeBracket] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'ar' | 'en' | 'bilingual'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'web' | 'android' | 'ios'>('all');

  // External App Launch with Parent Gate state
  const [pendingLaunchUrl, setPendingLaunchUrl] = useState<string | null>(null);
  const [pendingAppTitle, setPendingAppTitle] = useState<string | null>(null);
  const [authorizedApp, setAuthorizedApp] = useState<{ url: string; title: string } | null>(null);
  const [isParentGateOpen, setIsParentGateOpen] = useState<boolean>(false);

  // Reviews modal for individual educational apps
  const [selectedReviewApp, setSelectedReviewApp] = useState<EducationalResource | null>(null);

  // Content Gap Auto-Discovery state
  const [isGapFilling, setIsGapFilling] = useState<boolean>(false);
  const [gapFillResult, setGapFillResult] = useState<GapFillResult | null>(null);

  const handleSearchForGapResources = async () => {
    sounds.playPop();
    setIsGapFilling(true);
    setGapFillResult(null);
    try {
      const res = await fillContentGaps({
        targetCategoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        targetAgeBracketId: selectedAgeBracket !== 'all' ? selectedAgeBracket : undefined,
      });
      setGapFillResult(res);
      if (onReloadResources) {
        await onReloadResources();
      }
      sounds.playChime();
    } catch (err: any) {
      console.error('فشل سد الفجوة:', err);
      sounds.playTryAgain();
    } finally {
      setIsGapFilling(false);
    }
  };

  // Educational apps are resources of content_type === 'external_app' or with launch_url
  const educationalApps = useMemo(() => {
    return resources.filter((r) => {
      // Must be an external app or have a launch url
      return r.content_type === 'external_app' || Boolean(r.launch_url);
    });
  }, [resources]);

  // Filtered Apps based on all combined criteria
  const filteredApps = useMemo(() => {
    return educationalApps.filter((app) => {
      // 1. Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitleAr = app.title_ar.toLowerCase().includes(query);
        const matchesTitleEn = (app.title_en || '').toLowerCase().includes(query);
        const matchesDesc = app.description_ar.toLowerCase().includes(query);
        const matchesDev = (app.provider_name || '').toLowerCase().includes(query);
        const matchesObjectives = (app.learning_objectives || []).some((obj) =>
          obj.toLowerCase().includes(query)
        );
        if (!matchesTitleAr && !matchesTitleEn && !matchesDesc && !matchesDev && !matchesObjectives) {
          return false;
        }
      }

      // 2. Age Bracket Filter: Must match all brackets covered by its documented range
      if (selectedAgeBracket !== 'all') {
        if (!matchesAgeBracket(app, selectedAgeBracket)) {
          return false;
        }
      }

      // 3. Category Filter
      if (selectedCategory !== 'all') {
        const matchesPrimary = app.category_id === selectedCategory;
        const matchesAdditional = (app.additional_categories || []).includes(selectedCategory);
        if (!matchesPrimary && !matchesAdditional) {
          return false;
        }
      }

      // 4. Language Filter
      if (selectedLanguage !== 'all') {
        if (app.language !== selectedLanguage && app.language !== 'bilingual') {
          return false;
        }
      }

      // 5. Platform Filter
      if (selectedPlatform !== 'all') {
        const platforms = app.supported_platforms || ['web'];
        if (!platforms.includes(selectedPlatform)) {
          return false;
        }
      }

      return true;
    });
  }, [educationalApps, searchQuery, selectedAgeBracket, selectedCategory, selectedLanguage, selectedPlatform]);

  const handleLaunchApp = (app: EducationalResource) => {
    sounds.playPop();
    if (!app.launch_url) return;

    // Trigger parent gate to safely protect child before opening an external link
    setPendingLaunchUrl(app.launch_url);
    setPendingAppTitle(app.title_ar);
    setIsParentGateOpen(true);
  };

  const handleParentGateSuccess = () => {
    setIsParentGateOpen(false);
    if (pendingLaunchUrl) {
      sounds.playChime();
      setAuthorizedApp({
        url: pendingLaunchUrl,
        title: pendingAppTitle || 'التطبيق الرسمي',
      });
      setPendingLaunchUrl(null);
      setPendingAppTitle(null);
    }
  };

  const handleResetFilters = () => {
    sounds.playPop();
    setSearchQuery('');
    setSelectedAgeBracket('all');
    setSelectedCategory('all');
    setSelectedLanguage('all');
    setSelectedPlatform('all');
  };

  const activeFiltersCount =
    (selectedAgeBracket !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedLanguage !== 'all' ? 1 : 0) +
    (selectedPlatform !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border border-white/30">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>دليل رسمي موثوق ومفحوص أمنياً للأطفال (2-6 سنوات)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
            التطبيقات التعليمية المعتمدة ⭐
          </h1>
          <p className="text-base sm:text-lg text-amber-50/90 leading-relaxed font-medium">
            مجموعة مختارة بعناية من كبرى المؤسسات التعليمية العالمية والعربية، خالية تماماً من الإعلانات والتتبع التجاري، مصنفة بدقة حسب الفئات العمرية والمجالات التربوية.
          </p>

          {/* Key Trust Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20 text-xs sm:text-sm">
            <div className="bg-black/15 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="block text-white/70 text-[11px]">التطبيقات المعتمدة</span>
              <span className="text-xl font-black text-amber-200">{educationalApps.length} تطبيق</span>
            </div>
            <div className="bg-black/15 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="block text-white/70 text-[11px]">الفئات العمرية</span>
              <span className="text-xl font-black text-amber-200">2 إلى 6 سنوات</span>
            </div>
            <div className="bg-black/15 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="block text-white/70 text-[11px]">المصادر الشريكة</span>
              <span className="text-xl font-black text-amber-200">4 مصادر رسمية</span>
            </div>
            <div className="bg-black/15 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="block text-white/70 text-[11px]">المزامنة التلقائية</span>
              <span className="text-xl font-black text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> كل 24 ساعة
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Control Panel */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-6">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم التطبيق، المطور، المهارة أو الكلمات المفتاحية..."
            className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-400 focus:ring-3 focus:ring-amber-100 transition text-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200/70 hover:bg-slate-200 px-2 py-1 rounded-lg"
            >
              مسح
            </button>
          )}
        </div>

        {/* 1. Age Bracket Selector (Mandatory Requirement) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <span>الفئة العمرية الدقيقة</span>
              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                موثقة رسمياً
              </span>
            </label>
            <span className="text-[11px] text-slate-400">
              يظهر التطبيق في كل الفئات التي يغطيها نطاقه
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => {
                sounds.playPop();
                setSelectedAgeBracket('all');
              }}
              className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition text-center border ${
                selectedAgeBracket === 'all'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs font-black'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              جميع الأعمار (2-6)
            </button>

            {AGE_BRACKETS.map((bracket) => (
              <button
                key={bracket.id}
                onClick={() => {
                  sounds.playPop();
                  setSelectedAgeBracket(bracket.id);
                }}
                className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition text-center border flex flex-col items-center justify-center ${
                  selectedAgeBracket === bracket.id
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs font-black'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{bracket.label_ar}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Educational Category Selector (The 14 Domains) */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2.5">
            المجال التعليمي والتربوي
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                sounds.playPop();
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white border-amber-700'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              جميع المجالات
            </button>
            {categories
              .filter((c) => c.id !== 'cat-worksheets' && c.id !== 'cat-external-apps')
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    selectedCategory === cat.id
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {cat.title_ar}
                </button>
              ))}
          </div>
        </div>

        {/* 3. Language & Platform Sub-Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          {/* Language Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              لغة التطبيق
            </label>
            <div className="flex gap-1.5">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'ar', label: 'العربية فقط' },
                { id: 'en', label: 'الإنجليزية' },
                { id: 'bilingual', label: 'ثنائي اللغة' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedLanguage(lang.id as any);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition border text-center ${
                    selectedLanguage === lang.id
                      ? 'bg-slate-800 text-white border-slate-900'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              المنصة المدعومة
            </label>
            <div className="flex gap-1.5">
              {[
                { id: 'all', label: 'جميع المنصات', icon: Globe },
                { id: 'web', label: 'متصفح ويب', icon: Laptop },
                { id: 'android', label: 'أندرويد', icon: Smartphone },
                { id: 'ios', label: 'آبل iOS', icon: Apple },
              ].map((plat) => {
                const IconComponent = plat.icon;
                return (
                  <button
                    key={plat.id}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedPlatform(plat.id as any);
                    }}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition border flex items-center justify-center gap-1 ${
                      selectedPlatform === plat.id
                        ? 'bg-slate-800 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{plat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            يتم عرض <strong className="text-slate-800">{filteredApps.length}</strong> من أصل{' '}
            <strong>{educationalApps.length}</strong> تطبيق تعليمي موثق
          </span>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط جميع الفلاتر ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Applications Cards Grid */}
      {filteredApps.length === 0 ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-amber-200 max-w-xl mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {selectedCategory !== 'all' || selectedAgeBracket !== 'all'
                  ? 'هذه الفئة بانتظار توفير تطبيقات معتمدة جديدة'
                  : 'لا توجد تطبيقات تطابق خيارات البحث الحالية'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                {selectedCategory !== 'all'
                  ? `يقوم النظام بالبحث في المصادر التعليمية المفتوحة عن تطبيقات متوافقة مع معايير الأمان وخالية من الإعلانات لمجال (${categories.find((c) => c.id === selectedCategory)?.title_ar || 'المختار'}).`
                  : 'جرّب اختيار فئة عمرية أوسع أو مسح كلمات البحث للاطلاع على التطبيقات المتاحة.'}
              </p>
            </div>

            {/* Gap Resolution Action for Admins / Parents */}
            {(selectedCategory !== 'all' || selectedAgeBracket !== 'all') && (
              <div className="pt-2 pb-1">
                <button
                  disabled={isGapFilling}
                  onClick={handleSearchForGapResources}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-xs transition shadow-sm flex items-center justify-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isGapFilling ? 'animate-spin' : ''}`} />
                  <span>
                    {isGapFilling
                      ? 'جاري فحص المصادر التربوية المعتمدة وسد الفجوة...'
                      : 'البحث عن موارد وتطبيقات لهذه الفئة'}
                  </span>
                </button>
              </div>
            )}

            {/* Gap Fill Result Banner */}
            {gapFillResult && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-right space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>نتيجة عملية البحث الذكي عن الموارد:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                  <div className="bg-white p-2 rounded-xl border border-amber-100">
                    <span className="block text-slate-400">عناصر مكتشفة</span>
                    <strong className="text-slate-800">{gapFillResult.itemsFound}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-amber-100">
                    <span className="block text-slate-400">نُشرت تلقائياً</span>
                    <strong className="text-emerald-700">{gapFillResult.itemsImported}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-amber-100">
                    <span className="block text-slate-400">مكررة تم تجاهلها</span>
                    <strong className="text-slate-700">{gapFillResult.itemsDuplicatesIgnored}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-amber-100">
                    <span className="block text-slate-400">بحاجة لمراجعة</span>
                    <strong className="text-amber-700">{gapFillResult.itemsFlagged}</strong>
                  </div>
                </div>
                {gapFillResult.itemsImported === 0 && (
                  <p className="text-[11px] text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                    ℹ️ لم تُتح المصادر الشريكة بعد تطبيقات مجانية وموثقة إضافية لهذا التخصيص دون إعلانات. تم توثيق الفجوة للمراجعة بدقة دون اختلاق بيانات وهمية.
                  </p>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                إعادة ضبط جميع الفلاتر
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const isFav = favorites.includes(app.id);
            const appAgeBrackets = getMatchingAgeBrackets(app);
            const platforms = app.supported_platforms || ['web'];

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-amber-200/80 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail Image Header */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={getDomainAppropriateImage(app)}
                    alt={app.title_ar}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onToggleFavorite(app.id);
                    }}
                    className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition ${
                      isFav
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-black/30 text-white/80 hover:bg-black/50 hover:text-white'
                    }`}
                    title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  {/* Verified Developer Pill */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 flex items-center gap-1 shadow-xs border border-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{app.provider_name}</span>
                  </div>

                  {/* Platform Icons in bottom-right */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    {platforms.includes('web') && (
                      <span className="bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                        <Globe className="w-3 h-3 text-sky-400" /> Web
                      </span>
                    )}
                    {platforms.includes('android') && (
                      <span className="bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                        <Smartphone className="w-3 h-3 text-emerald-400" /> Android
                      </span>
                    )}
                    {platforms.includes('ios') && (
                      <span className="bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                        <Apple className="w-3 h-3 text-slate-200" /> iOS
                      </span>
                    )}
                  </div>

                  {/* Language Badge bottom-left */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-md font-black">
                      {app.language === 'ar' ? 'عربي' : app.language === 'en' ? 'إنجليزي' : 'ثنائي اللغة'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* App Title */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition">
                        {app.title_ar}
                      </h3>
                      {app.title_en && (
                        <p className="text-xs text-slate-400 font-medium dir-ltr text-right">
                          {app.title_en}
                        </p>
                      )}
                    </div>

                    {/* Age Range & Covered Brackets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                        العمر: {app.age_min} إلى {app.age_max} سنوات
                      </span>
                      {appAgeBrackets.map((brkId) => {
                        const brk = AGE_BRACKETS.find((b) => b.id === brkId);
                        return (
                          <span
                            key={brkId}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold"
                          >
                            {brk ? brk.label_ar.replace('من ', '') : brkId}
                          </span>
                        );
                      })}
                    </div>

                    {/* Clear Arabic Description */}
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {app.description_ar}
                    </p>

                    {/* Target Learning Skills / Objectives */}
                    {app.learning_objectives && app.learning_objectives.length > 0 && (
                      <div className="pt-2">
                        <span className="block text-[11px] font-bold text-slate-500 mb-1">
                          المهارات المستهدفة:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {app.learning_objectives.slice(0, 3).map((obj, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200/60 px-2 py-0.5 rounded-md font-medium"
                            >
                              • {obj}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trust & Safety Info Footer */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    {/* Safety Attributes */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Check className="w-3 h-3 text-emerald-600" />
                        مجاني وبدون إعلانات
                      </span>

                      {app.last_verified_at && (
                        <span className="flex items-center gap-1 text-slate-400" title="تاريخ آخر تحقق من الرابط">
                          <Calendar className="w-3 h-3" />
                          فُحص:{' '}
                          {new Date(app.last_verified_at).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons: Launch & Parent Reviews */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleLaunchApp(app)}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-md"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-200" />
                        <span>فتح التطبيق الرسمي</span>
                        <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                      </button>

                      <button
                        onClick={() => {
                          sounds.playPop();
                          setSelectedReviewApp(app);
                        }}
                        className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/70 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                        <span>تجارب وتقييمات أولياء الأمور</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Discovery System & COPPA Safety Compliance Information Accordion */}
      <div className="bg-amber-100/40 rounded-3xl p-6 sm:p-8 border border-amber-200/80">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <h4 className="text-base font-bold text-amber-950">
              كيف يكتشف ويتحقق نظام «عالم الصغار» من التطبيقات التعليمية؟
            </h4>
            <p className="leading-relaxed">
              يقوم محرك الاكتشاف التلقائي بالخادم بالاتصال بالمستودعات والمصادر التربوية المفتوحة الرسمية (مثل Khan Academy Kids، PBS KIDS، أهلاً سمسم لورشة سمسم الدولية، وStarfall Education) كل 24 ساعة.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pr-2">
              <li>يتم فحص الروابط والنطاقات المصرح بها حصرياً عبر بروتوكول HTTPS الآمن.</li>
              <li>التحقق الصارم من غياب الإعلانات التجارية والمشتريات الخفية لضمان بيئة آمنة للطفل.</li>
              <li>اعتماد العمر الرسمي الموثق في وثائق المطور، وتحويل أي تطبيق غير مؤكد الفئة العمرية للمراجعة اليدوية للمشرف.</li>
              <li>حماية الأطفال ببوابة الوالدين الرياضية (Parent Gate) قبل الانتقال لأي رابط خارجي رسمي.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Parent Gate Modal for External Safe Navigation */}
      {isParentGateOpen && (
        <ParentGateModal
          isOpen={isParentGateOpen}
          destinationTitle={pendingAppTitle || 'التطبيق الرسمي'}
          isExternalLink={true}
          onSuccess={handleParentGateSuccess}
          onClose={() => {
            setIsParentGateOpen(false);
            setPendingLaunchUrl(null);
            setPendingAppTitle(null);
          }}
        />
      )}

      {/* Outbound Verified Safe Link Modal */}
      {authorizedApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-200 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-amber-950 mb-1">تم التحقق من بوابة ولي الأمر بنجاح!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                أنت الآن جاهز للانتقال إلى: <strong>{authorizedApp.title}</strong> في علامة تبويب جديدة بأمان.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={authorizedApp.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setAuthorizedApp(null)}
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-sm transition shadow-sm inline-flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>متابعة الانتقال الآن</span>
              </a>
              <button
                onClick={() => setAuthorizedApp(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Reviews & Comments Modal */}
      {selectedReviewApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in"
        >
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-amber-200 shadow-2xl overflow-hidden my-8">
            <div className="p-4 sm:p-6 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-black text-amber-800 bg-amber-200/60 px-3 py-1 rounded-full">
                  تطبيق تعليمي معتمد
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {selectedReviewApp.title_ar}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReviewApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-amber-100 transition cursor-pointer"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
              <ContentReviewsSection
                contentId={selectedReviewApp.id}
                contentType="app"
                contentTitle={selectedReviewApp.title_ar}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
