import React, { useRef } from 'react';
import { Upload, Sparkles, Download, Grid, Eye, Sun, Moon, Image as ImageIcon } from 'lucide-react';
import { SAMPLE_LOGOS, SampleLogo } from '../data/sampleLogos';
import { LogoConfig } from '../types';

interface HeaderProps {
  currentLogo: LogoConfig;
  onSelectLogo: (logo: LogoConfig) => void;
  onUploadFile: (file: File) => void;
  viewMode: 'grid' | 'studio';
  onChangeViewMode: (mode: 'grid' | 'studio') => void;
  isDarkStudio: boolean;
  onToggleDarkStudio: () => void;
  onOpenAiGenerator: () => void;
  onOpenExportModal: () => void;
  onOpenAiAnalysis: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLogo,
  onSelectLogo,
  onUploadFile,
  viewMode,
  onChangeViewMode,
  isDarkStudio,
  onToggleDarkStudio,
  onOpenAiGenerator,
  onOpenExportModal,
  onOpenAiAnalysis,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onUploadFile(files[0]);
    }
  };

  return (
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm ring-1 ring-zinc-800">
            <span className="font-display font-extrabold text-lg tracking-tight">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg text-zinc-900 tracking-tight">
                On-Demand Merch Mockups
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                300 DPI Engine
              </span>
            </div>
            <p className="text-xs text-zinc-500 hidden sm:block">
              Photorealistic product shot placement, AI lifestyle scenes &amp; print prep
            </p>
          </div>
        </div>

        {/* Center: Sample Logos Preset Quick Bar */}
        <div className="hidden lg:flex items-center gap-2 bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/80">
          <span className="text-[11px] font-semibold text-zinc-500 px-2 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" /> Sample:
          </span>
          {SAMPLE_LOGOS.map((sample: SampleLogo) => (
            <button
              key={sample.id}
              onClick={() =>
                onSelectLogo({
                  ...currentLogo,
                  dataUrl: sample.dataUrl,
                  name: sample.name,
                })
              }
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                currentLogo.name === sample.name
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
              title={`Switch to ${sample.name} (${sample.category})`}
            >
              {sample.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-300 rounded-lg shadow-2xs transition-all active:scale-95"
            title="Upload your brand logo (PNG, SVG, JPG, WEBP)"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-600" />
            <span>Upload Logo</span>
          </button>

          {/* AI Brand Analysis */}
          <button
            onClick={onOpenAiAnalysis}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-lg transition-all disabled:opacity-50"
            title="AI inspects your logo and suggests ideal garments, colors, and print techniques"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span className="hidden sm:inline">{isAnalyzing ? 'Analyzing...' : 'AI Brand Tips'}</span>
          </button>

          {/* AI Lifestyle Scene Generator */}
          <button
            onClick={onOpenAiGenerator}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Photoshoot</span>
          </button>

          {/* Export Print-Ready Files */}
          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 300 DPI</span>
          </button>

          <div className="h-5 w-px bg-zinc-200 mx-1 hidden sm:block" />

          {/* View Mode Switcher */}
          <div className="inline-flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              onClick={() => onChangeViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
              title="Multi-Product Grid View (All Products)"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeViewMode('studio')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'studio'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
              title="Studio Focus View (Inspect Placement & Folds)"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Dark / Light Studio Toggle */}
          <button
            onClick={onToggleDarkStudio}
            className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            title={isDarkStudio ? 'Switch to Light Backdrop' : 'Switch to Dark Velvet Backdrop'}
          >
            {isDarkStudio ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
