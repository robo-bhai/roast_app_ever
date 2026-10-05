import React from 'react';
import { AppCategory } from '../types/app';

interface CategoryFilterProps {
  categories: AppCategory[];
  selectedCategory: AppCategory;
  onSelectCategory: (category: AppCategory) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-white tracking-tight">Browse Categories</h2>
        <span className="text-xs text-stone-400">Filter by application type</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 font-bold'
                  : 'bg-[#18120e]/80 text-stone-300 hover:text-amber-300 hover:bg-[#231a14] border border-amber-500/15'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-black/20 text-black font-mono' : 'bg-stone-900 text-stone-400 font-mono'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
