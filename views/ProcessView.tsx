
import React from 'react';
import { Reveal } from '../components/Reveal';
import { PageHero } from '../components/PageHero';
import { CheckCircle2, GitMerge, Layout, Plug, PenTool } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ProcessView: React.FC = () => {
  const { t } = useTranslation();

  const roadmapItems = [
    { icon: PenTool, title: t('roadmap_step_1_title', "System Review"), week: t('roadmap_step_1_week', "Step 01"), desc: t('roadmap_step_1_desc', "We define the problem, customer path, real needs and project scope.") },
    { icon: Layout, title: t('roadmap_step_2_title', "Flow Design and Prototype"), week: t('roadmap_step_2_week', "Step 02"), desc: t('roadmap_step_2_desc', "Pages, panels, roles, database and workflow are designed before the build starts.") },
    { icon: GitMerge, title: t('roadmap_step_3_title', "System Build"), week: t('roadmap_step_3_week', "Step 03"), desc: t('roadmap_step_3_desc', "Booking, payment, dashboards, permissions, automation and needed integrations are built.") },
    { icon: Plug, title: t('roadmap_step_4_title', "Testing and Launch"), week: t('roadmap_step_4_week', "Step 04"), desc: t('roadmap_step_4_desc', "The system is tested, launched on the domain and prepared for real use.") },
    { icon: CheckCircle2, title: t('roadmap_step_5_title', "Delivery and Support"), week: t('roadmap_step_5_week', "Step 05"), desc: t('roadmap_step_5_desc', "Handover notes, basic training and monthly support are provided when needed.") }
  ];

  return (
    <div className="pb-24">
       
       <PageHero 
         badge={t('process_page_badge', "Build Process")}
         title={<>{t('process_page_title', "From Idea to a")} <br/><span className="bg-gradient-to-br from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">{t('process_page_title_accent', "Working System")}</span></>}
         subtitle={t('process_page_subtitle', "We understand the problem, design the right workflow, build the product and support it after launch.")}
       />

       {/* Detailed Timeline */}
       <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 md:py-28">
          <Reveal>
             <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">{t('roadmap_title', 'Collaboration Path')}</h2>
               <p className="text-slate-400 max-w-2xl mx-auto">{t('roadmap_desc', 'A clear path from business problem to usable system.')}</p>
             </div>
          </Reveal>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            {roadmapItems.map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  
                  {/* Icon */}
                  <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-violet-400/20 bg-[#101827] shadow-[0_18px_50px_rgba(5,7,19,0.45)] transition-all duration-300 group-hover:border-cyan-300/40 group-hover:bg-gradient-to-br group-hover:from-[#7C3AED] group-hover:via-[#2563EB] group-hover:to-[#38D8FF] md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <item.icon size={20} className="text-slate-400 group-hover:text-white" />
                  </div>
                  
                  {/* Card */}
                  <div className="glass-panel w-[calc(100%-4rem)] rounded-2xl border-violet-400/12 bg-[#101827]/68 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/28 hover:shadow-[0_24px_90px_rgba(124,58,237,0.16)] md:w-[calc(50%-3rem)]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-xl text-white font-display">{item.title}</h3>
                      <span className="rounded-full border border-cyan-300/16 bg-cyan-300/[0.05] px-3 py-1 text-xs font-semibold text-cyan-200">{item.week}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
       </div>

    </div>
  );
};
