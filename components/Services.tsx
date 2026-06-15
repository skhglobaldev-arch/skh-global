import React from 'react';
import { SERVICES } from '../constants';
import { Carousel3D } from './Carousel3D';
import { Reveal } from './Reveal';
import { MoveHorizontal, Sparkles } from 'lucide-react';
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
    <div className="relative overflow-hidden bg-transparent py-20 md:py-24">
      {/* Local Section Gradient Effect (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/10 via-transparent to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <Reveal>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full border border-violet-400/20 bg-[#101827]/60 px-4 py-1.5 backdrop-blur-xl">
               <Sparkles size={14} className="mr-2 text-cyan-200" />
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">{t('our_ecosystem_tag', 'System Types')}</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-display font-black text-white mb-6 tracking-tight">
              {t('modular_architecture_title', 'Practical')} <span className="bg-gradient-to-br from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">{t('architecture_accent', 'Systems')}</span>
            </h3>
            <p className="text-base font-light leading-relaxed text-slate-400 md:text-lg">
              {t('services_desc_text', "We build web apps, dashboards, booking flows, automations and SaaS products around the way your business works.")}
            </p>
          </div>
        </Reveal>

        {/* 3D Carousel Implementation */}
        <Reveal delay={150}>
          <div className="mb-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/14 bg-[#101827]/62 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100 shadow-[0_18px_70px_rgba(37,99,235,0.10)] backdrop-blur-xl">
              <MoveHorizontal size={14} className="text-violet-200" />
              <span>{t('carousel_drag_hint', 'Drag to rotate the cards')}</span>
            </div>
          </div>
        </Reveal>

        <div className="relative mt-2">
           <Carousel3D items={translatedServices} />
        </div>
        
        <Reveal delay={400}>
          <div className="mt-8 text-center">
            <div className="inline-block w-full max-w-lg rounded-2xl bg-gradient-to-r from-transparent via-violet-400/20 to-transparent p-px">
              <div className="rounded-2xl bg-[#101827]/42 px-6 py-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-400">
                  {t('carousel_hint', 'Each card is a different kind of practical system. Rotate the carousel to explore them.')}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
