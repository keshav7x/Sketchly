// ---------------------------------------------------------------------------
// SketchLy workspace dummy data.
//
// Frontend-only: everything here is local mock data. No fetching, no API,
// no backend of any kind. The store in ./store.tsx keeps a useState copy
// of the boards/tags/workspaces below so every interaction stays in memory.
// ---------------------------------------------------------------------------

export type PreviewKind =
  | "architecture"
  | "flow"
  | "kanban"
  | "mindmap"
  | "wireframe"
  | "notes"
  | "timeline"
  | "erd";

export interface WorkspaceT {
  id: string;
  name: string;
  description: string;
  members: number;
  gradient: number;
}

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  owner: string;
  updatedAt: string;
  openedAt: string;
  tags: string[];
  favorite: boolean;
  preview: PreviewKind;
  accent: number;
}

export interface TemplateT {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  preview: PreviewKind;
  accent: number;
}

export interface TagT {
  id: string;
  name: string;
}

export interface SharedBoard {
  id: string;
  name: string;
  owner: string;
  ownerInitials: string;
  sharedAt: string;
  access: "edit" | "view";
  preview: PreviewKind;
  accent: number;
  tags: string[];
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  time: string;
}

/** Muted, premium accents used sparingly inside previews. */
export const ACCENTS = [
  "#6366f1",
  "#0d9488",
  "#d97706",
  "#e11d48",
  "#0284c7",
  "#7c3aed",
];

export const WORKSPACES: WorkspaceT[] = [
  { id: "ws-personal", name: "Personal", description: "Your private visual space.", members: 1, gradient: 0 },
  { id: "ws-eng", name: "Engineering", description: "Systems, services and infra.", members: 6, gradient: 1 },
  { id: "ws-design", name: "Design Team", description: "Flows, audits and explorations.", members: 4, gradient: 5 },
  { id: "ws-side", name: "Side Projects", description: "Experiments and weekend builds.", members: 2, gradient: 2 },
];

const H = 3_600_000;
const D = 24 * H;
const now = Date.now();
const ago = (ms: number) => new Date(now - ms).toISOString();

export const INITIAL_BOARDS: Board[] = [
  // Personal
  { id: "b-startup-ideas", workspaceId: "ws-personal", name: "Startup Ideas", owner: "Keshav", updatedAt: ago(2 * H), openedAt: ago(25 * 60_000), tags: ["ideas", "startup"], favorite: true, preview: "mindmap", accent: 2 },
  { id: "b-sys-notes", workspaceId: "ws-personal", name: "System Design Notes", owner: "Keshav", updatedAt: ago(5 * H), openedAt: ago(3 * H), tags: ["architecture", "college"], favorite: false, preview: "notes", accent: 0 },
  { id: "b-rn-flow", workspaceId: "ws-personal", name: "React Native App Flow", owner: "Keshav", updatedAt: ago(1 * D), openedAt: ago(7 * H), tags: ["frontend"], favorite: true, preview: "flow", accent: 4 },
  { id: "b-ai-roadmap", workspaceId: "ws-personal", name: "AI Engineering Roadmap", owner: "Keshav", updatedAt: ago(2 * D), openedAt: ago(1 * D + 2 * H), tags: ["ai"], favorite: false, preview: "timeline", accent: 5 },
  // Engineering
  { id: "b-dist-arch", workspaceId: "ws-eng", name: "Distributed Systems Architecture", owner: "Aarav", updatedAt: ago(40 * 60_000), openedAt: ago(50 * 60_000), tags: ["architecture", "backend"], favorite: true, preview: "architecture", accent: 0 },
  { id: "b-rag", workspaceId: "ws-eng", name: "RAG Pipeline", owner: "Keshav", updatedAt: ago(4 * H), openedAt: ago(90 * 60_000), tags: ["ai", "backend"], favorite: false, preview: "flow", accent: 1 },
  { id: "b-postman", workspaceId: "ws-eng", name: "Postman Clone Architecture", owner: "Keshav", updatedAt: ago(26 * H), openedAt: ago(2 * D), tags: ["architecture", "backend", "frontend"], favorite: false, preview: "architecture", accent: 4 },
  { id: "b-db-design", workspaceId: "ws-eng", name: "Database Design", owner: "Meera", updatedAt: ago(3 * D), openedAt: ago(3 * D), tags: ["backend", "college"], favorite: false, preview: "erd", accent: 3 },
  // Design
  { id: "b-onboarding", workspaceId: "ws-design", name: "Onboarding Flow", owner: "Meera", updatedAt: ago(8 * H), openedAt: ago(6 * H), tags: ["frontend"], favorite: false, preview: "wireframe", accent: 5 },
  { id: "b-ds-audit", workspaceId: "ws-design", name: "Design System Audit", owner: "Ishaan", updatedAt: ago(4 * D), openedAt: ago(5 * D), tags: ["frontend"], favorite: false, preview: "kanban", accent: 2 },
  // Side projects
  { id: "b-indie", workspaceId: "ws-side", name: "Indie Hacker Notes", owner: "Keshav", updatedAt: ago(6 * D), openedAt: ago(6 * D), tags: ["ideas", "startup"], favorite: false, preview: "notes", accent: 2 },
  { id: "b-landing", workspaceId: "ws-side", name: "Landing Page Concept", owner: "Keshav", updatedAt: ago(8 * D), openedAt: ago(9 * D), tags: ["startup", "frontend"], favorite: false, preview: "wireframe", accent: 3 },
];

export const INITIAL_TAGS: TagT[] = [
  { id: "t-architecture", name: "architecture" },
  { id: "t-backend", name: "backend" },
  { id: "t-frontend", name: "frontend" },
  { id: "t-ai", name: "ai" },
  { id: "t-ideas", name: "ideas" },
  { id: "t-college", name: "college" },
  { id: "t-startup", name: "startup" },
];

export const TEMPLATE_CATEGORIES = ["Engineering", "Product", "Brainstorming", "Planning"] as const;

export const TEMPLATES: TemplateT[] = [
  { id: "tpl-sys-arch", name: "System Architecture", description: "Map services, data stores and traffic between them.", category: "Engineering", tags: ["architecture", "backend"], author: "SketchLy Team", preview: "architecture", accent: 0 },
  { id: "tpl-micro", name: "Microservices Architecture", description: "Bounded contexts, contracts and event flows.", category: "Engineering", tags: ["architecture", "backend"], author: "Aarav", preview: "architecture", accent: 4 },
  { id: "tpl-erd", name: "ER Diagram", description: "Tables, keys and relationships at a glance.", category: "Engineering", tags: ["backend"], author: "Meera", preview: "erd", accent: 3 },
  { id: "tpl-seq", name: "Sequence Diagram", description: "Trace requests across services over time.", category: "Engineering", tags: ["backend"], author: "SketchLy Team", preview: "flow", accent: 1 },
  { id: "tpl-api", name: "API Design", description: "Sketch endpoints, payloads and error cases.", category: "Engineering", tags: ["backend", "frontend"], author: "Keshav", preview: "flow", accent: 5 },
  { id: "tpl-journey", name: "User Journey", description: "Follow a persona from discovery to delight.", category: "Product", tags: ["frontend"], author: "Meera", preview: "timeline", accent: 2 },
  { id: "tpl-userflow", name: "User Flow", description: "Screens, decisions and edge cases in one flow.", category: "Product", tags: ["frontend"], author: "SketchLy Team", preview: "flow", accent: 4 },
  { id: "tpl-roadmap", name: "Product Roadmap", description: "Now, next and later on a shared timeline.", category: "Product", tags: ["startup"], author: "Keshav", preview: "timeline", accent: 5 },
  { id: "tpl-feature", name: "Feature Planning", description: "Scope, risks and rollout for a new feature.", category: "Product", tags: ["startup"], author: "SketchLy Team", preview: "kanban", accent: 2 },
  { id: "tpl-mindmap", name: "Mind Map", description: "Explode one idea into a tree of possibilities.", category: "Brainstorming", tags: ["ideas"], author: "SketchLy Team", preview: "mindmap", accent: 2 },
  { id: "tpl-brainstorm", name: "Brainstorm", description: "A free canvas for fast, messy thinking.", category: "Brainstorming", tags: ["ideas"], author: "Meera", preview: "notes", accent: 3 },
  { id: "tpl-affinity", name: "Affinity Mapping", description: "Cluster sticky notes into themes.", category: "Brainstorming", tags: ["ideas"], author: "Ishaan", preview: "kanban", accent: 1 },
  { id: "tpl-retro", name: "Retrospective", description: "Went well, didn't, and action items.", category: "Brainstorming", tags: ["startup"], author: "SketchLy Team", preview: "notes", accent: 0 },
  { id: "tpl-kanban", name: "Kanban Board", description: "Backlog to done, visually.", category: "Planning", tags: ["startup"], author: "SketchLy Team", preview: "kanban", accent: 1 },
  { id: "tpl-timeline", name: "Timeline", description: "Milestones and deadlines on one line.", category: "Planning", tags: ["startup"], author: "Keshav", preview: "timeline", accent: 4 },
  { id: "tpl-swot", name: "SWOT Analysis", description: "Strengths, weaknesses, opportunities, threats.", category: "Planning", tags: ["startup", "ideas"], author: "Meera", preview: "mindmap", accent: 3 },
];

export const SHARED_BOARDS: SharedBoard[] = [
  { id: "s-mobile", name: "Mobile App Redesign", owner: "Meera Nair", ownerInitials: "MN", sharedAt: ago(1 * D), access: "edit", preview: "wireframe", accent: 5, tags: ["frontend"] },
  { id: "s-hiring", name: "Hiring Plan FY26", owner: "Aarav Shah", ownerInitials: "AS", sharedAt: ago(3 * D), access: "view", preview: "kanban", accent: 1, tags: ["startup"] },
  { id: "s-launch", name: "Launch Checklist", owner: "Ishaan Rao", ownerInitials: "IR", sharedAt: ago(5 * D), access: "edit", preview: "notes", accent: 2, tags: ["startup", "ideas"] },
];

export const NOTICES: Notice[] = [
  { id: "n-1", title: "Meera shared a board", body: "Mobile App Redesign — you now have edit access.", time: ago(2 * H) },
  { id: "n-2", title: "New template: API Design", body: "Sketch endpoints and payloads faster.", time: ago(1 * D) },
  { id: "n-3", title: "Weekly recap", body: "You opened 6 boards across 3 workspaces.", time: ago(2 * D) },
];

export const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function fullDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** Deterministic PRNG so previews look the same on every render. */
export function seeded(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
