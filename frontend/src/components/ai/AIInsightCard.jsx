import React, { useState } from 'react';
import { Sparkles, Send, Bot, RefreshCw } from 'lucide-react';

// Helper to format inline bold strings like **text**
const renderInlineFormatting = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-extrabold text-slate-900 dark:text-white">
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

// Formatted Markdown component to render raw AI text into rich React elements
const FormattedMarkdown = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-3 font-sans text-sm text-slate-700 dark:text-slate-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Headers: ### Title or ## Title or # Title
        if (trimmed.startsWith('#')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <h3
              key={idx}
              className="text-base font-bold text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2"
            >
              {renderInlineFormatting(headerText)}
            </h3>
          );
        }

        // Bullet lists: * item or - item
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const itemText = trimmed.substring(2);
          return (
            <div
              key={idx}
              className="flex items-start gap-3 my-2 p-3.5 rounded-xl bg-slate-100/70 dark:bg-navy-900/40 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200"
            >
              <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
              <div className="flex-1 leading-relaxed">
                {renderInlineFormatting(itemText)}
              </div>
            </div>
          );
        }

        // Numbered lists: 1. item, 2. item
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const itemText = numMatch[2];
          return (
            <div
              key={idx}
              className="flex items-start gap-3 my-2 p-3.5 rounded-xl bg-slate-100/80 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            >
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
                {num}
              </span>
              <div className="flex-1 leading-relaxed">
                {renderInlineFormatting(itemText)}
              </div>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export const AIInsightCard = ({ insightData, onAskAI, loading = false }) => {
  const [query, setQuery] = useState('');

  const sampleQueries = [
    'Where did I spend the most this month?',
    'How can I optimize my monthly food budget?',
    'What is my savings potential based on current spending?',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onAskAI(query);
    setQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Ask AI Box */}
      <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">SmartExpense AI Financial Advisor</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask natural questions about your calculated finances</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask AI: e.g. 'Where did I spend the most this month?'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl glass-input text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Ask AI
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onAskAI(q)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/40 text-xs font-medium transition-all"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* AI Output Response Card */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Generated Insights & Financial Advice</h4>
          </div>
          {insightData?.provider && (
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 text-xs font-bold">
              Engine: {insightData.provider}
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Analyzing calculated metrics & generating advice...</p>
          </div>
        ) : insightData?.insight ? (
          <FormattedMarkdown content={insightData.insight} />
        ) : (
          <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
            Click 'Ask AI' or select a suggestion above to analyze your monthly finances.
          </div>
        )}
      </div>
    </div>
  );
};
