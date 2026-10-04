"use client";

// Miniature whiteboard scenes. Each preview is a tiny SVG composition of
// nodes, lines, cards and type — never a generic gradient — rendered with a
// deterministic seed so a board always looks like itself.

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
const card = "fill-white dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-700";
const ink = "fill-zinc-300 dark:fill-zinc-700";
const faint = "fill-zinc-200 dark:fill-zinc-800";

function Lines({ x, y, widths, gap = 7 }: { x: number; y: number; widths: number[]; gap?: number }) {
  return (
    <g>
      {widths.map((w, i) => (
        <rect key={i} x={x} y={y + i * gap} width={w} height={3.4} rx={1.7} className={i === 0 ? ink : faint} />
      ))}
    </g>
  );
}

function Node({ x, y, w, h, accent, label }: { x: number; y: number; w: number; h: number; accent: string; label?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} className={card} strokeWidth={1.4} />
      <circle cx={x + 11} cy={y + 11} r={4} fill={accent} opacity={0.85} />
      {label && <rect x={x + 20} y={y + 8.6} width={w - 28} height={4.6} rx={2.3} className={ink} />}
    </g>
  );
}

function Architecture({ accent, rand }: { accent: string; rand: () => number }) {
  const nodes = [
    { x: 24, y: 30, w: 74, h: 40 },
    { x: 122, y: 18, w: 74, h: 40 },
    { x: 122, y: 76, w: 74, h: 40 },
    { x: 220, y: 30, w: 74, h: 40 },
    { x: 220, y: 88, w: 74, h: 40 },
  ];
  return (
    <g>
      <line x1={98} y1={50} x2={122} y2={38} className={line} strokeWidth={1.4} />
      <line x1={98} y1={50} x2={122} y2={96} className={line} strokeWidth={1.4} />
      <line x1={196} y1={38} x2={220} y2={50} className={line} strokeWidth={1.4} />
      <line x1={196} y1={96} x2={220} y2={108} className={line} strokeWidth={1.4} />
      {nodes.map((n, i) => (
        <Node key={i} {...n} accent={i === 1 ? accent : "#a1a1aa"} label />
      ))}
      <circle cx={98} cy={50} r={3} fill={accent} />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={30 + rand() * 260} cy={140 + rand() * 40} r={2.4} className={ink} opacity={0.7} />
      ))}
      <line x1={24} y1={160} x2={296} y2={160} className={soft} strokeWidth={1.2} strokeDasharray="4 4" />
    </g>
  );
}

function Flow({ accent, rand }: { accent: string; rand: () => number }) {
  void rand;
  const ys = [16, 66, 116];
  return (
    <g>
      {ys.map((y, i) => (
        <g key={i}>
          {i < 2 && <line x1={160} y1={y + 30} x2={160} y2={y + 50} className={line} strokeWidth={1.6} />}
          {i < 2 && <polygon points={`160,${y + 56} 155,${y + 48} 165,${y + 48}`} fill={accent} />}
          {i === 1 ? (
            <g>
              <polygon points={`160,${y} 196,${y + 15} 160,${y + 30} 124,${y + 15}`} className={card} strokeWidth={1.4} />
              <polygon points={`160,${y} 196,${y + 15} 160,${y + 30} 124,${y + 15}`} fill={accent} opacity={0.14} stroke="none" />
            </g>
          ) : (
            <g>
              <rect x={112} y={y} width={96} height={30} rx={8} className={card} strokeWidth={1.4} />
              {i === 0 && <rect x={112} y={y} width={96} height={30} rx={8} fill={accent} opacity={0.16} stroke="none" />}
            </g>
          )}
        </g>
      ))}
      <rect x={216} y={66} width={62} height={30} rx={8} className={card} strokeWidth={1.2} strokeDasharray="4 3" />
      <line x1={196} y1={81} x2={216} y2={81} className={line} strokeWidth={1.4} />
    </g>
  );
}

function Kanban({ accent }: { accent: string }) {
  const cols = [18, 116, 214];
  return (
    <g>
      {cols.map((x, c) => (
        <g key={c}>
          <rect x={x} y={14} width={88} height={172} rx={9} className="fill-zinc-100 dark:fill-zinc-800/60" />
          <rect x={x + 10} y={24} width={c === 0 ? 44 : 34} height={6} rx={3} fill={c === 0 ? accent : undefined} className={c === 0 ? undefined : ink} opacity={c === 0 ? 0.85 : 1} />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <rect x={x + 10} y={40 + r * 46} width={68} height={38} rx={6} className={card} strokeWidth={1.2} />
              <rect x={x + 17} y={47 + r * 46} width={r === 1 ? 40 : 52} height={4.4} rx={2.2} className={ink} />
              <rect x={x + 17} y={56 + r * 46} width={30} height={4} rx={2} className={faint} />
              {c === 0 && r === 0 && <circle cx={x + 68} cy={51 + r * 46} r={5} fill={accent} opacity={0.9} />}
            </g>
          )).slice(0, c === 2 ? 2 : 3)}
        </g>
      ))}
    </g>
  );
}

function Mindmap({ accent, rand }: { accent: string; rand: () => number }) {
  const branches = 6;
  return (
    <g>
      {Array.from({ length: branches }).map((_, i) => {
        const a = (Math.PI * 2 * i) / branches - Math.PI / 2 + (rand() - 0.5) * 0.3;
        const x2 = 160 + Math.cos(a) * 96;
        const y2 = 100 + Math.sin(a) * 62;
        const mx = 160 + Math.cos(a) * 44;
        const my = 100 + Math.sin(a) * 28;
        return (
          <g key={i}>
            <line x1={160} y1={100} x2={x2} y2={y2} className={line} strokeWidth={1.6} />
            <rect x={x2 - 30} y={y2 - 11} width={60} height={22} rx={11} className={card} strokeWidth={1.2} />
            <rect x={x2 - 18} y={y2 - 2.4} width={36} height={4.6} rx={2.3} className={ink} />
            {i === 0 && <circle cx={mx} cy={my} r={3.4} fill={accent} />}
          </g>
        );
      })}
      <rect x={118} y={82} width={84} height={36} rx={18} fill={accent} opacity={0.92} />
      <rect x={136} y={96} width={48} height={7} rx={3.5} fill="#fff" opacity={0.9} />
    </g>
  );
}

function Wireframe({ accent }: { accent: string }) {
  return (
    <g>
      <rect x={40} y={18} width={240} height={164} rx={10} className={card} strokeWidth={1.5} />
      <line x1={40} y1={44} x2={280} y2={44} className={soft} strokeWidth={1.2} />
      <circle cx={56} cy={31} r={3.4} className={ink} />
      <circle cx={68} cy={31} r={3.4} className={ink} />
      <rect x={180} y={25} width={84} height={12} rx={6} className={faint} />
      <rect x={60} y={60} width={120} height={14} rx={4} fill={accent} opacity={0.85} />
      <rect x={60} y={80} width={88} height={5} rx={2.5} className={ink} />
      <rect x={60} y={90} width={64} height={5} rx={2.5} className={faint} />
      <rect x={60} y={104} width={56} height={20} rx={6} fill={accent} opacity={0.9} />
      <rect x={124} y={104} width={56} height={20} rx={6} className={card} strokeWidth={1.2} />
      <rect x={196} y={60} width={64} height={88} rx={8} className="fill-zinc-100 dark:fill-zinc-800" />
      <circle cx={228} cy={92} r={14} fill={accent} opacity={0.25} />
      <rect x={206} y={118} width={44} height={5} rx={2.5} className={ink} />
      <rect x={60} y={136} width={200} height={1.4} className={faint} />
      <rect x={60} y={146} width={60} height={20} rx={6} className={card} strokeWidth={1.2} />
      <rect x={128} y={146} width={60} height={20} rx={6} className={card} strokeWidth={1.2} />
    </g>
  );
}

function Notes({ accent, rand }: { accent: string; rand: () => number }) {
  return (
    <g>
      <Lines x={28} y={26} widths={[120, 200, 180, 210]} />
      <rect x={28} y={66} width={86} height={86} rx={4} fill={accent} opacity={0.16} />
      <rect x={28} y={66} width={86} height={86} rx={4} className={card} strokeWidth={1.2} />
      <Lines x={38} y={80} widths={[52, 64, 44]} />
      <circle cx={38} cy={140} r={3} fill={accent} />
      <Lines x={132} y={66} widths={[120, 140]} />
      <g>
        <rect x={132} y={92} width={160} height={30} rx={7} className={card} strokeWidth={1.2} />
        <circle cx={145} cy={107} r={6} fill="none" className={line} strokeWidth={1.6} />
        <polyline points="142,107 144.6,109.6 148.4,105.4" fill="none" stroke={accent} strokeWidth={1.8} strokeLinecap="round" />
        <rect x={156} y={104.6} width={70} height={4.6} rx={2.3} className={ink} />
      </g>
      <Lines x={28} y={164} widths={[180, 150]} />
      {Array.from({ length: 3 }).map((_, i) => (
        <circle key={i} cx={40 + rand() * 240} cy={30 + rand() * 130} r={1.8} fill={accent} opacity={0.5} />
      ))}
    </g>
  );
}

function Timeline({ accent }: { accent: string }) {
  const ms = [36, 118, 200, 272];
  return (
    <g>
      <line x1={20} y1={100} x2={300} y2={100} className={line} strokeWidth={2} />
      {ms.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={100} r={i === 1 ? 8 : 5.5} fill={i === 1 ? accent : undefined} className={i === 1 ? undefined : card} strokeWidth={2} />
          <rect x={x - 34} y={i % 2 === 0 ? 34 : 124} width={68} height={44} rx={7} className={card} strokeWidth={1.3} />
          <line x1={x} y1={100} x2={x} y2={i % 2 === 0 ? 78 : 124} className={soft} strokeWidth={1.3} />
          <rect x={x - 24} y={(i % 2 === 0 ? 34 : 124) + 10} width={48} height={5} rx={2.5} className={ink} />
          <rect x={x - 24} y={(i % 2 === 0 ? 34 : 124) + 20} width={32} height={4.4} rx={2.2} className={faint} />
        </g>
      ))}
    </g>
  );
}

function Erd({ accent }: { accent: string }) {
  const tables = [
    { x: 22, y: 40, rows: 4 },
    { x: 128, y: 24, rows: 5 },
    { x: 228, y: 60, rows: 3 },
  ];
  return (
    <g>
      <line x1={96} y1={70} x2={128} y2={60} className={line} strokeWidth={1.4} />
      <line x1={202} y1={70} x2={228} y2={86} className={line} strokeWidth={1.4} />
      <circle cx={112} cy={65} r={3} fill={accent} />
      {tables.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={t.y} width={74} height={22 + t.rows * 13} rx={7} className={card} strokeWidth={1.4} />
          <rect x={t.x} y={t.y} width={74} height={22} rx={7} fill={accent} opacity={i === 1 ? 0.85 : 0.3} />
          <rect x={t.x} y={t.y + 22} width={74} height={t.rows * 13} fill="none" />
          {Array.from({ length: t.rows }).map((_, r) => (
            <g key={r}>
              <circle cx={t.x + 12} cy={t.y + 32 + r * 13} r={2.4} className={r === 0 ? undefined : faint} fill={r === 0 ? accent : undefined} />
              <rect x={t.x + 20} y={t.y + 29.6 + r * 13} width={44 - (r % 3) * 8} height={4.4} rx={2.2} className={faint} />
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
      {kind === "architecture" && <Architecture accent={color} rand={rand} />}
      {kind === "flow" && <Flow accent={color} rand={rand} />}
      {kind === "kanban" && <Kanban accent={color} />}
      {kind === "mindmap" && <Mindmap accent={color} rand={rand} />}
      {kind === "wireframe" && <Wireframe accent={color} />}
      {kind === "notes" && <Notes accent={color} rand={rand} />}
      {kind === "timeline" && <Timeline accent={color} />}
      {kind === "erd" && <Erd accent={color} />}
    </svg>
  );
}
