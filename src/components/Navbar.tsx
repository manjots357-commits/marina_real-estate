import React, { useState } from 'react';
import { Sparkles, MessageSquare, Menu, X, Shield, Phone, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenAiConcierge: () => void;
  onOpenImageStudio: () => void;
  onBookViewing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAiConcierge,
  onOpenImageStudio,
  onBookViewing,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Client Demo Concept Ribbon */}
      <div className="bg-[#060D1E] border-b border-[#00F0FF]/25 py-1 px-4 text-center text-[10px] tracking-widest text-[#CBD5E1] uppercase font-mono">
        <span className="text-[#00F0FF] font-semibold">Demo Presentation Concept:</span> Prepared for Marina Art &bull; Premier Haus Realty, LLC &bull; Houston & Katy, TX
      </div>

      <nav className="bg-[#040914]/90 backdrop-blur-md border-b border-[#00F0FF]/20 transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
          {/* Brand Logo: Marina Art */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xs bg-[#0B172E] border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] group-hover:bg-[#00F0FF] group-hover:text-[#040914] transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <span className="font-serif-luxury font-bold text-lg tracking-widest">M</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif-luxury font-bold tracking-[0.2em] text-[#F0F6FC] group-hover:text-[#00F0FF] transition-colors block">
                MARINA ART
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#00F0FF] uppercase block -mt-1 font-semibold">
                Real Estate Agent &bull; Houston & Katy, TX
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-serif-luxury tracking-[0.16em] uppercase text-[#F0F6FC]/85">
            <a href="#properties" className="hover:text-[#00F0FF] transition-colors">
              Properties (Demo)
            </a>
            <a href="#neighborhoods" className="hover:text-[#00F0FF] transition-colors">
              Houston & Katy
            </a>
            <a href="#about" className="hover:text-[#00F0FF] transition-colors">
              About Marina
            </a>
            <a href="#services" className="hover:text-[#00F0FF] transition-colors">
              Services
            </a>
            <a href="#contact" className="hover:text-[#00F0FF] transition-colors">
              Contact
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenImageStudio}
              title="Home Vision & Design Staging Visualizer (1K, 2K, 4K)"
              className="p-2.5 rounded-xs bg-[#0B172E] border border-[#00F0FF]/35 text-[#F0F6FC] hover:border-[#00F0FF] hover:text-[#00F0FF] transition-all cursor-pointer flex items-center gap-1.5 text-xs tracking-wider shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              <span className="hidden xl:inline">Design Studio</span>
            </button>

            <button
              onClick={onOpenAiConcierge}
              title="Chat with Marina Art's Digital Real Estate Concierge"
              className="p-2.5 rounded-xs bg-[#0B172E] border border-[#38BDF8]/40 text-[#70F3FF] hover:border-[#00F0FF] transition-all cursor-pointer flex items-center gap-1.5 text-xs tracking-wider shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
              <span className="hidden xl:inline">Digital Assistant</span>
            </button>

            <button
              onClick={onBookViewing}
              className="px-5 py-2.5 bg-[#00F0FF] hover:bg-[#38BDF8] text-[#040914] font-serif-luxury font-bold text-xs tracking-[0.2em] uppercase rounded-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] cursor-pointer"
            >
              Contact Marina
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#00F0FF] hover:bg-[#0B172E] rounded-xs transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#060D1E] border-b border-[#00F0FF]/30 px-6 py-6 space-y-4 shadow-2xl">
            <div className="flex flex-col space-y-3 text-sm font-serif-luxury tracking-widest uppercase text-[#F0F6FC]">
              <a
                href="#properties"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#00F0FF]/15 hover:text-[#00F0FF]"
              >
                Properties (Demo)
              </a>
              <a
                href="#neighborhoods"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#00F0FF]/15 hover:text-[#00F0FF]"
              >
                Houston & Katy Living
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#00F0FF]/15 hover:text-[#00F0FF]"
              >
                About Marina Art
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#00F0FF]/15 hover:text-[#00F0FF]"
              >
                Buyer & Seller Services
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#00F0FF]/15 hover:text-[#00F0FF]"
              >
                Contact
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenImageStudio();
                }}
                className="w-full py-2.5 bg-[#0B172E] border border-[#00F0FF]/40 text-[#00F0FF] text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                <span>Interior & Home Staging Visualizer</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAiConcierge();
                }}
                className="w-full py-2.5 bg-[#0B172E] border border-[#38BDF8]/50 text-[#70F3FF] text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
                <span>Chat with Digital Assistant</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookViewing();
                }}
                className="w-full py-3 bg-[#00F0FF] text-[#040914] font-bold text-xs uppercase tracking-widest rounded-xs cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                Contact Marina Art
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
