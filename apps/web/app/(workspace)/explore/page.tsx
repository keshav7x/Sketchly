"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";

import { TEMPLATES, TEMPLATE_CATEGORIES, timeAgo } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";

function boardHref(board: { workspaceId: string; id: string }) {
  return `/w/${board.workspaceId}/b/${board.id}`;
}

export default function ExplorePage() {
  const ws = useWorkspace();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const spotlight =
    ws.recentBoards.find((b) => b.workspaceId === ws.activeWorkspaceId) ??
    ws.recentBoards[0];

  const trending = useMemo(
    () =>
      [...ws.tags]
        .map((t) => ({ name: t.name, count: ws.tagCount(t.name) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    [ws]
  );

  const q = query.trim().toLowerCase();
  const categories = useMemo(
    () =>
      TEMPLATE_CATEGORIES.map((category) => ({
        category,
        items: TEMPLATES.filter((t) => {
          if (t.category !== category) return false;
          if (!q) return true;
          return (
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.includes(q))
          );
        }),
      })).filter((c) => c.items.length > 0),
    [q]
  );

  const totalShown = categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Discover
          </p>
          <h1 className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
            Explore
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Boards worth stealing, tags worth following, templates worth using.
          </p>
        </div>
        <label className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-[13px] dark:border-zinc-800 dark:bg-zinc-900">
          <Search className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter ideas…"
            className="w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
        </label>
      </div>

      {/* ── Spotlight + trending ── */}
      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {spotlight ? (
          <Link
            href={boardHref(spotlight)}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-7 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 sm:p-8 lg:col-span-2"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-8 -right-2 select-none text-[140px] font-semibold leading-none tracking-tighter text-zinc-900/[0.04] dark:text-white/[0.05]"
            >
              {spotlight.name.slice(0, 1).toUpperCase()}
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Board of the moment
            </p>
            <p className="mt-3 max-w-lg text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-zinc-950 dark:text-white">
              {spotlight.name}
            </p>
            <p className="mt-2 text-[13px] text-zinc-500">
              Edited {timeAgo(spotlight.updatedAt)}
              {spotlight.tags.length > 0 && (
                <> · {spotlight.tags.map((t) => `#${t}`).join("  ")}</>
              )}
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-4 py-2.5 text-[13px] font-semibold text-white transition-transform duration-200 group-hover:translate-x-0.5 dark:bg-white dark:text-zinc-950">
              Open board
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-7 dark:border-zinc-800 lg:col-span-2">
            <p className="text-[14px] font-medium">No boards yet</p>
            <p className="mt-1 text-[13px] text-zinc-500">
              Create a board and it can be featured here.
            </p>
          </div>
        )}

        <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <p className="border-b border-zinc-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:border-zinc-800">
            Trending tags
          </p>
          <div className="flex flex-1 flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
            {trending.map((t, i) => (
              <button
                key={t.name}
                onClick={() => {
                  ws.setPendingTag(t.name);
                  router.push("/tags");
                }}
                className="group flex flex-1 items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <span className="font-mono text-[11px] text-zinc-300 dark:text-zinc-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                  #{t.name}
                </span>
                <span className="text-[11px] tabular-nums text-zinc-400">
                  {t.count} {t.count === 1 ? "board" : "boards"}
                </span>
              </button>
            ))}
            {trending.length === 0 && (
              <p className="px-4 py-6 text-[13px] text-zinc-400">No tags yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── By craft ── */}
      <div className="mt-12">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-zinc-950 dark:text-white">
            Browse by craft
          </h2>
          {q && (
            <p className="text-[13px] text-zinc-400">
              {totalShown} result{totalShown === 1 ? "" : "s"} for “{query.trim()}”
            </p>
          )}
        </div>
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 px-6 py-12 text-center dark:border-zinc-800">
            <p className="text-[14px] font-medium">Nothing matches “{query.trim()}”</p>
            <button
              onClick={() => setQuery("")}
              className="mt-2 text-[13px] font-medium text-zinc-900 underline underline-offset-4 dark:text-white"
            >
              Clear the filter
            </button>
          </div>
        ) : (
          categories.map(({ category, items }) => (
            <section key={category} className="mt-8">
              <div className="mb-1 flex items-baseline justify-between">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                  {category}
                </h3>
                <Link
                  href="/templates"
                  className="text-[12px] font-medium text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  All {category.toLowerCase()} →
                </Link>
              </div>
              <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                {items.map((template, i) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      const board = ws.useTemplate(template);
                      router.push(boardHref(board));
                    }}
                    className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-zinc-50 sm:gap-5 sm:px-5 dark:hover:bg-zinc-800/50"
                  >
                    <span className="font-mono text-[11px] text-zinc-300 dark:text-zinc-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-zinc-900 dark:text-zinc-100">
                        {template.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-zinc-500">
                        {template.description}
                      </span>
                    </span>
                    <span className="hidden shrink-0 text-[12px] text-zinc-400 md:block">
                      by {template.author}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-all duration-200 group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white dark:border-zinc-700 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-zinc-950">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
