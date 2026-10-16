import { ContentReview } from '../types/database';
import { supabase, isSupabaseConfigured } from './supabase';
import { safeStorage } from './storage';
import { sanitizeCommentText, containsSensitiveContactInfo } from './comments';

const SITE_RATINGS_STORAGE_KEY = 'little_stars_site_overall_ratings_v1';
const MY_SITE_RATING_KEY = 'little_stars_my_site_rating_v1';
const RATE_LIMIT_KEY = 'little_stars_site_rating_rate_limit';

export interface SiteRatingEntry {
  id: string;
  rating: number; // 1 to 5
  comment?: string;
  author_name?: string;
  created_at: string;
}

export interface SiteRatingSummary {
  averageRating: number | null;
  totalRatings: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  userRating: number | null;
  userComment?: string;
}

/**
 * Get user's own previously submitted rating if any
 */
export function getUserSiteRating(): { rating: number; comment?: string } | null {
  try {
    const raw = safeStorage.getItem(MY_SITE_RATING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.rating === 'number') {
      return { rating: parsed.rating, comment: parsed.comment || '' };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Read all stored site ratings locally
 */
function getLocalSiteRatings(): SiteRatingEntry[] {
  try {
    const raw = safeStorage.getItem(SITE_RATINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Save site ratings locally
 */
function saveLocalSiteRatings(list: SiteRatingEntry[]): void {
  try {
    safeStorage.setItem(SITE_RATINGS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save site ratings locally:', err);
  }
}

/**
 * Fetch aggregate site ratings summary
 */
export async function getSiteRatingSummary(): Promise<SiteRatingSummary> {
  const userExisting = getUserSiteRating();
  let entries: SiteRatingEntry[] = [];

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('content_reviews')
        .select('*')
        .eq('content_type', 'website')
        .eq('content_id', 'site-overall');

      if (!error && Array.isArray(data) && data.length > 0) {
        entries = data.map((d: ContentReview) => ({
          id: d.id,
          rating: d.rating || 5,
          comment: d.comment_text,
          author_name: d.author_name,
          created_at: d.created_at,
        }));
      } else {
        entries = getLocalSiteRatings();
      }
    } catch {
      entries = getLocalSiteRatings();
    }
  } else {
    entries = getLocalSiteRatings();
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  let count = 0;

  for (const item of entries) {
    const star = Math.min(5, Math.max(1, Math.round(item.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[star] = (distribution[star] || 0) + 1;
    sum += star;
    count++;
  }

  const averageRating = count > 0 ? Number((sum / count).toFixed(1)) : null;

  return {
    averageRating,
    totalRatings: count,
    distribution,
    userRating: userExisting ? userExisting.rating : null,
    userComment: userExisting ? userExisting.comment : undefined,
  };
}

/**
 * Submit or update website rating
 */
export async function submitSiteRating(input: {
  rating: number;
  comment?: string;
  nickname?: string;
}): Promise<{
  success: boolean;
  message: string;
  averageRating?: number | null;
  totalRatings?: number;
}> {
  const ratingNum = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 5)));

  // Rate-limiting: prevent spam clicks within 3 seconds
  const lastSubmitTime = safeStorage.getItem(RATE_LIMIT_KEY);
  if (lastSubmitTime && Date.now() - Number(lastSubmitTime) < 3000) {
    return {
      success: false,
      message: 'تم تسجيل تقييمك للتو! شكراً لك.',
    };
  }

  const rawComment = (input.comment || '').trim();
  const cleanedComment = rawComment ? sanitizeCommentText(rawComment) : '';

  // COPPA safety check on optional comment
  if (cleanedComment && containsSensitiveContactInfo(cleanedComment)) {
    return {
      success: false,
      message: 'حفاظاً على خصوصية وسلامة أطفالنا، يرجى عدم كتابة أرقام هواتف أو بريد إلكتروني داخل التقييم.',
    };
  }

  const cleanedNickname = sanitizeCommentText(input.nickname || '').slice(0, 30) || 'ولي أمر';

  const entry: SiteRatingEntry = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `site-rate-${Date.now()}`,
    rating: ratingNum,
    comment: cleanedComment,
    author_name: cleanedNickname,
    created_at: new Date().toISOString(),
  };

  // Save to user's local state
  safeStorage.setItem(
    MY_SITE_RATING_KEY,
    JSON.stringify({ rating: ratingNum, comment: cleanedComment, timestamp: Date.now() })
  );
  safeStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());

  // Update local ratings list
  const currentLocal = getLocalSiteRatings();
  const updatedLocal = [entry, ...currentLocal];
  saveLocalSiteRatings(updatedLocal);

  // Also push to main content reviews local store for Admin Portal moderation visibility
  try {
    const mainReviewsRaw = safeStorage.getItem('little_stars_content_reviews_v3');
    const mainReviews: ContentReview[] = mainReviewsRaw ? JSON.parse(mainReviewsRaw) : [];
    const mainReviewItem: ContentReview = {
      id: entry.id,
      content_id: 'site-overall',
      content_type: 'website',
      content_title: 'تقييم موقع عالم الصغار',
      author_name: cleanedNickname,
      comment_text: cleanedComment || `تقييم الموقع: ${ratingNum} من 5 نجوم`,
      rating: ratingNum,
      status: cleanedComment ? 'pending' : 'approved',
      is_flagged: false,
      flag_count: 0,
      created_at: entry.created_at,
    };
    safeStorage.setItem('little_stars_content_reviews_v3', JSON.stringify([mainReviewItem, ...mainReviews]));
  } catch (e) {
    // ignore
  }

  // Try sync with Supabase if available
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('content_reviews').insert({
        content_id: 'site-overall',
        content_type: 'website',
        content_title: 'تقييم موقع عالم الصغار',
        author_name: cleanedNickname,
        comment_text: cleanedComment || `تقييم عام للموقع: ${ratingNum} من 5 نجوم`,
        rating: ratingNum,
        status: cleanedComment ? 'pending' : 'approved',
        is_flagged: false,
        flag_count: 0,
      });
    } catch (err) {
      console.warn('Could not sync site rating to Supabase:', err);
    }
  }

  // Calculate updated summary
  const summary = await getSiteRatingSummary();

  const labels: Record<number, string> = {
    5: 'ممتاز ويفوق التوقعات 🌟',
    4: 'رائع ومفيد جداً 👍',
    3: 'جيد وبداية طيبة 👌',
    2: 'مقبول ويحتاج تطوير',
    1: 'يحتاج تحسينات ملحوظة',
  };

  return {
    success: true,
    message: `شكراً جزيلاً لتقييمك لموقع عالم الصغار (${labels[ratingNum]})! دعمك يُسعدنا ويساعدنا على تطوير المنصة.`,
    averageRating: summary.averageRating,
    totalRatings: summary.totalRatings,
  };
}
