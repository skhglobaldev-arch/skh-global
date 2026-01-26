
import React from 'react';
import { Globe, ArrowRight, Monitor, Zap, Shield, Sparkles, Settings } from 'lucide-react';

interface AppPreviewProps {
  data: {
    appName?: string;
    primaryColor?: string;
    fontStyle?: 'serif' | 'sans' | 'display';
    layoutMode?: 'dark' | 'light';
    hero?: {
      title?: string;
      subtitle?: string;
      imageSearch?: string;
    };
    sections?: any[];
    navigation?: string[];
  };
}

export const AppPreview: React.FC<AppPreviewProps> = ({ data }) => {
  // Safety check for root data object
  if (!data) return (
    <div className="p-20 text-center text-slate-500 italic">
      Waiting for neural synthesis results...
    </div>
  );

  // Robust fallbacks for all properties
  const appName = data.appName || 'Neural Link';
  const primaryColor = data.primaryColor || '#0ea5e9';
  const fontStyle = data.fontStyle || 'display';
  const isDark = data.layoutMode !== 'light'; // Default to dark
  const hero = data.hero || {
    title: 'Autonomous Architecture',
    subtitle: 'Connecting vision to scalable systems.',
    imageSearch: 'tech architecture'
  };
  const sections = data.sections || [];
  const navigation = data.navigation || ['Home', 'About', 'Systems'];

  const fontClass = fontStyle === 'serif' ? 'font-serif' : fontStyle === 'display' ? 'font-display' : 'font-sans';

  return (
    <div className={`w-full max-w-6xl mx-auto rounded-[3.5rem] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.7)] border border-white/10 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} ${fontClass} animate-in fade-in zoom-in-95 duration-1000 group/browser`}>
      
      {/* Premium Browser Chrome Shell */}
      <div className={`${isDark ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-200'} border-b px-10 py-5 flex items-center justify-between`}>
        <div className="flex gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-inner"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-inner"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-inner"></div>
        </div>
        <div className={`flex items-center gap-3 ${isDark ? 'bg-black/40 text-slate-400' : 'bg-white text-slate-400 shadow-sm'} border border-white/10 px-10 py-2.5 rounded-full text-[11px] font-mono w-1/3 justify-center shadow-inner`}>
          <Globe size={12} className="opacity-50" /> {appName.toLowerCase().replace(/\s+/g, '-')}.skh.dev
        </div>
        <div className="flex gap-5 opacity-40">
           <Settings size={16} />
           <Monitor size={16} />
        </div>
      </div>

      {/* Modern Navigation */}
      <header className={`px-12 py-12 flex items-center justify-between sticky top-0 z-50 transition-all ${isDark ? 'bg-slate-950/80 backdrop-blur-3xl' : 'bg-white/80 backdrop-blur-3xl'}`}>
        <div className="flex items-center gap-4 group cursor-pointer">
           <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl transition-transform group-hover:rotate-12" style={{ backgroundColor: primaryColor }}>
              {appName[0]}
           </div>
           <span className="font-black text-2xl tracking-tighter uppercase">{appName}</span>
        </div>
        <nav className="hidden lg:flex gap-14 text-[13px] font-black uppercase tracking-[0.25em] opacity-60">
          {navigation.map((item, i) => (
            <a key={i} href="#" className="hover:opacity-100 transition-all relative group">
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-1 rounded-full bg-current group-hover:w-full transition-all duration-300" style={{ backgroundColor: primaryColor }}></span>
            </a>
          ))}
        </nav>
        <button className="px-10 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
          Initialize <ArrowRight size={18} />
        </button>
      </header>

      {/* Hero: High-Impact Entrance */}
      <div className="relative h-[800px] overflow-hidden group">
        <div className="absolute inset-0 bg-slate-950">
          <img 
            src={`https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600&h=1000&sig=${Math.random()}`} 
            className="w-full h-full object-cover opacity-60 transition-transform duration-[12s] group-hover:scale-110" 
            alt="Main Visual" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-center px-16 md:px-24">
          <div className="max-w-5xl space-y-12">
            <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-xl">
               <Sparkles size={18} style={{ color: primaryColor }} />
               <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-80">Sync Complete</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-left-10 duration-1000">
              {hero.title || 'Synthesis Error'}
            </h1>
            <p className="text-2xl md:text-4xl font-light leading-relaxed max-w-3xl opacity-90 drop-shadow-lg">
              {hero.subtitle || 'System architecture generated with minor data losses.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-10 pt-8">
              <button className="px-14 py-7 rounded-[2rem] text-xl font-black text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-2 flex items-center justify-center gap-4" style={{ backgroundColor: primaryColor }}>
                Execute <Zap size={24} />
              </button>
              <button className="px-14 py-7 rounded-[2rem] text-xl font-black border border-white/20 bg-white/5 backdrop-blur-2xl hover:bg-white/10 transition-all text-white">
                Blueprint
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Content Sections */}
      <div className={isDark ? 'bg-slate-950' : 'bg-slate-50'}>
        {sections.map((section, idx) => {
          if (section.type === 'bento-grid') {
            return (
              <div key={idx} className="py-48 px-16 md:px-24">
                <div className="mb-28 flex flex-col md:flex-row md:items-end justify-between gap-10">
                  <div className="max-w-3xl">
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40 block mb-8">Infrastructure_Overview</span>
                    <h2 className="text-7xl font-black tracking-tighter leading-none">{section.title || 'Core Matrix'}</h2>
                  </div>
                  <div className="w-40 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 auto-rows-[350px]">
                  {(section.items || []).map((item: any, i: number) => (
                    <div 
                      key={i} 
                      className={`relative rounded-[3.5rem] overflow-hidden group/card shadow-2xl border border-white/5 transition-all hover:-translate-y-4 ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}
                    >
                      <img src={`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&h=600&sig=${i}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110 opacity-70" alt="Bento item" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-14 flex flex-col justify-end">
                        <h4 className="text-4xl font-black text-white mb-5 leading-tight">{item.title}</h4>
                        <p className="text-lg text-slate-300 font-medium opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-y-6 group-hover/card:translate-y-0">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (section.type === 'pricing') {
            return (
              <div key={idx} className="py-48 px-16">
                 <div className="text-center mb-32">
                   <h2 className="text-8xl font-black tracking-tighter mb-8">{section.title || 'Engagement'}</h2>
                   <p className="text-2xl opacity-40 font-light tracking-wide">Investment levels for operational scaling.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {(section.plans || []).map((plan: any, i: number) => (
                      <div key={i} className={`p-20 rounded-[4.5rem] border-2 transition-all hover:scale-[1.03] ${plan.popular ? 'bg-white text-slate-950 border-white shadow-[0_60px_100px_rgba(255,255,255,0.05)]' : 'bg-slate-900/40 text-white border-white/10'}`}>
                        {plan.popular && <span className="inline-block px-8 py-2.5 bg-brand-500 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full mb-12 shadow-2xl">Recommended</span>}
                        <h3 className="text-4xl font-black mb-6 tracking-tight">{plan.name}</h3>
                        <div className="text-8xl font-black mb-16 tracking-tighter">{plan.price}<span className="text-xl font-medium opacity-30">/unit</span></div>
                        <ul className="space-y-8 mb-20">
                          {(plan.features || []).map((f: string) => (
                            <li key={f} className="flex items-center gap-5 text-xl font-bold">
                              <Shield size={26} className={plan.popular ? 'text-brand-500' : 'text-slate-500'} /> {f}
                            </li>
                          ))}
                        </ul>
                        <button className={`w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[13px] transition-all shadow-2xl ${plan.popular ? 'bg-slate-950 text-white hover:bg-black' : 'bg-white text-slate-950 hover:bg-slate-100'}`}>
                          Connect
                        </button>
                      </div>
                    ))}
                 </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* High-Impact Industry Footer */}
      <footer className={`${isDark ? 'bg-slate-900' : 'bg-slate-100'} py-40 px-24 border-t border-white/5`}>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-24">
           <div className="space-y-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-5">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center font-black text-2xl">
                    {appName[0]}
                 </div>
                 <span className="font-black text-4xl tracking-tighter uppercase">{appName}</span>
              </div>
              <p className="text-xl opacity-30 font-medium tracking-wide">© 2024 {appName.toUpperCase()} / SKH.GLOBAL ARCHITECTURE</p>
           </div>
           <div className="flex flex-wrap justify-center gap-16 text-[12px] font-black uppercase tracking-[0.3em] opacity-40">
             <a href="#" className="hover:opacity-100 transition-opacity">Nexus</a>
             <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
             <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
             <a href="#" className="hover:opacity-100 transition-opacity">Lead_Arch</a>
           </div>
        </div>
      </footer>
    </div>
  );
};
