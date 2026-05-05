
import React, { useLayoutEffect, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { DigitalRainBackground } from './components/DigitalRainBackground';
import { useTranslation } from 'react-i18next';

// Page Views
import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { ProcessView } from './views/ProcessView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { PrivacyView } from './views/PrivacyView';
import { TermsView } from './views/TermsView';
import { OffersView } from './views/OffersView';
import { AuditView } from './views/AuditView';

export default function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [displayLocation, setDisplayLocation] = React.useState(location);

  // Update dynamic document title based on language
  useEffect(() => {
    document.title = t('site_title', 'SKH.GLOBAL | Premium AI Systems & Web Architecture');
  }, [i18n.language, t]);

  // Handle page transitions
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  // Immediate scroll reset whenever location changes
  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    resetScroll();
    const timer = setTimeout(resetScroll, 10);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handlePageChange = (page: string) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
  };

  const getActivePageId = () => {
    const path = displayLocation.pathname.substring(1);
    return path === '' ? 'home' : path;
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-brand-500 selection:text-white bg-[#020617]">
      
      {/* 1. Permanent Background Layer */}
      <DigitalRainBackground />
      
      {/* 2. Content Layer - Visible immediately */}
      <div className="relative z-10 opacity-100 transition-opacity duration-1000">
        <NavBar activePage={getActivePageId()} setActivePage={handlePageChange} />
        
        <main className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <Routes location={displayLocation}>
            <Route path="/" element={<HomeView navigateTo={handlePageChange} />} />
            <Route path="/services" element={<ServicesView />} />
            <Route path="/process" element={<ProcessView />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/offers" element={<OffersView />} />
            <Route path="/contact" element={<ContactView />} />
            <Route path="/audit" element={<AuditView />} />
            <Route path="/privacy" element={<PrivacyView />} />
            <Route path="/terms" element={<TermsView />} />
            {/* Fallback to home */}
            <Route path="*" element={<HomeView navigateTo={handlePageChange} />} />
          </Routes>
        </main>

        <Footer navigateTo={handlePageChange} />
      </div>
    </div>
  );
}
