import React, { useState } from 'react';
import { HOUSTON_KATY_NEIGHBORHOODS } from '../data/properties';
import { ThreeMansionViewer } from './ThreeMansionViewer';
import { Play, Pause, Box, Video, Sparkles, CloudRain, Volume2, VolumeX, ArrowRight, Compass, ShieldCheck, MapPin } from 'lucide-react';

interface HeroCinematicProps {
  onBookViewing: () => void;
  onExploreResidences: () => void;
  onOpenAiConcierge: () => void;
  showRain: boolean;
  setShowRain: (val: boolean) => void;
  showEmbers: boolean;
  setShowEmbers: (val: boolean) => void;
}

export const HeroCinematic: React.FC<HeroCinematicProps> = ({
  onBookViewing,
  onExploreResidences,
  onOpenAiConcierge,
  showRain,
  setShowRain,
  showEmbers,
  setShowEmbers,
}) => {
  const [activeLevelIdx, setActiveLevelIdx] = useState(0); // Default Katy & Cinco Ranch
  const [viewMode, setViewMode] = useState<'video' | '3d' | 'cinematic'>('video');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const currentLevel = HOUSTON_KATY_NEIGHBORHOODS[activeLevelIdx];

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#040914] flex flex-col justify-between overflow-x-hidden border-b border-[#00F0FF]/20 pt-28 pb-8">
      {/* BACKGROUND DISPLAY: Cinematic Video, 3D Canvas, or Photography */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {viewMode === 'video' && (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src="/assets/aistudio/Recording_2026-11-01_220148_aa7cda6d.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover object-[8%_center] scale-110 sm:scale-125 lg:scale-[1.4] filter brightness-[0.66] contrast-[1.18] transition-all duration-1000"
            />
            {/* Deep Dark Navy Multi-Layer Gradients for an immersive futuristic atmosphere */}
            <div className="absolute inset-0 bg-[#040914]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040914] via-transparent to-[#040914]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#040914]/95 via-[#040914]/50 to-[#040914]" />
            {/* Solid mask for the right side to eliminate raw recording text */}
            <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] bg-gradient-to-l from-[#040914] via-[#040914] via-75% to-transparent pointer-events-none" />
          </div>
        )}

        {viewMode === '3d' && (
          <div className="w-full h-full pointer-events-auto">
            <ThreeMansionViewer
              currentLevelIndex={activeLevelIdx}
              onSelectLevel={(idx) => setActiveLevelIdx(idx)}
              showBadge={false}
            />
          </div>
        )}

        {viewMode === 'cinematic' && (
          <div className="relative w-full h-full overflow-hidden">
            <img
              key={currentLevel.image}
              src={currentLevel.image}
              alt={currentLevel.name}
              className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.12] transition-transform duration-1000 ease-out transform scale-105 hover:scale-110"
            />
            <div className="absolute inset-0 bg-[#040914]/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040914] via-[#040914]/30 to-[#040914]/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#040914]/95 via-[#040914]/40 to-[#040914]/85" />
          </div>
        )}
      </div>

      {/* TOP CONTROLS BAR: Mode Switcher & Atmospheric Controls */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-6 lg:px-12 flex flex-wrap items-center justify-between gap-4 pt-2 pb-4">
        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0B172E]/95 border border-[#00F0FF]/35 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md">
          <button
            onClick={() => setViewMode('video')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all cursor-pointer ${
              viewMode === 'video'
                ? 'bg-[#00F0FF] text-[#040914] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-[#F0F6FC]/80 hover:text-[#00F0FF]'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Cinematic Film</span>
          </button>

          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-[#00F0FF] text-[#040914] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-[#F0F6FC]/80 hover:text-[#00F0FF]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Architecture Model</span>
          </button>

          <button
            onClick={() => setViewMode('cinematic')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all cursor-pointer ${
              viewMode === 'cinematic'
                ? 'bg-[#00F0FF] text-[#040914] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-[#F0F6FC]/80 hover:text-[#00F0FF]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Photo Gallery</span>
          </button>
        </div>

        {/* Ambient Effects Toggles (Rain / Embers / Mute) */}
        <div className="flex items-center gap-2">
          {viewMode === 'video' && (
            <button
              onClick={handleVideoToggle}
              title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
              className="p-2 rounded-full bg-[#0B172E]/90 border border-[#00F0FF]/35 text-[#00F0FF] hover:border-[#00F0FF] transition-all cursor-pointer shadow-lg"
            >
              {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {viewMode === 'video' && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-full bg-[#0B172E]/90 border border-[#00F0FF]/35 text-[#00F0FF] hover:border-[#00F0FF] transition-all cursor-pointer shadow-lg"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={() => setShowRain(!showRain)}
            title="Toggle Cinematic Rain"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs border tracking-wider uppercase transition-all cursor-pointer shadow-lg ${
              showRain
                ? 'bg-[#0B172E] border-[#00F0FF] text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'bg-[#0B172E]/90 border-[#00F0FF]/35 text-slate-400'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rain</span>
          </button>

          <button
            onClick={() => setShowEmbers(!showEmbers)}
            title="Toggle Neon Particles"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs border tracking-wider uppercase transition-all cursor-pointer shadow-lg ${
              showEmbers
                ? 'bg-[#0B172E] border-[#38BDF8] text-[#70F3FF] shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                : 'bg-[#0B172E]/90 border-[#00F0FF]/35 text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Particles</span>
          </button>
        </div>
      </div>

      {/* MAIN HERO VIEWPORT CONTAINER: Two-Column Responsive Layout */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-6 lg:px-12 py-4 lg:py-6 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Hero Copy & Actions with Proper Padding */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Brokerage & Location Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B172E]/95 border border-[#00F0FF]/40 rounded-xs w-fit mb-4 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="text-[10px] tracking-[0.25em] text-[#00F0FF] uppercase font-semibold">
                Houston & Katy, TX &bull; Premier Haus Realty, LLC
              </span>
            </div>

            {/* Hero Main Heading with Dedicated Padding */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif-luxury text-[#F0F6FC] leading-[1.08] tracking-tight py-2 my-1">
              EXCEPTIONAL HOMES. <br />
              <span className="cyan-gradient-text italic font-editorial tracking-normal">ELEVATED BY DESIGN.</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="mt-3 text-base sm:text-lg text-[#F0F6FC]/85 font-editorial italic max-w-xl leading-relaxed">
              Personalized residential representation across Katy, Cinco Ranch, Memorial, River Oaks, and Greater Houston &mdash; elevated by professional interior design and home staging expertise.
            </p>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={onBookViewing}
                className="w-full sm:w-auto justify-center group px-7 py-3.5 bg-[#00F0FF] hover:bg-[#38BDF8] text-[#040914] font-serif-luxury font-bold text-xs tracking-[0.2em] uppercase rounded-xs transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] flex items-center gap-2 cursor-pointer"
              >
                <span>Schedule Consultation</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreResidences}
                className="w-full sm:w-auto justify-center px-6 py-3.5 bg-[#0B172E]/90 hover:bg-[#102242] text-[#F0F6FC] border border-[#00F0FF]/45 hover:border-[#00F0FF] font-serif-luxury text-xs tracking-[0.18em] uppercase rounded-xs transition-all duration-300 cursor-pointer shadow-lg flex items-center"
              >
                View Demo Listings
              </button>

              <button
                onClick={onOpenAiConcierge}
                className="w-full sm:w-auto justify-center px-5 py-3.5 bg-[#0B172E]/90 hover:bg-[#102242] text-[#70F3FF] border border-[#38BDF8]/45 hover:border-[#00F0FF] text-xs tracking-wider uppercase rounded-xs transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>AI Assistant</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Feature Card for Houston & Katy Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative z-20 w-full max-w-md lg:max-w-lg bg-[#0B172E]/90 backdrop-blur-md border border-[#00F0FF]/40 p-6 rounded-xs shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-500">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#00F0FF]/20 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                  <span className="text-xs font-mono font-bold tracking-widest text-[#00F0FF] uppercase">
                    {currentLevel.levelNumber}
                  </span>
                </div>
                <div className="px-2.5 py-0.5 bg-[#060D1E] border border-[#00F0FF]/30 rounded-xs text-[10px] font-mono text-[#70F3FF]">
                  {currentLevel.elevation}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-serif-luxury text-[#F0F6FC] tracking-wide mb-2">
                {currentLevel.name}
              </h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed font-light mb-4">
                {currentLevel.description}
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {currentLevel.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 p-1.5 bg-[#060D1E] border border-[#00F0FF]/20 text-[10px] text-[#E2E8F0] rounded-xs truncate"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>

              {/* Card Footer Action with Demo Notice */}
              <div className="pt-3 border-t border-[#00F0FF]/20 flex items-center justify-between">
                <span className="text-[10px] text-[#00F0FF] tracking-widest uppercase font-mono font-semibold">
                  Sample Concept Listing
                </span>
                <button
                  onClick={onExploreResidences}
                  className="text-xs font-semibold text-[#70F3FF] hover:text-[#00F0FF] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Properties</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM COMMUNITY SELECTOR BAR */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-6 lg:px-12 pt-3">
        <div className="border-t border-[#00F0FF]/20 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#00F0FF] font-semibold">
              Explore Neighborhood:
            </span>
            <span className="text-xs text-[#CBD5E1]">
              {currentLevel.name}
            </span>
          </div>

          {/* Interactive Neighborhood Switch Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {HOUSTON_KATY_NEIGHBORHOODS.map((lvl, index) => {
              const isActive = activeLevelIdx === index;
              return (
                <button
                  key={lvl.levelNumber}
                  onClick={() => {
                    setActiveLevelIdx(index);
                    if (viewMode === 'video') {
                      setViewMode('cinematic');
                    }
                  }}
                  className={`px-4 py-2 border text-xs tracking-widest uppercase transition-all duration-300 rounded-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-md ${
                    isActive
                      ? 'bg-[#00F0FF] text-[#040914] border-[#00F0FF] font-bold scale-105 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'bg-[#0B172E]/95 text-[#F0F6FC]/80 border-[#00F0FF]/30 hover:border-[#00F0FF] hover:text-[#00F0FF]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#040914]' : 'bg-[#00F0FF]'}`} />
                  <span>{lvl.levelNumber}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
