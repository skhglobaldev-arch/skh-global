
import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  navigateTo: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  return (
    <footer className="relative bg-black pt-24 pb-12 border-t border-slate-900 overflow-hidden shrink-0">
      {/* Grounding Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigateTo('home')}>
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src="https://files.catbox.moe/rx7p0x.jpg" alt="Logo" className="w-12 h-12 object-cover rounded-xl brightness-110 transition-transform group-hover:scale-110" />
                </div>
                <span className="font-display font-black text-3xl text-white tracking-tighter uppercase">SKH<span className="text-brand-500">.GLOBAL</span></span>
              </div>
              <p className="text-slate-500 text-lg max-w-sm leading-relaxed font-light">
                Engineering intelligent digital systems for the next generation of business. We bridge the gap between complex ideas and automated reality.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition-all"><Github size={20} /></a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition-all"><Twitter size={20} /></a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition-all"><Linkedin size={20} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 opacity-50">Navigation</h4>
              <ul className="space-y-5 text-slate-400 font-medium">
                <li><button onClick={() => navigateTo('home')} className="hover:text-brand-400 transition-colors">Home</button></li>
                <li><button onClick={() => navigateTo('services')} className="hover:text-brand-400 transition-colors">Services</button></li>
                <li><button onClick={() => navigateTo('process')} className="hover:text-brand-400 transition-colors">Methodology</button></li>
                <li><button onClick={() => navigateTo('about')} className="hover:text-brand-400 transition-colors">About Us</button></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 opacity-50">Inquiries</h4>
              <ul className="space-y-5 text-slate-400 font-medium">
                <li><button onClick={() => navigateTo('contact')} className="hover:text-brand-400 transition-colors">Start Project</button></li>
                <li><a href="mailto:hello@skh.global" className="hover:text-brand-400 transition-colors">hello@skh.global</a></li>
                <li className="pt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-900/20 border border-brand-500/20 rounded-xl text-[10px] text-brand-400 uppercase tracking-widest font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                    Q4 Slots Open
                  </div>
                </li>
              </ul>
            </div>
        </div>
        
        <div className="pt-12 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 font-mono">
           <p>© {new Date().getFullYear()} SKH.GLOBAL / CORE_SYSTEM_BUILD_v2.5</p>
           <div className="flex gap-8 mt-6 md:mt-0 uppercase tracking-widest text-[10px]">
             <a href="#" className="hover:text-slate-400 transition-colors">Privacy_Protocol</a>
             <a href="#" className="hover:text-slate-400 transition-colors">Terms_of_Service</a>
           </div>
        </div>
      </div>
    </footer>
  );
};
