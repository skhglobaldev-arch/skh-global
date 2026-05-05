
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Quote, Building2 } from 'lucide-react';
import { Reveal } from './Reveal';
import { useTranslation } from 'react-i18next';

export const About: React.FC = () => {
  const { t } = useTranslation();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      quote: t('testimonial_1_quote', 'SKH.GLOBAL transformed our manual spreadsheets into a fully automated cloud system. Our efficiency has tripled in just two months.'),
      author: t('testimonial_1_author', 'Sarah Jenkins'),
      role: t('testimonial_1_role', 'COO'),
      company: t('testimonial_1_company', 'Logistics Pro')
    },
    {
      quote: t('testimonial_2_quote', "The real-time dashboard is a game changer. I can see bookings and payments coming in live while I'm on the go."),
      author: t('testimonial_2_author', 'Michael Chen'),
      role: t('testimonial_2_role', 'Founder'),
      company: t('testimonial_2_company', 'GrowthFlow')
    },
    {
      quote: t('testimonial_3_quote', "Their influencer tracking system allowed us to scale our marketing team effortlessly. Best investment we've made."),
      author: t('testimonial_3_author', 'Elena Rodriguez'),
      role: t('testimonial_3_role', 'Director of Sales'),
      company: t('testimonial_3_company', 'Urban Realty')
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="py-32 bg-transparent relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-brand-900/10 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Text Content */}
          <Reveal>
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <div className="h-px w-8 bg-brand-500"></div>
                 <span className="text-brand-400 font-bold tracking-[0.4em] uppercase text-[10px] font-mono">{t('about_comp_tag', 'Lead Architects')}</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-8 leading-[1.1]">
                {t('about_comp_title', 'System Architecture')} <br/>
                <span className="text-brand-500">{t('about_comp_title_accent', 'Built for Scale.')}</span>
              </h2>
              
              <div className="prose prose-lg prose-invert text-slate-300 mb-10 font-light">
                <p className="mb-4">
                  {t('about_comp_p1', "SKH isn't just a development team; we are your strategic engineering partners. We specialize in AI Orchestration and Custom Backend Architectures that turn business ideas into automated revenue streams.")}
                </p>
                <p>
                  {t('about_comp_p2', 'While others sell "websites", we deliver hardened digital infrastructure designed to dominate markets, protect data, and eliminate manual overhead.')}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                {[
                  t('about_feature_1', "Enterprise Dashboards"),
                  t('about_feature_2', "Bank-Grade Security"),
                  t('about_feature_3', "Automated Workflows"),
                  t('about_feature_4', "Scalable Infrastructure"),
                  t('about_feature_5', "24/7 System Monitoring"),
                  t('about_feature_6', "Data-Driven Architecture")
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 group">
                    <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/40 transition-colors">
                      <CheckCircle2 className="text-brand-400" size={14} />
                    </div>
                    <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-5 pt-8 border-t border-slate-800/50">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-brand-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src="https://files.catbox.moe/n3xbja.png" alt="SKH Global" className="w-14 h-14 object-cover rounded-xl brightness-110 relative z-10 shadow-lg" />
                 </div>
                 <div>
                   <p className="text-white font-bold font-display text-xl tracking-tight">{t('team_skh', 'The SKH Team')}</p>
                   <p className="text-xs text-slate-500 font-mono uppercase tracking-[0.3em] font-bold">{t('engineering_excellence', 'Engineering Excellence')}</p>
                 </div>
              </div>
            </div>
          </Reveal>

          {/* Testimonial Card */}
          <Reveal delay={200}>
            <div className="relative">
              {/* Decorative background card */}
              <div className="absolute top-4 -right-4 w-full h-full border border-slate-800/50 rounded-3xl bg-slate-900/20 -z-10 backdrop-blur-sm"></div>
              
              <div className="relative glass-panel rounded-3xl p-8 md:p-12 shadow-2xl border-white/5">
                <div className="absolute top-8 right-8 text-slate-700/50">
                   <Building2 size={48} strokeWidth={1} />
                </div>
                
                <Quote className="text-brand-500 mb-8" size={40} />
                
                <div className="min-h-[160px] flex flex-col justify-between">
                  <p className="text-xl md:text-2xl text-slate-200 font-light italic leading-relaxed font-display">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  
                  <div className="mt-8 flex items-end justify-between gap-4">
                    <div>
                      <h4 className="text-white font-bold text-lg font-display tracking-tight">{testimonials[activeTestimonial].author}</h4>
                      <p className="text-xs text-brand-400 font-mono font-bold uppercase tracking-widest">{testimonials[activeTestimonial].role}</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em]">{testimonials[activeTestimonial].company}</p>
                    </div>
                    
                    <div className="flex gap-2 mb-1">
                      {testimonials.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTestimonial(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            activeTestimonial === idx ? 'bg-brand-500 w-8' : 'bg-slate-700 w-2 hover:bg-slate-600'
                          }`}
                          aria-label={`Go to testimonial ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  );
};
