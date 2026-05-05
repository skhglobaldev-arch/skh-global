
import React from 'react';
import { Hero } from '../components/Hero';
import { ProblemSolution } from '../components/ProblemSolution';
import { Reveal } from '../components/Reveal';
import { Carousel3D } from '../components/Carousel3D';
import { CapabilitiesGrid } from '../components/CapabilitiesGrid';
import { ClosingCTA } from '../components/ClosingCTA';
import { ArrowRight, Stethoscope, ShoppingBag, Home as HomeIcon, Scissors } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HomeViewProps {
  navigateTo: (page: string) => void;
}

import { ROICalculator } from '../components/ROICalculator';

export const HomeView: React.FC<HomeViewProps> = ({ navigateTo }) => {
  const { t } = useTranslation();
  
  const demoItems = [
    { icon: Stethoscope, title: t('demo_1_title', "MediCare Pro"), description: t('demo_1_desc', "Clinic management system with patient portals, appointment scheduling, and automated reminders.") },
    { icon: Scissors, title: t('demo_2_title', "Luxe Glow"), description: t('demo_2_desc', "Beauty salon booking engine with stylist selection, deposit handling, and inventory tracking.") },
    { icon: HomeIcon, title: t('demo_3_title', "Urban Estates"), description: t('demo_3_desc', "Real estate CRM with interactive property maps, automated lead follow-ups, and document signing.") },
    { icon: ShoppingBag, title: t('demo_4_title', "Vogue Cart"), description: t('demo_4_desc', "Fashion e-commerce platform with live inventory, size recommenders, and influencer referral tracking.") },
  ];

  return (
    <div className="bg-transparent animate-in fade-in duration-1000">
      <Hero navigateTo={navigateTo} />
      
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
                     <span className="text-brand-400 text-xs font-mono font-bold uppercase tracking-widest">{t('live_showcase', 'Live Showcase')}</span>
                   </div>
                   <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6">
                     {t('industry_solutions_title', 'Industry-Specific')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-brand-500">{t('solutions_accent', 'Solutions')}</span>
                   </h2>
                   <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light">
                     {t('industry_solutions_desc', 'Drag to rotate our pre-engineered systems. These are production-ready architectural bases we customize for your specific business logic.')}
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
                     {t('technical_capabilities_title', 'Technical Capabilities')}
                   </h2>
                   <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                     {t('technical_capabilities_desc', 'We engineer every system with performance, scalability, and bank-grade security as the primary foundation.')}
                   </p>
               </div>
            </Reveal>

            <CapabilitiesGrid />

            <div className="text-center mt-16">
              <button 
                onClick={() => navigateTo('services')}
                className="inline-flex items-center gap-2 text-brand-400 font-bold hover:text-white transition-all group uppercase tracking-[0.3em] text-xs"
              >
                {t('explore_technical_services', 'Explore Full Technical Services')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Pricing / Packages Quick View */}
        <section className="py-32 relative bg-slate-900/10 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <Reveal>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-6">
                  {t('select_investment_title', 'Select Your')} <span className="text-brand-500">{t('investment_accent', 'Investment')}</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                  {t('investment_desc', 'We offer three clear tiers of digital dominance. No hourly bills. Just pure, results-driven engineering.')}
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: t('pkg_1_name', "AI Launchpad"), price: t('pkg_1_price', "£1,499"), desc: t('pkg_1_desc', "For professionals needing an elite identity.") },
                { name: t('pkg_2_name', "Growth Engine"), price: t('pkg_2_price', "£3,499"), desc: t('pkg_2_desc', "The automated system that prints revenue.") },
                { name: t('pkg_3_name', "Custom Core"), price: t('pkg_3_price', "£7,499+"), desc: t('pkg_3_desc', "The entire nervous system for your enterprise.") }
              ].map((pkg, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="p-8 rounded-[2rem] bg-slate-950/50 border border-slate-800 flex flex-col items-center text-center group hover:border-brand-500/50 transition-all duration-500">
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">{pkg.name}</h3>
                    <div className="text-2xl font-black text-brand-400 mb-4">{pkg.price}</div>
                    <p className="text-slate-500 text-sm font-light mb-8 italic">"{pkg.desc}"</p>
                    <button 
                      onClick={() => navigateTo('offers')}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 group-hover:text-brand-400 transition-colors"
                    >
                      {t('view_package_details', 'View Package Details')} →
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ROICalculator />
        
        <ClosingCTA navigateTo={navigateTo} />
      </div>
    </div>
  );
};
