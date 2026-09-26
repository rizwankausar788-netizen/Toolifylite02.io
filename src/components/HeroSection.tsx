import React, { useRef, useEffect } from 'react';
import { Search, X, Sparkles, Flame, CheckCircle2, RefreshCw, ArrowLeftRight } from 'lucide-react';
import { POPULAR_TAGS } from '../data/tools';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTagClick: (tag: string) => void;
  totalToolsCount: number;
  onOpenMatchmaker: () => void;
  onQuickCompare: (id1: string, id2: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onTagClick,
  totalToolsCount,
  onOpenMatchmaker,
  onQuickCompare,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global '/' keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        !(
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement
        )
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Big Headline */}
      <h1
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto"
        style={{ textWrap: 'balance' }}
      >
        Discover <span className="text-purple-700">{totalToolsCount.toLocaleString()}+</span> Best AI Websites &amp; Tools
      </h1>

      <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal">
        The definitive directory to find, compare, and filter the latest artificial intelligence software for work, coding, and creative projects.
      </p>

      {/* Trust Signals Row */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
          <span className="font-medium text-slate-700">Updated Daily</span>
        </div>
        <span className="text-slate-300" aria-hidden="true">·</span>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-900 tabular-nums">28,450+</span>
          <span>AI Tools</span>
        </div>
        <span className="text-slate-300" aria-hidden="true">·</span>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-900 tabular-nums">240+</span>
          <span>Categories</span>
        </div>
        <span className="text-slate-300" aria-hidden="true">·</span>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Traffic Stats</span>
        </div>
      </div>

      {/* Prominent Search Bar */}
      <div className="mt-7 max-w-3xl mx-auto">
        <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-slate-300/90 hover:border-purple-400 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition-all p-1.5">
          <div className="pl-3 pr-2 text-slate-400 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 28,000+ AI tools by name, task, or feature (e.g. video generator, code editor)..."
            className="w-full py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent border-0 outline-none focus:ring-0"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center mr-2">
            <kbd className="px-1.5 py-0.5 text-[11px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
              /
            </kbd>
          </div>

          <button
            onClick={() => searchInputRef.current?.focus()}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            Search
          </button>
        </div>

        {/* Popular Tags / Quick Filter Pills */}
        <div className="mt-3.5 flex items-center justify-center flex-wrap gap-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-400 font-medium mr-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Trending:
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer font-medium ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-100/90 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Interactive Helper Ribbons: AI Advisor & Comparison Shortcuts */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
          {/* AI Matchmaker Trigger */}
          <button
            onClick={onOpenMatchmaker}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-lg border border-purple-200/80 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Need a custom stack? Ask AI Advisor</span>
          </button>

          {/* Quick Rivalry Comparison Buttons */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-500">
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Compare:</span>
            <button
              onClick={() => onQuickCompare('cursor', 'windsurf')}
              className="text-slate-700 hover:text-purple-700 hover:underline font-medium cursor-pointer"
            >
              Cursor vs Windsurf
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => onQuickCompare('claude', 'deepseek-r1')}
              className="text-slate-700 hover:text-purple-700 hover:underline font-medium cursor-pointer"
            >
              Claude 3.7 vs DeepSeek-R1
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => onQuickCompare('runway-gen3', 'kling-ai')}
              className="text-slate-700 hover:text-purple-700 hover:underline font-medium cursor-pointer"
            >
              Runway vs Kling
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
