
import React from 'react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { FileText, Scale, Zap, Globe } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="bg-black min-h-screen">
      <PageHero 
        title={<>Terms of <span className="text-brand-500">Service</span></>}
        subtitle="The legal framework governing our architectural partnerships and system deployments."
        badge="LEGAL_FRAMEWORK_v2.0"
      />

      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="space-y-20">
            
            <Reveal>
              <div className="grid md:grid-cols-[80px_1fr] gap-8">
                <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                  <Zap size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Service Provision</h2>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    SKH.GLOBAL provides high-end AI consulting, software architecture, and automated system deployment. Our services are delivered based on agreed-upon milestones and technical specifications outlined in individual project proposals.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="grid md:grid-cols-[80px_1fr] gap-8">
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Globe size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Intellectual Property</h2>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    Upon full payment of project fees, the client receives full ownership of the custom implementation and specific codebase developed for their system. SKH.GLOBAL retains ownership of its core proprietary frameworks and pre-existing architectural patterns used to build the system.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="grid md:grid-cols-[80px_1fr] gap-8">
                <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Scale size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Liability Limitation</h2>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    While we engineer systems for maximum reliability and performance, SKH.GLOBAL is not liable for indirect, incidental, or consequential damages arising from the use of our systems. We provide the tools; the client is responsible for their operational use.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="grid md:grid-cols-[80px_1fr] gap-8">
                <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400">
                  <FileText size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Confidentiality</h2>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    Both parties agree to maintain strict confidentiality regarding all business secrets, technical data, and project-specific information exchanged during the partnership. This obligation survives the termination of any service agreement.
                  </p>
                </div>
              </div>
            </Reveal>

          </div>

          <div className="mt-32 p-12 rounded-[2.5rem] glass-panel border border-slate-800 text-center">
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest mb-4">Governance: International Digital Law</p>
            <p className="text-slate-400 font-light">
              By engaging our services, you agree to these foundational terms of partnership.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
