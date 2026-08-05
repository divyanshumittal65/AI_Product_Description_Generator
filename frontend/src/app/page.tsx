'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';
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
  const [activeModel, setActiveModel] = useState<string>('llama3.2:1b');

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
        if (newRecord.modelUsed) {
          setActiveModel(newRecord.modelUsed.replace('Ollama (', '').replace(')', ''));
        }
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

  const scrollToForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHistory = () => {
    const el = document.getElementById('history-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        modelName={activeModel}
        historyCount={history.length}
        onNewCopyClick={scrollToForm}
        onHistoryClick={scrollToHistory}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Simple Middle-Aligned Page Header */}
        <div className="text-center py-2 sm:py-4">
          <h1 className="text-2xl sm:text-4xl font-black text-zinc-100 tracking-tight">
            Product Description Generator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-2 max-w-xl mx-auto leading-relaxed">
            Generate clear, persuasive product descriptions for your e-commerce catalog.
          </p>
        </div>

        {/* Error Alert Toast */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/80 border-2 border-zinc-700 text-red-200 text-xs font-bold flex items-center justify-between shadow-[3px_3px_0px_0px_#27272a]">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-extrabold underline hover:text-white ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-5">
            <ProductForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>

          {/* Results & History Column */}
          <div className="lg:col-span-7 space-y-8">
            <DescriptionCard data={currentResult} isLoading={isLoading} />
            
            <div id="history-section">
              <HistorySidebar
                history={history}
                onSelect={(item) => setCurrentResult(item)}
                onDelete={handleDeleteRecord}
                isLoading={isHistoryLoading}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
