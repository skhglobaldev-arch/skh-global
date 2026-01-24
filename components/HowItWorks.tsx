import React from 'react';
import { STEPS } from '../constants';
import { Reveal } from './Reveal';

export const HowItWorks: React.FC = () => {
  return (
    <div className="py-32 bg-transparent border-t border-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-20">
             <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 mb-6">
               <span className="text-brand-400 text-xs font-bold uppercase tracking-widest">Our Methodology</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white">How We Build Your System</h3>
          </div>
        </Reveal>

        <div className="relative mt-12">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-800 to-transparent z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8">
            {STEPS.map((step, index) => (
              <Reveal key={index} delay={index * 150} className="relative z-10 flex flex-col items-center text-center group">
                <div>
                  <div className="w-24 h-24 rounded-full bg-slate-900/80 border-4 border-slate-800 flex items-center justify-center mb-8 shadow-2xl group-hover:border-brand-500 transition-colors duration-500 relative backdrop-blur-md">
                    <div className="w-20 h-20 rounded-full bg-slate-900/40 flex items-center justify-center">
                      <step.icon className="text-slate-400 group-hover:text-brand-400 transition-colors" size={32} />
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-3 font-display">{step.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] mx-auto font-light">{step.description}</p>
                  
                  {/* Step Number Badge */}
                  <div className="absolute top-0 right-1/2 translate-x-10 -translate-y-2 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-500 transition-colors">
                    {index + 1}
                  </div>

                  {/* Mobile Connector */}
                  {index < STEPS.length - 1 && (
                    <div className="lg:hidden w-0.5 h-12 bg-slate-800 my-6 mx-auto"></div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};