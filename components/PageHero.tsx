
import React from 'react';
import { Box, Network, Sparkles } from 'lucide-react';

interface PageHeroProps {
  title: React.ReactNode;
  subtitle: string;
  badge?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, badge }) => {
  return (
    <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-transparent py-28 md:min-h-[610px]">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_78%_38%,rgba(56,216,255,0.11),transparent_28%),linear-gradient(180deg,rgba(5,7,19,0.12)_0%,#050713_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[34vh] bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-45 [mask-image:linear-gradient(to_top,black,transparent)]" />
      
      {/* Floating Decorative Elements (Subtle) */}
      <div className="absolute top-1/4 left-[5%] opacity-[0.08] animate-float delay-100 hidden lg:block pointer-events-none">
         <Box size={100} strokeWidth={0.5} className="text-brand-400 rotate-12" />
      </div>
      <div className="absolute bottom-1/4 right-[5%] opacity-[0.08] animate-float delay-700 hidden lg:block pointer-events-none">
         <Sparkles size={140} strokeWidth={0.5} className="text-violet-400 -rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center pt-20">
        
        {/* Animated HUD Badge */}
        {badge && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 inline-flex items-center gap-3 rounded-full border border-violet-400/20 bg-[#101827]/70 px-5 py-2.5 shadow-[0_18px_70px_rgba(37,99,235,0.14)] backdrop-blur-2xl">
            <Network size={14} className="text-cyan-200" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-100 md:text-xs">{badge}</span>
          </div>
        )}
        
        {/* 3D Title Typography */}
        <h1 className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 mb-7 text-4xl font-black leading-[1.06] tracking-tight text-white md:text-6xl lg:text-7xl">
          {title}
        </h1>
        
        <p className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 max-w-3xl text-base font-light leading-relaxed text-slate-300 drop-shadow-2xl md:text-xl">
          {subtitle}
        </p>

        {/* HUD Indicator Base */}
        <div className="animate-in fade-in duration-1000 delay-700 mt-12 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-[#38D8FF]/50 to-transparent shadow-[0_0_20px_rgba(56,216,255,0.25)]"></div>
      </div>
    </div>
  );
};
