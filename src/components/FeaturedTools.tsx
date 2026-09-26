import React from 'react';
import { AITool } from '../types';
import { ExternalLink, Bookmark, Sparkles, Star } from 'lucide-react';

interface FeaturedToolsProps {
  tools: AITool[];
  savedToolIds: Set<string>;
  onToggleSave: (toolId: string) => void;
  onSelectTool: (tool: AITool) => void;
}

export const FeaturedTools: React.FC<FeaturedToolsProps> = ({
  tools,
  savedToolIds,
  onToggleSave,
  onSelectTool,
}) => {
  const featured = tools.filter((t) => t.featured || t.sponsored).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="bg-purple-50/50 rounded-2xl border border-purple-100 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-950">
              Featured &amp; Sponsored AI Tools
            </h2>
          </div>
          <span className="text-xs text-purple-600 font-medium hidden sm:inline">
            Promoted by AI builders
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {featured.map((tool) => {
            const isSaved = savedToolIds.has(tool.id);

            return (
              <div
                key={tool.id}
                className="bg-white rounded-xl p-4 border border-purple-200/70 hover:border-purple-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${tool.logoBg}`}
                      >
                        {tool.logoLetter}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectTool(tool)}
                            className="font-bold text-slate-900 hover:text-blue-600 text-sm truncate transition-colors text-left cursor-pointer"
                          >
                            {tool.name}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {tool.category}
                        </div>
                      </div>
                    </div>

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

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {tool.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-800">{tool.pricing}</span>
                    <span className="text-slate-300">·</span>
                    <span className="tabular-nums font-mono text-slate-600">{tool.monthlyVisits}</span>
                  </div>

                  <div className="flex items-center gap-2">
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
                      className="text-slate-400 hover:text-slate-700 p-1"
                      title={`Visit ${tool.name}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
