import React, { useState } from 'react';
import { sounds } from '../../lib/audio';
import { Volume2, ChevronRight, ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';

interface StoryPage {
  pageNumber: number;
  titleAr: string;
  textAr: string;
  illustrationEmoji: string;
  interactiveObjects: { name: string; sound: () => void; emoji: string }[];
}

const STORY_PAGES: StoryPage[] = [
  {
    pageNumber: 1,
    titleAr: 'صباح مشرق في الحديقة',
    textAr: 'استيقظ الأرنب الصغير «سمسم» في صباح يوم مشمس وجميل، وخرج يقفز بين الأزهار وهو يبحث عن طعام لذيذ.',
    illustrationEmoji: '🐰 🌸 ☀️',
    interactiveObjects: [
      {
        name: 'الأرنب سمسم',
        sound: () => {
          sounds.playPop();
          sounds.speakArabic('مرحباً! أنا الأرنب سمسم أحب الجزر والأزهار!');
        },
        emoji: '🐰',
      },
      {
        name: 'الشمس المشرقة',
        sound: () => {
          sounds.playChime();
          sounds.speakArabic('صباح الخير والنور يا أصدقائي!');
        },
        emoji: '☀️',
      },
      {
        name: 'الأزهار',
        sound: () => {
          sounds.playPop();
          sounds.speakArabic('زهور الربيع تفوح عطراً جميلاً');
        },
        emoji: '🌸',
      },
    ],
  },
  {
    pageNumber: 2,
    titleAr: 'المفاجأة الكبيرة في الحقل',
    textAr: 'وفجأة، رأى سمسم جزرة كبيرة وذهبية لامعة مدفونة في التربة الخصبة. حاول سحبها بمفرده، لكنها كانت ثقيلة جداً!',
    illustrationEmoji: '🥕 🌱 💨',
    interactiveObjects: [
      {
        name: 'الجزرة الذهبية',
        sound: () => {
          sounds.playChime();
          sounds.speakArabic('أنا جزرة ذهبية مليئة بالفيتامينات المقوية!');
        },
        emoji: '🥕',
      },
      {
        name: 'التربة الخصبة',
        sound: () => {
          sounds.playPop();
          sounds.speakArabic('الأرض الطيبة تعطينا ألذ الثمار');
        },
        emoji: '🌱',
      },
    ],
  },
  {
    pageNumber: 3,
    titleAr: 'قوة التعاون والمحبة',
    textAr: 'نادى سمسم صديقه العصفور «شادي» والسلحفاة «سوسو». شدوا الجزرة جميعاً معاً: هوب.. هوب.. فخرجت الجزرة وسط فرحتهم جميعاً!',
    illustrationEmoji: '🐦 🐢 🥕',
    interactiveObjects: [
      {
        name: 'العصفور شادي',
        sound: () => {
          sounds.playChime();
          sounds.speakArabic('تغريد العصفور: التعاون يجعل المستحيل سهلاً!');
        },
        emoji: '🐦',
      },
      {
        name: 'السلحفاة سوسو',
        sound: () => {
          sounds.playPop();
          sounds.speakArabic('معاً نستطيع إنجاز كل شيء بحكمة وصبر');
        },
        emoji: '🐢',
      },
    ],
  },
  {
    pageNumber: 4,
    titleAr: 'وليمة الأصدقاء السعيدة',
    textAr: 'جلس الأصدقاء واقتسموا الجزرة اللذيذة معاً، وشكروا الله تعالى على نعمة الطعام والأصدقاء الأوفياء. وتوتة توتة خلصت الحتوتة!',
    illustrationEmoji: '🎉 🍉 🥕',
    interactiveObjects: [
      {
        name: 'شكر النعمة',
        sound: () => {
          sounds.playCheer();
          sounds.speakArabic('الحمد لله الذي أطعمنا وسقانا وجعلنا متعاونين متحابين');
        },
        emoji: '💖',
      },
    ],
  },
];

export const InteractiveStoryReader: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const page = STORY_PAGES[currentPage];

  const handleReadAloud = () => {
    sounds.playPop();
    sounds.speakArabic(`${page.titleAr}. ${page.textAr}`);
  };

  const nextPage = () => {
    if (currentPage < STORY_PAGES.length - 1) {
      sounds.playPop();
      setCurrentPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      sounds.playPop();
      setCurrentPage((p) => p - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-500 hover:bg-amber-50 hover:text-amber-700 transition"
              title="رجوع"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900">حكاية الأرنب والجزرة الذهبية 📖</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              صفحة {currentPage + 1} من {STORY_PAGES.length}
            </p>
          </div>
        </div>

        <button
          onClick={handleReadAloud}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-2xl shadow-xs transition"
          title="قراءة الصفحة بصوت عالي"
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-xs sm:text-sm">اقرأ لي</span>
        </button>
      </div>

      {/* Story Stage */}
      <div className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 rounded-3xl p-6 sm:p-8 border border-amber-200/70 mb-6 text-center">
        {/* Visual Scene Banner */}
        <div className="h-44 sm:h-52 rounded-2xl bg-white shadow-xs border border-amber-100 flex items-center justify-center text-6xl sm:text-7xl mb-6 tracking-widest select-none">
          {page.illustrationEmoji}
        </div>

        {/* Page Title */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950 mb-3">{page.titleAr}</h3>

        {/* Story Text */}
        <p className="text-lg sm:text-2xl font-semibold text-slate-800 leading-relaxed max-w-xl mx-auto mb-6">
          {page.textAr}
        </p>

        {/* Interactive Touch Elements */}
        <div className="pt-4 border-t border-amber-200/60">
          <p className="text-xs font-bold text-amber-800 mb-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>المس الشخصيات في الصفحة لتسمع أصواتها:</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {page.interactiveObjects.map((obj, i) => (
              <button
                key={i}
                onClick={obj.sound}
                className="bg-white hover:bg-amber-100/70 border border-amber-300 rounded-full px-4 py-2 text-sm font-bold text-slate-800 flex items-center gap-2 shadow-xs transition transform hover:scale-105 active:scale-95"
              >
                <span className="text-xl">{obj.emoji}</span>
                <span>{obj.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="inline-flex items-center gap-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm disabled:opacity-40 hover:bg-slate-50 transition"
        >
          <ChevronRight className="w-5 h-5" />
          <span>الصفحة السابقة</span>
        </button>

        <div className="flex gap-1.5">
          {STORY_PAGES.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                currentPage === i ? 'bg-amber-500 w-6' : 'bg-amber-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === STORY_PAGES.length - 1}
          className="inline-flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm disabled:opacity-40 transition shadow-xs"
        >
          <span>الصفحة التالية</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
