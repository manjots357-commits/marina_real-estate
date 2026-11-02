import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Download, Loader2, Wand2, Sliders, Check } from 'lucide-react';

interface AiImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiImageStudioModal: React.FC<AiImageStudioModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState(
    'Contemporary Houston estate great room with double-height ceiling, marble fireplace, wide-plank wood floors, and large windows overlooking private pool'
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      label: 'Katy Lakefront Manor',
      prompt: 'Elegant Texas lakefront estate with covered veranda, outdoor summer kitchen, private pool, and manicured lawn in Cinco Ranch, Katy.',
    },
    {
      label: 'Memorial Wooded Retreat',
      prompt: 'Modern transitional luxury home nestled among mature pine trees with floor-to-ceiling glass and resort pool in Memorial, Houston.',
    },
    {
      label: 'River Oaks Classic Estate',
      prompt: 'Stately southern traditional brick residence with manicured gardens, circular motor court, and architectural millwork in Houston.',
    },
    {
      label: 'The Heights Modern Craftsman',
      prompt: 'Contemporary urban craftsman home with large covered front porch, architectural siding, and warm twilight lantern lighting in The Heights, Houston.',
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageSize,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        setErrorMessage(data.error || 'Failed to render architectural visual. Please try again.');
      }
    } catch (err: any) {
      console.error('Image gen error:', err);
      setErrorMessage('Communication error with architectural imaging engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0B172E] border border-[#00F0FF]/45 rounded-xs shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#060D1E] border-b border-[#00F0FF]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#0B172E] border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-serif-luxury text-[#F0F6FC] tracking-wider">
                  Home Vision & Staging Visualizer
                </h3>
                <span className="text-[9px] px-1.5 py-0.5 bg-[#060D1E] border border-[#00F0FF] text-[#00F0FF] rounded-xs font-mono uppercase font-semibold">
                  gemini-3-pro-image-preview
                </span>
              </div>
              <p className="text-[11px] text-[#CBD5E1] font-editorial">
                High-Resolution Design Concept Rendering for Houston & Katy Homes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#CBD5E1] hover:text-[#00F0FF] hover:bg-[#060D1E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#060D1E] border border-[#00F0FF]/25 rounded-xs">
            {/* Resolution Affordance (1K, 2K, 4K) */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block mb-2">
                Output Resolution (Image Size)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`py-2 text-xs font-mono font-semibold rounded-xs border transition-all cursor-pointer ${
                      imageSize === size
                        ? 'bg-[#00F0FF] text-[#040914] border-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                        : 'bg-[#0B172E] text-[#F0F6FC]/80 border-[#00F0FF]/25 hover:border-[#00F0FF]'
                    }`}
                  >
                    {size} UHD
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block mb-2">
                Cinematic Framing (Aspect Ratio)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['16:9', '4:3', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 text-xs font-mono font-semibold rounded-xs border transition-all cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-[#00F0FF] text-[#040914] border-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                        : 'bg-[#0B172E] text-[#F0F6FC]/80 border-[#00F0FF]/25 hover:border-[#00F0FF]'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preset Prompts */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block mb-2">
              Architectural Concept Themes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(p.prompt)}
                  className="p-2.5 bg-[#060D1E] border border-[#00F0FF]/25 hover:border-[#00F0FF] text-left rounded-xs transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-[#F0F6FC] block">{p.label}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{p.prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block mb-2">
              Architectural Commission Vision Prompt
            </label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe materials, lighting, cantilevered volumes, pool elements..."
              className="w-full px-4 py-3 bg-[#060D1E] border border-[#00F0FF]/35 text-[#F0F6FC] rounded-xs text-xs focus:outline-none focus:border-[#00F0FF] leading-relaxed resize-none"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3.5 bg-[#00F0FF] hover:bg-[#38BDF8] disabled:opacity-40 text-[#040914] font-serif-luxury font-bold text-xs tracking-[0.2em] uppercase rounded-xs transition-all shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating {imageSize} Architectural Render...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate High-Quality {imageSize} Visual</span>
              </>
            )}
          </button>

          {errorMessage && (
            <p className="text-xs text-red-400 bg-red-950/50 p-3 rounded-xs border border-red-800">
              {errorMessage}
            </p>
          )}

          {/* Output Display */}
          {generatedImageUrl && (
            <div className="p-4 bg-[#060D1E] border border-[#00F0FF]/40 rounded-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif-luxury text-[#F0F6FC]">
                  Generated Architectural Render ({imageSize} &bull; {aspectRatio})
                </span>
                <a
                  href={generatedImageUrl}
                  download="marina_art_estate_render.png"
                  className="px-3 py-1 bg-[#0B172E] hover:bg-[#00F0FF] text-[#F0F6FC] hover:text-[#040914] border border-[#00F0FF]/40 text-xs rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Master</span>
                </a>
              </div>

              <div className="relative aspect-[16/9] w-full rounded-xs overflow-hidden border border-[#00F0FF]/30 shadow-2xl">
                <img
                  src={generatedImageUrl}
                  alt="Generated Architectural Concept"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
