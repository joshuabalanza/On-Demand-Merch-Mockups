import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { LogoControlsBar } from './components/LogoControlsBar';
import { ProductSelectorBar } from './components/ProductSelectorBar';
import { MultiProductGrid } from './components/MultiProductGrid';
import { StudioFocusView } from './components/StudioFocusView';
import { AiSceneGeneratorModal } from './components/AiSceneGeneratorModal';
import { ExportModal } from './components/ExportModal';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { PRODUCTS } from './data/products';
import { SAMPLE_LOGOS } from './data/sampleLogos';
import {
  Product,
  ProductCategory,
  LogoConfig,
  ProductColor,
  PrintPlacement,
  AiSceneGeneration,
  AiLogoAnalysis,
} from './types';
import { UploadCloud } from 'lucide-react';

export default function App() {
  // 1. Logo State (starts with Summit Outfitters preset)
  const [logo, setLogo] = useState<LogoConfig>({
    dataUrl: SAMPLE_LOGOS[0].dataUrl,
    name: SAMPLE_LOGOS[0].name,
    width: 400,
    height: 400,
    scale: 0.95,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    blendMode: 'multiply',
    colorMode: 'original',
    removeBg: false,
    technique: 'dtg',
    embroideryStitchEffect: false,
  });

  // 2. Product & Category State
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [activeProduct, setActiveProduct] = useState<Product>(PRODUCTS[0]);
  const [activePlacement, setActivePlacement] = useState<PrintPlacement>(
    PRODUCTS[0].placements[0]
  );

  // Map of selected color per product
  const [productColors, setProductColors] = useState<Record<string, ProductColor>>({
    'heavyweight-tee': PRODUCTS[0].colors[0],
    'pullover-hoodie': PRODUCTS[1].colors[0],
    'dad-hat': PRODUCTS[2].colors[0],
    'ceramic-mug': PRODUCTS[3].colors[0],
    'canvas-tote': PRODUCTS[4].colors[0],
    'gallery-print': PRODUCTS[5].colors[0],
  });

  // Active color for the active product
  const activeColor =
    productColors[activeProduct.id] ||
    activeProduct.colors.find((c) => c.hex === activeProduct.defaultColorHex) ||
    activeProduct.colors[0];

  // 3. View Settings & Modals
  const [viewMode, setViewMode] = useState<'grid' | 'studio'>('grid');
  const [isDarkStudio, setIsDarkStudio] = useState(false);
  const [showPrintGuides, setShowPrintGuides] = useState(false);

  // AI features state
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiLogoAnalysis | null>(null);
  const [savedScenes, setSavedScenes] = useState<AiSceneGeneration[]>([]);

  // Drag & drop highlight
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // SVG ref to capture for export
  const mockupSvgRef = useRef<SVGSVGElement | null>(null);

  // Filter products by category
  const filteredProducts =
    selectedCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  // Handle uploaded logo file
  const handleUploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setLogo((prev) => ({
          ...prev,
          dataUrl: result,
          name: file.name.replace(/\.[^/.]+$/, ''),
          colorMode: 'original',
          removeBg: false,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop listeners
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  // Update color for a specific product
  const handleUpdateProductColor = (productId: string, color: ProductColor) => {
    setProductColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
  };

  // Switch to studio mode for a specific product
  const handleSelectProductForStudio = (product: Product) => {
    setActiveProduct(product);
    setActivePlacement(product.placements[0]);
    setViewMode('studio');
  };

  // AI Analyze Logo Handler
  const handleAnalyzeLogo = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: logo.dataUrl,
        }),
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
        setIsAnalysisModalOpen(true);
      }
    } catch (err) {
      console.error('Error analyzing logo:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkStudio ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50/70 text-zinc-900'
      }`}
    >
      {/* Drag & Drop Overlay Indicator */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-50 bg-blue-600/80 backdrop-blur-sm flex flex-col items-center justify-center text-white pointer-events-none animate-in fade-in duration-150">
          <UploadCloud className="w-16 h-16 animate-bounce" />
          <h2 className="text-xl font-bold mt-4">Drop your logo to place on mockups</h2>
          <p className="text-sm opacity-80 mt-1">Supports PNG, SVG, JPG, WEBP</p>
        </div>
      )}

      {/* Main App Navigation Bar */}
      <Header
        currentLogo={logo}
        onSelectLogo={setLogo}
        onUploadFile={handleUploadFile}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        isDarkStudio={isDarkStudio}
        onToggleDarkStudio={() => setIsDarkStudio((prev) => !prev)}
        onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenAiAnalysis={handleAnalyzeLogo}
        isAnalyzing={isAnalyzing}
      />

      {/* Logo Customization Bar */}
      <LogoControlsBar logo={logo} onChangeLogo={setLogo} />

      {/* Product & Category Selector Bar */}
      <ProductSelectorBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeProduct={activeProduct}
        activeColor={activeColor}
        onSelectColor={(color) => handleUpdateProductColor(activeProduct.id, color)}
        activePlacement={activePlacement}
        onSelectPlacement={setActivePlacement}
        showPrintGuides={showPrintGuides}
        onTogglePrintGuides={() => setShowPrintGuides((prev) => !prev)}
      />

      {/* Main View Area: Multi-Product Grid vs Single Studio */}
      <main className="flex-1">
        {viewMode === 'grid' ? (
          <MultiProductGrid
            products={filteredProducts}
            logo={logo}
            productColors={productColors}
            onUpdateProductColor={handleUpdateProductColor}
            onSelectProductForStudio={handleSelectProductForStudio}
            onQuickExport={(p) => {
              setActiveProduct(p);
              setActivePlacement(p.placements[0]);
              setIsExportModalOpen(true);
            }}
            onQuickAiScene={(p) => {
              setActiveProduct(p);
              setActivePlacement(p.placements[0]);
              setIsAiGeneratorOpen(true);
            }}
            isDarkStudio={isDarkStudio}
            showPrintGuides={showPrintGuides}
          />
        ) : (
          <StudioFocusView
            product={activeProduct}
            color={activeColor}
            onSelectColor={(color) => handleUpdateProductColor(activeProduct.id, color)}
            placement={activePlacement}
            onSelectPlacement={setActivePlacement}
            logo={logo}
            onChangeLogo={setLogo}
            isDarkStudio={isDarkStudio}
            showPrintGuides={showPrintGuides}
            onTogglePrintGuides={() => setShowPrintGuides((prev) => !prev)}
            onOpenAiGeneratorForProduct={() => setIsAiGeneratorOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            mockupSvgRef={mockupSvgRef}
          />
        )}
      </main>

      {/* Modals */}
      <AiSceneGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        product={activeProduct}
        colorName={activeColor.name}
        logo={logo}
        savedScenes={savedScenes}
        onAddSavedScene={(scene) => setSavedScenes((prev) => [scene, ...prev])}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        product={activeProduct}
        color={activeColor}
        placement={activePlacement}
        logo={logo}
        mockupCanvasElement={mockupSvgRef.current}
      />

      <AiAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        analysis={aiAnalysis}
        onApplyPhotoScene={(scenePrompt) => {
          setIsAiGeneratorOpen(true);
        }}
      />
    </div>
  );
}
