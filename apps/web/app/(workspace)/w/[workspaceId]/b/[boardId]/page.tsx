"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Link2, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fullDate, timeAgo } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import { cn } from "@/lib/utils";
import { BoardMenu } from "@/components/workspace/board-menu";
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
          (b.workspaceId === board.workspaceId || b.tags.some((t) => board.tags.includes(t)))
        )
        .slice(0, 4);
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

  const stats: [string, string][] = [
    ["Workspace", workspace?.name ?? "—"],
    ["Owner", board.owner],
    ["Modified", fullDate(board.updatedAt)],
    ["Opened", fullDate(board.openedAt)],
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-7 sm:px-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {workspace?.name ?? "Workspace"}
        </Link>
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

      {/* ── Hero ── */}
      <header className="relative mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-10 dark:border-zinc-800 dark:bg-zinc-900/60 sm:px-10 sm:py-14">
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-12 -right-2 select-none text-[200px] font-semibold leading-none tracking-tighter text-zinc-900/[0.04] dark:text-white/[0.05]"
        >
          {board.name.slice(0, 1).toUpperCase()}
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Board · edited {timeAgo(board.updatedAt)}
        </p>
        <h1 className="mt-3 max-w-2xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-950 dark:text-white sm:text-[44px]">
          {board.name}
        </h1>
        {board.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {board.tags.map((t) => (
              <TagChip key={t} name={t} />
            ))}
          </div>
        )}
      </header>

      {/* ── Stats ── */}
      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 sm:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="bg-white px-4 py-3.5 dark:bg-zinc-900">
            <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-zinc-400">
              {k}
            </dt>
            <dd className="mt-1 truncate text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1fr_300px]">
        {/* ── Canvas placeholder ── */}
        <div
          className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgb(0 0 0 / 0.07) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-lg font-semibold text-zinc-400 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500">
            {board.name.slice(0, 1).toUpperCase()}
          </span>
          <p className="mt-4 text-[15px] font-semibold">The canvas lives here</p>
          <p className="mx-auto mt-1 max-w-xs text-[13px] leading-5 text-zinc-500">
            Shapes, cursors and comments ship in the canvas milestone — this page
            already holds everything around them.
          </p>
          <span className="mt-4 cursor-default rounded-lg bg-zinc-100 px-3.5 py-2 text-[12px] font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
            Canvas — coming next
          </span>
        </div>

        {/* ── Rail ── */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
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
            {board.tags.length === 0 && (
              <p className="mt-1 text-[12px] text-zinc-400">
                Tag this board to find it faster.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-1 text-[13px] font-semibold">Share</div>
            <p className="text-[12px] leading-5 text-zinc-500">
              Anyone with the link can view this board.
            </p>
            <Button variant="outline" size="sm" className="mt-3 w-full gap-1.5" onClick={() => void copyLink()}>
              <Link2 className="h-3.5 w-3.5" />
              Copy link
            </Button>
          </div>
        </div>
      </div>

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-1 text-[17px] font-semibold tracking-[-0.02em] text-zinc-950 dark:text-white">
            Related boards
          </h2>
          <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {related.map((b, i) => (
              <Link
                key={b.id}
                href={`/w/${b.workspaceId}/b/${b.id}`}
                className="group flex items-center gap-4 px-4 py-3.5 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-zinc-50 sm:px-5 dark:hover:bg-zinc-800/50"
              >
                <span className="font-mono text-[11px] text-zinc-300 dark:text-zinc-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium">
                    {b.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-zinc-400">
                    edited {timeAgo(b.updatedAt)}
                    {b.tags.length > 0 && (
                      <> · {b.tags.map((t) => `#${t}`).join("  ")}</>
                    )}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-300 transition-all duration-200 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-zinc-600 dark:text-zinc-600" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
