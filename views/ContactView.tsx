import React from 'react';
import { ContactCTA } from '../components/ContactCTA';
import { Reveal } from '../components/Reveal';
import { PageHero } from '../components/PageHero';
import { Mail, MapPin, Clock, ArrowRight } from 'lucide-react';

export const ContactView: React.FC = () => {
  return (
    <div className="pb-0">
      
      <PageHero 
        badge="Start Your Project"
        title={<>Let's Build Something <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Extraordinary</span></>}
        subtitle="Ready to automate your business and scale? We are accepting new projects for Q4. Secure your development slot today."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
        <div className="glass-panel rounded-3xl p-8 md:p-16 border border-slate-700 shadow-2xl bg-slate-900/80 backdrop-blur-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
             <Reveal>
               <div className="space-y-10">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">Contact Information</h3>
                    <p className="text-slate-400">Direct channels to our architectural team.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-5 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-brand-500/50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Mail className="text-brand-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Email Us</div>
                        <div className="font-medium text-white text-lg">hello@skh.global</div>
                        <p className="text-xs text-slate-500 mt-1">24h Response Time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-5 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-brand-500/50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin className="text-brand-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Global HQ</div>
                        <div className="font-medium text-white text-lg">Digital Systems / Remote First</div>
                        <p className="text-xs text-slate-500 mt-1">Operating Worldwide</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-brand-500/50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Clock className="text-brand-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Working Hours</div>
                        <div className="font-medium text-white text-lg">Mon - Fri, 09:00 - 18:00 EST</div>
                      </div>
                    </div>
                  </div>
               </div>
             </Reveal>

             <div className="lg:border-l lg:border-slate-800 lg:pl-16">
               <ContactCTA />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};