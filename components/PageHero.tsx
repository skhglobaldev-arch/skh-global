
import React from 'react';
import { Terminal, Box, Sparkles } from 'lucide-react';

interface PageHeroProps {
  title: React.ReactNode;
  subtitle: string;
  badge?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, badge }) => {
  return (
    <div className="relative h-[70vh] min-h-[650px] flex items-center justify-center overflow-hidden bg-transparent">
      
      {/* 3D Perspective Floor Grid (Home Style) */}
      <div className="absolute bottom-0 w-full h-[40vh] origin-bottom z-0 pointer-events-none">
        <div className="absolute inset-0 [transform:perspective(1200px)_rotateX(80deg)] scale-150">
           <div className="absolute inset-0 bg-grid opacity-20 animate-grid-flow"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
      </div>
      
      {/* Floating Decorative Elements (Subtle) */}
      <div className="absolute top-1/4 left-[5%] opacity-10 animate-float delay-100 hidden lg:block pointer-events-none">
         <Box size={100} strokeWidth={0.5} className="text-brand-400 rotate-12" />
      </div>
      <div className="absolute bottom-1/4 right-[5%] opacity-10 animate-float delay-700 hidden lg:block pointer-events-none">
         <Sparkles size={140} strokeWidth={0.5} className="text-indigo-400 -rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center pt-20">
        
        {/* Animated HUD Badge */}
        {badge && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-950/80 border border-brand-500/30 mb-10 backdrop-blur-3xl shadow-[0_0_40px_rgba(14,165,233,0.2)] group cursor-default hover:border-brand-500/60 transition-all">
            <Terminal size={14} className="text-brand-400 animate-pulse" />
            <span className="text-[10px] md:text-xs font-mono font-bold text-brand-100 uppercase tracking-[0.5em]">{badge}</span>
          </div>
        )}
        
        {/* 3D Title Typography */}
        <h1 className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-8 leading-[1.05] tracking-tighter text-3d-hero">
          {title}
        </h1>
        
        <p className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 text-lg md:text-2xl text-slate-300 max-w-3xl font-light leading-relaxed drop-shadow-2xl">
          {subtitle}
        </p>

        {/* HUD Indicator Base */}
        <div className="animate-in fade-in duration-1000 delay-700 mt-12 w-24 h-1 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent rounded-full shadow-[0_0_20px_rgba(14,165,233,0.4)]"></div>
      </div>
    </div>
  );
};
