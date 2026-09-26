import React, { useState } from 'react';
import { CategoryType, PricingType, AITool } from '../types';
import { CATEGORIES } from '../data/tools';
import { X, Plus, Sparkles, Check, ExternalLink } from 'lucide-react';

interface SubmitModalProps {
  siteName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTool: AITool) => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  siteName = 'ToolVerse',
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('Code & Developer');
  const [pricing, setPricing] = useState<PricingType>('Freemium');
  const [pricingDetails, setPricingDetails] = useState('');
  const [features, setFeatures] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim() || !tagline.trim()) return;

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const featureList = features
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const newTool: AITool = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4),
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim() || tagline.trim(),
      category,
      pricing,
      pricingDetails: pricingDetails.trim() || `${pricing} tier available.`,
      monthlyVisits: 'New Tool',
      monthlyVisitsNum: 1000,
      rating: 5.0,
      reviewCount: 1,
      url: formattedUrl,
      logoBg: 'bg-purple-700 text-white',
      logoLetter: name.trim().charAt(0).toUpperCase(),
      verified: true,
      dailyRank: 999,
      features: featureList.length > 0 ? featureList : ['Fast AI integration', 'Cloud API access'],
      launchYear: 2026,
    };

    onSubmit(newTool);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 1800);
  };

  const availableCategories = CATEGORIES.filter((c) => c.label !== 'All').map((c) => c.label);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Submit an AI Tool
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add your product to the {siteName} directory to reach thousands of tech adopters.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Tool Successfully Submitted!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your AI tool has been indexed into the directory and is now searchable and ready for discovery.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tool Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. PromptEngine AI"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website URL *
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Tagline (1 sentence) *
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Autonomous AI workflow agent for engineering teams"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-purple-600 bg-white"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pricing Model *
                </label>
                <select
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value as PricingType)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-purple-600 bg-white"
                >
                  <option value="Freemium">Freemium</option>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                  <option value="Free Trial">Free Trial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what the tool does, who it's for, and core advantages..."
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Key Features (comma-separated)
              </label>
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="e.g. Next.js export, Real-time sync, Claude 3.7 integration"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Publish to Directory
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
