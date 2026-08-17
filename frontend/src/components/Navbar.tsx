'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  modelName?: string;
  historyCount?: number;
  onNewChatClick?: () => void;
  isStreaming?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  modelName = 'llama3.2:1b',
  historyCount = 0,
  onNewChatClick,
  isStreaming = false,
}) => {
  const router = useRouter();

  const handleNewChat = (e: React.MouseEvent) => {
    if (onNewChatClick) {
      onNewChatClick();
    }
    router.push('/');
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* App Title aligned to the left - links to Home */}
          <Link
            href="/"
            onClick={handleNewChat}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-base font-bold text-zinc-100 tracking-tight">
              Prompt Generator
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {isStreaming && (
              <span className="text-xs text-amber-400 font-medium">
                Streaming...
              </span>
            )}

            <button
              onClick={handleNewChat}
              className="text-xs font-medium text-zinc-300 hover:text-white px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              New Chat
            </button>

            <Link
              href="/history"
              className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <span>History</span>
              {historyCount > 0 && (
                <span className="text-[11px] font-bold text-zinc-300 px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700">
                  {historyCount}
                </span>
              )}
            </Link>

            <span className="hidden sm:inline-block text-xs text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 mono-font">
              {modelName}
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
};
