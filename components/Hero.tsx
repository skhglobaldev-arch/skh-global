
import React from 'react';
import { ArrowRight, ChevronRight, Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeroProps {
  navigateTo: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  const { t, i18n } = useTranslation();
  const isRtl = ['fa', 'ar', 'ur'].includes(i18n.language.split('-')[0]);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="relative flex min-h-[82vh] items-center justify-center overflow-hidden bg-transparent px-4 pb-14 pt-28 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(124,58,237,0.20),transparent_28%),radial-gradient(circle_at_72%_28%,rgba(37,99,235,0.16),transparent_28%),linear-gradient(180deg,rgba(5,7,19,0.22)_0%,#050713_94%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[44vh] bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-35 [mask-image:linear-gradient(to_top,black,transparent)]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className={`animate-in fade-in slide-in-from-bottom-8 duration-1000 ${isRtl ? 'text-right' : 'text-center'}`}>
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-violet-400/20 bg-[#101827]/70 px-5 py-2.5 shadow-[0_18px_70px_rgba(37,99,235,0.14)] backdrop-blur-2xl">
            <Network size={15} className="text-cyan-200" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-100 md:text-xs">{t('hero_tag', 'Premium system design studio')}</span>
          </div>

          <h1 className={`text-5xl font-black leading-[0.98] tracking-tight text-[#F8FAFC] sm:text-6xl md:text-7xl lg:text-8xl ${isRtl ? '' : 'mx-auto'}`}>
            <span>{t('hero_title', 'From Idea')}</span>
            <br />
            <span className="bg-gradient-to-br from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">
              {t('hero_title_accent', 'to System')}
            </span>
          </h1>

          <p className={`mt-7 max-w-2xl text-base font-light leading-relaxed text-[#CBD5E1] md:text-xl ${isRtl ? 'md:mr-0' : 'mx-auto'}`}>
            {t('hero_desc', 'We design and build digital systems that turn real business problems into working products, dashboards, booking platforms, and automation.')}
          </p>

          <div className={`mt-9 flex flex-col gap-3 sm:flex-row ${isRtl ? 'sm:justify-start' : 'sm:justify-center'}`}>
            <button
              onClick={() => navigateTo('audit')}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-7 py-4 text-sm font-black text-white shadow-[0_20px_70px_rgba(37,99,235,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(56,216,255,0.25)] md:text-base"
            >
              {t('audit_btn', 'Start a System Review')}
              <ArrowRight size={20} className={`transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/18 bg-white/[0.035] px-7 py-4 text-sm font-bold text-[#F8FAFC] backdrop-blur-xl transition-all hover:border-cyan-300/38 hover:bg-white/[0.06] md:text-base"
            >
              {t('process_btn', 'View Case Studies')}
              <ChevronRight className={isRtl ? 'rotate-180' : ''} size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
