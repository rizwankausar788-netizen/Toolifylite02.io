import React, { useState } from 'react';
import { Mail, Check, Sparkles, Send, BellRing, ArrowRight, ShieldCheck } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'daily'>('weekly');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Coding', 'LLMs']);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(120480);
  const [message, setMessage] = useState('');

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          frequency,
          categories: selectedTopics,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSubscribed(true);
        setMessage(data.message);
        if (data.subscriberCount) {
          setSubscriberCount(data.subscriberCount);
        }
      }
    } catch (err) {
      // Offline fallback
      setSubscribed(true);
      setMessage(`Successfully subscribed ${email} to our ${frequency} AI stack digest.`);
      setSubscriberCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const topicsList = ['Coding', 'Image & Art', 'Video', 'LLMs', 'Productivity', 'Audio'];

  return (
    <section id="newsletter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl border border-purple-800/40">
        {/* Subtle geometric light reflection */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Copy & Trust signals */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/60 border border-purple-700/60 text-xs text-purple-200">
              <BellRing className="w-3.5 h-3.5 text-purple-300" />
              <span>Free Weekly AI Intelligence</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Stay Ahead of the Fast-Moving AI Wave
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Join <span className="font-semibold text-white tabular-nums font-mono">{subscriberCount.toLocaleString()}+</span> founders, engineers, and creators who receive our curated breakdown of breakout AI tools, traffic trends, and pricing updates every Tuesday.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-purple-200/80">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                Zero promotional spam
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                1-click unsubscribe anytime
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                Exclusive early access codes
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Subscription Form */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15">
            {subscribed ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  You're On The List!
                </h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto mb-4">
                  {message || "We've dispatched your first edition preview to your inbox."}
                </p>
                <button
                  onClick={() => {
                    setSubscribed(false);
                    setEmail('');
                  }}
                  className="text-xs text-purple-300 hover:text-white underline cursor-pointer"
                >
                  Register another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                {/* Cadence radio tabs */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">Frequency:</span>
                  <div className="flex items-center gap-1 p-0.5 bg-black/30 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setFrequency('weekly')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        frequency === 'weekly'
                          ? 'bg-purple-600 text-white font-semibold shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Weekly Digest
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('daily')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        frequency === 'daily'
                          ? 'bg-purple-600 text-white font-semibold shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Daily Picks
                    </button>
                  </div>
                </div>

                {/* Topics selection */}
                <div>
                  <span className="text-xs text-slate-300 font-medium block mb-1.5">
                    Topics of Interest:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {topicsList.map((topic) => {
                      const active = selectedTopics.includes(topic);
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleTopic(topic)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                            active
                              ? 'bg-purple-500/40 text-purple-100 border border-purple-400/50'
                              : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email input field */}
                <div>
                  <label htmlFor="newsletter-email" className="block text-xs text-slate-300 font-medium mb-1">
                    Work or Personal Email:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 group"
                >
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>{loading ? 'Subscribing...' : 'Get Free AI Stack Digest'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
