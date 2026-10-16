import React, { useState } from 'react';
import { Shield, Mail, CheckCircle, AlertTriangle, ArrowRight, FileText } from 'lucide-react';
import { sounds } from '../lib/audio';
import { submitContactReport } from '../lib/storage';

export const AboutPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs space-y-6">
    <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-800">
      <ArrowRight className="w-4 h-4" /> العودة للرئيسية
    </button>
    <h1 className="text-3xl font-black text-amber-950">من نحن — رؤية «عالم الصغار»</h1>
    <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
      <p>
        «عالم الصغار — Little Stars» هي مبادرة تعليمية وترفيهية عربية موجهة للأطفال في مرحلة ما قبل المدرسة والطفولة المبكرة (من سن سنتين وحتى 6 سنوات).
      </p>
      <p>
        نشأت المنصة استجابةً لحاجة الأسر العربية إلى بيئة رقمية هادئة وخالية تماماً من فوضى الإعلانات التجارية والمقاطع السريعة الخاطفة التي قد تؤثر سلباً على انتباه الطفل في سنواته التأسيسية.
      </p>
      <h2 className="text-xl font-bold text-slate-900 pt-2">أركان منهجيتنا التربوية:</h2>
      <ul className="list-disc list-inside space-y-2 pr-2 text-slate-600">
        <li><strong>اللغة العربية الفصيحة المبسطة:</strong> تقديم الحروف والأصوات بنطق سليم ونغمات هادئة.</li>
        <li><strong>التصميم الحسي الهادئ:</strong> ألوان باستيل مريحة للعين، وحركات مدروسة تراعي التنسيق العصبي الحركي.</li>
        <li><strong>الاحترام الكامل للخصوصية:</strong> عدم جمع أي بيانات تعريفية عن الطفل أو استخدام تتبع تجاري.</li>
        <li><strong>الشراكة الأسرية:</strong> تشجيع مشاركة الوالدين في اللعب بدلاً من ترك الطفل بمفرده أمام الشاشات.</li>
      </ul>
    </div>
  </div>
);

export const PrivacyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs space-y-6">
    <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-800">
      <ArrowRight className="w-4 h-4" /> العودة للرئيسية
    </button>
    <div className="flex items-center gap-3">
      <Shield className="w-8 h-8 text-emerald-600" />
      <h1 className="text-3xl font-black text-amber-950">سياسة الخصوصية وحماية الطفل</h1>
    </div>
    <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
        نلتزم التزاماً كاملاً بقانون حماية خصوصية الأطفال على الإنترنت (COPPA) واللوائح العامة لحماية البيانات (GDPR-K).
      </div>
      <h2 className="text-lg font-bold text-slate-900">1. عدم جمع أي بيانات تخص الأطفال</h2>
      <p>
        لا تتطلب تجربة الطفل أي تسجيل حساب، ولا نطلب أسماء الصغار أو تواريخ ميلادهم أو موقعهم الجغرافي.
      </p>
      <h2 className="text-lg font-bold text-slate-900">2. التخزين المحلي فقط للتفضيلات</h2>
      <p>
        يتم تخزين الأنشطة المفضلة وسجل اللعب الأخير على ذاكرة متصفح جهاز المستخدم فقط (localStorage) لتسهيل العودة إليها، ولا يتم إرسال هذه البيانات إلى أي خوادم إعلانية أو جهات خارجية.
      </p>
      <h2 className="text-lg font-bold text-slate-900">3. انعدام الإعلانات والروابط المضللة</h2>
      <p>
        تخلو المنصة تماماً من لافتات الإعلانات التجارية (Ad banners)، ونوافذ الشراء داخل التطبيق، أو الروابط الموجهة لشبكات التواصل الاجتماعي. كما تحمي «بوابة أولياء الأمور» أي خروج خارجي نحو روابط الشركاء المعتمدين.
      </p>
    </div>
  </div>
);

export const TermsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs space-y-6">
    <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-800">
      <ArrowRight className="w-4 h-4" /> العودة للرئيسية
    </button>
    <h1 className="text-3xl font-black text-amber-950">شروط الاستخدام والترخيص</h1>
    <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
      <p>
        مرحباً بكم في «عالم الصغار». يمثل استخدامكم لهذا الموقع موافقتكم على الشروط التالية:
      </p>
      <h2 className="text-lg font-bold text-slate-900">الترخيص والاستخدام المصرح:</h2>
      <p>
        يُسمح بالاستخدام الشخصي والتعليمي والمنزلي، وكذلك استخدام أوراق العمل داخل الفصول الدراسية في مرحلة رياض الأطفال دون أي رسوم مالية.
      </p>
      <h2 className="text-lg font-bold text-slate-900">المحتوى الخارجي والشركاء:</h2>
      <p>
        كافة الروابط المؤدية إلى شركاء خارجيين موثوقين (مثل Khan Academy Kids، PBS KIDS) تخضع لحقوق الملكية الفكرية لتلك المؤسسات، ويتم عرضها بصفتها موارد تعليمية عامة ومجانية وفق رخصها الرسمية.
      </p>
    </div>
  </div>
);

export const ContactReportPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [reportType, setReportType] = useState<'broken_link' | 'safety_concern' | 'content_suggestion' | 'feedback'>('feedback');
  const [parentName, setParentName] = useState<string>('');
  const [parentEmail, setParentEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [botHoneypot, setBotHoneypot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Anti-bot honeypot check: Bots fill hidden inputs
    if (botHoneypot.trim() !== '') {
      // Silently act as submitted to deflect automated bots
      setSubmitted(true);
      return;
    }

    const trimmedMsg = message.trim();
    if (trimmedMsg.length < 5) {
      setErrorMessage('يرجى كتابة رسالة واضحة لا تقل عن 5 أحرف.');
      sounds.playTryAgain();
      return;
    }

    if (trimmedMsg.length > 2000) {
      setErrorMessage('الرسالة طويلة جداً. الحد الأقصى المسموح به هو 2000 حرف.');
      sounds.playTryAgain();
      return;
    }

    setIsSubmitting(true);
    try {
      sounds.playPop();
      await submitContactReport({
        type: reportType,
        parent_name: parentName.trim().slice(0, 100),
        parent_email: parentEmail.trim().slice(0, 120),
        message: trimmedMsg,
      });
      setSubmitted(true);
      sounds.playChime();
    } catch (err: any) {
      sounds.playTryAgain();
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال الملاحظة. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-800">
        <ArrowRight className="w-4 h-4" /> العودة للرئيسية
      </button>

      <div>
        <h1 className="text-3xl font-black text-amber-950 mb-1">الإبلاغ عن مشكلة أو إرسال اقتراح 📬</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          نرحب دائماً بملاحظات أولياء الأمور والمعلمين لتحسين تجربة الصغار وضمان أعلى معايير الأمان.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Honeypot field for bot protection (hidden from real users) */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="website_hp">يرجى ترك هذا الحقل فارغاً</label>
            <input
              id="website_hp"
              type="text"
              name="website_hp"
              tabIndex={-1}
              autoComplete="off"
              value={botHoneypot}
              onChange={(e) => setBotHoneypot(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">نوع الملاحظة:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
            >
              <option value="feedback">رأي عام أو اقتراح نشاط جديد</option>
              <option value="broken_link">إبلاغ عن رابط لا يعمل</option>
              <option value="safety_concern">ملاحظة أمان أو محتوى غير ملائم</option>
              <option value="content_suggestion">اقتراح تعديل على محتوى أو نطق</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم ولي الأمر (اختياري):</label>
              <input
                type="text"
                maxLength={100}
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="مثال: أم عبد الله"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني للرد (اختياري):</label>
              <input
                type="email"
                maxLength={120}
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">تفاصيل الرسالة أو المشكلة: *</label>
              <span className={`text-[11px] font-mono ${message.length > 2000 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                {message.length} / 2000
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب ملاحظتك هنا (بين 5 و 2000 حرف) وسيقوم المشرف بمراجعتها والرد عليك..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || message.trim().length < 5}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-2xl text-sm transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال الملاحظة للمشرف'}
          </button>
        </form>
      ) : (
        <div className="text-center py-10 bg-emerald-50 rounded-2xl p-6">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-emerald-950 mb-1">شكراً لاهتمامك وملاحظتك!</h3>
          <p className="text-xs text-emerald-800 mb-4">
            تم استلام تقريرك وسيطلع عليه مشرف المحتوى عبر البوابة الإدارية فوراً.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setMessage('');
              setErrorMessage('');
            }}
            className="text-xs font-bold text-emerald-900 underline cursor-pointer"
          >
            إرسال ملاحظة أخرى
          </button>
        </div>
      )}
    </div>
  );
};
