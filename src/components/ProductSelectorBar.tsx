import React from 'react';
import { ProductCategory, Product, PrintPlacement, ProductColor } from '../types';
import { Shirt, Coffee, ShoppingBag, Frame, ShieldCheck, Ruler } from 'lucide-react';

interface ProductSelectorBarProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  activeProduct: Product;
  activeColor: ProductColor;
  onSelectColor: (color: ProductColor) => void;
  activePlacement: PrintPlacement;
  onSelectPlacement: (placement: PrintPlacement) => void;
  showPrintGuides: boolean;
  onTogglePrintGuides: () => void;
}

export const ProductSelectorBar: React.FC<ProductSelectorBarProps> = ({
  selectedCategory,
  onSelectCategory,
  activeProduct,
  activeColor,
  onSelectColor,
  activePlacement,
  onSelectPlacement,
  showPrintGuides,
  onTogglePrintGuides,
}) => {
  const categories: { id: ProductCategory; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Merch' },
    { id: 't-shirts', label: 'T-Shirts', icon: <Shirt className="w-3.5 h-3.5" /> },
    { id: 'hoodies', label: 'Hoodies', icon: <Shirt className="w-3.5 h-3.5" /> },
    { id: 'headwear', label: 'Caps & Hats' },
    { id: 'drinkware', label: 'Drinkware', icon: <Coffee className="w-3.5 h-3.5" /> },
    { id: 'bags', label: 'Bags & Totes', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'stationery', label: 'Art Prints', icon: <Frame className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-zinc-50 border-b border-zinc-200 px-4 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 border border-zinc-200'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Garment Color Swatches & Placement Selector */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Colorways */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-500">Color:</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-zinc-200 shadow-2xs">
              {activeProduct.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => onSelectColor(c)}
                  className={`w-5 h-5 rounded-full border transition-transform relative flex items-center justify-center ${
                    activeColor.hex === c.hex
                      ? 'scale-110 ring-2 ring-blue-600 ring-offset-1 z-10'
                      : 'hover:scale-105 border-zinc-300'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={`${c.name} (${c.hex})`}
                >
                  {activeColor.hex === c.hex && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        c.isDark ? 'bg-white' : 'bg-zinc-900'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
            <span className="text-xs text-zinc-700 font-medium ml-0.5 hidden sm:inline">
              {activeColor.name}
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-300 hidden md:block" />

          {/* Placement Tabs */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-500">Placement:</span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-zinc-200 shadow-2xs">
              {activeProduct.placements.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPlacement(p)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    activePlacement.id === p.id
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-zinc-300 hidden lg:block" />

          {/* Show Print Guides Toggle */}
          <button
            onClick={onTogglePrintGuides}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              showPrintGuides
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
            title="Toggle print safe area guides and physical dimensions overlay"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>{showPrintGuides ? 'Hide Guides' : 'Print Guides'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
