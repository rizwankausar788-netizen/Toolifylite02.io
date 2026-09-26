import React, { useState } from 'react';
import { AITool } from '../types';
import { X, Sparkles, Send, Bot, Lightbulb, Check, ArrowRight, ExternalLink } from 'lucide-react';

interface AIMatchmakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTools: AITool[];
  onSelectTool: (tool: AITool) => void;
}

const PRESET_PROMPTS = [
  'Create faceless YouTube shorts with realistic AI voice and video generation on a $30 budget',
  'Autonomous full-stack web development stack for a solo SaaS founder',
  'Best open-source alternatives to proprietary coding and LLM tools',
  'Automate client meeting transcription and synthesis into Notion without bots joining calls',
];

export const AIMatchmakerModal: React.FC<AIMatchmakerModalProps> = ({
  isOpen,
  onClose,
  availableTools,
  onSelectTool,
}) => {
  const [problem, setProblem] = useState('');
  const [role, setRole] = useState('Solo Founder / Developer');
  const [budget, setBudget] = useState('Under $30/month');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAskAI = async (promptText?: string) => {
    const textToSubmit = promptText || problem;
    if (!textToSubmit.trim()) return;

    if (promptText) {
      setProblem(promptText);
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: textToSubmit,
          role,
          budget,
          catalogTools: availableTools.slice(0, 30),
        }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.recommendation);
        setModelUsed(data.model);
      }
    } catch (err: any) {
      console.error(err);
      setError('Unable to contact the AI Matchmaker service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  AI Stack Matchmaker
                </h2>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  Powered by Gemini
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Describe your project goal, budget, and requirements for a customized AI tool recipe.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Input Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What are you trying to build or achieve?
              </label>
              <textarea
                rows={3}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g. I need to generate realistic marketing visuals, edit product photos, and design ad copies on a low budget..."
                className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 resize-none bg-slate-50/50"
              />
            </div>

            {/* Quick parameter selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Your Role:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none focus:border-purple-600 bg-white"
                >
                  <option value="Solo Founder / Developer">Solo Founder / Developer</option>
                  <option value="Content Creator / Video Producer">Content Creator / Video Producer</option>
                  <option value="Product Manager / Marketer">Product Manager / Marketer</option>
                  <option value="Student / Academic Researcher">Student / Academic Researcher</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Monthly Budget Target:
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none focus:border-purple-600 bg-white"
                >
                  <option value="Free / Open-Source only">Free / Open-Source only ($0)</option>
                  <option value="Under $30/month">Under $30/month</option>
                  <option value="Under $100/month">Under $100/month</option>
                  <option value="Enterprise / Scale">Enterprise / Scale</option>
                </select>
              </div>
            </div>

            {/* Inspiration presets */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1.5">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                Quick presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PROMPTS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskAI(preset)}
                    className="text-[11px] text-slate-600 hover:text-purple-700 bg-slate-100 hover:bg-purple-50 px-2.5 py-1 rounded-md transition-colors text-left cursor-pointer"
                  >
                    {preset.slice(0, 48)}...
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleAskAI()}
              disabled={loading || !problem.trim()}
              className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Optimal AI Stack...' : 'Generate AI Stack Recommendation'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* AI Result View */}
          {result && (
            <div className="p-4 sm:p-5 bg-purple-50/50 rounded-xl border border-purple-200 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-3 border-b border-purple-100 pb-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                    Recommended AI Stack &amp; Workflow
                  </span>
                </div>
                <span className="text-[11px] font-mono text-purple-600">
                  {modelUsed}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line space-y-2">
                {result}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Real-time recommendations grounded in 28,000+ indexed AI products.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
