import React from 'react';
import { Reveal } from '../components/Reveal';
import { Shield, Target, Zap, TrendingUp, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AboutView: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-[#050713] min-h-screen pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-300/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          <Reveal>
            <div className="mb-20">
              <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none mb-8">
                {t('about_title', 'Systems That Make')} <br />
                <span className="bg-gradient-to-r from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">{t('about_title_accent', 'Business Easier')}</span>
              </h2>
              <p className="text-slate-400 text-xl font-light max-w-3xl leading-relaxed">
                {t('about_desc', "We create practical digital systems that help businesses take bookings, receive payments, answer customers and manage daily work with less manual effort.")}
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16 mb-32">
             <Reveal delay={100}>
               <div className="glass-panel p-10 rounded-[2rem] border border-white/10 bg-[#101827]/55">
                  <h3 className="text-cyan-200 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                    <Target size={16} /> {t('phil_title', 'Our Philosophy')}
                  </h3>
                  <p className="text-slate-300 text-lg font-light leading-relaxed mb-8">
                    {t('phil_desc', "Technology should make work easier. We reduce repetitive tasks so business owners have more time for customers, quality and growth.")}
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white mb-1">24/7</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">{t('automated_stat', 'Automated')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-white mb-1">0%</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">{t('friction_stat', 'Friction')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-white mb-1">100%</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">{t('ownership_stat', 'Ownership')}</div>
                    </div>
                  </div>
               </div>
             </Reveal>

             <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: TrendingUp, title: t('stat_1_t', "Conversion Lift"), val: "+400%" },
                  { icon: Zap, title: t('stat_2_t', "Hours Saved/Mo"), val: "120+" },
                  { icon: Shield, title: t('stat_3_t', "Security Score"), val: "A+" },
                  { icon: Award, title: t('uptime_stat', "Server Uptime"), val: "99.9%" }
                ].map((stat, i) => (
                  <Reveal key={i} delay={i * 50 + 200}>
                    <div className="p-8 rounded-3xl border border-white/10 bg-[#101827]/45 flex flex-col items-center text-center group hover:border-cyan-300/30 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-cyan-200 mb-4 group-hover:scale-110 transition-transform">
                        <stat.icon size={24} />
                      </div>
                      <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.title}</div>
                    </div>
                  </Reveal>
                ))}
             </div>
          </div>

          {/* Core Team / Values */}
          <div className="pt-20 border-t border-slate-900">
             <Reveal>
               <div className="grid md:grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <div className="w-px h-12 bg-gradient-to-b from-violet-400 to-cyan-300"></div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs">{t('the_logic', 'The Logic')}</h4>
                    <p className="text-slate-500 text-sm font-light leading-relaxed italic">
                      {t('logic_quote', '"We start with the real workflow before we decide what to build."')}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-px h-12 bg-slate-800"></div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs">{t('the_engine', 'The Engine')}</h4>
                    <p className="text-slate-500 text-sm font-light leading-relaxed italic">
                      {t('engine_quote', '"Booking, payment and follow-up should feel simple for the customer and manageable for the team."')}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-px h-12 bg-violet-800"></div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs">{t('the_vault', 'The Vault')}</h4>
                    <p className="text-slate-500 text-sm font-light leading-relaxed italic">
                      {t('vault_quote', '"Customer and business data should be protected with clear access and sensible controls."')}
                    </p>
                  </div>
               </div>
             </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};
