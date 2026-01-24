import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface StepItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface AIResponse {
  markdown: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface PainPoint {
  question: string;
  pain: string;
  solution: string;
  icon: LucideIcon;
}