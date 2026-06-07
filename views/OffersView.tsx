import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useTranslation } from 'react-i18next';

export const OffersView: React.FC = () => {
  const { t } = useTranslation();

  const collaborationModels = [
    {
      title: t('collab_review_title', 'System Review'),
      desc: t('collab_review_desc', 'For understanding the need, user path, repeated problem, and best direction before a build starts.'),
      items: [
        t('collab_review_item_1', 'Problem and workflow review'),
        t('collab_review_item_2', 'User journey and system suggestion'),
        t('collab_review_item_3', 'Scope and next-step recommendation'),
      ],
    },
    {
      title: t('collab_starter_title', 'Starter System'),
      desc: t('collab_starter_desc', 'For one clear flow such as booking, payment, dashboard, or customer portal.'),
      items: [
        t('collab_starter_item_1', 'Focused customer flow'),
        t('collab_starter_item_2', 'Simple admin control'),
        t('collab_starter_item_3', 'Launch-ready setup'),
      ],
    },
    {
      title: t('collab_custom_title', 'Custom Digital System'),
      desc: t('collab_custom_desc', 'For custom systems with panels, payments, database, user roles, files, automation, and AI where needed.'),
      items: [
        t('collab_custom_item_1', 'Custom dashboard and database'),
        t('collab_custom_item_2', 'Payments, roles, and automations'),
        t('collab_custom_item_3', 'SaaS or product logic'),
      ],
    },
    {
      title: t('collab_care_title', 'Care Plan'),
      desc: t('collab_care_desc', 'For support, small changes, technical review, and development after launch.'),
      items: [
        t('collab_care_item_1', 'Monthly improvements'),
        t('collab_care_item_2', 'Technical checks'),
        t('collab_care_item_3', 'Support after launch'),
      ],
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050713] pb-24 pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_86%_18%,rgba(56,216,255,0.10),transparent_28%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-white/[0.03] px-5 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">
              <Sparkles size={14} />
              {t('collab_badge', 'How We Work Together')}
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              {t('collab_title', 'Collaboration')} <span className="bg-gradient-to-br from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">{t('collab_title_accent', 'built around scope.')}</span>
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl">
              {t('collab_desc', 'Projects are priced based on scope, complexity, and the services needed. Collaboration starts with a system review.')}
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {collaborationModels.map((model, index) => (
            <Reveal key={model.title} delay={index * 80}>
              <article className="flex h-full flex-col rounded-[2rem] border border-violet-400/12 bg-[#101827]/64 p-7 shadow-[0_24px_90px_rgba(5,7,19,0.45)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-cyan-300/28">
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED]/35 via-[#2563EB]/22 to-[#38D8FF]/18 text-sm font-black text-white ring-1 ring-white/10">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h2 className="text-2xl font-black text-white">{model.title}</h2>
                <p className="mt-4 flex-grow text-sm leading-relaxed text-slate-400">{model.desc}</p>
                <div className="mt-7 space-y-3">
                  {model.items.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-cyan-200" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={260}>
          <div className="mx-auto mt-14 max-w-4xl rounded-[2rem] border border-cyan-300/16 bg-[#101827]/70 p-8 text-center backdrop-blur-xl">
            <p className="text-lg leading-relaxed text-slate-300">
              {t('collab_pricing_note', 'Simple projects can start from £750. Custom systems are priced after a clear review of the workflow, features, integrations, and support needs.')}
            </p>
            <a href="#/audit" className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-8 py-5 text-base font-black text-white shadow-[0_20px_70px_rgba(37,99,235,0.30)] transition-all hover:-translate-y-1">
              {t('nav_audit', 'Start a System Review')}
              <ArrowRight size={20} />
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
