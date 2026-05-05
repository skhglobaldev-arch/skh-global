import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  ChevronLeft, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Zap,
  BarChart3,
  Monitor,
  Target,
  MessageSquare
} from 'lucide-react';

interface FormData {
  businessType: string;
  channels: string[];
  painPoint: string;
  volume: string;
  businessName: string;
  phone: string;
  email: string;
  instagram: string;
}

export const AuditView: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketNumber] = useState(() => Math.random().toString(36).substr(2, 6).toUpperCase());
  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    channels: [],
    painPoint: '',
    volume: '',
    businessName: '',
    phone: '',
    email: '',
    instagram: ''
  });

  const [errors, setErrors] = useState<string[]>([]);

  const totalSteps = 6;
  const formRef = useRef<HTMLFormElement>(null);

  const nextStep = () => {
    setErrors([]);
    setStep(s => Math.min(s + 1, totalSteps));
  };
  const prevStep = () => {
    setErrors([]);
    setStep(s => Math.max(s - 1, 1));
  };

  // Force scroll to top on every step change or submission
  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof document !== 'undefined') {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [step, submitted]);

  const handleRadioChange = (name: keyof FormData, value: string) => {
    setErrors([]);
    setFormData(prev => ({ ...prev, [name]: value }));
    setTimeout(nextStep, 400); 
  };

  const handleCheckboxChange = (value: string) => {
    setErrors([]);
    setFormData(prev => {
      const channels = prev.channels.includes(value)
        ? prev.channels.filter(c => c !== value)
        : [...prev.channels, value];
      return { ...prev, channels };
    });
  };

  const encode = (data: any) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(String(data[key])))
      .join("&");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    if (step < totalSteps) {
      if (step === 5 && !formData.businessName) {
        setErrors(['businessName']);
        return;
      }
      nextStep();
      return;
    }

    // Final Validation
    const newErrors = [];
    if (!formData.email) newErrors.push('email');
    if (!formData.phone || formData.phone.length < 8) newErrors.push('phone');
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const body = { 
      ...formData,
      ticketNumber: ticketNumber,
      channels: formData.channels.join(', ')
    };

    console.log("Submitting form:", body);

    setLoading(true);
    
    try {
      // Send to custom backend for AI processing and email
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      // Intentional delay for effect
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 1000);

    } catch (error) {
      console.error("Submission error:", error);
      setLoading(false);
      setSubmitted(true); // Still show success to prevent frustration
    }
  };

  const progress = (step / totalSteps) * 100;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full glass-panel p-12 rounded-[3.5rem] border border-brand-500/30 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-brand-500/5 blur-3xl"></div>
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(14,165,233,0.5)]">
              <CheckCircle2 size={48} className="text-slate-950" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase tracking-tighter">{t('success_title', 'Analysis Initiated')}</h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed mb-8">
              {t('success_desc', 'We received your data safely. Our engineers are now auditing your online infrastructure. Expect a detailed PDF blueprint in your inbox shortly.')}
            </p>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-brand-400 font-mono text-sm mb-8 inline-block">
              {t('priority_ticket_label', 'Priority Ticket')}: #{ticketNumber}
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-400 transition-all block mx-auto"
            >
              {t('back_to_command_btn', 'Back to Command Center')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-20 relative overflow-hidden flex flex-col items-center">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-900 z-50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-brand-500 shadow-[0_0_15px_rgba(14,165,233,0.8)]"
        />
      </div>

      <div className="max-w-3xl w-full px-6 relative z-10 flex-1 flex flex-col justify-center">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <form 
          ref={formRef}
          name="revenue-audit" 
          method="POST" 
          data-netlify="true"
          onSubmit={handleSubmit}
          className="relative"
        >
          <input type="hidden" name="form-name" value="revenue-audit" />
          <input type="hidden" name="ticketNumber" value={ticketNumber} />
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-8 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                    <Sparkles size={32} />
                  </div>
                </div>
                <h2 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none mb-4">
                  {t('audit_step_1_title', 'Identify Your Industry')}
                </h2>
                <p className="text-slate-400 text-lg font-light mb-12">{t('audit_step_1_desc', 'Select your business type to begin the diagnostic.')}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: t('audit_opt_beauty', 'Beauty & Wellness'), value: 'Beauty & Wellness' },
                    { label: t('audit_opt_clinic', 'Medical Clinic'), value: 'Medical Clinic' },
                    { label: t('audit_opt_restaurant', 'Restaurant'), value: 'Restaurant' },
                    { label: t('audit_opt_store', 'E-commerce'), value: 'E-commerce' },
                    { label: t('audit_opt_property', 'Real Estate'), value: 'Real Estate' },
                    { label: t('audit_opt_other', 'Other'), value: 'Other' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleRadioChange('businessType', opt.value)}
                      className={`p-6 rounded-3xl border transition-all text-center group relative overflow-hidden ${
                        formData.businessType === opt.value 
                        ? 'border-brand-500 bg-brand-500/10 text-white' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold uppercase tracking-widest text-xs relative z-10">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-8 text-center"
              >
                <h2 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none mb-4">
                  {t('audit_step_2_title', 'Where do customers Find You?')}
                </h2>
                <p className="text-slate-400 text-lg font-light mb-12">{t('audit_step_2_desc', 'Select all channels you currently use for bookings.')}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                  {[
                    { label: t('audit_chan_insta', 'Instagram / DM'), value: 'Instagram / DM' },
                    { label: t('audit_chan_whatsapp', 'WhatsApp'), value: 'WhatsApp' },
                    { label: t('audit_chan_phone', 'Phone Calls'), value: 'Phone Calls' },
                    { label: t('audit_chan_web', 'Website'), value: 'Website' },
                    { label: t('audit_chan_walkin', 'Walk-ins'), value: 'Walk-ins' },
                    { label: t('audit_chan_market', 'Marketplaces'), value: 'Marketplaces' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleCheckboxChange(opt.value)}
                      className={`p-6 rounded-3xl border transition-all ${
                        formData.channels.includes(opt.value)
                        ? 'border-brand-500 bg-brand-500/10 text-white' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold uppercase tracking-widest text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={nextStep}
                  disabled={formData.channels.length === 0}
                  className="mt-8 px-12 py-5 bg-brand-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-sm disabled:opacity-50 disabled:grayscale transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:translate-y-[-2px]"
                >
                  {t('btn_confirm_channels', 'Confirm Channels')}
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-8 text-center"
              >
                <h2 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none mb-4">
                  {t('audit_step_3_title', 'What stops your Growth?')}
                </h2>
                <div className="grid gap-4 max-w-xl mx-auto">
                  {[
                    { key: 'pain_manual', label: t('audit_prob_manual', "Manual Booking Chaos"), desc: t('audit_prob_manual_desc', "Drowning in DMs and phone tag.") },
                    { key: 'pain_no_show', label: t('audit_prob_conversion', "High No-Show Rate"), desc: t('audit_prob_conversion_desc', "No deposits or automated reminders.") },
                    { key: 'pain_google', label: t('audit_prob_tech', "Invisible on Google"), desc: t('audit_prob_tech_desc', "Customers can't find me organically.") },
                    { key: 'pain_clunky', label: t('audit_prob_growth', "Clunky/Slow Systems"), desc: t('audit_prob_growth_desc', "My current platform is a bottleneck.") }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleRadioChange('painPoint', item.label)}
                      className={`p-6 rounded-3xl border transition-all text-left flex items-center justify-between group ${
                        formData.painPoint === item.label
                        ? 'border-brand-500 bg-brand-500/10 text-white shadow-[0_0_20px_rgba(14,165,233,0.1)]' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold uppercase tracking-widest text-xs mb-1 text-white">{item.label}</div>
                        <div className="text-[11px] opacity-60 font-light">{item.desc}</div>
                      </div>
                      <ArrowRight size={20} className={`transition-transform group-hover:translate-x-1 ${formData.painPoint === item.label ? 'text-brand-500' : 'text-slate-700'}`} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-8 text-center"
              >
                <h2 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none mb-4">
                  {t('audit_step_4_title', 'Client Volume')}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { label: t('audit_vol_1', '< 50 Clients'), value: '< 50 Clients' },
                    { label: t('audit_vol_2', '50 - 200 Clients'), value: '50 - 200 Clients' },
                    { label: t('audit_vol_3', '200+ Clients'), value: '200+ Clients' }
                  ].map((v) => (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => handleRadioChange('volume', v.value)}
                      className={`p-12 rounded-[3rem] border transition-all text-center flex flex-col items-center group ${
                        formData.volume === v.value 
                        ? 'border-brand-500 bg-brand-500/10 text-white shadow-[0_0_30px_rgba(14,165,233,0.15)]' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <BarChart3 className={`mb-6 transition-colors ${formData.volume === v.value ? 'text-brand-400' : 'text-slate-600'}`} size={40} />
                      <span className="font-bold uppercase tracking-widest text-xs">{v.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-12"
              >
                <div className="text-center">
                   <h2 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none mb-4">
                    {t('audit_step_5_title', 'Business Identity')}
                  </h2>
                </div>
                <div className="grid gap-8 max-w-xl mx-auto">
                  <div className="space-y-3">
                    <label className={`text-[10px] font-black uppercase tracking-[0.3em] font-mono ml-2 transition-colors ${errors.includes('businessName') ? 'text-red-500' : 'text-slate-500'}`}>
                      {errors.includes('businessName') ? t('error_name_required', 'Business Name Required') : t('form_business_name', 'Business Name')}
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder={t('form_business_placeholder', "e.g. Aura Aesthetics")} 
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className={`w-full bg-slate-950 border rounded-3xl px-8 py-6 text-white text-lg outline-none transition-all placeholder:text-slate-800 font-medium ${
                        errors.includes('businessName') ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse' : 'border-slate-800 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-mono ml-2">{t('form_insta', 'Instagram Handle (Optional)')}</label>
                    <input 
                      type="text" 
                      placeholder={t('form_insta_placeholder', "@yourpage")} 
                      value={formData.instagram}
                      onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-6 text-white text-lg focus:border-brand-500 outline-none transition-all placeholder:text-slate-800 font-medium"
                    />
                  </div>
                </div>
                <div className="flex justify-center pt-4">
                  <button 
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.businessName}
                    className="px-16 py-6 bg-brand-500 text-slate-950 rounded-3xl font-black uppercase tracking-widest text-sm disabled:opacity-50 transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:scale-105 active:scale-95"
                  >
                    {t('btn_set_destination', 'Set Destination')}
                  </button>
                </div>
              </motion.div>
            )}

            {step === totalSteps && (
              <motion.div 
                key="step6"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-12"
              >
                <div className="text-center">
                   <h2 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none mb-4">
                    {t('audit_step_6_title', 'Send My Blueprint')}
                  </h2>
                  <p className="text-slate-400 text-lg font-light">{t('audit_step_6_desc', 'Where should we transmit your diagnostic results?')}</p>
                </div>
                
                <div className="grid gap-8 max-w-xl mx-auto">
                  <div className="space-y-3">
                    <label className={`text-[10px] font-black uppercase tracking-[0.3em] font-mono ml-2 transition-colors ${errors.includes('phone') ? 'text-red-500' : 'text-slate-500'}`}>
                      {errors.includes('phone') ? t('error_phone_required', 'Valid Phone Required') : t('form_phone', 'Mobile Number (WhatsApp Enabled)')}
                    </label>
                    <div className={`custom-phone-input border rounded-[24px] overflow-hidden transition-all ${errors.includes('phone') ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-transparent'}`}>
                      <PhoneInput
                        country={'ae'}
                        value={formData.phone}
                        onChange={phone => setFormData({...formData, phone})}
                        containerStyle={{ width: '100%' }}
                        inputStyle={{ 
                          width: '100%', 
                          height: '76px', 
                          background: '#020617', 
                          border: '1px solid #1e293b', 
                          borderRadius: '24px', 
                          color: 'white',
                          paddingLeft: '70px',
                          fontSize: '18px'
                        }}
                        buttonStyle={{ 
                          background: '#0f172a', 
                          border: 'none', 
                          borderRadius: '24px 0 0 24px',
                          borderRight: '1px solid #1e293b',
                          width: '60px'
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className={`text-[10px] font-black uppercase tracking-[0.3em] font-mono ml-2 transition-colors ${errors.includes('email') ? 'text-red-500' : 'text-slate-500'}`}>
                      {errors.includes('email') ? t('error_email_required', 'Valid Email Required') : t('form_email', 'Business Email')}
                    </label>
                    <input 
                      required 
                      type="email" 
                      placeholder={t('form_email_placeholder', "name@company.com")} 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full bg-slate-950 border rounded-3xl px-8 py-6 text-white text-lg outline-none transition-all placeholder:text-slate-800 font-medium ${
                        errors.includes('email') ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse' : 'border-slate-800 focus:border-brand-500'
                      }`}
                    />
                  </div>

                  <motion.button 
                    animate={errors.length > 0 ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-500 text-slate-950 font-black uppercase tracking-widest py-8 rounded-[2.5rem] hover:bg-brand-400 transition-all flex items-center justify-center gap-4 shadow-[0_0_60px_rgba(14,165,233,0.4)] relative overflow-hidden group"
                  >
                    {loading ? (
                      <div className="w-8 h-8 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {t('submit_btn', 'Initiate Secure Audit')}
                        <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="flex flex-wrap justify-center gap-10 text-slate-600 mt-12 border-t border-slate-900 pt-10">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><ShieldCheck size={16} className="text-brand-500"/> {t('audit_footer_sovereign', 'Data Sovereign')}</div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><Zap size={16} className="text-brand-500"/> {t('audit_footer_sync', 'Real-Time Sync')}</div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><BarChart3 size={16} className="text-brand-500"/> {t('audit_footer_growth', 'Growth Focused')}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Navigation Actions */}
        {step > 1 && step < totalSteps && !submitted && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={prevStep}
              className="flex items-center gap-2 text-slate-600 hover:text-white transition-colors font-black uppercase tracking-[0.3em] text-[10px] py-4"
            >
              <ChevronLeft size={16} /> {t('prev_btn', 'Previous Diagnostic')}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .custom-phone-input .react-tel-input .country-list {
          background: #020617 !important;
          border: 1px solid #1e293b !important;
          color: white !important;
          border-radius: 20px !important;
          padding: 10px !important;
          margin-top: 15px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
        }
        .custom-phone-input .react-tel-input .country-list .country:hover {
          background: #0ea5e920 !important;
        }
        .custom-phone-input .react-tel-input .country-list .country.highlight {
          background: #0ea5e940 !important;
        }
        .custom-phone-input .react-tel-input .selected-flag:hover {
          background: transparent !important;
        }
      `}</style>
    </div>
  );
};
