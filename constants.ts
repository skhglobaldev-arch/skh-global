import { 
  Monitor, 
  Workflow, 
  CalendarCheck, 
  BrainCircuit,
  Lightbulb,
  FileCode,
  Rocket,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Code,
  Database,
  Layers
} from 'lucide-react';
import { NavItem, ServiceItem, Testimonial, StepItem, PainPoint } from './types';

// Updated Navigation for Multi-page Structure
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: 'home' },
  { label: 'Services', href: 'services' },
  { label: 'Process', href: 'process' },
  { label: 'Company', href: 'about' },
  { label: 'Contact', href: 'contact' },
];

export const SERVICES: ServiceItem[] = [
  {
    title: 'Advanced Real-Time Dashboards',
    description: 'We build admin & client portals with Firebase onSnapshot for instant data syncing. Track sales, bookings, and user activity live without refreshing.',
    icon: Monitor
  },
  {
    title: 'Business Workflow Automation',
    description: 'We replace manual data entry with Make.com & Node.js. Connect your forms to CRMs, automate emails, and trigger PDF generation automatically.',
    icon: Workflow
  },
  {
    title: 'Complex Booking & Payments',
    description: 'Multi-step booking flows with branch logic, Stripe integration, voucher systems, and automated availability blocking.',
    icon: CalendarCheck
  },
  {
    title: 'Influencer & Referral Growth',
    description: 'Built-in growth engines: referral code generation, cookie-based tracking, and commission calculation dashboards for your partners.',
    icon: Users
  },
  {
    title: 'Enterprise Security & Auth',
    description: 'RBAC (Role-Based Access Control) for Admins, Editors, and Viewers. Secure API keys, OAuth integration, and protected route logic.',
    icon: ShieldCheck
  },
  {
    title: 'AI Architecture Consulting',
    description: 'We analyze your business model to design a scalable, monetization-ready architecture, not just a static website.',
    icon: BrainCircuit
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "SKH.GLOBAL transformed our manual spreadsheets into a fully automated cloud system. Our efficiency has tripled in just two months.",
    author: "Sarah Jenkins",
    role: "COO",
    company: "Logistics Pro"
  },
  {
    quote: "The real-time dashboard is a game changer. I can see bookings and payments coming in live while I'm on the go.",
    author: "Michael Chen",
    role: "Founder",
    company: "GrowthFlow"
  },
  {
    quote: "Their influencer tracking system allowed us to scale our marketing team effortlessly. Best investment we've made.",
    author: "Elena Rodriguez",
    role: "Director of Sales",
    company: "Urban Realty"
  }
];

export const STEPS: StepItem[] = [
  {
    title: "Share Your Vision",
    description: "Brief us on your business goals. We listen to understand your unique challenges.",
    icon: Lightbulb
  },
  {
    title: "Strategic Architecture",
    description: "Our architects design a scalable system blueprint tailored to your specific needs.",
    icon: FileCode
  },
  {
    title: "Agile Development",
    description: "Our team builds with clean, modular code, ensuring security and high performance.",
    icon: Monitor
  },
  {
    title: "Launch & Automate",
    description: "We deploy your system complete with automated notifications, reporting, and payments.",
    icon: Rocket
  },
  {
    title: "Scale & Support",
    description: "We ensure your system grows effortlessly alongside your expanding business.",
    icon: TrendingUp
  }
];

export const PAIN_POINTS: PainPoint[] = [
  {
    question: "Do you really own a business, or just a website?",
    pain: "Most Sites are static brochures that don't do any real work.",
    solution: "We build revenue-ready systems with booking, payments, and dashboards that run your business 24/7.",
    icon: Rocket
  },
  {
    question: "Drowning in manual spreadsheets?",
    pain: "Managing reservations, emails, and invoices manually kills your growth.",
    solution: "Our Make.com automations handle everything. From form submission to CRM entry and invoicing—zero clicks required.",
    icon: Zap
  },
  {
    question: "Are you flying blind?",
    pain: "Without data, you can't make decisions. Old admin panels are clunky and slow.",
    solution: "Get custom Real-Time Dashboards. See live sales, active users, and booking slots instantly.",
    icon: Monitor
  },
  {
    question: "Is security keeping you up at night?",
    pain: "Generic plugins leave you vulnerable to hacks and data leaks.",
    solution: "We implement Bank-Grade Security: Role-based access, encrypted data, and secure payment gateways.",
    icon: ShieldCheck
  }
];