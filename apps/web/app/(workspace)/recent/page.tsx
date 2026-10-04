"use client";

import { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import type { Board } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import { BoardCollection, ViewToggle } from "@/components/workspace/board-collection";
import { EmptyState } from "@/components/workspace/empty-state";

type Sort = "opened" | "modified" | "name";

function groupLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(now) - day(d)) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return "Earlier this week";
  return "Earlier";
}

const ORDER = ["Today", "Yesterday", "Earlier this week", "Earlier"];

export default function RecentPage() {
  const ws = useWorkspace();
  const [sort, setSort] = useState<Sort>("opened");

  const sorted = useMemo(() => {
    const arr = [...ws.recentBoards];
    if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "modified") arr.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    else arr.sort((a, b) => +new Date(b.openedAt) - +new Date(a.openedAt));
    return arr;
  }, [ws.recentBoards, sort]);

  const groups = useMemo(() => {
    const map = new Map<string, Board[]>();
    for (const b of sorted) {
      const key = sort === "name" ? b.name.slice(0, 1).toUpperCase() : groupLabel(b.openedAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    }
    const keys = [...map.keys()];
    if (sort !== "name") keys.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    else keys.sort();
    return keys.map((k) => ({ key: k, boards: map.get(k)! }));
  }, [sorted, sort]);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Recent</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Pick up exactly where you left off.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort recent boards"
            className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-[13px] text-zinc-600 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="opened">Recently opened</option>
            <option value="modified">Recently modified</option>
            <option value="name">Name</option>
          </select>
          <ViewToggle />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <EmptyState
            icon={Clock}
            title="Boards you open will show up here"
            body="Your recent work across every workspace lands on this page."
          />
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.key} className="mt-7">
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {g.key}
            </h2>
            <BoardCollection boards={g.boards} listHeader />
          </section>
        ))
      )}
    </div>
  );
}
