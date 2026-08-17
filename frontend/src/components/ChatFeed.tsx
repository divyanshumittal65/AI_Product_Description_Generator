'use client';

import React, { useState } from 'react';
import { ProductFormData } from './ProductForm';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  productDetails?: {
    productName: string;
    color: string;
    material: string;
    features: string;
    tone: string;
  };
  modelUsed?: string;
  isStreaming?: boolean;
}

const PRESETS: ProductFormData[] = [
  {
    productName: "Men's Cotton T-Shirt",
    color: 'Matte Black',
    material: '100% Ring-Spun Cotton',
    features: 'Soft Feel, Washable, Regular Fit, Breathable',
    tone: 'Professional',
  },
  {
    productName: 'Slim Leather Wallet',
    color: 'Midnight Brown',
    material: 'Full-Grain Italian Leather',
    features: '6 Card Slots, RFID Blocking, Slim Bifold, Durable Stitching',
    tone: 'Luxury',
  },
  {
    productName: 'Noise-Canceling Headphones',
    color: 'Space Gray',
    material: 'Anodized Aluminum & Memory Foam',
    features: 'Active Noise Cancellation, 30-Hour Battery, Bluetooth 5.3, Fast Charging',
    tone: 'SEO Optimized',
  },
];

interface ChatFeedProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectPreset: (preset: ProductFormData) => void;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({
  messages,
  isLoading,
  onSelectPreset,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-5 p-4 max-w-4xl mx-auto w-full">
      
      {/* Welcome State when conversation is empty */}
      {messages.length === 0 && (
        <div className="py-12 px-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-6">
          <h2 className="text-xl font-bold text-zinc-100">
            Prompt Generator
          </h2>

          {/* Quick Presets */}
          <div className="max-w-xl mx-auto pt-2">
            <span className="text-xs font-semibold text-zinc-400 block mb-3 uppercase tracking-wider">
              Quick Presets:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.productName}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-left transition-colors"
                >
                  <div className="text-xs font-bold text-zinc-200">
                    {preset.productName}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {preset.color} • {preset.tone}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message Thread */}
      {messages.map((msg) => {
        const isUser = msg.role === 'user';

        if (isUser) {
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-2xl bg-zinc-800 border border-zinc-700 p-4 rounded-2xl rounded-tr-sm text-zinc-100 space-y-2">
                <div className="text-xs font-bold text-zinc-400 flex items-center justify-between border-b border-zinc-700 pb-1.5 mb-1.5">
                  <span>User Request</span>
                  {msg.productDetails?.tone && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-700 text-zinc-300">
                      Tone: {msg.productDetails.tone}
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium leading-relaxed">
                  {msg.content}
                </p>

                {msg.productDetails && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400 font-mono">
                    <span>Color: {msg.productDetails.color}</span>
                    <span>•</span>
                    <span>Material: {msg.productDetails.material}</span>
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Assistant Message
        const wordCount = msg.content.trim() ? msg.content.trim().split(/\s+/).length : 0;
        const charCount = msg.content.length;

        return (
          <div key={msg.id} className="flex justify-start">
            <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 p-5 rounded-2xl rounded-tl-sm text-zinc-100 space-y-3">
              
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 text-xs text-zinc-400 font-medium">
                <span className="mono-font">
                  {msg.modelUsed || (msg.isStreaming ? 'Streaming...' : 'Assistant')}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(msg.id, msg.content)}
                  disabled={!msg.content || msg.isStreaming}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors disabled:opacity-40"
                >
                  {copiedId === msg.id ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Message Content */}
              <div className="text-sm font-normal leading-relaxed whitespace-pre-line text-zinc-100 min-h-[50px]">
                {msg.content ? (
                  <>
                    {msg.content}
                    {msg.isStreaming && (
                      <span className="inline-block w-2 h-4 ml-1 bg-zinc-100 animate-pulse font-bold align-middle">▌</span>
                    )}
                  </>
                ) : (
                  <span className="text-zinc-500 italic">
                    Generating response...
                    <span className="inline-block w-2 h-4 ml-1 bg-zinc-100 animate-pulse font-bold">▌</span>
                  </span>
                )}
              </div>

              {/* Bottom Info */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 mono-font">
                <span>Response</span>
                <span>{wordCount} words • {charCount} chars</span>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
