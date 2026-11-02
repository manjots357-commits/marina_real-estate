import React from 'react';
import { REAL_ESTATE_SERVICES } from '../data/properties';
import { Shield, Home, Compass, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface ServicesSectionProps {
  onConsultServices: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onConsultServices }) => {
  const serviceIcons = [Sparkles, Home, Compass, FileText];

  return (
    <section id="services" className="relative py-28 px-6 lg:px-16 bg-[#040914] border-b border-[#00F0FF]/20">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Services Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B172E] border border-[#00F0FF]/40 rounded-xs shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <Shield className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="text-[10px] tracking-[0.25em] text-[#00F0FF] uppercase font-semibold">
                Client Representation
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif-luxury text-[#F0F6FC] tracking-tight leading-tight">
              SERVICES FOR <br />
              <span className="cyan-gradient-text italic font-editorial">BUYERS & SELLERS</span>
            </h2>

            <p className="text-base text-[#CBD5E1] font-editorial leading-relaxed">
              Whether you are preparing to list your property for top market value or searching for a home in Katy or Houston, Marina provides attentive representation backed by interior design guidance and thorough market research.
            </p>

            <div className="p-6 bg-[#0B172E] border-l-2 border-[#00F0FF] rounded-xs space-y-2 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF] tracking-widest uppercase">
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                <span>Texas Real Estate Commission Consumer Care</span>
              </div>
              <p className="text-xs text-[#CBD5E1] font-light leading-relaxed">
                Operating with transparent fiduciary duty, clear communication in English and Russian, and professional adherence to Texas real estate standards.
              </p>
            </div>

            <div>
              <button
                onClick={onConsultServices}
                className="px-7 py-3.5 bg-[#00F0FF] hover:bg-[#38BDF8] text-[#040914] font-serif-luxury font-bold text-xs tracking-[0.2em] uppercase rounded-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] cursor-pointer"
              >
                Request Consultation
              </button>
            </div>
          </div>

          {/* Right Column: 4 Service Blocks */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {REAL_ESTATE_SERVICES.map((service, index) => {
              const Icon = serviceIcons[index] || Home;
              return (
                <div
                  key={index}
                  className="p-7 bg-[#0B172E]/90 border border-[#00F0FF]/25 hover:border-[#00F0FF] hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] rounded-xs transition-all duration-300 shadow-xl group"
                >
                  <div className="w-10 h-10 rounded-xs bg-[#060D1E] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] mb-5 group-hover:bg-[#00F0FF] group-hover:text-[#040914] transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-serif-luxury text-[#F0F6FC] group-hover:text-[#00F0FF] transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-xs text-[#CBD5E1] leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
