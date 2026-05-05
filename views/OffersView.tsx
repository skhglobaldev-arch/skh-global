
import React from 'react';
import { Check, Star, Zap, Shield, Rocket } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useTranslation } from 'react-i18next';

import { ROICalculator } from '../components/ROICalculator';

export const OffersView: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-[#020617] min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Circuit Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 L100 50 M50 0 L50 100" stroke="rgba(14, 165, 233, 0.1)" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="2" fill="rgba(14, 165, 233, 0.2)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="mb-20">
          <Reveal>
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-wider mb-2">
                {t('our_services_title', 'Our Services')}
              </h2>
              <div className="h-1.5 w-full bg-brand-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.6)]"></div>
            </div>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-2 gap-x-16 gap-y-4">
            {[
              t('service_item_1', "Custom Web Applications"),
              t('service_item_2', "Online Booking & Reservation Systems"),
              t('service_item_3', "Real-time Dashboards"),
              t('service_item_4', "Secure Payment Integration"),
              t('service_item_5', "Customer Login & Dashboards"),
              t('service_item_6', "Workflow Automation"),
              t('service_item_7', "AI-Powered Features"),
              t('service_item_8', "Full Domain + Hosting + Training")
            ].map((service, idx) => (
              <Reveal key={idx} delay={idx * 50}>
                <div className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(14,165,233,0.8)] group-hover:scale-150 transition-transform"></div>
                  <span className="text-xl md:text-2xl text-slate-200 font-light tracking-wide">{service}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-32">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-display font-black text-white uppercase tracking-tighter mb-4">
                {t('scalable_solutions_title', 'Scalable Solutions')}
              </h2>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-light tracking-wide">
                {t('offers_subtitle', "We don't just build websites. We build")} <span className="text-brand-400 font-bold">{t('revenue_engines_accent', 'Revenue Engines')}</span> {t('powered_by_ai', 'powered by AI. Choose the level of authority your business needs.')}
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Package 1 */}
            <Reveal delay={100}>
              <div className="h-full glass-panel p-10 rounded-[2.5rem] border border-slate-800 bg-slate-950/40 flex flex-col group hover:border-brand-500/30 transition-colors">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase leading-tight tracking-tighter">
                      AI <br />
                      <span className="text-brand-400">{t('pkg_launchpad', 'Launchpad')}</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{t('digital_authority', 'Digital Authority')}</p>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tighter">{t('pkg_1_price', '£1,499')}</div>
                </div>
                
                <div className="mb-8 p-4 rounded-2xl bg-brand-500/5 border border-brand-500/10">
                  <p className="text-xs text-brand-400 font-medium leading-relaxed italic">
                    "{t('package_1_desc', 'Perfect for established professionals moving away from generic templates to a custom-coded identity.')}"
                  </p>
                </div>

                <ul className="space-y-4 mb-12 flex-grow">
                  {[
                    t('p1_i1', "Bespoke High-Conversion Design"),
                    t('p1_i2', "AI Copywriting & Tone Sync"),
                    t('p1_i3', "Ultra-Fast Load Speeds (100 Score)"),
                    t('p1_i4', "SEO Fundamental Hardening"),
                    t('p1_i5', "Domain & Secure Hosting Setup"),
                    t('p1_i6', "30 Days of Elite Support")
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                      <span className="text-base font-light">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all">{t('get_started', 'Get Started')}</button>
              </div>
            </Reveal>

            {/* Package 2 - Featured */}
            <Reveal delay={200}>
              <div className="h-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-b from-brand-400 to-brand-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative h-full glass-panel p-10 rounded-[2.5rem] border-2 border-brand-500/50 bg-slate-900/60 shadow-[0_0_50px_rgba(14,165,233,0.1)] flex flex-col">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-brand-500 text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)]">
                    {t('revenue_accelerator', 'Revenue Accelerator')}
                  </div>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase leading-tight tracking-tighter">
                        AI Growth <br />
                        <span className="text-brand-400">{t('pkg_engine', 'Engine')}</span>
                      </h3>
                      <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest mt-2">{t('maximum_roi', 'Maximum ROI')}</p>
                    </div>
                    <div className="text-3xl font-black text-white tracking-tighter">{t('pkg_2_price', '£3,499')}</div>
                  </div>

                  <div className="mb-8 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20">
                    <p className="text-xs text-white font-medium leading-relaxed italic">
                      "{t('package_2_desc', 'For businesses that handle high traffic and need automated systems to convert leads 24/7.')}"
                    </p>
                  </div>

                  <ul className="space-y-4 mb-12 flex-grow">
                    {[
                      t('p2_i1', "Advanced AI Lead Concierge"),
                      t('p2_i2', "Full Booking & Payment Pipeline"),
                      t('p2_i3', "Automated Email/SMS Nurturing"),
                      t('p2_i4', "Staff/Resource Management"),
                      t('p2_i5', "Conversion-Optimized Landing Pages"),
                      t('p2_i6', "2 Months Post-Launch Audit")
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white">
                        <Zap className="w-5 h-5 text-brand-400 shrink-0 mt-0.5 fill-brand-400/20" />
                        <span className="text-base font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 rounded-2xl bg-brand-500 text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-brand-400 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]">{t('establish_authority', 'Establish Authority')}</button>
                </div>
              </div>
            </Reveal>

            {/* Package 3 */}
            <Reveal delay={300}>
              <div className="h-full glass-panel p-10 rounded-[2.5rem] border border-slate-800 bg-slate-950/40 flex flex-col group hover:border-brand-500/30 transition-colors">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase leading-tight tracking-tighter">
                      Custom <br />
                      <span className="text-brand-400">{t('pkg_core', 'Core')}</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{t('enterprise_scale', 'Enterprise Scale')}</p>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tighter">{t('pkg_3_price', '£7,499+')}</div>
                </div>

                <div className="mb-8 p-4 rounded-2xl bg-brand-500/5 border border-brand-500/10">
                  <p className="text-xs text-brand-400 font-medium leading-relaxed italic">
                    "{t('package_3_desc', 'Complete digital transformation. We build the architecture that runs your entire operation.')}"
                  </p>
                </div>

                <ul className="space-y-4 mb-12 flex-grow">
                  {[
                    t('p3_i1', "Internal Business Dashboards"),
                    t('p3_i2', "Custom Staff & Client Portals"),
                    t('p3_i3', "Complex Database Architecture"),
                    t('p3_i4', "Third-Party API Integrations"),
                    t('p3_i5', "Military-Grade Security Protocol"),
                    t('p3_i6', "Priority 24/7 Dedicated Support")
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <Rocket className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                      <span className="text-base font-light">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all">{t('request_audit_btn', 'Request Audit')}</button>
              </div>
            </Reveal>
          </div>
        </div>

        <ROICalculator />

        {/* Closing HUD Element */}
        <Reveal delay={500}>
          <div className="mt-32 flex flex-col items-center">
            <div className="w-px h-24 bg-gradient-to-b from-brand-500/50 to-transparent"></div>
            <div className="px-8 py-3 rounded-full border border-brand-500/30 bg-slate-950/50 backdrop-blur-xl text-[10px] font-mono font-bold text-brand-400 uppercase tracking-[0.5em] animate-pulse">
              {t('system_ready_tag', 'System_Ready_For_Deployment')}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
