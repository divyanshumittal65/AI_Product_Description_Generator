'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, Tag, Palette, Layers, MessageSquareQuote } from 'lucide-react';

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

const TONES = ['Professional', 'Creative', 'SEO Optimized', 'Casual', 'Luxury'];

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    color: '',
    material: '',
    features: '',
    tone: 'Professional',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName.trim() || !formData.color.trim() || !formData.material.trim()) return;
    onSubmit(formData);
  };

  const handlePrefillExample = () => {
    setFormData({
      productName: "Men's Classic Cotton T-Shirt",
      color: 'Matte Black',
      material: '100% Organic Ring-Spun Cotton',
      features: 'Ultra-Soft feel, Machine Washable, Breathable Fabric, Regular Fit, Anti-Shrink',
      tone: 'Professional',
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl border border-slate-800/80">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-indigo-400" /> Product Specification
          </h2>
          <p className="text-xs text-gray-400 mt-1">Enter your product details to generate AI copy</p>
        </div>
        <button
          type="button"
          onClick={handlePrefillExample}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-950/50 hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-800/40"
        >
          Load Example
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-indigo-400" /> Product Name *
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="e.g. Men's Cotton T-Shirt"
            required
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-indigo-400" /> Color *
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g. Black, Navy Blue, Crimson"
              required
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-400" /> Material *
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="e.g. Cotton, Leather, Polyester"
              required
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Key Features
          </label>
          <textarea
            name="features"
            rows={3}
            value={formData.features}
            onChange={handleChange}
            placeholder="e.g. Soft, Washable, Regular Fit, Durable Stitching"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MessageSquareQuote className="h-3.5 w-3.5 text-indigo-400" /> Tone of Voice
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, tone: t }))}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  formData.tone === t
                    ? 'bg-indigo-600 border-indigo-400 text-white font-medium shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-3 px-4 rounded-xl gradient-btn text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              <span>Generating AI Description...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-indigo-200" />
              <span>Generate Description</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
