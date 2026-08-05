'use client';

import React from 'react';
import { FileText } from 'lucide-react';

interface NavbarProps {
  modelName?: string;
  historyCount?: number;
  onNewCopyClick?: () => void;
  onHistoryClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  modelName = 'llama3.2:1b',
  historyCount = 0,
  onNewCopyClick,
  onHistoryClick,
}) => {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewCopyClick}>
            <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100">
              <FileText className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-base sm:text-lg font-black tracking-tight text-zinc-100">
              Product Description
            </span>
          </div>

          {/* Right Navigation & Model Badge */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <button
              onClick={onNewCopyClick}
              className="text-sm font-semibold text-zinc-100 hover:text-amber-400 transition-colors"
            >
              Generate
            </button>

            <button
              onClick={onHistoryClick}
              className="text-sm font-semibold text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1.5"
            >
              <span>History</span>
              {historyCount > 0 && (
                <span className="text-xs font-bold text-amber-400">
                  ({historyCount})
                </span>
              )}
            </button>

            <span className="hidden sm:inline-block text-xs font-medium text-zinc-400 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800 mono-font">
              {modelName}
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
};

