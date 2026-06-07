import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

export type JourneyItem = {
  icon: LucideIcon;
  title: string;
  eyebrow: string;
  desc: string;
};

interface JourneyTimelineProps {
  items: JourneyItem[];
  compact?: boolean;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ items, compact = false }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-5 w-px bg-gradient-to-b from-transparent via-cyan-300/24 to-transparent md:left-1/2" />

      <div className={compact ? 'space-y-6' : 'space-y-9 md:space-y-10'}>
        {items.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 80}>
            <div className="group relative flex gap-5 md:grid md:grid-cols-[1fr_4rem_1fr] md:gap-6">
              <div className={`${index % 2 === 0 ? 'md:order-1 md:text-right' : 'md:order-3 md:text-left'} hidden md:block`} />

              <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/16 bg-[#101827] text-cyan-200 shadow-[0_18px_48px_rgba(5,7,19,0.45)] transition-all duration-500 group-hover:scale-105 group-hover:border-cyan-300/42 group-hover:bg-gradient-to-br group-hover:from-[#7C3AED] group-hover:via-[#2563EB] group-hover:to-[#38D8FF] group-hover:text-white md:order-2 md:mx-auto">
                <item.icon size={compact ? 18 : 20} />
              </div>

              <article className={`${index % 2 === 0 ? 'md:order-3' : 'md:order-1'} w-full rounded-[1.35rem] border border-violet-400/12 bg-[#101827]/64 p-5 shadow-[0_18px_70px_rgba(5,7,19,0.36)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-[#101827]/78 hover:shadow-[0_24px_90px_rgba(124,58,237,0.16)] ${compact ? 'md:p-5' : 'md:p-6'}`}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="rounded-full border border-cyan-300/14 bg-cyan-300/[0.045] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
                    {item.eyebrow}
                  </p>
                  <span className="text-[10px] font-black text-slate-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-black leading-snug text-white`}>
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </article>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};
