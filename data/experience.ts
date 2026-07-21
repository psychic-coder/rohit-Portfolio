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
    company: "CodeVector", // TODO: replace with the company name when you can share it
    role: "SDE Intern (Remote)",
    period: "July 2026 – July 2026", // TODO: e.g. "May 2026 – Present"
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
    period: "November 2025 - April 2026", // TODO: add dates
    bullets: [
      "55+ PRs merged into a production React Native app, working inside a real CI/CD pipeline on Azure DevOps.",
      "Exposure to performance discipline in practice: k6 load tests and New Relic monitoring on NestJS/Next.js services.",
    ],
    stack: ["React Native", "NestJS", "Next.js", "Azure DevOps", "k6", "New Relic"],
  },
  {
    company: "Coding Jr",
    role: "SDE Intern",
    period: "May 2025 - August 2025", // TODO: add dates
    bullets: [
      "Built developer tooling: VS Code and Eclipse extensions, working against real editor extension APIs and internals.",
      "Integrated Redis-backed features and AI tooling into the extension workflow.",
    ],
    stack: ["VS Code Extension API", "Eclipse", "Redis", "AI tooling"],
  },
];
