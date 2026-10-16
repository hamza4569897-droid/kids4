import React, { useRef, useState, useEffect } from 'react';
import { sounds } from '../../lib/audio';
import { Download, Printer, RotateCcw, ArrowRight, Brush } from 'lucide-react';

const COLOR_PALETTE = [
  { name: 'أصفر مشمس', hex: '#FACC15' },
  { name: 'سماوي رائق', hex: '#38BDF8' },
  { name: 'وردي حلوى', hex: '#F472B6' },
  { name: 'نعناعي منعش', hex: '#34D399' },
  { name: 'برتقالي بهيج', hex: '#FB923C' },
  { name: 'بنفسجي زاهي', hex: '#C084FC' },
  { name: 'أحمر قرمزي', hex: '#EF4444' },
  { name: 'بني دافئ', hex: '#92400E' },
  { name: 'ممحاة (أبيض)', hex: '#FFFFFF' },
];

const TEMPLATES = [
  { id: 'star', name: 'نجمة تبتسم ⭐' },
  { id: 'flower', name: 'زهرة ربيعية 🌸' },
  { id: 'apple', name: 'تفاحة لذيذة 🍎' },
  { id: 'boat', name: 'مركب بحري ⛵' },
  { id: 'blank', name: 'لوحة بيضاء حرة 🎨' },
];

export const ColoringCanvas: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#FACC15');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('star');

  const drawTemplateOutline = (templateId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill clean white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (templateId === 'star') {
      ctx.beginPath();
      const spikes = 5;
      const outerRadius = 110;
      const innerRadius = 55;
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.stroke();

      // Smiling face
      ctx.beginPath();
      ctx.arc(cx - 30, cy - 15, 6, 0, Math.PI * 2);
      ctx.arc(cx + 30, cy - 15, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#1E293B';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy + 10, 24, 0.2, Math.PI - 0.2, false);
      ctx.stroke();
    } else if (templateId === 'flower') {
      // Flower center
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.stroke();

      // Petals
      const petals = 6;
      for (let i = 0; i < petals; i++) {
        const angle = (i * 2 * Math.PI) / petals;
        const px = cx + Math.cos(angle) * 85;
        const py = cy + Math.sin(angle) * 85;
        ctx.beginPath();
        ctx.arc(px, py, 40, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Stem
      ctx.beginPath();
      ctx.moveTo(cx, cy + 80);
      ctx.lineTo(cx, cy + 170);
      ctx.lineWidth = 6;
      ctx.stroke();
    } else if (templateId === 'apple') {
      // Apple shape
      ctx.beginPath();
      ctx.arc(cx - 35, cy, 65, 0, Math.PI * 2);
      ctx.arc(cx + 35, cy, 65, 0, Math.PI * 2);
      ctx.stroke();

      // Stem & leaf
      ctx.beginPath();
      ctx.moveTo(cx, cy - 65);
      ctx.quadraticCurveTo(cx - 10, cy - 110, cx + 5, cy - 115);
      ctx.lineWidth = 5;
      ctx.stroke();
    } else if (templateId === 'boat') {
      // Boat hull
      ctx.beginPath();
      ctx.moveTo(cx - 120, cy + 40);
      ctx.lineTo(cx + 120, cy + 40);
      ctx.lineTo(cx + 80, cy + 100);
      ctx.lineTo(cx - 80, cy + 100);
      ctx.closePath();
      ctx.stroke();

      // Mast
      ctx.beginPath();
      ctx.moveTo(cx, cy + 40);
      ctx.lineTo(cx, cy - 90);
      ctx.stroke();

      // Sail
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy + 30);
      ctx.lineTo(cx + 10, cy - 80);
      ctx.lineTo(cx + 90, cy + 20);
      ctx.closePath();
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawTemplateOutline(selectedTemplate);
  }, [selectedTemplate]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width ? canvas.width / rect.width : 1;
    const scaleY = rect.height ? canvas.height / rect.height : 1;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width ? canvas.width / rect.width : 1;
    const scaleY = rect.height ? canvas.height / rect.height : 1;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleDownload = () => {
    sounds.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `لوحة-عالم-الصغار-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    sounds.playPop();
    window.print();
  };

  const handleReset = () => {
    sounds.playPop();
    drawTemplateOutline(selectedTemplate);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-100">
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
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900">استوديو التلوين المبهج 🎨</h2>
            <p className="text-xs sm:text-sm text-slate-500">اختر لونك المفضل وابدأ الإبداع بأناملك</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 bg-amber-50 rounded-xl text-amber-800 hover:bg-amber-100 transition flex items-center gap-1.5 text-xs font-bold"
            title="مسح اللوحة"
          >
            <RotateCcw className="w-4 h-4" />
            <span>مسح</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-2.5 bg-emerald-50 rounded-xl text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1.5 text-xs font-bold"
            title="حفظ الصورة"
          >
            <Download className="w-4 h-4" />
            <span>حفظ</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-2.5 bg-sky-50 rounded-xl text-sky-800 hover:bg-sky-100 transition flex items-center gap-1.5 text-xs font-bold"
            title="طباعة اللوحة"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Templates Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-bold text-slate-500">الرسمة:</span>
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => {
              sounds.playPop();
              setSelectedTemplate(tmpl.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedTemplate === tmpl.id
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50/70 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {tmpl.name}
          </button>
        ))}
      </div>

      {/* Palette & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-amber-50/40 p-3 rounded-2xl border border-amber-100">
        {/* Colors */}
        <div className="flex flex-wrap items-center gap-2">
          {COLOR_PALETTE.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                sounds.playPop();
                setCurrentColor(c.hex);
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-9 h-9 rounded-full border-2 transition-all transform active:scale-90 ${
                currentColor === c.hex ? 'scale-115 border-slate-900 shadow-md ring-2 ring-amber-300' : 'border-slate-300'
              }`}
              title={c.name}
              aria-label={c.name}
            />
          ))}
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-2">
          <Brush className="w-4 h-4 text-slate-500" />
          {[6, 14, 24, 38].map((size) => (
            <button
              key={size}
              onClick={() => {
                sounds.playPop();
                setBrushSize(size);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition border ${
                brushSize === size ? 'bg-amber-500 text-white border-amber-600' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <span
                className="rounded-full bg-current"
                style={{ width: `${Math.min(size / 2 + 2, 16)}px`, height: `${Math.min(size / 2 + 2, 16)}px` }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center overflow-hidden rounded-2xl border-2 border-dashed border-amber-300 bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          width={640}
          height={440}
          className="touch-none cursor-crosshair max-w-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
};
