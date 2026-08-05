'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, Cpu, Clock, CheckCircle2 } from 'lucide-react';

export interface GeneratedRecord {
  id?: string;
  productName: string;
  color: string;
  material: string;
  features: string;
  tone: string;
  generatedDescription: string;
  modelUsed?: string;
  createdAt?: string;
}

interface DescriptionCardProps {
  data: GeneratedRecord | null;
  isLoading: boolean;
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({ data, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data?.generatedDescription) return;
    navigator.clipboard.writeText(data.generatedDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-8 shadow-xl border border-slate-800/80 min-h-[420px] flex flex-col items-center justify-center text-center">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Sparkles className="h-6 w-6 text-indigo-400 absolute animate-pulse" />
        </div>
        <h3 className="text-base font-semibold text-white">Synthesizing Product Copy</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Passing attributes to the Docker AI Model container & persisting to database...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card rounded-2xl p-8 shadow-xl border border-slate-800/80 min-h-[420px] flex flex-col items-center justify-center text-center border-dashed">
        <div className="h-12 w-12 rounded-2xl bg-indigo-950/50 border border-indigo-800/40 flex items-center justify-center mb-3">
          <Sparkles className="h-6 w-6 text-indigo-400" />
        </div>
        <h3 className="text-base font-medium text-slate-300">Ready to Generate</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Fill in the product details on the left and click "Generate Description" to view AI marketing copy.
        </p>
      </div>
    );
  }

  const wordsCount = data.generatedDescription.trim().split(/\s+/).length;

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300">
              {data.productName}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300">
              Tone: {data.tone}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-slate-400">
              {data.color} • {data.material}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium transition-all shadow-md shadow-indigo-600/20"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Description Body */}
        <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
          {data.generatedDescription}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 text-slate-400">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" /> {data.modelUsed || 'Docker AI Model'}
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Persisted to DB
          </span>
        </div>

        <div className="flex items-center space-x-2 text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{wordsCount} words</span>
        </div>
      </div>
    </div>
  );
};
