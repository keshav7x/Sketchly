"use client";

// Miniature whiteboard scenes. Each preview is a tiny, *legible* diagram —
// labeled nodes, columns and milestones — so you can tell at a glance
// whether you're looking at a mind map, an ER diagram or a kanban board.
// Deterministic seed keeps every board looking like itself.

import { ACCENTS, seeded, type PreviewKind } from "@/lib/workspace/data";
import { cn } from "@/lib/utils";

interface PreviewProps {
  kind: PreviewKind;
  accent?: number;
  seed?: string;
  className?: string;
}

const line = "stroke-zinc-300 dark:stroke-zinc-700";
const soft = "stroke-zinc-200 dark:stroke-zinc-800";
const card = "fill-white dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700";
const label = "fill-zinc-500 dark:fill-zinc-400";
const faint = "fill-zinc-200 dark:fill-zinc-800";

function Label({
  x,
  y,
  children,
  size = 8.5,
  anchor = "middle",
  weight = 600,
  fill,
}: {
  x: number;
  y: number;
  children: string;
  size?: number;
  anchor?: "middle" | "start";
  weight?: number;
  fill?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      className={fill ? undefined : label}
      fontFamily="inherit"
    >
      {children}
    </text>
  );
}

function Architecture({ accent }: { accent: string }) {
  const left = [
    { x: 20, y: 36, name: "App" },
    { x: 20, y: 104, name: "Web" },
  ];
  const right = [
    { x: 224, y: 36, name: "DB" },
    { x: 224, y: 104, name: "Cache" },
  ];
  return (
    <g>
      <line x1={96} y1={58} x2={128} y2={80} className={line} strokeWidth={1.6} />
      <line x1={96} y1={126} x2={128} y2={104} className={line} strokeWidth={1.6} />
      <line x1={200} y1={80} x2={224} y2={58} className={line} strokeWidth={1.6} />
      <line x1={200} y1={104} x2={224} y2={126} className={line} strokeWidth={1.6} />
      {[...left, ...right].map((n) => (
        <g key={n.name}>
          <rect x={n.x} y={n.y} width={76} height={44} rx={8} className={card} strokeWidth={1.5} />
          <Label x={n.x + 38} y={n.y + 26} size={9.5}>
            {n.name}
          </Label>
        </g>
      ))}
      <rect x={128} y={62} width={72} height={60} rx={9} fill={accent} />
      <Label x={164} y={88} size={10} fill="#fff">
        API
      </Label>
      <Label x={164} y={102} size={7} fill="#fff" weight={500}>
        v2 · live
      </Label>
      <circle cx={112} cy={69} r={3.2} fill={accent} />
    </g>
  );
}

function Flow({ accent }: { accent: string }) {
  const steps = ["Signup", "Verify", "Ship"];
  const ys = [18, 72, 126];
  return (
    <g>
      {steps.map((s, i) => (
        <g key={s}>
          {i < 2 && (
            <line x1={160} y1={ys[i]! + 34} x2={160} y2={ys[i]! + 48} className={line} strokeWidth={1.8} />
          )}
          {i < 2 && (
            <polygon points={`160,${ys[i]! + 54} 154,${ys[i]! + 46} 166,${ys[i]! + 46}`} fill={accent} />
          )}
          <rect
            x={106}
            y={ys[i]!}
            width={108}
            height={34}
            rx={i === 1 ? 17 : 9}
            fill={i === 0 ? accent : undefined}
            className={i === 0 ? undefined : card}
            strokeWidth={1.5}
          />
          <Label x={160} y={ys[i]! + 21.5} size={9.5} fill={i === 0 ? "#fff" : undefined}>
            {s}
          </Label>
        </g>
      ))}
      <rect x={228} y={72} width={64} height={34} rx={9} className={card} strokeWidth={1.3} strokeDasharray="5 4" />
      <Label x={260} y={93} size={8.5}>
        Invite
      </Label>
      <line x1={214} y1={89} x2={228} y2={89} className={line} strokeWidth={1.5} />
    </g>
  );
}

function Kanban({ accent }: { accent: string }) {
  const cols = [
    { x: 18, title: "To do", cards: 3 },
    { x: 116, title: "Doing", cards: 2 },
    { x: 214, title: "Done", cards: 2 },
  ];
  return (
    <g>
      {cols.map((c, ci) => (
        <g key={c.title}>
          <rect x={c.x} y={14} width={88} height={172} rx={10} className="fill-zinc-100 dark:fill-zinc-800/60" />
          <Label x={c.x + 44} y={31} size={8} anchor="middle">
            {c.title.toUpperCase()}
          </Label>
          {ci === 2 && <rect x={c.x + 10} y={22} width={68} height={3} rx={1.5} fill={accent} opacity={0.7} />}
          {Array.from({ length: c.cards }).map((_, r) => (
            <g key={r}>
              <rect x={c.x + 10} y={40 + r * 46} width={68} height={38} rx={6} className={card} strokeWidth={1.2} />
              {ci === 2 ? (
                <g>
                  <circle cx={c.x + 22} cy={59 + r * 46} r={6} fill={accent} opacity={0.9} />
                  <polyline
                    points={`${c.x + 19},${59 + r * 46} ${c.x + 21.4},${61.4 + r * 46} ${c.x + 25},${56.6 + r * 46}`}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                  <rect x={c.x + 33} y={56.6 + r * 46} width={32} height={4.6} rx={2.3} className={label} opacity={0.55} />
                </g>
              ) : (
                <g>
                  <rect x={c.x + 17} y={47 + r * 46} width={r === 1 ? 36 : 50} height={4.6} rx={2.3} className={label} opacity={0.7} />
                  <rect x={c.x + 17} y={56 + r * 46} width={28} height={4} rx={2} className={faint} />
                  {ci === 0 && r === 0 && <circle cx={c.x + 68} cy={50 + r * 46} r={5} fill={accent} />}
                </g>
              )}
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

function Mindmap({ accent, rand }: { accent: string; rand: () => number }) {
  const leaves = ["Design", "API", "Docs", "QA", "Ship", "Blog"];
  return (
    <g>
      {leaves.map((name, i) => {
        const a = (Math.PI * 2 * i) / leaves.length - Math.PI / 2 + (rand() - 0.5) * 0.25;
        const x2 = 160 + Math.cos(a) * 98;
        const y2 = 100 + Math.sin(a) * 64;
        return (
          <g key={name}>
            <line x1={160} y1={100} x2={x2} y2={y2} stroke={accent} strokeWidth={2} opacity={0.45} />
            <rect x={x2 - 32} y={y2 - 12} width={64} height={24} rx={12} className={card} strokeWidth={1.3} />
            <Label x={x2} y={y2 + 3.5} size={8}>
              {name}
            </Label>
          </g>
        );
      })}
      <rect x={116} y={80} width={88} height={40} rx={20} fill={accent} />
      <Label x={160} y={104} size={11} fill="#fff">
        Launch
      </Label>
    </g>
  );
}

function Wireframe({ accent }: { accent: string }) {
  return (
    <g>
      <rect x={40} y={18} width={240} height={164} rx={10} className={card} strokeWidth={1.5} />
      <line x1={40} y1={44} x2={280} y2={44} className={soft} strokeWidth={1.2} />
      <circle cx={56} cy={31} r={3.4} fill="#f87171" />
      <circle cx={68} cy={31} r={3.4} fill="#fbbf24" />
      <circle cx={80} cy={31} r={3.4} fill="#34d399" />
      <rect x={196} y={25} width={68} height={12} rx={6} className={faint} />
      <Label x={60} y={72} size={11} anchor="start" weight={700}>
        New landing page
      </Label>
      <rect x={60} y={82} width={96} height={5} rx={2.5} className={label} opacity={0.6} />
      <rect x={60} y={92} width={70} height={5} rx={2.5} className={faint} />
      <rect x={60} y={106} width={62} height={22} rx={7} fill={accent} />
      <Label x={91} y={120.5} size={8.5} fill="#fff">
        Sign up
      </Label>
      <rect x={130} y={106} width={62} height={22} rx={7} className={card} strokeWidth={1.3} />
      <Label x={161} y={120.5} size={8.5}>
        Demo
      </Label>
      <rect x={206} y={58} width={58} height={76} rx={8} fill={accent} opacity={0.14} />
      <rect x={206} y={58} width={58} height={76} rx={8} fill="none" stroke={accent} strokeWidth={1.3} strokeDasharray="4 3" />
      <Label x={235} y={100} size={8.5} fill={accent}>
        Hero img
      </Label>
      <rect x={60} y={140} width={60} height={24} rx={6} className={card} strokeWidth={1.2} />
      <rect x={128} y={140} width={60} height={24} rx={6} className={card} strokeWidth={1.2} />
      <rect x={196} y={140} width={60} height={24} rx={6} className={card} strokeWidth={1.2} />
    </g>
  );
}

function Notes({ accent }: { accent: string }) {
  const stickies = [
    { x: 26, y: 30, c: "#fde68a", t: "Idea", r: -3 },
    { x: 122, y: 24, c: "#bfdbfe", t: "Spike", r: 2 },
    { x: 216, y: 32, c: "#fecaca", t: "Risk", r: -2 },
  ];
  return (
    <g>
      {stickies.map((s) => (
        <g key={s.t} transform={`rotate(${s.r} ${s.x + 40} ${s.y + 40})`}>
          <rect x={s.x} y={s.y} width={80} height={80} rx={3} fill={s.c} />
          <rect x={s.x} y={s.y} width={80} height={20} rx={3} fill="#000" opacity={0.06} />
          <Label x={s.x + 40} y={s.y + 40} size={9} fill="#44403c">
            {s.t}
          </Label>
          <rect x={s.x + 12} y={s.y + 50} width={56} height={4} rx={2} fill="#44403c" opacity={0.25} />
          <rect x={s.x + 12} y={s.y + 58} width={40} height={4} rx={2} fill="#44403c" opacity={0.18} />
        </g>
      ))}
      <g transform="rotate(1.5 160 160)">
        <rect x={104} y={128} width={112} height={52} rx={7} className={card} strokeWidth={1.3} />
        <circle cx={122} cy={154} r={7} fill={accent} />
        <polyline points="119,154 121.6,156.6 125.4,152.4" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        <Label x={136} y={152} size={9} anchor="start">
          Decided: ship it
        </Label>
        <Label x={136} y={166} size={7.5} anchor="start" weight={500}>
          owner: you · fri
        </Label>
      </g>
    </g>
  );
}

function Timeline({ accent }: { accent: string }) {
  const ms = [
    { x: 40, name: "Kickoff", top: true },
    { x: 122, name: "v1", top: false, hot: true },
    { x: 204, name: "v2", top: true },
    { x: 280, name: "Launch", top: false },
  ];
  return (
    <g>
      <line x1={20} y1={100} x2={300} y2={100} className={line} strokeWidth={2} />
      {ms.map((m) => (
        <g key={m.name}>
          <circle
            cx={m.x}
            cy={100}
            r={m.hot ? 8.5 : 5.5}
            fill={m.hot ? accent : undefined}
            className={m.hot ? undefined : card}
            strokeWidth={2}
          />
          <line x1={m.x} y1={100} x2={m.x} y2={m.top ? 76 : 124} className={soft} strokeWidth={1.3} />
          <rect
            x={m.x - 36}
            y={m.top ? 30 : 124}
            width={72}
            height={46}
            rx={8}
            fill={m.hot ? accent : undefined}
            className={m.hot ? undefined : card}
            strokeWidth={1.3}
          />
          <Label x={m.x} y={(m.top ? 30 : 124) + 20} size={9} fill={m.hot ? "#fff" : undefined}>
            {m.name}
          </Label>
          <Label x={m.x} y={(m.top ? 30 : 124) + 34} size={7} fill={m.hot ? "#fff" : undefined} weight={500}>
            {m.hot ? "in progress" : "done"}
          </Label>
        </g>
      ))}
    </g>
  );
}

function Erd({ accent }: { accent: string }) {
  const tables = [
    { x: 20, y: 44, name: "users", rows: 3 },
    { x: 126, y: 24, name: "orders", rows: 4 },
    { x: 228, y: 64, name: "items", rows: 3 },
  ];
  return (
    <g>
      <line x1={94} y1={76} x2={126} y2={64} className={line} strokeWidth={1.5} />
      <line x1={200} y1={72} x2={228} y2={90} className={line} strokeWidth={1.5} />
      <circle cx={110} cy={70} r={3} fill={accent} />
      <circle cx={214} cy={81} r={3} fill={accent} />
      {tables.map((t, i) => (
        <g key={t.name}>
          <rect x={t.x} y={t.y} width={72} height={24 + t.rows * 13} rx={7} className={card} strokeWidth={1.4} />
          <rect x={t.x} y={t.y} width={72} height={24} rx={7} fill={accent} opacity={i === 1 ? 0.9 : 0.35} />
          <Label x={t.x + 36} y={t.y + 16} size={8.5} fill={i === 1 ? "#fff" : undefined}>
            {t.name}
          </Label>
          {Array.from({ length: t.rows }).map((_, r) => (
            <g key={r}>
              <circle
                cx={t.x + 13}
                cy={t.y + 34 + r * 13}
                r={2.4}
                fill={r === 0 ? accent : undefined}
                className={r === 0 ? undefined : faint}
              />
              <rect x={t.x + 21} y={t.y + 31.6 + r * 13} width={42 - (r % 3) * 8} height={4.4} rx={2.2} className={faint} />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

export default function BoardPreview({ kind, accent = 0, seed = "x", className }: PreviewProps) {
  const color = ACCENTS[accent % ACCENTS.length]!;
  const rand = seeded(`${kind}-${seed}`);
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <rect x={0} y={0} width={320} height={200} className="fill-white dark:fill-zinc-900" />
      <pattern id={`dots-${kind}-${seed}`} width={18} height={18} patternUnits="userSpaceOnUse">
        <circle cx={1.4} cy={1.4} r={1.1} className="fill-zinc-200/80 dark:fill-zinc-800" />
      </pattern>
      <rect x={0} y={0} width={320} height={200} fill={`url(#dots-${kind}-${seed})`} />
      {kind === "architecture" && <Architecture accent={color} />}
      {kind === "flow" && <Flow accent={color} />}
      {kind === "kanban" && <Kanban accent={color} />}
      {kind === "mindmap" && <Mindmap accent={color} rand={rand} />}
      {kind === "wireframe" && <Wireframe accent={color} />}
      {kind === "notes" && <Notes accent={color} />}
      {kind === "timeline" && <Timeline accent={color} />}
      {kind === "erd" && <Erd accent={color} />}
    </svg>
  );
}
