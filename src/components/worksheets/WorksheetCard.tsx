import React from 'react';
import { Printer, Play, Sparkles, Award } from 'lucide-react';
import { Worksheet } from '../../types/worksheet';
import { sounds } from '../../lib/audio';

interface WorksheetCardProps {
  worksheet: Worksheet;
  onSelect: (worksheet: Worksheet, mode: 'preview' | 'interactive') => void;
  onPrintDirect: (worksheet: Worksheet) => void;
}

export const WorksheetCard: React.FC<WorksheetCardProps> = ({
  worksheet,
  onSelect,
  onPrintDirect,
}) => {
  const getAgeColor = (age: string) => {
    switch (age) {
      case '2-3':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case '3-4':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case '4-5':
        return 'text-sky-800 bg-sky-50 border-sky-200';
      case '5-6':
        return 'text-purple-800 bg-purple-50 border-purple-200';
      default:
        return 'text-slate-800 bg-slate-50 border-slate-200';
    }
  };

  const firstQuestion = worksheet.questions[0];
  const previewEmoji =
    firstQuestion?.visual ||
    firstQuestion?.options?.[0]?.visual ||
    firstQuestion?.matchPairs?.[0]?.leftVisual ||
    '⭐';

  return (
    <div className="group bg-white rounded-2xl border border-amber-100/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      <div className="p-5 space-y-4">
        {/* Top bar: Quiet unboxed metadata */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md font-bold border text-[11px] ${getAgeColor(worksheet.ageGroup)}`}>
              {worksheet.ageGroupLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-600">{worksheet.activityTypeLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">{worksheet.difficulty}</span>
          </div>

          {worksheet.isAssessment && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              اختبار
            </span>
          )}
        </div>

        {/* Visual Hero Thumbnail Area */}
        <div className="h-32 bg-linear-to-b from-amber-50/40 to-slate-50/60 rounded-xl flex items-center justify-center border border-amber-100/60 relative overflow-hidden group-hover:scale-[1.01] transition-transform">
          <div className="text-5xl select-none filter drop-shadow-xs flex items-center gap-2">
            <span>{previewEmoji}</span>
            {firstQuestion?.matchPairs?.[0]?.rightVisual && (
              <span className="text-3xl opacity-80">➔ {firstQuestion.matchPairs[0].rightVisual}</span>
            )}
          </div>
          <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200/60 font-medium">
            {worksheet.layoutLabel}
          </div>
        </div>

        {/* Title & Objective */}
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
            {worksheet.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {worksheet.objective}
          </p>
        </div>

        {/* Skills Tag Line */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500 flex-wrap pt-1">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <span>المهارات:</span>
          {worksheet.skillsMeasured.slice(0, 2).map((skill, idx) => (
            <span key={idx} className="text-slate-700 font-medium">
              {skill}
              {idx < Math.min(worksheet.skillsMeasured.length, 2) - 1 ? '،' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 pt-0 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => {
            sounds.playPop();
            onSelect(worksheet, 'interactive');
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition active:scale-95 shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>حل تفاعلي</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            onPrintDirect(worksheet);
          }}
          className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs transition active:scale-95 border border-slate-200"
          title="معاينة وطباعة فورية"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>طباعة A4</span>
        </button>
      </div>
    </div>
  );
};
