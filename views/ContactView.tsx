import React from 'react';
import { ContactCTA } from '../components/ContactCTA';
import { Reveal } from '../components/Reveal';
import { PageHero } from '../components/PageHero';
import { Mail, MapPin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ContactView: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="pb-0">
      
      <PageHero 
        badge={t('contact_page_badge', 'Get in Touch')}
        title={<>{t('contact_page_title', 'Request a')} <br/><span className="bg-gradient-to-br from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">{t('contact_page_title_accent', 'Free Consultation')}</span></>}
        subtitle={t('contact_page_subtitle', "Tell us what your business needs. We can help with booking, payments, dashboards, customer portals, automation and custom systems.")}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
        <div className="glass-panel rounded-3xl border border-violet-400/12 bg-[#101827]/72 p-8 shadow-[0_24px_100px_rgba(5,7,19,0.55)] backdrop-blur-xl md:p-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
             <Reveal>
               <div className="space-y-10">
                  <div>
                    <h3 className="mb-4 text-2xl font-bold text-white">{t('boarding_office_title', 'Contact Details')}</h3>
                    <p className="text-slate-400">{t('boarding_office_desc', 'Send your request and our specialists will contact you soon.')}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="group flex items-start gap-5 rounded-2xl border border-violet-400/10 bg-[#050713]/50 p-4 transition-colors hover:border-cyan-300/30">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-[#101827] transition-transform group-hover:scale-110">
                        <Mail className="text-cyan-300" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{t('email_us', 'Email Us')}</div>
                        <a href="mailto:skhglobal.dev@gmail.com" className="font-medium text-white text-lg transition-colors hover:text-cyan-200">skhglobal.dev@gmail.com</a>
                        <p className="text-xs text-slate-500 mt-1">{t('response_time', '24h Response Time')}</p>
                      </div>
                    </div>
                    
                    <div className="group flex items-start gap-5 rounded-2xl border border-violet-400/10 bg-[#050713]/50 p-4 transition-colors hover:border-cyan-300/30">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-[#101827] transition-transform group-hover:scale-110">
                        <MapPin className="text-cyan-300" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{t('global_hq', 'Working Location')}</div>
                        <div className="font-medium text-white text-lg">{t('remote_first', 'Based in the UK / Online collaboration')}</div>
                        <p className="text-xs text-slate-500 mt-1">{t('operating_worldwide', 'Remote-friendly system projects')}</p>
                      </div>
                    </div>

                    <div className="group flex items-start gap-5 rounded-2xl border border-violet-400/10 bg-[#050713]/50 p-4 transition-colors hover:border-cyan-300/30">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-[#101827] transition-transform group-hover:scale-110">
                        <Clock className="text-cyan-300" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{t('working_hours_title', 'Working Hours')}</div>
                        <div className="font-medium text-white text-lg">{t('working_hours_val', 'Mon - Fri, 09:00 - 18:00 UK time')}</div>
                      </div>
                    </div>
                  </div>
               </div>
             </Reveal>

             <div className="lg:border-l lg:border-slate-800 lg:pl-16">
               <ContactCTA />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
