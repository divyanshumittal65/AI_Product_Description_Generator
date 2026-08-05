'use client';

import React, { useState } from 'react';

export interface ProductFormData {
  productName: string;
  color: string;
  material: string;
  features: string;
  tone: string;
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  isLoading: boolean;
}

const TONE_OPTIONS = [
  { id: 'Professional', label: 'Professional', desc: 'Clear, authoritative ecommerce copy' },
  { id: 'Creative', label: 'Creative', desc: 'Engaging, imaginative storytelling' },
  { id: 'SEO Optimized', label: 'SEO Optimized', desc: 'Keyword dense & search engine friendly' },
  { id: 'Casual', label: 'Casual', desc: 'Friendly, accessible everyday tone' },
  { id: 'Luxury', label: 'Luxury', desc: 'Elevated, high-end luxury feel' },
];

const PRESETS = [
  {
    name: "Men's Cotton T-Shirt",
    color: 'Matte Black',
    material: '100% Ring-Spun Cotton',
    features: ['Soft Feel', 'Washable', 'Regular Fit', 'Breathable'],
    tone: 'Professional',
  },
  {
    name: 'Slim Leather Wallet',
    color: 'Midnight Brown',
    material: 'Full-Grain Italian Leather',
    features: ['6 Card Slots', 'RFID Blocking', 'Slim Bifold', 'Durable Stitching'],
    tone: 'Luxury',
  },
  {
    name: 'Noise-Canceling Headphones',
    color: 'Space Gray',
    material: 'Anodized Aluminum & Memory Foam',
    features: ['Active Noise Cancellation', '30-Hour Battery', 'Bluetooth 5.3', 'Fast Charging'],
    tone: 'SEO Optimized',
  },
];

const SUGGESTED_TAGS = ['Soft', 'Washable', 'Regular Fit', 'Durable', 'Waterproof', 'Breathable', 'Lightweight', 'Eco-Friendly'];

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, isLoading }) => {
  const [productName, setProductName] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [tone, setTone] = useState('Professional');
  const [featureTags, setFeatureTags] = useState<string[]>(['Soft', 'Washable', 'Regular Fit']);
  const [tagInput, setTagInput] = useState('');

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

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setProductName(preset.name);
    setColor(preset.color);
    setMaterial(preset.material);
    setFeatureTags(preset.features);
    setTone(preset.tone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !color.trim() || !material.trim()) return;
    
    onSubmit({
      productName,
      color,
      material,
      features: featureTags.join(', '),
      tone,
    });
  };

  const handleReset = () => {
    setProductName('');
    setColor('');
    setMaterial('');
    setFeatureTags([]);
    setTagInput('');
    setTone('Professional');
  };

  return (
    <div className="neu-card p-6 md:p-8 bg-zinc-900">

      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b-2 border-zinc-700 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-black text-zinc-100">
            Product Specifications
          </h2>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">Enter product details to generate copy</p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-2 border-zinc-700 shadow-[2px_2px_0px_0px_#27272a] text-xs font-bold transition-all"
        >
          Reset
        </button>
      </div>

      {/* Demo Presets */}
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Quick Presets:</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-2 border-zinc-700 font-bold shadow-[2px_2px_0px_0px_#27272a] transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider mb-1.5">
            Product Name <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Men's Cotton T-Shirt"
            required
            className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-semibold placeholder-zinc-500"
          />
        </div>

        {/* Color & Material */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider mb-1.5">
              Color <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Matte Black"
              required
              className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-semibold placeholder-zinc-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider mb-1.5">
              Material <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="e.g. 100% Cotton"
              required
              className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-semibold placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Feature Tags Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Key Features
            </label>
            <span className="text-[10px] text-zinc-400 font-semibold">Press Enter to add</span>
          </div>

          {/* Active Tags */}
          <div className="p-3 rounded-xl bg-zinc-950 border-2 border-zinc-700 min-h-[85px] flex flex-wrap items-center gap-2 mb-2 shadow-[2px_2px_0px_0px_#27272a]">
            {featureTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-500/50 font-bold"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-amber-400 hover:text-amber-200 font-black text-sm leading-none ml-0.5"
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
              placeholder={featureTags.length === 0 ? "Type feature and press Enter..." : "Add feature..."}
              className="flex-1 bg-transparent text-sm text-zinc-100 font-semibold placeholder-zinc-500 focus:outline-none min-w-[130px] px-1 py-0.5"
            />
          </div>

          {/* Suggested Tags */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400 font-semibold">
            <span className="text-[10px] text-zinc-400">Suggestions:</span>
            {SUGGESTED_TAGS.filter((st) => !featureTags.includes(st)).slice(0, 5).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleAddTag(st)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-[11px] font-bold shadow-[1px_1px_0px_0px_#27272a] transition-all"
              >
                + {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2">
            Tone of Voice
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TONE_OPTIONS.map((t) => {
              const isSelected = tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`p-3 rounded-xl border-2 border-zinc-700 text-left transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-zinc-950 shadow-[2px_2px_0px_0px_#27272a]'
                      : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-750 shadow-[2px_2px_0px_0px_#27272a]'
                  }`}
                >
                  <div className={`text-xs font-black ${isSelected ? 'text-zinc-950' : 'text-zinc-100'}`}>{t.label}</div>
                  <div className={`text-[10px] mt-0.5 font-semibold ${isSelected ? 'text-zinc-900' : 'text-zinc-400'}`}>{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate CTA Button */}
        <button
          type="submit"
          disabled={isLoading || !productName.trim() || !color.trim() || !material.trim()}
          className="w-full mt-4 py-3.5 px-6 rounded-xl btn-neu-blue text-white font-black text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[3px_3px_0px_0px_#27272a]"
        >
          {isLoading ? 'Generating Description...' : 'Generate Description'}
        </button>
      </form>
    </div>
  );
};
