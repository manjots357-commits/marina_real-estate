import React from 'react';
import { ArrowUp, Building2, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const communities = [
    { name: 'Katy & Cinco Ranch', desc: 'Top Katy ISD Schools & Master-Planned Lakes' },
    { name: 'Memorial Villages', desc: 'Wooded Acreage & Spring Branch ISD' },
    { name: 'River Oaks', desc: 'Historic Mansions & Memorial Park Proximity' },
    { name: 'The Heights', desc: 'Walkable Craftsman Living & Inner Loop Culture' },
    { name: 'Energy Corridor', desc: 'Executive Living Near Major Employers' },
    { name: 'Sugar Land', desc: 'Family Enclaves & Master-Planned Communities' },
  ];

  return (
    <footer className="relative bg-[#060D1E] border-t border-[#00F0FF]/25 pt-20 pb-12 px-6 lg:px-16 text-[#CBD5E1] text-xs">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Tier */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xs bg-[#0B172E] border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.25)]">
                <span className="font-serif-luxury font-bold text-base">M</span>
              </div>
              <div>
                <span className="text-xl font-serif-luxury font-bold tracking-[0.2em] text-[#F0F6FC] block">
                  MARINA ART
                </span>
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider block -mt-0.5 font-semibold">
                  Real Estate Agent &bull; Premier Haus Realty, LLC
                </span>
              </div>
            </div>

            <p className="text-xs text-[#CBD5E1] font-light leading-relaxed max-w-sm">
              Providing personalized residential real estate representation across Katy, Cinco Ranch, Memorial, and Greater Houston &mdash; enriched by an interior design background.
            </p>

            <div className="pt-2 text-[11px] text-[#00F0FF] font-mono flex items-center gap-2 font-semibold">
              <Building2 className="w-4 h-4 text-[#00F0FF]" />
              <span>Brokerage: Premier Haus Realty, LLC &bull; Texas</span>
            </div>

            {/* Client Concept Disclaimer */}
            <div className="p-3 bg-[#0B172E] border border-[#00F0FF]/25 rounded-xs text-[10px] text-[#CBD5E1] leading-relaxed max-w-sm">
              <strong className="text-[#00F0FF] block mb-0.5 font-semibold">Demo Presentation Concept:</strong>
              This website is an unofficial design concept developed exclusively for client demonstration. All property listings shown are conceptual samples.
            </div>
          </div>

          {/* Service Areas */}
          <div className="md:col-span-7">
            <h4 className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Key Houston & Katy Communities Served</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {communities.map((comm, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-sm font-serif-luxury text-[#F0F6FC] block">
                    {comm.name}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block leading-tight">
                    {comm.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Texas Real Estate Commission Consumer Information Links (TREC compliance) */}
            <div className="mt-8 pt-6 border-t border-[#00F0FF]/15 flex flex-wrap items-center gap-4 text-[11px] text-[#00F0FF]">
              <a
                href="https://www.trec.texas.gov/forms/consumer-protection-notice"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 text-[#70F3FF] hover:text-[#00F0FF]"
              >
                <span>TREC Consumer Protection Notice</span>
                <ExternalLink className="w-3 h-3 text-[#00F0FF]" />
              </a>
              <span className="text-slate-600">&bull;</span>
              <a
                href="https://www.trec.texas.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 text-[#70F3FF] hover:text-[#00F0FF]"
              >
                <span>Texas Information About Brokerage Services (IABS)</span>
                <ExternalLink className="w-3 h-3 text-[#00F0FF]" />
              </a>
              <span className="text-slate-600">&bull;</span>
              <span className="text-[#CBD5E1]">Equal Housing Opportunity</span>
            </div>
          </div>
        </div>

        {/* Bottom Tier */}
        <div className="pt-8 border-t border-[#00F0FF]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94A3B8]">
          <div>
            &copy; {new Date().getFullYear()} Marina Art &bull; Premier Haus Realty, LLC. All rights reserved. Unofficial Demo Concept.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#00F0FF]">Houston & Katy, Texas</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xs bg-[#0B172E] border border-[#00F0FF]/30 text-[#00F0FF] hover:border-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#040914] transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
