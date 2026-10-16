import React from 'react';
import { Shield, Clock, Heart, BookOpen, Printer, Sparkles, CheckCircle2 } from 'lucide-react';

interface ParentCornerPageProps {
  onNavigate: (view: string) => void;
}

export const ParentCornerPage: React.FC<ParentCornerPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>دليل الوالدين والمربين المعتمد</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-amber-950 leading-tight">
            ركن الوالدين — رعاية الطفولة المبكرة بوعي ومحبة 👨‍👩‍👧
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            نهدف في منصة «عالم الصغار» إلى تمكين الأسرة من تقديم تجارب رقمية هادفة ومتوازنة. لا تضمن الألعاب التطور النمائي بمفردها، بل يعتبر التفاعل الأسري المشترك هو الحجر الأساس في كل خطوة.
          </p>
        </div>

        <div className="md:col-span-4 flex justify-center">
          <div className="w-full max-w-xs aspect-4/3 rounded-2xl overflow-hidden shadow-md border-2 border-white">
            <img
              src="/src/assets/images/parent_corner_guide_1791871144873.jpg"
              alt="تفاعل أسري دافئ"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Screen Time Guidelines */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              إرشادات وقت الشاشة (توصيات منظمة الصحة العالمية والأكاديمية الأمريكية لطب الأطفال)
            </h2>
            <p className="text-xs text-slate-500">مبادئ توجيهية لصحة بصرية ونفسية سليمة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
            <h3 className="font-black text-amber-900 text-base">الأطفال من 2 إلى 3 سنوات</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              يُنصح بألا يتجاوز وقت الشاشة 20–30 دقيقة يومياً كحد أقصى، مع وجود أحد الوالدين دوماً للمساعدة في تسمية الأشياء والتفاعل اللفظي.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-2">
            <h3 className="font-black text-emerald-900 text-base">الأطفال من 3 إلى 5 سنوات</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ساعة واحدة يومياً مقسمة على فترات قصيرة (15–20 دقيقة لكل جلسة)، مع إعطاء الأولوية للأنشطة الحركية واللعب بالصلصال والرسم اليدوي.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200/60 space-y-2">
            <h3 className="font-black text-sky-900 text-base">الأطفال بعمر 6 سنوات</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              وضع حدود متفق عليها لوقت الشاشات، وإبعاد الأجهزة عن غرف النوم وموائد الطعام، والامتناع التام عن الشاشات قبل موعد النوم بساعة كاملة.
            </p>
          </div>
        </div>
      </section>

      {/* Age Group Milestones & Recommendations */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          دليل المراحل العمرية واقتراحات الأنشطة
        </h2>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">مرحلة 2–3 سنوات (الاستكشاف الحسي واللغوي الأولي)</h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-xl">الحواس والألوان</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              يركز الطفل في هذه المرحلة على استكشاف الأصوات وتسمية الحيوانات والألوان الأساسية (أحمر، أزرق، أصفر). الأنشطة المقترحة: «استكشاف الألوان»، «أصوات الحيوانات»، و«مطابقة الأشكال البسيطة».
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">مرحلة 3–4 سنوات (التصنيف والأرقام الأولية)</h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl">التصنيف والعد</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              يبدأ الطفل في فرز العناصر حسب الفئات (فواكه وخضار، كبير وصغير)، وعد الأشياء حتى 5. الأنشطة المقترحة: «عد النجوم حتى 5»، «فرز الفواكه والخضار»، و«ألغاز التركيب الخفيفة».
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">مرحلة 4–5 سنوات (الوعي الصوتي والحروف العربية)</h3>
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-xl">الهجاء والذاكرة</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              يتعرف الطفل على شكل وصوت الحرف العربي، والربط بالكلمة، وقوة الذاكرة البصرية. الأنشطة المقترحة: «حروف الهجاء العجيبة»، «بطاقات الذاكرة المرحة»، و«قصة الأرنب التفاعلية».
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">مرحلة 5–6 سنوات (التهيئة للكتابة والمدرسة)</h3>
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-xl">ما قبل المدرسة</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              تنمية العضلات الدقيقة للأصابع لتتبع مسارات الحروف والأرقام، وتأسيس العمليات الحسابية البسيطة. الأنشطة المقترحة: «تتبع الحروف»، «استوديو التلوين المبهج»، و«أوراق العمل المطبوعة».
            </p>
          </div>
        </div>
      </section>

      {/* Child Privacy & Safety Pledge */}
      <section className="bg-amber-100/50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-600" />
          <h2 className="text-xl sm:text-2xl font-black text-amber-950">
            ميثاق حماية الطفل وخصوصية البيانات
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          نلتزم التزاماً صارماً بعدم طلب أي بيانات شخصية تخص طفلك: لا توجد نماذج تسجيل للأطفال، ولا نطلب أسماءهم، ولا نجمع عناوين بريد إلكتروني للصغار، ولا نستخدم أي ملفات تتبع إعلانية، ولا توجد روابط تواصل اجتماعي أو محادثات عامة. بيئة آمنة وهادئة بنسبة 100%.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('printables')}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>الانتقال إلى أوراق العمل القابلة للطباعة</span>
          </button>
        </div>
      </section>
    </div>
  );
};
