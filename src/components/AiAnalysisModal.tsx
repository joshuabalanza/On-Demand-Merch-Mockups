import React from 'react';
import { AiLogoAnalysis } from '../types';
import {
  X,
  Sparkles,
  Palette,
  Shirt,
  Layers,
  Camera,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AiLogoAnalysis | null;
  onSelectGarmentColor?: (colorName: string) => void;
  onApplyPhotoScene?: (scenePrompt: string) => void;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  onApplyPhotoScene,
}) => {
  if (!isOpen || !analysis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-zinc-900">
                AI Brand &amp; Merch Strategy Analysis
              </h2>
              <p className="text-xs text-zinc-500">
                Intelligent color matching, fabrication, and photoshoot guidance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          
          {/* Brand Vibe Header */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
                Detected Aesthetic Style
              </span>
              <h3 className="font-display font-bold text-base text-indigo-950 mt-0.5">
                {analysis.brandVibe || 'Contemporary Lifestyle'}
              </h3>
            </div>
            <span className="p-2 rounded-xl bg-white shadow-2xs text-indigo-600">
              <Lightbulb className="w-5 h-5" />
            </span>
          </div>

          {/* Recommended Garment Colors */}
          <div>
            <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Shirt className="w-3.5 h-3.5 text-zinc-500" /> Optimal Garment Colorways
            </span>
            <div className="flex flex-wrap gap-2">
              {analysis.recommendedGarmentColors?.map((color, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-200"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Print Technique */}
          <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 flex flex-col gap-1.5">
            <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Recommended Method:{' '}
              <span className="text-blue-700">
                {analysis.recommendedPrintTechnique || 'Direct-to-Garment (DTG)'}
              </span>
            </span>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {analysis.printTechniqueReason}
            </p>
          </div>

          {/* Suggested Lifestyle Photo Scenes */}
          {analysis.suggestedPhotoScenes && analysis.suggestedPhotoScenes.length > 0 && (
            <div>
              <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Camera className="w-3.5 h-3.5 text-zinc-500" /> Suggested AI Photoshoot Concepts
              </span>
              <div className="flex flex-col gap-2">
                {analysis.suggestedPhotoScenes.map((scene, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-zinc-200/80 hover:border-blue-400 hover:bg-blue-50/30 text-xs transition-all flex items-center justify-between gap-3"
                  >
                    <p className="text-zinc-700 font-medium leading-snug">{scene}</p>
                    {onApplyPhotoScene && (
                      <button
                        onClick={() => {
                          onApplyPhotoScene(scene);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[11px] shrink-0 transition-all active:scale-95"
                      >
                        Use Scene
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
