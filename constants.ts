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
    title: 'Real-Time Dashboards',
    description: 'Admin and customer portals for bookings, sales and daily activity without waiting for reports.',
    icon: Monitor
  },
  {
    title: 'Business Workflow Automation',
    description: 'Connect forms, CRMs, messages and follow-ups so repeated tasks happen with less manual work.',
    icon: Workflow
  },
  {
    title: 'Booking & Payments',
    description: 'Booking flows with staff logic, deposits, payment links, availability and reminders.',
    icon: CalendarCheck
  },
  {
    title: 'Customer & Sales Tracking',
    description: 'Track enquiries, sources, status and outcomes in one practical dashboard.',
    icon: Users
  },
  {
    title: 'Secure Access',
    description: 'Role-based access, secure API connections and sensible protection for business data.',
    icon: ShieldCheck
  },
  {
    title: 'AI Product Engineering',
    description: 'Useful AI features, chatbots and SaaS tools designed around the way the product should work.',
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
    title: "System Plan",
    description: "We design a clear blueprint for the features, data and workflow you need.",
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
    description: "We support the system as your business changes and grows.",
    icon: TrendingUp
  }
];

export const PAIN_POINTS: PainPoint[] = [
  {
    question: "Do your tools actually help run the business?",
    pain: "Most sites are static brochures that don't do any real work, leaving you to handle the heavy lifting manually.",
    solution: "We build practical systems with booking, payments and dashboards so less work depends on manual follow-up.",
    icon: Rocket
  },
  {
    question: "Drowning in manual processes?",
    pain: "Managing reservations, emails, and syncs between different tools manually is a bottleneck that kills growth.",
    solution: "We connect forms, CRMs, messages and reports so repeated follow-up takes less manual work.",
    icon: Zap
  },
  {
    question: "Are you making decisions without clear data?",
    pain: "Without real-time data, you can't make strategic decisions. Static admin panels are outdated and slow.",
    solution: "Get custom Live Dashboards. See sales, active users, and resource availability the second it happens.",
    icon: Monitor
  },
  {
    question: "Is security a recurring anxiety?",
    pain: "Generic plugins and third-party boxes leave your business vulnerable to leaks and data loss.",
    solution: "We design secure access for accounts, customer data and payments.",
    icon: ShieldCheck
  }
];
