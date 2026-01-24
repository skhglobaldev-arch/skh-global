
import React from 'react';
import { HowItWorks } from '../components/HowItWorks';
import { Reveal } from '../components/Reveal';
import { PageHero } from '../components/PageHero';
import { CheckCircle2, GitMerge, Terminal, Cpu, PenTool } from 'lucide-react';

export const ProcessView: React.FC = () => {
  return (
    <div className="pb-24">
       
       <PageHero 
         badge="STRATEGIC_LIFECYCLE_ACTIVE"
         title={<>Concept to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-brand-400 glow-text">Automated Cash Flow</span></>}
         subtitle="We've refined a systematic approach to building digital products. No guessing, no delays—just a predictable path to launch."
       />

       <div className="-mt-20 relative z-20">
         <HowItWorks />
       </div>

       {/* Detailed Timeline */}
       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <Reveal>
             <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Development Roadmap</h2>
               <p className="text-slate-400 max-w-2xl mx-auto">A transparent look at how we spend every week of your project.</p>
             </div>
          </Reveal>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            {[
              { icon: PenTool, title: "Discovery & Strategy", week: "Week 1", desc: "We deep dive into your business logic, audit current systems, and architect the database schema." },
              { icon: Terminal, title: "Design & Prototype", week: "Week 2", desc: "High-fidelity UI/UX designs. We build the skeleton so you can visualize the user journey." },
              { icon: GitMerge, title: "Core Development", week: "Weeks 3-5", desc: "Heavy lifting. API development, frontend implementation, and database connectivity." },
              { icon: Cpu, title: "Automation Integration", week: "Week 6", desc: "Connecting the plumbing. Make.com workflows, Stripe payments, and email triggers." },
              { icon: CheckCircle2, title: "Testing & Launch", week: "Week 7", desc: "Security auditing, load testing, and final deployment to production." }
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-900 group-hover:bg-brand-500 group-hover:border-brand-400 shadow-[0_0_20px_rgba(0,0,0,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-300">
                    <item.icon size={20} className="text-slate-400 group-hover:text-white" />
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass-panel p-8 rounded-2xl border-slate-700 hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-xl text-white font-display">{item.title}</h3>
                      <span className="text-xs font-mono text-brand-400 bg-brand-900/20 px-3 py-1 rounded-full border border-brand-500/20">{item.week}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
       </div>

       {/* Tools We Use */}
       <div className="py-24 bg-slate-900/50 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Reveal>
              <h3 className="text-2xl font-bold text-white mb-12">Powered By Best-In-Class Tools</h3>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60">
                 {['Figma', 'VS Code', 'GitHub', 'Vercel', 'Postman', 'Docker'].map((tool) => (
                   <span key={tool} className="text-xl font-mono text-slate-400 border border-slate-700 px-6 py-3 rounded-lg bg-slate-950">{tool}</span>
                 ))}
              </div>
            </Reveal>
          </div>
       </div>

    </div>
  );
};
