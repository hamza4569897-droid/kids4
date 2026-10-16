import React, { useState, useEffect } from 'react';
import { Star, Sparkles, CheckCircle2, Heart, ShieldCheck, RotateCcw } from 'lucide-react';
import {
  getSiteRatingSummary,
  submitSiteRating,
  SiteRatingSummary,
} from '../../lib/siteRating';
import { sounds } from '../../lib/audio';

interface SiteRatingWidgetProps {
  compact?: boolean;
  onRated?: () => void;
  className?: string;
}

export const SiteRatingWidget: React.FC<SiteRatingWidgetProps> = ({
  compact = false,
  onRated,
  className = '',
}) => {
  const [summary, setSummary] = useState<SiteRatingSummary | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [hasRatedBefore, setHasRatedBefore] = useState<boolean>(false);

  // When rating is submitted, the rating box closes and the green success message is shown
  const [isFormClosed, setIsFormClosed] = useState<boolean>(false);
  const [showBottomToast, setShowBottomToast] = useState<boolean>(false);

  useEffect(() => {
    loadSummary();
  }, []);

  // Auto-dismiss bottom green toast after 4.5 seconds
  useEffect(() => {
    if (showBottomToast) {
      const timer = setTimeout(() => {
        setShowBottomToast(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [showBottomToast]);

  const loadSummary = async () => {
    try {
      const data = await getSiteRatingSummary();
      setSummary(data);
      if (data.userRating) {
        setSelectedRating(data.userRating);
        setHasRatedBefore(true);
        if (data.userComment) {
          setComment(data.userComment);
        }
      }
    } catch (err) {
      console.error('Failed to load site rating summary:', err);
    }
  };

  const handleStarClick = (rating: number) => {
    sounds.playPop();
    setSelectedRating(rating);
  };

  const handleRatingSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    sounds.playPop();
    setIsSubmitting(true);
    setFeedback(null);

    const res = await submitSiteRating({
      rating: selectedRating,
      comment: comment.trim() || undefined,
      nickname: nickname.trim() || undefined,
    });

    setIsSubmitting(false);

    if (res.success) {
      sounds.playChime();
      // 1. Close the rating input box
      setIsFormClosed(true);
      // 2. Show the green message
      setFeedback({ success: true, message: 'تم التقييم بنجاح' });
      // 3. Trigger bottom green toast banner
      setShowBottomToast(true);
      setHasRatedBefore(true);
      await loadSummary();
      if (onRated) {
        onRated();
      }
    } else {
      sounds.playTryAgain();
      setFeedback({ success: false, message: res.message });
    }
  };

  const starLabels: Record<number, string> = {
    5: 'ممتاز ويفوق التوقعات 🌟',
    4: 'رائع ومفيد جداً 👍',
    3: 'جيد وبداية طيبة 👌',
    2: 'مقبول ويحتاج تطوير',
    1: 'يحتاج تحسينات ملحوظة',
  };

  const activeRating = hoverRating !== null ? hoverRating : selectedRating;

  return (
    <>
      <div
        className={`bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 rounded-3xl p-6 sm:p-7 border-2 border-amber-300/80 shadow-xs text-right relative overflow-hidden ${className}`}
      >
        {/* Decorative background star */}
        <div className="absolute -left-6 -bottom-6 text-7xl opacity-10 pointer-events-none select-none">
          ⭐
        </div>

        <div className="space-y-5 relative z-10">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200/60">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                <span>تقييم موقع عالم الصغار</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-amber-950">
                ما هو تقييمك لمنصة عالم الصغار؟
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                رأيك واقتراحاتك بالغة الأهمية لتطوير محتوى تعليمي هادف وآمن لأطفالنا
              </p>
            </div>

            {/* Current Site Overall Score Badge */}
            {summary && summary.totalRatings > 0 ? (
              <div className="flex items-center gap-3 bg-white/90 p-3 rounded-2xl border border-amber-200/80 self-start sm:self-auto shadow-2xs">
                <div className="text-center pl-3 border-l border-amber-200">
                  <span className="text-2xl font-black text-amber-950 block leading-tight">
                    {summary.averageRating}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">من 5 نجوم</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          summary.averageRating && summary.averageRating >= s
                            ? 'fill-amber-400 text-amber-500'
                            : summary.averageRating && summary.averageRating >= s - 0.5
                            ? 'fill-amber-200 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 block mt-0.5">
                    بناءً على {summary.totalRatings} تقييم
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 px-3 py-1.5 rounded-2xl border border-amber-200 text-xs text-amber-800 font-bold flex items-center gap-1.5 self-start sm:self-auto">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>كن أول من يقيّم الموقع!</span>
              </div>
            )}
          </div>

          {/* Condition 1: If user submitted, show green success banner below and hide rating box */}
          {isFormClosed ? (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 sm:p-6 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs animate-in fade-in duration-300">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-emerald-900">
                      تم التقييم بنجاح
                    </h4>
                    <span className="text-xs bg-emerald-200/90 text-emerald-950 font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span>{selectedRating} من 5</span>
                      <span>⭐</span>
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-medium">
                    شكراً جزيلاً لتقييمك لموقع عالم الصغار. تم تسجيل تقييمك وحفظه بنجاح!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setIsFormClosed(false);
                }}
                className="text-xs font-black text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-300 px-4 py-2.5 rounded-2xl shadow-2xs transition flex items-center gap-1.5 self-start sm:self-auto shrink-0 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                <span>تعديل التقييم</span>
              </button>
            </div>
          ) : (
            /* Condition 2: Active Rating Box */
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Interactive Star Picker */}
              <div className="bg-white/95 p-4 sm:p-5 rounded-2xl border border-amber-200/70 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-800">
                    اختر عدد النجوم لتقييم الموقع:
                  </span>
                  <span className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200/60 inline-flex items-center gap-1">
                    <span>{starLabels[activeRating]}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = activeRating >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 sm:p-1.5 rounded-xl hover:bg-amber-100/70 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                        aria-label={`${star} من 5 نجوم`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-9 sm:h-9 transition-transform duration-150 ${
                            isFilled
                              ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-xs'
                              : 'text-slate-200 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Toggle optional comment and nickname */}
                {!compact && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowOptionalFields(!showOptionalFields)}
                      className="text-xs text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>{showOptionalFields ? 'إخفاء خانة الملاحظات' : '✍️ هل ترغب في كتابة ملاحظة أو اسمك مع التقييم؟ (اختياري)'}</span>
                    </button>

                    {showOptionalFields && (
                      <div className="mt-3 space-y-3 pt-3 border-t border-amber-100 text-right">
                        <div>
                          <label htmlFor="site-rating-nickname" className="block text-xs font-bold text-slate-700 mb-1">
                            الاسم المستعار (اختياري):
                          </label>
                          <input
                            id="site-rating-nickname"
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="مثال: أم راشد / أبو خالد / معلمة أطفال"
                            maxLength={30}
                            className="w-full sm:max-w-xs px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label htmlFor="site-rating-comment" className="block text-xs font-bold text-slate-700 mb-1">
                            ملاحظتك أو تجربتك مع الموقع (اختياري):
                          </label>
                          <textarea
                            id="site-rating-comment"
                            rows={2}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="ما الذي أعجبك في المنصة، أو ما الذي ترغب في إضافته لأطفالك؟"
                            maxLength={300}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs leading-relaxed font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error Feedback Message if any */}
              {feedback && !feedback.success && (
                <div className="p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5 bg-rose-50 text-rose-900 border border-rose-300">
                  <Heart className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{feedback.message}</p>
                </div>
              )}

              {/* Action button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>لا نطلب أي بيانات شخصية أو بريد إلكتروني للحفاظ على خصوصيتك الكاملة.</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRatingSubmit()}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Star className="w-4 h-4 fill-white" />
                  )}
                  <span>إرسال تقييم الموقع</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Green Bottom Notification Toast */}
      {showBottomToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-2xl border-2 border-emerald-300 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 pointer-events-auto"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm sm:text-base">تم التقييم بنجاح</span>
        </div>
      )}
    </>
  );
};
