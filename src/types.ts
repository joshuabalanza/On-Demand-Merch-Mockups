export type ProductCategory =
  | 'all'
  | 't-shirts'
  | 'hoodies'
  | 'headwear'
  | 'drinkware'
  | 'bags'
  | 'stationery';

export interface ProductColor {
  name: string;
  hex: string;
  isDark?: boolean;
}

export interface PrintPlacement {
  id: string;
  name: string;
  box: {
    top: number; // percentage (0 - 100)
    left: number; // percentage (0 - 100)
    width: number; // percentage (0 - 100)
    height: number; // percentage (0 - 100)
  };
  dimensionsInches: {
    width: number;
    height: number;
  };
  safeAreaMarginInches?: number;
}

export type PrintTechnique = 'dtg' | 'screenprint' | 'embroidery' | 'laser';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  basePrice: string;
  defaultColorHex: string;
  colors: ProductColor[];
  placements: PrintPlacement[];
  recommendedTechnique: PrintTechnique;
  surfaceTexture: 'cotton' | 'fleece' | 'twill' | 'ceramic' | 'canvas' | 'paper';
  aspectRatio: string;
  renderType: 'tshirt' | 'hoodie' | 'cap' | 'mug' | 'tote' | 'poster' | 'beanie';
  specs: {
    maxPrintWidthInches: number;
    maxPrintHeightInches: number;
    dpi: number;
    recommendedMinPixels: string;
    bleedInches: number;
    colorSpace: string;
  };
}

export interface LogoConfig {
  dataUrl: string;
  name: string;
  width: number;
  height: number;
  scale: number; // 0.2 to 2.5
  offsetX: number; // -100 to 100 (% offset from center)
  offsetY: number; // -100 to 100 (% offset from center)
  rotation: number; // -180 to 180 deg
  blendMode: 'multiply' | 'normal' | 'screen' | 'overlay';
  colorMode: 'original' | 'white' | 'black' | 'tint';
  customTintHex?: string;
  removeBg: boolean;
  technique: PrintTechnique;
  embroideryStitchEffect?: boolean;
}

export interface AiSceneGeneration {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  productName: string;
}

export interface AiLogoAnalysis {
  brandVibe: string;
  primaryColors: string[];
  recommendedGarmentColors: string[];
  recommendedPrintTechnique: string;
  printTechniqueReason: string;
  suggestedPhotoScenes: string[];
}
