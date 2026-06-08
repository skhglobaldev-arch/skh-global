import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';
import { useTranslation } from 'react-i18next';

export const About: React.FC = () => {
  const { t } = useTranslation();

  const caseStudies = [
    {
      name: 'BeautyTech',
      label: t('home_case_beauty_label', 'From beauty website to booking, payment, and management System.'),
      before: t('home_case_beauty_before', 'Bookings, staff schedules, deposits, and branch updates were spread across manual tools.'),
      built: t('home_case_beauty_built', 'A beauty business system with booking, staff logic, customer dashboards, payments, and branch management.'),
      features: [
        t('home_case_beauty_feature_1', 'Online booking and deposits'),
        t('home_case_beauty_feature_2', 'Staff and branch control'),
        t('home_case_beauty_feature_3', 'Customer dashboard'),
      ],
    },
    {
      name: 'Bookly',
      label: t('home_case_bookly_label', 'From scattered bookings to service discovery and management platform.'),
      before: t('home_case_bookly_before', 'Small businesses needed a simple way to show services, take bookings, and manage requests.'),
      built: t('home_case_bookly_built', 'A lightweight booking-first product with professional pages, booking flow, and management tools.'),
      features: [
        t('home_case_bookly_feature_1', 'Service pages'),
        t('home_case_bookly_feature_2', 'Booking-first flow'),
        t('home_case_bookly_feature_3', 'Simple management tools'),
      ],
    },
    {
      name: 'Interastral',
      label: t('home_case_interastral_label', 'From idea to intelligent product experience.'),
      before: t('home_case_interastral_before', 'A product idea needed structure, guided journeys, and a polished digital experience.'),
      built: t('home_case_interastral_built', 'A digital mysticism platform shaped into a usable AI-assisted product experience.'),
      features: [
        t('home_case_interastral_feature_1', 'Guided product journeys'),
        t('home_case_interastral_feature_2', 'AI-assisted experience'),
        t('home_case_interastral_feature_3', 'Polished interface'),
      ],
    },
    {
      name: 'Awaz',
      label: t('home_case_awaz_label', 'From traditional print shop to online design and order studio.'),
      before: t('home_case_awaz_before', 'Orders, design requests, and customer updates needed a clearer online path.'),
      built: t('home_case_awaz_built', 'A planned ordering system for design requests, print orders, payments, and customer updates.'),
      features: [
        t('home_case_awaz_feature_1', 'Order intake'),
        t('home_case_awaz_feature_2', 'Design request flow'),
        t('home_case_awaz_feature_3', 'Customer status updates'),
      ],
    },
    {
      name: 'Dental Clinic',
      label: t('home_case_dental_label', 'From manual booking to consultation, payment, and patient file system.'),
      before: t('home_case_dental_before', 'Consultations, payments, reminders, and patient details were handled manually.'),
      built: t('home_case_dental_built', 'A planned clinic system for consultations, payments, patient records, and follow-up.'),
      features: [
        t('home_case_dental_feature_1', 'Consultation booking'),
        t('home_case_dental_feature_2', 'Payment tracking'),
        t('home_case_dental_feature_3', 'Patient records'),
      ],
    },
  ];

  return (
    <div className="relative overflow-hidden bg-transparent pb-24 pt-36">
      <div className="absolute left-0 top-32 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />
      <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-white/[0.03] px-5 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">
              <Sparkles size={14} />
              {t('about_comp_tag', 'Case Studies')}
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              {t('about_comp_title', 'Systems built from')} <span className="bg-gradient-to-br from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">{t('about_comp_title_accent', 'real problems.')}</span>
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl">
              {t('about_comp_p1', 'Each project starts with a repeated business problem, then becomes a practical system with booking, payment, dashboard, portal, automation, or SaaS logic.')}
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {caseStudies.map((project, index) => (
            <Reveal key={project.name} delay={index * 80}>
              <article className="group relative h-full overflow-hidden rounded-[2rem] border border-violet-400/12 bg-[#101827]/64 p-7 shadow-[0_24px_90px_rgba(5,7,19,0.46)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-cyan-300/26">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(124,58,237,0.16),transparent_34%),radial-gradient(circle_at_100%_20%,rgba(56,216,255,0.10),transparent_30%)] opacity-70" />
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">{project.label}</p>
                  <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">{project.name}</h2>

                  <div className="mt-7 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#050713]/55 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200">{t('home_case_before_label', 'Before')}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-400">{project.before}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-300/14 bg-cyan-300/[0.045] p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">{t('home_case_built_label', 'System Built')}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{project.built}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.features.map((feature) => (
                      <span key={feature} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300">
                        <CheckCircle2 size={13} className="text-cyan-200" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  <a href="#/audit" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-cyan-200">
                    {t('home_case_explore', 'View case study')}
                    <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <div className="mt-16 rounded-[2rem] border border-cyan-300/16 bg-[#101827]/70 p-8 text-center backdrop-blur-xl md:p-12">
            <h2 className="text-3xl font-black text-white md:text-5xl">{t('home_final_title', 'Have a business problem that keeps repeating?')}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">{t('home_final_body', 'Let’s turn it into a usable system.')}</p>
            <a href="#/audit" className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-8 py-5 text-base font-black text-white shadow-[0_20px_70px_rgba(37,99,235,0.32)] transition-all hover:-translate-y-1">
              {t('home_final_cta', 'Start a System Review')}
              <ArrowRight size={20} />
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
