import { ContentReview, ContentReviewType, ReviewModerationStatus, SubmitReviewInput, ReviewStats } from '../types/database';
import { supabase, isSupabaseConfigured } from './supabase';
import { safeStorage } from './storage';

const REVIEWS_STORAGE_KEY = 'little_stars_content_reviews_v3';
const RATE_LIMIT_KEY = 'little_stars_last_review_submit';

/**
 * Text sanitization: removes HTML tags, normalizes whitespace, escapes special characters
 */
export function sanitizeCommentText(text: string): string {
  if (!text) return '';
  // 1. Strip script and style blocks
  let clean = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  // 2. Strip any remaining HTML tags
  clean = clean.replace(/<[^>]+>/g, '');
  // 3. Remove javascript: pseudo-protocols
  clean = clean.replace(/javascript:/gi, '');
  // 4. Normalize multiple spaces
  clean = clean.replace(/\s+/g, ' ').trim();
  return clean;
}

/**
 * Detects if the comment contains telephone numbers or email addresses to protect child privacy.
 */
export function containsSensitiveContactInfo(text: string): boolean {
  // Check for common phone number patterns (7 or more digits)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
  // Check for email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  return phoneRegex.test(text) || emailRegex.test(text);
}

/**
 * Helper to get all stored reviews locally.
 * Starts strictly empty - no fake or synthetic comments.
 */
function getLocalReviews(): ContentReview[] {
  try {
    // Also clean up any legacy seed reviews from previous version
    safeStorage.removeItem('little_stars_content_reviews_v2');

    const raw = safeStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Helper to save all reviews locally
 */
function saveLocalReviews(reviews: ContentReview[]): void {
  try {
    safeStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error('فشل حفظ التعليقات محلياً:', err);
  }
}

/**
 * Fetches approved reviews for a specific content item (e.g. activity or worksheet)
 */
export async function getContentReviews(contentId: string): Promise<ContentReview[]> {
  if (!contentId) return [];

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('content_reviews')
        .select('*')
        .eq('content_id', contentId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as ContentReview[];
      }
      console.warn('تعذر استعلام Supabase للتعليقات، استخدام التخزين المحلي:', error?.message);
    } catch (err) {
      console.warn('استثناء أثناء جلب التعليقات من Supabase:', err);
    }
  }

  // Fallback to local storage (only approved reviews)
  const all = getLocalReviews();
  return all
    .filter((r) => r.content_id === contentId && r.status === 'approved')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Calculates real aggregated rating statistics for a content item
 */
export async function getReviewStats(contentId: string): Promise<ReviewStats> {
  const reviews = await getContentReviews(contentId);
  const ratedReviews = reviews.filter((r) => typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5);

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  ratedReviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating!))) as 1 | 2 | 3 | 4 | 5;
    distribution[star] = (distribution[star] || 0) + 1;
    sum += star;
  });

  const totalRatingsCount = ratedReviews.length;
  const averageRating = totalRatingsCount > 0 ? Number((sum / totalRatingsCount).toFixed(1)) : null;

  return {
    averageRating,
    totalReviews: reviews.length,
    totalRatingsCount,
    ratingDistribution: distribution,
  };
}

/**
 * Submits a new review.
 * Always saves in 'pending' status so it requires admin approval before public display.
 */
export async function submitReview(input: SubmitReviewInput): Promise<{
  success: boolean;
  review?: ContentReview;
  message: string;
  error?: string;
}> {
  // 1. Rate limiting check (cooldown: 15 seconds)
  const lastSubmitRaw = safeStorage.getItem(RATE_LIMIT_KEY);
  if (lastSubmitRaw) {
    const elapsed = Date.now() - parseInt(lastSubmitRaw, 10);
    if (elapsed < 15000) {
      const waitSeconds = Math.ceil((15000 - elapsed) / 1000);
      return {
        success: false,
        message: `يرجى الانتظار ${waitSeconds} ثوانٍ قبل إرسال تقييم أو تعليق آخر منعاً للرسائل المكررة.`,
        error: 'RATE_LIMIT_EXCEEDED',
      };
    }
  }

  // 2. Validate and sanitize text
  const cleanedText = sanitizeCommentText(input.comment_text);
  if (!cleanedText || cleanedText.length < 5) {
    return {
      success: false,
      message: 'نص التعليق قصير جداً. يرجى كتابة ملاحظة من ٥ أحرف على الأقل لمساعدة أولياء الأمور.',
      error: 'TEXT_TOO_SHORT',
    };
  }
  if (cleanedText.length > 500) {
    return {
      success: false,
      message: 'تجاوز التعليق الحد الأقصى المسموح به (٥٠٠ حرف). يرجى اختصار الملاحظة.',
      error: 'TEXT_TOO_LONG',
    };
  }

  // 3. Child safety check for contact info
  if (containsSensitiveContactInfo(cleanedText)) {
    return {
      success: false,
      message: 'حفاظاً على خصوصية وسلامة الأطفال والأسرة، يرجى عدم تضمين أرقام هواتف أو عناوين بريد إلكتروني داخل التعليق.',
      error: 'SENSITIVE_INFO_DETECTED',
    };
  }

  // 4. Validate rating
  let validatedRating: number | null = null;
  if (input.rating !== undefined && input.rating !== null) {
    const num = Number(input.rating);
    if (num >= 1 && num <= 5) {
      validatedRating = Math.round(num);
    }
  }

  // 5. Sanitize author name
  const authorClean = sanitizeCommentText(input.author_name || '').slice(0, 40) || 'ولي أمر';

  const newReview: ContentReview = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    content_id: input.content_id,
    content_type: input.content_type,
    content_title: input.content_title || 'محتوى تعليمي',
    author_name: authorClean,
    comment_text: cleanedText,
    rating: validatedRating,
    status: 'pending', // Strictly pending!
    is_flagged: false,
    flag_count: 0,
    created_at: new Date().toISOString(),
  };

  // Try Supabase insert
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('content_reviews')
        .insert({
          content_id: newReview.content_id,
          content_type: newReview.content_type,
          content_title: newReview.content_title,
          author_name: newReview.author_name,
          comment_text: newReview.comment_text,
          rating: newReview.rating,
          status: 'pending',
          is_flagged: false,
          flag_count: 0,
        })
        .select()
        .single();

      if (!error && data) {
        safeStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
        return {
          success: true,
          review: data as ContentReview,
          message: 'شكراً لك! تم استلام تقييمك وملاحظتك بنجاح، وستظهر للجميع بعد اعتماد المشرف التربوي لضمان بيئة آمنة للأطفال.',
        };
      }
      console.warn('فشل الإدراج في Supabase، الحفظ محلياً:', error?.message);
    } catch (err) {
      console.warn('استثناء Supabase أثناء الإدراج:', err);
    }
  }

  // Local storage save
  const current = getLocalReviews();
  const updated = [newReview, ...current];
  saveLocalReviews(updated);
  safeStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());

  return {
    success: true,
    review: newReview,
    message: 'شكراً لك! تم استلام تقييمك وملاحظتك بنجاح، وستظهر للجميع بعد مراجعة المشرف لضمان سلامة المحتوى.',
  };
}

/**
 * Report/Flag an inappropriate comment
 */
export async function flagReview(reviewId: string, reason?: string): Promise<{ success: boolean; message: string }> {
  const sanitizedReason = sanitizeCommentText(reason || 'ملاحظة غير لائقة للأطفال');

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.rpc('flag_content_review', {
        review_id: reviewId,
        reason: sanitizedReason,
      });
      if (!error) {
        return { success: true, message: 'تم إرسال البلاغ بنجاح للإشراف. شكراً لحرصك على أمان بيئة الأطفال.' };
      }
    } catch (err) {
      console.warn('فشل استدعاء flag_content_review على Supabase:', err);
    }
  }

  // Local storage fallback
  const reviews = getLocalReviews();
  const target = reviews.find((r) => r.id === reviewId);
  if (target) {
    target.is_flagged = true;
    target.flag_count = (target.flag_count || 0) + 1;
    target.flag_reason = sanitizedReason;
    saveLocalReviews(reviews);
  }

  return { success: true, message: 'تم إرسال البلاغ بنجاح للإشراف التربوي. شكراً لاهتمامك بسلامة المحتوى.' };
}

/**
 * Fetches latest approved reviews across all content (for modest home page showcase)
 */
export async function getLatestApprovedReviews(limit: number = 3): Promise<ContentReview[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('content_reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data as ContentReview[];
      }
    } catch (err) {
      // ignore and fallback
    }
  }

  const all = getLocalReviews();
  return all
    .filter((r) => r.status === 'approved')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

// ----------------------------------------------------------------------------
// Admin Management API Functions
// ----------------------------------------------------------------------------

/**
 * Fetches all reviews for the Admin Portal with optional status and content-type filtering
 */
export async function getAllReviewsForAdmin(
  statusFilter: 'all' | ReviewModerationStatus | 'flagged' = 'all',
  typeFilter: 'all' | ContentReviewType = 'all'
): Promise<ContentReview[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('content_reviews').select('*').order('created_at', { ascending: false });

      if (statusFilter === 'flagged') {
        query = query.eq('is_flagged', true);
      } else if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('content_type', typeFilter);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as ContentReview[];
      }
      console.warn('تعذر جلب تعليقات الأدمن من Supabase:', error?.message);
    } catch (err) {
      console.warn('خطأ في جلب تعليقات الأدمن:', err);
    }
  }

  // Fallback to local storage
  let items = getLocalReviews();

  if (statusFilter === 'flagged') {
    items = items.filter((r) => r.is_flagged);
  } else if (statusFilter !== 'all') {
    items = items.filter((r) => r.status === statusFilter);
  }

  if (typeFilter !== 'all') {
    items = items.filter((r) => r.content_type === typeFilter);
  }

  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Updates a review's moderation status (approve, reject, spam)
 */
export async function updateReviewStatus(
  reviewId: string,
  newStatus: ReviewModerationStatus
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('content_reviews')
        .update({
          status: newStatus,
          is_flagged: newStatus === 'approved' ? false : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (!error) {
        return { success: true };
      }
      console.warn('تعذر تحديث حالة التعليق في Supabase:', error.message);
    } catch (err: any) {
      console.warn('استثناء أثناء تحديث حالة التعليق:', err);
    }
  }

  // Fallback update in local storage
  const reviews = getLocalReviews();
  const index = reviews.findIndex((r) => r.id === reviewId);
  if (index !== -1) {
    reviews[index].status = newStatus;
    if (newStatus === 'approved') {
      reviews[index].is_flagged = false;
    }
    reviews[index].updated_at = new Date().toISOString();
    saveLocalReviews(reviews);
    return { success: true };
  }

  return { success: false, error: 'لم يتم العثور على التعليق المطلوب.' };
}

/**
 * Deletes a review permanently (admin only)
 */
export async function deleteReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('content_reviews').delete().eq('id', reviewId);
      if (!error) {
        return { success: true };
      }
      console.warn('تعذر حذف التعليق في Supabase:', error.message);
    } catch (err: any) {
      console.warn('استثناء أثناء حذف التعليق:', err);
    }
  }

  // Fallback local deletion
  const reviews = getLocalReviews();
  const updated = reviews.filter((r) => r.id !== reviewId);
  saveLocalReviews(updated);
  return { success: true };
}
