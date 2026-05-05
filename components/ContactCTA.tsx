import React from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';
import { useTranslation } from 'react-i18next';

export const ContactCTA: React.FC = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [ticketNumber] = React.useState(() => Math.random().toString(36).substr(2, 6).toUpperCase());
  const [formData, setFormData] = React.useState({
    fullName: '',
    company: '',
    email: '',
    investment: '1500-3500',
    systemFocus: ''
  });

  const encode = (data: any) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(String(data[key])))
      .join("&");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ 
          "form-name": "contact-inquiry", 
          ...formData,
          ticketNumber 
        })
      });

      // Send to custom backend for AI processing and email
      try {
        const contactUrl = "/api/contact";
        console.log(`[CONTACT] Submitting to: ${window.location.origin}${contactUrl}`);
        
        await fetch(contactUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            ...formData,
            ticketNumber 
          })
        });
      } catch (backendError) {
        console.error("Backend error:", backendError);
      }

      setLoading(false);
      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      setLoading(false);
      setSubmitted(true); 
    }
  };

  if (submitted) {
    return (
      <div className="glass-panel p-12 rounded-[2.5rem] max-w-xl mx-auto border border-brand-500/30 text-center bg-slate-950/80">
        <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(14,165,233,0.4)]">
          <Mail className="text-slate-950" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">{t('success_title', 'Inquiry Received')}</h3>
        <p className="text-slate-400 mb-6 font-light">{t('success_desc', 'Your high-priority inquiry has been transmitted to our systems.')}</p>
        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-brand-400 font-mono text-xs inline-block">
          {t('priority_ticket_label', 'Priority Ticket')}: #{ticketNumber}
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
                <span className="font-bold tracking-widest uppercase text-[10px]">{t('cta_secure_slot', 'Secure Your Slot')}</span>
             </div>
             
             <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6 uppercase tracking-tighter">
               {t('cta_audit_inquiry', 'Audit Inquiry')}
             </h2>
             <p className="text-base text-slate-400 mb-12 font-light max-w-xl mx-auto leading-relaxed">
               {t('cta_audit_desc', 'Our systems are custom-engineered for each client. Please provide brief details for your architectural review.')}
             </p>
           </div>
         </Reveal>
         
         <Reveal delay={200}>
            <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] max-w-xl mx-auto border border-slate-800 shadow-2xl bg-slate-950/80">
               <form 
                 name="contact-inquiry"
                 data-netlify="true"
                 onSubmit={handleSubmit}
                 className="space-y-6 text-left"
               >
                  <input type="hidden" name="form-name" value="contact-inquiry" />
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
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono">{t('form_company', 'Company')}</label>
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
                     <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono">{t('form_investment', 'Estimated Investment')}</label>
                     <div className="relative">
                        <select 
                          name="investment"
                          value={formData.investment}
                          onChange={(e) => setFormData({...formData, investment: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-brand-500 focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                           <option value="1500-3500">{t('form_investment_opt1', '£1,499 - £3,499 (Launchpad)')}</option>
                           <option value="3500-7500">{t('form_investment_opt2', '£3,499 - £7,499 (Growth Engine)')}</option>
                           <option value="7500+">{t('form_investment_opt3', '£7,500+ (Custom Core)')}</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                           <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 font-mono text-left">{t('form_system_focus', 'System Focus')}</label>
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
                    className="w-full bg-brand-500 text-slate-950 font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-brand-400 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:opacity-50"
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
                  <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">{t('form_response_time', 'Typical Architect Response: 12-24 Hours')}</p>
               </form>
            </div>
         </Reveal>
       </div>
    </div>
  );
};
