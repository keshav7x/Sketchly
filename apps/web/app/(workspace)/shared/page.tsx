"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { SHARED_BOARDS, timeAgo } from "@/lib/workspace/data";
import BoardPreview from "@/components/workspace/board-preview";
import { TagChip } from "@/components/workspace/tag-chip";
import { EmptyState } from "@/components/workspace/empty-state";

export default function SharedPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
      <h1 className="text-[22px] font-bold tracking-tight">Shared with me</h1>
      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        Boards your teammates invited you to.
      </p>

      {SHARED_BOARDS.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <EmptyState
            icon={Users}
            title="No shared boards"
            body="When someone shares a board with you, it will appear here."
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {SHARED_BOARDS.map((b, i) => (
            <motion.button
              key={b.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: Math.min(i * 0.045, 0.3), ease: "easeOut" }}
              onClick={() => toast.info("Shared previews are visual-only in this milestone")}
              className="group overflow-hidden rounded-xl border border-zinc-200/90 bg-white text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative aspect-[8/5] overflow-hidden">
                <div className="h-full w-full transition duration-300 group-hover:scale-[1.03]">
                  <BoardPreview kind={b.preview} accent={b.accent} seed={b.id} />
                </div>
                <span
                  className={`absolute right-2 top-2 rounded-md px-1.5 py-0.5 text-[11px] font-semibold backdrop-blur ${
                    b.access === "edit"
                      ? "bg-emerald-500/90 text-white"
                      : "bg-white/95 text-zinc-600 dark:bg-zinc-900/95 dark:text-zinc-300"
                  }`}
                >
                  {b.access === "edit" ? "Can edit" : "Can view"}
                </span>
              </div>
              <div className="px-3.5 pb-3 pt-3">
                <div className="truncate text-[13.5px] font-semibold">{b.name}</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-[10px] font-bold text-white">
                    {b.ownerInitials}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-zinc-500">
                    {b.owner} · {timeAgo(b.sharedAt)}
                  </span>
                </div>
                {b.tags.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {b.tags.map((t) => (
                      <TagChip key={t} name={t} />
                    ))}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
