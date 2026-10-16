import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Heart,
  Share2,
  Sparkles,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { Worksheet } from '../../types/worksheets';
import { WorksheetRenderer } from './WorksheetRenderer';
import { sounds } from '../../lib/audio';
import { ContentReviewsSection } from '../common/ContentReviewsSection';

interface WorksheetPreviewModalProps {
  worksheet: Worksheet | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const WorksheetPreviewModal: React.FC<WorksheetPreviewModalProps> = ({
  worksheet,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !worksheet) return null;

  const handlePrint = () => {
    sounds.playPop();
    window.print();
  };

  const handleDownloadFile = () => {
    sounds.playChime();
    // Build a standalone, high-fidelity printable HTML/SVG document that can be opened or saved directly as PDF
    const printableDoc = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${worksheet.titleAr} — عالم الصغار</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
    body {
      font-family: 'Tajawal', system-ui, sans-serif;
      margin: 0;
      padding: 20px;
      background: #ffffff;
      color: #1e293b;
    }
    .sheet-card {
      max-width: 800px;
      margin: 0 auto;
      border: 3px dashed #94a3b8;
      border-radius: 24px;
      padding: 30px;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #334155;
      padding-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 24px;
      font-weight: 900;
      margin: 15px 0 5px;
      text-align: center;
    }
    .instructions {
      text-align: center;
      background: #fef3c7;
      border: 1px solid #fde68a;
      padding: 10px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 25px;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-weight: bold;
      background: #f8fafc;
      padding: 8px 12px;
      border-radius: 8px;
      margin-top: 10px;
    }
    .content-box {
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 20px;
    }
    .footer {
      border-top: 2px solid #cbd5e1;
      padding-top: 15px;
      font-size: 12px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }
    @media print {
      body { padding: 0; }
      .sheet-card { border: none; padding: 10px; }
    }
  </style>
</head>
<body>
  <div class="sheet-card">
    <div class="header">
      <div>
        <h2 style="margin:0; font-size:20px; color:#78350f;">⭐ عالم الصغار — Little Stars</h2>
        <span style="font-size:12px; color:#64748b;">مكتبة أوراق العمل للأطفال</span>
      </div>
      <div style="text-align:left; font-size:12px; font-weight:bold;">
        <div>${worksheet.ageRangeAr}</div>
        <div style="color:#64748b;">${worksheet.categoryAr}</div>
      </div>
    </div>
    <div class="meta-bar">
      <div>الاسم: .......................................</div>
      <div>التاريخ: .... / .... / ........</div>
      <div>التقييم: ⭐⭐⭐⭐⭐</div>
    </div>
    <div class="title">${worksheet.titleAr}</div>
    <div class="instructions">📌 ${worksheet.exerciseData.instructions}</div>
    <div class="content-box">
      ${
        worksheet.exerciseData.items
          ?.map(
            (i) => `
        <div style="border: 2px dashed #cbd5e1; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 10px;">
          ${i.dottedText ? `<div style="font-size: 72px; font-weight: 900; letter-spacing: 10px; border-bottom: 2px dotted #94a3b8; padding-bottom: 10px;">${i.dottedText}</div>` : ''}
          ${i.icon ? `<div style="font-size: 40px; margin: 10px 0;">${i.icon}</div>` : ''}
          <div style="font-size: 16px; font-weight: bold;">${i.label || ''}</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">(اكتب وتدرب هنا بخط جميل)</div>
        </div>
      `
          )
          .join('') || '<div style="text-align:center; padding: 40px; font-size:18px;">ورقة عمل تدريبية معتمدة جاهزة للطباعة والتلوين</div>'
      }
    </div>
    <div class="footer">
      <div>🌟 أحسنت يا بطل! واصل التعلم والإبداع في عالم الصغار</div>
      <div>رخصة مجانية للأسر والمدارس — Little Stars 2026</div>
    </div>
  </div>
  <script>
    window.onload = function() {
      // Auto-prompt print if opened standalone
    };
  </script>
</body>
</html>`;

    const blob = new Blob([printableDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ورقة_عمل_${worksheet.slug}_عالم_الصغار.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    sounds.playPop();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-amber-200/80 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Top Sticky Header */}
        <div className="px-6 py-4 bg-amber-50/80 border-b border-amber-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{worksheet.exerciseData.bannerEmoji}</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {worksheet.titleAr}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 text-xs">
                <span className="font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  {worksheet.ageRangeAr}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-600 font-medium">{worksheet.categoryAr}</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                title="تصغير"
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-600"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-600 px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                title="تكبير"
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-600"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                title="إعادة ضبط الحجم"
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => {
                sounds.playPop();
                onToggleFavorite(worksheet.id);
              }}
              title={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
              className={`p-2.5 rounded-xl border transition ${
                isFavorite
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة فورية</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الورقة</span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Sheet Preview Container */}
            <div
              className="transition-transform duration-200 origin-top flex justify-center"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                <WorksheetRenderer worksheet={worksheet as any} mode="preview" />
              </div>
            </div>

            {/* Pedagogical Guidance Box for Parents & Teachers */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs space-y-4 text-right">
              <div className="flex items-center gap-2 border-b border-amber-100 pb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-base text-slate-900">
                  إرشادات ولي الأمر والمعلم لتطبيق النشاط بنجاح
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-1.5">
                  <span className="font-bold text-amber-900 block">💡 نصيحة تطبيق النشاط:</span>
                  <p className="leading-relaxed">{worksheet.parentTipAr}</p>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/60 space-y-1.5">
                  <span className="font-bold text-emerald-900 block">🎯 الهدف التربوي:</span>
                  <p className="leading-relaxed">{worksheet.learningObjectiveAr}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>جاهز للطباعة على ورق A4 القياسي أو الاستخدام على الأجهزة اللوحية.</span>
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-amber-700 font-bold transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'تم نسخ الرابط! ✓' : 'مشاركة ورقة العمل'}</span>
                </button>
              </div>
            </div>

            {/* Child-Safe Reviews & Ratings Section for the Worksheet (hidden on print) */}
            <div className="print:hidden">
              <ContentReviewsSection
                contentId={worksheet.id}
                contentType="worksheet"
                contentTitle={worksheet.titleAr}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
