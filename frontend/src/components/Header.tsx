import React from 'react';
import { Sparkles, Cpu, Database } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              CopyCraft <span className="gradient-text text-sm uppercase px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-700/50">AI</span>
            </h1>
            <p className="text-xs text-gray-400">AI Product Description Generator</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>Docker LLM Container</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span>Persistent Database</span>
          </div>
        </div>
      </div>
    </header>
  );
};
