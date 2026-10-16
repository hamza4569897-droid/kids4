import React from 'react';
import { EducationalResource } from '../../types/database';
import { Heart, Play, Clock, Sparkles, ExternalLink } from 'lucide-react';
import { sounds } from '../../lib/audio';

interface ActivityCardProps {
  resource: EducationalResource;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (resource: EducationalResource) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  resource,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    onToggleFavorite(resource.id);
  };

  const isExternal = resource.launch_type === 'external_tab';

  return (
    <div
      onClick={() => onSelect(resource)}
      className="group bg-white rounded-3xl overflow-hidden border border-amber-200/70 hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Visual Cover */}
      <div className="relative aspect-4/3 w-full bg-amber-50 overflow-hidden">
        {resource.thumbnail_url ? (
          <img
            src={resource.thumbnail_url}
            alt={resource.title_ar}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/src/assets/images/hero_preschool_stars_1791871144333.jpg';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-4xl">
            ⭐
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 left-3 p-2.5 rounded-2xl backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md scale-105'
              : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Launch Indicator Overlay */}
        <div className="absolute inset-0 bg-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            {isExternal ? <ExternalLink className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          </div>
        </div>
      </div>

      {/* Card Content: No pill badges; clean typography */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Clean text with typographic bullet separator */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <span>عمر {resource.age_min}–{resource.age_max} سنوات</span>
            <span aria-hidden="true">·</span>
            <span>{resource.estimated_duration_minutes} دقائق</span>
            <span aria-hidden="true">·</span>
            <span>{resource.provider_name}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition mb-2">
            {resource.title_ar}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {resource.description_ar}
          </p>
        </div>

        {/* Footer CTA */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-amber-700 group-hover:underline">
            {isExternal ? 'فتح النشاط الخارجي ↗' : 'ابدأ اللعب الآن ←'}
          </span>
          <span className="text-xs text-slate-500">
            {resource.is_free ? 'مجاني 100%' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
