import React from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';

export const ContactCTA: React.FC = () => {
  return (
    <div className="relative">
       <div className="max-w-4xl mx-auto relative z-10 text-center">
         <Reveal>
           <div className="inline-flex items-center gap-2 text-brand-400 mb-6">
              <Sparkles size={20} />
              <span className="font-bold tracking-widest uppercase text-sm">Let's Build The Future</span>
           </div>
           
           <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
             System Inquiry
           </h2>
           <p className="text-lg text-slate-400 mb-12 font-light max-w-2xl mx-auto">
             Partner with SKH.GLOBAL. Our team will architect a custom platform that scales with your growth.
           </p>
         </Reveal>
         
         <Reveal delay={200}>
           <div className="glass-panel p-8 md:p-10 rounded-3xl max-w-lg mx-auto border border-slate-700/50 shadow-2xl bg-slate-950/50">
              <form className="space-y-5 text-left">
                 <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                    <input type="email" placeholder="name@company.com" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:outline-none transition-all"/>
                 </div>
                 <button className="w-full bg-white text-slate-950 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-xl">
                   <Mail size={20} />
                   Start Project
                 </button>
                 <p className="text-center text-xs text-slate-500 mt-4">Typical response: 2-4 hours</p>
              </form>
           </div>
         </Reveal>
       </div>
    </div>
  );
};