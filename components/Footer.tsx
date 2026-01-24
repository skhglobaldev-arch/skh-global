import React from 'react';
import { Github, Twitter, Linkedin, Hexagon } from 'lucide-react';

interface FooterProps {
  navigateTo: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  return (
    <footer className="relative bg-black pt-20 pb-10 border-t border-slate-900 overflow-hidden shrink-0">
      {/* Grounding Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-lg">
                    <Hexagon size={20} className="text-brand-500 fill-brand-500/20" />
                </div>
                <span className="font-display font-bold text-2xl text-white tracking-tight">SKH.GLOBAL</span>
              </div>
              <p className="text-slate-500 text-base max-w-sm leading-relaxed">
                Engineering intelligent digital systems for the next generation of business. We bridge the gap between complex ideas and automated reality.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition-all"><Github size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition-all"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition-all"><Linkedin size={18} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 font-display">Navigation</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><button onClick={() => navigateTo('home')} className="hover:text-brand-400 transition-colors">Home</button></li>
                <li><button onClick={() => navigateTo('services')} className="hover:text-brand-400 transition-colors">Services</button></li>
                <li><button onClick={() => navigateTo('process')} className="hover:text-brand-400 transition-colors">Methodology</button></li>
                <li><button onClick={() => navigateTo('about')} className="hover:text-brand-400 transition-colors">About Us</button></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold mb-6 font-display">Inquiries</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><button onClick={() => navigateTo('contact')} className="hover:text-brand-400 transition-colors">Start Project</button></li>
                <li><a href="mailto:hello@skh.global" className="hover:text-brand-400 transition-colors">hello@skh.global</a></li>
                <li className="text-xs italic mt-4 opacity-50">Currently accepting new <br/> clients for Q4 2024.</li>
              </ul>
            </div>
        </div>
        
        <div className="pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
           <p>© {new Date().getFullYear()} SKH.GLOBAL Systems. All rights reserved.</p>
           <div className="flex gap-8 mt-4 md:mt-0">
             <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
           </div>
        </div>
      </div>
    </footer>
  );
};