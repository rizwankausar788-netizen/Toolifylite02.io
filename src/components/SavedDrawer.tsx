import React from 'react';
import { AITool } from '../types';
import { X, Bookmark, Trash2, ExternalLink, Download } from 'lucide-react';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedTools: AITool[];
  onRemoveSaved: (toolId: string) => void;
  onClearAll: () => void;
  onSelectTool: (tool: AITool) => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedTools,
  onRemoveSaved,
  onClearAll,
  onSelectTool,
}) => {
  if (!isOpen) return null;

  const handleExport = () => {
    const data = JSON.stringify(savedTools, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saved-ai-tools-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-purple-700 fill-current" />
            <h2 className="text-base font-bold text-slate-900">
              Saved Tools ({savedTools.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {savedTools.length > 0 && (
              <button
                onClick={handleExport}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                title="Export as JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedTools.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">
                No saved tools yet
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the bookmark icon on any AI tool card to save and compare them later.
              </p>
            </div>
          ) : (
            savedTools.map((tool) => (
              <div
                key={tool.id}
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${tool.logoBg}`}
                  >
                    {tool.logoLetter}
                  </div>

                  <div className="min-w-0">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectTool(tool);
                      }}
                      className="font-bold text-slate-900 hover:text-blue-600 text-sm truncate text-left cursor-pointer"
                    >
                      {tool.name}
                    </button>
                    <p className="text-xs text-slate-500 truncate">{tool.tagline}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{tool.category}</span>
                      <span>·</span>
                      <span className="font-medium text-slate-600">{tool.pricing}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Visit site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => onRemoveSaved(tool.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedTools.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
            >
              Clear All Saved
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
