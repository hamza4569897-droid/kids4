import React from 'react';
import { X } from 'lucide-react';
import { SiteRatingWidget } from './SiteRatingWidget';
import { sounds } from '../../lib/audio';

interface SiteRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SiteRatingModal: React.FC<SiteRatingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleRated = () => {
    // Give user time to see the green confirmation card in the modal, then close smoothly
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full border border-amber-300 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition z-20 cursor-pointer"
          aria-label="إغلاق نافذة التقييم"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-2 sm:p-4">
          <SiteRatingWidget onRated={handleRated} />
        </div>
      </div>
    </div>
  );
};
