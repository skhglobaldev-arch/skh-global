
import React, { useState, useEffect } from 'react';
import { Mail, Menu, X } from 'lucide-react';

interface NavBarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ activePage, setActivePage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'process', label: 'Methodology' },
    { id: 'offers', label: 'Offers' },
    { id: 'about', label: 'About' },
  ];

  return (
    <>
      <header className={`fixed top-6 left-0 right-0 z-50 transition-all duration-300 pointer-events-none`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo Module with New Image */}
            <div 
              className={`pointer-events-auto flex items-center transition-all duration-500 cursor-pointer`}
              onClick={() => setActivePage('home')}
            >
              <div className="relative group">
                 <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <img 
                    src="https://files.catbox.moe/n3xbja.png" 
                    alt="SKH Logo" 
                    className="relative w-20 h-20 md:w-28 md:h-28 object-cover brightness-110 contrast-110 filter drop-shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-transform group-hover:scale-105" 
                 />
              </div>
            </div>

            {/* Central Holographic HUD Pill (Desktop) */}
            <nav className={`hidden md:flex pointer-events-auto items-center gap-1 p-1.5 rounded-full border border-white/5 backdrop-blur-xl transition-all duration-500 ${scrolled ? 'bg-slate-900/90 shadow-[0_0_30px_rgba(0,0,0,0.5)] border-white/10' : 'bg-slate-900/50'}`}>
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`hud-nav-item relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-white bg-white/10 shadow-inner' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-400 active-pip animate-pulse"></span>}
                       {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Module */}
            <div className="pointer-events-auto flex items-center gap-4">
               <button 
                  onClick={() => setActivePage('audit')}
                  className="hidden md:flex group relative items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] overflow-hidden"
               >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <Mail size={16} />
                  <span>Audit Protocol</span>
               </button>

               {/* Mobile Toggle */}
               <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden w-11 h-11 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
               >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
               </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-3xl transition-all duration-500 flex flex-col items-center justify-center space-y-8 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
         {/* Background Grid */}
         <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
         
         <img src="https://files.catbox.moe/n3xbja.png" alt="Logo" className="w-28 h-28 mb-4 brightness-110 contrast-110 shadow-2xl" />

         {navItems.map((item, idx) => (
            <button
               key={item.id}
               onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }}
               className={`text-3xl font-display font-bold transition-all duration-300 ${activePage === item.id ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-white scale-110' : 'text-slate-500 hover:text-white'}`}
               style={{ transitionDelay: `${idx * 50}ms` }}
            >
               {item.label}
            </button>
         ))}

         <div className="w-16 h-1 bg-slate-800 rounded-full"></div>

         <button 
            onClick={() => { setActivePage('audit'); setMobileMenuOpen(false); }}
            className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
         >
            Free Revenue Audit
         </button>
      </div>
    </>
  );
};
