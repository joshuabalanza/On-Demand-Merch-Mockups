import React, { useState } from 'react';
import {
  RotateCcw,
  Sliders,
  Scissors,
  Palette,
  Layers,
  Sparkles,
  Maximize2,
  Move,
  Check,
} from 'lucide-react';
import { LogoConfig, PrintTechnique } from '../types';
import { removeWhiteBackground, tintLogoImage } from '../utils/imageUtils';

interface LogoControlsBarProps {
  logo: LogoConfig;
  onChangeLogo: (newLogo: LogoConfig) => void;
  isProcessingBg?: boolean;
}

export const LogoControlsBar: React.FC<LogoControlsBarProps> = ({
  logo,
  onChangeLogo,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalRawDataUrl] = useState(logo.dataUrl);

  // Toggle Background Removal
  const handleToggleRemoveBg = async () => {
    setIsProcessing(true);
    try {
      if (!logo.removeBg) {
        const cleaned = await removeWhiteBackground(logo.dataUrl);
        onChangeLogo({
          ...logo,
          dataUrl: cleaned,
          removeBg: true,
        });
      } else {
        onChangeLogo({
          ...logo,
          dataUrl: originalRawDataUrl,
          removeBg: false,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Color Mode Change
  const handleColorModeChange = async (mode: LogoConfig['colorMode'], customHex?: string) => {
    setIsProcessing(true);
    try {
      if (mode === 'original') {
        onChangeLogo({
          ...logo,
          colorMode: 'original',
          dataUrl: originalRawDataUrl,
        });
      } else if (mode === 'white') {
        const tinted = await tintLogoImage(originalRawDataUrl, '#ffffff');
        onChangeLogo({
          ...logo,
          colorMode: 'white',
          dataUrl: tinted,
        });
      } else if (mode === 'black') {
        const tinted = await tintLogoImage(originalRawDataUrl, '#18181b');
        onChangeLogo({
          ...logo,
          colorMode: 'black',
          dataUrl: tinted,
        });
      } else if (mode === 'tint' && customHex) {
        const tinted = await tintLogoImage(originalRawDataUrl, customHex);
        onChangeLogo({
          ...logo,
          colorMode: 'tint',
          customTintHex: customHex,
          dataUrl: tinted,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Print Technique Change
  const handleTechniqueChange = (technique: PrintTechnique) => {
    onChangeLogo({
      ...logo,
      technique,
      embroideryStitchEffect: technique === 'embroidery',
    });
  };

  return (
    <div className="bg-white border-b border-zinc-200 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs">
        
        {/* Placement & Dimension Controls */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Scale Slider */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-600 flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-zinc-400" /> Size
            </span>
            <input
              type="range"
              min="0.2"
              max="2.2"
              step="0.05"
              value={logo.scale}
              onChange={(e) =>
                onChangeLogo({ ...logo, scale: parseFloat(e.target.value) })
              }
              className="w-24 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="font-mono text-zinc-700 w-9 text-right font-medium">
              {Math.round(logo.scale * 100)}%
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-200" />

          {/* Position X / Y */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-600 flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-zinc-400" /> Pos
            </span>
            {/* X Offset */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-400 text-[10px]">X:</span>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={logo.offsetX}
                onChange={(e) =>
                  onChangeLogo({ ...logo, offsetX: parseInt(e.target.value, 10) })
                }
                className="w-16 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            {/* Y Offset */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-400 text-[10px]">Y:</span>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={logo.offsetY}
                onChange={(e) =>
                  onChangeLogo({ ...logo, offsetY: parseInt(e.target.value, 10) })
                }
                className="w-16 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            {/* Center Reset */}
            {(logo.offsetX !== 0 || logo.offsetY !== 0) && (
              <button
                onClick={() => onChangeLogo({ ...logo, offsetX: 0, offsetY: 0 })}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold underline ml-1"
                title="Reset position to dead-center"
              >
                Center
              </button>
            )}
          </div>

          <div className="h-4 w-px bg-zinc-200 hidden md:block" />

          {/* Rotation */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-600 flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" /> Rotate
            </span>
            <input
              type="range"
              min="-45"
              max="45"
              step="1"
              value={logo.rotation}
              onChange={(e) =>
                onChangeLogo({ ...logo, rotation: parseInt(e.target.value, 10) })
              }
              className="w-20 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="font-mono text-zinc-700 w-8 text-right font-medium">
              {logo.rotation}°
            </span>
          </div>
        </div>

        {/* Styling, Color & Technique Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Background Remover */}
          <button
            onClick={handleToggleRemoveBg}
            disabled={isProcessing}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              logo.removeBg
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
            title="Auto-detects white/light backgrounds and renders transparent alpha"
          >
            <Scissors className="w-3.5 h-3.5 text-zinc-500" />
            <span>{logo.removeBg ? 'Transparent (Cleaned)' : 'Key Out White BG'}</span>
          </button>

          {/* Color Mode Selection */}
          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              onClick={() => handleColorModeChange('original')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                logo.colorMode === 'original'
                  ? 'bg-white text-zinc-900 shadow-2xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title="Keep original logo colors"
            >
              Original
            </button>
            <button
              onClick={() => handleColorModeChange('white')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                logo.colorMode === 'white'
                  ? 'bg-zinc-800 text-white shadow-2xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title="Invert logo to Solid White (Great for dark garments)"
            >
              <span className="w-2 h-2 rounded-full bg-white border border-zinc-400" />
              White
            </button>
            <button
              onClick={() => handleColorModeChange('black')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                logo.colorMode === 'black'
                  ? 'bg-zinc-800 text-white shadow-2xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title="Invert logo to Solid Black (Great for light garments)"
            >
              <span className="w-2 h-2 rounded-full bg-zinc-900" />
              Black
            </button>
          </div>

          {/* Print Technique Pill */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-semibold hidden lg:inline">Method:</span>
            <select
              value={logo.technique}
              onChange={(e) => handleTechniqueChange(e.target.value as PrintTechnique)}
              className="bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 text-zinc-800 font-medium rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer"
            >
              <option value="dtg">DTG (Soft Feel)</option>
              <option value="screenprint">Screenprint (Vibrant)</option>
              <option value="embroidery">Embroidery (3D Thread)</option>
              <option value="laser">Laser Etch / Ceramic</option>
            </select>
          </div>

          {/* Blend Mode */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-semibold hidden lg:inline">Blend:</span>
            <select
              value={logo.blendMode}
              onChange={(e) =>
                onChangeLogo({
                  ...logo,
                  blendMode: e.target.value as LogoConfig['blendMode'],
                })
              }
              className="bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 text-zinc-800 font-medium rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer"
            >
              <option value="multiply">Fabric Multiply</option>
              <option value="normal">Normal (Opaque)</option>
              <option value="screen">Screen (Light)</option>
              <option value="overlay">Overlay</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
