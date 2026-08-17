'use client';

import React, { useState } from 'react';

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

  if (isLoading && !data) {
    return (
      <div className="neu-card p-8 min-h-[480px] flex flex-col items-center justify-center text-center bg-zinc-900">
        <h3 className="text-base font-black text-zinc-100">Generating Description...</h3>
        <p className="text-xs text-zinc-400 font-medium max-w-sm mt-1">
          Processing product attributes and crafting ecommerce copy.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="neu-card p-8 min-h-[480px] flex flex-col items-center justify-center text-center bg-zinc-900 border-dashed">
        <h3 className="text-base font-black text-zinc-100">No Description Generated Yet</h3>
        <p className="text-xs text-zinc-400 font-medium max-w-md mt-1 leading-relaxed">
          Fill out your product details on the left and click <span className="text-blue-400 font-bold">Generate Description</span> to create copy.
        </p>
      </div>
    );
  }

  const wordCount = data.generatedDescription.trim() ? data.generatedDescription.trim().split(/\s+/).length : 0;
  const charCount = data.generatedDescription.length;

  return (
    <div className="neu-card p-6 md:p-8 flex flex-col justify-between min-h-[480px] bg-zinc-900">

      <div>
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-zinc-700 pb-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-lg bg-zinc-800 border-2 border-zinc-700 text-zinc-100 shadow-[1px_1px_0px_0px_#27272a]">
              {data.productName}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-400/10 border-2 border-amber-500/40 text-amber-300 shadow-[1px_1px_0px_0px_#27272a]">
              Tone: {data.tone}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-zinc-800 border-2 border-zinc-700 text-zinc-300 shadow-[1px_1px_0px_0px_#27272a]">
              {data.color} • {data.material}
            </span>
          </div>

          <button
            onClick={handleCopy}
            disabled={isLoading || !data.generatedDescription}
            className={`text-xs px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              copied
                ? 'btn-neu-white'
                : 'btn-neu-yellow'
            }`}
          >
            {copied ? 'Copied to Clipboard!' : 'Copy Description'}
          </button>
        </div>

        {/* Copy Display */}
        <div className="bg-zinc-950 p-6 rounded-xl border-2 border-zinc-700 text-zinc-100 text-sm leading-relaxed whitespace-pre-line font-medium shadow-[2px_2px_0px_0px_#27272a] selection:bg-emerald-600 selection:text-white min-h-[220px]">
          {data.generatedDescription ? (
            <>
              {data.generatedDescription}
              {isLoading && (
                <span className="inline-block w-2.5 h-4 ml-1 bg-amber-400 animate-pulse font-bold align-middle">▌</span>
              )}
            </>
          ) : isLoading ? (
            <span className="text-zinc-500 italic flex items-center gap-2">
              Generating streaming response...
              <span className="inline-block w-2.5 h-4 bg-amber-400 animate-pulse font-bold">▌</span>
            </span>
          ) : (
            <span className="text-zinc-500 italic">No description content</span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-t-2 border-zinc-700 flex items-center justify-between text-xs text-zinc-400 font-bold">
        <span>{data.modelUsed || (isLoading ? 'Streaming...' : 'llama3.2:1b')}</span>

        <div className="flex items-center space-x-3 mono-font text-[11px]">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>
    </div>
  );
};

