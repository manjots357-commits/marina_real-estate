import React from 'react';
import { MARINA_BIO } from '../data/properties';
import { ShieldCheck, Languages, MapPin, Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

interface AgentAdvisorsProps {
  onContactAdvisor: (advisorName: string) => void;
}

export const AgentAdvisors: React.FC<AgentAdvisorsProps> = ({ onContactAdvisor }) => {
  return (
    <section id="about" className="relative py-28 px-6 lg:px-16 bg-[#040914] border-b border-[#00F0FF]/20">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Profile Visual */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#0B172E] border border-[#00F0FF]/40 p-4 rounded-xs shadow-[0_0_30px_rgba(0,240,255,0.15)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xs">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85"
                  alt="Marina Art - Real Estate Agent"
                  className="w-full h-full object-cover filter brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B172E] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#060D1E]/90 border border-[#00F0FF]/50 rounded-xs mb-2">
                    <Building2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span className="text-[10px] font-mono tracking-widest text-[#00F0FF] uppercase font-semibold">
                      Premier Haus Realty, LLC
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif-luxury text-[#F0F6FC]">
                    Marina Art
                  </h3>
                  <p className="text-xs font-editorial italic text-[#38BDF8] mt-0.5">
                    Licensed REALTOR® &bull; Interior Design Background
                  </p>
                </div>
              </div>

              {/* Verified Fact Points */}
              <div className="mt-4 p-4 bg-[#060D1E] border border-[#00F0FF]/25 rounded-xs space-y-2 text-xs text-[#CBD5E1]">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span><strong>Languages:</strong> Fluent in English & Russian</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span><strong>Markets:</strong> Houston, Katy & Surrounding Texas Communities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span><strong>Design Expertise:</strong> Staging & Spatial Planning Guidance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative & Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B172E] border border-[#00F0FF]/40 rounded-xs shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="text-[10px] tracking-[0.25em] text-[#00F0FF] uppercase font-semibold">
                About The Agent
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif-luxury text-[#F0F6FC] tracking-tight leading-tight">
              MEET MARINA ART <br />
              <span className="cyan-gradient-text italic font-editorial">LICENSED REALTOR®</span>
            </h2>

            <p className="text-base text-[#CBD5E1] font-editorial leading-relaxed">
              Marina Art is a licensed real estate professional affiliated with <strong className="text-[#F0F6FC]">Premier Haus Realty, LLC</strong>, dedicated to serving clients throughout Houston, Katy, and surrounding Texas neighborhoods.
            </p>

            <div className="space-y-4 text-xs text-[#CBD5E1] font-light leading-relaxed">
              <p>
                What distinguishes Marina is her professional background in <strong className="text-[#F0F6FC]">interior design</strong>. Real estate is fundamentally about spatial experience; having a designer's perspective enables Marina to help sellers highlight their home's best architectural attributes through strategic staging, while helping buyers envision how a floor plan can adapt to their family’s lifestyle.
              </p>
              <p>
                Fluent in both <strong className="text-[#F0F6FC]">English and Russian</strong>, Marina frequently assists local families, corporate transferees moving to Texas's bustling energy and medical hubs, and international clients seeking clear, attentive guidance through Texas residential transactions.
              </p>
            </div>

            {/* Verified Focus Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Single-Family Residential Buying & Selling',
                'Katy Master-Planned Communities (Cinco Ranch, Elyson)',
                'Houston Enclaves (Memorial, River Oaks, The Heights)',
                'Professional Interior Staging Consultations',
                'Zoning & Local School District Awareness (Katy ISD)',
                'Ethical Texas Real Estate Commission Fiduciary Standards',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#E2E8F0]">
                  <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onContactAdvisor('Marina Art')}
                className="px-7 py-3.5 bg-[#00F0FF] hover:bg-[#38BDF8] text-[#040914] font-serif-luxury font-bold text-xs tracking-[0.2em] uppercase rounded-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center gap-2 cursor-pointer"
              >
                <span>Connect With Marina</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] font-mono text-[#00F0FF]">
                Premier Haus Realty, LLC &bull; Greater Houston
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
