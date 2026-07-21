export type MetricTone = "signal" | "chaos";

export interface Metric {
  /** Numeric value the counter animates to */
  value: number;
  /** Rendered after the number, e.g. "%" or "ms" */
  suffix?: string;
  /** Rendered before the number, e.g. "P@10 " */
  prefix?: string;
  /** Decimal places for the animated counter */
  decimals?: number;
  label: string;
  /** "chaos" (amber) is reserved for latency / chaos-test metrics */
  tone: MetricTone;
}

export interface Project {
  slug: string;
  title: string;
  kicker: string; // one-line category, e.g. "Distributed Rate Limiter"
  status: "shipped" | "in-progress" | "systems-design";
  summary: string;
  problem: string;
  architecture: string[]; // ordered narrative of the architecture / story
  metrics: Metric[];
  stack: string[];
  github: string;
  /** Leave "#" until the project is deployed to its subdomain */
  liveUrl: string;
  liveUrlNote?: string;
  /** Path under /public for a demo GIF/video poster. Placeholder until you record one. */
  demoMedia?: string;
}

export const projects: Project[] = [
  {
    slug: "shardroute",
    title: "ShardRoute",
    kicker: "Distributed Rate Limiter",
    status: "shipped",
    summary:
      "A Go rate limiter that stays correct under 200 concurrent goroutines and stays up when Redis doesn't — verified with k6 chaos tests, including a live Redis kill.",
    problem:
      "Rate limiters are easy to write and easy to get wrong. Under real concurrency, naive check-then-set logic double-counts or double-allows; and when the shared cache layer dies, most implementations either hard-fail every request or silently stop limiting. ShardRoute was built to be provably correct under concurrent load and to degrade gracefully — fail-open with bounded risk — when Redis is killed mid-traffic.",
    architecture: [
      "Token-bucket state lives in Redis; all read-modify-write logic is pushed into Lua scripts so each decision executes atomically server-side — no race window between check and consume.",
      "A Go service fronts Redis over gRPC and HTTP, sharding keys so hot tenants don't serialize behind one another.",
      "Correctness was verified head-on: 200 concurrent goroutines hammering one bucket, with exactly 100 requests allowed and 100 rejected — the bucket's math held under contention.",
      "Chaos testing with k6: Redis was killed live during a load run. The service fell back to a local fail-open path and maintained 96.8% uptime through the outage instead of collapsing.",
      "Moving decisions into Lua and off the request hot path cut P99 latency 81%, from 95ms to 18ms.",
    ],
    metrics: [
      { value: 81, suffix: "%", label: "P99 latency reduction (95ms → 18ms)", tone: "chaos" },
      { value: 96.8, suffix: "%", decimals: 1, label: "uptime during live Redis kill test", tone: "chaos" },
      { value: 200, label: "concurrent goroutines, 100/100 correct allow/reject", tone: "signal" },
    ],
    stack: ["Go", "Redis", "Lua", "gRPC", "HTTP", "k6"],
    github: "https://github.com/psychic-coder",
    liveUrl: "#", // TODO: https://shardroute.rohitganguly.dev once deployed
    liveUrlNote: "Live deploy pending — GitHub has the full chaos-test harness.",
  },
  {
    slug: "codesage",
    title: "CodeSage",
    kicker: "Graph-Augmented RAG Platform",
    status: "in-progress",
    summary:
      "Predicts the blast radius of a code change by combining a Neo4j knowledge graph with Qdrant vector search over AST-parsed codebases — not another chat-with-your-PDF wrapper.",
    problem:
      "Vector search alone treats a codebase as a bag of similar-looking chunks. It can find code that looks like your query; it can't tell you what breaks when you change it. Impact analysis needs structure — call graphs, imports, ownership — which embeddings throw away. CodeSage keeps both: the graph for structure, the vectors for semantics.",
    architecture: [
      "tree-sitter parses source into ASTs; functions, classes, imports and call relationships become nodes and edges in a Neo4j knowledge graph.",
      "The same units are embedded and indexed in Qdrant, so retrieval can start from semantic similarity and then walk the graph outward to find structurally connected code.",
      "Celery workers handle ingestion and re-indexing asynchronously so large repositories don't block the query path.",
      "LangChain orchestrates the hybrid retrieval: vector hits seed graph traversals, and the merged context feeds impact prediction.",
      "Evaluated directly: 87% impact-prediction accuracy and Graph Retrieval Precision@10 of 0.83. Azure deployment is planned.",
    ],
    metrics: [
      { value: 87, suffix: "%", label: "impact-prediction accuracy", tone: "signal" },
      { value: 0.83, decimals: 2, prefix: "P@10 ", label: "graph retrieval precision", tone: "signal" },
    ],
    stack: ["Neo4j", "Qdrant", "Celery", "LangChain", "tree-sitter", "Python", "Azure (planned)"],
    github: "https://github.com/psychic-coder",
    liveUrl: "#", // TODO: https://codesage.rohitganguly.dev once deployed
    liveUrlNote: "Azure deployment planned.",
  },
  {
    slug: "devpulse",
    title: "DevPulse",
    kicker: "Real-Time Developer Productivity Dashboard",
    status: "in-progress",
    summary:
      "A systems-design project wearing a dashboard's clothes: BullMQ job queues, background workers, and Socket.IO streaming push live productivity metrics from PostgreSQL/Redis to web and mobile.",
    problem:
      "Real-time dashboards usually cheat — polling loops, recomputing aggregates on every request, blocking the API while metrics crunch. DevPulse is built the way a production system would be: ingestion and aggregation run as background jobs, and clients get pushed deltas over WebSockets instead of asking again and again.",
    architecture: [
      "NestJS API with PostgreSQL as the source of truth and Redis for hot state and pub/sub.",
      "BullMQ queues decouple ingestion from aggregation: workers consume events, compute rollups, and never block the request path.",
      "Socket.IO streams computed deltas to a Next.js web client in real time; a React Native/Expo mobile app is in progress against the same API.",
      "Phases 1–10 are built and functional; Phase 11 — an 'OS Finder' feature — is designed and queued next.",
    ],
    metrics: [
      { value: 10, prefix: "Phases 1–", label: "built and functional (Phase 11 designed)", tone: "signal" },
    ],
    stack: ["NestJS", "PostgreSQL", "Redis", "BullMQ", "Socket.IO", "Next.js", "React Native", "Expo"],
    github: "https://github.com/psychic-coder",
    liveUrl: "#", // TODO: https://devpulse.rohitganguly.dev once deployed
    liveUrlNote: "Live deploy pending; mobile app in progress.",
  },
  {
    slug: "voice2bite",
    title: "Voice2Bite",
    kicker: "Voice-First Accessible Food Ordering — Systems Design / R&D",
    status: "systems-design",
    summary:
      "An accessibility-first ordering flow for visually impaired users, driven end-to-end by voice — plus an honest architecture roadmap: parts are built, parts are specified but not yet verified in production.",
    problem:
      "Food-ordering UIs assume you can see them. Voice2Bite inverts that: Whisper transcription and an LLM routing layer (OpenRouter) turn spoken intent into structured orders, with the entire flow navigable without a screen.",
    architecture: [
      "Next.js/Redux frontend; Node/Express backend with MongoDB for orders and Redis for session/cache state.",
      "A Python/Flask service runs Whisper for transcription and calls OpenRouter for intent extraction.",
      "Upgrade spec (designed, not yet production-verified — listed here honestly): circuit breaker pattern around the ML service, Qdrant-backed RAG for menu grounding, a Go rate-limit gateway derived from ShardRoute, a BullMQ async pipeline, and OpenTelemetry observability.",
    ],
    metrics: [],
    stack: ["Next.js", "Redux", "Node", "Express", "MongoDB", "Redis", "Flask", "Whisper", "OpenRouter"],
    github: "https://github.com/psychic-coder",
    liveUrl: "#",
    liveUrlNote: "Portfolio/R&D entry — upgrade phases are spec'd, not all production-verified.",
  },
];
