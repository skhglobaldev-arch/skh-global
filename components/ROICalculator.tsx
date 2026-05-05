import React, { useState, useEffect } from 'react';
import { Reveal } from './Reveal';
import { Calculator, TrendingUp, Clock, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ROICalculator: React.FC = () => {
  const { t } = useTranslation();
  const [traffic, setTraffic] = useState<number>(1000);
  const [currentCR, setCurrentCR] = useState<number>(2);
  const [avgValue, setAvgValue] = useState<number>(50);
  const [adminHours, setAdminHours] = useState<number>(20);
  const [hourlyRate, setHourlyRate] = useState<number>(25);

  const [results, setResults] = useState({
    currentRevenue: 0,
    potentialRevenue: 0,
    revenueLift: 0,
    adminSavings: 0,
    totalMonthlyValue: 0,
    breakEvenDays: 0
  });

  useEffect(() => {
    // We assume the AI Growth Engine boosts CR to at least 5% (conservative)
    const newCR = currentCR + 3; 
    const currentRev = (traffic * currentCR) / 100 * avgValue;
    const potentialRev = (traffic * newCR) / 100 * avgValue;
    const revLift = potentialRev - currentRev;
    const savings = adminHours * hourlyRate; // Hours saved by automation
    const totalValue = revLift + savings;
    
    // Break even based on the 'AI Launchpad' package (£1,499)
    const packageCost = 1499;
    const days = totalValue > 0 ? (packageCost / (totalValue / 30)) : 0;

    setResults({
      currentRevenue: currentRev,
      potentialRevenue: potentialRev,
      revenueLift: revLift,
      adminSavings: savings,
      totalMonthlyValue: totalValue,
      breakEvenDays: Math.ceil(days)
    });
  }, [traffic, currentCR, avgValue, adminHours, hourlyRate]);

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-500/5 blur-[120px] rounded-full -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <Reveal>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter mb-6">
              {t('roi_title_start', 'The')} <span className="text-brand-400">ROI</span> {t('roi_title_end', 'Architect')}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light text-lg">
              {t('roi_subtitle', 'Stop looking at a website as an expense. Calculate the exact revenue lift our AI systems generate for your specific business model.')}
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Inputs */}
          <Reveal delay={100}>
            <div className="glass-panel p-10 rounded-[3rem] border border-slate-800 bg-slate-950/50 space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="text-brand-400" size={24} />
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">{t('business_variables', 'Business Variables')}</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('roi_visitors', 'Monthly Traffic')}</label>
                    <span className="text-brand-400 font-mono font-bold">{traffic.toLocaleString()} {t('visitors', 'Visitors')}</span>
                  </div>
                  <input 
                    type="range" min="100" max="10000" step="100" 
                    value={traffic} onChange={(e) => setTraffic(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('roi_cr_label', 'Current Booking Rate')}</label>
                    <span className="text-brand-400 font-mono font-bold">{currentCR}%</span>
                  </div>
                  <input 
                    type="range" min="0.5" max="10" step="0.5" 
                    value={currentCR} onChange={(e) => setCurrentCR(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('roi_value_label', 'Avg. Client Value')}</label>
                    <span className="text-brand-400 font-mono font-bold">£{avgValue}</span>
                  </div>
                  <input 
                    type="range" min="10" max="500" step="5" 
                    value={avgValue} onChange={(e) => setAvgValue(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('roi_hours_label', 'Monthly Admin Hours')}</label>
                    <span className="text-brand-400 font-mono font-bold">{adminHours} {t('hours_label', 'hours')}</span>
                  </div>
                  <input 
                    type="range" min="5" max="60" step="1" 
                    value={adminHours} onChange={(e) => setAdminHours(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-start gap-4 text-slate-400 text-sm italic font-light">
                   <ShieldCheck className="text-brand-500 shrink-0" size={18} />
                   <p>{t('calculation_disclaimer', 'Calculations based on real-world data from our active AI implementations. Every business varies, but the logic remains: ownership beats rental.')}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Results */}
          <Reveal delay={200}>
            <div className="grid gap-6">
              {/* Main Lift Card */}
              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-brand-500 to-brand-700 text-slate-950 shadow-[0_0_50px_rgba(14,165,233,0.3)]">
                <div className="flex justify-between items-start mb-6">
                  <TrendingUp size={40} />
                  <span className="px-4 py-1 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{t('roi_lift_label', 'Monthly Revenue Lift')}</span>
                </div>
                <div className="text-6xl font-black tracking-tighter mb-2">
                  £{results.revenueLift.toLocaleString()}
                </div>
                <p className="font-medium opacity-80 leading-relaxed max-w-sm">
                  {t('revenue_lift_desc', 'Estimated growth by upgrading from a static template to an AI-orchestrated revenue engine.')}
                </p>
              </div>

              {/* Smaller Stat Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-800 bg-slate-900/40">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Zap size={16} className="text-brand-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{t('roi_savings_label', 'Efficiency Bonus')}</span>
                  </div>
                  <div className="text-2xl font-black text-white">£{results.adminSavings}</div>
                  <p className="text-xs text-slate-500 mt-1 font-light italic">{t('admin_savings_desc', 'Saved in manual labor / month')}</p>
                </div>

                <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-800 bg-slate-900/40">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Clock size={16} className="text-brand-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{t('roi_payback_label', 'Investment Payback')}</span>
                  </div>
                  <div className="text-2xl font-black text-white">{results.breakEvenDays} {t('days_label', 'Days')}</div>
                  <p className="text-xs text-slate-500 mt-1 font-light italic">{t('break_even_desc', 'Est. time to break even')}</p>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] border border-slate-800 bg-slate-950/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('total_value_label', 'Total Monthly Competitive Edge')}</div>
                  <div className="text-3xl font-black text-brand-400">£{results.totalMonthlyValue.toLocaleString()}</div>
                </div>
                <button className="px-8 py-3 bg-white text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-brand-400 hover:text-white transition-all">
                  {t('roi_cta', 'Claim This ROI')}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
