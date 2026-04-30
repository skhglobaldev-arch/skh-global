import React from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';

export const ContactCTA: React.FC = () => {
  return (
    <div className="relative text-left">
       <div className="max-w-4xl mx-auto relative z-10">
         <Reveal>
           <div className="text-center">
             <div className="inline-flex items-center gap-2 text-brand-400 mb-6 font-mono">
                <Sparkles size={16} />
                <span className="font-bold tracking-widest uppercase text-[10px]">Secure Your Slot</span>
             </div>
             
             <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6 uppercase tracking-tighter">
               Audit Inquiry
             </h2>
             <p className="text-base text-slate-400 mb-12 font-light max-w-xl mx-auto leading-relaxed">
               Our systems are custom-engineered for each client. Please provide brief details for your architectural review.
             </p>
           </div>
         </Reveal>
         
         <Reveal delay={200}>
            <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] max-w-xl mx-auto border border-slate-800 shadow-2xl bg-slate-950/80">
               <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono">Full Name</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-700 focus:border-brand-500 focus:outline-none transition-all"/>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono">Company</label>
                        <input type="text" placeholder="Acme Inc." className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-700 focus:border-brand-500 focus:outline-none transition-all"/>
                    </div>
                  </div>

                  <div>
                     <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono">Work Email</label>
                     <input type="email" placeholder="name@company.com" className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-700 focus:border-brand-500 focus:outline-none transition-all"/>
                  </div>

                  <div>
                     <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono">Estimated Investment</label>
                     <div className="relative">
                        <select className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-brand-500 focus:outline-none transition-all appearance-none cursor-pointer">
                           <option value="1500-3500">£1,499 - £3,499 (Launchpad)</option>
                           <option value="3500-7500">£3,499 - £7,499 (Growth Engine)</option>
                           <option value="7500+">£7,500+ (Custom Core)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                           <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono text-left">System Focus</label>
                     <textarea rows={3} placeholder="Tell us about the bottleneck you want to solve..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-700 focus:border-brand-500 focus:outline-none transition-all resize-none"></textarea>
                  </div>

                  <button className="w-full bg-brand-500 text-slate-950 font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-brand-400 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                    <Mail size={18} />
                    Submit for Review
                  </button>
                  <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">Typical Architect Response: 12-24 Hours</p>
               </form>
            </div>
         </Reveal>
       </div>
    </div>
  );
};
