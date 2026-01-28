
import React from 'react';
import { Globe, ArrowRight, Monitor, Zap, Shield, Sparkles, Terminal, ShoppingCart, CreditCard, ChevronRight, Star } from 'lucide-react';

interface AppPreviewProps {
  data: {
    siteType?: 'e-commerce' | 'saas' | 'luxury' | 'corporate' | 'dashboard';
    appName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontStyle?: 'serif' | 'sans' | 'display';
    layoutMode?: 'dark' | 'light';
    hero?: {
      title?: string;
      subtitle?: string;
      cta?: string;
      imageSearch?: string;
    };
    sections?: any[];
    navigation?: string[];
  };
}

export const AppPreview: React.FC<AppPreviewProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return (
    <div className="p-32 text-center text-slate-600 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
      Synthesizing System Visuals...
    </div>
  );

  const {
    siteType = 'saas',
    appName = 'Neural System',
    primaryColor = '#0ea5e9',
    secondaryColor = '#6366f1',
    fontStyle = 'display',
    layoutMode = 'dark',
    hero = {
      title: 'Next Gen Architecture',
      subtitle: 'Bespoke systems for global scale.',
      cta: 'Explore System',
      imageSearch: 'modern tech'
    },
    sections = [],
    navigation = ['Vision', 'Architecture', 'Systems']
  } = data;

  const isDark = layoutMode !== 'light';
  const fontClass = fontStyle === 'serif' ? 'font-serif' : fontStyle === 'display' ? 'font-display' : 'font-sans';
  const urlSafeName = appName.toLowerCase().replace(/\s+/g, '-');

  // Image Helper for more reliable loading
  const getImageUrl = (keywords: string, width = 1600, height = 900) => {
    const encoded = encodeURIComponent(keywords.replace(/\s+/g, ','));
    return `https://source.unsplash.com/featured/${width}x${height}/?${encoded}`;
  };

  return (
    <div className={`w-full max-w-6xl mx-auto rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'} ${fontClass} animate-in fade-in zoom-in-95 duration-1000 group/browser relative`}>
      
      {/* Browser Shell */}
      <div className={`${isDark ? 'bg-zinc-900/80 border-white/5' : 'bg-slate-200/80 border-slate-300'} border-b px-8 py-3 flex items-center justify-between backdrop-blur-xl`}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
        </div>
        <div className={`flex items-center gap-2 ${isDark ? 'bg-black/40 text-slate-500' : 'bg-white/80 text-slate-400'} px-10 py-1.5 rounded-full text-[10px] font-mono border border-white/5`}>
          <Globe size={10} /> {urlSafeName}.skh.dev
        </div>
        <div className="flex gap-4 opacity-20">
           <Terminal size={14} />
           <Monitor size={14} />
        </div>
      </div>

      {/* Navigation */}
      <header className={`px-10 py-6 flex items-center justify-between sticky top-0 z-50 ${isDark ? 'bg-black/60 backdrop-blur-xl' : 'bg-white/60 backdrop-blur-xl'}`}>
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: primaryColor }}>
              {appName[0]}
           </div>
           <span className="font-black text-sm tracking-tighter uppercase">{appName}</span>
        </div>
        <nav className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-widest opacity-40">
          {navigation.map((item, i) => (
            <a key={i} href="#" className="hover:opacity-100 transition-all">{item}</a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {siteType === 'e-commerce' && <ShoppingCart size={18} className="opacity-40" />}
          <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl" style={{ backgroundColor: primaryColor }}>
            {siteType === 'e-commerce' ? 'Store' : 'Contact'}
          </button>
        </div>
      </header>

      {/* Hero Section - Different styles per category */}
      <div className={`relative ${siteType === 'luxury' ? 'min-h-[850px]' : 'min-h-[650px]'} flex items-center overflow-hidden`}>
        <div className="absolute inset-0 -z-10">
          <img 
            key={hero.imageSearch}
            src={getImageUrl(hero.imageSearch || appName)} 
            className={`w-full h-full object-cover ${siteType === 'luxury' ? 'opacity-50' : 'opacity-20 grayscale'}`} 
            alt="Hero" 
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#050505] via-transparent to-[#050505]/40' : 'from-slate-50 via-transparent to-slate-50/40'}`}></div>
        </div>

        <div className={`px-12 md:px-20 ${siteType === 'luxury' ? 'max-w-5xl mx-auto text-center' : 'max-w-4xl'} space-y-8`}>
           <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} backdrop-blur-3xl mx-auto`}>
              <Sparkles size={12} style={{ color: primaryColor }} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Premium Identity</span>
           </div>
           <h1 className={`${siteType === 'luxury' ? 'text-7xl md:text-9xl' : 'text-6xl md:text-8xl'} font-black leading-none tracking-tighter uppercase drop-shadow-2xl`}>
              {hero.title}
           </h1>
           <p className={`text-xl md:text-2xl font-light opacity-60 ${siteType === 'luxury' ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>
              {hero.subtitle}
           </p>
           <div className={`flex flex-wrap gap-6 pt-6 ${siteType === 'luxury' ? 'justify-center' : ''}`}>
              <button className="px-10 py-5 rounded-2xl text-sm font-black text-white shadow-2xl transition-all hover:scale-105 flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
                {hero.cta || 'Get Started'} <ArrowRight size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* Dynamic Content Sections */}
      <div className="px-12 md:px-20 py-24 space-y-32">
        {sections.map((section, idx) => {
          
          // Layout for E-Commerce: Product Grid
          if (siteType === 'e-commerce' || section.type === 'products') {
            return (
              <div key={idx} className="animate-in fade-in duration-700">
                <div className="flex items-end justify-between mb-16">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase">{section.title}</h2>
                    <div className="h-1 w-12 mt-4" style={{ backgroundColor: primaryColor }}></div>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-2">View Collection <ChevronRight size={14} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {section.items.map((item: any, i: number) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="aspect-[3/4] rounded-3xl bg-zinc-900 overflow-hidden mb-6 relative border border-white/5">
                         <img src={getImageUrl(item.title + ' product', 800, 1200)} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                         <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-xl text-[10px] font-black text-white border border-white/10 shadow-xl">
                           {item.price || '$395.00'}
                         </div>
                         <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform">
                            <button className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">Add to Cart</button>
                         </div>
                      </div>
                      <div className="flex justify-between items-start">
                         <div>
                            <h4 className="font-black uppercase tracking-tight text-lg mb-1">{item.title}</h4>
                            <p className="text-xs opacity-40 uppercase tracking-widest">Premium Selection</p>
                         </div>
                         <div className="flex gap-1 text-amber-500">
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Default Layout: Bento Features
          return (
            <div key={idx} className="animate-in slide-in-from-bottom-12 duration-1000">
               <div className="max-w-xl mb-16">
                  <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">{section.title}</h2>
                  <div className="h-1 w-20" style={{ backgroundColor: primaryColor }}></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                  {section.items.map((item: any, i: number) => (
                    <div key={i} className={`p-10 rounded-[2.5rem] border border-white/5 bg-zinc-900/40 backdrop-blur-2xl flex flex-col justify-end group hover:bg-zinc-900 transition-all ${item.size === 'large' ? 'md:col-span-2' : ''}`}>
                       <Zap size={24} style={{ color: primaryColor }} className="mb-auto opacity-40 group-hover:opacity-100 transition-all" />
                       <h4 className="text-2xl font-black mb-2 tracking-tight uppercase">{item.title}</h4>
                       <p className="text-sm opacity-40 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="px-12 py-32 border-t border-white/5 bg-black/40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black">
                    {appName[0]}
                 </div>
                 <span className="font-black text-2xl tracking-tighter uppercase">{appName}</span>
              </div>
              <p className="text-[10px] opacity-20 font-mono tracking-[0.4em] uppercase">© {new Date().getFullYear()} CORE SYSTEMS / SKH SYNTHESIS</p>
           </div>
           <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-widest opacity-30">
             <a href="#" className="hover:opacity-100 transition-colors">Vision</a>
             <a href="#" className="hover:opacity-100 transition-colors">Privacy</a>
             <a href="#" className="hover:opacity-100 transition-colors">Architecture</a>
           </div>
        </div>
      </footer>
    </div>
  );
};
