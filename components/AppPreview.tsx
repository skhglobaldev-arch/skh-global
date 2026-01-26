
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
  if (!data) return (
    <div className="p-20 text-center text-slate-500 italic">
      Waiting for neural synthesis results...
    </div>
  );

  const appName = String(data.appName || 'Neural Link');
  const primaryColor = String(data.primaryColor || '#0ea5e9');
  const fontStyle = data.fontStyle || 'display';
  const isDark = data.layoutMode !== 'light';
  const hero = data.hero || {
    title: 'Autonomous Architecture',
    subtitle: 'Connecting vision to scalable systems.',
    imageSearch: 'tech architecture'
  };
  const sections = data.sections || [];
  const navigation = data.navigation || ['Home', 'About', 'Systems'];

  const fontClass = fontStyle === 'serif' ? 'font-serif' : fontStyle === 'display' ? 'font-display' : 'font-sans';
  const urlSafeName = appName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div className={`w-full max-w-6xl mx-auto rounded-[3.5rem] overflow-hidden shadow-[0_80px_160px_rgba(0,0,0,0.8)] border border-white/10 ${isDark ? 'bg-[#020617] text-white' : 'bg-white text-slate-900'} ${fontClass} animate-in fade-in zoom-in-95 duration-1000 group/browser relative`}>
      
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-brand-500/5 blur-[120px] pointer-events-none -z-10"></div>

      {/* Premium Browser Chrome Shell */}
      <div className={`${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'} border-b px-10 py-5 flex items-center justify-between backdrop-blur-md`}>
        <div className="flex gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-inner"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-inner"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-inner"></div>
        </div>
        <div className={`flex items-center gap-3 ${isDark ? 'bg-black/40 text-slate-400' : 'bg-white text-slate-400 shadow-sm'} border border-white/10 px-10 py-2.5 rounded-full text-[10px] font-mono w-1/3 justify-center shadow-inner tracking-widest`}>
          <Globe size={10} className="opacity-50" /> {urlSafeName || 'app'}.skh.global
        </div>
        <div className="flex gap-5 opacity-40">
           <Settings size={14} />
           <Monitor size={14} />
        </div>
      </div>

      {/* Modern Navigation */}
      <header className={`px-12 py-10 flex items-center justify-between sticky top-0 z-50 transition-all ${isDark ? 'bg-[#020617]/80 backdrop-blur-3xl' : 'bg-white/80 backdrop-blur-3xl'}`}>
        <div className="flex items-center gap-4 group cursor-pointer">
           <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-2xl transition-transform group-hover:rotate-12" style={{ backgroundColor: primaryColor }}>
              {appName[0]}
           </div>
           <span className="font-black text-xl tracking-tighter uppercase">{appName}</span>
        </div>
        <nav className="hidden lg:flex gap-12 text-[11px] font-black uppercase tracking-[0.3em] opacity-50">
          {navigation.map((item, i) => (
            <a key={i} href="#" className="hover:opacity-100 transition-all relative group py-2">
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full" style={{ backgroundColor: primaryColor }}></span>
            </a>
          ))}
        </nav>
        <button className="px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2" style={{ backgroundColor: primaryColor }}>
          Initialize <ArrowRight size={14} />
        </button>
      </header>

      {/* Hero Section */}
      <div className="relative h-[750px] overflow-hidden group">
        <div className="absolute inset-0 bg-slate-950">
          <img 
            src={`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600&h=1000&sig=${Math.random()}`} 
            className="w-full h-full object-cover opacity-40 transition-transform duration-[15s] group-hover:scale-110" 
            alt="Hero Visual" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-16 md:px-24">
          <div className="max-w-4xl space-y-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl">
               <Sparkles size={16} style={{ color: primaryColor }} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Architectural Protocol v4.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter animate-in slide-in-from-bottom-10 duration-1000">
              {hero.title || 'Nexus Synthesis'}
            </h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed max-w-2xl opacity-70">
              {hero.subtitle || 'Automating your business vision through high-performance neural architecture.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-8 pt-6">
              <button className="px-12 py-6 rounded-2xl text-lg font-black text-white shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3" style={{ backgroundColor: primaryColor }}>
                Execute Build <Zap size={22} />
              </button>
              <button className="px-12 py-6 rounded-2xl text-lg font-black border border-white/10 bg-white/5 backdrop-blur-2xl hover:bg-white/10 transition-all text-white">
                View Blueprint
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className={isDark ? 'bg-[#020617]' : 'bg-slate-50'}>
        {sections.map((section, idx) => {
          if (section.type === 'bento-grid') {
            return (
              <div key={idx} className="py-40 px-16 md:px-24">
                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
                  <div className="max-w-2xl">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 block mb-6">System_Matrix</span>
                    <h2 className="text-6xl font-black tracking-tighter leading-none">{section.title || 'Operational Stack'}</h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-[320px]">
                  {(section.items || []).map((item: any, i: number) => (
                    <div 
                      key={i} 
                      className={`relative rounded-[2.5rem] overflow-hidden group/card shadow-2xl border border-white/5 transition-all hover:border-white/20 ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}
                    >
                      <img src={`https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800&h=600&sig=${i+10}`} className="absolute inset-0 w-full h-full object-cover opacity-30 transition-transform duration-1000 group-hover/card:scale-105" alt="Feature" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent p-12 flex flex-col justify-end">
                        <h4 className="text-3xl font-black text-white mb-4">{item.title}</h4>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (section.type === 'pricing') {
            return (
              <div key={idx} className="py-40 px-16 bg-white/5">
                 <div className="text-center mb-28">
                   <h2 className="text-7xl font-black tracking-tighter mb-6">{section.title || 'Investment Plans'}</h2>
                   <p className="text-xl opacity-50 font-light">Engineered for sustainable rapid growth.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {(section.plans || []).map((plan: any, i: number) => (
                      <div key={i} className={`p-16 rounded-[3.5rem] border-2 transition-all hover:scale-[1.02] ${plan.popular ? 'bg-white text-slate-950 border-white shadow-2xl' : 'bg-slate-900/40 text-white border-white/5'}`}>
                        {plan.popular && <span className="inline-block px-6 py-2 bg-brand-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full mb-10 shadow-lg">Most Scalable</span>}
                        <h3 className="text-3xl font-black mb-4 tracking-tight">{plan.name}</h3>
                        <div className="text-7xl font-black mb-12 tracking-tighter">{plan.price}</div>
                        <ul className="space-y-6 mb-16">
                          {(plan.features || []).map((f: string) => (
                            <li key={f} className="flex items-center gap-4 text-base font-bold opacity-80">
                              <Shield size={20} className={plan.popular ? 'text-brand-500' : 'text-slate-500'} /> {f}
                            </li>
                          ))}
                        </ul>
                        <button className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.1em] text-[11px] transition-all shadow-xl ${plan.popular ? 'bg-slate-950 text-white hover:bg-black' : 'bg-white text-slate-950 hover:bg-slate-50'}`}>
                          Initialize Link
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

      {/* Footer */}
      <footer className={`${isDark ? 'bg-slate-900/40' : 'bg-slate-100'} py-32 px-24 border-t border-white/5`}>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-20">
           <div className="space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-black text-xl">
                    {appName[0]}
                 </div>
                 <span className="font-black text-3xl tracking-tighter uppercase">{appName}</span>
              </div>
              <p className="text-lg opacity-30 font-medium tracking-wide italic">"Built upon the SKH.GLOBAL Architectural Foundation."</p>
           </div>
           <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
             <a href="#" className="hover:opacity-100 transition-opacity">Nexus_Link</a>
             <a href="#" className="hover:opacity-100 transition-opacity">Privacy_Protocol</a>
             <a href="#" className="hover:opacity-100 transition-opacity">Terminal</a>
           </div>
        </div>
      </footer>
    </div>
  );
};
