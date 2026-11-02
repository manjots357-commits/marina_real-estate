import React, { useState } from 'react';
import { Property, GroundingLink } from '../types';
import { PROPERTIES } from '../data/properties';
import { MapPin, Navigation, ExternalLink, Sparkles, Loader2, Compass, Shield } from 'lucide-react';

interface MapsGroundingExplorerProps {
  initialProperty?: Property | null;
}

export const MapsGroundingExplorer: React.FC<MapsGroundingExplorerProps> = ({ initialProperty }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property>(initialProperty || PROPERTIES[0]);
  const [customQuery, setCustomQuery] = useState(
    `${initialProperty ? initialProperty.location : PROPERTIES[0].location} parks, top schools, shopping centers, and dining`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [groundingText, setGroundingText] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFetchGrounding = async (property: Property, overrideQuery?: string) => {
    setIsLoading(true);
    setHasSearched(true);
    const queryToUse = overrideQuery || `Community amenities, top schools, parks, and dining near ${property.title} in ${property.location}, Texas`;

    try {
      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToUse,
          latitude: property.latitude,
          longitude: property.longitude,
        }),
      });

      const data = await res.json();
      setGroundingText(data.text);
      setGroundingChunks(data.groundingChunks || []);
    } catch (err) {
      console.error('Maps Grounding fetch error:', err);
      setGroundingText('Neighborhood intelligence could not be retrieved at this moment.');
      setGroundingChunks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    const newQuery = `Community amenities, top schools, parks, and dining near ${prop.title} in ${prop.location}, Texas`;
    setCustomQuery(newQuery);
    handleFetchGrounding(prop, newQuery);
  };

  return (
    <section id="location-grounding" className="relative py-28 px-6 lg:px-16 bg-[#040914] border-b border-[#00F0FF]/20">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B172E] border border-[#00F0FF]/40 rounded-xs mb-3 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <Navigation className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="text-[10px] tracking-[0.25em] text-[#00F0FF] uppercase font-semibold">
                Google Maps Live Grounding
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury text-[#F0F6FC] tracking-tight">
              HOUSTON & KATY <span className="cyan-gradient-text italic font-editorial">COMMUNITIES</span>
            </h2>
            <p className="mt-3 text-[#CBD5E1] font-editorial text-lg max-w-xl">
              Real-time exploration of school districts (Katy ISD, Spring Branch ISD), parks, shopping centers (LaCenterra, CityCentre), and community landmarks powered by Google Maps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PROPERTIES.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectProperty(p)}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase rounded-xs border transition-all cursor-pointer ${
                  selectedProperty.id === p.id
                    ? 'bg-[#00F0FF] text-[#040914] border-[#00F0FF] font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'bg-[#0B172E] text-[#F0F6FC]/80 border-[#00F0FF]/30 hover:border-[#00F0FF]'
                }`}
              >
                {p.title.split(' ')[0] || p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Query Bar */}
        <div className="p-6 bg-[#0B172E] border border-[#00F0FF]/30 rounded-xs mb-8 shadow-[0_0_25px_rgba(0,240,255,0.1)]">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full flex items-center gap-2 px-4 py-3 bg-[#060D1E] border border-[#00F0FF]/30 rounded-xs">
              <MapPin className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Inquire about parks, top Katy ISD schools, shopping, or dining..."
                className="w-full bg-transparent text-xs text-[#F0F6FC] focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleFetchGrounding(selectedProperty, customQuery)}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-[#00F0FF] hover:bg-[#38BDF8] disabled:opacity-50 text-[#040914] font-bold text-xs tracking-widest uppercase rounded-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Grounding...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Verify with Maps</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Architectural Location Summary */}
          <div className="lg:col-span-4 p-6 bg-[#0B172E] border border-[#00F0FF]/25 rounded-xs space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            <span className="text-[10px] text-[#00F0FF] tracking-widest uppercase font-semibold block">
              Active Area & Coordinates
            </span>
            <h3 className="text-2xl font-serif-luxury text-[#F0F6FC]">
              {selectedProperty.title}
            </h3>
            <p className="text-xs text-[#CBD5E1] font-light leading-relaxed">
              {selectedProperty.location}, {selectedProperty.country}
            </p>

            <div className="p-3 bg-[#060D1E] border border-[#00F0FF]/20 rounded-xs text-[11px] font-mono text-[#00F0FF]">
              GPS: {selectedProperty.latitude.toFixed(4)}° N, {selectedProperty.longitude.toFixed(4)}° W
            </div>

            <div className="pt-4 border-t border-[#00F0FF]/20">
              <span className="text-xs font-semibold text-[#F0F6FC] block mb-2">Community Advantages</span>
              <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                  <span>Top-Ranked Texas Public School Districts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                  <span>Abundant Parks, Greenbelts & Community Lakes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                  <span>Easy Access to I-10, Grand Parkway (99) & Westpark</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Grounding Intelligence Output with Extracted Links */}
          <div className="lg:col-span-8 p-6 bg-[#0B172E] border border-[#00F0FF]/35 rounded-xs shadow-[0_0_25px_rgba(0,240,255,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#00F0FF]/20 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                  <span className="text-xs tracking-wider uppercase font-semibold text-[#F0F6FC]">
                    Google Maps Verified Grounding Report
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase font-semibold">
                  gemini-3.8-flash (googleMaps)
                </span>
              </div>

              {isLoading ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00F0FF]" />
                  <p className="text-xs text-[#CBD5E1] font-mono">
                    Querying Google Maps grounding nodes for luxury infrastructure...
                  </p>
                </div>
              ) : groundingText ? (
                <div className="space-y-6">
                  <div className="text-xs leading-relaxed text-[#F0F6FC]/90 whitespace-pre-line font-light">
                    {groundingText}
                  </div>

                  {/* Extract URLs from groundingChunks and list them on the web app as links */}
                  {groundingChunks && groundingChunks.length > 0 && (
                    <div className="pt-4 border-t border-[#00F0FF]/25">
                      <h4 className="text-xs font-serif-luxury text-[#00F0FF] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>Verified Google Maps Destination Links</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {groundingChunks.map((chunk, idx) => {
                          const mapData = chunk.maps;
                          if (!mapData || !mapData.uri) return null;
                          return (
                            <a
                              key={idx}
                              href={mapData.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 bg-[#060D1E] hover:bg-[#102242] border border-[#00F0FF]/30 hover:border-[#00F0FF] rounded-xs flex items-center justify-between text-xs text-[#F0F6FC] transition-all group"
                            >
                              <span className="font-medium truncate pr-2">
                                {mapData.title || `Destination Landmark #${idx + 1}`}
                              </span>
                              <ExternalLink className="w-3.5 h-3.5 text-[#00F0FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[#94A3B8]">
                  <p>Click "Verify with Maps" to generate verified real-time neighborhood intelligence.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
