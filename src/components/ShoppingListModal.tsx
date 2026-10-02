import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Check,
  Trash2,
  Copy,
  Plus,
  ArrowRight,
} from 'lucide-react';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: string[];
  onRemoveItem: (item: string) => void;
  onClearAll: () => void;
  onAddCustomItem: (item: string) => void;
  onMoveToPantry: (item: string) => void;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearAll,
  onAddCustomItem,
  onMoveToPantry,
}) => {
  const [newInput, setNewInput] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleToggleCheck = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newInput.trim();
    if (!trimmed) return;
    onAddCustomItem(trimmed);
    setNewInput('');
  };

  const handleCopyList = () => {
    if (items.length === 0) return;
    const text = `Grocery Shopping List:\n${items
      .map((i) => `[ ] ${i}`)
      .join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#2C241D]/15 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#2C241D]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#52796F]/15 text-[#52796F]">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#2C241D]">
                Shopping List
              </h2>
              <p className="text-xs text-[#2C241D]/60">
                {items.length} {items.length === 1 ? 'item' : 'items'} to buy for recipes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#2C241D]/10 text-[#2C241D]/60 hover:text-[#2C241D] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input */}
        <div className="p-4 border-b border-[#2C241D]/10 bg-white">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newInput}
              onChange={(e) => setNewInput(e.target.value)}
              placeholder="Add item to buy..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#FAF7F2] border border-[#2C241D]/15 focus:border-[#52796F] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newInput.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#52796F] text-white hover:bg-[#3f5f57] disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* List Content */}
        <div className="p-5 overflow-y-auto space-y-2 flex-1">
          {items.length === 0 ? (
            <div className="py-12 text-center text-[#2C241D]/60">
              <ShoppingBag className="w-10 h-10 mx-auto text-[#2C241D]/30 mb-2" />
              <p className="text-sm font-semibold text-[#2C241D]">
                Shopping list is empty
              </p>
              <p className="text-xs text-[#2C241D]/55 mt-1 max-w-xs mx-auto">
                When browsing recipes with missing ingredients, click "Add to shopping list" to save them here.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const isChecked = checkedItems.includes(item);
              return (
                <div
                  key={item}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isChecked
                      ? 'bg-stone-50 border-stone-200 text-[#2C241D]/40'
                      : 'bg-white border-[#2C241D]/10 hover:border-[#52796F]/40 text-[#2C241D]'
                  }`}
                >
                  <div
                    onClick={() => handleToggleCheck(item)}
                    className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-[#52796F] border-[#52796F] text-white'
                          : 'border-[#2C241D]/30'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-sm font-medium truncate ${
                        isChecked ? 'line-through' : ''
                      }`}
                    >
                      {item}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <button
                      type="button"
                      onClick={() => onMoveToPantry(item)}
                      title="Mark bought and move into My Pantry"
                      className="px-2 py-1 text-[11px] font-semibold text-[#52796F] hover:bg-[#52796F]/10 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Got it</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-[#FAF7F2] border-t border-[#2C241D]/10 flex items-center justify-between">
            <button
              onClick={handleCopyList}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#2C241D]/15 text-[#2C241D] hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy List'}</span>
            </button>

            <button
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:underline font-medium cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
