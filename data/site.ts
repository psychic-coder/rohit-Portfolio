export const site = {
  name: "Rohit Ganguly",
  domain: "https://rohitganguly.dev",
  email: "rohit@rohitganguly.dev",
  github: "https://github.com/psychic-coder",
  // TODO: drop in your LinkedIn URL
  linkedin: "#",
  // TODO: place resume.pdf in /public and update if the filename differs
  resume: "/resume.pdf",
  tagline: "Systems-minded full-stack engineer — distributed systems, graph-augmented AI, developer tooling.",
  positioning:
    "I build infrastructure-grade software: rate limiters that survive Redis dying mid-request, retrieval systems that reason over code as a graph, and dashboards backed by real queue architecture.",
} as const;

export const navSections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
] as const;
