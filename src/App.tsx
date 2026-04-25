/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Newspaper, 
  Share2, 
  Loader2, 
  ChevronRight, 
  Boxes, 
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Medium = 'Billboard' | 'Newspaper' | 'Social';

interface BrandAsset {
  medium: Medium;
  imageUrl: string;
  prompt: string;
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "1:4" | "1:8" | "4:1" | "8:1";
}

export default function App() {
  const [productDescription, setProductDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const generateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productDescription.trim()) return;

    setIsGenerating(true);
    setError(null);
    setAssets([]);
    
    try {
      // Step 1: Create a consistent Visual Identity
      setStatus('Developing visual identity...');
      const identityResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a highly detailed visual style guide for this product: "${productDescription}". 
        Include color palette, material textures, lighting style, and key design features. 
        IMPORTANT: Use only objects and environments. Strictly NO people or human figures.
        Focus on creating a unique "Hero Object" that remains consistent.`,
      });
      const styleGuide = identityResponse.text;

      // Step 2: Generate Prompts for each Medium
      setStatus('Composing marketing scenes...');
      const mediums: { name: Medium; ar: BrandAsset['aspectRatio'] }[] = [
        { name: 'Billboard', ar: '16:9' },
        { name: 'Newspaper', ar: '4:3' },
        { name: 'Social', ar: '1:1' }
      ];

      const generatedAssets: BrandAsset[] = [];

      for (const medium of mediums) {
        setStatus(`Visualizing ${medium.name}...`);
        
        const promptGen = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Based on this style guide: ${styleGuide}. 
          Write a detailed, photorealistic image prompt for a ${medium.name} advertisement.
          ${medium.name === 'Billboard' ? 'Wide angle, urban context, high impact.' : ''}
          ${medium.name === 'Newspaper' ? 'Slightly grainy texture, classic editorial composition, focused on product details.' : ''}
          ${medium.name === 'Social' ? 'Vibrant colors, modern clean aesthetic, top-down or close-up perspective.' : ''}
          STRICT CONSTRAINTS:
          - NO PEOPLE.
          - Describe ONLY the product and its environment.
          - Maintain the exact same product materials and design from the style guide.
          - High-end studio lighting.`,
        });

        const imagePrompt = promptGen.text || `High-end photorealistic ${medium.name} ad for ${productDescription}, no people.`;

        // Step 3: Generate the Image using Nano-Banana (gemini-2.5-flash-image)
        const imageResult = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: imagePrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: medium.ar,
            }
          }
        });

        let imageUrl = '';
        const candidates = imageResult.candidates;
        if (candidates && candidates.length > 0) {
          for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            }
          }
        }

        if (imageUrl) {
          generatedAssets.push({
            medium: medium.name,
            imageUrl,
            prompt: imagePrompt,
            aspectRatio: medium.ar
          });
        }
      }

      setAssets(generatedAssets);
      setStatus('');
    } catch (err) {
      console.error(err);
      setError('Failed to generate brand assets. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen bg-[#0A0C10] text-slate-300 font-sans flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0A0C10]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">B</div>
          <span className="text-lg font-semibold tracking-tight text-white flex items-center gap-1">
            BrandBuilder <span className="text-sky-500">AI</span>
          </span>
        </div>
        <div className="flex gap-6 items-center text-sm font-medium">
          <span className="text-sky-400 border-b-2 border-sky-400 py-5">Editor</span>
          <span className="hover:text-white cursor-pointer transition-colors">History</span>
          <span className="hover:text-white cursor-pointer transition-colors">Brand Kit</span>
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600"></div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-80 border-r border-slate-800 p-6 flex flex-col gap-6 bg-[#0D1117] overflow-y-auto">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Active Model
            </label>
            <div className="glass rounded-xl p-3 flex items-center justify-between border-sky-500/50 bg-sky-500/5">
              <span className="text-white font-medium text-sm">Nano-Banana v2.5</span>
              <div className={`w-2 h-2 rounded-full bg-sky-500 ${isGenerating ? 'animate-pulse' : ''}`}></div>
            </div>
          </div>

          <form onSubmit={generateBrand} className="flex flex-col gap-6 flex-1">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                Product Description
              </label>
              <textarea
                className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:border-sky-500 outline-none resize-none transition-all text-slate-200 placeholder:text-slate-600 leading-relaxed"
                placeholder="Describe your product concept in detail..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                Visualization Mediums
              </label>
              <div className="flex flex-col gap-2">
                {['Billboard', 'Newspaper', 'Social'].map((m) => (
                  <div key={m} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                    <span className="text-sm text-slate-300">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isGenerating || !productDescription.trim()}
                className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-[#0A0C10] font-bold rounded-xl transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </span>
                ) : 'Generate Assets'}
              </motion.button>
              {status && (
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-sky-400 mt-4 text-center animate-pulse">
                  {status}
                </p>
              )}
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 relative dot-grid p-8 overflow-y-auto flex flex-col gap-8">
          <div className="flex justify-between items-end shrink-0">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500 mb-1">Canvas</div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Concept Visualizations</h2>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-3 py-1 bg-slate-800/50 rounded-full">
              {assets.length} Shots Ready &bull; High Fidelity
            </span>
          </div>

          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait">
              {assets.length > 0 ? (
                <div className="grid grid-cols-2 gap-8 content-start pb-12">
                  {assets.map((asset, index) => (
                    <motion.div
                      key={asset.medium}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${asset.medium === 'Billboard' ? 'col-span-2' : 'col-span-1'} relative glass rounded-2xl overflow-hidden flex flex-col mockup-shadow group`}
                    >
                      <div className="bg-slate-800/50 px-4 py-3 text-[10px] uppercase font-bold tracking-[0.2em] flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${index % 2 === 0 ? 'bg-sky-500' : 'bg-pink-500'}`}></span>
                          <span>{asset.medium} Shot &bull; Asset {index + 1}</span>
                        </div>
                        <span className="text-sky-400 opacity-60 font-mono">{asset.aspectRatio}</span>
                      </div>
                      <div className="relative aspect-[inherit] overflow-hidden bg-slate-900" style={{ aspectRatio: asset.aspectRatio }}>
                        <img
                          src={asset.imageUrl}
                          alt={asset.medium}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 transition-colors flex items-center justify-center gap-2">
                            <Download className="w-3 h-3" />
                            Download High-Res
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-sky-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-400">Rendering Essence</p>
                  <p className="text-xs text-slate-500 max-w-xs text-center leading-relaxed">
                    Orchestrating visual identity and atmospheric lighting for consistent product presentation...
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-8">
                  <div className="w-48 h-48 relative glass rounded-3xl flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-sky-500/5 dot-grid opacity-50"></div>
                    <Boxes className="w-16 h-16 text-slate-700 animate-pulse" />
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Awaiting Concept</p>
                    <p className="text-sm text-slate-500 italic max-w-xs leading-relaxed">
                      "Design is not just what it looks like and feels like. Design is how it works."
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
