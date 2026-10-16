import React from 'react';
import { Shield, Heart, FileCheck } from 'lucide-react';
import { SiteRatingWidget } from './SiteRatingWidget';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-amber-100/40 border-t border-amber-200/80 mt-16 pt-12 pb-10 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Interactive Website Star Rating Box */}
        <div className="mb-12">
          <SiteRatingWidget />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-black text-amber-950">عالم الصغار — Little Stars</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mb-4">
              بيئة تعليمية وترفيهية مبكرة ومجانية للأطفال من عمر 2 إلى 6 سنوات، مصممة بحب ورعاية لدعم الفضول الفطري، واللغة العربية السليمة، والمهارات المعرفية دون إعلانات تجارية أو تتبع لسلوك الأطفال.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-200/50 px-3 py-1.5 rounded-xl w-fit">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>مساحة آمنة 100% متوافقة مع معايير خصوصية الطفل (COPPA)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-slate-900 mb-3">أقسام المنصة</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <button onClick={() => onNavigate('activities_hub')} className="hover:text-amber-800 transition font-bold text-amber-800">
                  مركز الأنشطة التعليمية 🌟
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-amber-800 transition">
                  جميع الأنشطة والألعاب
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('parents')} className="hover:text-amber-800 transition">
                  دليل أولياء الأمور والتربية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('printables')} className="hover:text-amber-800 transition">
                  أوراق عمل قابلة للطباعة
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('favorites')} className="hover:text-amber-800 transition">
                  الأنشطة المفضلة المحفوظة
                </button>
              </li>
            </ul>
          </div>

          {/* Trust, Safety & Legal */}
          <div>
            <h4 className="text-sm font-black text-slate-900 mb-3">الأمان والشفافية</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-amber-800 transition">
                  سياسة الخصوصية للأطفال
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-amber-800 transition">
                  شروط الاستخدام والترخيص
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-800 transition">
                  منهجيتنا التعليمية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('report')} className="hover:text-amber-800 transition text-amber-700 font-bold">
                  الإبلاغ عن مشكلة أو اقتراح
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & zero metadata slop */}
        <div className="pt-8 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} عالم الصغار — Little Stars. جميع الحقوق محفوظة للأجيال القادمة.</p>
          <div className="flex items-center gap-1 text-slate-600">
            <span>صُنع بعناية فائقة لتعزيز التعليم المبكر باللغة العربية</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
