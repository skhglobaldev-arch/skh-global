
import React from 'react';
import { Globe, ArrowRight, Monitor, Zap, Shield, Sparkles, Settings, Terminal } from 'lucide-react';

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
  if (!data || Object.keys(data).length === 0) return (
    <div className="p-32 text-center text-slate-600 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
      Initialing System Visualization...
    </div>
  );

  const appName = String(data.appName || 'Neural Link');
  const primaryColor = String(data.primaryColor || '#0ea5e9');
  const fontStyle = data.fontStyle || 'display';
  const isDark = data.layoutMode !== 'light';
  const hero = data.hero || {
    title: 'The Future of Scale',
    subtitle: 'Automated infrastructure for high-growth ventures.',
    imageSearch: 'modern technology architecture'
  };
  const sections = data.sections || [];
  const navigation = data.navigation || ['Home', 'About', 'Systems'];

  const fontClass = fontStyle === 'serif' ? 'font-serif' : fontStyle === 'display' ? 'font-display' : 'font-sans';
  const urlSafeName = appName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div className={`w-full max-w-6xl mx-auto rounded-[4rem] overflow-hidden shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] border border-white/5 ${isDark ? 'bg-[#010413] text-white' : 'bg-white text-slate-950'} ${fontClass} animate-in fade-in zoom-in-95 duration-1000 group/browser relative`}>
      
      {/* Dynamic Ambient Background */}
      <div className="absolute top-0 right-0 w-2/3 h-1/2 bg-brand-500/5 blur-[150px] pointer-events-none -z-10 animate-pulse-slow"></div>

      {/* Ultra-Thin Glass Browser Shell */}
      <div className={`${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-slate-50 border-slate-200'} border-b px-10 py-4 flex items-center justify-between backdrop-blur-xl`}>
        <div className="flex gap-2.5">
          <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/30"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/30"></div>
        </div>
        <div className={`flex items-center gap-3 ${isDark ? 'bg-black/60 text-slate-500' : 'bg-white text-slate-400 shadow-sm'} border border-white/5 px-12 py-2 rounded-full text-[9px] font-mono w-1/3 justify-center shadow-inner tracking-[0.2em]`}>
          <Globe size={10} className="opacity-30" /> {urlSafeName || 'skh'}.global-link.dev
        </div>
        <div className="flex gap-5 opacity-20">
           <Terminal size={12} />
           <Monitor size={12} />
        </div>
      </div>

      {/* High-Impact Navigation */}
      <header className={`px-14 py-10 flex items-center justify-between sticky top-0 z-50 transition-all ${isDark ? 'bg-[#010413]/80 backdrop-blur-2xl' : 'bg-white/80 backdrop-blur-2xl'}`}>
        <div className="flex items-center gap-4 group cursor-pointer">
           <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-2xl transition-all group-hover:rotate-12 group-hover:scale-110" style={{ backgroundColor: primaryColor }}>
              {appName[0]}
           </div>
           <span className="font-black text-lg tracking-tighter uppercase">{appName}</span>
        </div>
        <nav className="hidden lg:flex gap-14 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
          {navigation.map((item, i) => (
            <a key={i} href="#" className="hover:opacity-100 transition-all relative group py-2">
              {item}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 rounded-full transition-all duration-300 group-hover:w-4" style={{ backgroundColor: primaryColor }}></span>
            </a>
          ))}
        </nav>
        <button className="px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
          Sync <ArrowRight size={14} />
        </button>
      </header>

      {/* Cinematic Hero */}
      <div className="relative h-[800px] overflow-hidden group">
        <div className="absolute inset-0 bg-slate-950">
          <img 
            src={`https://images.unsplash.com/photo-1550745679-33d0c6321278?auto=format&fit=crop&q=80&w=1600&h=1000&sig=${Math.random()}`} 
            className="w-full h-full object-cover opacity-30 transition-transform duration-[20s] group-hover:scale-110 grayscale hover:grayscale-0" 
            alt="Hero Visual" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#010413] via-[#010413]/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-16 md:px-24">
          <div className="max-w-4xl space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl">
               <Sparkles size={14} style={{ color: primaryColor }} className="animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Operational Protocol 8.2</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter animate-in slide-in-from-bottom-10 duration-1000">
              {hero.title || 'Nexus Synthesis'}
            </h1>
            <p className="text-2xl md:text-3xl font-light leading-relaxed max-w-2xl opacity-50">
              {hero.subtitle || 'Engineered for rapid deployment and indefinite global scalability.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-8 pt-8">
              <button className="px-14 py-7 rounded-2xl text-xl font-black text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-2 flex items-center justify-center gap-4" style={{ backgroundColor: primaryColor }}>
                Execute <Zap size={24} />
              </button>
              <button className="px-14 py-7 rounded-2xl text-xl font-black border border-white/5 bg-white/5 backdrop-blur-3xl hover:bg-white/10 transition-all text-white">
                Blueprint
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Stream */}
      <div className={isDark ? 'bg-[#010413]' : 'bg-slate-50'}>
        {sections.map((section, idx) => {
          if (section.type === 'bento-grid') {
            return (
              <div key={idx} className="py-48 px-16 md:px-24">
                <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
                  <div className="max-w-2xl">
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] opacity-20 block mb-10">Infrastructure_Map</span>
                    <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-none uppercase">{section.title || 'Core Ecosystem'}</h2>
                  </div>
                  <div className="h-px w-32 bg-white/10 hidden md:block"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 auto-rows-[350px]">
                  {(section.items || []).map((item: any, i: number) => (
                    <div 
                      key={i} 
                      className={`relative rounded-[4rem] overflow-hidden group/card shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-white/5 transition-all hover:border-white/20 ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}
                    >
                      <img src={`https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=600&sig=${i+42}`} className="absolute inset-0 w-full h-full object-cover opacity-20 transition-transform duration-1000 group-hover/card:scale-105" alt="Node" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#010413] via-transparent to-transparent p-16 flex flex-col justify-end">
                        <h4 className="text-4xl font-black text-white mb-6 tracking-tight leading-none uppercase">{item.title}</h4>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-y-4 group-hover/card:translate-y-0">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (section.type === 'pricing') {
            return (
              <div key={idx} className="py-48 px-16 bg-white/5 relative">
                 <div className="text-center mb-32">
                   <h2 className="text-7xl md:text-8xl font-black tracking-tighter mb-10 uppercase">{section.title || 'Engagement'}</h2>
                   <p className="text-2xl opacity-30 font-light tracking-wide italic">Secure your development slot.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {(section.plans || []).map((plan: any, i: number) => (
                      <div key={i} className={`p-20 rounded-[4.5rem] border-2 transition-all hover:scale-[1.03] ${plan.popular ? 'bg-white text-slate-950 border-white shadow-2xl' : 'bg-slate-900/60 text-white border-white/5 backdrop-blur-3xl'}`}>
                        {plan.popular && <span className="inline-block px-8 py-3 bg-brand-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-12 shadow-xl">Most Optimized</span>}
                        <h3 className="text-4xl font-black mb-6 tracking-tight uppercase">{plan.name}</h3>
                        <div className="text-8xl font-black mb-16 tracking-tighter">{plan.price}</div>
                        <ul className="space-y-8 mb-20">
                          {(plan.features || []).map((f: string) => (
                            <li key={f} className="flex items-center gap-5 text-xl font-bold opacity-70">
                              <Shield size={24} className={plan.popular ? 'text-brand-500' : 'text-slate-600'} /> {f}
                            </li>
                          ))}
                        </ul>
                        <button className={`w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[13px] transition-all shadow-2xl ${plan.popular ? 'bg-slate-950 text-white hover:bg-black' : 'bg-white text-slate-950 hover:bg-slate-100'}`}>
                          Initialize Project
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

      {/* Terminal Footer */}
      <footer className={`${isDark ? 'bg-black/40' : 'bg-slate-100'} py-40 px-24 border-t border-white/5`}>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-24">
           <div className="space-y-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center font-black text-2xl border border-white/10">
                    {appName[0]}
                 </div>
                 <span className="font-black text-4xl tracking-tighter uppercase">{appName}</span>
              </div>
              <p className="text-lg opacity-20 font-mono tracking-widest uppercase">Built on SKH.Global Core-v8</p>
           </div>
           <div className="flex flex-wrap justify-center gap-16 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
             <a href="#" className="hover:opacity-100 transition-all">Nexus_Terminal</a>
             <a href="#" className="hover:opacity-100 transition-all">Privacy_Protocol</a>
             <a href="#" className="hover:opacity-100 transition-all">System_Status</a>
           </div>
        </div>
      </footer>
    </div>
  );
};
