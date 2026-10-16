import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  ShieldCheck,
  Send,
  Flag,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';
import { ContentReview, ContentReviewType, ReviewStats } from '../../types/database';
import {
  getContentReviews,
  getReviewStats,
  submitReview,
  flagReview,
} from '../../lib/comments';
import { sounds } from '../../lib/audio';

interface ContentReviewsSectionProps {
  contentId: string;
  contentType: ContentReviewType;
  contentTitle: string;
  compact?: boolean;
}

export const ContentReviewsSection: React.FC<ContentReviewsSectionProps> = ({
  contentId,
  contentType,
  contentTitle,
  compact = false,
}) => {
  const [reviews, setReviews] = useState<ContentReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form states
  const [nickname, setNickname] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [rating, setRating] = useState<number | null>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // When review is submitted, close the rating box and show the green message
  const [isFormClosed, setIsFormClosed] = useState<boolean>(false);
  const [showBottomToast, setShowBottomToast] = useState<boolean>(false);
  const [submittedRatingValue, setSubmittedRatingValue] = useState<number | null>(null);

  // Auto-dismiss bottom green toast after 4.5 seconds
  useEffect(() => {
    if (showBottomToast) {
      const timer = setTimeout(() => {
        setShowBottomToast(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [showBottomToast]);

  // Reporting / Flagging modal states
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>('');
  const [isReporting, setIsReporting] = useState<boolean>(false);

  // Guidelines accordion toggle
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [revs, st] = await Promise.all([
        getContentReviews(contentId),
        getReviewStats(contentId),
      ]);
      setReviews(revs);
      setStats(st);
    } catch (err) {
      console.error('فشل تحميل التعليقات:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [contentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    sounds.playPop();
    setIsSubmitting(true);
    setFeedbackMessage(null);

    const savedRating = rating;

    const result = await submitReview({
      content_id: contentId,
      content_type: contentType,
      content_title: contentTitle,
      author_name: nickname.trim() || undefined,
      comment_text: commentText,
      rating: rating,
    });

    setIsSubmitting(false);

    if (result.success) {
      sounds.playChime();
      // 1. Close the rating box immediately
      setIsFormClosed(true);
      // 2. Show green bottom notification toast
      setShowBottomToast(true);
      setSubmittedRatingValue(savedRating);
      setFeedbackMessage({ type: 'success', text: 'تم التقييم بنجاح' });
      setCommentText('');
      setNickname('');
      setRating(5);
    } else {
      sounds.playTryAgain();
      setFeedbackMessage({ type: 'error', text: result.message });
    }
  };

  const handleFlagReview = async (reviewId: string) => {
    setIsReporting(true);
    sounds.playPop();
    const res = await flagReview(reviewId, reportReason);
    setIsReporting(false);
    setReportingReviewId(null);
    setReportReason('');
    if (res.success) {
      sounds.playChime();
      setFeedbackMessage({ type: 'success', text: res.message });
    }
  };

  const formatReviewDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return 'منذ قليل';
      if (diffHours < 24) return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
      if (diffDays < 7) return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;

      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'مؤخراً';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xs space-y-6 text-right">
      {/* 1. Header & Rating Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full">
            <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
            <span>خانة التعليقات والتقييمات</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-950">
            شاركنا رأيك وتعليقك حول هذا النشاط
          </h3>
          <p className="text-xs text-slate-500">
            يمكنك كتابة تعليقك وتقييمك في الخانة المخصصة بالأسفل لمشاركة تجربتك مع أولياء الأمور
          </p>
        </div>

        {/* Real Star Rating Summary Badge (Only when real approved ratings exist) */}
        {stats && stats.totalRatingsCount > 0 ? (
          <div className="flex items-center gap-3 bg-amber-50/70 p-3 sm:p-4 rounded-2xl border border-amber-200/80 self-start sm:self-auto">
            <div className="text-center pl-3 border-l border-amber-200">
              <span className="text-2xl sm:text-3xl font-black text-amber-950 block leading-tight">
                {stats.averageRating}
              </span>
              <span className="text-[10px] text-slate-500 font-bold">من 5 نجوم</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      stats.averageRating && stats.averageRating >= s
                        ? 'fill-amber-400 text-amber-500'
                        : stats.averageRating && stats.averageRating >= s - 0.5
                        ? 'fill-amber-200 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600 block mt-1">
                بناءً على {stats.totalRatingsCount} تقييم معتمد
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/70 px-4 py-2.5 rounded-2xl border border-amber-200/70 text-xs text-amber-900 font-bold self-start sm:self-auto flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>خانة التعليق مفتوحة للجميع — شاركنا رأيك أولاً!</span>
          </div>
        )}
      </div>

      {/* 2. Primary Comment & Review Box (خانة التعليق) OR Green Success Card */}
      {isFormClosed ? (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-5 sm:p-6 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-emerald-900">
                  تم التقييم بنجاح
                </h4>
                {submittedRatingValue && (
                  <span className="text-xs bg-emerald-200/90 text-emerald-950 font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <span>{submittedRatingValue} من 5</span>
                    <span>⭐</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-800 font-medium">
                شكراً لمشاركتك! تم إرسال تقييمك وملاحظتك بنجاح، وسينشر فور اعتماده من الإشراف لضمان بيئة آمنة للأطفال.
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
            <span>كتابة تعليق آخر</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 p-5 sm:p-7 rounded-3xl border-2 border-amber-300/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200/60">
          <h4 className="text-base font-black text-amber-950 flex items-center gap-2">
            <span className="text-xl">✍️</span>
            <span>خانة كتابة تعليق جديد:</span>
          </h4>
          <span className="text-[11px] text-amber-800/80 bg-amber-100/70 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
            🛡️ يُنشر التعليق فور مراجعة الإدارة لحماية خصوصية الأطفال
          </span>
        </div>

        {/* Rating Star Picker */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-200/60">
          <label className="block text-xs font-black text-slate-800 mb-1.5">
            تقييمك للنشاط بالنجوم (اختياري):
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const currentRating = hoverRating !== null ? hoverRating : (rating || 0);
                const isActive = currentRating >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => {
                      sounds.playPop();
                      setRating(star === rating ? null : star);
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 rounded-lg hover:bg-amber-100 transition cursor-pointer"
                    aria-label={`${star} من 5 نجوم`}
                  >
                    <Star
                      className={`w-6 h-6 transition-transform ${
                        isActive
                          ? 'fill-amber-400 text-amber-500 scale-110'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            {rating && (
              <span className="text-xs font-bold text-amber-800">
                {rating === 5 ? 'ممتاز 🌟' : rating === 4 ? 'جيد جداً 👍' : rating === 3 ? 'جيد 👌' : rating === 2 ? 'مقبول' : 'يحتاج تحسين'}
              </span>
            )}
            {rating && (
              <button
                type="button"
                onClick={() => setRating(null)}
                className="text-[10px] text-slate-400 hover:text-slate-600 underline mr-2"
              >
                إلغاء التقييم
              </button>
            )}
          </div>
        </div>

        {/* Nickname input */}
        <div>
          <label htmlFor="nickname" className="block text-xs font-bold text-slate-700 mb-1.5">
            الاسم المستعار (اختياري):
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="مثال: أم عبد الله / معلمة روضة / أبو فهد"
            maxLength={40}
            className="w-full sm:max-w-xs px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>

        {/* Comment Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="comment_text" className="block text-xs font-bold text-slate-700">
              الملاحظة أو التجربة: <span className="text-rose-500">*</span>
            </label>
            <span className={`text-[10px] font-bold ${commentText.length > 500 ? 'text-rose-600' : 'text-slate-400'}`}>
              {commentText.length} / 500 حرف
            </span>
          </div>
          <textarea
            id="comment_text"
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="اكتب تعليقك أو ملاحظتك حول هذا النشاط هنا (مثال: طفلي أحب اللعبة، أو استخدمنا ألواناً إضافية)..."
            maxLength={500}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs leading-relaxed font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden resize-none"
            required
          />
        </div>

        {/* Feedback Message Banner */}
        {feedbackMessage && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : 'bg-rose-50 text-rose-900 border border-rose-300'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{feedbackMessage.text}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-slate-500 font-medium">
            🔒 لا يُطلب بريد إلكتروني أو رقم هاتف لحماية خصوصيتك وخصوصية طفلك.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || commentText.trim().length < 5}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>إرسال التعليق للمراجعة</span>
          </button>
        </div>
      </form>
    )}

      {/* 4. Approved Reviews List */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span>التعليقات المنشورة</span>
            {reviews.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                {reviews.length}
              </span>
            )}
          </h4>
          {reviews.length > 0 && (
            <span className="text-[11px] text-slate-400">الترتيب من الأحدث إلى الأقدم</span>
          )}
        </div>

        {isLoading ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-8 h-8 rounded-full border-3 border-amber-300 border-t-amber-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-bold">جاري تحميل التعليقات...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/60 rounded-3xl border border-dashed border-slate-200 space-y-2">
            <div className="w-10 h-10 bg-amber-100/70 text-amber-800 rounded-2xl flex items-center justify-center text-xl mx-auto">
              💬
            </div>
            <h5 className="text-sm font-black text-slate-700">لا توجد تعليقات منشورة بعد لهذا النشاط</h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              اكتب تعليقك أو ملاحظتك في الخانة أعلاه وسيظهر هنا فور اعتماده من المشرف التربوي!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white border border-amber-100/90 hover:border-amber-300 transition-all shadow-2xs space-y-3"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-200 to-orange-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                      {rev.author_name.charAt(0) || 'و'}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">
                        {rev.author_name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatReviewDate(rev.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars if provided */}
                  {rev.rating && (
                    <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200/50">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="text-xs font-black text-amber-900">{rev.rating}</span>
                    </div>
                  )}
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {rev.comment_text}
                </p>

                {/* Footer with Report Button */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setReportingReviewId(rev.id);
                    }}
                    className="text-[10px] text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
                    title="الإبلاغ عن محتوى غير لائق"
                  >
                    <Flag className="w-3 h-3" />
                    <span>إبلاغ عن محتوى غير لائق</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flag / Report Modal */}
      {reportingReviewId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-amber-200 shadow-2xl space-y-4 text-right">
            <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
              <Flag className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-black text-slate-900">إبلاغ عن محتوى غير لائق</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                هل يتضمن هذا التعليق معلومات غير آمنة للأطفال أو إساءة؟
              </p>
            </div>

            <textarea
              rows={2}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="سبب البلاغ (اختياري)..."
              className="w-full p-3 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleFlagReview(reportingReviewId)}
                disabled={isReporting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {isReporting ? 'جاري الإرسال...' : 'تأكيد البلاغ'}
              </button>
              <button
                onClick={() => {
                  setReportingReviewId(null);
                  setReportReason('');
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};
