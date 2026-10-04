"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, Share2 } from "lucide-react";
import BoardCanvas from "../../../components/BoardCanvas";
import { boardApi, type Board } from "../../../lib/api";

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const b = await boardApi.get(Number(id));
        if (!alive) return;
        setBoard(b);
        setName(b.name);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load board");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  async function saveName() {
    const next = name.trim();
    if (!next || !board || next === board.name) return;
    try {
      const updated = await boardApi.rename(board.id, next);
      setBoard(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rename failed");
    }
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy link");
    }
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-100">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          Loading board…
        </div>
      </div>
    );
  if (error || !board) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-zinc-100 p-6 text-center">
        <div className="rounded-2xl border border-red-200 bg-white px-6 py-5 text-sm text-red-700 shadow-sm">
          {error ?? "Board not found"}
        </div>
        <div className="text-sm text-zinc-500">
          Make sure the API is mounted at /api/boards and the board id exists.
        </div>
        <Link
          href="/"
          className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-100">
      <header className="z-20 flex items-center gap-3 border-b border-zinc-200 bg-white/85 px-4 py-2.5 backdrop-blur">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-950"
          title="Back to dashboard"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="h-6 w-px bg-zinc-200" />
        <input
          className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-lg font-bold tracking-tight outline-none transition hover:border-zinc-200 focus:border-violet-400 focus:bg-white sm:max-w-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => void saveName()}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
        />
        <span className="hidden rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-500 sm:block">
          #{board.id} · workspace {board.workspaceId} · v{board.version}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-xs font-bold text-white ring-2 ring-white"
            title="Dev User (you)"
          >
            D
          </div>
          <button
            onClick={() => void share()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:from-violet-700 hover:to-fuchsia-700"
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1 p-3">
        <BoardCanvas boardId={String(board.id)} />
      </div>
    </div>
  );
}
