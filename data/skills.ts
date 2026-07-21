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
    items: ["NestJS", "Express", "Flask", "FastAPI", "Ruby on Rails"],
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
    ],
  },
  {
    id: "ai",
    label: "AI / ML Tooling",
    items: ["LangChain", "Anthropic API", "OpenAI API", "Whisper"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React", "Next.js", "React Native", "Vue.js", "Tailwind CSS"],
  },
  {
    id: "systems",
    label: "Systems & Tooling",
    items: ["tree-sitter (AST)", "Celery", "BullMQ", "Socket.IO", "VS Code / Eclipse Extension APIs"],
  },
];
