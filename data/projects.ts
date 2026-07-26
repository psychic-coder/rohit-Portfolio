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
    slug: "matching-engine",
    title: "Limit Order Book Matching Engine",
    kicker: "Real-Time Exchange Core",
    status: "shipped",
    summary:
      "A Go matching engine with strict price-time priority, one lock-free order book per symbol, write-ahead logged to Redis Streams. 2,300 orders/sec sustained at 0.11 ms p50, and a byte-identical book after kill -9.",
    problem:
      "A matching engine is one of the few systems where correctness is not negotiable and latency is the product. Two orders at the same price must fill in the order they arrived, an acknowledged fill can never be lost, and a stale quote is a quote someone else picks off. The hard part isn't the matching algorithm — it's staying exact under concurrency, surviving a crash without inventing or losing state, and refusing work honestly when the durability layer is down.",
    architecture: [
      "Each symbol's order book is owned by exactly one goroutine; orders reach it through a buffered channel. The book itself contains no locks, no atomics, and no synchronization at all — nothing else can ever touch it. Reads go through the same channel for the same reason.",
      "Prices are integer ticks, never floats: matching is driven by equality and ordering on price, so an approximate representation would make the engine's central decision approximate. Decimal strings are parsed to ticks once at the API boundary without ever constructing a float.",
      "Time priority is a sequence number assigned by the single writer, not a wall-clock timestamp — clocks move backwards under NTP and collide at nanosecond resolution. A counter is a total order by construction, and reproducible during replay.",
      "Price levels are a hash map plus a sorted linked list with a cached best pointer: O(1) best bid/ask, O(1) add at an existing level, O(1) teardown, and ordered iteration for sweeps and snapshots. New-level insert is O(k) from the touch — benchmarked adversarially at 5.7 µs to price the trade-off honestly.",
      "The WAL logs commands, not outcomes, because matching is deterministic — replaying the same command sequence rebuilds the same book including queue positions. Writes are group-committed: one Redis round-trip amortized across every command that arrived while the previous batch was in flight, so the batch grows exactly when load rises.",
      "Durability is fail-closed. When the WAL goes down the engine sheds writes with 503 rather than acknowledging fills it can't recover; /health flips to 503 so the load balancer pulls the instance. A 15s injected outage shed 12,010 orders cleanly while reads stayed 100% available at 1.48 ms p99, and intake recovered in 1 ms.",
      "Market data is snapshot-then-delta over WebSocket with per-message sequence numbers and bounded per-client buffers — a consumer that can't keep up is disconnected rather than allowed to backpressure the match loop. 599,950 frames to 50 concurrent clients with zero sequence gaps.",
      "The single-writer model was benchmarked against the obvious alternative rather than assumed: a per-book mutex is actually faster for synchronous request/reply (272 ns vs 904 ns at 8 symbols). The shard model earns its place on group-commit batching, symbol isolation, non-blocking reads, and deterministic replay ordering — not raw round-trip speed.",
    ],
    metrics: [
      { value: 0.11, decimals: 2, suffix: " ms", label: "p50 order-to-ack (7.38 ms p99)", tone: "chaos" },
      { value: 4.15, decimals: 2, suffix: " ms", label: "p99 order-to-broadcast, 50 WS clients", tone: "chaos" },
      { value: 2314, label: "orders/sec sustained, zero rejections", tone: "signal" },
      { value: 1.2, decimals: 1, suffix: " s", label: "kill -9 recovery, byte-identical book", tone: "signal" },
    ],
    stack: [
      "Go",
      "Redis Streams",
      "WebSocket",
      "Next.js",
      "k6",
      "Fly.io",
      "Upstash",
      "Docker",
    ],
    github: "https://github.com/psychic-coder/Real-Time-Limit-Order-Book-Matching-Engine",
    liveUrl: "#",
    liveUrlNote:
      "Live deploy pending — GitHub has the full load-test and crash-recovery harness.",
  },
  {
    slug: "fraud-detection",
    title: "Fraud & Ring Detection Engine",
    kicker: "Real-Time Streaming Risk Pipeline",
    status: "shipped",
    summary:
      "Scores every transaction in real time against three independent fraud signals — an online-learning model, a Neo4j ring detector, and a Qdrant synthetic-identity check — then merges them into one ALLOW / REVIEW / DECLINE decision. Twelve containers, one docker compose up.",
    problem:
      "A single fraud signal is either too noisy to act on or too conservative to catch anything. A behavioral model flags an odd transaction but can't see that six accounts share one device; a graph finds the ring but not the one-off anomaly; neither notices a synthetic identity reusing the same fingerprint. The engineering problem is running all three concurrently over one event stream, at transaction speed, and still returning a decision when one of them is down.",
    architecture: [
      "A PaySim-grounded simulator emits payment events into a Redis Stream. Three consumer groups read the same stream in parallel and produce independent signals, so adding a detector never slows the ones already there.",
      "Behavioral signal: a River online logistic classifier does predict_proba_one then learn_one on every transaction's ground-truth label — the model adapts as fraud patterns drift instead of going stale between retrains.",
      "Relational signal: accounts, devices and IPs are upserted into Neo4j, and a scheduled Louvain community-detection pass surfaces dense clusters of accounts sharing devices and IPs. A community counts as a ring only at size ≥ 3 and intra-community density ≥ 0.4 — the size floor drops coincidental pairs, the density floor drops communities Louvain groups for modularity that aren't actually collusive.",
      "Identity signal: each transaction is feature-hash embedded and looked up in Qdrant by cosine nearest neighbor. The 0.92 threshold is deliberately high — genuinely distinct fingerprints rarely exceed ~0.9, so it targets real near-duplicate reuse rather than manufacturing false positives.",
      "A NestJS orchestrator consumes the scored stream and enriches each event by calling the graph and similarity services over HTTP, each wrapped in an opossum circuit breaker. The merge policy refuses to auto-decline on one soft signal: a very high ML score declines alone, a merely suspicious score declines only when corroborated by a structural signal, and anything mildly suspicious goes to human review.",
      "Fail-open with degraded scoring, implemented rather than improvised: when an enrichment service goes slow or dies the breaker trips, the orchestrator drops that signal, stamps degraded: true on the decision, and keeps deciding on what's left. No transaction stalls waiting on a dead dependency.",
      "Every application service is stateless — all shared state lives in Redis, Neo4j or Qdrant, never a process global — so replicas scale horizontally and Redis consumer groups hand disjoint entries to each one with no double-processing.",
      "Decisions stream to a Next.js dashboard over WebSocket with auto-reconnect: live feed, flagged panel, force-directed ring visualization, and throughput/latency metrics. The whole stack — Redis, Neo4j, Qdrant, five services and a k6 runner — comes up from a single compose file with nothing installed on the host.",
    ],
    metrics: [],
    stack: [
      "Python",
      "FastAPI",
      "River",
      "NestJS",
      "TypeScript",
      "Redis Streams",
      "Neo4j",
      "Qdrant",
      "Next.js",
      "k6",
      "Docker Compose",
    ],
    github: "https://github.com/psychic-coder/Real-Time-Fraud-Detection-Engine",
    liveUrl: "#",
    liveUrlNote:
      "Runs locally from one compose file — GitHub has the full stack, tests and chaos harness.",
  },
  {
    slug: "sharedroute",
    title: "SharedRoute",
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
    github: "https://github.com/psychic-coder/SharedRoute",
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
      "tree-sitter parses source into ASTs across multiple languages; functions, classes, imports and call relationships become nodes and edges in a Neo4j knowledge graph, with cross-language symbol normalization.",
      "The same units are chunked, embedded, and indexed in Qdrant, so retrieval can start from semantic similarity and then walk the graph outward to find structurally connected code.",
      "Celery workers on a Redis broker handle GitHub repo ingestion, embedding generation, and heavy analysis asynchronously so large repositories don't block the query path.",
      "Propagation and risk scorers rank high-impact changes to prioritize tests and reviews; a RAG layer combines vector retrieval with OpenRouter LLM prompts to produce human-readable impact explanations and recommendations.",
      "A FastAPI backend (REST + WebSocket) serves it over PostgreSQL for projects, jobs and users, with Alembic migrations and a Next.js/TypeScript frontend; the whole stack runs on Docker Compose and is tested in CI via GitHub Actions.",
      "Evaluated directly: 87% impact-prediction accuracy and Graph Retrieval Precision@10 of 0.83.",
    ],
    metrics: [
      { value: 87, suffix: "%", label: "impact-prediction accuracy", tone: "signal" },
      { value: 0.83, decimals: 2, prefix: "P@10 ", label: "graph retrieval precision", tone: "signal" },
    ],
    stack: [
      "Python 3.11",
      "FastAPI",
      "Neo4j",
      "Qdrant",
      "PostgreSQL",
      "Celery",
      "Redis",
      "tree-sitter",
      "OpenRouter",
      "Next.js",
      "Docker",
      "GitHub Actions",
    ],
    github: "https://github.com/psychic-coder/CodeSage",
    liveUrl: "#", // TODO: https://codesage.rohitganguly.dev once deployed
    liveUrlNote: "Live deploy pending — GitHub has the full Dockerized stack and CI.",
  },
  {
    slug: "devpulse",
    title: "DevPulse",
    kicker: "AI-Powered Developer Intelligence Platform",
    status: "shipped",
    summary:
      "Connects to your GitHub, turns your commit/PR history into insights, and — via its flagship OS Finder — ranks open-source repos by how friendly they are to new contributors. A three-service Dockerized monorepo with real-time sync and three distinct AI features.",
    problem:
      "GitHub knows everything about how you code but tells you almost nothing useful about it, and finding a realistic open-source project to contribute to is mostly guesswork. DevPulse closes both gaps: it mines your own activity for patterns and surfaces perfectly-matched repos scored on real contributor-friendliness signals — not just star counts.",
    architecture: [
      "A monorepo of three independent services orchestrated via Docker Compose: a Next.js 14 frontend, a NestJS 11 backend, and a Python/Flask analytics microservice, over PostgreSQL 15 and Redis 7.",
      "GitHub OAuth 2.0 through Passport.js issues short-lived JWT access tokens (15m) plus refresh tokens (7d) with silent refresh; each user's GitHub token is stored encrypted with crypto-js.",
      "A sync engine pulls repos, commits and PRs from the GitHub REST API on a node-cron schedule (every 6h), while Socket.IO streams live sync progress to the dashboard; the Flask service computes commit patterns and language distribution behind the heatmaps and streak charts.",
      "OpenRouter (GPT-4o-mini) powers three AI features: weekly markdown activity digests, automatic 1–10 PR quality scoring on every synced PR, and OS Finder's natural-language → structured-filter query builder — which falls back to regex keyword matching on a 15s timeout.",
      "OS Finder, the flagship, ranks GitHub search results by a custom NCF (New Contributor Friendliness) score out of 10 — weighing good-first-issues, maintainer response time, CONTRIBUTING.md, PR merge rate and more — alongside repo-health flags (archived, stale, fork-heavy), with per-language parallel search and Redis-cached results.",
      "Persistence is PostgreSQL via TypeORM with migrations run on startup; the watchlist stores each repo's full NCF breakdown as jsonb, and search history is retained for reuse.",
    ],
    metrics: [],
    stack: [
      "NestJS",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "TypeORM",
      "Redis",
      "Socket.IO",
      "Passport.js",
      "JWT",
      "OpenRouter",
      "node-cron",
      "Python",
      "Flask",
      "Docker",
    ],
    github: "https://github.com/psychic-coder/DevPulse",
    liveUrl: "#", // TODO: https://devpulse.rohitganguly.dev once deployed
    liveUrlNote: "Live deploy pending — full Dockerized monorepo on GitHub.",
  },
  {
    slug: "voice2bite",
    title: "Voice2Bite",
    kicker: "Voice-First Accessible Food Ordering Platform",
    status: "shipped",
    summary:
      "An accessibility-first food ordering platform for visually impaired users, driven end-to-end by voice — Whisper STT, Qdrant RAG menu lookup, a resilient Node API gateway, and an async order pipeline with real-time audio announcements, all wired across three Dockerized services.",
    problem:
      "Food-ordering UIs assume you can see them — nested categories, image menus, micro-interactions. Voice2Bite inverts that: the entire flow is operable by voice, with earcons and text-to-speech guiding the user through every order state. Under the hood it's a real distributed system — a Node gateway, a Python AI service, and async workers — that had to stay available and fast even when the expensive AI/LLM path degrades.",
    architecture: [
      "Next.js/React + Redux frontend captures speech via the Web Audio API with Voice Activity Detection, plays earcons for state changes, and reads results back through the browser's speechSynthesis TTS.",
      "A Node.js/Express API gateway orchestrates everything: Prisma over PostgreSQL for the relational core, Redis for hot state, plus the BullMQ pipeline and live Socket.IO connections.",
      "A Python/Flask AI service runs OpenAI Whisper for transcription, queries a Qdrant vector DB for semantic menu retrieval ('a cold drink' → 'Iced Lemon Tea'), and parses intent via Gemini through OpenRouter.",
      "Resilience is built in: pybreaker circuit breakers fail open around the AI/OpenRouter path so requests never hang, and an atomic Redis + Lua token-bucket rate limiter throttles expensive transcription/LLM calls, returning 429 on excess without race conditions.",
      "Orders run asynchronously — placeOrder returns 202 Accepted with a trackingId, a BullMQ worker processes the transaction, and Socket.IO streams RECEIVED → PREPARING → READY updates that the frontend announces aloud via TTS.",
      "Full-stack observability with OpenTelemetry (OTLP) distributed tracing across the gateway and AI backend, aggregated in Jaeger to profile STT, LLM, and routing latency; the whole stack boots from a single docker-compose command.",
    ],
    metrics: [],
    stack: [
      "Next.js",
      "Redux",
      "Node",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "BullMQ",
      "Socket.IO",
      "Flask",
      "Whisper",
      "Qdrant",
      "OpenRouter",
      "OpenTelemetry",
      "Jaeger",
      "Docker",
    ],
    github: "https://github.com/psychic-coder/Voice2Bite",
    liveUrl: "#",
    liveUrlNote: "Live deploy pending — GitHub has the full Dockerized stack and verification scripts.",
  },
  {
    slug: "chatapp",
    title: "Real-Time Chat Application",
    kicker: "Full-Stack Real-Time Messaging Platform",
    status: "shipped",
    summary:
      "A full-stack real-time messaging platform supporting concurrent multi-user sessions over Socket.IO, with room-based event handling, instant delivery, and an admin analytics dashboard.",
    problem:
      "Real-time chat is where naive request/response architecture falls apart — messages need to reach every participant instantly, media has to be stored and served without bloating the app, and admins need visibility into engagement. This project was built to handle concurrent multi-user sessions end-to-end while keeping auth secure and media delivery fast.",
    architecture: [
      "Socket.IO drives concurrent multi-user sessions with room-based event handling, so messages route only to the relevant participants and land instantly.",
      "JWT-based authentication secures every session; Cloudinary CDN with Multer handles multipart media uploads and optimizes storage and delivery.",
      "An admin analytics dashboard built with Chart.js visualizes message volume, user engagement metrics, and active session counts.",
      "Realistic production-like data was seeded with Faker.js; the UI is responsive and animated using TailwindCSS, MUI, and Framer Motion for smooth transitions.",
    ],
    metrics: [],
    stack: [
      "React",
      "Redux Toolkit",
      "Socket.IO",
      "Express.js",
      "MongoDB",
      "Cloudinary",
      "JWT",
      "Chart.js",
      "TailwindCSS",
      "Framer Motion",
    ],
    github: "https://github.com/psychic-coder/ChatApp",
    liveUrl: "#",
    liveUrlNote: "Source on GitHub.",
  },
];
