import React, { useState } from 'react';
import { Bookmark, Plus, Edit2, Check, X, Sparkles, ArrowLeftRight, Mail } from 'lucide-react';

interface NavbarProps {
  siteName: string;
  onRenameSiteName: (newName: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenSubmit: () => void;
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
  onOpenMatchmaker: () => void;
  onOpenNewsletter: () => void;
  compareCount: number;
  onOpenCompare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  siteName,
  onRenameSiteName,
  savedCount,
  onOpenSaved,
  onOpenSubmit,
  onSelectCategory,
  onOpenMatchmaker,
  onOpenNewsletter,
  compareCount,
  onOpenCompare,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(siteName);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onRenameSiteName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const initialLetter = siteName.charAt(0).toUpperCase() || 'T';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with brand purple touch */}
        <div className="flex items-center gap-4 sm:gap-6">
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                className="text-base font-bold px-2 py-1 border border-purple-400 rounded-md outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                placeholder="Website name..."
              />
              <button
                type="submit"
                className="p-1.5 text-white bg-purple-700 hover:bg-purple-800 rounded-md transition-colors cursor-pointer"
                title="Save name"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempName(siteName);
                  setIsEditingName(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-1.5 group">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory('All');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-purple-800 transition-colors">
                  {initialLetter}
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  {siteName}
                  {!siteName.includes('.') && <span className="text-purple-700">.ai</span>}
                </span>
              </a>

              <button
                onClick={() => {
                  setTempName(siteName);
                  setIsEditingName(true);
                }}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded transition-all cursor-pointer"
                title="Change website name"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 pl-2 border-l border-slate-200">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated today, Sep 26</span>
          </div>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectCategory('All')}
            className="hover:text-purple-700 transition-colors cursor-pointer"
          >
            All AI Tools
          </button>

          <button
            onClick={onOpenMatchmaker}
            className="inline-flex items-center gap-1.5 text-purple-700 font-semibold hover:text-purple-900 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Advisor</span>
          </button>

          <button
            onClick={() => onSelectCategory('Code & Developer')}
            className="hover:text-purple-700 transition-colors cursor-pointer"
          >
            Coding
          </button>

          <button
            onClick={() => onSelectCategory('Video Creation')}
            className="hover:text-purple-700 transition-colors cursor-pointer"
          >
            Video
          </button>

          <button
            onClick={onOpenNewsletter}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Newsletter</span>
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2.5">
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors cursor-pointer"
              title="Open Tool Comparison"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Compare</span>
              <span className="px-1.5 py-0.2 bg-purple-700 text-white font-bold rounded-full text-[10px] tabular-nums">
                {compareCount}
              </span>
            </button>
          )}

          <button
            onClick={onOpenSaved}
            className="relative inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Saved Tools"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-purple-100 text-purple-700 font-bold rounded-full text-[11px] tabular-nums">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSubmit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit AI Tool</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
