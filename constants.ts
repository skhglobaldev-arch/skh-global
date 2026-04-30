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
    description: 'We build admin & client portals with enterprise-grade syncing. Track sales, bookings, and user activity live without refreshing. No more waiting for reports.',
    icon: Monitor
  },
  {
    title: 'Business Workflow Automation',
    description: 'We replace manual chaos with bespoke automation engines. Connect your forms to CRMs, automate complex logistics, and trigger intelligent event logic.',
    icon: Workflow
  },
  {
    title: 'Complex Booking & Payments',
    description: 'Multi-step booking flows with intelligent branch logic, multi-currency support, and automated availability protocols across your entire team.',
    icon: CalendarCheck
  },
  {
    title: 'Growth & Tracking Hubs',
    description: 'Built-in growth engines: referral architectures, cookie-based attribution, and custom commission dashboards for your strategic partners.',
    icon: Users
  },
  {
    title: 'Military-Grade Security',
    description: 'Strict RBAC (Role-Based Access Control), zero-trust architecture, and secure API integration ensuring your data sovereignty remains absolute.',
    icon: ShieldCheck
  },
  {
    title: 'AI Product Engineering',
    description: 'We don\'t just add a chatbot. We analyze your model to engineer a scalable, AI-orchestrated architecture that delivers real business edge.',
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
    pain: "Most sites are static brochures that don't do any real work, leaving you to handle the heavy lifting manually.",
    solution: "We build revenue-ready systems with booking, payments, and dashboards that automate your operations 24/7.",
    icon: Rocket
  },
  {
    question: "Drowning in manual processes?",
    pain: "Managing reservations, emails, and syncs between different tools manually is a bottleneck that kills growth.",
    solution: "Our custom automation layers handle everything. From form submission to CRM integration and reporting—zero manual intervention.",
    icon: Zap
  },
  {
    question: "Are you flying blind?",
    pain: "Without real-time data, you can't make strategic decisions. Static admin panels are outdated and slow.",
    solution: "Get custom Live Dashboards. See sales, active users, and resource availability the second it happens.",
    icon: Monitor
  },
  {
    question: "Is security a recurring anxiety?",
    pain: "Generic plugins and third-party boxes leave your business vulnerable to leaks and data loss.",
    solution: "We implement custom Hardened Security: Zero-trust access, encrypted channels, and secure payment pipelines.",
    icon: ShieldCheck
  }
];