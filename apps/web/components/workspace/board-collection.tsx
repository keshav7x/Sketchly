"use client";

import { LayoutGrid, List } from "lucide-react";
import type { Board } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import { cn } from "@/lib/utils";
import { BoardCard, BoardRow } from "./board-card";

interface BoardCollectionProps {
  boards: Board[];
  large?: boolean;
  listHeader?: boolean;
}

export function ViewToggle() {
  const { view, setView } = useWorkspace();
  return (
    <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
      {(
        [
          { v: "grid" as const, icon: LayoutGrid, label: "Grid view" },
          { v: "list" as const, icon: List, label: "List view" },
        ]
      ).map(({ v, icon: Icon, label }) => (
        <button
          key={v}
          title={label}
          aria-label={label}
          onClick={() => setView(v)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md transition",
            view === v
              ? "bg-zinc-100 text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

export function BoardCollection({ boards, large = false, listHeader = false }: BoardCollectionProps) {
  const { view } = useWorkspace();

  if (view === "list") {
    return (
      <div className="flex flex-col gap-0.5">
        {listHeader && (
          <div className="flex items-center gap-3 px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            <div className="min-w-0 flex-1">Name</div>
            <div className="hidden w-28 shrink-0 sm:block">Modified</div>
            <div className="hidden w-24 shrink-0 md:block">Owner</div>
            <div className="w-[68px] shrink-0" />
          </div>
        )}
        {boards.map((b, i) => (
          <BoardRow key={b.id} board={b} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
      {boards.map((b, i) => (
        <BoardCard key={b.id} board={b} index={i} large={large} />
      ))}
    </div>
  );
}
