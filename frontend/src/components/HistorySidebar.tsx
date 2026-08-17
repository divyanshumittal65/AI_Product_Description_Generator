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
    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-sm font-bold text-zinc-100">Saved Descriptions</h3>
        <span className="text-xs text-zinc-400 font-medium px-2.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">
          {history.length} saved
        </span>
      </div>

      {/* Search Filter */}
      {history.length > 0 && (
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search history..."
          className="w-full px-3 py-2 rounded-lg chat-input-field text-xs text-zinc-100 placeholder-zinc-500"
        />
      )}

      {/* History Items List */}
      {isLoading ? (
        <div className="py-8 text-center text-xs text-zinc-400">Loading history...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-400">
          {searchQuery ? 'No matching records found' : 'No saved descriptions yet.'}
        </div>
      ) : (
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="bg-zinc-950 hover:bg-zinc-800/80 p-3.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 truncate">
                  <h4 className="text-xs font-bold text-zinc-100 truncate">
                    {item.productName}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                    {item.tone}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, item)}
                    className="text-zinc-400 hover:text-white"
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
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed whitespace-pre-line bg-zinc-900 p-2 rounded border border-zinc-800">
                {item.generatedDescription}
              </p>

              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                <span>{item.color} • {item.material}</span>
                <span className="text-blue-400 font-semibold">Load →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
