/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { PantrySection } from './components/PantrySection';
import { CuisineFilterBar } from './components/CuisineFilterBar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { ShoppingListModal } from './components/ShoppingListModal';
import { RECIPES } from './data/recipes';
import { Cuisine, MatchResult } from './types/recipe';
import { getRankedRecipes, isIngredientInPantry } from './utils/matcher';
import {
  Utensils,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  Heart,
  ChefHat,
} from 'lucide-react';

const STORAGE_KEY_PANTRY = 'pantry_chef_ingredients_v1';
const STORAGE_KEY_SHOPPING = 'pantry_chef_shopping_list_v1';

// Starter set for quick exploration
const SAMPLE_STARTER_PANTRY = [
  'Eggs',
  'Rice',
  'Soy Sauce',
  'Garlic',
  'Chicken',
  'Onion',
  'Butter',
];

export default function App() {
  // --- Persistent State ---
  const [pantry, setPantry] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PANTRY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [shoppingList, setShoppingList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHOPPING);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PANTRY, JSON.stringify(pantry));
    } catch (err) {
      console.error('Failed to save pantry to localStorage', err);
    }
  }, [pantry]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SHOPPING, JSON.stringify(shoppingList));
    } catch (err) {
      console.error('Failed to save shopping list to localStorage', err);
    }
  }, [shoppingList]);

  // --- Filtering & Navigation State ---
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>('All Cuisines');
  const [filterCookableOnly, setFilterCookableOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Modals State ---
  const [activeRecipeResult, setActiveRecipeResult] = useState<MatchResult | null>(null);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Pantry Actions ---
  const handleAddIngredient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (pantry.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`"${trimmed}" is already in your pantry!`);
      return;
    }
    setPantry((prev) => [...prev, trimmed]);
    showToast(`Added "${trimmed}" to your pantry`);
  };

  const handleRemoveIngredient = (name: string) => {
    setPantry((prev) => prev.filter((item) => item.toLowerCase() !== name.toLowerCase()));
  };

  const handleClearPantry = () => {
    if (window.confirm('Clear all ingredients from your pantry?')) {
      setPantry([]);
      showToast('Pantry cleared');
    }
  };

  const handleLoadSamplePantry = () => {
    // Add unique sample items
    setPantry((prev) => {
      const merged = new Set([...prev]);
      SAMPLE_STARTER_PANTRY.forEach((item) => merged.add(item));
      return Array.from(merged);
    });
    showToast('Loaded starter pantry ingredients!');
  };

  // --- Shopping List Actions ---
  const handleAddMissingToShoppingList = (missingItems: string[]) => {
    setShoppingList((prev) => {
      const set = new Set(prev);
      missingItems.forEach((item) => set.add(item));
      return Array.from(set);
    });
    showToast(`Added ${missingItems.length} missing ${missingItems.length === 1 ? 'item' : 'items'} to shopping list`);
  };

  const handleAddCustomShoppingItem = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed) return;
    setShoppingList((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  };

  const handleRemoveShoppingItem = (item: string) => {
    setShoppingList((prev) => prev.filter((i) => i !== item));
  };

  const handleClearShoppingList = () => {
    setShoppingList([]);
  };

  const handleMoveToPantry = (item: string) => {
    handleAddIngredient(item);
    handleRemoveShoppingItem(item);
    showToast(`Moved "${item}" from shopping list to pantry!`);
  };

  // --- Matching Engine ---
  const rankedResults = useMemo(() => {
    return getRankedRecipes(RECIPES, pantry, selectedCuisine);
  }, [pantry, selectedCuisine]);

  // Secondary filters (search + 100% cookable)
  const filteredResults = useMemo(() => {
    let list = rankedResults;

    if (filterCookableOnly) {
      list = list.filter((r) => r.isCookableNow);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.recipe.name.toLowerCase().includes(q) ||
          r.recipe.requiredIngredients.some((ing) => ing.toLowerCase().includes(q)) ||
          r.recipe.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [rankedResults, filterCookableOnly, searchQuery]);

  const readyToCookCount = useMemo(() => {
    return rankedResults.filter((r) => r.isCookableNow).length;
  }, [rankedResults]);

  // --- Scroll helpers ---
  const scrollToRecipes = () => {
    const el = document.getElementById('recipes-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPantry = () => {
    const el = document.getElementById('pantry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C241D]">
      {/* Top Bar Contract Navigation */}
      <Header
        pantryCount={pantry.length}
        shoppingListCount={shoppingList.length}
        onOpenShoppingList={() => setIsShoppingListOpen(true)}
        onScrollToRecipes={scrollToRecipes}
        onScrollToPantry={scrollToPantry}
      />

      {/* Hero Visual Accent Banner */}
      <div className="relative border-b border-[#2C241D]/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C85A32]/10 text-[#C85A32] text-xs font-bold uppercase tracking-wider">
              <ChefHat className="w-3.5 h-3.5" />
              Smart Kitchen Cooking Assistant
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2C241D] leading-tight text-balance">
              Cook restaurant-quality meals with what you already have.
            </h1>
            <p className="text-sm sm:text-base text-[#2C241D]/75 leading-relaxed">
              Never let groceries go to waste. Simply check off your ingredients, and our culinary matching algorithm instantly curates authentic Japanese, Western, and Chinese dishes you can make right now.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={scrollToPantry}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#C85A32] hover:bg-[#A9431E] rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                Enter Your Ingredients
              </button>
              <button
                onClick={scrollToRecipes}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#2C241D] bg-[#FAF7F2] hover:bg-[#2C241D]/5 border border-[#2C241D]/15 rounded-xl transition-all cursor-pointer"
              >
                Browse All Recipes ({RECIPES.length})
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 lg:w-96 aspect-4/3 rounded-2xl overflow-hidden border border-[#2C241D]/10 shadow-md relative shrink-0">
            <img
              src="/src/assets/images/culinary_hero_pantry_1790926974578.jpg"
              alt="Culinary Ingredients on Table"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
              <p className="font-serif font-bold text-sm">Pantry-to-Plate</p>
              <p className="text-white/80 text-[11px]">Zero waste · Fresh flavor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Section 1: Pantry Entry & Quick Add */}
        <PantrySection
          pantry={pantry}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          onClearPantry={handleClearPantry}
          onLoadSamplePantry={handleLoadSamplePantry}
        />

        {/* Section 2: Cuisine Filter & Recipe Suggestions */}
        <section id="recipes-section" className="space-y-6 pt-4">
          <CuisineFilterBar
            selectedCuisine={selectedCuisine}
            onSelectCuisine={setSelectedCuisine}
            readyCount={readyToCookCount}
            totalCount={filteredResults.length}
            filterCookableOnly={filterCookableOnly}
            onToggleCookableOnly={() => setFilterCookableOnly(!filterCookableOnly)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFindRecipesClick={scrollToRecipes}
          />

          {/* Recipe Cards Grid */}
          {filteredResults.length === 0 ? (
            <div className="rounded-2xl bg-white border border-[#2C241D]/10 p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#2C241D]">
                No matching recipes found
              </h3>
              <p className="max-w-md text-sm text-[#2C241D]/65">
                {filterCookableOnly
                  ? 'No recipes match 100% of your current ingredients. Try unchecking the "100% Ready to Cook" filter or add more staples above!'
                  : 'Try broadening your search term or select "All Cuisines".'}
              </p>
              {filterCookableOnly && (
                <button
                  onClick={() => setFilterCookableOnly(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#FAF7F2] border border-[#2C241D]/15 text-[#2C241D] hover:bg-[#2C241D]/5 transition-colors cursor-pointer"
                >
                  Show all partial matches
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((result) => (
                <RecipeCard
                  key={result.recipe.id}
                  result={result}
                  onSelectRecipe={() => setActiveRecipeResult(result)}
                  onAddMissingToShoppingList={handleAddMissingToShoppingList}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-[#2C241D]/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#2C241D]/60">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-[#2C241D]">
              PantryChef
            </span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Kitchen Recipe Suggester</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Japanese · Western · Chinese Cuisines</span>
            <span aria-hidden="true">·</span>
            <span>Zero Food Waste</span>
          </div>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      <RecipeModal
        result={activeRecipeResult}
        onClose={() => setActiveRecipeResult(null)}
        onAddMissingToShoppingList={handleAddMissingToShoppingList}
        isIngredientInPantry={(item) => isIngredientInPantry(item, pantry)}
      />

      {/* Shopping List Modal */}
      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        items={shoppingList}
        onRemoveItem={handleRemoveShoppingItem}
        onClearAll={handleClearShoppingList}
        onAddCustomItem={handleAddCustomShoppingItem}
        onMoveToPantry={handleMoveToPantry}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-[#2C241D] text-white text-xs font-semibold rounded-xl shadow-lg border border-white/10 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
