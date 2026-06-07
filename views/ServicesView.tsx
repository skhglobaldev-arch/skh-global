
import React from 'react';
import { Services } from '../components/Services';
import { Reveal } from '../components/Reveal';
import { PageHero } from '../components/PageHero';
import { Bell, CalendarCheck, Code, CreditCard, Database, LayoutDashboard, Lock, Zap, Server, Brain, BarChart3, Target, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { JourneyTimeline } from '../components/JourneyTimeline';

export const ServicesView: React.FC = () => {
  const { t } = useTranslation();

  const outcomes = [
    { icon: Brain, title: t('outcome_1_title', "Useful AI"), desc: t('outcome_1_desc', "AI features added where they save time or improve a real workflow.") },
    { icon: Target, title: t('outcome_2_title', "Better Customer Flow"), desc: t('outcome_2_desc', "Clearer paths for enquiries, bookings, payments and follow-up.") },
    { icon: BarChart3, title: t('outcome_3_title', "Clear Data"), desc: t('outcome_3_desc', "Simple reporting for bookings, customers, messages and performance.") },
    { icon: Server, title: t('outcome_4_title', "Reliable Setup"), desc: t('outcome_4_desc', "A stable technical setup for daily business use.") }
  ];

  const systemFlowItems = [
    {
      icon: CalendarCheck,
      eyebrow: t('system_flow_step_1_label', 'Step 01'),
      title: t('system_flow_1', 'Customer chooses a service'),
      desc: t('system_flow_1_desc', 'The journey starts with a clear service page, availability and simple request flow.'),
    },
    {
      icon: CreditCard,
      eyebrow: t('system_flow_step_2_label', 'Step 02'),
      title: t('system_flow_2', 'Booking and payment are confirmed'),
      desc: t('system_flow_2_desc', 'Deposits, payment status and confirmations stay connected to the customer record.'),
    },
    {
      icon: LayoutDashboard,
      eyebrow: t('system_flow_step_3_label', 'Step 03'),
      title: t('system_flow_3', 'Team sees the request in a dashboard'),
      desc: t('system_flow_3_desc', 'Your team can see who booked, what changed and what needs attention next.'),
    },
    {
      icon: Bell,
      eyebrow: t('system_flow_step_4_label', 'Step 04'),
      title: t('system_flow_4', 'Customer receives reminders and updates'),
      desc: t('system_flow_4_desc', 'Useful messages go out at the right time without turning the experience cold.'),
    },
    {
      icon: BarChart3,
      eyebrow: t('system_flow_step_5_label', 'Step 05'),
      title: t('system_flow_5', 'Owner sees data and next actions'),
      desc: t('system_flow_5_desc', 'The system gives a clearer view of enquiries, bookings, payments and follow-up.'),
    },
  ];

  return (
    <div className="pb-24 bg-transparent">
      
      <PageHero 
        badge={t('services_page_badge', "Systems")}
        title={<>{t('services_page_title', "Systems Your Business")} <br/><span className="bg-gradient-to-br from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">{t('services_page_title_accent', "Can Actually Use.")}</span></>}
        subtitle={t('services_page_subtitle', "We build web apps, booking and payment flows, chatbots, admin dashboards, automation and complete custom SaaS platforms.")}
      />

      {/* The Immersive 3D Section */}
      <div className="-mt-32 relative z-20">
         <Services />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-14 md:mt-20">
        
        {/* Why Custom Section */}
        <Reveal>
          <div className="grid md:grid-cols-2 gap-10 mb-24 items-center md:mb-28">
            <div>
              <h2 className="mb-6 text-3xl font-black leading-tight text-white md:text-5xl">
                {t('problem_generic_title', "The Problem With")} <span className="bg-gradient-to-r from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">{t('problem_generic_accent', "Generic Platforms")}</span>
              </h2>
              <p className="text-slate-400 text-base font-light leading-relaxed mb-6 md:text-lg">
                {t('problem_generic_desc', 'Ready-made tools are useful, but they often leave bookings, payments, messages and reporting disconnected. The result is more admin work for your team.')}
              </p>
              <div className="space-y-4">
                {[
                  t('benefit_1', "Built around your real workflow"),
                  t('benefit_2', "Bookings, payments and customer data connected"),
                  t('benefit_3', "Role-based dashboards for the right people"),
                  t('benefit_4', "Automation only where it saves time or reduces mistakes")
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                    <ShieldCheck size={18} className="text-cyan-300" />
                    <span className="font-light">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2.2rem] bg-gradient-to-br from-[#7C3AED]/22 via-[#2563EB]/14 to-transparent p-1">
              <div className="rounded-[2rem] border border-violet-400/12 bg-[#101827]/78 p-7 md:p-8">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">{t('investment_logic_tag', 'Build Logic')}</h4>
                <p className="text-xl font-light leading-snug text-white md:text-2xl">
                  {t('investment_logic_quote', 'A useful system should remove repeated work, make the customer journey clearer, and give you better control.')}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Technical Stack Section */}
        <Reveal>
          <div className="glass-panel relative mb-24 overflow-hidden rounded-[2.4rem] border-violet-400/16 bg-[#101827]/64 p-6 shadow-[0_24px_100px_rgba(5,7,19,0.55)] md:mb-28 md:p-9">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(124,58,237,0.16),transparent_34%),radial-gradient(circle_at_95%_30%,rgba(56,216,255,0.10),transparent_32%)]"></div>
             <div className="relative z-10 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
                <div>
                   <h3 className="mb-5 text-3xl font-black tracking-tight text-white md:text-4xl">{t('deep_tech_title', 'Tools We Use')}</h3>
                   <p className="mb-8 text-base leading-relaxed text-slate-400 md:text-lg font-light">
                     {t('deep_tech_desc', "We use reliable modern tools to build web apps, dashboards and automations that stay easy to manage.")}
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: Server, label: t('tech_1', "Firebase / Google Cloud"), sub: t('tech_1_sub', "Backend and hosting") },
                        { icon: Code, label: t('tech_2', "React / TypeScript"), sub: t('tech_2_sub', "Web apps and dashboards") },
                        { icon: Lock, label: t('tech_3', "Stripe"), sub: t('tech_3_sub', "Payments and deposits") },
                        { icon: Brain, label: t('tech_4', "Gemini / OpenAI"), sub: t('tech_4_sub', "Useful AI features") },
                        { icon: Zap, label: t('tech_5', "Email & SMS"), sub: t('tech_5_sub', "Confirmations and reminders") },
                        { icon: Database, label: t('tech_6', "GitHub / Deployment"), sub: t('tech_6_sub', "Versioning and launch") }
                      ].map((item, i) => (
                        <div key={i} className="group flex flex-col gap-2 rounded-2xl border border-violet-400/10 bg-[#050713]/45 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-[#050713]/70">
                           <div className="flex items-center gap-3">
                              <item.icon size={20} className="text-cyan-300" />
                              <span className="text-white font-bold">{item.label}</span>
                           </div>
                           <span className="text-xs text-slate-500 font-mono">{item.sub}</span>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="group relative overflow-hidden rounded-[2rem] border border-violet-400/10 bg-[#050713]/72 p-5 shadow-inner md:p-7">
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-60"></div>
                   <div className="relative z-10">
                     <p className="mb-6 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">{t('system_flow_title', 'Example System Flow')}</p>
                     <JourneyTimeline items={systemFlowItems} compact />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30"></div>
                </div>
             </div>
          </div>
        </Reveal>

        {/* Deliverables Grid */}
        <div className="mb-24 md:mb-28">
           <Reveal>
             <div className="text-center mb-14">
               <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-5">{t('outcomes_title', 'What You Get')}</h2>
               <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                 {t('outcomes_desc', 'A working product your team can use, understand and grow from.')}
               </p>
             </div>
           </Reveal>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {outcomes.map((item, i) => (
                <Reveal key={i} delay={i*100}>
                  <div className="group rounded-[1.6rem] border border-violet-400/10 bg-[#101827]/55 p-7 text-center shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-cyan-300/28 hover:bg-[#101827]/72 md:p-8">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/12 bg-[#050713] transition-all group-hover:scale-110 group-hover:border-cyan-300/30">
                      <item.icon className="text-cyan-300" size={24}/>
                    </div>
                    <h4 className="text-white font-bold mb-3 text-lg font-display">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
           </div>
        </div>

        {/* Closing Trust Section */}
        <div className="relative overflow-hidden rounded-[3rem] border border-cyan-300/14 bg-gradient-to-tr from-[#050713] via-[#101827] to-[#0B1020] p-12 shadow-2xl md:p-24">
           <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]"></div>
           
           <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
              <Reveal>
                 <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-8 tracking-tight">
                    {t('audit_cta_title', 'Request a')} <span className="bg-gradient-to-br from-[#A855F7] via-[#2563EB] to-[#38D8FF] bg-clip-text text-transparent">{t('audit_cta_title_accent', 'System Review')}</span>
                 </h2>
                 <p className="text-slate-400 text-xl font-light mb-12 leading-relaxed">
                   {t('audit_cta_desc', "Tell us about your business and we will suggest the most useful digital solution for your goals.")}
                 </p>
                 <button className="rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-12 py-5 text-lg font-black text-white shadow-[0_20px_70px_rgba(37,99,235,0.30)] transition-all hover:scale-105">
                    {t('connect_architect_btn', 'Talk to Our Team')}
                 </button>
              </Reveal>
           </div>
        </div>
      </div>
    </div>
  );
};
