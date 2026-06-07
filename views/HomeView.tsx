import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  GitMerge,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  PenTool,
  Repeat,
  Rocket,
  SearchCheck,
  Users,
  Workflow,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Hero } from '../components/Hero';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { Reveal } from '../components/Reveal';

interface HomeViewProps {
  navigateTo: (page: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ navigateTo }) => {
  const { t, i18n } = useTranslation();
  const isRtl = ['fa', 'ar', 'ur'].includes(i18n.language.split('-')[0]);
  const [activePainIndex, setActivePainIndex] = React.useState(0);

  const buildItems = [
    {
      icon: CalendarCheck,
      title: t('home_build_booking_title', 'Booking and Payment Systems'),
      desc: t('home_build_booking_desc', 'Booking paths, online payment, confirmation, cancellations, statuses, and customer follow-up.'),
    },
    {
      icon: LayoutDashboard,
      title: t('home_build_dashboard_title', 'Admin Dashboards'),
      desc: t('home_build_dashboard_desc', 'Internal panels for bookings, orders, customers, payments, and daily operations.'),
    },
    {
      icon: Users,
      title: t('home_build_crm_title', 'CRM and Customer Management'),
      desc: t('home_build_crm_desc', 'Systems for customer records, interaction history, order status, and follow-up.'),
    },
    {
      icon: CreditCard,
      title: t('home_build_portal_title', 'Customer Portals'),
      desc: t('home_build_portal_desc', 'A place for customers to view bookings, orders, payments, statuses, and their own details.'),
    },
    {
      icon: Workflow,
      title: t('home_build_auto_title', 'Automation and Messaging'),
      desc: t('home_build_auto_desc', 'Email, SMS, reminders, confirmations, and repeated workflow steps connected together.'),
    },
    {
      icon: Bot,
      title: t('home_build_saas_title', 'SaaS and AI-Powered Products'),
      desc: t('home_build_saas_desc', 'Turning ideas into usable software with AI features, dashboards, payments, and data management.'),
    },
  ];

  const painCards = [
    {
      icon: MessageSquare,
      title: t('home_pain_1_title', 'Enquiries get lost in DMs and calls'),
      pain: t('home_pain_1_pain', 'Customers ask questions on Instagram, WhatsApp and phone. Some get answered late, some are forgotten, and nobody can see the full pipeline.'),
      example: t('home_pain_1_example', 'Example: a salon gets 30 messages a day, but bookings depend on whoever remembers to reply first.'),
      solution: t('home_pain_1_solution', 'We turn the enquiry flow into a system: clear form, customer record, status, reminders and follow-up in one place.'),
    },
    {
      icon: CalendarCheck,
      title: t('home_pain_2_title', 'Bookings are manual and easy to miss'),
      pain: t('home_pain_2_pain', 'Time slots are checked by hand, staff availability is unclear, and customers wait too long for confirmation.'),
      example: t('home_pain_2_example', 'Example: a client asks for Tuesday, the team checks a calendar, sends three messages, then loses the slot to someone else.'),
      solution: t('home_pain_2_solution', 'We build booking flows with availability, staff logic, confirmations, reminders and admin control.'),
    },
    {
      icon: CreditCard,
      title: t('home_pain_3_title', 'Payments and deposits are disconnected'),
      pain: t('home_pain_3_pain', 'Clients book without paying, no-shows waste time, and payment links live outside the customer journey.'),
      example: t('home_pain_3_example', 'Example: a clinic reserves a long appointment, but the customer never arrives because no deposit was taken.'),
      solution: t('home_pain_3_solution', 'We connect booking, deposits, payment links, receipts and payment status so the business has fewer gaps.'),
    },
    {
      icon: Users,
      title: t('home_pain_4_title', 'Staff and branches work from different versions of truth'),
      pain: t('home_pain_4_pain', 'One person uses a spreadsheet, another uses WhatsApp, and the owner has to ask everyone what is happening.'),
      example: t('home_pain_4_example', 'Example: two staff members confirm the same slot because the schedule is not shared properly.'),
      solution: t('home_pain_4_solution', 'We build role-based dashboards for owners, staff and branches so everyone sees the right information.'),
    },
    {
      icon: BarChart3,
      title: t('home_pain_5_title', 'You cannot see what is actually working'),
      pain: t('home_pain_5_pain', 'Leads, bookings, payments and marketing sources are spread across tools, so decisions become guesswork.'),
      example: t('home_pain_5_example', 'Example: ads bring messages, but nobody knows which campaign produced real paying customers.'),
      solution: t('home_pain_5_solution', 'We create dashboards that show enquiries, channels, bookings, payments and performance in a simple view.'),
    },
    {
      icon: Repeat,
      title: t('home_pain_6_title', 'The same follow-up happens every day'),
      pain: t('home_pain_6_pain', 'Teams repeat the same messages, reminders, onboarding steps and customer updates manually.'),
      example: t('home_pain_6_example', 'Example: after every booking, someone manually sends confirmation, location, payment details and a reminder.'),
      solution: t('home_pain_6_solution', 'We automate repeated steps with useful messages, triggers and internal tasks, while keeping the customer experience human.'),
    },
  ];

  const processSteps = [
    {
      icon: SearchCheck,
      title: t('home_process_review', 'System Review'),
      eyebrow: t('roadmap_step_1_week', 'Step 01'),
      desc: t('home_process_review_desc', 'We define the problem, customer path, real needs, and project scope.'),
    },
    {
      icon: PenTool,
      title: t('home_process_design', 'Flow Design and Prototype'),
      eyebrow: t('roadmap_step_2_week', 'Step 02'),
      desc: t('home_process_design_desc', 'Pages, panels, roles, database, and workflow are designed before the build.'),
    },
    {
      icon: GitMerge,
      title: t('home_process_build', 'System Build'),
      eyebrow: t('roadmap_step_3_week', 'Step 03'),
      desc: t('home_process_build_desc', 'Booking, payment, dashboards, permissions, automation, and needed connections are built.'),
    },
    {
      icon: Rocket,
      title: t('home_process_launch', 'Testing and Launch'),
      eyebrow: t('roadmap_step_4_week', 'Step 04'),
      desc: t('home_process_launch_desc', 'The system is tested, launched on the domain, and prepared for real use.'),
    },
    {
      icon: LifeBuoy,
      title: t('home_process_support', 'Delivery and Support'),
      eyebrow: t('roadmap_step_5_week', 'Step 05'),
      desc: t('home_process_support_desc', 'Handover notes, basic training, and monthly support are provided when needed.'),
    },
  ];

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setActivePainIndex((current) => (current + 1) % painCards.length);
    }, 5600);

    return () => window.clearInterval(interval);
  }, [painCards.length]);

  const goPain = (direction: number) => {
    setActivePainIndex((current) => (current + direction + painCards.length) % painCards.length);
  };

  const activePain = painCards[activePainIndex];
  const ActivePainIcon = activePain.icon;

  return (
    <div className="bg-transparent animate-in fade-in duration-1000">
      <Hero navigateTo={navigateTo} />

      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <div className="mb-10 max-w-3xl">
              <span className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">{t('home_build_kicker', 'What We Build')}</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#F8FAFC] md:text-5xl">
                {t('home_build_title', 'Systems your business can actually use.')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#94A3B8] md:text-lg">
                {t('home_build_intro', 'We connect the parts that usually live in separate tools: bookings, payments, customer records, dashboards, messages, and automation.')}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {buildItems.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <div className="group h-full rounded-[1.35rem] border border-violet-400/12 bg-[#101827]/58 p-5 shadow-[0_18px_70px_rgba(5,7,19,0.40)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-[#101827]/76 hover:shadow-[0_24px_90px_rgba(124,58,237,0.18)] md:p-6">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED]/30 via-[#2563EB]/20 to-[#38D8FF]/20 text-cyan-100 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110">
                    <item.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white md:text-xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/5 bg-[#050713]/80 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(124,58,237,0.14),transparent_34%),radial-gradient(circle_at_80%_60%,rgba(56,216,255,0.10),transparent_30%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <span className="inline-flex rounded-full border border-violet-400/25 bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                  {t('home_system_kicker', 'Why System')}
                </span>
                <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-[#F8FAFC] md:text-5xl">
                  {t('home_system_title', 'A website is not enough. You need a system.')}
                </h2>
                <p className="mt-5 text-base font-light leading-relaxed text-[#CBD5E1] md:text-lg">
                  {t('home_system_text', 'A website only introduces. A system takes bookings, confirms payments, manages customers, tracks statuses, and gives your team a real panel.')}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div className="mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-violet-300">
                  {t('home_pain_slider_kicker', 'Common Business Pains')}
                </p>
                <h3 className="mt-3 text-2xl font-black text-white md:text-4xl">
                  {t('home_pain_slider_title', 'The pain is usually not one thing. It is the system around it.')}
                </h3>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => goPain(isRtl ? 1 : -1)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition-all hover:border-cyan-300/35 hover:bg-white/[0.07]"
                  aria-label="Previous business pain"
                >
                  <ChevronLeft className={isRtl ? 'rotate-180' : ''} size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => goPain(isRtl ? -1 : 1)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition-all hover:border-cyan-300/35 hover:bg-white/[0.07]"
                  aria-label="Next business pain"
                >
                  <ChevronRight className={isRtl ? 'rotate-180' : ''} size={20} />
                </button>
              </div>
            </div>
          </Reveal>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.article
                key={activePain.title}
                initial={{ opacity: 0, x: isRtl ? -28 : 28, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: isRtl ? 28 : -28, y: -8 }}
                transition={{ duration: 0.36, ease: 'easeOut' }}
                className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.2rem] border border-violet-400/16 bg-[#101827]/82 p-6 shadow-[0_28px_110px_rgba(5,7,19,0.58)] backdrop-blur-2xl md:p-9"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(124,58,237,0.20),transparent_36%),radial-gradient(circle_at_100%_45%,rgba(56,216,255,0.12),transparent_34%)]" />
                <div className="relative z-10">
                  <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#7C3AED]/38 via-[#2563EB]/22 to-[#38D8FF]/22 text-cyan-100 ring-1 ring-white/10 shadow-[0_18px_58px_rgba(124,58,237,0.18)]">
                      <ActivePainIcon size={28} />
                    </div>
                    <span className="w-fit rounded-full border border-cyan-300/15 bg-cyan-300/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
                      {String(activePainIndex + 1).padStart(2, '0')} / {String(painCards.length).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">{activePain.title}</h3>

                  <div className="mt-8 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-[1.4rem] border border-red-300/10 bg-red-400/[0.035] p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200/80">{t('problem_label', 'The Problem')}</p>
                      <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">{activePain.pain}</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-300">{t('home_pain_example_label', 'Example')}</p>
                      <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">{activePain.example}</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-cyan-300/15 bg-cyan-300/[0.045] p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">{t('solution_label', 'The SKH Solution')}</p>
                      <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">{activePain.solution}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-2">
                    {painCards.map((item, index) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => setActivePainIndex(index)}
                        aria-label={`Show business pain ${index + 1}`}
                        className={`h-2.5 rounded-full transition-all ${
                          activePainIndex === index
                            ? 'w-9 bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#38D8FF]'
                            : 'w-2.5 bg-white/18 hover:bg-white/35'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className={`mb-12 max-w-3xl ${isRtl ? 'text-right' : 'text-left'}`}>
              <span className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">{t('home_process_kicker', 'Process')}</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#F8FAFC] md:text-5xl">
                {t('home_process_title', 'How we build systems.')}
              </h2>
            </div>
          </Reveal>

          <JourneyTimeline items={processSteps} />
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-20 md:py-28">
        <Reveal>
          <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-cyan-300/18 bg-[#101827]/78 p-8 text-center shadow-[0_24px_120px_rgba(124,58,237,0.16)] backdrop-blur-2xl md:p-16">
            <CheckCircle2 className="mx-auto mb-7 text-cyan-200" size={34} />
            <h2 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              {t('home_final_title', 'Have a business problem that keeps repeating?')}
            </h2>
            <p className="mt-6 text-xl text-[#94A3B8]">{t('home_final_body', 'Let’s turn it into a usable system.')}</p>
            <button
              onClick={() => navigateTo('audit')}
              className="mt-10 inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-8 py-5 text-base font-black text-white shadow-[0_20px_70px_rgba(37,99,235,0.32)] transition-all hover:-translate-y-1 hover:shadow-[0_26px_90px_rgba(56,216,255,0.25)]"
            >
              {t('home_final_cta', 'Start a System Review')}
              <ArrowRight size={20} />
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
