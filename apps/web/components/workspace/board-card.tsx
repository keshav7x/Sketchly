"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { timeAgo, type Board } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import { cn } from "@/lib/utils";
import BoardPreview from "./board-preview";
import { BoardMenu } from "./board-menu";
import { TagChip } from "./tag-chip";

function FavoriteButton({ board, className }: { board: Board; className?: string }) {
  const { toggleFavorite } = useWorkspace();
  return (
    <motion.button
      whileTap={{ scale: 0.75 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(board.id);
      }}
      aria-label={board.favorite ? "Remove from favorites" : "Add to favorites"}
      title={board.favorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg transition",
        board.favorite
          ? "text-amber-500"
          : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
        className,
      )}
    >
      <motion.span
        key={String(board.favorite)}
        initial={{ scale: board.favorite ? 0.4 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="flex"
      >
        <Star className={cn("h-4 w-4", board.favorite && "fill-amber-500")} />
      </motion.span>
    </motion.button>
  );
}

export function BoardCard({ board, index = 0, large = false }: { board: Board; index?: number; large?: boolean }) {
  const href = `/w/${board.workspaceId}/b/${board.id}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.045, 0.35), ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group block overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
      >
        <div className={cn("relative overflow-hidden", large ? "aspect-[16/10]" : "aspect-[8/5]")}>
          <div className="h-full w-full transition duration-300 group-hover:scale-[1.03]">
            <BoardPreview kind={board.preview} accent={board.accent} seed={board.id} />
          </div>
          <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
            <span className={cn("rounded-lg bg-white/95 shadow-sm backdrop-blur dark:bg-zinc-900/95", board.favorite && "opacity-100")}>
              <FavoriteButton board={board} className={cn(!board.favorite && "opacity-0 group-hover:opacity-100")} />
            </span>
            <span className="rounded-lg bg-white/95 shadow-sm backdrop-blur dark:bg-zinc-900/95">
              <BoardMenu board={board} />
            </span>
          </div>
          {board.favorite && (
            <span className="absolute left-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 backdrop-blur dark:bg-zinc-900/95">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            </span>
          )}
        </div>
        <div className="px-3.5 pb-2.5 pt-3">
          <div className="truncate text-[13.5px] font-semibold text-zinc-900 dark:text-zinc-100">
            {board.name}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="truncate">Edited {timeAgo(board.updatedAt)}</span>
            {board.tags.length > 0 && (
              <span className="flex shrink-0 gap-1">
                {board.tags.slice(0, 2).map((t) => (
                  <TagChip key={t} name={t} />
                ))}
                {board.tags.length > 2 && (
                  <span className="text-[11px] text-zinc-400">+{board.tags.length - 2}</span>
                )}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BoardRow({ board, index = 0 }: { board: Board; index?: number }) {
  const href = `/w/${board.workspaceId}/b/${board.id}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.25), ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-zinc-200 hover:bg-white hover:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.12)] dark:hover:border-zinc-800 dark:hover:bg-zinc-900"
      >
        <div className="h-11 w-[72px] shrink-0 overflow-hidden rounded-lg border border-zinc-200/80 dark:border-zinc-800">
          <BoardPreview kind={board.preview} accent={board.accent} seed={board.id} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold text-zinc-900 dark:text-zinc-100">
            {board.name}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            {board.tags.slice(0, 3).map((t) => (
              <TagChip key={t} name={t} />
            ))}
          </div>
        </div>
        <div className="hidden w-28 shrink-0 text-xs text-zinc-500 sm:block dark:text-zinc-400">
          {timeAgo(board.updatedAt)}
        </div>
        <div className="hidden w-24 shrink-0 truncate text-xs text-zinc-500 md:block dark:text-zinc-400">
          {board.owner}
        </div>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <FavoriteButton board={board} />
          <BoardMenu board={board} />
        </div>
      </Link>
    </motion.div>
  );
}
