import React, { useState, useEffect } from 'react';
import { sounds } from '../../lib/audio';
import { Lock, X, Check } from 'lucide-react';

interface ParentGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  destinationTitle?: string;
  isExternalLink?: boolean;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  destinationTitle,
  isExternalLink = false,
}) => {
  const [numA, setNumA] = useState<number>(6);
  const [numB, setNumB] = useState<number>(7);
  const [answerInput, setAnswerInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 8) + 5; // 5..12
    const b = Math.floor(Math.random() * 8) + 4; // 4..11
    setNumA(a);
    setNumB(b);
    setAnswerInput('');
    setError('');
  };

  useEffect(() => {
    if (isOpen) {
      generateQuestion();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = numA + numB;
    const provided = parseInt(answerInput.trim(), 10);

    if (provided === expected) {
      sounds.playChime();
      onSuccess();
    } else {
      sounds.playTryAgain();
      setError('الإجابة غير صحيحة، يرجى المحاولة مرة أخرى.');
      generateQuestion();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-slate-900 text-center mb-1">
          بوابة أولياء الأمور 👨‍👩‍👧
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 text-center mb-6">
          {isExternalLink
            ? `أنت على وشك الانتقال إلى رابط خارجي موثوق: ${destinationTitle || ''}. للسلامة، يرجى تأكيد إذن ولي الأمر.`
            : `الوصول إلى منطقة أولياء الأمور أو الإعدادات يتطلب تأكيداً من شخص بالغ.`}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-center">
            <span className="text-xs font-bold text-amber-800 block mb-1">مسألة تحقق حسابية بسيطة:</span>
            <div className="text-2xl font-black text-slate-800 tracking-wider">
              {numA} + {numB} = ؟
            </div>
          </div>

          <div>
            <label htmlFor="gate-answer" className="block text-xs font-bold text-slate-700 mb-1">
              اكتب الناتج هنا:
            </label>
            <input
              id="gate-answer"
              type="number"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="مثال: 15"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-hidden text-center text-xl font-bold"
            />
            {error && <p className="text-xs font-bold text-rose-500 mt-1.5 text-center">{error}</p>}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Check className="w-4 h-4" />
              <span>متابعة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
