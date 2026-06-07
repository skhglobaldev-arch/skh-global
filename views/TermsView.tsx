import React from 'react';
import { ArrowLeft, FileText, Home, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { getLegalLocaleCopy } from '../src/legalCopy';

export const TermsView: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = getLegalLocaleCopy(i18n.language);
  const copy = locale.terms;
  const isRtl = locale.direction === 'rtl';

  return (
    <main dir={locale.direction} className="relative min-h-screen overflow-hidden bg-[#050713] px-4 pb-20 pt-32 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(124,58,237,0.20),transparent_34%),radial-gradient(circle_at_82%_34%,rgba(56,216,255,0.12),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-[420px] max-w-4xl rounded-full bg-gradient-to-br from-[#7C3AED]/12 via-[#2563EB]/8 to-[#38D8FF]/10 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal>
          <header className={`mb-10 ${isRtl ? 'text-right' : 'text-left'}`}>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mb-7 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-300 transition-all hover:border-cyan-300/30 hover:text-white"
            >
              <ArrowLeft className={isRtl ? 'rotate-180' : ''} size={17} />
              {locale.nav.backHome}
            </button>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-white/[0.03] px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">
              <Scale size={14} />
              {copy.badge}
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl">
              {copy.subtitle}
            </p>
          </header>
        </Reveal>

        {copy.intro && (
          <Reveal delay={80}>
            <section className={`mb-8 rounded-[2rem] border border-violet-400/14 bg-[#101827]/74 p-6 shadow-[0_28px_100px_rgba(5,7,19,0.50)] backdrop-blur-2xl md:p-8 ${isRtl ? 'text-right' : 'text-left'}`}>
              <p className="text-base leading-8 text-[#CBD5E1] md:text-lg">{copy.intro}</p>
            </section>
          </Reveal>
        )}

        <section className="space-y-5">
          {copy.sections.map((section, index) => (
            <Reveal key={section.title} delay={Math.min(index * 35, 260)}>
              <article className={`rounded-[1.6rem] border border-white/10 bg-[#101827]/62 p-6 shadow-[0_18px_70px_rgba(5,7,19,0.34)] backdrop-blur-xl md:p-7 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] text-xs font-black text-white shadow-[0_14px_40px_rgba(37,99,235,0.28)]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">{section.title}</h2>
                    <div className="mt-3 space-y-4">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className="text-base leading-8 text-slate-400">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </section>

        <Reveal delay={220}>
          <section className="mt-10 overflow-hidden rounded-[2rem] border border-cyan-300/16 bg-[#101827]/74 p-8 text-center shadow-[0_24px_100px_rgba(37,99,235,0.14)] backdrop-blur-2xl">
            <img
              src="/skh-logo-mark.png"
              alt="SKH.GLOBAL"
              className="mx-auto mb-5 h-16 w-16 object-contain drop-shadow-[0_0_28px_rgba(124,58,237,0.32)]"
            />
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#050713]/80 text-cyan-200">
              <FileText size={22} />
            </div>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-400">
              {copy.intro}
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mx-auto mt-7 inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-6 py-4 text-sm font-black text-white shadow-[0_18px_52px_rgba(37,99,235,0.28)] transition-all hover:-translate-y-1"
            >
              <Home size={18} />
              {locale.nav.backHome}
            </button>
          </section>
        </Reveal>
      </div>
    </main>
  );
};
