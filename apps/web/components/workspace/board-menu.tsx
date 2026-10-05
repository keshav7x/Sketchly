"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/lib/workspace/store";
import type { Board } from "@/lib/workspace/data";
import { ConfirmDialog, InputDialog } from "./dialogs";

export function BoardMenu({ board, onOpen }: { board: Board; onOpen?: () => void }) {
  const router = useRouter();
  const ws = useWorkspace();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tagDraft, setTagDraft] = useState("");

  const openBoard = () => {
    ws.touchBoard(board.id);
    onOpen?.();
    router.push(`/w/${board.workspaceId}/b/${board.id}`);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/w/${board.workspaceId}/b/${board.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => e.stopPropagation()}
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${board.name}`}
              className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
            />
          }
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={openBoard}>
            Open
            <DropdownMenuShortcut>↵</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRenameOpen(true)}>Rename…</DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              const copy = ws.duplicateBoard(board.id);
              if (copy) toast.success(`Duplicated as “${copy.name}”`);
            }}
          >
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => ws.toggleFavorite(board.id)}>
            {board.favorite ? "Remove from favorites" : "Add to favorites"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Tags</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-52">
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wider">Assign tags</DropdownMenuLabel>
              {ws.tags.map((t) => {
                const on = board.tags.includes(t.name);
                return (
                  <DropdownMenuItem
                    key={t.id}
                    onSelect={(e) => {
                      e.preventDefault();
                      if (on) ws.removeTag(board.id, t.name);
                      else ws.assignTag(board.id, t.name);
                    }}
                  >
                    <span className="text-zinc-400">#</span>
                    {t.name}
                    {on && <Check className="ml-auto h-3.5 w-3.5" />}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <form
                className="p-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!tagDraft.trim()) return;
                  ws.assignTag(board.id, tagDraft.trim());
                  setTagDraft("");
                }}
              >
                <input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="New tag…"
                  className="w-full rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-[13px] outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700"
                />
              </form>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {ws.workspaces.map((w) => (
                <DropdownMenuItem
                  key={w.id}
                  disabled={w.id === board.workspaceId}
                  onSelect={() => {
                    ws.moveBoard(board.id, w.id);
                    toast.success(`Moved to ${w.name}`);
                  }}
                >
                  {w.name}
                  {w.id === board.workspaceId && <Check className="ml-auto h-3.5 w-3.5" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onSelect={() => void copyLink()}>Copy link</DropdownMenuItem>
              <DropdownMenuLabel className="font-normal text-zinc-500">
                Anyone with the link can view (demo)
              </DropdownMenuLabel>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-red-600 dark:text-red-400"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InputDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title="Rename board"
        initialValue={board.name}
        submitLabel="Rename"
        onSubmit={(v) => ws.renameBoard(board.id, v)}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete board?"
        body={
          <>
            <b>“{board.name}”</b> will move to Trash. You can restore it within this session.
          </>
        }
        confirmLabel="Move to Trash"
        onConfirm={() => {
          ws.trashBoard(board.id);
          toast.success("Board moved to Trash");
        }}
      />
    </>
  );
}
