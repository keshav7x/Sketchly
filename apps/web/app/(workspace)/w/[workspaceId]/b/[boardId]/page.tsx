"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fullDate, timeAgo } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import { cn } from "@/lib/utils";
import BoardPreview from "@/components/workspace/board-preview";
import { BoardMenu } from "@/components/workspace/board-menu";
import { BoardCard } from "@/components/workspace/board-card";
import { EmptyState } from "@/components/workspace/empty-state";
import { TagChip } from "@/components/workspace/tag-chip";

export default function BoardEntryPage() {
  const params = useParams<{ workspaceId: string; boardId: string }>();
  const router = useRouter();
  const ws = useWorkspace();
  const board = ws.getBoard(params.boardId);

  useEffect(() => {
    if (board) ws.touchBoard(board.id);
    // touch once on entry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.boardId]);

  const related = useMemo(() => {
    if (!board) return [];
    return ws.boards
      .filter(
        (b) =>
          b.id !== board.id &&
          !ws.trashedIds.includes(b.id) &&
          (b.workspaceId === board.workspaceId || b.tags.some((t) => board.tags.includes(t))),
      )
      .slice(0, 3);
  }, [board, ws.boards, ws.trashedIds]);

  if (!board || ws.trashedIds.includes(board.id)) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <EmptyState
            icon={ArrowLeft}
            title="This board isn't here"
            body="It may have been moved to Trash or never existed in this demo."
            actionLabel="Back home"
            onAction={() => router.push("/")}
          />
        </div>
      </div>
    );
  }

  const workspace = ws.workspaces.find((w) => w.id === board.workspaceId);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-7 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {workspace?.name ?? "Workspace"}
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-[22px] font-bold tracking-tight">{board.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            by {board.owner} · edited {timeAgo(board.updatedAt)} · opened {timeAgo(board.openedAt)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant={board.favorite ? "secondary" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => ws.toggleFavorite(board.id)}
          >
            <Star className={cn("h-3.5 w-3.5", board.favorite && "fill-amber-500 text-amber-500")} />
            {board.favorite ? "Favorited" : "Favorite"}
          </Button>
          <BoardMenu board={board} />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="aspect-[16/8]">
          <BoardPreview kind={board.preview} accent={board.accent} seed={board.id} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-10 text-center dark:border-zinc-700">
          <p className="text-[15px] font-semibold">The whiteboard canvas opens here</p>
          <p className="mx-auto mt-1 max-w-sm text-[13px] text-zinc-500">
            This milestone covers everything around the boards. The canvas itself ships next —
            every shape, cursor and comment will live on this page.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-[13px] font-semibold">Details</h3>
            <dl className="mt-2 flex flex-col gap-1.5 text-[13px]">
              {[
                ["Workspace", workspace?.name ?? "—"],
                ["Owner", board.owner],
                ["Modified", fullDate(board.updatedAt)],
                ["Opened", fullDate(board.openedAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-zinc-500">{k}</dt>
                  <dd className="truncate font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <div className="mb-1.5 text-[13px] font-semibold">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {board.tags.map((t) => (
                  <button key={t} onClick={() => ws.removeTag(board.id, t)} title={`Remove #${t}`}>
                    <TagChip name={t} className="hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/40 dark:hover:text-red-300" />
                  </button>
                ))}
                <Popover>
                  <PopoverTrigger
                    render={
                      <button className="inline-flex items-center gap-1 rounded-md border border-dashed border-zinc-300 px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 hover:border-zinc-400 hover:text-zinc-800 dark:border-zinc-700 dark:hover:text-zinc-200" />
                    }
                  >
                    <Plus className="h-3 w-3" /> Add
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-52 p-1.5">
                    {ws.tags.map((t) => {
                      const on = board.tags.includes(t.name);
                      return (
                        <button
                          key={t.id}
                          onClick={() => (on ? ws.removeTag(board.id, t.name) : ws.assignTag(board.id, t.name))}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <span className="text-zinc-400">#</span>
                          <span className="flex-1 text-left">{t.name}</span>
                          {on && <Check className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => void copyLink()}>
              Copy link
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-9">
          <h2 className="mb-3 text-[15px] font-semibold">Related boards</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
            {related.map((b, i) => (
              <BoardCard key={b.id} board={b} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
