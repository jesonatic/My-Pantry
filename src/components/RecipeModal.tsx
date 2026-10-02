import React, { useState } from 'react';
import { MatchResult, RecipeIngredient } from '../types/recipe';
import {
  X,
  Clock,
  Gauge,
  Flame,
  Users,
  Check,
  Plus,
  ShoppingBag,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Copy,
} from 'lucide-react';

interface RecipeModalProps {
  result: MatchResult | null;
  onClose: () => void;
  onAddMissingToShoppingList: (ingredients: string[]) => void;
  isIngredientInPantry: (item: string) => boolean;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  result,
  onClose,
  onAddMissingToShoppingList,
  isIngredientInPantry,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const { recipe, matchPercentage, missingIngredients, isCookableNow } = result;

  const ingredientsList: RecipeIngredient[] =
    recipe.ingredientDetails ||
    recipe.requiredIngredients.map((name) => ({ name }));

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const copyRecipe = () => {
    const text = `${recipe.name} (${recipe.cuisine} Cuisine)
Prep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime} | Servings: ${recipe.servings}

INGREDIENTS:
${ingredientsList
  .map((i) => `- ${i.name} ${i.amount ? `(${i.amount})` : ''}`)
  .join('\n')}

INSTRUCTIONS:
${recipe.instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

Chef Tip: ${recipe.chefTip || 'Enjoy cooking!'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#2C241D]/15 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close */}
        <div className="relative aspect-16/8 sm:aspect-16/7 w-full bg-[#FAF7F2] shrink-0 overflow-hidden">
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Title Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md rounded-md">
                {recipe.cuisine}
              </span>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-md backdrop-blur-md ${
                  isCookableNow ? 'bg-emerald-600/90' : 'bg-amber-600/90'
                }`}
              >
                {matchPercentage}% In Your Pantry
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-balance drop-shadow-sm">
              {recipe.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#2C241D]/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#2C241D]/60 uppercase font-semibold">Prep / Cook</p>
                <p className="text-xs sm:text-sm font-bold text-[#2C241D]">
                  {recipe.prepTime} + {recipe.cookTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#52796F]/10 text-[#52796F] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#2C241D]/60 uppercase font-semibold">Servings</p>
                <p className="text-xs sm:text-sm font-bold text-[#2C241D]">
                  {recipe.servings} people
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D97706]/10 text-[#D97706] flex items-center justify-center">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#2C241D]/60 uppercase font-semibold">Difficulty</p>
                <p className="text-xs sm:text-sm font-bold text-[#2C241D]">
                  {recipe.difficulty}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2C241D]/10 text-[#2C241D] flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#2C241D]/60 uppercase font-semibold">Calories</p>
                <p className="text-xs sm:text-sm font-bold text-[#2C241D]">
                  {recipe.calories || 450} kcal
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#2C241D]/80 leading-relaxed">
            {recipe.description}
          </p>

          {/* Missing Ingredients Action Notice */}
          {missingIngredients.length > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Missing from your pantry ({missingIngredients.length})
                </p>
                <p className="text-sm text-amber-800 font-medium mt-0.5">
                  {missingIngredients.join(', ')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAddMissingToShoppingList(missingIngredients)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#52796F] hover:bg-[#3d5a53] rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Shopping List</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2.5 text-emerald-900 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Great news! You have 100% of the required ingredients in your pantry.</span>
            </div>
          )}

          {/* Detailed Ingredients Breakdown */}
          <div className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-[#2C241D] flex items-center justify-between">
              <span>Ingredients Breakdown</span>
              <span className="text-xs font-normal text-[#2C241D]/60">
                Checkmarks denote items currently in your pantry
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ingredientsList.map((item) => {
                const hasIt = isIngredientInPantry(item.name);
                return (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${
                        hasIt
                          ? 'bg-emerald-50/50 border-emerald-200/70 text-[#2C241D]'
                          : 'bg-[#FAF7F2] border-[#2C241D]/15 text-[#2C241D]/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                            hasIt
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {hasIt ? <Check className="w-3 h-3" /> : '✕'}
                        </span>
                        <div className="truncate">
                          <span className="font-semibold text-[#2C241D]">
                            {item.name}
                          </span>
                          {item.notes && (
                            <span className="text-xs text-[#2C241D]/55 ml-1.5 italic">
                              ({item.notes})
                            </span>
                          )}
                        </div>
                      </div>
                      {item.amount && (
                        <span className="text-xs font-medium text-[#2C241D]/65 ml-2 shrink-0">
                          {item.amount}
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3 pt-2 border-t border-[#2C241D]/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-[#2C241D]">
                Cooking Steps
              </h3>
              <span className="text-xs font-semibold text-[#52796F]">
                {completedSteps.length} of {recipe.instructions.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {recipe.instructions.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50/40 border-emerald-200 text-[#2C241D]/60'
                        : 'bg-white border-[#2C241D]/15 hover:border-[#C85A32]/40 text-[#2C241D]'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#2C241D]/10 text-[#2C241D]'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDone ? 'line-through text-[#2C241D]/50' : 'text-[#2C241D]'
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chef Tip Callout */}
          {recipe.chefTip && (
            <div className="p-4 rounded-2xl bg-[#52796F]/10 border border-[#52796F]/20 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[#52796F] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#52796F]">
                  Chef's Pro Tip
                </p>
                <p className="text-xs sm:text-sm text-[#2C241D]/80 mt-0.5 leading-relaxed">
                  {recipe.chefTip}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#2C241D]/10 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={copyRecipe}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#2C241D]/15 text-[#2C241D] hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Recipe!' : 'Copy Recipe'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#2C241D] hover:bg-[#43372c] rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
