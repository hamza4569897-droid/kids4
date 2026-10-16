import React from 'react';
import { ArrowRight } from 'lucide-react';
import { sounds } from '../lib/audio';

export const NotFoundPage: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-amber-200/80 my-8">
      <span className="text-7xl mb-4 animate-bounce">🎈</span>
      <h1 className="text-3xl sm:text-4xl font-black text-amber-950 mb-2">
        أُووه! الصفحة غير موجودة
      </h1>
      <p className="text-sm sm:text-base text-slate-600 max-w-md mb-8">
        يبدو أن البالون قد طار بعيداً! لا تقلق، دعنا نعود معاً إلى الألعاب الرائعة في عالم الصغار.
      </p>
      <button
        onClick={() => {
          sounds.playPop();
          onHome();
        }}
        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl shadow-sm transition active:scale-95 text-sm"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للصفحة الرئيسية</span>
      </button>
    </div>
  );
};
