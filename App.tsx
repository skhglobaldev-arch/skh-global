
import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { AIFaq } from './components/AIFaq';
import { DigitalRainBackground } from './components/DigitalRainBackground';

// Page Views
import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { ProcessView } from './views/ProcessView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePageChange = (page: string) => {
    if (page === activePage) return;
    setIsTransitioning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setActivePage(page);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-brand-500 selection:text-white bg-[#020617]">
      
      {/* 1. Permanent Background Layer */}
      <DigitalRainBackground />
      
      {/* 2. Content Layer - Visible immediately */}
      <div className="relative z-10 opacity-100 transition-opacity duration-1000">
        <NavBar activePage={activePage} setActivePage={handlePageChange} />
        
        <main className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {activePage === 'services' && <ServicesView />}
          {activePage === 'process' && <ProcessView />}
          {activePage === 'about' && <AboutView />}
          {activePage === 'contact' && <ContactView />}
          {activePage === 'home' && (
            <HomeView 
              navigateTo={handlePageChange} 
            />
          )}
        </main>

        <Footer navigateTo={handlePageChange} />
        <AIFaq />
      </div>
    </div>
  );
}
