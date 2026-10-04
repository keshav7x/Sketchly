"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { useWorkspace } from "@/lib/workspace/store";
import { BoardCollection, ViewToggle } from "@/components/workspace/board-collection";
import { EmptyState } from "@/components/workspace/empty-state";

export default function FavoritesPage() {
  const ws = useWorkspace();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Favorites</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Keep your most important boards close by.
          </p>
        </div>
        {ws.favorites.length > 0 && <ViewToggle />}
      </div>

      {ws.favorites.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <EmptyState
            icon={Star}
            title="Nothing pinned yet"
            body="Star any board and it will wait for you here, across every workspace."
            actionLabel="Explore boards"
            onAction={() => router.push("/explore")}
          />
        </div>
      ) : (
        <div className="mt-6">
          <BoardCollection boards={ws.favorites} listHeader />
        </div>
      )}
    </div>
  );
}
