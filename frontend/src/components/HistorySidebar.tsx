'use client';

import React, { useState } from 'react';
import { GeneratedRecord } from './DescriptionCard';

interface HistorySidebarProps {
  history: GeneratedRecord[];
  onSelect: (item: GeneratedRecord) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  onSelect,
  onDelete,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.productName.toLowerCase().includes(q) ||
      item.color.toLowerCase().includes(q) ||
      item.material.toLowerCase().includes(q) ||
      item.features.toLowerCase().includes(q) ||
      item.tone.toLowerCase().includes(q)
    );
  });

  const handleCopy = (e: React.MouseEvent, item: GeneratedRecord) => {
    e.stopPropagation();
    if (!item.generatedDescription || !item.id) return;
    navigator.clipboard.writeText(item.generatedDescription);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="neu-card p-6 md:p-8 bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-700 pb-4 mb-4">
        <div>
          <h3 className="text-base font-black text-zinc-100">
            Saved History
          </h3>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">Stored in database</p>
        </div>

        <span className="text-xs font-black px-3 py-1 rounded-lg bg-amber-400 text-zinc-950 border-2 border-zinc-700 shadow-[2px_2px_0px_0px_#27272a]">
          {history.length} saved
        </span>
      </div>

      {/* Search Filter */}
      {history.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved descriptions..."
            className="w-full px-3.5 py-2 rounded-xl neu-input text-xs text-zinc-100 font-semibold placeholder-zinc-500"
          />
        </div>
      )}

      {/* History Items List */}
      {isLoading ? (
        <div className="py-12 text-center text-xs font-bold text-zinc-400">Loading saved entries...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="py-12 text-center text-xs font-bold text-zinc-400">
          {searchQuery ? 'No matching records found' : 'No saved descriptions yet.'}
        </div>
      ) : (
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="bg-zinc-950 hover:bg-zinc-800/80 p-4 rounded-xl border-2 border-zinc-700 transition-all cursor-pointer space-y-2.5 shadow-[2px_2px_0px_0px_#27272a]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 truncate">
                  <h4 className="text-xs font-black text-zinc-100 truncate">
                    {item.productName}
                  </h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-500/40">
                    {item.tone}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0 text-xs font-bold">
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, item)}
                    className="text-amber-400 hover:underline"
                  >
                    {copiedId === item.id ? 'Copied' : 'Copy'}
                  </button>
                  <span className="text-zinc-600">•</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.id) onDelete(item.id);
                    }}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-medium line-clamp-2 leading-relaxed whitespace-pre-line bg-zinc-900 p-2.5 rounded-lg border border-zinc-700">
                {item.generatedDescription}
              </p>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
                <span>{item.color} • {item.material}</span>
                <span className="text-amber-400 font-extrabold">Load copy →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
