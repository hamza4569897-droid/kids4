import React from 'react';
import { EducationalResource } from '../types/database';
import { ActivityCard } from '../components/common/ActivityCard';
import { Heart, Clock, ArrowRight, Play } from 'lucide-react';

interface FavoritesPageProps {
  resources: EducationalResource[];
  favorites: string[];
  recentlyPlayed: string[];
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: EducationalResource) => void;
  onNavigate: (view: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  resources,
  favorites,
  recentlyPlayed,
  onToggleFavorite,
  onSelectResource,
  onNavigate,
}) => {
  const favoriteResources = resources.filter((r) => favorites.includes(r.id));
  const recentResources = resources.filter((r) => recentlyPlayed.includes(r.id));

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-amber-200/80 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-amber-950 mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          <span>أنشطتي المفضلة وسجل اللعب</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-xl">
          يتم حفظ ألعابك المفضلة وسجل ما لعبته تلقائياً على هذا الجهاز بدون الحاجة لتسجيل أي حساب للطفل أو جمع أي بيانات خاصة.
        </p>
      </div>

      {/* Favorites Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <span>المفضلة</span>
          <span className="text-xs bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">
            {favoriteResources.length}
          </span>
        </h2>

        {favoriteResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteResources.map((res) => (
              <ActivityCard
                key={res.id}
                resource={res}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectResource}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-amber-200/80 p-8">
            <div className="w-16 h-16 mx-auto mb-3 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">لا توجد ألعاب مفضلة بعد</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
              اضغط على رمز القلب اللطيف الموجود أعلى أي نشاط لإضافته إلى قائمتك المفضلة هنا لسهولة الوصول إليه لاحقاً.
            </p>
            <button
              onClick={() => onNavigate('browse')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs shadow-xs transition"
            >
              استعراض الألعاب الآن
            </button>
          </div>
        )}
      </section>

      {/* Recently Played Section */}
      {recentResources.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-amber-200/80">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-600" />
            <span>ما تم لعبه مؤخراً</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentResources.map((res) => (
              <ActivityCard
                key={res.id}
                resource={res}
                isFavorite={favorites.includes(res.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectResource}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
