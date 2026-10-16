import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  ShieldCheck,
  Heart,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Hash,
  Smile,
  Gamepad2,
  Brain,
  Palette,
  Smartphone,
  BookMarked,
  Printer,
  Shield,
  CalendarCheck,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Star,
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { SiteRatingModal } from './SiteRatingModal';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  favoritesCount: number;
  isAdmin?: boolean;
  onOpenParentGateForAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  favoritesCount,
  isAdmin = false,
  onOpenParentGateForAdmin,
}) => {
  const [soundActive, setSoundActive] = useState<boolean>(sounds.isEnabled());
  const [isDiscoverOpen, setIsDiscoverOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>('learning');
  const [isRateModalOpen, setIsRateModalOpen] = useState<boolean>(false);
  const discoverRef = useRef<HTMLDivElement>(null);

  const toggleSound = () => {
    const next = sounds.toggleSound();
    setSoundActive(next);
  };

  // Close discover dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (discoverRef.current && !discoverRef.current.contains(event.target as Node)) {
        setIsDiscoverOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDiscoverOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleItemClick = (view: string, param?: string) => {
    sounds.playPop();
    setIsDiscoverOpen(false);
    setIsMobileMenuOpen(false);
    onNavigate(view, param);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo / Wordmark */}
          <button
            onClick={() => handleItemClick('home')}
            className="flex items-center gap-2.5 text-right group cursor-pointer shrink-0"
            aria-label="الرئيسية - عالم الصغار"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 group-hover:rotate-6 transition-transform">
              ⭐
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight leading-tight group-hover:text-amber-800 transition">
                عالم الصغار
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-amber-600/90 tracking-wide">
                Little Stars
              </span>
            </div>
          </button>

          {/* Desktop Navigation: Simple, Elegant & Uncluttered */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-bold text-slate-700">
            {/* 1. الرئيسية */}
            <button
              onClick={() => handleItemClick('home')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                currentView === 'home'
                  ? 'bg-amber-100 text-amber-900 font-black shadow-2xs'
                  : 'hover:bg-amber-50 hover:text-amber-800'
              }`}
            >
              الرئيسية
            </button>

            {/* 2. قائمة «اكتشف» المنسدلة المنظمة */}
            <div className="relative" ref={discoverRef}>
              <button
                type="button"
                onClick={() => setIsDiscoverOpen(!isDiscoverOpen)}
                aria-expanded={isDiscoverOpen}
                aria-haspopup="true"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDiscoverOpen || currentView === 'browse' || currentView === 'activities_hub' || currentView === 'apps'
                    ? 'bg-amber-100 text-amber-900 font-black'
                    : 'hover:bg-amber-50 hover:text-amber-800'
                }`}
              >
                <span>اكتشف</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 text-amber-700 ${
                    isDiscoverOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Mega Dropdown Menu for Desktop */}
              {isDiscoverOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-[720px] max-w-[90vw] bg-white rounded-3xl shadow-2xl border border-amber-200/90 p-6 z-50 text-right animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                >
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-100">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-black text-amber-950">استكشف جميع أقسام المنصة التعليمية</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">محتوى آمن 100% للأطفال 2–6 سنوات</span>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {/* المجموعة 1: التعلم */}
                    <div className="space-y-3">
                      <div className="text-xs font-black text-amber-800 uppercase tracking-wider pb-1 border-b border-amber-100">
                        التعلم
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleItemClick('activities_hub', 'arabic-language')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-amber-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-amber-800">الحروف واللغة</div>
                            <div className="text-[10px] text-slate-500 leading-snug">عربي وإنجليزي وتتبع</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleItemClick('activities_hub', 'math-numbers')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-emerald-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Hash className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-emerald-800">الأرقام والرياضيات</div>
                            <div className="text-[10px] text-slate-500 leading-snug">عد ومقارنة وأشكال</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleItemClick('activities_hub', 'animals-nature')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-teal-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Smile className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-teal-800">العلوم والطبيعة</div>
                            <div className="text-[10px] text-slate-500 leading-snug">الحيوانات والفصول</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* المجموعة 2: اللعب والإبداع */}
                    <div className="space-y-3">
                      <div className="text-xs font-black text-purple-800 uppercase tracking-wider pb-1 border-b border-purple-100">
                        اللعب والإبداع
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleItemClick('browse')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-purple-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Gamepad2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-purple-800">الألعاب التعليمية</div>
                            <div className="text-[10px] text-slate-500 leading-snug">ألعاب تفاعلية فورية</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleItemClick('activities_hub', 'logic-memory')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-violet-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Brain className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-violet-800">الذاكرة والتركيز</div>
                            <div className="text-[10px] text-slate-500 leading-snug">مطابقة وتفكير ذكي</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleItemClick('activities_hub', 'colors-shapes')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-rose-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Palette className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-rose-800">الرسم والتلوين</div>
                            <div className="text-[10px] text-slate-500 leading-snug">استوديو الألوان الحر</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* المجموعة 3: المكتبة التعليمية */}
                    <div className="space-y-3">
                      <div className="text-xs font-black text-blue-800 uppercase tracking-wider pb-1 border-b border-blue-100">
                        المكتبة التعليمية
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleItemClick('apps')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-blue-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-blue-800">التطبيقات التعليمية</div>
                            <div className="text-[10px] text-slate-500 leading-snug">أفضل تطبيقات الأطفال</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleItemClick('activities_hub', 'illustrated-stories')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-amber-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <BookMarked className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-amber-800">القصص المصورة</div>
                            <div className="text-[10px] text-slate-500 leading-snug">حكايات هادفة وممتعة</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleItemClick('printables')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-emerald-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Printer className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-emerald-800">أوراق العمل</div>
                            <div className="text-[10px] text-slate-500 leading-snug">١٢٠ ورقة عمل واختبار</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* المجموعة 4: للأهل */}
                    <div className="space-y-3">
                      <div className="text-xs font-black text-amber-900 uppercase tracking-wider pb-1 border-b border-amber-100">
                        للأهل
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleItemClick('parents')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-amber-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-amber-800">دليل ولي الأمر</div>
                            <div className="text-[10px] text-slate-500 leading-snug">إرشادات الشاشة والتربية</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleItemClick('learning_plan')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-orange-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <CalendarCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-orange-800">الخطط التعليمية</div>
                            <div className="text-[10px] text-slate-500 leading-snug">روتين يومي مقترح</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleItemClick('favorites')}
                          className="w-full text-right p-2.5 rounded-xl hover:bg-rose-50/80 transition flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Heart className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-rose-800">الأنشطة المفضلة</div>
                            <div className="text-[10px] text-slate-500 leading-snug">{favoritesCount} نشاط محفوظ</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Hub Bar inside Dropdown */}
                  <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between bg-amber-50/50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                    <span className="text-xs text-slate-600 font-bold">
                      هل تبحث عن جميع الأنشطة في مكان واحد تفاعلي؟
                    </span>
                    <button
                      onClick={() => handleItemClick('activities_hub')}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5"
                    >
                      <span>مركز الأنشطة التفاعلية الشامل</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. خطتي التعليمية */}
            <button
              onClick={() => handleItemClick('learning_plan')}
              className="px-3.5 py-2 rounded-xl transition-all hover:bg-amber-50 hover:text-amber-800 flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4 text-amber-600" />
              <span>خطتي التعليمية</span>
            </button>

            {/* 4. أوراق العمل */}
            <button
              onClick={() => handleItemClick('printables')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'printables'
                  ? 'bg-amber-100 text-amber-900 font-black shadow-2xs'
                  : 'hover:bg-amber-50 hover:text-amber-800'
              }`}
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>أوراق العمل</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-black">
                120
              </span>
            </button>
          </nav>

          {/* Zone 3: Actions (Sound, Favorites, Admin Gate, Mobile Menu Button) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                soundActive
                  ? 'bg-amber-100/70 border-amber-300 text-amber-800 hover:bg-amber-200'
                  : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
              }`}
              title={soundActive ? 'كتم الصوت' : 'تشغيل المؤثرات الصوتية'}
              aria-label={soundActive ? 'كتم الصوت' : 'تشغيل المؤثرات الصوتية'}
            >
              {soundActive ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Favorites Button */}
            <button
              onClick={() => handleItemClick('favorites')}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative ${
                currentView === 'favorites'
                  ? 'bg-rose-100 border-rose-300 text-rose-700'
                  : 'bg-white border-amber-200/80 text-slate-600 hover:text-rose-600 hover:border-rose-300'
              }`}
              title="الأنشطة المفضلة"
              aria-label="الأنشطة المفضلة"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Rate Website Button */}
            <button
              onClick={() => {
                sounds.playPop();
                setIsRateModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-black text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-2xl transition border border-amber-300 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              title="تقييم موقع عالم الصغار بالنجوم"
              aria-label="تقييم موقع عالم الصغار بالنجوم"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="hidden sm:inline">قيّم الموقع</span>
            </button>

            {/* Admin Entry Point - Only visible to verified admins */}
            {isAdmin && onOpenParentGateForAdmin && (
              <button
                onClick={onOpenParentGateForAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-2xl transition border border-amber-300 cursor-pointer shadow-2xs"
                title="دخول بوابة الإدارة للمشرف المعتمد"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>بوابة الإدارة</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl border border-amber-200 bg-white text-slate-700 hover:bg-amber-50 cursor-pointer"
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Simple, Touch-Friendly, Accordion-Grouped) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-5 text-right animate-in slide-in-from-right duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-lg">⭐</div>
                  <span className="font-black text-slate-900 text-lg">عالم الصغار</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Direct Primary Links */}
              <div className="py-4 space-y-1">
                <button
                  onClick={() => handleItemClick('home')}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between ${
                    currentView === 'home' ? 'bg-amber-100 text-amber-900 font-black' : 'text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <span>الرئيسية</span>
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleItemClick('learning_plan')}
                  className="w-full text-right px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-amber-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-amber-600" />
                    <span>خطتي التعليمية</span>
                  </span>
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleItemClick('printables')}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between ${
                    currentView === 'printables' ? 'bg-amber-100 text-amber-900 font-black' : 'text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-emerald-600" />
                    <span>أوراق العمل والاختبارات</span>
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">120 ورقة</span>
                </button>

                <button
                  onClick={() => handleItemClick('favorites')}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between ${
                    currentView === 'favorites' ? 'bg-rose-50 text-rose-900 font-black' : 'text-slate-700 hover:bg-rose-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>المفضلة</span>
                  </span>
                  {favoritesCount > 0 && (
                    <span className="text-xs bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                      {favoritesCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Accordion: «اكتشف الأقسام التعليمية» */}
              <div className="pt-2 border-t border-amber-100">
                <span className="text-xs font-black text-amber-900 block mb-2 px-2">
                  اكتشف الأقسام التعليمية
                </span>

                {/* Group 1: التعلم */}
                <div className="border border-amber-200/70 rounded-2xl overflow-hidden mb-2">
                  <button
                    onClick={() => setOpenMobileAccordion(openMobileAccordion === 'learning' ? null : 'learning')}
                    className="w-full text-right px-4 py-2.5 bg-amber-50/60 font-black text-xs text-amber-950 flex items-center justify-between"
                  >
                    <span>التعلم (الحروف، الأرقام، العلوم)</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMobileAccordion === 'learning' ? 'rotate-180' : ''}`} />
                  </button>
                  {openMobileAccordion === 'learning' && (
                    <div className="p-2 space-y-1 bg-white">
                      <button
                        onClick={() => handleItemClick('activities_hub', 'arabic-language')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-amber-50 rounded-xl flex items-center gap-2"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>الحروف واللغة العربية</span>
                      </button>
                      <button
                        onClick={() => handleItemClick('activities_hub', 'math-numbers')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-amber-50 rounded-xl flex items-center gap-2"
                      >
                        <Hash className="w-3.5 h-3.5 text-emerald-600" />
                        <span>الأرقام والرياضيات</span>
                      </button>
                      <button
                        onClick={() => handleItemClick('activities_hub', 'animals-nature')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-amber-50 rounded-xl flex items-center gap-2"
                      >
                        <Smile className="w-3.5 h-3.5 text-teal-600" />
                        <span>العلوم والطبيعة</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Group 2: اللعب والإبداع */}
                <div className="border border-purple-200/70 rounded-2xl overflow-hidden mb-2">
                  <button
                    onClick={() => setOpenMobileAccordion(openMobileAccordion === 'play' ? null : 'play')}
                    className="w-full text-right px-4 py-2.5 bg-purple-50/60 font-black text-xs text-purple-950 flex items-center justify-between"
                  >
                    <span>اللعب والإبداع (الألعاب، الذاكرة، التلوين)</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMobileAccordion === 'play' ? 'rotate-180' : ''}`} />
                  </button>
                  {openMobileAccordion === 'play' && (
                    <div className="p-2 space-y-1 bg-white">
                      <button
                        onClick={() => handleItemClick('browse')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-purple-50 rounded-xl flex items-center gap-2"
                      >
                        <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>الألعاب التعليمية</span>
                      </button>
                      <button
                        onClick={() => handleItemClick('activities_hub', 'logic-memory')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-purple-50 rounded-xl flex items-center gap-2"
                      >
                        <Brain className="w-3.5 h-3.5 text-violet-600" />
                        <span>الذاكرة والتركيز</span>
                      </button>
                      <button
                        onClick={() => handleItemClick('activities_hub', 'colors-shapes')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-purple-50 rounded-xl flex items-center gap-2"
                      >
                        <Palette className="w-3.5 h-3.5 text-rose-600" />
                        <span>الرسم والتلوين</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Group 3: المكتبة التعليمية */}
                <div className="border border-blue-200/70 rounded-2xl overflow-hidden mb-2">
                  <button
                    onClick={() => setOpenMobileAccordion(openMobileAccordion === 'library' ? null : 'library')}
                    className="w-full text-right px-4 py-2.5 bg-blue-50/60 font-black text-xs text-blue-950 flex items-center justify-between"
                  >
                    <span>المكتبة التعليمية (تطبيقات، قصص، طباعة)</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMobileAccordion === 'library' ? 'rotate-180' : ''}`} />
                  </button>
                  {openMobileAccordion === 'library' && (
                    <div className="p-2 space-y-1 bg-white">
                      <button
                        onClick={() => handleItemClick('apps')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 rounded-xl flex items-center gap-2"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                        <span>التطبيقات التعليمية المعتمدة</span>
                      </button>
                      <button
                        onClick={() => handleItemClick('activities_hub', 'illustrated-stories')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 rounded-xl flex items-center gap-2"
                      >
                        <BookMarked className="w-3.5 h-3.5 text-amber-600" />
                        <span>القصص المصورة</span>
                      </button>
                      <button
                        onClick={() => handleItemClick('activities_hub')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 rounded-xl flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>مركز الأنشطة الشامل</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Group 4: للأهل */}
                <div className="border border-amber-200/70 rounded-2xl overflow-hidden mb-2">
                  <button
                    onClick={() => setOpenMobileAccordion(openMobileAccordion === 'parents' ? null : 'parents')}
                    className="w-full text-right px-4 py-2.5 bg-amber-50/60 font-black text-xs text-amber-950 flex items-center justify-between"
                  >
                    <span>للأهل (دليل ولي الأمر، التربية)</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMobileAccordion === 'parents' ? 'rotate-180' : ''}`} />
                  </button>
                  {openMobileAccordion === 'parents' && (
                    <div className="p-2 space-y-1 bg-white">
                      <button
                        onClick={() => handleItemClick('parents')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-amber-50 rounded-xl flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        <span>دليل ولي الأمر والتربية</span>
                      </button>
                      <button
                        onClick={() => handleItemClick('learning_plan')}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-amber-50 rounded-xl flex items-center gap-2"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 text-orange-600" />
                        <span>الخطط التعليمية اليومية</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions for Mobile */}
            <div className="pt-4 border-t border-amber-100 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  sounds.playPop();
                  setIsRateModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-amber-950 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>تقييم موقع عالم الصغار بالنجوم</span>
              </button>

              {isAdmin && onOpenParentGateForAdmin && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenParentGateForAdmin();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>دخول بوابة الإدارة</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Website Star Rating Modal */}
      <SiteRatingModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
      />
    </header>
  );
};

