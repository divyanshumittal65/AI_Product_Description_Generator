'use client';

import React, { useState, useEffect } from 'react';
import { ProductFormData } from './ProductForm';

interface ChatInputProps {
  onSend: (data: ProductFormData) => void;
  isLoading: boolean;
  selectedPreset: ProductFormData | null;
}

const TONE_OPTIONS = [
  { id: 'Professional', label: 'Professional' },
  { id: 'Creative', label: 'Creative' },
  { id: 'SEO Optimized', label: 'SEO' },
  { id: 'Casual', label: 'Casual' },
  { id: 'Luxury', label: 'Luxury' },
];

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, selectedPreset }) => {
  const [productName, setProductName] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [tone, setTone] = useState('Professional');
  const [featureTags, setFeatureTags] = useState<string[]>(['Soft', 'Washable']);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (selectedPreset) {
      setProductName(selectedPreset.productName || '');
      setColor(selectedPreset.color || '');
      setMaterial(selectedPreset.material || '');
      setTone(selectedPreset.tone || 'Professional');
      if (selectedPreset.features) {
        setFeatureTags(selectedPreset.features.split(',').map((f) => f.trim()).filter(Boolean));
      } else {
        setFeatureTags([]);
      }
    }
  }, [selectedPreset]);

  const handleAddTag = (tagToAdd?: string) => {
    const text = (tagToAdd || tagInput).trim();
    if (text && !featureTags.includes(text)) {
      setFeatureTags([...featureTags, text]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFeatureTags(featureTags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !color.trim() || !material.trim()) return;

    onSend({
      productName: productName.trim(),
      color: color.trim(),
      material: material.trim(),
      features: featureTags.join(', '),
      tone,
    });
  };

  return (
    <div className="sticky bottom-6 z-40 bg-zinc-900 border border-zinc-800 p-4 max-w-4xl mx-auto w-full rounded-2xl shadow-2xl mb-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        
        {/* Input Fields Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product Name *"
            required
            className="w-full px-3 py-2 rounded-lg chat-input-field text-xs text-zinc-100 placeholder-zinc-500"
          />

          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Color *"
            required
            className="w-full px-3 py-2 rounded-lg chat-input-field text-xs text-zinc-100 placeholder-zinc-500"
          />

          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Material *"
            required
            className="w-full px-3 py-2 rounded-lg chat-input-field text-xs text-zinc-100 placeholder-zinc-500"
          />
        </div>

        {/* Features & Tone Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          
          {/* Tone Selector */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <span className="text-[11px] font-medium text-zinc-400 mr-1">Tone:</span>
            {TONE_OPTIONS.map((t) => {
              const isSelected = tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`text-[11px] px-2.5 py-1 rounded font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-1 max-w-md bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
            {featureTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-zinc-400 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add feature..."
              className="flex-1 bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none min-w-[90px] px-1"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !productName.trim() || !color.trim() || !material.trim()}
            className="btn-primary-blue px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Generating...' : 'Generate Description'}
          </button>
        </div>

      </form>
    </div>
  );
};
