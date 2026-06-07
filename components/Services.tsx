import React from 'react';
import { SERVICES } from '../constants';
import { Carousel3D } from './Carousel3D';
import { Reveal } from './Reveal';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Services: React.FC = () => {
  const { t } = useTranslation();

  // Derived translated items
  const translatedServices = SERVICES.map((service, idx) => ({
    ...service,
    title: t(`service_${idx + 1}_title`, service.title),
    description: t(`service_${idx + 1}_desc`, service.description)
  }));

  return (
    <div className="py-24 relative overflow-hidden bg-transparent">
      {/* Local Section Gradient Effect (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/10 via-transparent to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="mb-6 inline-flex items-center justify-center rounded-full border border-violet-400/20 bg-[#101827]/60 px-4 py-1.5 backdrop-blur-xl">
               <Sparkles size={14} className="mr-2 text-cyan-200" />
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">{t('our_ecosystem_tag', 'System Types')}</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-display font-black text-white mb-6 tracking-tight">
              {t('modular_architecture_title', 'Practical')} <span className="bg-gradient-to-br from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">{t('architecture_accent', 'Systems')}</span>
            </h3>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              {t('services_desc_text', "We build web apps, dashboards, booking flows, automations and SaaS products around the way your business works.")}
            </p>
          </div>
        </Reveal>

        {/* 3D Carousel Implementation */}
        <div className="relative mt-8">
           <Carousel3D items={translatedServices} />
        </div>
        
        <Reveal delay={400}>
          <div className="mt-12 text-center">
            <div className="inline-block p-px rounded-2xl bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full max-w-md">
              <div className="bg-slate-900/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                <p className="text-slate-500 text-sm font-medium">
                  {t('carousel_hint', 'Interacting with our systems feels as smooth as this carousel.')}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
