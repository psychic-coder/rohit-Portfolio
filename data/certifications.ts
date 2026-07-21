export interface Credential {
  title: string;
  issuer: string;
  kind: "certification" | "achievement";
}

export const credentials: Credential[] = [
  {
    title: "2nd Runner-Up — BITS Pilani × Postman API Hackathon 4.0",
    issuer: "BITS Pilani × Postman",
    kind: "achievement",
  },
  {
    title: "Design and Analysis of Algorithms (DAA)",
    issuer: "NPTEL",
    kind: "certification",
  },
  {
    title: "Data Structures and Algorithms in Java",
    issuer: "NPTEL",
    kind: "certification",
  },
  {
    title: "RH124 — System Administration I",
    issuer: "Red Hat",
    kind: "certification",
  },
  {
    title: "RH134 — System Administration II",
    issuer: "Red Hat",
    kind: "certification",
  },
  {
    title: "SQL Certification",
    issuer: "Oracle",
    kind: "certification",
  },
];
