import React from 'react';
import { AITool } from '../types';
import { Bookmark, ExternalLink, ShieldCheck, Star, ArrowLeftRight } from 'lucide-react';

interface ToolListItemProps {
  tool: AITool;
  isSaved: boolean;
  onToggleSave: (toolId: string) => void;
  onSelectTool: (tool: AITool) => void;
  isComparing?: boolean;
  onToggleCompare?: (toolId: string) => void;
}

export const ToolListItem: React.FC<ToolListItemProps> = ({
  tool,
  isSaved,
  onToggleSave,
  onSelectTool,
  isComparing = false,
  onToggleCompare,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border p-3.5 sm:px-4 sm:py-3 transition-all hover:shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isComparing ? 'border-purple-500 ring-1 ring-purple-500/30' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Left: Brand + Name + Tagline */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${tool.logoBg}`}
        >
          {tool.logoLetter}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onSelectTool(tool)}
              className="font-bold text-slate-900 hover:text-blue-600 text-sm transition-colors text-left cursor-pointer"
            >
              {tool.name}
            </button>
            {tool.verified && (
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            )}
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{tool.category}</span>
          </div>

          <p className="text-xs text-slate-600 truncate mt-0.5 max-w-xl">
            {tool.tagline}
          </p>
        </div>
      </div>

      {/* Middle/Right: Unboxed stats + Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 text-xs">
        {/* Unboxed metadata */}
        <div className="flex items-center gap-2.5 text-slate-500 text-xs">
          <span className="font-semibold text-slate-800">{tool.pricing}</span>
          <span className="text-slate-300">·</span>
          <span className="font-mono tabular-nums text-slate-600">{tool.monthlyVisits}</span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-0.5 text-amber-600 font-medium">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{tool.rating}</span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(tool.id)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer text-xs ${
                isComparing
                  ? 'text-purple-700 bg-purple-100 font-semibold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={isComparing ? 'Remove from compare' : 'Add to compare'}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onSelectTool(tool)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer px-1"
          >
            Details
          </button>

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
            title={`Visit ${tool.name}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => onToggleSave(tool.id)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isSaved
                ? 'text-purple-700 bg-purple-50'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Saved to bookmarks' : 'Save tool'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
