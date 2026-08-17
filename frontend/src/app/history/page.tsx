'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { GeneratedRecord } from '@/components/DescriptionCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<GeneratedRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/history`);
      if (res.data && res.data.data) {
        setHistory(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSelectHistoryItem = (item: GeneratedRecord) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selected_history_item', JSON.stringify(item));
    }
    router.push('/');
  };

  const handleDeleteHistoryRecord = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/history/${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error('Delete Error:', err);
    }
  };

  const handleCopy = (e: React.MouseEvent, item: GeneratedRecord) => {
    e.stopPropagation();
    if (!item.generatedDescription || !item.id) return;
    navigator.clipboard.writeText(item.generatedDescription);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar historyCount={history.length} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-5">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h1 className="text-lg font-bold text-zinc-100">Saved History</h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                All generated product descriptions stored in database
              </p>
            </div>

            <span className="text-xs text-zinc-300 font-medium px-3 py-1 rounded bg-zinc-800 border border-zinc-700">
              {history.length} records saved
            </span>
          </div>

          {/* Search Filter */}
          {history.length > 0 && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by product name, color, material, or features..."
              className="w-full px-3.5 py-2.5 rounded-lg chat-input-field text-xs text-zinc-100 placeholder-zinc-500"
            />
          )}

          {/* History Items List */}
          {isLoading ? (
            <div className="py-12 text-center text-xs text-zinc-400">
              Loading history records...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400">
              {searchQuery ? 'No matching records found' : 'No saved descriptions yet.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectHistoryItem(item)}
                  className="bg-zinc-950 hover:bg-zinc-800/80 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 truncate">
                      <h3 className="text-xs font-bold text-zinc-100 truncate">
                        {item.productName}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        Tone: {item.tone}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
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
                          if (item.id) handleDeleteHistoryRecord(item.id);
                        }}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                    {item.generatedDescription}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                    <span>{item.color} • {item.material}</span>
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Load into Chat →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
