import React from 'react';
import { CATEGORIES } from '../data/tools';
import { CategoryType } from '../types';

interface FooterProps {
  siteName?: string;
  onSelectCategory: (cat: CategoryType) => void;
}

export const Footer: React.FC<FooterProps> = ({ siteName = 'ToolVerse', onSelectCategory }) => {
  const initialLetter = siteName.charAt(0).toUpperCase() || 'T';

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-sm">
                {initialLetter}
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                {siteName}
                {!siteName.includes('.') && <span className="text-purple-700">.ai</span>}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The daily updated directory of high-utility artificial intelligence software, models, and creator tools.
            </p>
            <p className="text-[11px] text-slate-400">
              Rankings updated daily · Real web traffic indices
            </p>
          </div>

          {/* Popular Categories Col 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Core Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onSelectCategory('Code & Developer')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Coding &amp; Software Agents
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Image & Art')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  AI Image &amp; Design Studios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Text & Writing')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  LLMs &amp; Reasoning Engines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Video Creation')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Generative Video &amp; Avatars
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              More Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onSelectCategory('Audio & Voice')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Speech &amp; Music Synthesis
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Productivity')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Productivity &amp; Meeting Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Marketing & SEO')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  SEO &amp; Growth Automation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Research & Data')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Scientific Research &amp; Datasets
                </button>
              </li>
            </ul>
          </div>

          {/* Directory & Stats */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              {siteName} Directory
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <span className="text-slate-500">Total Listed Tools:</span>{' '}
                <strong className="text-slate-800 font-semibold">28,450+</strong>
              </li>
              <li>
                <span className="text-slate-500">Categories:</span>{' '}
                <strong className="text-slate-800 font-semibold">240+</strong>
              </li>
              <li>
                <span className="text-slate-500">Data Cadence:</span>{' '}
                <span className="text-emerald-600 font-medium">Daily verified</span>
              </li>
              <li className="pt-1">
                <span className="text-[11px] text-slate-400">
                  Built for fast, scan-friendly AI discovery.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} {siteName}. All product names and logos are trademarks of their respective owners.</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Privacy</span>
            <span>·</span>
            <span>Terms</span>
            <span>·</span>
            <span>Submit Tool</span>
            <span>·</span>
            <span>Advertise</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
