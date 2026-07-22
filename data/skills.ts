export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    items: ["Go", "TypeScript", "JavaScript", "Java", "Python", "C", "SQL"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Node.js", "NestJS", "Express", "REST APIs", "JWT Auth", "Flask", "FastAPI", "Ruby on Rails"],
  },
  {
    id: "data",
    label: "Databases & Data",
    items: ["PostgreSQL", "Redis", "MongoDB", "Neo4j (graph)", "Qdrant (vector)"],
  },
  {
    id: "infra",
    label: "Infra / DevOps",
    items: [
      "AWS (EC2, RDS, S3, IAM)",
      "Docker",
      "Azure DevOps",
      "GitHub Actions",
      "k6 (load/chaos)",
      "New Relic",
      "OpenTelemetry",
      "Git",
      "Postman",
      "Figma",
    ],
  },
  {
    id: "ai",
    label: "AI / ML Tooling",
    items: ["LangChain", "Anthropic API", "OpenAI API", "Whisper", "Pandas"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React", "Next.js", "React Native (Expo)", "Vue.js", "Tailwind CSS", "Material-UI", "Framer Motion"],
  },
  {
    id: "systems",
    label: "Systems & Tooling",
    items: ["tree-sitter (AST)", "Celery", "BullMQ", "Socket.IO", "VS Code / Eclipse Extension APIs"],
  },
];
