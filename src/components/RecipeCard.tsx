import React from 'react';
import { MatchResult } from '../types/recipe';
import {
  Clock,
  Gauge,
  Flame,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  UtensilsCrossed,
} from 'lucide-react';

interface RecipeCardProps {
  result: MatchResult;
  onSelectRecipe: () => void;
  onAddMissingToShoppingList: (ingredients: string[]) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  result,
  onSelectRecipe,
  onAddMissingToShoppingList,
}) => {
  const { recipe, matchPercentage, matchedIngredients, missingIngredients, isCookableNow } =
    result;

  const getMatchColor = (pct: number) => {
    if (pct === 100) return 'text-[#52796F] bg-[#52796F]/10 border-[#52796F]/25';
    if (pct >= 65) return 'text-[#D97706] bg-[#D97706]/10 border-[#D97706]/25';
    return 'text-[#2C241D]/70 bg-[#2C241D]/5 border-[#2C241D]/15';
  };

  return (
    <article
      onClick={onSelectRecipe}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#2C241D]/10 overflow-hidden shadow-xs hover:shadow-md hover:border-[#C85A32]/40 transition-all duration-200 cursor-pointer"
    >
      {/* Top Image & Match Banner */}
      <div>
        <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-[#FAF7F2] overflow-hidden">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
              onError={(e) => {
                // Zero-broken-image fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#2C241D]/30 bg-gradient-to-br from-[#FAF7F2] to-[#EAE4DC]">
              <UtensilsCrossed className="w-10 h-10" />
            </div>
          )}

          {/* Scrim overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 text-xs font-bold text-white bg-black/60 backdrop-blur-md rounded-md tracking-wide">
              {recipe.cuisine}
            </span>

            {/* Match Percentage Indicator */}
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-md backdrop-blur-md border ${
                isCookableNow
                  ? 'bg-emerald-600/90 text-white border-emerald-400/40'
                  : matchPercentage >= 65
                  ? 'bg-amber-600/90 text-white border-amber-400/40'
                  : 'bg-black/60 text-white border-white/20'
              }`}
            >
              {matchPercentage}% Match
            </span>
          </div>

          {/* Quick headline overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-sm line-clamp-1">
              {recipe.name}
            </h3>
          </div>
        </div>

        {/* Card Content & Metadata */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Metadata Row (Unboxed metadata with separators) */}
          <div className="flex items-center gap-2 text-xs text-[#2C241D]/70 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>{recipe.prepTime}</span>
            </span>
            <span aria-hidden="true" className="text-[#2C241D]/30">·</span>
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-[#52796F]" />
              <span>{recipe.difficulty}</span>
            </span>
            {recipe.calories && (
              <>
                <span aria-hidden="true" className="text-[#2C241D]/30">·</span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{recipe.calories} kcal</span>
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-[#2C241D]/75 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          {/* Ingredient Match Summary */}
          <div className="pt-3 border-t border-[#2C241D]/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#2C241D]/80">
                Ingredients ({matchedIngredients.length}/{recipe.requiredIngredients.length} in pantry)
              </span>
              {isCookableNow ? (
                <span className="flex items-center gap-1 text-[#52796F] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready to cook!
                </span>
              ) : (
                <span className="text-[#C85A32] font-medium">
                  {missingIngredients.length} missing
                </span>
              )}
            </div>

            {/* Missing Ingredients callout */}
            {missingIngredients.length > 0 ? (
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs">
                <div className="flex items-start gap-1.5 text-amber-900">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold">Missing: </span>
                    <span className="text-amber-800">
                      {missingIngredients.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60 text-xs text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>You have all ingredients needed for this dish!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 py-3 bg-[#FAF7F2]/60 border-t border-[#2C241D]/10 flex items-center justify-between gap-2">
        {missingIngredients.length > 0 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddMissingToShoppingList(missingIngredients);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#52796F] hover:text-[#38534c] transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add missing to list</span>
          </button>
        ) : (
          <span className="text-[11px] font-medium text-[#52796F]">
            100% matched pantry
          </span>
        )}

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C85A32] group-hover:translate-x-0.5 transition-transform">
          <span>View recipe</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
