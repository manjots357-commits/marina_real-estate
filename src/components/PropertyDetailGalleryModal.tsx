import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { X, ChevronLeft, ChevronRight, Bed, Bath, Maximize2, MapPin, ShieldCheck, Check, Calendar, MessageSquare } from 'lucide-react';

interface PropertyDetailGalleryModalProps {
  property: Property | null;
  onClose: () => void;
  onBookViewing: (property: Property) => void;
  onOpenAiConcierge: (property: Property) => void;
}

export const PropertyDetailGalleryModal: React.FC<PropertyDetailGalleryModalProps> = ({
  property,
  onClose,
  onBookViewing,
  onOpenAiConcierge,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [property, onClose]);

  if (!property) return null;

  const allImages = [property.heroImage, ...(property.gallery || [])];

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#0B172E] border border-[#00F0FF]/45 rounded-sm shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#060D1E] border-b border-[#00F0FF]/25">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
            <span className="text-xs tracking-[0.2em] uppercase text-[#00F0FF] font-semibold">
              SAMPLE DEMO PROPERTY &bull; {property.title.toUpperCase()}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#CBD5E1] hover:text-[#00F0FF] hover:bg-[#0B172E] border border-transparent hover:border-[#00F0FF]/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 lg:p-8 max-h-[85vh] overflow-y-auto">
          {/* Main Visual Showcase with Navigation */}
          <div className="relative aspect-[16/9] w-full bg-[#060D1E] rounded-xs overflow-hidden border border-[#00F0FF]/30 shadow-2xl">
            <img
              src={allImages[activeImageIndex]}
              alt={`${property.title} - View ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#060D1E]/80 text-[#F0F6FC] border border-[#00F0FF]/40 hover:bg-[#00F0FF] hover:text-[#040914] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#060D1E]/80 text-[#F0F6FC] border border-[#00F0FF]/40 hover:bg-[#00F0FF] hover:text-[#040914] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-[#060D1E]/90 border border-[#00F0FF]/40 rounded-xs text-[11px] font-mono text-[#00F0FF]">
              {activeImageIndex + 1} / {allImages.length}
            </div>

            {/* Price Tag */}
            <div className="absolute bottom-4 left-4 px-4 py-1.5 bg-[#060D1E]/95 border border-[#00F0FF] rounded-xs text-sm font-mono font-bold text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              {property.price}
            </div>
          </div>

          {/* Thumbnails Row */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 rounded-xs overflow-hidden border shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#00F0FF] ring-1 ring-[#00F0FF] scale-105 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'border-[#00F0FF]/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Details & Specs Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="text-[11px] text-[#00F0FF] tracking-[0.2em] uppercase font-semibold">
                  {property.location}, {property.country}
                </span>
                <h2 className="text-3xl font-serif-luxury text-[#F0F6FC] mt-1">
                  {property.title}
                </h2>
                <p className="text-base font-editorial italic text-[#38BDF8] mt-1">
                  {property.subTitle}
                </p>
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-[#060D1E] border border-[#00F0FF]/25 rounded-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#00F0FF]/80 block font-semibold">Interior Area</span>
                  <span className="text-lg font-mono font-bold text-[#F0F6FC]">{property.sqFt.toLocaleString()} SQ FT</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#00F0FF]/80 block font-semibold">Bedrooms</span>
                  <span className="text-lg font-mono font-bold text-[#F0F6FC]">{property.bedrooms} BEDS</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#00F0FF]/80 block font-semibold">Bathrooms</span>
                  <span className="text-lg font-mono font-bold text-[#F0F6FC]">{property.bathrooms} BATHS</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#00F0FF] font-semibold mb-2">
                  Design Narrative & Space Planning
                </h4>
                <p className="text-sm text-[#CBD5E1] leading-relaxed font-light">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#00F0FF] font-semibold mb-3">
                  Home Features & Community Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-[#060D1E] border border-[#00F0FF]/20 rounded-xs text-xs text-[#CBD5E1]">
                      <Check className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Actions & Agent Consultation Note */}
            <div className="bg-[#060D1E] border border-[#00F0FF]/30 p-6 rounded-xs flex flex-col justify-between shadow-[0_0_20px_rgba(0,240,255,0.1)]">
              <div>
                <div className="pb-4 border-b border-[#00F0FF]/20">
                  <span className="text-[10px] tracking-widest text-[#00F0FF] uppercase block font-semibold">Sample Valuation Concept</span>
                  <span className="text-2xl font-mono font-bold text-[#00F0FF] mt-1 block">
                    {property.price}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Illustrative market representation for demonstration
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="text-xs text-[#CBD5E1] leading-relaxed">
                    <strong className="text-[#00F0FF] block mb-1">Concept Presentation Notice:</strong>
                    This layout illustrates how Marina Art showcases properties with staging guidance, clear architectural storytelling, and Texas community insights.
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    onBookViewing(property);
                  }}
                  className="w-full py-3.5 bg-[#00F0FF] hover:bg-[#38BDF8] text-[#040914] font-bold text-xs tracking-widest uppercase rounded-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Inquire with Marina Art</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenAiConcierge(property);
                  }}
                  className="w-full py-3 bg-[#0B172E] hover:bg-[#102242] text-[#70F3FF] border border-[#00F0FF]/40 text-xs tracking-widest uppercase rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
                  <span>Ask Digital Assistant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
