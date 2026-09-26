import React from 'react';
import { CATEGORIES } from '../data/tools';
import { CategoryType, PricingType } from '../types';
import { LayoutGrid, List, SlidersHorizontal, Check, ArrowDownUp } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  selectedPricing: PricingType | 'All';
  onSelectPricing: (pricing: PricingType | 'All') => void;
  sortBy: 'traffic' | 'rating' | 'newest' | 'name';
  onSelectSort: (sort: 'traffic' | 'rating' | 'newest' | 'name') => void;
  verifiedOnly: boolean;
  onToggleVerified: () => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  totalResults: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedPricing,
  onSelectPricing,
  sortBy,
  onSelectSort,
  verifiedOnly,
  onToggleVerified,
  viewMode,
  onToggleViewMode,
  totalResults,
  hasActiveFilters,
  onResetFilters,
}) => {
  const pricingOptions: (PricingType | 'All')[] = ['All', 'Free', 'Freemium', 'Paid', 'Free Trial'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      {/* Category Tabs (Primary Filter) */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => onSelectCategory(cat.label)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200/80'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] tabular-nums font-mono ${
                    isActive ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  {cat.count > 1000 ? `${(cat.count / 1000).toFixed(1)}k` : cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Pricing Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Pricing:</span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            {pricingOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onSelectPricing(opt)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  selectedPricing === opt
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Right side controls: Sorting, Verified, View Mode */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Verified Only Toggle */}
          <button
            onClick={onToggleVerified}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              verifiedOnly
                ? 'border-purple-300 bg-purple-50 text-purple-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                verifiedOnly ? 'bg-purple-700 border-purple-700 text-white' : 'border-slate-300 bg-white'
              }`}
            >
              {verifiedOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </span>
            <span>Verified only</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <ArrowDownUp className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value as any)}
              className="text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none cursor-pointer focus:border-purple-600"
            >
              <option value="traffic">Sort by Monthly Visits</option>
              <option value="rating">Sort by Highest Rated</option>
              <option value="newest">Sort by Newest</option>
              <option value="name">Sort by Name (A-Z)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-lg border border-slate-200/60">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Result feedback row */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-semibold text-slate-800">{totalResults}</strong> tools
            {selectedCategory !== 'All' && <span> in <strong className="font-medium text-slate-700">{selectedCategory}</strong></span>}
          </span>
          {hasActiveFilters && (
            <>
              <span className="text-slate-300">·</span>
              <button
                onClick={onResetFilters}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
              >
                Reset filters
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
