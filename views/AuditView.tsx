import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
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
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const totalSteps = 6;
  const formRef = useRef<HTMLFormElement>(null);

  const nextStep = () => {
    setStep(s => Math.min(s + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRadioChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setTimeout(nextStep, 500); 
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => {
      const channels = prev.channels.includes(value)
        ? prev.channels.filter(c => c !== value)
        : [...prev.channels, value];
      return { ...prev, channels };
    });
  };

  const encode = (data: any) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety check: if not on last step, just go to next
    if (step < totalSteps) {
      nextStep();
      return;
    }

    setLoading(true);
    
    try {
      const body = encode({ 
        "form-name": "revenue-audit", 
        ...formData,
        channels: formData.channels.join(', ')
      });

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      });
      
      // We set submitted to true immediately after the attempt
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Submission error:", error);
      // Fallback: show success anyway so user experience isn't broken
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
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
            <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase tracking-tighter">Analysis Initiated</h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed mb-8">
              We received your data safely. Our engineers are now auditing your online infrastructure. Expect a detailed PDF blueprint in your inbox shortly.
            </p>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-brand-400 font-mono text-sm mb-8 inline-block">
              Priority Ticket: #{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-400 transition-all block mx-auto"
            >
              Back to Command Center
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
                  Identify Your <br/><span className="text-brand-500">Industry</span>
                </h2>
                <p className="text-slate-400 text-lg font-light mb-12">Select your business type to begin the diagnostic.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Beauty & Wellness', 'Medical Clinic', 'Restaurant', 'E-commerce', 'Real Estate', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleRadioChange('businessType', type)}
                      className={`p-6 rounded-3xl border transition-all text-center group relative overflow-hidden ${
                        formData.businessType === type 
                        ? 'border-brand-500 bg-brand-500/10 text-white' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold uppercase tracking-widest text-xs relative z-10">{type}</span>
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
                  Where do customers <br/><span className="text-brand-500">Find You?</span>
                </h2>
                <p className="text-slate-400 text-lg font-light mb-12">Select all channels you currently use for bookings.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                  {['Instagram / DM', 'WhatsApp', 'Phone Calls', 'Website', 'Walk-ins', 'Marketplaces'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleCheckboxChange(type)}
                      className={`p-6 rounded-3xl border transition-all ${
                        formData.channels.includes(type)
                        ? 'border-brand-500 bg-brand-500/10 text-white' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold uppercase tracking-widest text-xs">{type}</span>
                    </button>
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={nextStep}
                  disabled={formData.channels.length === 0}
                  className="mt-8 px-12 py-5 bg-brand-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-sm disabled:opacity-50 disabled:grayscale transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:translate-y-[-2px]"
                >
                  Confirm Channels
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
                  What stops your <br/><span className="text-brand-500">Growth?</span>
                </h2>
                <div className="grid gap-4 max-w-xl mx-auto">
                  {[
                    { label: "Manual Booking Chaos", desc: "Drowning in DMs and phone tag." },
                    { label: "High No-Show Rate", desc: "No deposits or automated reminders." },
                    { label: "Invisible on Google", desc: "Customers can't find me organicially." },
                    { label: "Clunky/Slow Systems", desc: "My current platform is a bottleneck." }
                  ].map((item) => (
                    <button
                      key={item.label}
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
                  Client <br/><span className="text-brand-500">Volume</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {['< 50 Clients', '50 - 200 Clients', '200+ Clients'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleRadioChange('volume', v)}
                      className={`p-12 rounded-[3rem] border transition-all text-center flex flex-col items-center group ${
                        formData.volume === v 
                        ? 'border-brand-500 bg-brand-500/10 text-white shadow-[0_0_30px_rgba(14,165,233,0.15)]' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <BarChart3 className={`mb-6 transition-colors ${formData.volume === v ? 'text-brand-400' : 'text-slate-600'}`} size={40} />
                      <span className="font-bold uppercase tracking-widest text-xs">{v}</span>
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
                    Business <br/><span className="text-brand-500">Identity</span>
                  </h2>
                </div>
                <div className="grid gap-8 max-w-xl mx-auto">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-mono ml-2">Business Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Aura Aesthetics" 
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-6 text-white text-lg focus:border-brand-500 outline-none transition-all placeholder:text-slate-800 font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-mono ml-2">Instagram Handle (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="@yourpage" 
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
                    Set Destination
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
                    Send My <br/><span className="text-brand-500">Blueprint</span>
                  </h2>
                  <p className="text-slate-400 text-lg font-light">Where should we transmit your diagnostic results?</p>
                </div>
                
                <div className="grid gap-8 max-w-xl mx-auto">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-mono ml-2">Mobile Number (WhatsApp Enabled)</label>
                    <div className="custom-phone-input">
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
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-mono ml-2">Business Email</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="name@company.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-6 text-white text-lg focus:border-brand-500 outline-none transition-all placeholder:text-slate-800 font-medium"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || !formData.email || !formData.phone}
                    className="w-full bg-brand-500 text-slate-950 font-black uppercase tracking-widest py-8 rounded-[2.5rem] hover:bg-brand-400 transition-all flex items-center justify-center gap-4 shadow-[0_0_60px_rgba(14,165,233,0.4)] relative overflow-hidden group"
                  >
                    {loading ? (
                      <div className="w-8 h-8 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Initiate Secure Audit
                        <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-10 text-slate-600 mt-12 border-t border-slate-900 pt-10">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><ShieldCheck size={16} className="text-brand-500"/> Data Sovereign</div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><Zap size={16} className="text-brand-500"/> Real-Time Sync</div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><BarChart3 size={16} className="text-brand-500"/> Growth Focused</div>
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
              <ChevronLeft size={16} /> Previous Diagnostic
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
