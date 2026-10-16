import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Languages,
  CheckCircle2,
  Award,
  ChevronLeft
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { AgeGroup } from '../../types/worksheet';
import { ENGLISH_VOCAB_BANK, EnglishVocabItem } from '../../data/activitiesHubData';

interface EnglishLanguageHubProps {
  onBack?: () => void;
  onOpenWorksheet?: () => void;
  initialAge?: AgeGroup;
}

type EnglishTab = 'letters_phonics' | 'case_match' | 'picture_words' | 'colors_numbers';

const ENGLISH_COLORS = [
  { name: 'Red', nameAr: 'أحمر', visual: '🔴', sample: '🍎 Strawberry / Apple' },
  { name: 'Blue', nameAr: 'أزرق', visual: '🔵', sample: '🌊 Ocean / Sky' },
  { name: 'Yellow', nameAr: 'أصفر', visual: '🟡', sample: '☀️ Sun / Banana' },
  { name: 'Green', nameAr: 'أخضر', visual: '🟢', sample: '🍃 Leaf / Tree' },
  { name: 'Orange', nameAr: 'برتقالي', visual: '🟠', sample: '🍊 Orange' },
  { name: 'Purple', nameAr: 'بنفسجي', visual: '🟣', sample: '🍇 Grapes' },
];

const ENGLISH_NUMBERS = [
  { num: 1, word: 'One', wordAr: 'واحد', dots: '⭐' },
  { num: 2, word: 'Two', wordAr: 'اثنان', dots: '⭐⭐' },
  { num: 3, word: 'Three', wordAr: 'ثلاثة', dots: '⭐⭐⭐' },
  { num: 4, word: 'Four', wordAr: 'أربعة', dots: '⭐⭐⭐⭐' },
  { num: 5, word: 'Five', wordAr: 'خمسة', dots: '⭐⭐⭐⭐⭐' },
];

export const EnglishLanguageHubActivity: React.FC<EnglishLanguageHubProps> = ({
  onBack,
  onOpenWorksheet,
  initialAge = '3-4',
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAge);
  const [activeTab, setActiveTab] = useState<EnglishTab>('letters_phonics');
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  // 1. Phonics & Letter State
  const [currentVocabIndex, setCurrentVocabIndex] = useState<number>(0);

  // 2. Case Matching State
  const [caseTarget, setCaseTarget] = useState<EnglishVocabItem>(ENGLISH_VOCAB_BANK[0]);
  const [caseChoices, setCaseChoices] = useState<string[]>([]);

  // 3. Picture Word Match State
  const [picTarget, setPicTarget] = useState<EnglishVocabItem>(ENGLISH_VOCAB_BANK[0]);
  const [picChoices, setPicChoices] = useState<EnglishVocabItem[]>([]);

  const initCaseRound = () => {
    const pool = [...ENGLISH_VOCAB_BANK].sort(() => 0.5 - Math.random());
    const target = pool[0];
    const choices = [target.lower, pool[1].lower, pool[2].lower].sort(() => 0.5 - Math.random());

    setCaseTarget(target);
    setCaseChoices(choices);
    setFeedback('');
    sounds.speakEnglish(`Find small letter ${target.lower} for capital ${target.letter}`);
  };

  const initPicRound = () => {
    const pool = [...ENGLISH_VOCAB_BANK].sort(() => 0.5 - Math.random());
    const roundChoices = pool.slice(0, 3);
    const target = roundChoices[Math.floor(Math.random() * roundChoices.length)];

    setPicTarget(target);
    setPicChoices(roundChoices);
    setFeedback('');
    sounds.speakEnglish(`Which one is ${target.word}?`);
  };

  useEffect(() => {
    if (activeTab === 'case_match') {
      initCaseRound();
    } else if (activeTab === 'picture_words') {
      initPicRound();
    }
  }, [activeTab, selectedAge]);

  const handleCaseSelect = (lower: string) => {
    sounds.playPop();
    if (lower === caseTarget.lower) {
      sounds.playChime();
      setFeedback(`Great job! Capital ${caseTarget.letter} matches small ${lower}! 🌟`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 30, spread: 60 });
      sounds.speakEnglish(`Correct! Letter ${caseTarget.letter}`);
      setTimeout(initCaseRound, 1500);
    } else {
      sounds.playTryAgain();
      setFeedback(`Try again! Look for small ${caseTarget.lower} 😊`);
      sounds.speakEnglish(`Try again! Letter ${caseTarget.letter}`);
    }
  };

  const handlePicSelect = (item: EnglishVocabItem) => {
    sounds.playPop();
    if (item.word === picTarget.word) {
      sounds.playCheer();
      setFeedback(`Awesome! That's ${item.word} ${item.visual}! 🌟👏`);
      setStars((prev) => prev + 1);
      confetti({ particleCount: 35, spread: 60 });
      sounds.speakEnglish(`Excellent! ${item.word}`);
      setTimeout(initPicRound, 1600);
    } else {
      sounds.playTryAgain();
      setFeedback(`Almost! Where is ${picTarget.word}?`);
      sounds.speakEnglish(`Where is ${picTarget.word}?`);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200/80 shadow-md space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 transition"
              title="رجوع إلى مركز الأنشطة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              English Phonics & Words 🇬🇧
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              عالم الحروف والكلمات الإنجليزية للأطفال
            </h2>
          </div>
        </div>

        {/* Stars Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-extrabold text-blue-900">{stars} Stars</span>
          </div>
          {onOpenWorksheet && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorksheet();
              }}
              className="text-xs font-bold text-blue-700 bg-blue-100/70 hover:bg-blue-200 px-3 py-1.5 rounded-xl transition"
            >
              📄 ورقة عمل إنجليزية
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'letters_phonics', label: 'الحروف والأصوات (Phonics)', icon: Languages },
            { id: 'case_match', label: 'مطابقة (Capital & Small)', icon: CheckCircle2 },
            { id: 'picture_words', label: 'مطابقة الكلمة بالصورة', icon: BookOpen },
            { id: 'colors_numbers', label: 'الألوان والأرقام بالإنجليزية', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab.id as EnglishTab);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-slate-700 hover:bg-blue-100'
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
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {age === '2-3' ? '2-3 سنوات' : age === '3-4' ? '3-4 سنوات' : age === '4-5' ? '4-5 سنوات' : '5-6 سنوات'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Phonics & Letter Cards */}
      {activeTab === 'letters_phonics' && (
        <div className="space-y-6 py-4">
          {(() => {
            const item = ENGLISH_VOCAB_BANK[currentVocabIndex % ENGLISH_VOCAB_BANK.length];
            return (
              <div className="max-w-md mx-auto text-center space-y-6 bg-gradient-to-b from-blue-50/70 to-white p-6 sm:p-8 rounded-3xl border border-blue-200">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>{item.phonicsNote}</span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <span className="text-6xl font-black text-blue-700">{item.letter}</span>
                  <span className="text-5xl font-black text-slate-500">{item.lower}</span>
                  <span className="text-7xl">{item.visual}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-slate-800">{item.word}</h3>
                  <p className="text-sm text-slate-500 font-medium">حرف {item.letter} - انقر للاستماع للنطق الصحيح</p>
                </div>

                <button
                  onClick={() => {
                    sounds.playPop();
                    sounds.speakEnglish(`${item.letter}, ${item.word}`);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition hover:scale-105 active:scale-95"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Listen & Repeat 🔊</span>
                </button>

                <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setCurrentVocabIndex((prev) => (prev > 0 ? prev - 1 : ENGLISH_VOCAB_BANK.length - 1));
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-blue-700 transition"
                  >
                    ← Previous Letter
                  </button>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setCurrentVocabIndex((prev) => prev + 1);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  >
                    <span>Next Letter</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: Match Uppercase with Lowercase */}
      {activeTab === 'case_match' && (
        <div className="space-y-6 text-center py-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl">
            <Volume2
              className="w-5 h-5 text-blue-600 cursor-pointer hover:scale-110 transition"
              onClick={() => sounds.speakEnglish(`Find small letter for capital ${caseTarget.letter}`)}
            />
            <span className="text-sm sm:text-base font-extrabold text-slate-800">
              Match Capital Letter <span className="text-blue-700 text-3xl font-black">[{caseTarget.letter}]</span> with its Small Letter:
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
            {caseChoices.map((lowerLetter) => (
              <button
                key={lowerLetter}
                onClick={() => handleCaseSelect(lowerLetter)}
                className="w-24 h-28 sm:w-28 sm:h-32 rounded-3xl bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-300 hover:border-blue-600 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer"
              >
                <span className="text-4xl sm:text-5xl font-black text-blue-900">{lowerLetter}</span>
                <span className="text-[11px] font-bold text-slate-500">small letter</span>
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-blue-800 animate-bounce">{feedback}</p>}

          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playPop();
                initCaseRound();
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Pair / بطاقة أخرى</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Picture & Word Association */}
      {activeTab === 'picture_words' && (
        <div className="space-y-6 text-center py-4">
          <div className="space-y-2">
            <span className="text-6xl">{picTarget.visual}</span>
            <h3 className="text-lg font-black text-slate-800">
              Which English word matches this picture?
            </h3>
            <button
              onClick={() => sounds.speakEnglish(picTarget.word)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to the word clue</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {picChoices.map((choice) => (
              <button
                key={choice.word}
                onClick={() => handlePicSelect(choice)}
                className="px-6 py-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 hover:border-blue-600 font-black text-xl text-blue-900 transition hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
              >
                {choice.word}
              </button>
            ))}
          </div>

          {feedback && <p className="text-base font-extrabold text-blue-800 animate-bounce">{feedback}</p>}
        </div>
      )}

      {/* TAB 4: English Colors & Numbers */}
      {activeTab === 'colors_numbers' && (
        <div className="space-y-8 py-4">
          {/* Colors */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <span>Colors in English (الألوان بالإنجليزية):</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {ENGLISH_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    sounds.playPop();
                    sounds.speakEnglish(c.name);
                  }}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 transition text-center space-y-1 hover:scale-102"
                >
                  <span className="text-3xl block">{c.visual}</span>
                  <span className="font-extrabold text-sm text-slate-900 block">{c.name}</span>
                  <span className="text-xs text-slate-500 block">{c.nameAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Numbers */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <span>Numbers in English (الأرقام بالإنجليزية):</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {ENGLISH_NUMBERS.map((n) => (
                <button
                  key={n.num}
                  onClick={() => {
                    sounds.playPop();
                    sounds.speakEnglish(`${n.word}, ${n.num}`);
                  }}
                  className="p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200 transition text-center space-y-1 hover:scale-102"
                >
                  <span className="text-3xl font-black text-amber-900 block">{n.num}</span>
                  <span className="font-black text-sm text-slate-800 block">{n.word}</span>
                  <span className="text-xs text-amber-600 block">{n.dots}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
