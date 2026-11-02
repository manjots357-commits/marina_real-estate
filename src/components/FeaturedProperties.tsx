import React, { useState } from 'react';
import { Property } from '../types';
import { PROPERTIES } from '../data/properties';
import { ArrowUpRight, Bed, Bath, Maximize2, MapPin, Sparkles, Navigation, Info } from 'lucide-react';

interface FeaturedPropertiesProps {
  onSelectProperty: (property: Property) => void;
  onExploreLocation: (property: Property) => void;
  onBookViewing: (property: Property) => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  onSelectProperty,
  onExploreLocation,
  onBookViewing,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filters = ['ALL', 'KATY, TX', 'MEMORIAL', 'RIVER OAKS', 'THE HEIGHTS'];

  const filteredProperties = PROPERTIES.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'KATY, TX') return p.location.includes('Katy');
    if (selectedFilter === 'MEMORIAL') return p.location.includes('Memorial');
    if (selectedFilter === 'RIVER OAKS') return p.location.includes('River Oaks');
    if (selectedFilter === 'THE HEIGHTS') return p.location.includes('Heights');
    return true;
  });

  return (
    <section id="properties" className="relative py-28 px-6 lg:px-16 bg-[#040914] border-b border-[#00F0FF]/20">
      {/* Subtle Cyan Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#00F0FF]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B172E] border border-[#00F0FF]/40 rounded-xs mb-3 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="text-[10px] tracking-[0.25em] text-[#00F0FF] uppercase font-semibold">
                Curated Property Showcase
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury text-[#F0F6FC] tracking-tight">
              FEATURED HOUSTON & <span className="cyan-gradient-text italic font-editorial">KATY HOMES</span>
            </h2>
            <p className="mt-3 text-[#CBD5E1] font-editorial text-lg max-w-xl">
              Representative sample listings highlighting premier architectural styles and master-planned living across Houston and Katy, Texas.
            </p>
          </div>

          {/* Region Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 rounded-xs border cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-[#00F0FF] text-[#040914] border-[#00F0FF] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-[#0B172E]/80 text-[#F0F6FC]/80 border-[#00F0FF]/25 hover:border-[#00F0FF] hover:text-[#00F0FF]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Listings Disclosure Banner */}
        <div className="mb-12 p-3.5 bg-[#0B172E] border border-[#00F0FF]/35 rounded-xs flex items-center gap-3 text-xs text-[#CBD5E1] shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <Info className="w-4 h-4 text-[#00F0FF] shrink-0" />
          <span>
            <strong className="text-[#00F0FF]">Concept Presentation Notice:</strong> The property listings below are sample demonstration concepts created to illustrate website design, visual staging potential, and layout presentation. They are not active MLS listings.
          </span>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="group relative bg-[#0B172E]/90 border border-[#00F0FF]/30 hover:border-[#00F0FF] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all duration-500 rounded-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Image Container with Zoom & Parallax feel */}
              <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={() => onSelectProperty(property)}>
                <img
                  src={property.heroImage}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-[0.88] group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B172E] via-transparent to-black/40" />

                {/* Price Tag Badge */}
                <div className="absolute top-4 right-4 bg-[#060D1E]/95 border border-[#00F0FF] px-3.5 py-1.5 rounded-xs shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <span className="text-xs font-mono font-bold text-[#00F0FF] tracking-wider">
                    {property.price}
                  </span>
                </div>

                {/* Demo Stamp Badge */}
                <div className="absolute top-4 left-4 bg-[#060D1E]/90 border border-[#00F0FF]/50 px-2.5 py-1 rounded-xs">
                  <span className="text-[10px] font-mono tracking-widest text-[#00F0FF] uppercase font-semibold">
                    Sample Demo
                  </span>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-[#060D1E]/90 border border-[#00F0FF]/40 rounded-xs text-[#F0F6FC] text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>{property.location}, {property.country}</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] text-[#00F0FF] tracking-[0.2em] uppercase font-semibold">
                    {property.architecturalStyle}
                  </p>
                  <h3 className="text-2xl font-serif-luxury text-[#F0F6FC] mt-1 group-hover:text-[#00F0FF] transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-sm font-editorial italic text-[#38BDF8] mt-1">
                    {property.subTitle}
                  </p>

                  <p className="mt-4 text-xs text-[#CBD5E1] leading-relaxed line-clamp-2">
                    {property.description}
                  </p>
                </div>

                {/* Specifications Bar */}
                <div className="mt-6 pt-5 border-t border-[#00F0FF]/20 flex items-center justify-between text-xs text-[#CBD5E1]">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-[#00F0FF]" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-[#00F0FF]" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-[#00F0FF]" />
                    <span>{property.sqFt.toLocaleString()} Sq Ft</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-[#00F0FF]/15 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onSelectProperty(property)}
                    className="flex-1 py-2.5 px-4 bg-[#060D1E] hover:bg-[#00F0FF] text-[#F0F6FC] hover:text-[#040914] border border-[#00F0FF]/40 hover:border-[#00F0FF] text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  >
                    <span>View Demo Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onExploreLocation(property)}
                    title="Explore Neighborhood with Google Maps Grounding"
                    className="py-2.5 px-3 bg-[#060D1E] hover:bg-[#102242] text-[#70F3FF] border border-[#38BDF8]/40 hover:border-[#00F0FF] text-xs tracking-wider uppercase transition-all rounded-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="hidden sm:inline">Surroundings</span>
                  </button>

                  <button
                    onClick={() => onBookViewing(property)}
                    className="py-2.5 px-4 bg-[#00F0FF] hover:bg-[#38BDF8] text-[#040914] font-bold text-xs tracking-widest uppercase transition-all duration-300 rounded-xs cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                  >
                    Inquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
