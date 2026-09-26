/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_TOOLS } from './data/tools';
import { AITool, CategoryType, PricingType } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedTools } from './components/FeaturedTools';
import { FilterBar } from './components/FilterBar';
import { ToolCard } from './components/ToolCard';
import { ToolListItem } from './components/ToolListItem';
import { ToolModal } from './components/ToolModal';
import { SubmitModal } from './components/SubmitModal';
import { SavedDrawer } from './components/SavedDrawer';
import { CompareBar } from './components/CompareBar';
import { CompareModal } from './components/CompareModal';
import { AIMatchmakerModal } from './components/AIMatchmakerModal';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { SearchX, Sparkles, Filter } from 'lucide-react';

export default function App() {
  // Website Brand Name (customizable, defaults to ToolVerse)
  const [siteName, setSiteName] = useState(() => {
    return localStorage.getItem('toolverse_site_name') || 'ToolVerse';
  });

  const handleRenameSiteName = (newName: string) => {
    setSiteName(newName);
    localStorage.setItem('toolverse_site_name', newName);
    document.title = `${newName} - AI Tools & Websites Directory`;
  };

  // Directory state
  const [tools, setTools] = useState<AITool[]>(() => {
    const saved = localStorage.getItem('toolify_custom_tools');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_TOOLS];
      } catch (e) {
        return INITIAL_TOOLS;
      }
    }
    return INITIAL_TOOLS;
  });

  // Saved / Bookmarked tools state
  const [savedToolIds, setSavedToolIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('toolify_saved_ids');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        return new Set();
      }
    }
    // Default with 2 saved tools for immediate delight
    return new Set(['cursor', 'claude']);
  });

  // Comparison state (up to 4 tools)
  const [compareToolIds, setCompareToolIds] = useState<Set<string>>(new Set());
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // AI Matchmaker Modal state
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedPricing, setSelectedPricing] = useState<PricingType | 'All'>('All');
  const [sortBy, setSortBy] = useState<'traffic' | 'rating' | 'newest' | 'name'>('traffic');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal / Drawer state
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Sync saved tool IDs to localStorage
  useEffect(() => {
    localStorage.setItem('toolify_saved_ids', JSON.stringify(Array.from(savedToolIds)));
  }, [savedToolIds]);

  // Toggle bookmark handler
  const handleToggleSave = (toolId: string) => {
    setSavedToolIds((prev) => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        next.add(toolId);
      }
      return next;
    });
  };

  // Remove saved handler
  const handleRemoveSaved = (toolId: string) => {
    setSavedToolIds((prev) => {
      const next = new Set(prev);
      next.delete(toolId);
      return next;
    });
  };

  // Clear all saved handler
  const handleClearAllSaved = () => {
    setSavedToolIds(new Set());
  };

  // Comparison handlers
  const handleToggleCompare = (toolId: string) => {
    setCompareToolIds((prev) => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        if (next.size >= 4) {
          // Keep max 4
          const arr = Array.from(next);
          arr.shift();
          arr.push(toolId);
          return new Set(arr);
        }
        next.add(toolId);
      }
      return next;
    });
  };

  const handleRemoveCompareTool = (toolId: string) => {
    setCompareToolIds((prev) => {
      const next = new Set(prev);
      next.delete(toolId);
      return next;
    });
  };

  const handleClearAllCompare = () => {
    setCompareToolIds(new Set());
    setIsCompareModalOpen(false);
  };

  const handleQuickCompare = (id1: string, id2: string) => {
    setCompareToolIds(new Set([id1, id2]));
    setIsCompareModalOpen(true);
  };

  // New tool submission
  const handleAddTool = (newTool: AITool) => {
    setTools((prev) => {
      const updated = [newTool, ...prev];
      const customOnes = updated.filter((t) => !INITIAL_TOOLS.some((it) => it.id === t.id));
      localStorage.setItem('toolify_custom_tools', JSON.stringify(customOnes));
      return updated;
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPricing('All');
    setSortBy('traffic');
    setVerifiedOnly(false);
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedCategory !== 'All' ||
    selectedPricing !== 'All' ||
    verifiedOnly ||
    sortBy !== 'traffic'
  );

  // Compute filtered & sorted tools
  const filteredTools = useMemo(() => {
    let result = [...tools];

    // Search query filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((t) => {
        return (
          t.name.toLowerCase().includes(query) ||
          t.tagline.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          (t.secondaryCategories && t.secondaryCategories.some((sc) => sc.toLowerCase().includes(query))) ||
          (t.features && t.features.some((f) => f.toLowerCase().includes(query)))
        );
      });
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (t) => t.category === selectedCategory || (t.secondaryCategories && t.secondaryCategories.includes(selectedCategory))
      );
    }

    // Pricing filter
    if (selectedPricing !== 'All') {
      result = result.filter((t) => t.pricing === selectedPricing);
    }

    // Verified only filter
    if (verifiedOnly) {
      result = result.filter((t) => t.verified);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'traffic') {
        return b.monthlyVisitsNum - a.monthlyVisitsNum;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'newest') {
        return b.launchYear - a.launchYear;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [tools, searchQuery, selectedCategory, selectedPricing, verifiedOnly, sortBy]);

  // Saved tools list for drawer
  const savedToolsList = useMemo(() => {
    return tools.filter((t) => savedToolIds.has(t.id));
  }, [tools, savedToolIds]);

  // Tools selected for comparison
  const compareToolsList = useMemo(() => {
    return tools.filter((t) => compareToolIds.has(t.id));
  }, [tools, compareToolIds]);

  const scrollToNewsletter = () => {
    const el = document.getElementById('newsletter');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-purple-100 selection:text-purple-900 pb-16">
      {/* Navigation Bar */}
      <Navbar
        siteName={siteName}
        onRenameSiteName={handleRenameSiteName}
        savedCount={savedToolIds.size}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat as CategoryType)}
        activeCategory={selectedCategory}
        onOpenMatchmaker={() => setIsMatchmakerOpen(true)}
        onOpenNewsletter={scrollToNewsletter}
        compareCount={compareToolIds.size}
        onOpenCompare={() => setIsCompareModalOpen(true)}
      />

      {/* Hero: Headline, Trust Signals & Search First Bar */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onTagClick={(tag) => {
          setSearchQuery(tag);
          window.scrollTo({ top: 260, behavior: 'smooth' });
        }}
        totalToolsCount={28450}
        onOpenMatchmaker={() => setIsMatchmakerOpen(true)}
        onQuickCompare={handleQuickCompare}
      />

      {/* Featured / Sponsored Spotlight (Shown when no search query is active) */}
      {!searchQuery && selectedCategory === 'All' && (
        <FeaturedTools
          tools={tools}
          savedToolIds={savedToolIds}
          onToggleSave={handleToggleSave}
          onSelectTool={(tool) => setSelectedTool(tool)}
        />
      )}

      {/* Filter and Category Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedPricing={selectedPricing}
        onSelectPricing={setSelectedPricing}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        verifiedOnly={verifiedOnly}
        onToggleVerified={() => setVerifiedOnly((prev) => !prev)}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        totalResults={filteredTools.length}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Main Directory Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {filteredTools.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No AI tools found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              We couldn't find any tools matching your criteria. Try adjusting your search query, category, or pricing filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isSaved={savedToolIds.has(tool.id)}
                onToggleSave={handleToggleSave}
                onSelectTool={(t) => setSelectedTool(t)}
                isComparing={compareToolIds.has(tool.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTools.map((tool) => (
              <ToolListItem
                key={tool.id}
                tool={tool}
                isSaved={savedToolIds.has(tool.id)}
                onToggleSave={handleToggleSave}
                onSelectTool={(t) => setSelectedTool(t)}
                isComparing={compareToolIds.has(tool.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        )}
      </main>

      {/* Newsletter Signup Section */}
      <NewsletterSection />

      {/* Floating Compare Action Bar (docked when 1+ tools selected) */}
      <CompareBar
        selectedTools={compareToolsList}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onRemoveTool={handleRemoveCompareTool}
        onClearAll={handleClearAllCompare}
      />

      {/* Side-by-Side Tool Comparison Modal with Gemini AI */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        tools={compareToolsList}
        onRemoveTool={handleRemoveCompareTool}
        onClearAll={handleClearAllCompare}
        onSelectAlternative={(alt) => {
          setSelectedTool(alt);
          setIsCompareModalOpen(false);
        }}
      />

      {/* AI Stack Matchmaker Modal (Gemini API) */}
      <AIMatchmakerModal
        isOpen={isMatchmakerOpen}
        onClose={() => setIsMatchmakerOpen(false)}
        availableTools={tools}
        onSelectTool={(t) => {
          setSelectedTool(t);
          setIsMatchmakerOpen(false);
        }}
      />

      {/* Tool Inspection Modal */}
      <ToolModal
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
        isSaved={selectedTool ? savedToolIds.has(selectedTool.id) : false}
        onToggleSave={handleToggleSave}
        isComparing={selectedTool ? compareToolIds.has(selectedTool.id) : false}
        onToggleCompare={handleToggleCompare}
        allTools={tools}
        onSelectAlternative={(alt) => setSelectedTool(alt)}
      />

      {/* Tool Submission Modal */}
      <SubmitModal
        siteName={siteName}
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmit={handleAddTool}
      />

      {/* Saved Tools Slideover Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedTools={savedToolsList}
        onRemoveSaved={handleRemoveSaved}
        onClearAll={handleClearAllSaved}
        onSelectTool={(t) => setSelectedTool(t)}
      />

      {/* Footer */}
      <Footer siteName={siteName} onSelectCategory={setSelectedCategory} />
    </div>
  );
}
