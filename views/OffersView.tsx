
import React from 'react';
import { Check, Star, Zap, Shield, Rocket } from 'lucide-react';
import { Reveal } from '../components/Reveal';

export const OffersView: React.FC = () => {
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
                Our Services
              </h2>
              <div className="h-1.5 w-full bg-brand-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.6)]"></div>
            </div>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-2 gap-x-16 gap-y-4">
            {[
              "Custom Web Applications",
              "Online Booking & Reservation Systems",
              "Real-time Dashboards",
              "Secure Payment Integration",
              "Customer Login & Dashboards",
              "Workflow Automation",
              "AI-Powered Features",
              "Full Domain + Hosting + Training"
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
                3 Simple Packages
              </h2>
              <p className="text-xl md:text-2xl text-brand-400 font-light tracking-widest uppercase">
                Choose what fits your business
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Package 1 */}
            <Reveal delay={100}>
              <div className="h-full glass-panel p-10 rounded-[2.5rem] border border-slate-800 bg-slate-950/40 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase leading-tight tracking-tighter">
                      Booking <br />
                      <span className="text-brand-400">Shield</span>
                    </h3>
                  </div>
                  <div className="text-3xl font-black text-white">£899</div>
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  {[
                    "Website + contact form",
                    "Basic chatbot",
                    "Domain + setup",
                    "30 days support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                      <span className="text-lg font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Package 2 - Featured */}
            <Reveal delay={200}>
              <div className="h-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-b from-brand-400 to-brand-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative h-full glass-panel p-10 rounded-[2.5rem] border-2 border-brand-500/50 bg-slate-900/60 shadow-[0_0_50px_rgba(14,165,233,0.2)] flex flex-col">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-brand-500 text-slate-950 text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)]">
                    Most Popular
                  </div>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase leading-tight tracking-tighter">
                        Smart <br />
                        <span className="text-brand-400">Booking Bundle</span>
                      </h3>
                    </div>
                    <div className="text-3xl font-black text-white">£2,199</div>
                  </div>
                  <ul className="space-y-6 mb-12 flex-grow">
                    {[
                      "Full booking system + calendar",
                      "Customer dashboard + deposits",
                      "Admin panel",
                      "2 months support"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
                        <span className="text-lg font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Package 3 */}
            <Reveal delay={300}>
              <div className="h-full glass-panel p-10 rounded-[2.5rem] border border-slate-800 bg-slate-950/40 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase leading-tight tracking-tighter">
                      Pro <br />
                      <span className="text-brand-400">Booking System</span>
                    </h3>
                  </div>
                  <div className="text-3xl font-black text-white">£3,999</div>
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  {[
                    "Advanced automation",
                    "Multi-staff calendar",
                    "Full customization",
                    "3 months support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                      <span className="text-lg font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Closing HUD Element */}
        <Reveal delay={500}>
          <div className="mt-32 flex flex-col items-center">
            <div className="w-px h-24 bg-gradient-to-b from-brand-500/50 to-transparent"></div>
            <div className="px-8 py-3 rounded-full border border-brand-500/30 bg-slate-950/50 backdrop-blur-xl text-[10px] font-mono font-bold text-brand-400 uppercase tracking-[0.5em] animate-pulse">
              System_Ready_For_Deployment
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
