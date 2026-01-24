
import React from 'react';
import { ArrowRight, ChevronRight, Terminal } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-transparent">
      
      {/* 3D Perspective Floor Grid */}
      <div className="absolute bottom-0 w-full h-[50vh] origin-bottom z-0 pointer-events-none">
        <div className="absolute inset-0 [transform:perspective(1200px)_rotateX(80deg)] scale-150">
           <div className="absolute inset-0 bg-grid opacity-30 animate-grid-flow"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
        
        {/* Animated HUD Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-950/80 border border-brand-500/30 mb-10 backdrop-blur-3xl shadow-[0_0_50px_rgba(14,165,233,0.25)] group cursor-default hover:border-brand-500/60 transition-all">
          <Terminal size={14} className="text-brand-400 animate-pulse" />
          <span className="text-[10px] md:text-xs font-mono font-bold text-brand-100 uppercase tracking-[0.5em]">ROOT_ACCESS_GRANTED</span>
        </div>

        {/* 3D Title */}
        <div className="perspective-1000 flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-white mb-10 leading-[0.82] text-center z-10 relative">
              <div className="text-3d-hero inline-block mb-2">Turn Ideas</div> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-cyan-400 to-white glow-text relative inline-block transform hover:scale-[1.01] transition-transform duration-700">
                Into Real Systems
              </span>
            </h1>
        </div>

        <p className="mt-10 max-w-2xl mx-auto text-lg md:text-2xl text-slate-200 leading-relaxed text-center font-light drop-shadow-2xl">
          We engineer <span className="text-white font-bold border-b-2 border-brand-500/50 px-1">automated ecosystems</span> for visionary businesses. No fluff. Just hard-coded scalability.
        </p>

        <div className="mt-16 flex flex-col sm:flex-row gap-8 w-full sm:w-auto relative z-20">
          <a 
            href="#ai-planner"
            className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white transition-all duration-500 bg-brand-600 rounded-2xl hover:bg-brand-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(14,165,233,0.4)] hover:shadow-[0_25px_70px_rgba(14,165,233,0.7)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-brand-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-3">
              Start Project
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </a>
          
          <a 
            href="#demos"
            className="inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-slate-100 transition-all duration-500 bg-slate-900/40 border border-slate-700/50 rounded-2xl hover:text-white hover:bg-slate-800/60 hover:border-brand-400/60 backdrop-blur-xl group shadow-2xl"
          >
            Live Showcase <ChevronRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
