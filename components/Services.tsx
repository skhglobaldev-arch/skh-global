import React from 'react';
import { SERVICES } from '../constants';
import { Carousel3D } from './Carousel3D';
import { Reveal } from './Reveal';
import { Sparkles } from 'lucide-react';

export const Services: React.FC = () => {
  return (
    <div className="py-24 relative overflow-hidden bg-transparent">
      {/* Local Section Gradient Effect (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/10 via-transparent to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-brand-500/20 bg-slate-900/50 mb-6 backdrop-blur-xl">
               <Sparkles size={14} className="text-brand-400 mr-2 animate-pulse" />
               <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">Our Ecosystem</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-display font-black text-white mb-6 tracking-tight">
              Modular <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-300 to-white">Architecture</span>
            </h3>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              We don't just build websites. We engineer high-performance systems. 
              Drag the carousel below to explore our core technical capabilities.
            </p>
          </div>
        </Reveal>

        {/* 3D Carousel Implementation */}
        <div className="relative mt-8">
           <Carousel3D items={SERVICES} />
        </div>
        
        <Reveal delay={400}>
          <div className="mt-12 text-center">
            <div className="inline-block p-px rounded-2xl bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full max-w-md">
              <div className="bg-slate-900/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                <p className="text-slate-500 text-sm font-medium">
                  Interacting with our systems feels as smooth as this carousel.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};