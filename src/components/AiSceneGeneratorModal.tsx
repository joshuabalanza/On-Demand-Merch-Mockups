import React, { useState } from 'react';
import { Product, LogoConfig, AiSceneGeneration } from '../types';
import {
  X,
  Sparkles,
  Wand2,
  Download,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AiSceneGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  colorName: string;
  logo: LogoConfig;
  savedScenes: AiSceneGeneration[];
  onAddSavedScene: (scene: AiSceneGeneration) => void;
}

export const AiSceneGeneratorModal: React.FC<AiSceneGeneratorModalProps> = ({
  isOpen,
  onClose,
  product,
  colorName,
  logo,
  savedScenes,
  onAddSavedScene,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'edit' | 'gallery'>('generate');
  const [prompt, setPrompt] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [selectedSceneForEdit, setSelectedSceneForEdit] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [latestGeneratedImage, setLatestGeneratedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset lifestyle photoshoot prompts tailored to product types
  const getPresets = () => {
    return [
      {
        title: 'Sunlit Studio Flatlay',
        text: `Minimalist commercial overhead flatlay of a ${colorName} ${product.name} on light grey polished concrete with architectural morning shadows and dried botanical stems.`,
      },
      {
        title: 'Aesthetic Coffee Shop',
        text: `Lifestyle shot of a customer in a warm bustling Scandinavian cafe wearing a ${colorName} ${product.name}, soft golden hour light through tall windows, warm bokeh background.`,
      },
      {
        title: 'Streetwear Dusk Editorial',
        text: `Fashion editorial photoshoot of a model wearing this ${colorName} ${product.name} walking down a wet urban Tokyo street at dusk, cinematic cyan and amber reflections.`,
      },
      {
        title: 'Misty Alpine Outdoors',
        text: `Rugged outdoor lifestyle shot of this ${colorName} ${product.name} on a hiker overlooking a misty pine forest and alpine mountain range at sunrise.`,
      },
      {
        title: 'Clean E-Commerce Pedestal',
        text: `Sleek hero product photo of the ${colorName} ${product.name} on a circular oak pedestal, soft studio wrap lighting, crisp details and neutral warm background.`,
      },
    ];
  };

  const editPresets = [
    'Add warm golden hour rim lighting and subtle atmospheric haze',
    'Change the background to a sleek modern architectural concrete loft',
    'Add soft natural depth of field with creamy bokeh',
    'Enhance dramatic studio contrast with subtle film grain',
  ];

  // Call Server Gemini API to generate custom product shot
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);
    setLoadingStage('Composing photoshoot scene with Gemini...');

    try {
      setLoadingStage('Synthesizing photorealistic product textures and lighting...');
      const response = await fetch('/api/ai/generate-mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          logoBase64: logo.dataUrl,
          productName: product.name,
          productColor: colorName,
          aspectRatio: '1:1',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate scene with AI');
      }

      setLatestGeneratedImage(data.imageUrl);
      const newScene: AiSceneGeneration = {
        id: `ai-scene-${Date.now()}`,
        prompt,
        imageUrl: data.imageUrl,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        productName: product.name,
      };
      onAddSavedScene(newScene);
      setSelectedSceneForEdit(data.imageUrl);
    } catch (err: any) {
      console.error('AI Generation error:', err);
      setErrorMsg(
        err.message ||
          'Failed to reach AI image generation endpoint. Ensure GEMINI_API_KEY is configured in Settings > Secrets.'
      );
    } finally {
      setIsGenerating(false);
      setLoadingStage('');
    }
  };

  // Call Server Gemini API to edit active image with text prompt
  const handleEditMockup = async () => {
    const targetImage = selectedSceneForEdit || latestGeneratedImage || logo.dataUrl;
    if (!editPrompt.trim() || !targetImage) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setLoadingStage('Applying prompt modifications to image with Gemini...');

    try {
      const response = await fetch('/api/ai/edit-mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editPrompt,
          imageBase64: targetImage,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to edit image with AI');
      }

      setLatestGeneratedImage(data.imageUrl);
      const newScene: AiSceneGeneration = {
        id: `ai-edit-${Date.now()}`,
        prompt: `Edit: ${editPrompt}`,
        imageUrl: data.imageUrl,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        productName: product.name,
      };
      onAddSavedScene(newScene);
      setSelectedSceneForEdit(data.imageUrl);
      setActiveTab('gallery');
    } catch (err: any) {
      console.error('AI Edit error:', err);
      setErrorMsg(err.message || 'Failed to edit image. Check AI Studio API key settings.');
    } finally {
      setIsGenerating(false);
      setLoadingStage('');
    }
  };

  // Download Image Helper
  const downloadImage = (url: string, filename = 'ai-mockup-scene.png') => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-zinc-900">
                AI Commercial Photoshoot Studio
              </h2>
              <p className="text-xs text-zinc-500">
                Generate custom lifestyle product shots and edit scenes using Gemini image preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center bg-zinc-200/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'generate'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Generate Scene
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'edit'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Prompt to Edit
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'gallery'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span>Gallery</span>
                {savedScenes.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-mono">
                    {savedScenes.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">AI Generation Notice</p>
                <p className="mt-0.5 opacity-90">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* TAB 1: GENERATE NEW SCENE */}
          {activeTab === 'generate' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Prompt & Presets (Col 7) */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                    Describe the photoshoot scene or setting:
                  </label>
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`e.g. Model in casual streetwear sitting on a vintage leather sofa wearing this ${colorName} ${product.name}, moody ambient table lighting...`}
                    className="w-full text-xs p-3 rounded-xl border border-zinc-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none"
                  />
                </div>

                {/* Preset Prompts */}
                <div>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                    Or choose a curated photoshoot style:
                  </span>
                  <div className="flex flex-col gap-2">
                    {getPresets().map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(preset.text)}
                        className="text-left p-2.5 rounded-xl border border-zinc-200/90 hover:border-blue-500 hover:bg-blue-50/40 text-xs transition-all flex flex-col gap-0.5"
                      >
                        <span className="font-bold text-zinc-900 flex items-center justify-between">
                          <span>{preset.title}</span>
                          <ArrowRight className="w-3 h-3 text-zinc-400" />
                        </span>
                        <span className="text-zinc-500 text-[11px] line-clamp-1">
                          {preset.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="mt-2 w-full py-3 rounded-xl font-bold text-xs text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>{loadingStage || 'Generating scene...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate AI Lifestyle Shot</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Preview Box (Col 5) */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-zinc-700">
                  {latestGeneratedImage ? 'Generated Commercial Shot' : 'Output Preview'}
                </span>
                <div className="aspect-square w-full rounded-2xl border border-zinc-200 bg-zinc-100 overflow-hidden flex items-center justify-center relative shadow-inner">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 animate-ping absolute inset-0" />
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-amber-400 relative">
                          <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-zinc-800 animate-pulse">
                        {loadingStage || 'Creating studio shot with Gemini...'}
                      </p>
                    </div>
                  ) : latestGeneratedImage ? (
                    <img
                      src={latestGeneratedImage}
                      alt="Generated Merch Scene"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400 text-center p-6">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <p className="text-xs">
                        Enter a prompt or select a preset on the left to generate realistic on-model and lifestyle photoshoots.
                      </p>
                    </div>
                  )}
                </div>

                {latestGeneratedImage && !isGenerating && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadImage(latestGeneratedImage)}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Image</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSceneForEdit(latestGeneratedImage);
                        setActiveTab('edit');
                      }}
                      className="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Edit with Prompt</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROMPT TO EDIT */}
          {activeTab === 'edit' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-7 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                    What would you like the AI to modify or adjust?
                  </label>
                  <textarea
                    rows={3}
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="e.g. Add warm sunset lighting, make the background an open-air cafe, soften highlights..."
                    className="w-full text-xs p-3 rounded-xl border border-zinc-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none"
                  />
                </div>

                {/* Edit Presets */}
                <div>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                    Quick Edit Ideas:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {editPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setEditPrompt(preset)}
                        className="text-left p-2.5 rounded-xl border border-zinc-200 hover:border-blue-500 hover:bg-blue-50/30 text-xs font-medium text-zinc-700 transition-all flex items-center justify-between"
                      >
                        <span>{preset}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleEditMockup}
                  disabled={isGenerating || !editPrompt.trim()}
                  className="mt-2 w-full py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{loadingStage || 'Editing image...'}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Apply AI Image Edits</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preview target */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-zinc-700">Target Image for Editing</span>
                <div className="aspect-square w-full rounded-2xl border border-zinc-200 bg-zinc-100 overflow-hidden flex items-center justify-center">
                  {selectedSceneForEdit ? (
                    <img
                      src={selectedSceneForEdit}
                      alt="Edit source"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-xs text-zinc-400 text-center p-6">
                      No scene selected. Generate a scene first or select one from the gallery.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SAVED SCENES GALLERY */}
          {activeTab === 'gallery' && (
            <div>
              {savedScenes.length === 0 ? (
                <div className="py-16 text-center text-zinc-400 flex flex-col items-center gap-2">
                  <ImageIcon className="w-10 h-10 opacity-30" />
                  <p className="text-sm font-semibold text-zinc-600">No scenes generated yet</p>
                  <p className="text-xs max-w-sm">
                    Generate your first commercial product shot using the &quot;Generate Scene&quot; tab!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {savedScenes.map((scene) => (
                    <div
                      key={scene.id}
                      className="group relative rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-100 aspect-square flex flex-col justify-end shadow-2xs"
                    >
                      <img
                        src={scene.imageUrl}
                        alt={scene.prompt}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="relative p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex flex-col gap-1.5">
                        <p className="text-[11px] font-medium line-clamp-2 leading-snug">
                          {scene.prompt}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-zinc-300 font-mono">
                            {scene.createdAt}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedSceneForEdit(scene.imageUrl);
                                setActiveTab('edit');
                              }}
                              className="p-1 rounded-lg bg-white/20 hover:bg-white/40 text-white"
                              title="Prompt to edit this scene"
                            >
                              <Wand2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => downloadImage(scene.imageUrl)}
                              className="p-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                              title="Download full-resolution file"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
