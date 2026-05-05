import React from 'react';
import { GithubIcon, InstagramIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  navigateTo: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const { t } = useTranslation();
  
  return (
    <footer className="relative bg-black pt-24 pb-12 border-t border-slate-900 overflow-hidden shrink-0">
      {/* Grounding Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigateTo('home')}>
                <div className="relative">
                  <img src="https://files.catbox.moe/n3xbja.png" alt="Logo" className="w-14 h-14 object-cover brightness-110 transition-transform group-hover:scale-110" />
                </div>
                <span className="font-display font-black text-3xl text-white tracking-tighter uppercase">SKH<span className="text-brand-500">.GLOBAL</span></span>
              </div>
              <p className="text-slate-500 text-lg max-w-sm leading-relaxed font-light">
                {t('footer_desc', 'Engineering intelligent digital systems for the next generation of business. We bridge the gap between complex ideas and automated reality.')}
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com/skh.global" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition-all">
                  <InstagramIcon size={20} />
                </a>
                <a href="https://github.com/skh-global" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition-all">
                  <GithubIcon size={20} />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="space-y-8">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">{t('navigation_title', 'Navigation')}</h4>
              <ul className="space-y-4">
                <li><button onClick={() => navigateTo('home')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav_home', 'Home')}</button></li>
                <li><button onClick={() => navigateTo('services')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav_services', 'Services')}</button></li>
                <li><button onClick={() => navigateTo('process')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav_process', 'Process')}</button></li>
                <li><button onClick={() => navigateTo('offers')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav_offers', 'Offers')}</button></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">{t('legal_title', 'Legal')}</h4>
              <ul className="space-y-4">
                <li><button onClick={() => navigateTo('privacy')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-mono">{t('nav_privacy', 'Privacy')}</button></li>
                <li><button onClick={() => navigateTo('terms')} className="text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-mono">{t('nav_terms', 'Terms')}</button></li>
                <li><button onClick={() => navigateTo('contact')} className="text-brand-500 hover:text-brand-400 transition-colors uppercase tracking-widest text-xs font-bold">{t('nav_contact', 'Connect')}</button></li>
              </ul>
            </div>
        </div>

        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-700 text-sm font-medium tracking-tight">
            {t('footer_copy', '© 2026 SKH GLOBAL. Built for digital sovereignty.')}
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] font-mono text-slate-800 uppercase tracking-[0.3em]">System_v2.0_Online</span>
            <span className="text-[10px] font-mono text-slate-800 uppercase tracking-[0.3em]">London_Node</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
