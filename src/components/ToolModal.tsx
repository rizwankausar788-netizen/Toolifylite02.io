import React, { useEffect } from 'react';
import { AITool } from '../types';
import { X, ExternalLink, Bookmark, ShieldCheck, Star, Calendar, TrendingUp, Check, Layers, Copy, CheckCheck, ArrowLeftRight } from 'lucide-react';

interface ToolModalProps {
  tool: AITool | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (toolId: string) => void;
  isComparing?: boolean;
  onToggleCompare?: (toolId: string) => void;
  allTools: AITool[];
  onSelectAlternative: (tool: AITool) => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({
  tool,
  onClose,
  isSaved,
  onToggleSave,
  isComparing = false,
  onToggleCompare,
  allTools,
  onSelectAlternative,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!tool) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + '#' + tool.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const alternatives = allTools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 shadow-xs ${tool.logoBg}`}
            >
              {tool.logoLetter}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 truncate">
                  {tool.name}
                </h2>
                {tool.verified && (
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>{tool.category}</span>
                <span className="text-slate-300">·</span>
                <span className="font-medium text-slate-700">{tool.pricing}</span>
                <span className="text-slate-300">·</span>
                <span>Launched {tool.launchYear}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Tagline & Overview */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1.5">Overview</h3>
            <p className="text-base font-medium text-slate-800 mb-2">
              {tool.tagline}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Est. Monthly Visits</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {tool.monthlyVisits}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Rating</span>
              <div className="flex items-center gap-1 text-base font-bold text-slate-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{tool.rating}</span>
                <span className="text-xs text-slate-400 font-normal">({tool.reviewCount})</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Directory Rank</span>
              <span className="text-base font-bold text-purple-700">
                #{tool.dailyRank}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Pricing Model</span>
              <span className="text-base font-bold text-slate-900">
                {tool.pricing}
              </span>
            </div>
          </div>

          {/* Key Features */}
          {tool.features && tool.features.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2.5">Key Capabilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tool.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Details */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1.5">Pricing Details</h3>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
              {tool.pricingDetails}
            </p>
          </div>

          {/* Similar Tools */}
          {alternatives.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2.5">
                Top Alternatives in {tool.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => onSelectAlternative(alt)}
                    className="p-3 text-left bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${alt.logoBg}`}>
                        {alt.logoLetter}
                      </div>
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                        {alt.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{alt.tagline}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(tool.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isComparing
                    ? 'bg-purple-100 border-purple-300 text-purple-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{isComparing ? 'In Compare Dock' : 'Add to Compare'}</span>
              </button>
            )}

            <button
              onClick={() => onToggleSave(tool.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-purple-50 border-purple-300 text-purple-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved to Bookmarks' : 'Bookmark Tool'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              title="Copy share link"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs transition-colors"
          >
            <span>Visit {tool.name}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
