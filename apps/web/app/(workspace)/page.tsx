"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";

import { greeting, timeAgo, TEMPLATES } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import { BoardCollection, ViewToggle } from "@/components/workspace/board-collection";
import { EmptyState } from "@/components/workspace/empty-state";
import { NewBoardMenu } from "@/components/workspace/new-board-menu";
import { TemplateCard } from "@/components/workspace/template-card";

function boardHref(board: { workspaceId: string; id: string }) {
  return `/w/${board.workspaceId}/b/${board.id}`;
}

export default function HomePage() {
  const ws = useWorkspace();
  const router = useRouter();

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const workspaceBoards = ws.recentBoards.filter(
    (board) => board.workspaceId === ws.activeWorkspaceId
  );

  const [spotlight, ...upNext] = workspaceBoards;
  const recent = workspaceBoards.slice(0, 6);
  const favs = ws.favorites
    .filter((board) => board.workspaceId === ws.activeWorkspaceId)
    .slice(0, 3);
  const templates = TEMPLATES.slice(0, 4);

  const activity = workspaceBoards
    .flatMap((board) => [
      { board, kind: "edited" as const, at: board.updatedAt },
      { board, kind: "opened" as const, at: board.openedAt },
    ])
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, 6);

  const totalTags = ws.tags.length;

  if (workspaceBoards.length === 0) {
    return (
      <main className="min-h-full bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-[1280px] px-6 pb-24 pt-16 sm:px-8 lg:px-10">
          <p className="text-[12px] text-zinc-400">
            {date} · {ws.activeWorkspace.name}
          </p>
          <h1 className="mt-3 max-w-xl text-[34px] font-semibold leading-[1.1] tracking-[-0.04em] text-zinc-950 dark:text-white">
            {greeting()}, Keshav. Your canvas is empty.
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-6 text-zinc-500">
            Every board starts blank. Create one, or start from a template and
            make it yours.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <NewBoardMenu />
            <Link
              href="/templates"
              className="rounded-lg border border-zinc-200 px-3.5 py-2 text-[13px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Browse templates
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((template, index) => (
              <TemplateCard key={template.id} template={template} index={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-[1280px] px-6 pb-24 pt-8 sm:px-8 lg:px-10">
        {/* ── Header ── */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] text-zinc-400">
              {date} · {ws.activeWorkspace.name} · {workspaceBoards.length}{" "}
              {workspaceBoards.length === 1 ? "board" : "boards"}
            </p>
            <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-zinc-950 dark:text-white sm:text-[34px]">
              {greeting()}, Keshav.
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ViewToggle />
            <NewBoardMenu />
          </div>
        </header>

        {/* ── Spotlight ── */}
        {spotlight && (
          <section className="mt-8 grid gap-4 lg:grid-cols-3">
            <Link
              href={boardHref(spotlight)}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-7 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 sm:p-9 lg:col-span-2"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-2 select-none text-[160px] font-semibold leading-none tracking-tighter text-zinc-900/[0.04] dark:text-white/[0.05]"
              >
                {spotlight.name.slice(0, 1).toUpperCase()}
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Continue working · {ws.activeWorkspace.name}
              </p>
              <p className="mt-3 max-w-xl text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-zinc-950 dark:text-white sm:text-[34px]">
                {spotlight.name}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-zinc-500">
                <span>Edited {timeAgo(spotlight.updatedAt)}</span>
                <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-700" />
                <span>
                  {workspaceBoards.length} {workspaceBoards.length === 1 ? "board" : "boards"} in
                  this workspace
                </span>
                {spotlight.tags.length > 0 && (
                  <>
                    <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-700" />
                    <span className="flex gap-1.5">
                      {spotlight.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </span>
                  </>
                )}
              </div>
              <span className="mt-7 inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-4 py-2.5 text-[13px] font-semibold text-white transition-transform duration-200 group-hover:translate-x-0.5 dark:bg-white dark:text-zinc-950">
                Open board
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <p className="border-b border-zinc-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:border-zinc-800">
                Up next
              </p>
              <div className="flex flex-1 flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                {upNext.slice(0, 3).map((board, i) => (
                  <Link
                    key={board.id}
                    href={boardHref(board)}
                    className="group flex flex-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <span className="font-mono text-[11px] text-zinc-300 dark:text-zinc-600">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                        {board.name}
                      </span>
                      <span className="block text-[11px] text-zinc-400">
                        {timeAgo(board.openedAt)}
                      </span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-zinc-300 opacity-0 transition-all group-hover:translate-x-px group-hover:opacity-100 dark:text-zinc-600" />
                  </Link>
                ))}
                {upNext.length === 0 && (
                  <p className="px-4 py-6 text-[13px] text-zinc-400">
                    Nothing queued — enjoy the quiet.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Main + rail ── */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px]">
          <section className="min-w-0">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-zinc-950 dark:text-white">
                Recent
              </h2>
              <Link
                href="/recent"
                className="group flex items-center gap-1.5 text-[13px] font-medium text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <BoardCollection boards={recent} />

            {favs.length > 0 && (
              <>
                <div className="mb-4 mt-12 flex items-end justify-between">
                  <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-zinc-950 dark:text-white">
                    Favorites
                  </h2>
                  <Link
                    href="/favorites"
                    className="group flex items-center gap-1.5 text-[13px] font-medium text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
                  >
                    View all
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <BoardCollection boards={favs} />
              </>
            )}
          </section>

          {/* ── Rail ── */}
          <aside className="min-w-0">
            <div className="lg:sticky lg:top-20">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Activity
              </h3>
              <ol className="mt-3 border-l border-zinc-200 dark:border-zinc-800">
                {activity.map((event, i) => (
                  <li key={`${event.board.id}-${event.kind}-${i}`} className="relative pb-5 pl-5 last:pb-0">
                    <span
                      className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-zinc-950 ${
                        event.kind === "edited" ? "bg-zinc-900 dark:bg-white" : "bg-zinc-300 dark:bg-zinc-600"
                      }`}
                    />
                    <Link
                      href={boardHref(event.board)}
                      className="block text-[13px] leading-5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                    >
                      {event.kind === "edited" ? "Edited" : "Opened"}{" "}
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {event.board.name}
                      </span>
                    </Link>
                    <p className="mt-0.5 text-[11px] text-zinc-400">{timeAgo(event.at)}</p>
                  </li>
                ))}
              </ol>

              <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Tags
              </h3>
              {totalTags === 0 ? (
                <p className="mt-2 text-[13px] text-zinc-400">
                  No tags yet — add them from any board.
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ws.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href="/tags"
                      className="rounded-full border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white"
                    >
                      #{tag.name}
                      <span className="ml-1 tabular-nums text-zinc-400">
                        {ws.tagCount(tag.name)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-8 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                  Start from a template
                </p>
                <p className="mt-1 text-[12px] leading-5 text-zinc-500">
                  Skip the blank canvas with diagrams, maps and plans.
                </p>
                <Link
                  href="/templates"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-900 hover:underline dark:text-white"
                >
                  Browse templates
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Templates marquee ── */}
        <section className="mt-14">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Get a head start
              </p>
              <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.02em] text-zinc-950 dark:text-white">
                Start from a template
              </h2>
            </div>
            <Link
              href="/templates"
              className="group flex items-center gap-1.5 text-[13px] font-medium text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              Browse all
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div
            className="marquee-hover -mx-6 overflow-hidden px-6 py-2 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            }}
          >
            <div className="animate-marquee flex w-max gap-4">
              {[...templates, ...templates].map((template, index) => (
                <button
                  key={`${template.id}-${index}`}
                  aria-hidden={index >= templates.length}
                  tabIndex={index >= templates.length ? -1 : undefined}
                  onClick={() => {
                    const board = ws.useTemplate(template);
                    router.push(boardHref(board));
                  }}
                  className="group w-[280px] shrink-0 rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.2)] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-zinc-300 dark:text-zinc-600">
                      {String((index % templates.length) + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {template.category}
                    </span>
                  </div>
                  <p className="mt-4 text-[15px] font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {template.name}
                  </p>
                  <p className="mt-1 line-clamp-2 min-h-10 text-[13px] leading-5 text-zinc-500">
                    {template.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-900 dark:text-white">
                    Use template
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px" />
                  </span>
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[12px] text-zinc-400">
            Hover to pause · click any card to open it as a board
          </p>
        </section>

        {/* ── Empty favorites nudge ── */}
        {favs.length === 0 && (
          <section className="mt-12 flex items-center gap-3 rounded-2xl border border-zinc-200 px-5 py-4 dark:border-zinc-800">
            <Compass className="h-4 w-4 shrink-0 text-zinc-400" />
            <p className="text-[13px] text-zinc-500">
              Tip — star the boards you open every day and they will pin
              themselves here.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
