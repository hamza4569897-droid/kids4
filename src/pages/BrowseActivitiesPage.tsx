import React, { useState } from 'react';
import { Category, EducationalResource } from '../types/database';
import { ActivityCard } from '../components/common/ActivityCard';
import { Search, Filter, RotateCcw, Globe2, Sparkles } from 'lucide-react';
import { sounds } from '../lib/audio';
import { matchesAgeBracket, AGE_BRACKETS } from '../lib/storage';

interface BrowseActivitiesPageProps {
  categories: Category[];
  resources: EducationalResource[];
  favorites: string[];
  initialCategoryId?: string;
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: EducationalResource) => void;
}

export const BrowseActivitiesPage: React.FC<BrowseActivitiesPageProps> = ({
  categories,
  resources,
  favorites,
  initialCategoryId,
  onToggleFavorite,
  onSelectResource,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredResources = resources.filter((r) => {
    // Category filter (supports multiple categories per application)
    if (selectedCategory !== 'all') {
      const matchPrimary = r.category_id === selectedCategory;
      const matchAdditional = Boolean(r.additional_categories && r.additional_categories.includes(selectedCategory));
      if (!matchPrimary && !matchAdditional) {
        return false;
      }
    }
    // Age bracket filter using matchesAgeBracket (supports multi-bracket apps)
    if (selectedAge !== 'all' && !matchesAgeBracket(r, selectedAge)) {
      return false;
    }

    // Type filter
    if (selectedType !== 'all' && r.content_type !== selectedType) {
      return false;
    }

    // Language filter
    if (selectedLanguage !== 'all' && r.language !== selectedLanguage) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title_ar.toLowerCase().includes(q) || (r.title_en && r.title_en.toLowerCase().includes(q));
      const matchDesc = r.description_ar.toLowerCase().includes(q);
      const matchProv = r.provider_name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchProv) return false;
    }

    return true;
  });

  const resetFilters = () => {
    sounds.playPop();
    setSelectedCategory('all');
    setSelectedAge('all');
    setSelectedType('all');
    setSelectedLanguage('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="border-b border-amber-200/80 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-amber-950 mb-2">
          استكشاف جميع الأنشطة والألعاب 🎯
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          تصفح مكتبتنا التربوية المتنوعة المصممة خصيصاً لمراحل الطفولة المبكرة (2–6 سنوات). كل محتوى هنا مراجع لضمان الأمان والقيمة التعليمية.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، المهارة، أو الكلمات المفتاحية..."
            className="w-full px-5 py-3 pr-12 rounded-2xl bg-amber-50/40 border border-amber-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm font-medium"
          />
          <Search className="w-5 h-5 text-amber-700 absolute top-3.5 right-4 pointer-events-none" />
        </div>

        {/* Age Filter Segmented Buttons */}
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-2">الفئة العمرية المستهدفة:</span>
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedAge === age.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50/60 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Selector */}
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-2">المجال التعليمي:</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sounds.playPop();
                setSelectedCategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50/60 text-slate-700 hover:bg-amber-100'
              }`}
            >
              جميع المجالات
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sounds.playPop();
                  setSelectedCategory(c.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50/60 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {c.title_ar}
              </button>
            ))}
          </div>
        </div>

        {/* Type & Language Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 ml-1">النوع:</span>
              {[
                { id: 'all', label: 'الكل' },
                { id: 'game', label: 'لعبة تفاعلية' },
                { id: 'story', label: 'قصة مصورة' },
                { id: 'external_app', label: 'تطبيقات معتمدة' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedType(t.id);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedType === t.id
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 ml-1">اللغة:</span>
              {[
                { id: 'all', label: 'كل اللغات' },
                { id: 'ar', label: 'عربي' },
                { id: 'en', label: 'English' },
                { id: 'bilingual', label: 'ثنائي اللغة' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedLanguage(lang.id);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedLanguage === lang.id
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط الفلاتر</span>
          </button>
        </div>
      </div>

      {/* Results Header: Clean unboxed count */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>يتم عرض {filteredResources.length} من أصل {resources.length} نشاطاً تعليمياً</span>
      </div>

      {/* Grid or Empty State */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredResources.map((res) => (
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
        <div className="text-center py-16 bg-white rounded-3xl border border-amber-200/80 p-8">
          <span className="text-5xl block mb-3">🔍</span>
          <h3 className="text-xl font-bold text-slate-800 mb-1">لم نجد أنشطة مطابقة للبحث</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
            جرب تغيير الفئة العمرية أو مسح كلمات البحث لاستعراض المزيد من الألعاب والقصص.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs shadow-xs transition"
          >
            عرض جميع الأنشطة
          </button>
        </div>
      )}
    </div>
  );
};
