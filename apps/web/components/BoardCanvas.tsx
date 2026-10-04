"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Circle,
  Eraser,
  Maximize,
  MousePointer2,
  Pen,
  Redo2,
  Square,
  Trash2,
  Type,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export type Tool = "select" | "rect" | "ellipse" | "text" | "arrow" | "pen" | "eraser";

export interface Shape {
  id: string;
  type: Exclude<Tool, "select" | "eraser">;
  x: number;
  y: number;
  w: number;
  h: number;
  x2?: number;
  y2?: number;
  points?: { x: number; y: number }[];
  text?: string;
  color: string;
  strokeWidth: number;
}

const COLORS = ["#171717", "#e03131", "#1971c2", "#2f9e44", "#f08c00", "#9c36b5"];
const STORAGE_KEY = (boardId: string) => `sketchly:board:${boardId}:shapes`;

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeRect(x0: number, y0: number, x1: number, y1: number) {
  return { x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), h: Math.abs(y1 - y0) };
}

export default function BoardCanvas({ boardId }: { boardId: string }) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tool, setTool] = useState<Tool>("select");
  const [color, setColor] = useState(COLORS[0]!);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string>("");

  const svgRef = useRef<SVGSVGElement>(null);
  const draftRef = useRef<Shape | null>(null);
  const [, force] = useState(0);
  const panRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const moveRef = useRef<{ id: string; dx: number; dy: number; orig: Shape } | null>(null);
  const past = useRef<Shape[][]>([]);
  const future = useRef<Shape[][]>([]);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY(boardId));
      if (raw) setShapes(JSON.parse(raw) as Shape[]);
    } catch {
      /* ignore */
    }
  }, [boardId]);

  // autosave (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY(boardId), JSON.stringify(shapes));
        if (shapes.length > 0 || localStorage.getItem(STORAGE_KEY(boardId))) {
          setSavedAt(new Date().toLocaleTimeString());
        }
      } catch {
        /* quota */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [shapes, boardId]);

  const pushHistory = useCallback((prev: Shape[]) => {
    past.current.push(prev);
    if (past.current.length > 100) past.current.shift();
    future.current = [];
  }, []);

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(shapes);
    setShapes(prev);
    setSelectedId(null);
  }, [shapes]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(shapes);
    setShapes(next);
  }, [shapes]);

  // keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (editingTextId) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        pushHistory(shapes);
        setShapes((s) => s.filter((sh) => sh.id !== selectedId));
        setSelectedId(null);
      } else if (e.key === "v" || e.key === "Escape") setTool("select");
      else if (e.key === "r") setTool("rect");
      else if (e.key === "o") setTool("ellipse");
      else if (e.key === "t") setTool("text");
      else if (e.key === "a") setTool("arrow");
      else if (e.key === "p") setTool("pen");
      else if (e.key === "e") setTool("eraser");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editingTextId, redo, selectedId, shapes, undo, pushHistory]);

  function toWorld(e: React.MouseEvent): { x: number; y: number } {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    };
  }

  function onMouseDown(e: React.MouseEvent) {
    if (e.button === 1 || (tool === "select" && e.shiftKey)) {
      // pan with middle mouse or shift+drag
      panRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
      return;
    }
    const pt = toWorld(e);
    if (tool === "select") {
      // hit test handled by shape onMouseDown; empty canvas click clears + starts pan
      if ((e.target as SVGElement).tagName === "svg" || (e.target as SVGElement).dataset?.bg === "1") {
        setSelectedId(null);
        panRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
      }
      return;
    }
    if (tool === "text") {
      const text = window.prompt("Text:", "Hello");
      if (!text) {
        setTool("select");
        return;
      }
      const s: Shape = { id: uid(), type: "text", x: pt.x, y: pt.y, w: 8, h: 24, text, color, strokeWidth };
      pushHistory(shapes);
      setShapes((prev) => [...prev, s]);
      setSelectedId(s.id);
      setTool("select");
      return;
    }
    const base: Shape = {
      id: uid(),
      type: tool === "eraser" ? "rect" : (tool as Shape["type"]),
      x: pt.x,
      y: pt.y,
      w: 0,
      h: 0,
      color,
      strokeWidth,
      points: tool === "pen" ? [pt] : undefined,
      x2: tool === "arrow" ? pt.x : undefined,
      y2: tool === "arrow" ? pt.y : undefined,
    };
    draftRef.current = base;
    force((n) => n + 1);
  }

  function onMouseMove(e: React.MouseEvent) {
    if (panRef.current) {
      setPan({
        x: panRef.current.px + (e.clientX - panRef.current.sx),
        y: panRef.current.py + (e.clientY - panRef.current.sy),
      });
      return;
    }
    if (moveRef.current) {
      const pt = toWorld(e);
      const { orig, dx, dy } = moveRef.current;
      const nx = pt.x - dx;
      const ny = pt.y - dy;
      setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== orig.id) return s;
          const ox = nx - orig.x;
          const oy = ny - orig.y;
          if (s.type === "pen" && s.points) {
            return { ...s, x: nx, y: ny, points: s.points.map((p) => ({ x: p.x + ox, y: p.y + oy })) };
          }
          if (s.type === "arrow") {
            return { ...s, x: nx, y: ny, x2: (s.x2 ?? 0) + ox, y2: (s.y2 ?? 0) + oy };
          }
          return { ...s, x: nx, y: ny };
        }),
      );
      return;
    }
    const d = draftRef.current;
    if (!d) return;
    const pt = toWorld(e);
    if (d.type === "pen" && d.points) {
      d.points = [...d.points, pt];
    } else if (d.type === "arrow") {
      d.x2 = pt.x;
      d.y2 = pt.y;
    } else {
      const n = normalizeRect(d.x, d.y, pt.x, pt.y);
      // keep origin stable: store start in draft origin? simplify by anchoring at start
      const startX = d.x + (d.w === 0 ? 0 : 0);
      void startX;
      Object.assign(d, n, { x: Math.min(d.x, pt.x), y: Math.min(d.y, pt.y) });
      // fix: draft.x/y were start; recompute from stored start
      // store start on first move
      const sx = (d as unknown as { _sx?: number })._sx ?? d.x;
      const sy = (d as unknown as { _sy?: number })._sy ?? d.y;
      (d as unknown as { _sx?: number })._sx = sx === d.x && d.w === 0 ? pt.x : sx;
      const nn = normalizeRect((d as unknown as { _sx?: number })._sx ?? d.x, (d as unknown as { _sy?: number })._sy ?? d.y, pt.x, pt.y);
      Object.assign(d, nn);
    }
    force((n) => n + 1);
  }

  function onMouseUp(e: React.MouseEvent) {
    if (panRef.current) {
      panRef.current = null;
      return;
    }
    if (moveRef.current) {
      pushHistory(moveRef.current.orig ? past.current[past.current.length - 1] ?? shapes : shapes);
      moveRef.current = null;
      return;
    }
    const d = draftRef.current;
    draftRef.current = null;
    if (!d) return;
    if (tool === "eraser") return;
    // ignore accidental clicks
    if (d.type !== "pen" && d.type !== "arrow" && d.w < 4 && d.h < 4) {
      force((n) => n + 1);
      return;
    }
    // fix rect origin (draft mutated above keeps normalized already)
    const pt = toWorld(e);
    void pt;
    pushHistory(shapes);
    setShapes((prev) => [...prev, { ...d, id: uid() }]);
    setSelectedId(d.id);
    force((n) => n + 1);
  }

  function beginMove(e: React.MouseEvent, shape: Shape) {
    if (tool !== "select") return;
    e.stopPropagation();
    setSelectedId(shape.id);
    const pt = toWorld(e);
    past.current.push(shapes);
    if (past.current.length > 100) past.current.shift();
    future.current = [];
    moveRef.current = { id: shape.id, dx: pt.x - shape.x, dy: pt.y - shape.y, orig: shape };
  }

  function handleEraser(e: React.MouseEvent, shape: Shape) {
    if (tool !== "eraser") return;
    e.stopPropagation();
    pushHistory(shapes);
    setShapes((prev) => prev.filter((s) => s.id !== shape.id));
  }

  const draft = draftRef.current;

  const allShapes = useMemo(() => (draft ? [...shapes, draft] : shapes), [shapes, draft]);

  function renderShape(s: Shape) {
    const selected = s.id === selectedId;
    const common = {
      stroke: s.color,
      strokeWidth: s.strokeWidth,
      fill: "none" as const,
      style: { cursor: tool === "select" ? "move" : "default" },
      onMouseDown: (e: React.MouseEvent) => {
        if (tool === "eraser") handleEraser(e, s);
        else beginMove(e, s);
      },
      onDoubleClick: (e: React.MouseEvent) => {
        if (s.type !== "text") return;
        e.stopPropagation();
        setEditingTextId(s.id);
      },
    };
    const sel = selected ? (
      <rect x={s.x - 6} y={s.y - 6} width={Math.max(s.w, 8) + 12} height={Math.max(s.h, s.type === "text" ? 24 : 8) + 12} fill="none" stroke="#1971c2" strokeDasharray="6 4" strokeWidth={1.5} pointerEvents="none" />
    ) : null;
    switch (s.type) {
      case "rect":
        return (
          <g key={s.id}>
            {sel}
            <rect x={s.x} y={s.y} width={s.w} height={s.h} {...common} fill={selected ? "rgba(25,113,194,0.06)" : "none"} />
          </g>
        );
      case "ellipse":
        return (
          <g key={s.id}>
            {sel}
            <ellipse cx={s.x + s.w / 2} cy={s.y + s.h / 2} rx={Math.abs(s.w / 2)} ry={Math.abs(s.h / 2)} {...common} />
          </g>
        );
      case "arrow":
        return (
          <g key={s.id}>
            {sel}
            <line x1={s.x} y1={s.y} x2={s.x2 ?? s.x} y2={s.y2 ?? s.y} {...common} markerEnd="url(#arrowhead)" />
          </g>
        );
      case "pen": {
        const d = (s.points ?? []).map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
        return (
          <g key={s.id}>
            {sel}
            <path d={d} {...common} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );
      }
      case "text":
        return (
          <g key={s.id}>
            {sel}
            <text x={s.x} y={s.y + 16} fontSize={18} fill={s.color} {...common} stroke="none">
              {s.text ?? ""}
            </text>
          </g>
        );
    }
  }

  const editingShape = shapes.find((s) => s.id === editingTextId) ?? null;

  const TOOLS: { id: Tool; icon: React.ReactNode; hint: string }[] = [
    { id: "select", icon: <MousePointer2 className="h-[18px] w-[18px]" />, hint: "Select (V)" },
    { id: "rect", icon: <Square className="h-[18px] w-[18px]" />, hint: "Rectangle (R)" },
    { id: "ellipse", icon: <Circle className="h-[18px] w-[18px]" />, hint: "Ellipse (O)" },
    { id: "text", icon: <Type className="h-[18px] w-[18px]" />, hint: "Text (T)" },
    { id: "arrow", icon: <ArrowUpRight className="h-[18px] w-[18px]" />, hint: "Arrow (A)" },
    { id: "pen", icon: <Pen className="h-[18px] w-[18px]" />, hint: "Draw (P)" },
    { id: "eraser", icon: <Eraser className="h-[18px] w-[18px]" />, hint: "Eraser (E)" },
  ];

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {/* floating toolbar */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-4">
        <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-2xl bg-zinc-950/95 px-2.5 py-2 text-white shadow-2xl shadow-zinc-950/30 backdrop-blur">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={t.hint}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                tool === t.id
                  ? "bg-white text-zinc-950 shadow"
                  : "text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t.icon}
            </button>
          ))}
          <div className="mx-1 h-8 w-px bg-white/15" />
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={c}
              title={c}
              className={`h-6 w-6 rounded-full transition ${
                color === c ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950" : "hover:scale-110"
              }`}
              style={{ background: c }}
            />
          ))}
          <select
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            title="Stroke width"
            className="ml-1 rounded-lg bg-white/10 px-1.5 py-1.5 text-xs font-semibold text-zinc-200 outline-none hover:bg-white/15"
          >
            {[1, 2, 4, 6, 8].map((w) => (
              <option key={w} value={w} className="text-black">
                {w}px
              </option>
            ))}
          </select>
          <div className="mx-1 h-8 w-px bg-white/15" />
          <button
            onClick={undo}
            disabled={past.current.length === 0}
            title="Undo (Ctrl+Z)"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <Undo2 className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={redo}
            disabled={future.current.length === 0}
            title="Redo (Ctrl+Shift+Z)"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <Redo2 className="h-[18px] w-[18px]" />
          </button>
          <button
            title="Clear canvas"
            onClick={() => {
              if (!window.confirm("Clear all shapes on this board?")) return;
              pushHistory(shapes);
              setShapes([]);
              setSelectedId(null);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-red-500/20 hover:text-red-400"
          >
            <Trash2 className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* status chip */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full bg-zinc-950/85 px-3.5 py-1.5 text-xs font-medium text-zinc-300 shadow-lg backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span>{shapes.length} shapes</span>
        {savedAt && (
          <>
            <span className="text-zinc-600">·</span>
            <span>saved {savedAt}</span>
          </>
        )}
        {selectedId && (
          <>
            <span className="text-zinc-600">·</span>
            <button
              className="pointer-events-auto text-red-400 hover:text-red-300"
              onClick={() => {
                pushHistory(shapes);
                setShapes((s) => s.filter((sh) => sh.id !== selectedId));
                setSelectedId(null);
              }}
            >
              delete selected
            </button>
          </>
        )}
      </div>

      {/* zoom controls */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-0.5 rounded-full bg-zinc-950/85 p-1 text-zinc-300 shadow-lg backdrop-blur">
        <button
          onClick={() => setZoom((z) => Math.max(0.3, +(z - 0.1).toFixed(2)))}
          title="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-white"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="min-w-12 text-center text-xs font-semibold tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
          title="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-white"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          title="Reset view"
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-white"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>

      <svg
        ref={svgRef}
        className="canvas-svg absolute inset-0 h-full w-full bg-white"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setZoom((z) => Math.min(3, Math.max(0.3, z - Math.sign(e.deltaY) * 0.05)));
          }
        }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
          <pattern id="dotgrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#dee2e6" />
          </pattern>
        </defs>
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          <rect x={-5000} y={-5000} width={10000} height={10000} fill="url(#dotgrid)" data-bg="1" />
          {allShapes.map(renderShape)}
        </g>
      </svg>

      {editingShape && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm">
          <input
            autoFocus
            className="w-full max-w-sm rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-lg shadow-2xl outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            defaultValue={editingShape.text ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") setEditingTextId(null);
            }}
            onBlur={(e) => {
              const v = e.target.value;
              if (v.trim()) {
                pushHistory(shapes);
                setShapes((prev) => prev.map((s) => (s.id === editingShape.id ? { ...s, text: v } : s)));
              }
              setEditingTextId(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
