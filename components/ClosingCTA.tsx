import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { Reveal } from './Reveal';

interface ClosingCTAProps {
  navigateTo: (page: string) => void;
}

export const ClosingCTA: React.FC<ClosingCTAProps> = ({ navigateTo }) => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-black border-t border-slate-900 shrink-0">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <Reveal>
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-display font-black text-white leading-tight">
                Ready to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-brand-500">Automate?</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-md font-light leading-relaxed">
                Join the ranks of high-performance businesses running on SKH.GLOBAL architecture.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-8 py-5 bg-white text-slate-950 rounded-2xl font-bold hover:bg-brand-50 transition-all flex items-center justify-center gap-3 group shadow-2xl"
                >
                  Start Your Journey
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-950 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">JD</div>
                    ))}
                  </div>
                  <span className="text-sm text-slate-400 font-medium">+50 Systems Deployed</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative group">
              <div className="absolute -inset-4 bg-brand-500/10 rounded-[2.5rem] blur-3xl group-hover:bg-brand-500/20 transition-all"></div>
              <div className="relative glass-panel p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-3xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3.5 rounded-xl bg-brand-500/10 text-brand-400">
                    <MessageSquare size={26} />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">Live Consultation</h3>
                </div>
                <p className="text-slate-400 mb-10 leading-relaxed text-lg font-light">
                  Schedule a 15-minute discovery call with our Lead Architect to vet your technical requirements.
                </p>
                <button onClick={() => navigateTo('contact')} className="w-full py-4 rounded-xl border border-slate-700 text-white font-bold hover:bg-slate-800 hover:border-slate-500 transition-all text-lg shadow-inner">
                  Check Availability
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="py-16 border-t border-slate-900/50">
          <div className="flex flex-wrap justify-center gap-10 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {['Stripe', 'Google Cloud', 'Twilio', 'Firebase', 'OpenAI'].map(brand => (
              <span key={brand} className="text-xl md:text-2xl font-bold text-white hover:text-brand-400 transition-colors cursor-default tracking-tight">{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};