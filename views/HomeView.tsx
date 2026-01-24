
import React from 'react';
import { Hero } from '../components/Hero';
import { ProblemSolution } from '../components/ProblemSolution';
import { AIPlanner } from '../components/AIPlanner';
import { Reveal } from '../components/Reveal';
import { Carousel3D } from '../components/Carousel3D';
import { CapabilitiesGrid } from '../components/CapabilitiesGrid';
import { ClosingCTA } from '../components/ClosingCTA';
import { ArrowRight, Stethoscope, ShoppingBag, Home as HomeIcon, Scissors } from 'lucide-react';

interface HomeViewProps {
  navigateTo: (page: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ navigateTo }) => {
  const demoItems = [
    { icon: Stethoscope, title: "MediCare Pro", description: "Clinic management system with patient portals, appointment scheduling, and automated reminders." },
    { icon: Scissors, title: "Luxe Glow", description: "Beauty salon booking engine with stylist selection, deposit handling, and inventory tracking." },
    { icon: HomeIcon, title: "Urban Estates", description: "Real estate CRM with interactive property maps, automated lead follow-ups, and document signing." },
    { icon: ShoppingBag, title: "Vogue Cart", description: "Fashion e-commerce platform with live inventory, size recommenders, and influencer referral tracking." },
  ];

  return (
    <div className="bg-transparent animate-in fade-in duration-1000">
      <Hero />
      
      <div className="opacity-100 translate-y-0 transition-all duration-1000">
        <div className="bg-slate-950/40 backdrop-blur-sm">
          <ProblemSolution />
        </div>

        {/* 3D Industry Demos Showcase */}
        <section id="demos" className="py-32 relative overflow-hidden bg-transparent border-t border-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/10 via-transparent to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <Reveal>
               <div className="text-center mb-12">
                   <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 mb-6 backdrop-blur-md">
                     <span className="text-brand-400 text-xs font-mono font-bold uppercase tracking-widest">Live Showcase</span>
                   </div>
                   <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6">
                     Industry-Specific <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-brand-500">Solutions</span>
                   </h2>
                   <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light">
                     Drag to rotate our pre-engineered systems. These are production-ready architectural bases we customize for your specific business logic.
                   </p>
               </div>
            </Reveal>

            <Carousel3D items={demoItems} />
          </div>
        </section>
        
        {/* Capabilities Section */}
        <section className="py-32 relative overflow-hidden bg-slate-950/20">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <Reveal>
               <div className="text-center mb-16">
                   <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-6">
                     Technical Capabilities
                   </h2>
                   <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                     We engineer every system with performance, scalability, and bank-grade security as the primary foundation.
                   </p>
               </div>
            </Reveal>

            <CapabilitiesGrid />

            <div className="text-center mt-16">
              <button 
                onClick={() => navigateTo('services')}
                className="inline-flex items-center gap-2 text-brand-400 font-bold hover:text-white transition-all group uppercase tracking-[0.3em] text-xs"
              >
                Explore Full Technical Services <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* AI Planner Section */}
        <section id="ai-planner" className="py-32 bg-slate-900/20 relative overflow-hidden border-t border-slate-800/50">
           <div className="max-w-7xl mx-auto px-4 relative z-10">
              <Reveal>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/60 mb-6 backdrop-blur-md">
                    <span className="text-brand-400 text-xs font-mono font-bold uppercase tracking-widest">AI Consultant</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-6">
                    Architect Your System
                  </h2>
                  <p className="text-slate-300 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Describe your idea. Our team's AI agent will generate a technical blueprint, timeline, and strategy in seconds.
                  </p>
                </div>
              </Reveal>
              <AIPlanner />
           </div>
        </section>

        <ClosingCTA navigateTo={navigateTo} />
      </div>
    </div>
  );
};
