import React from 'react';
import { Product, LogoConfig, ProductColor } from '../types';
import { ProductMockupCanvas } from './ProductMockupCanvas';
import { Eye, Download, Sparkles, ArrowRight } from 'lucide-react';

interface MultiProductGridProps {
  products: Product[];
  logo: LogoConfig;
  productColors: Record<string, ProductColor>;
  onUpdateProductColor: (productId: string, color: ProductColor) => void;
  onSelectProductForStudio: (product: Product) => void;
  onQuickExport: (product: Product) => void;
  onQuickAiScene: (product: Product) => void;
  isDarkStudio: boolean;
  showPrintGuides: boolean;
}

export const MultiProductGrid: React.FC<MultiProductGridProps> = ({
  products,
  logo,
  productColors,
  onUpdateProductColor,
  onSelectProductForStudio,
  onQuickExport,
  onQuickAiScene,
  isDarkStudio,
  showPrintGuides,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {products.map((product) => {
        const currentColor =
          productColors[product.id] ||
          product.colors.find((c) => c.hex === product.defaultColorHex) ||
          product.colors[0];

        const defaultPlacement = product.placements[0];

        return (
          <div
            key={product.id}
            className="group bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* Mockup Canvas Header */}
            <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden cursor-pointer"
              onClick={() => onSelectProductForStudio(product)}
            >
              <ProductMockupCanvas
                product={product}
                colorHex={currentColor.hex}
                placement={defaultPlacement}
                logo={logo}
                showPrintGuides={showPrintGuides}
                isDarkStudio={isDarkStudio}
                className="transition-transform duration-500 group-hover:scale-102"
              />

              {/* Hover Quick Action Overlay */}
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProductForStudio(product);
                  }}
                  className="px-3 py-2 rounded-xl bg-white text-zinc-900 font-semibold text-xs shadow-md hover:bg-zinc-100 flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAiScene(product);
                  }}
                  className="px-3 py-2 rounded-xl bg-zinc-900 text-white font-semibold text-xs shadow-md hover:bg-zinc-800 flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI Scene</span>
                </button>
              </div>

              {/* Top badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold text-zinc-800 uppercase tracking-wider border border-zinc-200/60 shadow-2xs">
                  {product.category}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-semibold text-zinc-700 border border-zinc-200/60 shadow-2xs">
                  {product.recommendedTechnique.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Product Meta & Color Swatches Footer */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3
                    onClick={() => onSelectProductForStudio(product)}
                    className="font-bold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <span className="font-mono text-xs font-semibold text-zinc-600">
                    {product.basePrice}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                  {product.description}
                </p>
              </div>

              {/* Color Swatches & Quick Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                {/* Colors */}
                <div className="flex items-center gap-1.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => onUpdateProductColor(product.id, color)}
                      className={`w-4 h-4 rounded-full border transition-transform ${
                        currentColor.hex === color.hex
                          ? 'scale-125 ring-2 ring-blue-600 ring-offset-1 z-10'
                          : 'hover:scale-110 border-zinc-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  <span className="text-[11px] text-zinc-500 ml-1 font-medium hidden sm:inline">
                    {currentColor.name}
                  </span>
                </div>

                {/* Direct Export Action */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onQuickExport(product)}
                    className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Export 300 DPI Print File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSelectProductForStudio(product)}
                    className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                    title="Open Studio Focus Editor"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
