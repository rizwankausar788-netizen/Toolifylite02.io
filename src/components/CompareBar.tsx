import React from 'react';
import { AITool } from '../types';
import { ArrowRight, X, Sparkles, SlidersHorizontal } from 'lucide-react';

interface CompareBarProps {
  selectedTools: AITool[];
  onOpenCompare: () => void;
  onRemoveTool: (toolId: string) => void;
  onClearAll: () => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({
  selectedTools,
  onOpenCompare,
  onRemoveTool,
  onClearAll,
}) => {
  if (selectedTools.length === 0) return null;

  return (
    <aside
      aria-label="Comparison dock"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Left: Tool avatars and count */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center -space-x-1.5 overflow-hidden">
          {selectedTools.map((tool) => (
            <div
              key={tool.id}
              className={`w-7 h-7 rounded-lg ring-2 ring-slate-900 flex items-center justify-center font-bold text-xs shrink-0 ${tool.logoBg}`}
              title={tool.name}
            >
              {tool.logoLetter}
            </div>
          ))}
        </div>

        <div className="min-w-0 hidden sm:block">
          <div className="text-xs font-semibold text-slate-200">
            Compare Tools ({selectedTools.length}/4)
          </div>
          <div className="text-[11px] text-slate-400 truncate max-w-[240px]">
            {selectedTools.map((t) => t.name).join(' vs ')}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onClearAll}
          className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer text-xs"
          title="Clear all"
        >
          <X className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenCompare}
          disabled={selectedTools.length < 2}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
            selectedTools.length >= 2
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-200" />
          <span>
            {selectedTools.length >= 2
              ? `Compare ${selectedTools.length} Tools`
              : 'Select 1 more to compare'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
