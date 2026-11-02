import React, { useState } from 'react';
import { Property } from './types';
import { PROPERTIES } from './data/properties';
import { AtmosphereEffects } from './components/AtmosphereEffects';
import { Navbar } from './components/Navbar';
import { HeroCinematic } from './components/HeroCinematic';
import { FeaturedProperties } from './components/FeaturedProperties';
import { PropertyDetailGalleryModal } from './components/PropertyDetailGalleryModal';
import { LuxuryLifestyle } from './components/LuxuryLifestyle';
import { MapsGroundingExplorer } from './components/MapsGroundingExplorer';
import { AgentAdvisors } from './components/AgentAdvisors';
import { ServicesSection } from './components/ServicesSection';
import { ContactEnquirySection } from './components/ContactEnquirySection';
import { Footer } from './components/Footer';
import { AiConciergeModal } from './components/AiConciergeModal';
import { AiImageStudioModal } from './components/AiImageStudioModal';

export default function App() {
  // Modal states
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(null);
  const [selectedPropertyForConcierge, setSelectedPropertyForConcierge] = useState<Property | null>(null);
  const [isAiConciergeOpen, setIsAiConciergeOpen] = useState(false);
  const [isImageStudioOpen, setIsImageStudioOpen] = useState(false);
  const [preselectedResidenceTitle, setPreselectedResidenceTitle] = useState(PROPERTIES[0].title);

  // Atmospheric effect toggles
  const [showRain, setShowRain] = useState(true);
  const [showEmbers, setShowEmbers] = useState(true);

  // Scroll to contact section
  const handleBookViewing = (property?: Property) => {
    if (property) {
      setPreselectedResidenceTitle(property.title);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreResidences = () => {
    const el = document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAiConciergeWithProperty = (property?: Property) => {
    setSelectedPropertyForConcierge(property || null);
    setIsAiConciergeOpen(true);
  };

  const handleExploreLocation = (property: Property) => {
    const el = document.getElementById('location-grounding');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactAdvisor = (advisorName: string) => {
    setPreselectedResidenceTitle(`Advisory Mandate with ${advisorName}`);
    handleBookViewing();
  };

  return (
    <div className="min-h-screen bg-[#040914] text-[#F0F6FC] relative selection:bg-[#00F0FF]/30 selection:text-[#00F0FF]">
      {/* Cinematic Animated Rain & Fire Embers */}
      <AtmosphereEffects showRain={showRain} showEmbers={showEmbers} />

      {/* Global Luxury Navigation */}
      <Navbar
        onOpenAiConcierge={() => handleOpenAiConciergeWithProperty()}
        onOpenImageStudio={() => setIsImageStudioOpen(true)}
        onBookViewing={() => handleBookViewing()}
      />

      {/* Main Sections */}
      <main className="relative z-20">
        {/* 1. Full-Screen Cinematic Hero */}
        <HeroCinematic
          onBookViewing={() => handleBookViewing(PROPERTIES[0])}
          onExploreResidences={handleExploreResidences}
          onOpenAiConcierge={() => handleOpenAiConciergeWithProperty(PROPERTIES[0])}
          showRain={showRain}
          setShowRain={setShowRain}
          showEmbers={showEmbers}
          setShowEmbers={setShowEmbers}
        />

        {/* 2. Featured Luxury Properties */}
        <FeaturedProperties
          onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
          onExploreLocation={handleExploreLocation}
          onBookViewing={(prop) => handleBookViewing(prop)}
        />

        {/* 3. Luxury Lifestyle Section */}
        <LuxuryLifestyle />

        {/* 4. Google Maps Grounding Explorer */}
        <MapsGroundingExplorer initialProperty={PROPERTIES[0]} />

        {/* 5. Agent Introduction & Senior Partners */}
        <AgentAdvisors onContactAdvisor={handleContactAdvisor} />

        {/* 6. Services For Buyers and Sellers */}
        <ServicesSection onConsultServices={() => handleBookViewing()} />

        {/* 7. Contact & WhatsApp Enquiry Form with Voice Transcription */}
        <ContactEnquirySection preselectedPropertyTitle={preselectedResidenceTitle} />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals */}
      <PropertyDetailGalleryModal
        property={selectedPropertyForDetail}
        onClose={() => setSelectedPropertyForDetail(null)}
        onBookViewing={(prop) => handleBookViewing(prop)}
        onOpenAiConcierge={(prop) => handleOpenAiConciergeWithProperty(prop)}
      />

      <AiConciergeModal
        isOpen={isAiConciergeOpen}
        onClose={() => setIsAiConciergeOpen(false)}
        contextProperty={selectedPropertyForConcierge}
      />

      <AiImageStudioModal
        isOpen={isImageStudioOpen}
        onClose={() => setIsImageStudioOpen(false)}
      />
    </div>
  );
}
