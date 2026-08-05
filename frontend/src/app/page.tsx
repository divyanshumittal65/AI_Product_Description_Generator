'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '@/components/Header';
import { ProductForm, ProductFormData } from '@/components/ProductForm';
import { DescriptionCard, GeneratedRecord } from '@/components/DescriptionCard';
import { HistorySidebar } from '@/components/HistorySidebar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [currentResult, setCurrentResult] = useState<GeneratedRecord | null>(null);
  const [history, setHistory] = useState<GeneratedRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const res = await axios.get(`${API_BASE_URL}/history`);
      if (res.data && res.data.data) {
        setHistory(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async (formData: ProductFormData) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/generate`, formData);
      if (res.data && res.data.data) {
        const newRecord: GeneratedRecord = res.data.data;
        setCurrentResult(newRecord);
        // Refresh persistent history list
        fetchHistory();
      }
    } catch (err: any) {
      console.error('Generation Error:', err);
      const message = err.response?.data?.message || err.message || 'Failed to generate product description';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/history/${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (currentResult?.id === id) {
        setCurrentResult(null);
      }
    } catch (err: any) {
      console.error('Delete Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-indigo-900/40">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Transform Features into <span className="gradient-text">High-Converting Copy</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Powered by a Dockerized lightweight AI model & Express backend with persistent SQLite database storage.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-sm flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs underline hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-5">
            <ProductForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>

          {/* Right Column: Active Card & Persistent History */}
          <div className="lg:col-span-7 space-y-8">
            <DescriptionCard data={currentResult} isLoading={isLoading} />
            <HistorySidebar
              history={history}
              onSelect={(item) => setCurrentResult(item)}
              onDelete={handleDeleteRecord}
              isLoading={isHistoryLoading}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        AI Product Description Generator • Next.js + Express + Prisma SQLite + Docker AI Model
      </footer>
    </div>
  );
}
