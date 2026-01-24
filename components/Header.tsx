import React, { useState, useEffect } from 'react';
import { Menu, X, Hexagon } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-slate-950/80 backdrop-blur-xl border-slate-800 py-3' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" 
            onClick={() => setActivePage('home')}
          >
            <div className="relative">
               <div className="absolute inset-0 bg-brand-500 blur-lg opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
               <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-lg group-hover:border-brand-500/50 transition-colors">
                 <Hexagon size={24} className="text-brand-400 fill-brand-400/10 group-hover:fill-brand-400/30 transition-all" />
               </div>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-brand-100 transition-colors">
              SKH
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/50 p-1.5 rounded-full border border-slate-800 backdrop-blur-md">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => setActivePage(item.href)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  activePage === item.href 
                    ? 'text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {activePage === item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-indigo-600 opacity-100 rounded-full -z-10"></div>
                )}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:block">
            <button 
              onClick={() => setActivePage('contact')}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-brand-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              Start Project
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-panel border-t border-slate-800 shadow-2xl animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 py-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActivePage(item.href);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors border ${
                  activePage === item.href 
                  ? 'bg-brand-500/10 text-brand-400 border-brand-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};