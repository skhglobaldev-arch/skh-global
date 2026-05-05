
import React from 'react';
import { Monitor, Cpu, Layers, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Reveal } from './Reveal';
import { useTranslation } from 'react-i18next';

export const CapabilitiesGrid: React.FC = () => {
  const { t } = useTranslation();
  
  const capabilities = [
    { icon: Monitor, title: t('cap_1_t', "Real-Time UI"), description: t('cap_1_d', "Interfaces that react instantly to data changes without page reloads using Firebase.") },
    { icon: Cpu, title: t('cap_2_t', "AI Integration"), description: t('cap_2_d', "Smart workflows powered by Gemini LLMs and Make.com automation.") },
    { icon: Layers, title: t('cap_3_t', "Scalable Backend"), description: t('cap_3_d', "Cloud infrastructure on Google Cloud & Node.js that grows with you.") },
    { icon: ShieldCheck, title: t('cap_4_t', "Bank-Grade Auth"), description: t('cap_4_d', "Secure Role-Based Access Control ensuring data integrity.") },
    { icon: Zap, title: t('cap_5_t', "Instant Automation"), description: t('cap_5_d', "Zero-touch workflows that handle invoicing and emails.") },
    { icon: Globe, title: t('cap_6_t', "3D WebGL"), description: t('cap_6_d', "Immersive 3D experiences using Three.js and modern CSS.") },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {capabilities.map((item, i) => (
        <Reveal key={i} delay={i * 100}>
          <div className="glass-panel p-8 rounded-2xl border border-brand-500/30 hover:border-brand-400 transition-all hover:-translate-y-2 group shadow-2xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 rounded-xl bg-brand-500/20 text-brand-400 group-hover:scale-110 group-hover:bg-brand-500/30 transition-all border border-brand-500/20">
                <item.icon size={28} />
              </div>
              <h3 className="font-bold text-xl text-white font-display group-hover:text-brand-300 transition-colors">{item.title}</h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed group-hover:text-white transition-colors font-light">{item.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
};
