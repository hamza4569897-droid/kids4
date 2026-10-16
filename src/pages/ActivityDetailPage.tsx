import React, { useState } from 'react';
import { EducationalResource } from '../types/database';
import { INITIAL_CATEGORIES } from '../data/seedData';
import { Heart, Play, ArrowRight, ShieldCheck, Clock, Award, ExternalLink, CheckCircle } from 'lucide-react';
import { sounds } from '../lib/audio';
import { sanitizeLaunchUrl } from '../lib/storage';
import { ColorRecognitionGame } from '../components/activities/ColorRecognitionGame';
import { ShapeMatchingGame } from '../components/activities/ShapeMatchingGame';
import { LetterRecognitionGame } from '../components/activities/LetterRecognitionGame';
import { NumberCountingGame } from '../components/activities/NumberCountingGame';
import { MemoryGame } from '../components/activities/MemoryGame';
import { ColoringCanvas } from '../components/activities/ColoringCanvas';
import { InteractiveStoryReader } from '../components/activities/InteractiveStoryReader';
import { SortingGame } from '../components/activities/SortingGame';
import { LetterTracingGame } from '../components/activities/LetterTracingGame';
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
import { ParentGateModal } from '../components/common/ParentGateModal';
import { ContentReviewsSection } from '../components/common/ContentReviewsSection';

interface ActivityDetailPageProps {
  resource: EducationalResource;
  isFavorite: boolean;
  allResources: EducationalResource[];
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onSelectResource: (resource: EducationalResource) => void;
}

export const ActivityDetailPage: React.FC<ActivityDetailPageProps> = ({
  resource,
  isFavorite,
  allResources,
  onToggleFavorite,
  onBack,
  onSelectResource,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isParentGateOpen, setIsParentGateOpen] = useState<boolean>(false);
  const [authorizedExternalUrl, setAuthorizedExternalUrl] = useState<string | null>(null);

  const isExternal = resource.launch_type === 'external_tab';

  const handleLaunchClick = () => {
    sounds.playPop();
    if (isExternal) {
      // Require parent gate before leaving the site
      setIsParentGateOpen(true);
    } else {
      setIsPlaying(true);
    }
  };

  const handleParentGateSuccess = () => {
    setIsParentGateOpen(false);
    if (resource.launch_url) {
      const sanitized = sanitizeLaunchUrl(resource.launch_url);
      if (sanitized.safe && sanitized.url) {
        setAuthorizedExternalUrl(sanitized.url);
      }
    }
  };

  // If in play mode and it's a built-in game, render the game component directly!
  if (isPlaying) {
    const handleCloseGame = () => {
      sounds.playPop();
      setIsPlaying(false);
    };

    switch (resource.id) {
      case 'act-color-explorer':
        return <ColorRecognitionGame onBack={handleCloseGame} />;
      case 'act-shape-matcher':
        return <ShapeMatchingGame onBack={handleCloseGame} />;
      case 'act-arabic-letters-fun':
        return <LetterRecognitionGame onBack={handleCloseGame} />;
      case 'act-number-counting':
        return <NumberCountingGame onBack={handleCloseGame} />;
      case 'act-memory-cards':
      case 'act-animal-friends':
        return <MemoryGame onBack={handleCloseGame} />;
      case 'act-coloring-studio':
        return <ColoringCanvas onBack={handleCloseGame} />;
      case 'act-interactive-story':
      case 'act-islamic-manners':
        return <InteractiveStoryReader onBack={handleCloseGame} />;
      case 'act-sorting-game':
      case 'act-jigsaw-puzzle':
        return <SortingGame onBack={handleCloseGame} />;
      case 'act-tracing-practice':
        return <LetterTracingGame onBack={handleCloseGame} />;
      case 'act-songs-music':
      case 'act-nursery-rhymes':
        return <EducationalSongsStation onBack={handleCloseGame} />;
      case 'act-english-alphabet':
      case 'act-english-words':
        return <EnglishLanguageHubActivity onBack={handleCloseGame} />;
      default:
        if (resource.category_id === 'cat-songs-music') {
          return <EducationalSongsStation onBack={handleCloseGame} />;
        }
        if (resource.category_id === 'cat-english-alphabet' || resource.category_id === 'cat-language-learning') {
          return <EnglishLanguageHubActivity onBack={handleCloseGame} />;
        }
        if (resource.category_id === 'cat-arabic-alphabet') {
          return <ArabicLanguageHubActivity onBack={handleCloseGame} />;
        }
        if (resource.category_id === 'cat-numbers-math') {
          return <MathNumbersHubActivity onBack={handleCloseGame} />;
        }
        if (resource.category_id === 'cat-colors-shapes') {
          return <ColorsShapesHubActivity onBack={handleCloseGame} />;
        }
        if (resource.category_id === 'cat-animals-nature' || resource.category_id === 'cat-science-discovery') {
          return <AnimalsNatureHubActivity onBack={handleCloseGame} />;
        }
        if (resource.category_id === 'cat-problem-solving' || resource.category_id === 'cat-memory-focus') {
          return <LogicMemoryHubActivity onBack={handleCloseGame} />;
        }
        if (resource.category_id === 'cat-life-skills' || resource.category_id === 'cat-emotions-social') {
          return <LifeSkillsValuesHubActivity onBack={handleCloseGame} />;
        }
        if (resource.category_id === 'cat-stories-audio') {
          return <InteractiveStoryHubActivity onBack={handleCloseGame} />;
        }
        return <MemoryGame onBack={handleCloseGame} />;
    }
  }

  // Related activities from the same category or age group
  const related = allResources
    .filter((r) => r.id !== resource.id && (r.category_id === resource.category_id || r.age_min === resource.age_min))
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-amber-800 transition py-1"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للأنشطة</span>
        </button>
      </div>

      {/* Main Detail Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Cover Image */}
        <div className="md:col-span-5 rounded-3xl overflow-hidden aspect-4/3 bg-amber-50 shadow-inner relative">
          {resource.thumbnail_url ? (
            <img
              src={resource.thumbnail_url}
              alt={resource.title_ar}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/src/assets/images/hero_preschool_stars_1791871144333.jpg';
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">⭐</div>
          )}

          <button
            onClick={() => {
              sounds.playPop();
              onToggleFavorite(resource.id);
            }}
            className={`absolute top-4 left-4 p-3 rounded-2xl backdrop-blur-md transition ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Info & Launch */}
        <div className="md:col-span-7 space-y-5">
          {/* Metadata typography */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
            <span>عمر {resource.age_min}–{resource.age_max} سنوات</span>
            <span aria-hidden="true">·</span>
            <span>المدة المقدرة: {resource.estimated_duration_minutes} دقائق</span>
            <span aria-hidden="true">·</span>
            <span>{resource.provider_name}</span>
          </div>

          {/* Categories and Age Group Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Primary Category */}
            {(() => {
              const cat = INITIAL_CATEGORIES.find((c) => c.id === resource.category_id);
              return cat ? (
                <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200">
                  {cat.title_ar}
                </span>
              ) : null;
            })()}

            {/* Additional Categories */}
            {resource.additional_categories?.map((catId) => {
              const cat = INITIAL_CATEGORIES.find((c) => c.id === catId);
              return cat ? (
                <span
                  key={catId}
                  className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium text-xs border border-slate-200"
                >
                  {cat.title_ar}
                </span>
              ) : null;
            })}

            {/* Age Brackets breakdown */}
            {[
              { min: 2, max: 2, label: 'من سنتين إلى أقل من 3 سنوات' },
              { min: 3, max: 3, label: 'من 3 سنوات إلى أقل من 4 سنوات' },
              { min: 4, max: 4, label: 'من 4 سنوات إلى أقل من 5 سنوات' },
              { min: 5, max: 6, label: 'من 5 سنوات إلى 6 سنوات' },
            ]
              .filter((b) => resource.age_min <= b.max && resource.age_max >= b.min)
              .map((b, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-800 text-[11px] font-semibold border border-orange-200/60"
                >
                  {b.label}
                </span>
              ))}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-amber-950 leading-tight">
            {resource.title_ar}
          </h1>

          <p className="text-base text-slate-700 leading-relaxed">
            {resource.description_ar}
          </p>

          {/* Safety & Compliance Badge */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>محتوى تم فحصه تربوياً وأمنياً: مجاني، خالي من الإعلانات التجارية والمشتريات.</span>
          </div>

          {/* Primary Action Button */}
          <div className="pt-3">
            <button
              onClick={handleLaunchClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              {isExternal ? (
                <>
                  <ExternalLink className="w-6 h-6" />
                  <span>فتح في موقع الشريك المعتمد</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  <span>ابدأ اللعب الآن!</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Objectives & Accessibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Learning Objectives */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">الأهداف التعليمية والنمائية</h3>
          </div>

          <ul className="space-y-3 pt-2">
            {resource.learning_objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Accessibility Notes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">ملاحظات الوصول وسهولة الاستخدام</h3>
          </div>

          <ul className="space-y-3 pt-2">
            {resource.accessibility_notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span>{note}</span>
              </li>
            ))}
            <li className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
              <span>لا يتطلب حساب مستخدم خاص بالطفل ويحترم تفضيلات تقليل الحركة.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Related Activities */}
      {related.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-2xl font-black text-amber-950">أنشطة مشابهة قد تعجبك</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((res) => (
              <div
                key={res.id}
                onClick={() => onSelectResource(res)}
                className="bg-white rounded-3xl p-4 border border-amber-200/70 hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-4/3 rounded-2xl overflow-hidden bg-amber-50 mb-3">
                    <img
                      src={res.thumbnail_url}
                      alt={res.title_ar}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{res.title_ar}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{res.description_ar}</p>
                </div>
                <span className="text-xs font-bold text-amber-700 mt-3 block">عرض التفاصيل ←</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Child-Safe Reviews & Ratings Section for the Activity */}
      <ContentReviewsSection
        contentId={resource.id}
        contentType="activity"
        contentTitle={resource.title_ar}
      />

      {/* Direct external destination modal after passing parent gate */}
      {authorizedExternalUrl && (
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
                أنت الآن على وشك الانتقال إلى المحتوى المعتمد لدى <strong>{resource.provider_name}</strong> في علامة تبويب جديدة.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={authorizedExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setAuthorizedExternalUrl(null)}
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-sm transition shadow-sm inline-flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>متابعة الانتقال الآن</span>
              </a>
              <button
                onClick={() => setAuthorizedExternalUrl(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parent Gate Modal for External Exits */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={handleParentGateSuccess}
        destinationTitle={resource.provider_name}
        isExternalLink={true}
      />
    </div>
  );
};
