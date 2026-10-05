"use client";

import { useRouter } from "next/navigation";
import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fullDate } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import BoardPreview from "@/components/workspace/board-preview";
import { ConfirmDialog } from "@/components/workspace/dialogs";
import { EmptyState } from "@/components/workspace/empty-state";
import { useState } from "react";

export default function TrashPage() {
  const ws = useWorkspace();
  const router = useRouter();
  const [emptyOpen, setEmptyOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Trash</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Deleted boards rest here until you clear them.
          </p>
        </div>
        {ws.trashedBoards.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setEmptyOpen(true)}>
            Empty trash
          </Button>
        )}
      </div>

      {ws.trashedBoards.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <EmptyState
            icon={Trash2}
            title="Trash is empty"
            body="Deleted boards will wait here in case you change your mind."
            actionLabel="Back home"
            onAction={() => router.push("/")}
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-1">
          {ws.trashedBoards.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-zinc-200 hover:bg-white dark:hover:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <div className="h-11 w-[72px] shrink-0 overflow-hidden rounded-lg border border-zinc-200/80 opacity-70 dark:border-zinc-800">
                <BoardPreview kind={b.preview} accent={b.accent} seed={b.id} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-semibold">{b.name}</div>
                <div className="text-xs text-zinc-500">Deleted · edited {fullDate(b.updatedAt)}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  ws.restoreBoard(b.id);
                  toast.success(`Restored “${b.name}”`);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-red-600 hover:text-red-700 dark:text-red-400"
                onClick={() => {
                  ws.deleteForever(b.id);
                  toast.success("Board permanently deleted");
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={emptyOpen}
        onOpenChange={setEmptyOpen}
        title="Empty trash?"
        body="Every board in Trash will be permanently deleted. This can't be undone."
        confirmLabel="Empty trash"
        onConfirm={() => {
          ws.emptyTrash();
          toast.success("Trash emptied");
        }}
      />
    </div>
  );
}
