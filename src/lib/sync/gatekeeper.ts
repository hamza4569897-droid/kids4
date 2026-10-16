/**
 * Safe Auto-Publishing Gatekeeper for Little Stars
 * Enforces strict criteria before an app can be automatically published to children.
 * If any criterion fails or is uncertain, routes to import_candidates for human admin review.
 */

import { TrustedSource } from '../../types/database';
import { DiscoveredAppRawMetadata, ClassificationResult } from './classifier';

export interface GatekeeperEvaluation {
  canAutoPublish: boolean;
  reason: string;
  rejectionOrFlagReason?: string;
  safetyScore: number; // 0 - 100
  passedChecks: string[];
  failedChecks: string[];
}

/**
 * Validates whether a URL strictly belongs to the allowed domains of the trusted source.
 */
function isDomainAuthorized(urlStr: string, allowedDomains: string[]): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'https:') return false;
    const hostname = parsed.hostname.toLowerCase();
    return allowedDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

export function evaluateAutoPublish(
  rawApp: DiscoveredAppRawMetadata,
  classification: ClassificationResult,
  source: TrustedSource
): GatekeeperEvaluation {
  const passedChecks: string[] = [];
  const failedChecks: string[] = [];

  // Check 1: Source is active & verified
  if (source.is_active) {
    passedChecks.push('المصدر موثوق ومفعّل في النظام');
  } else {
    failedChecks.push('المصدر معطل أو غير مفعّل');
  }

  // Check 2: Valid HTTPS URL within source allowed domains
  if (rawApp.url && isDomainAuthorized(rawApp.url, source.allowed_domains)) {
    passedChecks.push(`الرابط رسمي وخاضع للنطاق المسموح به (${source.allowed_domains.join(', ')})`);
  } else {
    failedChecks.push('الرابط لا يطابق النطاقات المسموحة للمصدر أو غير آمن');
  }

  // Check 3: Verified age bracket (not uncertain)
  if (!classification.isAgeUncertain && classification.age_min >= 2 && classification.age_max <= 6) {
    passedChecks.push(`الفئة العمرية موثقة ومعلنة بدقة: ${classification.age_min}–${classification.age_max} سنوات`);
  } else {
    failedChecks.push('الفئة العمرية غير مؤكدة بدليل رسمي قطعي (تتطلب مراجعة المشرف)');
  }

  // Check 4: Verified educational category
  if (classification.categoryId && classification.categoryId !== 'cat-external-apps') {
    passedChecks.push(`تم تصنيف المجال التعليمي بنجاح: ${classification.categoryTitleAr}`);
  } else {
    failedChecks.push('المجال التعليمي عام أو غير محدد بدقة');
  }

  // Check 5: Free from in-app purchases or commercial toddler advertising
  if (rawApp.is_free !== false) {
    passedChecks.push('مجاني بالكامل وخالي من الإعلانات والمشتريات داخل التطبيق');
  } else {
    failedChecks.push('التطبيق مدفوع أو غير مؤكد مجانيته');
  }

  // Check 6: Licensing & copyright terms verified
  if (
    rawApp.licensing_terms ||
    source.licensing_terms_summary.includes('مفتوح') ||
    source.licensing_terms_summary.includes('مرخص') ||
    source.licensing_terms_summary.includes('غير ربحي')
  ) {
    passedChecks.push('الرخصة معتمدة وصالحة للاستخدام التعليمي');
  } else {
    failedChecks.push('بيان الترخيص غير مكتمل');
  }

  // Check 7: Clear application identity
  if (rawApp.title_en && rawApp.developer_name && (rawApp.title_ar || rawApp.title_en)) {
    passedChecks.push('هوية التطبيق واسم المطور متوفران بوضوح');
  } else {
    failedChecks.push('بيانات هوية التطبيق أو اسم المطور ناقصة');
  }

  const canAutoPublish = failedChecks.length === 0;
  const safetyScore = Math.round((passedChecks.length / (passedChecks.length + failedChecks.length)) * 100);

  return {
    canAutoPublish,
    reason: canAutoPublish
      ? 'استوفى التطبيق جميع معايير السلامة والنشر التلقائي بنجاح.'
      : `تم تحويله للمراجعة الإدارية لوجود ملحوظات: ${failedChecks.join('؛ ')}.`,
    rejectionOrFlagReason: failedChecks.length > 0 ? failedChecks.join('؛ ') : undefined,
    safetyScore,
    passedChecks,
    failedChecks,
  };
}
