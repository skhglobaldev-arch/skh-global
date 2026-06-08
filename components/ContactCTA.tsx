import React from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';
import { useTranslation } from 'react-i18next';

export const ContactCTA: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [ticketNumber] = React.useState(() => Math.random().toString(36).substr(2, 6).toUpperCase());
  const [formData, setFormData] = React.useState({
    fullName: '',
    company: '',
    email: '',
    investment: 'not-sure',
    systemFocus: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ticketNumber,
          currentLanguage: i18n.language,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Server responded with ${response.status}`);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-panel mx-auto max-w-xl rounded-[2rem] border border-cyan-300/20 bg-[#101827]/80 p-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] shadow-[0_20px_60px_rgba(37,99,235,0.25)]">
          <Mail className="text-white" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-white">{t('success_title', 'Request Received')}</h3>
        <p className="mb-6 font-light text-slate-400">{t('success_desc', 'Thank you. Our specialists will review your needs and contact you soon.')}</p>
        <div className="inline-block rounded-xl border border-cyan-300/12 bg-[#050713]/70 px-4 py-2 text-xs font-semibold text-cyan-200">
          {t('priority_ticket_label', 'Reference Number')}: #{ticketNumber}
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-left">
       <div className="max-w-4xl mx-auto relative z-10">
         <Reveal>
           <div className="text-center">
             <div className="inline-flex items-center gap-2 text-brand-400 mb-6 font-mono">
                <Sparkles size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t('cta_secure_slot', 'Start Your Project')}</span>
             </div>
             
             <h2 className="mb-6 text-3xl font-black tracking-tight text-white md:text-5xl">
               {t('cta_audit_inquiry', 'Free Consultation Request')}
             </h2>
             <p className="text-base text-slate-400 mb-12 font-light max-w-xl mx-auto leading-relaxed">
               {t('cta_audit_desc', 'Share a few details about your business and the result you would like to achieve.')}
             </p>
           </div>
         </Reveal>
         
         <Reveal delay={200}>
            <div className="glass-panel mx-auto max-w-xl rounded-[2rem] border border-violet-400/12 bg-[#050713]/72 p-8 shadow-2xl md:p-10">
               <form
                 onSubmit={handleSubmit}
                 className="space-y-6 text-left"
               >
                  <input type="hidden" name="ticketNumber" value={ticketNumber} />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono">{t('form_full_name', 'Full Name')}</label>
                        <input 
                          required
                          name="fullName"
                          type="text" 
                          placeholder="John Doe" 
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-700 focus:border-brand-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono">{t('form_company', 'Business Name')}</label>
                        <input 
                          required
                          name="company"
                          type="text" 
                          placeholder="Acme Inc." 
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-700 focus:border-brand-500 focus:outline-none transition-all"
                        />
                    </div>
                  </div>

                  <div>
                     <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono">{t('form_work_email', 'Work Email')}</label>
                     <input 
                       required
                       name="email"
                       type="email" 
                       placeholder="name@company.com" 
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                       className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-700 focus:border-brand-500 focus:outline-none transition-all"
                     />
                  </div>

                  <div>
                     <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono">{t('form_investment', 'Approximate Budget')}</label>
                     <div className="relative">
                        <select 
                          name="investment"
                          value={formData.investment}
                          onChange={(e) => setFormData({...formData, investment: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-brand-500 focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                           <option value="under-750">{t('form_investment_opt1', 'Under £750')}</option>
                           <option value="750-1500">{t('form_investment_opt2', '£750 to £1,500')}</option>
                           <option value="1500-3000">{t('form_investment_opt3', '£1,500 to £3,000')}</option>
                           <option value="3000-plus">{t('form_investment_opt4', '£3,000+')}</option>
                           <option value="not-sure">{t('form_investment_opt5', 'Not sure yet')}</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                           <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono text-left">{t('form_system_focus', 'What do you need?')}</label>
                     <textarea 
                       name="systemFocus"
                       value={formData.systemFocus}
                       onChange={(e) => setFormData({...formData, systemFocus: e.target.value})}
                       rows={3} 
                       placeholder={t('form_bottleneck_placeholder', "Tell us about the bottleneck you want to solve...")} 
                       className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-700 focus:border-brand-500 focus:outline-none transition-all resize-none"
                     ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] py-5 text-xs font-black uppercase tracking-widest text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)] transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Mail size={18} />
                        {t('form_submit_review', 'Submit for Review')}
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-600">{t('form_response_time', 'Our specialists will contact you soon.')}</p>
               </form>
            </div>
         </Reveal>
       </div>
    </div>
  );
};
