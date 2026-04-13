
import React from 'react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { Shield, Lock, Eye, Server } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="bg-black min-h-screen">
      <PageHero 
        title={<>Privacy <span className="text-brand-500">Protocol</span></>}
        subtitle="Our commitment to data integrity and client confidentiality in the age of AI."
        badge="SECURITY_LEVEL_ALPHA"
      />

      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="space-y-20">
            
            <Reveal>
              <div className="grid md:grid-cols-[80px_1fr] gap-8">
                <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                  <Shield size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Data Collection & Usage</h2>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    SKH.GLOBAL collects only the essential data required to architect, implement, and maintain your custom AI systems. This includes technical requirements, business logic parameters, and communication metadata. We do not engage in mass data harvesting or unauthorized profiling.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="grid md:grid-cols-[80px_1fr] gap-8">
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Lock size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Neural Data Security</h2>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    All proprietary algorithms and training data provided by our clients are treated as highly classified. We implement end-to-end encryption and isolated server environments to ensure that your competitive advantages remain secure and private.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="grid md:grid-cols-[80px_1fr] gap-8">
                <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Eye size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Transparency & Control</h2>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    You maintain full ownership of your data. At any point during or after a project, you may request a full audit of the data we hold or request its permanent deletion from our active development environments.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="grid md:grid-cols-[80px_1fr] gap-8">
                <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Server size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Third-Party Integration</h2>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    We utilize world-class infrastructure providers including Google Cloud, Stripe, and OpenAI. Each provider is vetted for compliance with global privacy standards (GDPR, CCPA). Your data is never sold to third-party brokers.
                  </p>
                </div>
              </div>
            </Reveal>

          </div>

          <div className="mt-32 p-12 rounded-[2.5rem] glass-panel border border-slate-800 text-center">
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest mb-4">Last Updated: April 2026</p>
            <p className="text-slate-400 font-light italic">
              "Privacy is not an option; it is the foundation of digital trust."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
