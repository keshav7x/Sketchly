"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  LayoutGrid,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useBoards } from "../lib/useBoards";
import { useWorkspaces } from "../lib/useWorkspaces";

type Modal =
  | { kind: "ws-create" }
  | { kind: "ws-rename"; id: number; name: string }
  | { kind: "ws-delete"; id: number; name: string }
  | { kind: "board-create" }
  | { kind: "board-rename"; id: number; name: string }
  | { kind: "board-delete"; id: number; name: string }
  | null;

const GRADS = [
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-sky-500 via-cyan-500 to-emerald-500",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-indigo-500 via-blue-500 to-cyan-500",
  "from-emerald-500 via-teal-500 to-sky-500",
  "from-rose-500 via-pink-500 to-fuchsia-500",
];

function gradFor(id: number) {
  return GRADS[Math.abs(id) % GRADS.length];
}

export default function Dashboard() {
  const ws = useWorkspaces();
  const boards = useBoards(ws.activeId);
  const [modal, setModal] = useState<Modal>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const activeWs = ws.workspaces.find((w) => w.id === ws.activeId) ?? null;

  function open(m: Exclude<Modal, null>) {
    setDraft(m.kind === "ws-rename" || m.kind === "board-rename" ? m.name : "");
    setModal(m);
    setNotice(null);
  }

  async function submitModal(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    const name = draft.trim();
    setBusy(true);
    try {
      switch (modal.kind) {
        case "ws-create":
          if (!name) return;
          await ws.create(name);
          break;
        case "ws-rename":
          if (!name) return;
          await ws.rename(modal.id, name);
          break;
        case "ws-delete":
          await ws.remove(modal.id);
          break;
        case "board-create":
          if (!name) return;
          await boards.create(name);
          break;
        case "board-rename":
          if (!name) return;
          await boards.rename(modal.id, name);
          break;
        case "board-delete":
          await boards.remove(modal.id);
          break;
      }
      setModal(null);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const isDelete =
    modal?.kind === "ws-delete" || modal?.kind === "board-delete";
  const modalTitle = !modal
    ? ""
    : modal.kind === "ws-create"
      ? "New workspace"
      : modal.kind === "ws-rename"
        ? "Rename workspace"
        : modal.kind === "ws-delete"
          ? "Delete workspace?"
          : modal.kind === "board-create"
            ? "New board"
            : modal.kind === "board-rename"
              ? "Rename board"
              : "Delete board?";

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900">
      {/* ---------- Sidebar ---------- */}
      <aside className="flex w-72 shrink-0 flex-col bg-zinc-950 text-zinc-300">
        <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="text-lg font-extrabold tracking-tight text-white">
            SketchLy
          </div>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-zinc-300">
            beta
          </span>
        </div>

        <div className="flex items-center justify-between px-5 pb-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            Workspaces · {ws.workspaces.length}
          </span>
          <button
            onClick={() => open({ kind: "ws-create" })}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-zinc-200 transition hover:bg-white/20"
            title="New workspace"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {ws.loading && (
            <div className="px-2 py-3 text-sm text-zinc-500">Loading…</div>
          )}
          {ws.workspaces.map((w) => {
            const active = w.id === ws.activeId;
            return (
              <div
                key={w.id}
                className={`group flex items-center gap-2 rounded-xl px-2 py-1 transition ${
                  active ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <button
                  onClick={() => ws.setActiveId(w.id)}
                  className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white ${gradFor(w.id)}`}
                  >
                    <Layers className="h-4 w-4" />
                  </span>
                  <span
                    className={`truncate text-sm font-semibold ${active ? "text-white" : "text-zinc-300"}`}
                  >
                    {w.name}
                  </span>
                </button>
                <div className="hidden shrink-0 gap-0.5 group-hover:flex">
                  <button
                    title="Rename"
                    onClick={() => open({ kind: "ws-rename", id: w.id, name: w.name })}
                    className="rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => open({ kind: "ws-delete", id: w.id, name: w.name })}
                    className="rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          {!ws.loading && ws.workspaces.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-zinc-500">
              No workspaces yet.
              <button
                onClick={() => open({ kind: "ws-create" })}
                className="mt-2 block w-full font-semibold text-fuchsia-400 hover:text-fuchsia-300"
              >
                Create your first →
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-sm font-bold text-white">
              D
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">Dev User</div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Local mode · id 1
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <main className="min-w-0 flex-1">
        <div className="border-b border-zinc-200 bg-white/80 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-5">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                {activeWs ? activeWs.name : "Welcome to SketchLy"}
              </h1>
              <p className="mt-0.5 text-sm text-zinc-500">
                {activeWs
                  ? `${boards.boards.length} board${boards.boards.length === 1 ? "" : "s"} in this workspace`
                  : "Pick or create a workspace to get started"}
              </p>
            </div>
            {activeWs && (
              <div className="flex gap-2">
                <button
                  onClick={() => void boards.refresh()}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <button
                  onClick={() => open({ kind: "board-create" })}
                  className="flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-zinc-950/20 transition hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4" />
                  New board
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-6">
          {ws.error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {ws.error}
            </div>
          )}
          {notice && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {notice}
            </div>
          )}

          {activeWs ? (
            <>
              {boards.loading && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-52 animate-pulse rounded-2xl bg-zinc-200" />
                  ))}
                </div>
              )}
              {boards.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {boards.error}
                </div>
              )}
              {!boards.loading && !boards.error && boards.boards.length === 0 && (
                <button
                  onClick={() => open({ kind: "board-create" })}
                  className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-zinc-300 bg-white/60 px-6 py-16 text-center transition hover:border-violet-400 hover:bg-white"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25">
                    <LayoutGrid className="h-6 w-6" />
                  </span>
                  <span className="text-base font-bold">No boards yet</span>
                  <span className="max-w-sm text-sm text-zinc-500">
                    Create your first whiteboard in “{activeWs.name}” and start sketching.
                  </span>
                  <span className="mt-1 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">
                    + Create board
                  </span>
                </button>
              )}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
                {boards.boards.map((b) => (
                  <div
                    key={b.id}
                    className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-900/10"
                  >
                    <Link href={`/boards/${b.id}`} className="block">
                      <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${gradFor(b.id)}`}>
                        <LayoutGrid className="h-10 w-10 text-white/80" />
                        <span className="absolute right-3 top-3 rounded-full bg-black/25 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                          v{b.version}
                        </span>
                      </div>
                      <div className="px-4 pb-2 pt-3">
                        <div className="truncate text-[15px] font-bold">{b.name}</div>
                        <div className="mt-0.5 truncate text-xs text-zinc-500">
                          #{b.id}
                          {b.description ? ` · ${b.description}` : " · Click to open canvas"}
                        </div>
                      </div>
                    </Link>
                    <div className="flex border-t border-zinc-100">
                      <button
                        onClick={() => open({ kind: "board-rename", id: b.id, name: b.name })}
                        className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Rename
                      </button>
                      <button
                        onClick={() => open({ kind: "board-delete", id: b.id, name: b.name })}
                        className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            ws.workspaces.length > 0 && (
              <div className="py-2 text-sm text-zinc-500">Select a workspace on the left.</div>
            )
          )}
        </div>
      </main>

      {/* ---------- Modal ---------- */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !busy) setModal(null);
          }}
        >
          <form
            onSubmit={submitModal}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold">{modalTitle}</h2>
              <button
                type="button"
                onClick={() => !busy && setModal(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {isDelete ? (
              <p className="mt-2 text-sm text-zinc-600">
                {modal.kind === "ws-delete" ? (
                  <>Permanently delete workspace <b>“{(modal as { name: string }).name}”</b>? This can orphan its boards.</>
                ) : (
                  <>Permanently delete board <b>“{(modal as { name: string }).name}”</b>? This can’t be undone.</>
                )}
              </p>
            ) : (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  modal.kind === "ws-create"
                    ? "e.g. Product design"
                    : modal.kind === "board-create"
                      ? "e.g. Homepage wireframe"
                      : "Name…"
                }
                className="mt-4 w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => !busy && setModal(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy || (!isDelete && !draft.trim())}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
                  isDelete
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                }`}
              >
                {busy
                  ? "Working…"
                  : isDelete
                    ? "Delete"
                    : modal.kind === "ws-create" || modal.kind === "board-create"
                      ? "Create"
                      : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
