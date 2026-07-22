export interface Experience {
  company: string;
  role: string;
  period: string;
  current?: boolean;
  bullets: string[];
  stack: string[];
}

// NOTE: periods marked TODO are placeholders — fill in real month/year ranges.
export const experience: Experience[] = [
  {
    company: "CodeVector Labs", 
    role: "SDE Intern (Remote)",
    period: "July 2026 – July 2026", 
    current: false,
    bullets: [
      "Direct, full ownership of AWS infrastructure — EC2, RDS, S3 and IAM — provisioning, hardening and operating it, not just deploying to it.",
      "Ship across the stack on a Vue.js frontend and Ruby on Rails backend.",
    ],
    stack: ["Vue.js", "Ruby on Rails", "AWS EC2", "RDS", "S3", "IAM"],
  },
  {
    company: "Betatest Solutions",
    role: "SDE Intern",
    period: "November 2025 - April 2026",
    bullets: [
      "Shipped full Settings, Edit Profile, biometric auth, and image picker features in React Native (Expo) to production on iOS and Android.",
      "Built modular RESTful APIs in NestJS (TypeScript) — activity-type filtering, CSV report export, soft-delete cleanup, and Cron-based task automation.",
      "Engineered end-to-end password reset and OTP verification flows (mail dispatch, token validation, UI) spanning Next.js frontend and NestJS backend.",
      "Implemented i18n (English, PT-BR), transactional email templates, and push/email notification pipelines for real-time user alerts.",
      "Optimized backend performance via database schema migrations and load testing (k6); monitored production health with New Relic and Azure Pipelines (CI/CD); merged 55+ PRs across mono-repo.",
    ],
    stack: ["React Native (Expo)", "Next.js", "NestJS", "TypeScript", "TailwindCSS", "Azure DevOps", "PostgreSQL", "Redis"],
  },
  {
    company: "Coding Jr",
    role: "Full-Stack Developer Intern",
    period: "June 2025 - August 2025",
    bullets: [
      "Built the Planto VS Code and Eclipse extensions end-to-end: chat interface, agent mode, image-to-code, and Figma-to-code generation workflows.",
      "Engineered @file workspace attachment with Redis caching for low-latency context handling in the AI coding assistant.",
      "Redesigned the Planto marketing website and CodingPro platform with improved UI/UX, responsiveness, and Figma-driven design iterations.",
      "Contributed to an AI-assisted resume builder with section duplication, inline bullet editing, and LLM-powered formatting suggestions.",
    ],
    stack: ["VS Code Extension API", "Next.js", "Node.js", "Redis", "Figma"],
  },
];
