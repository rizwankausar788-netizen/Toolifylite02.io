import React, { useState } from 'react';
import { AITool } from '../types';
import { X, ExternalLink, Sparkles, Check, Minus, Trash2, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: AITool[];
  onRemoveTool: (toolId: string) => void;
  onClearAll: () => void;
  onSelectAlternative: (tool: AITool) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  tools,
  onRemoveTool,
  onClearAll,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiModelUsed, setAiModelUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || tools.length === 0) return null;

  const handleRunAiComparison = async () => {
    setLoadingAi(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAiAnalysis(data.analysis);
        setAiModelUsed(data.model);
      }
    } catch (err: any) {
      console.error(err);
      setError('Unable to reach the comparison engine. Please try again.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Collect union of all features
  const allFeatures = Array.from(
    new Set(tools.flatMap((t) => t.features || []))
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-bold text-purple-700 bg-purple-100 rounded">
                COMPARE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Side-by-Side Tool Comparison ({tools.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Compare features, monthly user traffic, pricing tiers, and AI synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAiComparison}
              disabled={loadingAi || tools.length < 2}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loadingAi ? 'Analyzing...' : 'Gemini AI Insights'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* AI Comparison Analysis Box (if generated) */}
          {aiAnalysis && (
            <div className="bg-purple-50/60 rounded-xl border border-purple-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <h3 className="text-sm font-bold text-purple-950 uppercase tracking-wider">
                    Gemini AI Comparative Synthesis
                  </h3>
                </div>
                <span className="text-[11px] text-purple-600 font-mono">
                  {aiModelUsed}
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                {aiAnalysis}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Side by side comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-50 text-xs font-semibold text-slate-500 w-36 sm:w-48 border-b border-slate-200">
                    Product / Spec
                  </th>
                  {tools.map((tool) => (
                    <th
                      key={tool.id}
                      className="p-3 sm:p-4 bg-white border-b border-slate-200 min-w-[200px]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${tool.logoBg}`}
                          >
                            {tool.logoLetter}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-slate-900 text-sm">
                                {tool.name}
                              </span>
                              {tool.verified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {tool.category}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveTool(tool.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2.5">
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <span>Visit Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {/* Tagline */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-500">
                    Tagline
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-3 leading-relaxed">
                      {tool.tagline}
                    </td>
                  ))}
                </tr>

                {/* Pricing Model */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-500">
                    Pricing Model
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-3">
                      <span className="font-bold text-slate-900 text-sm">
                        {tool.pricing}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Pricing Details */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-500">
                    Plan Details
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-3 leading-relaxed text-slate-600">
                      {tool.pricingDetails}
                    </td>
                  ))}
                </tr>

                {/* Monthly Traffic */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-500">
                    Monthly Traffic
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-3">
                      <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                        {tool.monthlyVisits}
                      </span>
                      <span className="text-slate-400 text-[11px] block">
                        Rank #{tool.dailyRank}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* User Rating */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-500">
                    User Rating
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-3">
                      <div className="flex items-center gap-1 font-semibold text-slate-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{tool.rating}</span>
                        <span className="text-slate-400 font-normal text-[11px]">
                          ({tool.reviewCount.toLocaleString()} reviews)
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Launch Year */}
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-500">
                    Launched
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-3 text-slate-600">
                      {tool.launchYear}
                    </td>
                  ))}
                </tr>

                {/* Feature Comparison Rows */}
                {allFeatures.slice(0, 6).map((feat) => (
                  <tr key={feat}>
                    <td className="p-3 bg-slate-50 font-medium text-slate-600">
                      {feat}
                    </td>
                    {tools.map((tool) => {
                      const hasFeat = tool.features?.includes(feat);
                      return (
                        <td key={tool.id} className="p-3">
                          {hasFeat ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Supported</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400">
                              <Minus className="w-4 h-4" />
                              <span>Not specified</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={onClearAll}
            className="text-slate-500 hover:text-rose-600 font-medium cursor-pointer transition-colors"
          >
            Clear Comparison Selection
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
