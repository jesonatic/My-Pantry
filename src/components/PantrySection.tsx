import React, { useState, KeyboardEvent } from 'react';
import {
  Plus,
  X,
  Check,
  RotateCcw,
  Sparkles,
  ShoppingBasket,
  HelpCircle,
  Beef,
  Carrot,
  Wheat,
  Wine,
  Droplet,
  Layers,
} from 'lucide-react';
import { COMMON_INGREDIENT_CATEGORIES } from '../data/staples';
import { isIngredientInPantry } from '../utils/matcher';

interface PantrySectionProps {
  pantry: string[];
  onAddIngredient: (name: string) => void;
  onRemoveIngredient: (name: string) => void;
  onClearPantry: () => void;
  onLoadSamplePantry: () => void;
}

export const PantrySection: React.FC<PantrySectionProps> = ({
  pantry,
  onAddIngredient,
  onRemoveIngredient,
  onClearPantry,
  onLoadSamplePantry,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');

  const handleAddCustom = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (pantry.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`"${trimmed}" is already in your pantry.`);
      setTimeout(() => setErrorMsg(''), 2500);
      return;
    }

    onAddIngredient(trimmed);
    setInputValue('');
    setErrorMsg('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const handleToggleStaple = (item: string) => {
    if (isIngredientInPantry(item, pantry)) {
      // Find the exact or matching string in pantry to remove
      const found = pantry.find(
        (p) =>
          p.toLowerCase() === item.toLowerCase() ||
          p.toLowerCase().includes(item.toLowerCase()) ||
          item.toLowerCase().includes(p.toLowerCase())
      );
      if (found) {
        onRemoveIngredient(found);
      }
    } else {
      onAddIngredient(item);
    }
  };

  // Helper to render icon for tabs
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'wine':
        return <Wine className="w-3.5 h-3.5" />;
      case 'beef':
        return <Beef className="w-3.5 h-3.5" />;
      case 'carrot':
        return <Carrot className="w-3.5 h-3.5" />;
      case 'droplet':
        return <Droplet className="w-3.5 h-3.5" />;
      case 'wheat':
        return <Wheat className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  // Filter items based on active tab
  const displayedCategories =
    activeTab === 'All'
      ? COMMON_INGREDIENT_CATEGORIES
      : COMMON_INGREDIENT_CATEGORIES.filter((cat) => cat.name === activeTab);

  return (
    <section id="pantry" className="space-y-8">
      {/* Hero Welcome / Prompt Header & Quick-Add Chips */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#2C241D]/10 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C85A32]">
              Kitchen Inventory
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2C241D] leading-tight text-balance">
              What ingredients do you have in your kitchen today?
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#2C241D]/75 leading-relaxed">
              Add your meats, vegetables, sauces, and seasonings. Click any chip below to instantly add it to your pantry, or type your own custom ingredients.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
            <button
              onClick={onLoadSamplePantry}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#FAF7F2] text-[#2C241D] hover:bg-[#2C241D]/5 border border-[#2C241D]/15 transition-all cursor-pointer whitespace-nowrap"
              title="Preload common starter ingredients (Eggs, Rice, Soy Sauce, Chicken, Onion)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Load Starter Pantry</span>
            </button>
            {pantry.length > 0 && (
              <button
                onClick={onClearPantry}
                className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                title="Remove all pantry items"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 pt-6 border-t border-[#2C241D]/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCustom();
            }}
            className="flex flex-col sm:flex-row items-stretch gap-2.5"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a custom ingredient (e.g. Sesame Oil, Sriracha, Tofu, Basil...)"
                className="w-full px-4 py-3 text-sm rounded-xl bg-[#FAF7F2] border border-[#2C241D]/20 focus:border-[#C85A32] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#C85A32]/15 text-[#2C241D] placeholder-[#2C241D]/45 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-6 py-3 text-sm font-semibold rounded-xl bg-[#C85A32] text-white hover:bg-[#A9431E] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Pantry</span>
            </button>
          </form>

          {errorMsg && (
            <p className="mt-2 text-xs text-rose-600 font-medium flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}
        </div>

        {/* Category Tabs & Quick-Add Chips */}
        <div className="mt-8 pt-6 border-t border-[#2C241D]/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#2C241D]">
                Common Ingredients, Sauces & Condiments
              </h2>
              <p className="text-xs text-[#2C241D]/65">
                Click any chip to immediately add or remove it from your pantry.
              </p>
            </div>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            <button
              type="button"
              onClick={() => setActiveTab('All')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'All'
                  ? 'bg-[#2C241D] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#2C241D]/70 hover:bg-[#2C241D]/5 border border-[#2C241D]/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </button>

            {COMMON_INGREDIENT_CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setActiveTab(cat.name)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#C85A32] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#2C241D]/70 hover:bg-[#2C241D]/5 border border-[#2C241D]/10'
                  }`}
                >
                  {renderCategoryIcon(cat.iconName)}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Chips Grid organized under the selected category / all categories */}
          <div className="space-y-4 pt-1">
            {displayedCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                {activeTab === 'All' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#C85A32]">
                      {renderCategoryIcon(category.iconName)}
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C241D]/60">
                      {category.name}
                    </h3>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {category.items.map((staple) => {
                    const inPantry = isIngredientInPantry(staple, pantry);
                    return (
                      <button
                        key={staple}
                        type="button"
                        onClick={() => handleToggleStaple(staple)}
                        className={`group inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-96 shadow-2xs ${
                          inPantry
                            ? 'bg-[#52796F] text-white border border-[#52796F] hover:bg-[#43645c] shadow-xs'
                            : 'bg-[#FAF7F2] text-[#2C241D]/80 border border-[#2C241D]/15 hover:border-[#C85A32] hover:text-[#C85A32] hover:bg-white'
                        }`}
                      >
                        {inPantry ? (
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#2C241D]/5 group-hover:bg-[#C85A32]/10 group-hover:text-[#C85A32] text-[#2C241D]/50 transition-colors">
                            <Plus className="w-3 h-3" />
                          </span>
                        )}
                        <span>{staple}</span>
                        {inPantry && (
                          <span className="text-[10px] uppercase font-bold opacity-80 pl-0.5">
                            Added
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Ingredients View (My Pantry) */}
      <div className="rounded-2xl bg-white border border-[#2C241D]/10 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#2C241D]/10">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#52796F]/15 text-[#52796F]">
              <ShoppingBasket className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2C241D]">
                My Pantry
              </h2>
              <p className="text-xs text-[#2C241D]/65">
                {pantry.length === 0
                  ? 'No items added yet'
                  : `${pantry.length} ${pantry.length === 1 ? 'ingredient' : 'ingredients'} saved`}
              </p>
            </div>
          </div>
          {pantry.length > 0 && (
            <span className="text-xs font-medium text-[#52796F] bg-[#52796F]/10 px-2.5 py-1 rounded-md">
              Saved automatically
            </span>
          )}
        </div>

        {/* Empty state prompt or Tag pills list */}
        {pantry.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#2C241D]/10 flex items-center justify-center text-[#2C241D]/40 mb-3">
              <ShoppingBasket className="w-6 h-6 text-[#C85A32]" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#2C241D]">
              Your pantry is empty
            </h3>
            <p className="mt-1 max-w-md text-xs sm:text-sm text-[#2C241D]/65">
              Click any of the ingredient, sauce, or condiment chips above to instantly fill your pantry and find matching recipes.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2 pt-1">
            {pantry.map((item) => (
              <span
                key={item}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#2C241D]/15 text-sm font-medium text-[#2C241D] hover:border-[#C85A32] hover:bg-[#C85A32]/5 transition-all shadow-2xs"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => onRemoveIngredient(item)}
                  aria-label={`Remove ${item}`}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[#2C241D]/40 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

