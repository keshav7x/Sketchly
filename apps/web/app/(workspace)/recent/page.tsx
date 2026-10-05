"use client";

import { useMemo, useState } from "react";
import { Clock } from "lucide-react";

import { type Board } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import { BoardCard } from "@/components/workspace/board-card";
import { EmptyState } from "@/components/workspace/empty-state";
import { cn } from "@/lib/utils";

type Sort = "opened" | "modified" | "name";

const SORTS: { id: Sort; label: string }[] = [
  { id: "opened", label: "Opened" },
  { id: "modified", label: "Modified" },
  { id: "name", label: "Name" },
];

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function sortBoards(arr: Board[], sort: Sort): Board[] {
  const copy = [...arr];
  if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "modified")
    copy.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  else copy.sort((a, b) => +new Date(b.openedAt) - +new Date(a.openedAt));
  return copy;
}

function GridLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
      {children}
    </h3>
  );
}

export default function RecentPage() {
  const ws = useWorkspace();
  const [sort, setSort] = useState<Sort>("opened");

  const stamp = (b: Board) => (sort === "modified" ? b.updatedAt : b.openedAt);

  const today = useMemo(
    () => sortBoards(ws.recentBoards.filter((b) => isToday(stamp(b))), sort),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ws.recentBoards, sort]
  );
  const earlier = useMemo(
    () => sortBoards(ws.recentBoards.filter((b) => !isToday(stamp(b))), sort),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ws.recentBoards, sort]
  );

  const byWorkspace = useMemo(
    () =>
      ws.workspaces
        .map((w) => ({
          workspace: w,
          boards: sortBoards(
            ws.recentBoards.filter((b) => b.workspaceId === w.id),
            sort
          ),
        }))
        .filter((g) => g.boards.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ws.recentBoards, ws.workspaces, sort]
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        History
      </p>
      <div className="mt-1.5 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
          Recent
        </h1>
        <div className="flex rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
                sort === s.id
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {ws.recentBoards.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <EmptyState
            icon={Clock}
            title="Boards you open will show up here"
            body="Your recent work across every workspace lands on this page."
          />
        </div>
      ) : (
        <>
          {/* ── Grid one: time ── */}
          <section className="mt-7">
            <div className="mb-3 flex items-baseline gap-2.5">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-zinc-950 dark:text-white">
                By time
              </h2>
              <span className="text-[13px] tabular-nums text-zinc-400">
                {today.length + earlier.length}
              </span>
            </div>

            <GridLabel>
              Today · {today.length} {today.length === 1 ? "board" : "boards"}
            </GridLabel>
            {today.length === 0 ? (
              <p className="mb-6 rounded-xl border border-dashed border-zinc-200 px-4 py-5 text-center text-[13px] text-zinc-400 dark:border-zinc-800">
                Nothing opened today yet — open a board and it lands here.
              </p>
            ) : (
              <div className="mb-7 grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
                {today.map((b, i) => (
                  <BoardCard key={b.id} board={b} index={i} />
                ))}
              </div>
            )}

            <GridLabel>
              Earlier · {earlier.length} {earlier.length === 1 ? "board" : "boards"}
            </GridLabel>
            {earlier.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-200 px-4 py-5 text-center text-[13px] text-zinc-400 dark:border-zinc-800">
                No older boards.
              </p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
                {earlier.map((b, i) => (
                  <BoardCard key={b.id} board={b} index={i} />
                ))}
              </div>
            )}
          </section>

          {/* ── Grid two: workspace ── */}
          <section className="mt-12">
            <div className="mb-1 flex items-baseline gap-2.5">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-zinc-950 dark:text-white">
                By workspace
              </h2>
              <span className="text-[13px] tabular-nums text-zinc-400">
                {byWorkspace.length}{" "}
                {byWorkspace.length === 1 ? "workspace" : "workspaces"}
              </span>
            </div>
            {byWorkspace.map(({ workspace, boards }) => (
              <div key={workspace.id} className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                    {workspace.name.slice(0, 1).toUpperCase()}
                  </span>
                  <h3 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
                    {workspace.name}
                  </h3>
                  <span className="text-[12px] tabular-nums text-zinc-400">
                    {boards.length}
                  </span>
                  <span className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
                  {boards.map((b, i) => (
                    <BoardCard key={b.id} board={b} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
