
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { PAIN_POINTS } from '../constants';
import { Reveal } from './Reveal';

export const ProblemSolution: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PAIN_POINTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PAIN_POINTS.length) % PAIN_POINTS.length);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const currentItem = PAIN_POINTS[currentIndex];

  return (
    <div className="py-24 md:py-32 bg-slate-950/60 backdrop-blur-sm relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-brand-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-brand-500/30 bg-slate-900/80 mb-6 backdrop-blur-sm">
              <span className="text-brand-400 text-xs font-bold uppercase tracking-widest">Why Choose SKH?</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              We Solve Real Business Problems
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light">
              We don't just write code. We identify your bottlenecks and architect automated solutions.
            </p>
          </div>
        </Reveal>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Card */}
          <Reveal delay={200}>
            <div className="glass-panel border-brand-500/40 rounded-3xl overflow-hidden relative min-h-[500px] md:min-h-[400px] flex flex-col md:flex-row transition-all duration-500 hover:shadow-[0_0_80px_rgba(14,165,233,0.25)] bg-slate-900/90">
              
              {/* Left Side: Problem (Pain) */}
              <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-900/80 flex flex-col justify-center border-r border-brand-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <currentItem.icon className="text-red-400" size={24} />
                  </div>
                  <span className="text-red-400 font-bold tracking-widest uppercase text-xs">The Problem</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 leading-tight">
                  {currentItem.question}
                </h3>
                <p className="text-slate-200 text-lg leading-relaxed font-light">
                  {currentItem.pain}
                </p>
              </div>

              {/* Right Side: Solution (Gain) */}
              <div className="w-full md:w-1/2 p-8 md:p-12 bg-brand-900/30 relative overflow-hidden flex flex-col justify-center">
                 <div className="absolute inset-0 bg-brand-500/10 backdrop-blur-sm"></div>
                 
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-brand-500/30 flex items-center justify-center border border-brand-400/50 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                        <CheckCircle2 className="text-white" size={24} />
                      </div>
                      <span className="text-white font-bold tracking-widest uppercase text-xs">The SKH Solution</span>
                    </div>

                    <p className="text-xl md:text-2xl text-white font-bold leading-relaxed mb-8 drop-shadow-lg">
                      {currentItem.solution}
                    </p>

                    <button className="text-brand-100 font-bold flex items-center gap-2 group hover:text-white transition-colors py-2 px-4 rounded-lg bg-brand-500/20 border border-brand-500/30">
                      Start this transformation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                 </div>
              </div>

            </div>
          </Reveal>

          {/* Controls */}
          <div className="flex justify-between items-center mt-8 px-4">
             <div className="flex gap-2">
               {PAIN_POINTS.map((_, idx) => (
                 <button
                   key={idx}
                   onClick={() => {
                     setCurrentIndex(idx);
                     setIsAutoPlaying(false);
                   }}
                   className={`h-2 rounded-full transition-all duration-300 ${
                     currentIndex === idx ? 'bg-brand-400 w-12' : 'bg-slate-600 w-4 hover:bg-slate-500'
                   }`}
                   aria-label={`Go to slide ${idx + 1}`}
                 />
               ))}
             </div>

             <div className="flex gap-4">
               <button 
                 onClick={() => { handlePrev(); setIsAutoPlaying(false); }}
                 className="w-12 h-12 rounded-full border border-brand-500/30 bg-slate-900/50 flex items-center justify-center text-brand-300 hover:text-white hover:bg-brand-600 transition-all shadow-lg"
               >
                 <ChevronLeft size={24} />
               </button>
               <button 
                 onClick={() => { handleNext(); setIsAutoPlaying(false); }}
                 className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white hover:bg-brand-500 transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)]"
               >
                 <ChevronRight size={24} />
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
