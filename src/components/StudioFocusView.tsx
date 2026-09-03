import React, { useRef, useState } from 'react';
import { Product, LogoConfig, ProductColor, PrintPlacement } from '../types';
import { ProductMockupCanvas } from './ProductMockupCanvas';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Download,
  Info,
  Layers,
  Ruler,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

interface StudioFocusViewProps {
  product: Product;
  color: ProductColor;
  onSelectColor: (color: ProductColor) => void;
  placement: PrintPlacement;
  onSelectPlacement: (placement: PrintPlacement) => void;
  logo: LogoConfig;
  onChangeLogo: (logo: LogoConfig) => void;
  isDarkStudio: boolean;
  showPrintGuides: boolean;
  onTogglePrintGuides: () => void;
  onOpenAiGeneratorForProduct: () => void;
  onOpenExportModal: () => void;
  mockupSvgRef: React.RefObject<SVGSVGElement | null>;
}

export const StudioFocusView: React.FC<StudioFocusViewProps> = ({
  product,
  color,
  onSelectColor,
  placement,
  onSelectPlacement,
  logo,
  onChangeLogo,
  isDarkStudio,
  showPrintGuides,
  onTogglePrintGuides,
  onOpenAiGeneratorForProduct,
  onOpenExportModal,
  mockupSvgRef,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Main Interactive Stage (Col 8) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* Top Control Bar on Stage */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-zinc-900">{product.name}</h2>
            <span className="text-xs text-zinc-500 font-mono">({product.basePrice})</span>
          </div>

          {/* Placement Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
            {product.placements.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPlacement(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  placement.id === p.id
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Canvas Zoom & Guide Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.8, prev - 0.2))}
              className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-zinc-600 w-10 text-center font-medium">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(1.8, prev + 0.2))}
              className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stage Canvas Area */}
        <div
          className={`relative aspect-square w-full rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs flex items-center justify-center transition-all ${
            isDarkStudio ? 'bg-zinc-950 ring-1 ring-zinc-800' : 'bg-zinc-100'
          }`}
        >
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
              width: '100%',
              height: '100%',
            }}
            className="flex items-center justify-center"
          >
            <ProductMockupCanvas
              ref={mockupSvgRef}
              product={product}
              colorHex={color.hex}
              placement={placement}
              logo={logo}
              showPrintGuides={showPrintGuides}
              isDarkStudio={isDarkStudio}
            />
          </div>

          {/* Quick Floating Guideline Overlay Pill */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <button
              onClick={onTogglePrintGuides}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-xs transition-all flex items-center gap-1.5 ${
                showPrintGuides
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-white/90 text-zinc-700 border-zinc-200/80 hover:bg-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{showPrintGuides ? 'Active Safe Guides' : 'Show Print Dimensions'}</span>
            </button>
          </div>

          {/* Floating Color Picker Bar at bottom right */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-1.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => onSelectColor(c)}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  color.hex === c.hex
                    ? 'scale-125 ring-2 ring-blue-600 ring-offset-1 z-10'
                    : 'hover:scale-110 border-zinc-300'
                }`}
                style={{ backgroundColor: c.hex }}
                title={`${c.name} (${c.hex})`}
              />
            ))}
          </div>
        </div>

        {/* Quick Position Presets */}
        <div className="bg-white p-3 rounded-2xl border border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-zinc-600 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" /> Alignment Presets:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onChangeLogo({ ...logo, offsetX: 0, offsetY: 0 })}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium transition-colors"
            >
              Dead Center
            </button>
            <button
              onClick={() => onChangeLogo({ ...logo, offsetX: 0, offsetY: -25 })}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium transition-colors"
            >
              High Chest
            </button>
            <button
              onClick={() => onChangeLogo({ ...logo, offsetX: 20, offsetY: -15, scale: 0.6 })}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium transition-colors"
            >
              Left Crest
            </button>
            <button
              onClick={() => onChangeLogo({ ...logo, scale: 1.4, offsetX: 0, offsetY: 0 })}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium transition-colors"
            >
              Oversized Statement
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Print Production Spec Sheet & Actions (Col 4) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Production Spec Sheet Card */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200/90 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                Production Readiness
              </span>
              <h3 className="font-bold text-base text-zinc-900 mt-0.5">
                Print Specifications
              </h3>
            </div>
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          {/* Specs Detail List */}
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-zinc-50">
              <span className="text-zinc-500 font-medium">Print Physical Dimensions</span>
              <span className="font-mono font-bold text-zinc-900">
                {placement.dimensionsInches.width}&quot; × {placement.dimensionsInches.height}&quot; (
                {Math.round(placement.dimensionsInches.width * 2.54)} ×{' '}
                {Math.round(placement.dimensionsInches.height * 2.54)} cm)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-zinc-50">
              <span className="text-zinc-500 font-medium">Resolution @ 300 DPI</span>
              <span className="font-mono font-bold text-blue-700">
                {Math.round(placement.dimensionsInches.width * 300)} ×{' '}
                {Math.round(placement.dimensionsInches.height * 300)} px
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-zinc-50">
              <span className="text-zinc-500 font-medium">Active Print Method</span>
              <span className="font-semibold text-zinc-800 capitalize">
                {logo.technique.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-zinc-50">
              <span className="text-zinc-500 font-medium">Bleed Margin</span>
              <span className="font-mono text-zinc-800">
                {product.specs.bleedInches}&quot; Outer Bleed
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-zinc-50">
              <span className="text-zinc-500 font-medium">Color Space</span>
              <span className="font-mono text-zinc-800">{product.specs.colorSpace}</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-zinc-500 font-medium">Fabric Base Color</span>
              <span className="font-medium text-zinc-900 flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full border border-zinc-300"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </span>
            </div>
          </div>

          {/* Technique Recommendation Box */}
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              <strong>Tip:</strong> For {color.name} ({color.isDark ? 'dark garment' : 'light garment'}),{' '}
              {color.isDark
                ? 'a high-opacity underbase white flash is applied before top color deposition to ensure vivid contrast.'
                : 'water-based direct-to-garment or screen inks absorb with a feather-soft hand feel.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={onOpenExportModal}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Export 300 DPI Production Tech Pack</span>
            </button>

            <button
              onClick={onOpenAiGeneratorForProduct}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Generate AI Photoshoot Shot</span>
            </button>
          </div>
        </div>

        {/* Brand & Fabric Care Notice */}
        <div className="bg-zinc-100/70 p-4 rounded-2xl border border-zinc-200 text-xs text-zinc-500 flex flex-col gap-1.5">
          <span className="font-semibold text-zinc-700 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-zinc-400" /> On-Demand Production Standards
          </span>
          <p className="text-[11px] leading-relaxed">
            All files generated by this studio follow ISO 12647-7 proofing specifications, formatted at exact physical scale with zero pixel resampling distortion.
          </p>
        </div>
      </div>
    </div>
  );
};
