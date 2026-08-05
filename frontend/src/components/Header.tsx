'use client';

import React from 'react';
import { Sparkles, Cpu, Database, Github } from 'lucide-react';

interface HeaderProps {
  modelName?: string;
  isBackendConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ modelName = 'llama3.2:1b', isBackendConnected = true }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl btn-primary flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                CopyCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                PRO 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Ecommerce Product Copy Generator</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-3 text-xs">
          
          {/* Model Status */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span className="mono-font text-[11px]">{modelName}</span>
          </div>

          {/* MySQL DB Status */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
            <Database className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-[11px]">MySQL Persisted</span>
          </div>

          {/* Repository Link */}
          <a
            href="https://github.com/divyanshumittal65/AI_Product_Description_Generator.git"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="GitHub Repository"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>

      </div>
    </header>
  );
};
