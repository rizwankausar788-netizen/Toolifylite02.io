import React from 'react';
import { AITool } from '../types';
import { Bookmark, ExternalLink, ShieldCheck, Star, ArrowLeftRight } from 'lucide-react';

interface ToolCardProps {
  tool: AITool;
  isSaved: boolean;
  onToggleSave: (toolId: string) => void;
  onSelectTool: (tool: AITool) => void;
  isComparing?: boolean;
  onToggleCompare?: (toolId: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isSaved,
  onToggleSave,
  onSelectTool,
  isComparing = false,
  onToggleCompare,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border p-4 transition-all hover:shadow-xs flex flex-col justify-between group ${
        isComparing ? 'border-purple-500 ring-1 ring-purple-500/30' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Top Header: Logo, Name & Verified, Bookmark & Compare */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${tool.logoBg}`}
            >
              {tool.logoLetter}
            </div>

            {/* Name + Verified indicator */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelectTool(tool)}
                  className="font-bold text-slate-900 hover:text-blue-600 text-[15px] truncate transition-colors text-left cursor-pointer"
                >
                  {tool.name}
                </button>
                {tool.verified && (
                  <span title="Verified Directory Tool" className="inline-flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  </span>
                )}
              </div>

              {/* Quiet category subhead */}
              <div className="text-xs text-slate-400 truncate">
                {tool.category}
              </div>
            </div>
          </div>

          {/* Action buttons: Compare toggle & Bookmark */}
          <div className="flex items-center gap-1 shrink-0">
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(tool.id)}
                className={`p-1.5 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                  isComparing
                    ? 'text-purple-700 bg-purple-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isComparing ? 'Remove from comparison' : 'Add to compare'}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => onToggleSave(tool.id)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isSaved
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save tool'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Short description */}
        <p className="text-xs sm:text-[13px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {tool.description}
        </p>
      </div>

      {/* Footer: Zero-pill unboxed metadata + Action links */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
        {/* Clean unboxed metadata with typographic separators */}
        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] sm:text-xs truncate">
          <span className="font-semibold text-slate-800">{tool.pricing}</span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-slate-600">{tool.monthlyVisits} visits</span>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
          <span className="hidden sm:inline-flex items-center gap-0.5 text-amber-600 font-medium">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{tool.rating}</span>
          </span>
        </div>

        {/* Actions: Blue links */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onSelectTool(tool)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            Details
          </button>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-xs text-slate-400 hover:text-blue-600 transition-colors p-0.5"
            title={`Visit ${tool.name} official website`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
