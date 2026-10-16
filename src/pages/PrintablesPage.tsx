import React, { useState, useMemo } from 'react';
import {
  Printer,
  Search,
  Award,
  Layers,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ALL_WORKSHEETS, WORKSHEET_CATALOG_REPORT, filterWorksheets } from '../data/worksheets';
import { Worksheet, AgeGroup, WorksheetActivityType } from '../types/worksheet';
import { WorksheetCard } from '../components/worksheets/WorksheetCard';
import { WorksheetRenderer } from '../components/worksheets/WorksheetRenderer';
import { WorksheetUniquenessReport } from '../components/worksheets/WorksheetUniquenessReport';
import { ChildrenAssessmentsHub } from '../components/worksheets/ChildrenAssessmentsHub';
import { ContentReviewsSection } from '../components/common/ContentReviewsSection';
import { sounds } from '../lib/audio';

export const PrintablesPage: React.FC = () => {
  // Navigation tabs: 'all' | 'assessments' | 'report'
  const [activeTab, setActiveTab] = useState<'all' | 'assessments' | 'report'>('all');

  // Filter state
  const [selectedAge, setSelectedAge] = useState<AgeGroup | 'all'>('all');
  const [selectedActivity, setSelectedActivity] = useState<WorksheetActivityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected worksheet for viewing/interactive solve/print
  const [activeWorksheet, setActiveWorksheet] = useState<Worksheet | null>(null);
  const [activeWorksheetMode, setActiveWorksheetMode] = useState<'preview' | 'interactive'>('preview');

  // Filtered worksheets
  const displayedWorksheets = useMemo(() => {
    return filterWorksheets({
      ageGroup: selectedAge,
      activityType: selectedActivity,
      searchQuery,
      onlyAssessments: activeTab === 'assessments'
    });
  }, [selectedAge, selectedActivity, searchQuery, activeTab]);

  const handleSelectWorksheet = (ws: Worksheet, mode: 'preview' | 'interactive') => {
    setActiveWorksheet(ws);
    setActiveWorksheetMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintDirect = (ws: Worksheet) => {
    setActiveWorksheet(ws);
    setActiveWorksheetMode('preview');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleResetFilters = () => {
    sounds.playPop();
    setSelectedAge('all');
    setSelectedActivity('all');
    setSearchQuery('');
  };

  // If a worksheet is open in full view
  if (activeWorksheet) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <WorksheetRenderer
          worksheet={activeWorksheet}
          mode={activeWorksheetMode}
          onClose={() => setActiveWorksheet(null)}
          onPrint={() => window.print()}
        />

        {/* Child-Safe Reviews & Ratings Section for this Worksheet */}
        <ContentReviewsSection
          contentId={activeWorksheet.id}
          contentType="worksheet"
          contentTitle={activeWorksheet.title}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="bg-linear-to-b from-amber-100/50 via-white to-transparent rounded-3xl border border-amber-200/80 p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>مكتبة المناهج التربوية (١٢٠ ورقة عمل واختبارات تشخيصية)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight">
            أوراق العمل والاختبارات التعليمية للأطفال 🖨️
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            مكتبة متكاملة مقسمة علمياً لأربع فئات عمرية (من سنتين إلى ٦ سنوات)، تشمل ٢٠ نوعاً من الأنشطة المتنوعة وقوالب التصميم غير المكررة، مع إمكانية الحل التفاعلي والطباعة المباشرة على مقاس A4.
          </p>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-amber-200/60 flex flex-wrap gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('all');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>جميع أوراق العمل</span>
            <span className="opacity-80 text-xs">({ALL_WORKSHEETS.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('assessments');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'assessments'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500 group-hover:text-amber-700" />
            <span>اختبارات الأطفال التقييمية</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-xs">
              {ALL_WORKSHEETS.filter((w) => w.isAssessment).length}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('report');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'report'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>نظام منع التكرار والأصالة</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Worksheets Browser */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالعنوان، المهارة، أو الكلمة المفتاحية..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Activity Type Dropdown */}
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 hidden md:inline">نوع النشاط:</span>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value as WorksheetActivityType | 'all')}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">جميع الأنشطة (٢٠ نوعاً)</option>
                  <option value="matching">التوصيل</option>
                  <option value="pair_matching">المطابقة والظلال</option>
                  <option value="categorization">التصنيف والفرز</option>
                  <option value="odd_one_out">اكتشف المختلف</option>
                  <option value="complete_pattern">أكمل النمط</option>
                  <option value="counting_quantities">العد والكميات</option>
                  <option value="arabic_letters">الحروف العربية</option>
                  <option value="english_letters">الحروف الإنجليزية</option>
                  <option value="mazes">المتاهات</option>
                  <option value="directed_coloring">التلوين الموجه</option>
                  <option value="line_tracing">تتبع الخطوط</option>
                  <option value="visual_puzzles">الألغاز البصرية</option>
                  <option value="event_sequencing">ترتيب الأحداث</option>
                  <option value="science_nature">العلوم والطبيعة</option>
                  <option value="life_skills">المهارات الحياتية</option>
                  <option value="emotions">المشاعر</option>
                  <option value="picture_stories">القصص المصورة</option>
                  <option value="school_readiness">الاستعداد للمدرسة</option>
                  <option value="logical_thinking">التفكير المنطقي</option>
                  <option value="comprehensive_assessment">اختبارات شاملة</option>
                </select>

                {(selectedAge !== 'all' || selectedActivity !== 'all' || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition text-xs font-bold"
                    title="إعادة تعيين التصفية"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Age Segmented Controls (Four Precise Age Brackets) */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
              <span className="text-slate-500 text-xs shrink-0 ml-2">الفئة العمرية:</span>

              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge('all');
                }}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  selectedAge === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                جميع الأعمار ({ALL_WORKSHEETS.length})
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge('2-3');
                }}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  selectedAge === '2-3'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                سنتين إلى &lt; ٣ سنوات (٣٠ ورقة)
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge('3-4');
                }}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  selectedAge === '3-4'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                ٣ سنوات إلى &lt; ٤ سنوات (٣٠ ورقة)
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge('4-5');
                }}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  selectedAge === '4-5'
                    ? 'bg-sky-600 text-white'
                    : 'bg-sky-50 text-sky-900 hover:bg-sky-100 border border-sky-200'
                }`}
              >
                ٤ سنوات إلى &lt; ٥ سنوات (٣٠ ورقة)
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge('5-6');
                }}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  selectedAge === '5-6'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                ٥ سنوات إلى ٦ سنوات (٣٠ ورقة)
              </button>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              عرض <strong className="text-slate-800">{displayedWorksheets.length}</strong> ورقة عمل تعليمية
            </span>
            <span className="font-mono text-[11px]">جاهزة للطباعة والحل التفاعلي</span>
          </div>

          {/* Worksheets Grid */}
          {displayedWorksheets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedWorksheets.map((worksheet) => (
                <WorksheetCard
                  key={worksheet.id}
                  worksheet={worksheet}
                  onSelect={handleSelectWorksheet}
                  onPrintDirect={handlePrintDirect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
              <div className="text-5xl">🔍</div>
              <h3 className="text-lg font-bold text-slate-800">لم يتم العثور على أوراق تطابق خيارات البحث</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                جرب تغيير خيارات التصفية أو الفئة العمرية للوصول إلى أوراق العمل المناسبة.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-5 rounded-xl text-xs transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة ضبط البحث</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Children Assessments Hub with Multi-Activity Builder and Separate Correction Guide */}
      {activeTab === 'assessments' && <ChildrenAssessmentsHub />}

      {/* Tab 3: Deduplication and Quality System Report */}
      {activeTab === 'report' && (
        <WorksheetUniquenessReport report={WORKSHEET_CATALOG_REPORT} />
      )}
    </div>
  );
};
