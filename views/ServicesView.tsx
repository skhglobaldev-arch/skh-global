
import React from 'react';
import { Services } from '../components/Services';
import { Reveal } from '../components/Reveal';
import { PageHero } from '../components/PageHero';
import { Code, Database, Lock, Zap, Server, Globe, Laptop } from 'lucide-react';

export const ServicesView: React.FC = () => {
  return (
    <div className="pb-24 bg-transparent">
      
      <PageHero 
        badge="MODULE_VERIFICATION_COMPLETE"
        title={<>Engineering <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-cyan-300 to-white glow-text">Digital Dominance</span></>}
        subtitle="We don't provide templates. We engineer bespoke technical ecosystems designed to dominate your market through automation and speed."
      />

      {/* The Immersive 3D Section */}
      <div className="-mt-32 relative z-20">
         <Services />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-20">
        
        {/* Technical Stack Section */}
        <Reveal>
          <div className="glass-panel p-12 rounded-[3rem] border-brand-500/20 relative overflow-hidden mb-32 shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-900/10 via-black to-indigo-900/10"></div>
             <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                <div>
                   <h3 className="text-4xl font-display font-black text-white mb-6">Our Deep Tech Stack</h3>
                   <p className="text-slate-400 mb-10 text-lg leading-relaxed font-light">
                     We leverage low-latency cloud infrastructure and modern ES6+ standards to build systems that aren't just fast—they're indestructible.
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: Code, label: "React & TypeScript", sub: "Modular frontends" },
                        { icon: Database, label: "Real-time DB", sub: "Firebase & SQL" },
                        { icon: Lock, label: "Advanced Auth", sub: "RBAC Systems" },
                        { icon: Zap, label: "AI Workflows", sub: "Gemini & Automations" }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/50 transition-all group">
                           <div className="flex items-center gap-3">
                              <item.icon size={20} className="text-brand-400" />
                              <span className="text-white font-bold">{item.label}</span>
                           </div>
                           <span className="text-xs text-slate-500 font-mono">{item.sub}</span>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="relative aspect-square md:aspect-auto h-full bg-slate-950/80 rounded-[2rem] border border-slate-800 p-8 flex items-center justify-center overflow-hidden shadow-inner group">
                   <div className="absolute inset-0 bg-grid opacity-10 animate-grid-flow"></div>
                   {/* Interactive Code Mockup */}
                   <div className="relative z-10 font-mono text-sm leading-relaxed group-hover:scale-105 transition-transform duration-700">
                     <div className="text-slate-500 mb-2">// Initializing core architecture...</div>
                     <span className="text-purple-400">import</span> {'{'} <span className="text-cyan-300">SKH</span> {'}'} <span className="text-purple-400">from</span> <span className="text-green-300">'@skh/global'</span>;
                     <br/><br/>
                     <span className="text-purple-400">const</span> <span className="text-yellow-200">System</span> = <span className="text-purple-400">new</span> <span className="text-blue-300">SKH</span>.System({'{'}
                     <br/>&nbsp;&nbsp;security: <span className="text-green-300">'Bank-Grade'</span>,
                     <br/>&nbsp;&nbsp;performance: <span className="text-cyan-300">100</span>,
                     <br/>&nbsp;&nbsp;automation: <span className="text-purple-400">true</span>
                     <br/>{'}'});
                     <br/><br/>
                     <span className="text-purple-400">await</span> <span className="text-yellow-200">System</span>.<span className="text-blue-300">scale</span>(<span className="text-orange-300">Infinity</span>);
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30"></div>
                </div>
             </div>
          </div>
        </Reveal>

        {/* Deliverables Grid */}
        <div className="mb-32">
           <Reveal>
             <div className="text-center mb-20">
               <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6">The Deliverables</h2>
               <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                 Your investment results in a fully-owned, documentation-heavy, and production-ready business asset.
               </p>
             </div>
           </Reveal>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Laptop, title: "Pure Source", desc: "100% ownership of modular TypeScript code." },
                { icon: Server, title: "Cloud Ops", desc: "Automated CI/CD pipelines and hosting." },
                { icon: Globe, title: "Edge DNS", desc: "Global distribution via Vercel Edge." },
                { icon: Zap, title: "Auto-Pilot", desc: "Self-healing cron jobs and alerts." }
              ].map((item, i) => (
                <Reveal key={i} delay={i*100}>
                  <div className="group text-center p-10 rounded-[2.5rem] bg-slate-900/20 border border-slate-800 hover:border-brand-500/30 hover:bg-slate-900/40 transition-all duration-500 shadow-xl">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-500/10 group-hover:border-brand-500/50 transition-all">
                      <item.icon className="text-brand-400" size={28}/>
                    </div>
                    <h4 className="text-white font-bold mb-3 text-lg font-display">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
           </div>
        </div>

        {/* Closing Trust Section */}
        <div className="relative p-12 md:p-24 rounded-[4rem] bg-gradient-to-tr from-slate-950 via-slate-900 to-black border border-brand-500/10 overflow-hidden shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-5"></div>
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px]"></div>
           
           <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
              <Reveal>
                 <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-8 tracking-tight">
                    Start Your <span className="text-brand-400">Architecture</span> Review
                 </h2>
                 <p className="text-slate-400 text-xl font-light mb-12 leading-relaxed">
                   The difference between a "website" and a "system" is the intelligence behind it. Let's audit your requirements today.
                 </p>
                 <button className="px-12 py-5 bg-white text-slate-950 font-black rounded-2xl text-lg hover:scale-105 hover:bg-brand-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                   Connect With Lead Architect
                 </button>
              </Reveal>
           </div>
        </div>
      </div>
    </div>
  );
};
