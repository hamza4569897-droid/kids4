import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sparkles,
  ArrowRight,
  Music,
  Heart,
  BookOpen,
  Award,
  Mic
} from 'lucide-react';
import { sounds } from '../../lib/audio';
import { AgeGroup } from '../../types/worksheet';
import { EDUCATIONAL_SONGS_BANK, EducationalSong } from '../../data/activitiesHubData';

interface EducationalSongsStationProps {
  onBack?: () => void;
  onOpenWorksheet?: () => void;
  initialAge?: AgeGroup;
}

export const EducationalSongsStation: React.FC<EducationalSongsStationProps> = ({
  onBack,
  onOpenWorksheet,
}) => {
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [stars, setStars] = useState(0);

  const song = EDUCATIONAL_SONGS_BANK[activeSongIndex % EDUCATIONAL_SONGS_BANK.length];
  const timerRef = useRef<any>(null);

  // Play synthetic melody notes
  const playMelody = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      song.melodyNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.35);

        gain.gain.setValueAtTime(0.18, now + idx * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.35 + 0.32);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.35);
        osc.stop(now + idx * 0.35 + 0.35);
      });
    } catch {
      // AudioCtx fallback
    }
  };

  const handleTogglePlay = () => {
    sounds.playPop();
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      playMelody();
      // Speak first verse
      sounds.speakArabic(song.verses[0]);

      // Cycle verses every 4 seconds
      let step = 0;
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        step = (step + 1) % song.verses.length;
        setCurrentVerseIndex(step);
        sounds.speakArabic(song.verses[step]);
        playMelody();

        if (step === song.verses.length - 1) {
          setStars((prev) => prev + 1);
          confetti({ particleCount: 25, spread: 50 });
        }
      }, 4200);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleNextSong = () => {
    sounds.playPop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setCurrentVerseIndex(0);
    setActiveSongIndex((prev) => (prev + 1) % EDUCATIONAL_SONGS_BANK.length);
  };

  const handlePrevSong = () => {
    sounds.playPop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setCurrentVerseIndex(0);
    setActiveSongIndex((prev) => (prev > 0 ? prev - 1 : EDUCATIONAL_SONGS_BANK.length - 1));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-violet-200/80 shadow-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-violet-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                if (timerRef.current) clearInterval(timerRef.current);
                onBack();
              }}
              className="p-2.5 rounded-2xl bg-violet-50 hover:bg-violet-100 text-violet-800 transition"
              title="رجوع إلى مركز الأنشطة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-violet-700 bg-violet-100 px-3 py-1 rounded-full">
              محطة الأناشيد والأغاني الهادفة 🎶📻
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              أناشيد تربوية مبهجة خالية من الإعلانات
            </h2>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 px-3.5 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-extrabold text-violet-900">{stars} وسام غناء</span>
          </div>
          {onOpenWorksheet && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorksheet();
              }}
              className="text-xs font-bold text-violet-700 bg-violet-100/70 hover:bg-violet-200 px-3 py-1.5 rounded-xl transition"
            >
              📄 ورقة نشيد وتلوين
            </button>
          )}
        </div>
      </div>

      {/* Main Player Display */}
      <div className="max-w-2xl mx-auto space-y-6 bg-gradient-to-b from-violet-50 via-fuchsia-50/40 to-white p-6 sm:p-8 rounded-3xl border border-violet-200 shadow-sm text-center">
        {/* Animated Mascot / Badge */}
        <div className="space-y-2">
          <span className={`text-6xl inline-block transition-transform duration-500 ${isPlaying ? 'scale-115 animate-bounce' : ''}`}>
            {song.emoji}
          </span>
          <h3 className="text-2xl font-black text-slate-900">{song.title}</h3>
          <p className="text-xs font-bold text-violet-700 bg-violet-100/80 px-3 py-1 rounded-full inline-block">
            {song.theme}
          </p>
        </div>

        {/* Highlighted Lyrics Box */}
        <div className="p-6 rounded-3xl bg-white border border-violet-200 shadow-xs space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
            <Mic className="w-4 h-4 text-violet-500" />
            <span>كلمات النشيد للغناء والمتابعة الوالدية</span>
          </div>

          <div className="space-y-2.5">
            {song.verses.map((verse, idx) => (
              <p
                key={idx}
                className={`text-base sm:text-lg font-black transition-all duration-300 py-1 rounded-xl ${
                  currentVerseIndex === idx && isPlaying
                    ? 'text-violet-700 bg-violet-50 scale-102 font-extrabold shadow-2xs'
                    : 'text-slate-700 opacity-80'
                }`}
              >
                {verse}
              </p>
            ))}
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            onClick={handlePrevSong}
            className="p-3 rounded-2xl bg-white hover:bg-violet-50 border border-violet-200 text-slate-700 transition hover:scale-105 active:scale-95 shadow-xs"
            title="الأنشودة السابقة"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="p-5 rounded-3xl bg-violet-600 hover:bg-violet-700 text-white transition hover:scale-110 active:scale-95 shadow-md flex items-center justify-center"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الأنشودة'}
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-white" />}
          </button>

          <button
            onClick={handleNextSong}
            className="p-3 rounded-2xl bg-white hover:bg-violet-50 border border-violet-200 text-slate-700 transition hover:scale-105 active:scale-95 shadow-xs"
            title="الأنشودة التالية"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Parent Guidance Note */}
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-right space-y-1">
          <span className="text-xs font-bold text-amber-900 block">💡 إرشاد لولي الأمر والمعلمة:</span>
          <p className="text-xs text-amber-800 leading-relaxed">{song.parentNote}</p>
        </div>
      </div>
    </div>
  );
};
