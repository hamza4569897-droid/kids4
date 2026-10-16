import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Award,
  Heart
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { AgeGroup } from '../../types/worksheet';
import { ILLUSTRATED_STORIES_BANK, IllustratedStory } from '../../data/activitiesHubData';

interface InteractiveStoryHubProps {
  onBack?: () => void;
  onOpenWorksheet?: () => void;
  initialAge?: AgeGroup;
}

export const InteractiveStoryHubActivity: React.FC<InteractiveStoryHubProps> = ({
  onBack,
  onOpenWorksheet,
}) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [stars, setStars] = useState(0);

  const story: IllustratedStory = ILLUSTRATED_STORIES_BANK[selectedStoryIndex % ILLUSTRATED_STORIES_BANK.length];
  const page = story.pages[currentPageIndex];

  const handleSelectStory = (idx: number) => {
    sounds.playPop();
    setSelectedStoryIndex(idx);
    setCurrentPageIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  };

  const handleReadPage = () => {
    sounds.playPop();
    sounds.speakArabic(`${page.title}. ${page.paragraphAr}`);
  };

  const handleSelectOption = (index: number) => {
    sounds.playPop();
    setSelectedAnswer(index);
    if (index === page.correctIndex) {
      sounds.playCheer();
      setIsAnswerCorrect(true);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 30, spread: 60 });
    } else {
      sounds.playTryAgain();
      setIsAnswerCorrect(false);
    }
  };

  const handleNextPage = () => {
    sounds.playPop();
    if (currentPageIndex < story.pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    }
  };

  const handlePrevPage = () => {
    sounds.playPop();
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition"
              title="رجوع إلى مركز الأنشطة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              مكتبة القصص المصورة التفاعلية 📖✨
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              حكايات دافئة وقيم تربوية وأسئلة فهم
            </h2>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-extrabold text-amber-900">{stars} وسام قراءة</span>
          </div>
          {onOpenWorksheet && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorksheet();
              }}
              className="text-xs font-bold text-amber-700 bg-amber-100/70 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition"
            >
              📄 ورقة فهم القصة
            </button>
          )}
        </div>
      </div>

      {/* Story Selector Shelf */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {ILLUSTRATED_STORIES_BANK.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => handleSelectStory(idx)}
            className={`p-3 rounded-2xl border text-right transition shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedStoryIndex === idx
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50/50 hover:bg-amber-100 text-slate-700 border-amber-200'
            }`}
          >
            <span className="text-2xl">{s.coverVisual}</span>
            <div>
              <p className="text-xs font-bold line-clamp-1">{s.title}</p>
              <span className={`text-[10px] ${selectedStoryIndex === idx ? 'text-amber-100' : 'text-slate-500'}`}>
                {s.theme}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Story Book Layout */}
      <div className="max-w-3xl mx-auto bg-gradient-to-b from-amber-50/50 to-white rounded-3xl p-6 sm:p-8 border border-amber-200 space-y-6 shadow-sm">
        {/* Page Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100 text-xs font-bold text-slate-500">
          <span>{story.title}</span>
          <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
            صفحة {page.pageNumber} من {story.pages.length}
          </span>
        </div>

        {/* Visual & Text */}
        <div className="space-y-4 text-center">
          <span className="text-7xl block">{page.imageVisual}</span>
          <h3 className="text-2xl font-black text-amber-950">{page.title}</h3>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium max-w-xl mx-auto">
            {page.paragraphAr}
          </p>

          <button
            onClick={handleReadPage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition shadow-xs cursor-pointer hover:scale-105 active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>استمع لقراءة الصفحة 🔊</span>
          </button>
        </div>

        {/* Comprehension Question */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 space-y-3">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">
              ؟
            </span>
            <span>سؤال الفهم الذكي: {page.question}</span>
          </h4>

          <div className="space-y-2">
            {page.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(i)}
                className={`w-full p-3.5 rounded-xl border text-right text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedAnswer === i
                    ? i === page.correctIndex
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                      : 'bg-rose-50 border-rose-400 text-rose-950'
                    : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>{opt}</span>
                {selectedAnswer === i && (
                  <span>{i === page.correctIndex ? '✅ إجابة صحيحة' : '❌ حاول ثانية'}</span>
                )}
              </button>
            ))}
          </div>

          {/* Lesson box */}
          {selectedAnswer === page.correctIndex && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>الحكمة التربوية: {page.lifeLesson}</span>
            </div>
          )}
        </div>

        {/* Page Turns */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              currentPageIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-white hover:bg-amber-50 border border-amber-200 text-slate-700 cursor-pointer shadow-xs'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>الصفحة السابقة</span>
          </button>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === story.pages.length - 1}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              currentPageIndex === story.pages.length - 1
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-xs'
            }`}
          >
            <span>الصفحة التالية</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
