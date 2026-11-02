import React from 'react';
import { Sparkles, MapPin, Languages, ShieldCheck, Home, Eye } from 'lucide-react';

export const LuxuryLifestyle: React.FC = () => {
  const experiences = [
    {
      title: 'Interior Design Background',
      subtitle: 'Spatial Vision & Aesthetic Guidance',
      description: 'Marina brings a dedicated professional background in interior design. This allows sellers to stage their properties for maximum emotional and financial appeal, and empowers buyers to see renovation and layout possibilities.',
      icon: Sparkles,
      metric: 'Design Insight',
    },
    {
      title: 'Houston & Katy Area Focus',
      subtitle: 'Neighborhood & School Familiarity',
      description: 'Specializing in Katy’s premier master-planned communities (Cinco Ranch, Grand Lakes, Elyson) as well as Houston’s distinguished neighborhoods (Memorial, River Oaks, The Heights, Energy Corridor).',
      icon: MapPin,
      metric: 'Local Focus',
    },
    {
      title: 'Bilingual Representation',
      subtitle: 'Fluent in English & Russian',
      description: 'Offering attentive, culturally informed communication for local Texas homebuyers, corporate transferees, and international clients relocating to the Greater Houston metropolitan region.',
      icon: Languages,
      metric: 'English & Russian',
    },
    {
      title: 'Premier Haus Realty, LLC',
      subtitle: 'Professional Brokerage Alignment',
      description: 'Affiliated with Premier Haus Realty, LLC, providing clients with robust MLS marketing, contractual compliance, and client-first fiduciary representation under Texas Real Estate Commission guidelines.',
      icon: ShieldCheck,
      metric: 'Licensed REALTOR®',
    },
    {
      title: 'Tailored Buyer Representation',
      subtitle: 'Custom Search & Analysis',
      description: 'Guiding buyers through every milestone: identifying target school districts (such as Katy ISD), conducting comparative market analyses, and negotiating contracts with client interests at the forefront.',
      icon: Home,
      metric: 'Personalized Care',
    },
    {
      title: 'Staging & Visual Marketing',
      subtitle: 'Presentation for Maximum Impact',
      description: 'Strategic guidance on furniture placement, lighting balance, and visual de-cluttering so prospective buyers experience the property’s true architectural potential from the first viewing.',
      icon: Eye,
      metric: 'Visual Staging',
    },
  ];

  return (
    <section id="neighborhoods" className="relative py-28 px-6 lg:px-16 bg-[#040914] border-b border-[#00F0FF]/20">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B172E] border border-[#00F0FF]/40 rounded-xs mb-3 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="text-[10px] tracking-[0.25em] text-[#00F0FF] uppercase font-semibold">
              The Marina Art Advantage
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-luxury text-[#F0F6FC] tracking-tight">
            REAL ESTATE REPRESENTATION <br />
            <span className="cyan-gradient-text italic font-editorial">ENHANCED BY DESIGN</span>
          </h2>
          <p className="mt-4 text-[#CBD5E1] font-editorial text-lg leading-relaxed">
            Combining licensed real estate expertise with an interior designer’s trained eye to guide clients through buying, selling, and staging in Houston & Katy, Texas.
          </p>
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            return (
              <div
                key={index}
                className="group relative bg-[#0B172E]/90 border border-[#00F0FF]/25 hover:border-[#00F0FF] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] p-8 rounded-xs transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xs bg-[#060D1E] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] mb-6 group-hover:bg-[#00F0FF] group-hover:text-[#040914] transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] text-[#00F0FF] tracking-[0.2em] uppercase font-semibold block">
                    {exp.subtitle}
                  </span>
                  <h3 className="text-xl font-serif-luxury text-[#F0F6FC] mt-1 group-hover:text-[#00F0FF] transition-colors">
                    {exp.title}
                  </h3>

                  <p className="mt-4 text-xs text-[#CBD5E1] leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#00F0FF]/15 flex items-center justify-between text-[11px] font-mono text-[#00F0FF]">
                  <span>Focus Area</span>
                  <span className="text-[#F0F6FC] font-semibold">{exp.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
