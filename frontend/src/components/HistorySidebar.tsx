'use client';

import React from 'react';
import { History, Trash2, ArrowUpRight, Database } from 'lucide-react';
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
  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl border border-slate-800/80">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <History className="h-4 w-4 text-indigo-400" /> Saved History
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 flex items-center gap-1">
          <Database className="h-3 w-3 text-emerald-400" /> {history.length} records
        </span>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-xs text-slate-500">Loading saved entries...</div>
      ) : history.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No saved descriptions yet. Generated items will be automatically stored here in the database.
        </div>
      ) : (
        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
          {history.map((item) => (
            <div
              key={item.id}
              className="group bg-slate-950/60 hover:bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/60 hover:border-indigo-500/40 transition-all flex items-start justify-between cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                    {item.productName}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.tone}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.generatedDescription}
                </p>
                <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-2">
                  <span>{item.color}</span> • <span>{item.material}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.id) onDelete(item.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                  title="Delete record from DB"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
