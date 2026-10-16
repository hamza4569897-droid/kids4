export type LaunchType = 'builtin' | 'external_tab' | 'iframe_sandboxed';
export type ContentType = 'game' | 'story' | 'worksheet' | 'song' | 'activity' | 'external_app';
export type SourceType = 'original' | 'rss_feed' | 'api' | 'manual_review' | 'partner_dataset';
export type LicensingStatus = 'original_authored' | 'verified_open_license' | 'official_partner' | 'public_domain' | 'pending_verification';
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface Category {
  id: string;
  slug: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  icon: string;
  color: string;
  display_order: number;
  created_at?: string;
}

export interface EducationalResource {
  id: string;
  title_ar: string;
  title_en?: string;
  slug: string;
  description_ar: string;
  description_en?: string;
  age_min: number; // e.g., 2
  age_max: number; // e.g., 6
  category_id: string;
  additional_categories?: string[];
  content_type: ContentType;
  launch_type: LaunchType;
  launch_url?: string;
  thumbnail_url?: string;
  provider_name: string;
  source_url?: string;
  source_type: SourceType;
  language: 'ar' | 'en' | 'bilingual';
  is_free: boolean;
  learning_objectives: string[];
  estimated_duration_minutes: number;
  accessibility_notes: string[];
  licensing_status: LicensingStatus;
  review_status: ReviewStatus;
  safety_reviewed_at?: string;
  is_featured: boolean;
  published_at?: string;
  supported_platforms?: ('web' | 'android' | 'ios')[];
  last_verified_at?: string;
  age_evidence_source?: string;
  age_evidence_date?: string;
  privacy_policy_url?: string;
  has_in_app_ads?: boolean;
  has_in_app_purchases?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrustedSource {
  id: string;
  name: string;
  slug: string;
  base_url: string;
  feed_or_api_url?: string;
  source_type: 'api' | 'rss' | 'dataset' | 'curated_index';
  is_active: boolean;
  requires_parent_gate: boolean;
  allowed_domains: string[];
  licensing_terms_summary: string;
  api_documentation_url?: string;
  update_frequency?: 'realtime' | 'daily' | 'weekly' | 'manual';
  verification_status?: 'verified' | 'pending' | 'flagged';
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ImportCandidate {
  id: string;
  source_id: string;
  external_id?: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  candidate_url: string;
  thumbnail_url?: string;
  provider_name: string;
  suggested_age_min: number;
  suggested_age_max: number;
  suggested_category_id?: string;
  suggested_additional_categories?: string[];
  supported_platforms?: ('web' | 'android' | 'ios')[];
  licensing_evidence: string;
  age_evidence?: string;
  safety_flags: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  existing_resource_id?: string;
  changes_diff?: Record<string, { before: any; after: any }>;
  discovered_at: string;
  reviewed_at?: string;
}

export interface SyncRun {
  id: string;
  source_id: string;
  started_at: string;
  completed_at?: string;
  status: 'running' | 'success' | 'failed';
  items_found: number;
  items_imported: number;
  items_flagged: number;
  error_message?: string;
}

export interface AdminAuditLog {
  id: string;
  admin_email: string;
  action: string;
  target_table: string;
  target_id?: string;
  details: Record<string, any>;
  created_at: string;
}

export interface ContactReport {
  id: string;
  type: 'broken_link' | 'safety_concern' | 'content_suggestion' | 'feedback';
  resource_id?: string;
  resource_title?: string;
  parent_name?: string;
  parent_email?: string;
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  created_at: string;
}

export interface ChildActivitySession {
  resourceId: string;
  playedAt: string;
  starsEarned?: number;
}

// ----------------------------------------------------------------------------
// Content Gap Analyzer Data Structures
// ----------------------------------------------------------------------------
export interface GapMatrixEntry {
  ageBracketId: '2-3' | '3-4' | '4-5' | '5-6';
  ageBracketLabel: string;
  categoryId: string;
  categoryTitleAr: string;
  currentCount: number;
  targetThreshold: number;
  deficit: number;
  status: 'empty' | 'low' | 'sufficient';
  recommendedSourceIds: string[];
  sampleResourceTitles?: string[];
}

export interface ContentGapReport {
  timestamp: string;
  targetThreshold: number;
  totalCombinations: number;
  emptyCombinations: number;
  lowCombinations: number;
  sufficientCombinations: number;
  overallDeficit: number;
  matrix: GapMatrixEntry[];
  topDeficientCategories: { categoryId: string; titleAr: string; totalDeficit: number; currentCount: number }[];
  topDeficientBrackets: { bracketId: string; label: string; totalDeficit: number; currentCount: number }[];
}

export interface GapFillResult {
  startedAt: string;
  completedAt: string;
  targetThreshold: number;
  triggeredSources: string[];
  itemsFound: number;
  itemsNew: number;
  itemsUpdated: number;
  itemsImported: number;
  itemsDuplicatesIgnored: number;
  itemsFlagged: number;
  improvedGapsCount: number;
  improvedCombinations: {
    ageBracketId: string;
    categoryId: string;
    categoryTitleAr: string;
    beforeCount: number;
    afterCount: number;
  }[];
  remainingDeficiencies: {
    ageBracketId: string;
    categoryId: string;
    categoryTitleAr: string;
    currentCount: number;
    targetCount: number;
    reason: string;
  }[];
  beforeSummary: { empty: number; low: number; sufficient: number };
  afterSummary: { empty: number; low: number; sufficient: number };
}

// ----------------------------------------------------------------------------
// Content Reviews and Ratings Types
// ----------------------------------------------------------------------------
export type ContentReviewType = 'activity' | 'worksheet' | 'app' | 'plan' | 'general' | 'website';
export type ReviewModerationStatus = 'pending' | 'approved' | 'rejected' | 'spam';

export interface ContentReview {
  id: string;
  content_id: string;
  content_type: ContentReviewType;
  content_title: string;
  author_name: string;
  comment_text: string;
  rating?: number | null; // 1 to 5
  status: ReviewModerationStatus;
  is_flagged: boolean;
  flag_count: number;
  flag_reason?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface SubmitReviewInput {
  content_id: string;
  content_type: ContentReviewType;
  content_title: string;
  author_name?: string;
  comment_text: string;
  rating?: number | null;
}

export interface ReviewStats {
  averageRating: number | null;
  totalReviews: number;
  totalRatingsCount: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

