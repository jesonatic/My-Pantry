import React from 'react';
import { Cuisine } from '../types/recipe';
import { Sparkles, Utensils, CheckCircle2, Clock, Search } from 'lucide-react';

interface CuisineFilterBarProps {
  selectedCuisine: Cuisine;
  onSelectCuisine: (cuisine: Cuisine) => void;
  readyCount: number;
  totalCount: number;
  filterCookableOnly: boolean;
  onToggleCookableOnly: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onFindRecipesClick: () => void;
}

const CUISINES: { id: Cuisine; label: string; iconLabel: string }[] = [
  { id: 'All Cuisines', label: 'All Cuisines', iconLabel: '🌏' },
  { id: 'Japanese', label: 'Japanese', iconLabel: '🍱' },
  { id: 'Western', label: 'Western', iconLabel: '🍝' },
  { id: 'Chinese', label: 'Chinese', iconLabel: '🥢' },
];

export const CuisineFilterBar: React.FC<CuisineFilterBarProps> = ({
  selectedCuisine,
  onSelectCuisine,
  readyCount,
  totalCount,
  filterCookableOnly,
  onToggleCookableOnly,
  searchQuery,
  onSearchChange,
  onFindRecipesClick,
}) => {
  return (
    <div id="cuisines" className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2C241D]">
            Recipe Suggestions
          </h2>
          <p className="text-xs sm:text-sm text-[#2C241D]/65">
            Ranked by match percentage based on your current pantry ingredients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Toggle to display only recipes without any missing ingredients */}
          <label
            htmlFor="no-missing-toggle"
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all cursor-pointer select-none shadow-2xs ${
              filterCookableOnly
                ? 'bg-[#52796F]/10 border-[#52796F]/40 text-[#2C241D]'
                : 'bg-white border-[#2C241D]/15 text-[#2C241D]/80 hover:border-[#2C241D]/30'
            }`}
          >
            <button
              id="no-missing-toggle"
              type="button"
              role="switch"
              aria-checked={filterCookableOnly}
              onClick={onToggleCookableOnly}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#52796F]/40 ${
                filterCookableOnly ? 'bg-[#52796F]' : 'bg-[#2C241D]/20'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  filterCookableOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#2C241D] leading-tight">
                No Missing Ingredients Only
              </span>
              <span className="text-[11px] text-[#2C241D]/60">
                {readyCount > 0 ? `${readyCount} recipes ready to cook` : '0 fully matched recipes'}
              </span>
            </div>
          </label>

          {/* Find Recipes Action Button */}
          <button
            onClick={onFindRecipesClick}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#C85A32] hover:bg-[#A9431E] rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find Recipes ({totalCount})</span>
          </button>
        </div>
      </div>

      {/* Control Strip: Cuisine Segments + Search + Cookable Filter */}
      <div className="p-3 bg-white rounded-2xl border border-[#2C241D]/10 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Cuisine Segmented Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-xl border border-[#2C241D]/10">
            {CUISINES.map((item) => {
              const isActive = selectedCuisine === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectCuisine(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#C85A32] shadow-xs border border-[#2C241D]/10'
                      : 'text-[#2C241D]/70 hover:text-[#2C241D] hover:bg-white/50'
                  }`}
                >
                  <span>{item.iconLabel}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* 100% Cookable Now Filter Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCookableOnly}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                filterCookableOnly
                  ? 'bg-[#52796F] text-white border-[#52796F] shadow-xs'
                  : 'bg-white text-[#2C241D]/75 border-[#2C241D]/15 hover:border-[#52796F] hover:text-[#52796F]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Ready to Cook ({readyCount})</span>
            </button>
          </div>
        </div>

        {/* Search input filter */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#2C241D]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by recipe name or ingredient keyword (e.g. Teriyaki, Linguine, Tofu)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-[#FAF7F2] border border-[#2C241D]/15 focus:border-[#C85A32] focus:bg-white focus:outline-none text-[#2C241D] placeholder-[#2C241D]/45"
          />
        </div>
      </div>
    </div>
  );
};
