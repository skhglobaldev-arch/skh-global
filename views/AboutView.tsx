import React from 'react';
import { About } from '../components/About';
import { Reveal } from '../components/Reveal';
import { PageHero } from '../components/PageHero';
import { TESTIMONIALS } from '../constants';
import { Star, Trophy, Users, Globe, Code2 } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="pb-24">
      
      <PageHero 
        badge="Company Profile"
        title={<>Architects of the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-white">New Web</span></>}
        subtitle="We build the digital infrastructure that powers modern businesses. No templates, no shortcuts—just pure engineering excellence."
      />

      <div className="-mt-20 relative z-20">
        <About />
      </div>

      {/* Stats Section */}
      <div className="py-24 bg-slate-900/50 relative overflow-hidden border-y border-slate-800">
         <div className="absolute inset-0 bg-grid opacity-5"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
               {[
                 { icon: Trophy, val: "98%", label: "Client Retention" },
                 { icon: Code2, val: "50+", label: "Systems Deployed" },
                 { icon: Users, val: "15k+", label: "Users Served" },
                 { icon: Globe, val: "24/7", label: "System Uptime" }
               ].map((stat, i) => (
                 <Reveal key={i} delay={i*100}>
                   <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6 text-brand-400">
                        <stat.icon size={32} />
                      </div>
                      <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-display">{stat.val}</div>
                      <div className="text-slate-500 uppercase tracking-widest text-xs font-semibold">{stat.label}</div>
                   </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </div>

      {/* Extended Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <Reveal>
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Client Success Stories</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We don't just have clients; we have long-term partners. Here is what they say about our architecture.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
             <Reveal key={i} delay={i*100}>
               <div className="glass-panel p-10 rounded-3xl h-full flex flex-col relative overflow-hidden group hover:bg-slate-800/60 transition-colors border border-slate-700/50 hover:border-brand-500/30">
                 <div className="flex gap-1 mb-8">
                   {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-yellow-500 fill-yellow-500"/>)}
                 </div>
                 <p className="text-slate-300 italic mb-8 flex-grow leading-relaxed text-lg">"{t.quote}"</p>
                 <div className="flex items-center gap-4 pt-6 border-t border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {t.author[0]}
                    </div>
                    <div>
                       <div className="text-white font-bold text-base">{t.author}</div>
                       <div className="text-brand-400 text-sm font-medium">{t.company}</div>
                    </div>
                 </div>
               </div>
             </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};