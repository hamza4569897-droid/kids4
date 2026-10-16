import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  Languages,
  Hash,
  Palette,
  Smile,
  Brain,
  Heart,
  Eye,
  Music,
  Printer,
  ChevronLeft,
  ArrowRight,
  Filter,
  Award,
  Layers,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { sounds } from '../lib/audio';
import { AgeGroup } from '../types/worksheet';
import { ACTIVITY_HUB_CATEGORIES, ActivityHubCategory } from '../data/activitiesHubData';
import { ArabicLanguageHubActivity } from '../components/activities/ArabicLanguageHubActivity';
import { EnglishLanguageHubActivity } from '../components/activities/EnglishLanguageHubActivity';
import { MathNumbersHubActivity } from '../components/activities/MathNumbersHubActivity';
import { ColorsShapesHubActivity } from '../components/activities/ColorsShapesHubActivity';
import { AnimalsNatureHubActivity } from '../components/activities/AnimalsNatureHubActivity';
import { LogicMemoryHubActivity } from '../components/activities/LogicMemoryHubActivity';
import { LifeSkillsValuesHubActivity } from '../components/activities/LifeSkillsValuesHubActivity';
import { ObservationFocusHubActivity } from '../components/activities/ObservationFocusHubActivity';
import { EducationalSongsStation } from '../components/activities/EducationalSongsStation';
import { InteractiveStoryHubActivity } from '../components/activities/InteractiveStoryHubActivity';
import { ContentReviewsSection } from '../components/common/ContentReviewsSection';

interface EducationalActivitiesHubPageProps {
  onNavigateToPrintables?: () => void;
  onNavigateHome?: () => void;
  initialCategorySlug?: string | null;
}

export const EducationalActivitiesHubPage: React.FC<EducationalActivitiesHubPageProps> = ({
  onNavigateToPrintables,
  onNavigateHome,
  initialCategorySlug,
}) => {
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ActivityHubCategory | null>(null);
  const [activeSkillTag, setActiveSkillTag] = useState<string>('all');

  // React to initialCategorySlug change
  React.useEffect(() => {
    if (initialCategorySlug) {
      const found = ACTIVITY_HUB_CATEGORIES.find(
        (c) => c.slug === initialCategorySlug || c.id === initialCategorySlug
      );
      if (found) {
        setSelectedCategory(found);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [initialCategorySlug]);

  // Icons map
  const iconMap: Record<string, React.ElementType> = {
    BookOpen,
    Languages,
    Hash,
    Palette,
    Smile,
    Brain,
    Heart,
    Eye,
    Music,
    Sparkles,
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return ACTIVITY_HUB_CATEGORIES.filter((cat) => {
      // Age filter
      if (selectedAge !== 'all') {
        if (!cat.ageBrackets.includes(selectedAge as AgeGroup)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = cat.title_ar.toLowerCase().includes(query) || cat.title_en.toLowerCase().includes(query);
        const matchesDesc = cat.description_ar.toLowerCase().includes(query);
        const matchesSkill = cat.skills.some((s) => s.toLowerCase().includes(query));
        const matchesKeywords = cat.seoKeywords.some((k) => k.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesSkill && !matchesKeywords) return false;
      }

      // Skill tag filter
      if (activeSkillTag !== 'all') {
        if (!cat.skills.includes(activeSkillTag)) return false;
      }

      return true;
    });
  }, [selectedAge, searchQuery, activeSkillTag]);

  // All unique skills for quick filter pills
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    ACTIVITY_HUB_CATEGORIES.forEach((c) => c.skills.forEach((s) => set.add(s)));
    return Array.from(set).slice(0, 10);
  }, []);

  const handleOpenCategory = (cat: ActivityHubCategory) => {
    sounds.playPop();
    setSelectedCategory(cat);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    sounds.playPop();
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-12">
      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalApplication',
            name: 'مركز الأنشطة التعليمية — عالم الصغار',
            description:
              'مكتبة الأنشطة التعليمية التفاعلية للأطفال من سنتين إلى 6 سنوات، تضم الحروف واللغة العربية والإنجليزية والرياضيات والألوان والأشكال والحيوانات والأناشيد والقصص المصورة.',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            audience: {
              '@type': 'EducationalAudience',
              educationalRole: 'student',
              suggestedAge: '2-6',
            },
          }),
        }}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-100/70 via-orange-50/40 to-white p-6 sm:p-10 border border-amber-200/80 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-200/70 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>مركز الأنشطة التعليمية الشامل (من عمر سنتين إلى ٦ سنوات)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-950 leading-tight">
            مركز الأنشطة التعليمية التفاعلية 🌟
          </h1>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            مكتبة متكاملة تضم 10 مجالات رئيسية للأطفال في مرحلة الطفولة المبكرة والروضة: الحروف، الإنجليزية، الحساب، الألوان، الحيوانات، الذاكرة، السلوكيات، التركيز، الأناشيد، والقصص المصورة. بدون إعلانات وبطريقة علمية مشجعة!
          </p>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                sounds.playPop();
                if (onNavigateToPrintables) onNavigateToPrintables();
              }}
              className="px-5 py-2.5 rounded-2xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-50 transition shadow-2xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-amber-600" />
              <span>قسم أوراق العمل والاختبارات المطبوعة</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">
              ✨ جميع الأنشطة التفاعلية متاحة أيضاً بأوراق عمل قابلة للطباعة المباشرة!
            </span>
          </div>
        </div>
      </section>

      {/* If a category is selected, render its dedicated interactive activity engine */}
      {selectedCategory ? (
        <section className="space-y-6">
          {selectedCategory.id === 'hub-arabic-lang' && (
            <ArabicLanguageHubActivity
              onBack={handleBackToHub}
              onOpenWorksheet={onNavigateToPrintables}
              initialAge={(selectedAge !== 'all' ? selectedAge : '3-4') as AgeGroup}
            />
          )}

          {selectedCategory.id === 'hub-english-lang' && (
            <EnglishLanguageHubActivity
              onBack={handleBackToHub}
              onOpenWorksheet={onNavigateToPrintables}
              initialAge={(selectedAge !== 'all' ? selectedAge : '3-4') as AgeGroup}
            />
          )}

          {selectedCategory.id === 'hub-math-numbers' && (
            <MathNumbersHubActivity
              onBack={handleBackToHub}
              onOpenWorksheet={onNavigateToPrintables}
              initialAge={(selectedAge !== 'all' ? selectedAge : '3-4') as AgeGroup}
            />
          )}

          {selectedCategory.id === 'hub-colors-shapes' && (
            <ColorsShapesHubActivity
              onBack={handleBackToHub}
              onOpenWorksheet={onNavigateToPrintables}
              initialAge={(selectedAge !== 'all' ? selectedAge : '3-4') as AgeGroup}
            />
          )}

          {selectedCategory.id === 'hub-animals-nature' && (
            <AnimalsNatureHubActivity
              onBack={handleBackToHub}
              onOpenWorksheet={onNavigateToPrintables}
              initialAge={(selectedAge !== 'all' ? selectedAge : '3-4') as AgeGroup}
            />
          )}

          {selectedCategory.id === 'hub-logic-memory' && (
            <LogicMemoryHubActivity
              onBack={handleBackToHub}
              onOpenWorksheet={onNavigateToPrintables}
              initialAge={(selectedAge !== 'all' ? selectedAge : '3-4') as AgeGroup}
            />
          )}

          {selectedCategory.id === 'hub-life-skills' && (
            <LifeSkillsValuesHubActivity
              onBack={handleBackToHub}
              onOpenWorksheet={onNavigateToPrintables}
              initialAge={(selectedAge !== 'all' ? selectedAge : '3-4') as AgeGroup}
            />
          )}

          {selectedCategory.id === 'hub-observation-focus' && (
            <ObservationFocusHubActivity
              onBack={handleBackToHub}
              onOpenWorksheet={onNavigateToPrintables}
              initialAge={(selectedAge !== 'all' ? selectedAge : '3-4') as AgeGroup}
            />
          )}

          {selectedCategory.id === 'hub-educational-songs' && (
            <EducationalSongsStation
              onBack={handleBackToHub}
              onOpenWorksheet={onNavigateToPrintables}
              initialAge={(selectedAge !== 'all' ? selectedAge : '3-4') as AgeGroup}
            />
          )}

          {selectedCategory.id === 'hub-illustrated-stories' && (
            <InteractiveStoryHubActivity
              onBack={handleBackToHub}
              onOpenWorksheet={onNavigateToPrintables}
              initialAge={(selectedAge !== 'all' ? selectedAge : '3-4') as AgeGroup}
            />
          )}

          {/* Child-Safe Reviews & Ratings for this Educational Activity Hub */}
          <ContentReviewsSection
            contentId={selectedCategory.id}
            contentType="activity"
            contentTitle={selectedCategory.title_ar}
          />
        </section>
      ) : (
        /* If browsing hub overview */
        <div className="space-y-8">
          {/* Controls: Age Filter & Search Bar */}
          <div className="space-y-4 bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs">
            {/* Age Filter Segmented Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 block">الفئة العمرية الدقيقة للطفل:</span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'جميع الأعمار (2–6 سنوات)' },
                  { id: '2-3', label: 'من سنتين إلى أقل من 3 سنوات' },
                  { id: '3-4', label: 'من 3 سنوات إلى أقل من 4 سنوات' },
                  { id: '4-5', label: 'من 4 سنوات إلى أقل من 5 سنوات' },
                  { id: '5-6', label: 'من 5 سنوات إلى 6 سنوات' },
                ].map((age) => (
                  <button
                    key={age.id}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedAge(age.id);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      selectedAge === age.id
                        ? 'bg-amber-500 text-white shadow-sm scale-102'
                        : 'bg-amber-50/50 text-slate-700 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative pt-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالمهارة أو اسم النشاط (مثال: الحروف، الجمع، الألوان، الحيوانات، الذاكرة...)"
                className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-amber-50/30 border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              />
              <Search className="w-5 h-5 text-amber-700 absolute top-5.5 right-4 pointer-events-none" />
            </div>

            {/* Quick Skills Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs font-bold text-slate-400">مهارات سريعة:</span>
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveSkillTag('all');
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                  activeSkillTag === 'all'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                الكل
              </button>
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    sounds.playPop();
                    setActiveSkillTag(activeSkillTag === skill ? 'all' : skill);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                    activeSkillTag === skill
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Hub Categories Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  أقسام مركز الأنشطة ({filteredCategories.length})
                </h2>
                <p className="text-xs text-slate-500">اختر نشاطاً لبدء التجربة التفاعلية المباشرة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((cat) => {
                const Icon = iconMap[cat.iconName] || BookOpen;
                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-3xl border border-amber-200/80 p-6 flex flex-col justify-between hover:shadow-lg transition-all hover:-translate-y-1 group"
                  >
                    <div className="space-y-4">
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.colorGradient} text-white flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="text-[11px] font-extrabold bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                          {cat.badge}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-800 transition">
                          {cat.title_ar}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold">{cat.title_en}</p>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1 line-clamp-3">
                          {cat.description_ar}
                        </p>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {cat.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleOpenCategory(cat)}
                        className={`flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r ${cat.colorGradient} text-white text-xs font-extrabold shadow-xs hover:shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98`}
                      >
                        <span>تشغيل النشاط التفاعلي</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {onNavigateToPrintables && (
                        <button
                          onClick={() => {
                            sounds.playPop();
                            onNavigateToPrintables();
                          }}
                          className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-800 border border-slate-200 transition"
                          title="طباعة أوراق العمل الخاصة بهذا النشاط"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Educational Philosophy & Curriculum Notes */}
          <section className="bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-100/50 rounded-3xl p-6 sm:p-8 border border-amber-200 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg sm:text-xl font-black text-amber-950">
                منهجية التعليم المبكر في «عالم الصغار»
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl font-medium">
              صُممت جميع الأنشطة وفق المعايير العالمية لنمو الأطفال، مع مراعاة الفروق الفردية بين الفئات العمرية الأربع. لا توجد مؤقتات زمنية تسبب التوتر، وتعتمد المنصة على التعزيز الإيجابي التلقائي والأصوات المبهجة، مع الربط الكامل بين ما يتعلمه الطفل على الشاشة وما يمارسه ورقياً عبر أوراق العمل في البيت والروضة.
            </p>
          </section>
        </div>
      )}
    </div>
  );
};
