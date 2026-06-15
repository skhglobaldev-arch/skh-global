import React from 'react';
import { InstagramIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLegalLocaleCopy } from '../src/legalCopy';

interface FooterProps {
  navigateTo: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const { t, i18n } = useTranslation();
  const legalCopy = getLegalLocaleCopy(i18n.language);
  
  return (
    <footer className="relative bg-black pt-24 pb-12 border-t border-slate-900 overflow-hidden shrink-0">
      {/* Grounding Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigateTo('home')}>
                <img
                  src="/skh-logo-mark.png"
                  alt="SKH.GLOBAL logo"
                  className="h-14 w-14 object-contain brightness-110 drop-shadow-[0_0_24px_rgba(124,58,237,0.25)] transition-transform group-hover:scale-[1.04]"
                />
                <span className="font-display text-2xl font-black tracking-tight text-white">SKH<span className="bg-gradient-to-r from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">.GLOBAL</span></span>
              </div>
              <p className="text-slate-500 text-lg max-w-sm leading-relaxed font-light">
                {t('footer_desc', 'Digital systems for bookings, payments, dashboards, customer portals, automation, and SaaS products.')}
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com/skh.global" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition-all">
                  <InstagramIcon size={20} />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="space-y-8">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">{t('navigation_title', 'Navigation')}</h4>
              <ul className="space-y-4">
                <li><button onClick={() => navigateTo('home')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav_home', 'Home')}</button></li>
                <li><button onClick={() => navigateTo('services')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav_services', 'Systems')}</button></li>
                <li><button onClick={() => navigateTo('about')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav_about', 'Case Studies')}</button></li>
                <li><button onClick={() => navigateTo('process')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav_process', 'Process')}</button></li>
                <li><button onClick={() => navigateTo('contact')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav_contact', 'Contact')}</button></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">{legalCopy.nav.legal || t('legal_title', 'Legal')}</h4>
              <ul className="space-y-4">
                <li><button onClick={() => navigateTo('terms')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-mono">{legalCopy.nav.terms}</button></li>
                <li><button onClick={() => navigateTo('privacy')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-mono">{legalCopy.nav.privacy}</button></li>
                <li><button onClick={() => navigateTo('audit')} className="text-brand-500 hover:text-brand-400 transition-colors uppercase tracking-widest text-xs font-bold">{t('nav_audit', 'Start a System Review')}</button></li>
              </ul>
            </div>
        </div>

        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-700 text-sm font-medium tracking-tight">
            {t('footer_copy', '© 2026 SKH Global. All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
};
