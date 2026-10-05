"use client";

import { useEffect, useState } from "react";
import { Hash, Pencil, Plus, Tags as TagsIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/workspace/store";
import { BoardCollection, ViewToggle } from "@/components/workspace/board-collection";
import { ConfirmDialog, InputDialog } from "@/components/workspace/dialogs";
import { EmptyState } from "@/components/workspace/empty-state";
import { cn } from "@/lib/utils";

export default function TagsPage() {
  const ws = useWorkspace();
  const [selected, setSelected] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Coming from the command palette's tag search.
  useEffect(() => {
    if (ws.pendingTag) {
      setSelected(ws.pendingTag);
      ws.setPendingTag(null);
    }
  }, [ws]);

  const boards = selected
    ? ws.boards.filter((b) => !ws.trashedIds.includes(b.id) && b.tags.includes(selected))
    : [];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Tags</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Organize your visual work. Select a tag to filter boards.
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New tag
        </Button>
      </div>

      {ws.tags.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <EmptyState
            icon={TagsIcon}
            title="Create tags to organize your visual work"
            body="Group boards by topic, project or team with lightweight tags."
            actionLabel="Create a tag"
            onAction={() => setCreateOpen(true)}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-1">
            {ws.tags.map((t) => {
              const count = ws.tagCount(t.name);
              const active = selected === t.name;
              return (
                <div
                  key={t.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-xl border px-3 py-2 transition",
                    active
                      ? "border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                      : "border-transparent hover:border-zinc-200 hover:bg-white dark:hover:border-zinc-800 dark:hover:bg-zinc-900",
                  )}
                >
                  <button onClick={() => setSelected(active ? null : t.name)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                    <Hash className={cn("h-4 w-4 shrink-0", active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400")} />
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{t.name}</span>
                    <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {count}
                    </span>
                  </button>
                  <span className="hidden shrink-0 gap-0.5 group-hover:flex">
                    <button
                      title={`Rename #${t.name}`}
                      onClick={() => setRenameTarget({ id: t.id, name: t.name })}
                      className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      title={`Delete #${t.name}`}
                      onClick={() => setDeleteTarget({ id: t.id, name: t.name })}
                      className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="min-w-0">
            {!selected ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-14 text-center dark:border-zinc-700">
                <p className="text-sm font-medium">Select a tag to see its boards</p>
                <p className="mx-auto mt-1 max-w-xs text-[13px] text-zinc-500">
                  Tags are shared across workspaces — assign them from any board’s menu.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold">
                    <span className="text-zinc-400">#</span>
                    {selected}
                    <span className="ml-2 text-[13px] font-normal text-zinc-400">
                      {boards.length} board{boards.length === 1 ? "" : "s"}
                    </span>
                  </h2>
                  <ViewToggle />
                </div>
                {boards.length === 0 ? (
                  <EmptyState
                    icon={TagsIcon}
                    title={`No boards tagged #${selected}`}
                    body="Assign this tag from any board's menu to collect work here."
                  />
                ) : (
                  <BoardCollection boards={boards} listHeader />
                )}
              </>
            )}
          </div>
        </div>
      )}

      <InputDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create tag"
        placeholder="e.g. research"
        submitLabel="Create"
        onSubmit={(v) => {
          ws.createTag(v);
          toast.success(`Tag #${v.replace(/^#/, "")} created`);
        }}
      />
      <InputDialog
        open={renameTarget !== null}
        onOpenChange={(v) => !v && setRenameTarget(null)}
        title="Rename tag"
        initialValue={renameTarget?.name ?? ""}
        submitLabel="Rename"
        onSubmit={(v) => {
          if (renameTarget) {
            ws.renameTag(renameTarget.id, v);
            if (selected === renameTarget.name) setSelected(v.replace(/^#/, "").toLowerCase());
          }
        }}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete tag?"
        body={
          <>
            <b>#{deleteTarget?.name}</b> will be removed from every board. Boards themselves stay put.
          </>
        }
        onConfirm={() => {
          if (deleteTarget) {
            if (selected === deleteTarget.name) setSelected(null);
            ws.deleteTag(deleteTarget.id);
          }
        }}
      />
    </div>
  );
}
