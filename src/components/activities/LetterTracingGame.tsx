import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../lib/audio';
import { RotateCcw, ArrowRight, Trophy, Star } from 'lucide-react';

interface TraceTarget {
  id: string;
  label: string;
  type: 'letter' | 'number' | 'shape';
  drawGuide: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

const TRACE_TARGETS: TraceTarget[] = [
  {
    id: 'alif',
    label: 'حرف الألف (أ)',
    type: 'letter',
    drawGuide: (ctx, w, h) => {
      const cx = w / 2;
      // Vertical line
      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.moveTo(cx, 130);
      ctx.lineTo(cx, 340);
      ctx.stroke();

      // Hamza on top
      ctx.beginPath();
      ctx.arc(cx, 85, 20, Math.PI, 0, false);
      ctx.lineTo(cx - 20, 105);
      ctx.stroke();
    },
  },
  {
    id: 'baa',
    label: 'حرف الباء (ب)',
    type: 'letter',
    drawGuide: (ctx, w, h) => {
      const cx = w / 2;
      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.moveTo(cx + 120, 200);
      ctx.lineTo(cx + 120, 260);
      ctx.quadraticCurveTo(cx, 280, cx - 120, 260);
      ctx.lineTo(cx - 120, 200);
      ctx.stroke();

      // Dot beneath
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.arc(cx, 320, 10, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'circle',
    label: 'الدائرة المكتملة',
    type: 'shape',
    drawGuide: (ctx, w, h) => {
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.arc(cx, cy, 100, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
];

export const LetterTracingGame: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTarget, setCurrentTarget] = useState<TraceTarget>(TRACE_TARGETS[0]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const drawBaseCanvas = (target: TraceTarget) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset background
    ctx.setLineDash([]);
    ctx.fillStyle = '#FFFDF5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Guide lines in soft slate/amber
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#CBD5E1';
    ctx.fillStyle = '#94A3B8';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    target.drawGuide(ctx, canvas.width, canvas.height);
  };

  useEffect(() => {
    setStrokeCount(0);
    setCompleted(false);
    drawBaseCanvas(currentTarget);
  }, [currentTarget]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setStrokeCount((s) => s + 1);
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

    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#F59E0B'; // warm bright amber
    ctx.lineWidth = 18;
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

  const stopDraw = () => {
    if (isDrawing && strokeCount >= 1 && !completed) {
      sounds.playChime();
      if (strokeCount >= 2) {
        setCompleted(true);
        sounds.playCheer();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
    }
    setIsDrawing(false);
  };

  const handleReset = () => {
    sounds.playPop();
    setStrokeCount(0);
    setCompleted(false);
    drawBaseCanvas(currentTarget);
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
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900">تتبع الحروف والخطوط ✍️</h2>
            <p className="text-xs sm:text-sm text-slate-500">مرر إصبعك أو الفأرة على النقاط الإرشادية</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2.5 bg-amber-50 rounded-xl text-amber-800 hover:bg-amber-100 transition flex items-center gap-1.5 text-xs font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>

      {/* Target Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {TRACE_TARGETS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              sounds.playPop();
              setCurrentTarget(t);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              currentTarget.id === t.id
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative flex justify-center overflow-hidden rounded-3xl border-2 border-amber-200 bg-[#FFFDF5] shadow-inner mb-4">
        <canvas
          ref={canvasRef}
          width={580}
          height={380}
          className="touch-none cursor-pointer max-w-full"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />

        {completed && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
              <Star className="w-8 h-8 fill-amber-500 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black text-amber-950 mb-1">خط جميل ومحاولة رائعة! 🌟</h3>
            <p className="text-slate-600 text-sm mb-4">أصابعك الصغيرة تصنع العجائب!</p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-xs transition"
            >
              تمرّن مرة أخرى
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
