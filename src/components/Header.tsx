import React from 'react';
import { ChefHat, ShoppingBag, Sparkles } from 'lucide-react';

interface HeaderProps {
  pantryCount: number;
  shoppingListCount: number;
  onOpenShoppingList: () => void;
  onScrollToRecipes: () => void;
  onScrollToPantry: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pantryCount,
  shoppingListCount,
  onOpenShoppingList,
  onScrollToRecipes,
  onScrollToPantry,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#2C241D]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="group flex items-center gap-2.5 text-2xl font-serif font-bold tracking-tight text-[#2C241D] hover:text-[#C85A32] transition-colors"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#C85A32]/10 text-[#C85A32] group-hover:bg-[#C85A32] group-hover:text-white transition-all shadow-xs">
            <ChefHat className="w-5 h-5" />
          </span>
          <span>PantryChef</span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2C241D]/75">
          <button
            onClick={onScrollToPantry}
            className="hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            My Pantry ({pantryCount})
          </button>
          <button
            onClick={onScrollToRecipes}
            className="hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            Recipe Matches
          </button>
          <a
            href="#cuisines"
            className="hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            Cuisines
          </a>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenShoppingList}
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#2C241D]/15 bg-white text-[#2C241D] hover:border-[#C85A32] hover:text-[#C85A32] transition-all shadow-xs cursor-pointer"
            title="View Missing Ingredients Shopping List"
          >
            <ShoppingBag className="w-4 h-4 text-[#52796F]" />
            <span className="hidden sm:inline">Shopping List</span>
            {shoppingListCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-bold text-white bg-[#C85A32] rounded-full">
                {shoppingListCount}
              </span>
            )}
          </button>

          <button
            onClick={onScrollToRecipes}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#C85A32] hover:bg-[#A9431E] rounded-lg transition-all shadow-sm active:scale-98 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Find Recipes</span>
          </button>
        </div>
      </div>
    </header>
  );
};
