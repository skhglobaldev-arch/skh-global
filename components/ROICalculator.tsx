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
    // Simple estimate: a clearer booking and follow-up flow improves conversion rate.
    const newCR = currentCR + 3; 
    const currentRev = (traffic * currentCR) / 100 * avgValue;
    const potentialRev = (traffic * newCR) / 100 * avgValue;
    const revLift = potentialRev - currentRev;
    const savings = adminHours * hourlyRate; // Hours saved by automation
    const totalValue = revLift + savings;
    
    // Break even based on the entry package (£1,499).
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
            <h2 className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl">
              {t('roi_title_start', 'System')} <span className="bg-gradient-to-br from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">ROI</span> {t('roi_title_end', 'Planner')}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light text-lg">
              {t('roi_subtitle', 'Estimate how a better booking, payment and automation flow could affect your business.')}
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Inputs */}
          <Reveal delay={100}>
            <div className="glass-panel space-y-8 rounded-[2rem] border border-violet-400/12 bg-[#101827]/62 p-10">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="text-cyan-300" size={24} />
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">{t('business_variables', 'Business Variables')}</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('roi_visitors', 'Monthly Traffic')}</label>
                    <span className="font-mono font-bold text-cyan-200">{traffic.toLocaleString()} {t('visitors', 'Visitors')}</span>
                  </div>
                  <input 
                    type="range" min="100" max="10000" step="100" 
                    value={traffic} onChange={(e) => setTraffic(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#38D8FF]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('roi_cr_label', 'Current Booking Rate')}</label>
                    <span className="font-mono font-bold text-cyan-200">{currentCR}%</span>
                  </div>
                  <input 
                    type="range" min="0.5" max="10" step="0.5" 
                    value={currentCR} onChange={(e) => setCurrentCR(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#38D8FF]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('roi_value_label', 'Avg. Client Value')}</label>
                    <span className="font-mono font-bold text-cyan-200">£{avgValue}</span>
                  </div>
                  <input 
                    type="range" min="10" max="500" step="5" 
                    value={avgValue} onChange={(e) => setAvgValue(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#38D8FF]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('roi_hours_label', 'Monthly Admin Hours')}</label>
                    <span className="font-mono font-bold text-cyan-200">{adminHours} {t('hours_label', 'hours')}</span>
                  </div>
                  <input 
                    type="range" min="5" max="60" step="1" 
                    value={adminHours} onChange={(e) => setAdminHours(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#38D8FF]"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-start gap-4 text-slate-400 text-sm italic font-light">
                   <ShieldCheck className="shrink-0 text-cyan-300" size={18} />
                   <p>{t('calculation_disclaimer', 'These numbers are estimates. Real results depend on your offer, traffic, pricing and customer journey.')}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Results */}
          <Reveal delay={200}>
            <div className="grid gap-6">
              {/* Main Lift Card */}
              <div className="rounded-[2rem] bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] p-10 text-white shadow-[0_24px_80px_rgba(37,99,235,0.28)]">
                <div className="flex justify-between items-start mb-6">
                  <TrendingUp size={40} />
                  <span className="px-4 py-1 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{t('roi_lift_label', 'Monthly Revenue Lift')}</span>
                </div>
                <div className="text-6xl font-black tracking-tighter mb-2">
                  £{results.revenueLift.toLocaleString()}
                </div>
                <p className="font-medium opacity-80 leading-relaxed max-w-sm">
                  {t('revenue_lift_desc', 'Estimated improvement from a clearer booking, payment and follow-up flow.')}
                </p>
              </div>

              {/* Smaller Stat Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-800 bg-slate-900/40">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Zap size={16} className="text-brand-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{t('roi_savings_label', 'Admin Time Saved')}</span>
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
                  <div className="text-3xl font-black text-cyan-200">£{results.totalMonthlyValue.toLocaleString()}</div>
                </div>
                <button className="rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-8 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02]">
                  {t('roi_cta', 'Request Review')}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
