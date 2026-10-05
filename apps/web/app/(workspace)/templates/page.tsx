"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LayoutTemplate, Search } from "lucide-react";
import { TEMPLATE_CATEGORIES, TEMPLATES } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import { EmptyState } from "@/components/workspace/empty-state";
import { TemplateCard } from "@/components/workspace/template-card";
import BoardPreview from "@/components/workspace/board-preview";
import { cn } from "@/lib/utils";

const FEATURED_ID = "tpl-sys-arch";

export default function TemplatesPage() {
  const ws = useWorkspace();
  const router = useRouter();
  const [cat, setCat] = useState<string>("All");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const isFiltering = cat !== "All" || q.length > 0;

  const use = (templateId: string) => {
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    const board = ws.useTemplate(tpl);
    router.push(`/w/${board.workspaceId}/b/${board.id}`);
  };

  const sections = useMemo(
    () =>
      TEMPLATE_CATEGORIES.map((category) => ({
        category,
        items: TEMPLATES.filter((t) => {
          if (t.category !== category) return false;
          if (cat !== "All" && t.category !== cat) return false;
          if (!q) return true;
          return (
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.includes(q))
          );
        }),
      })).filter((s) => s.items.length > 0),
    [cat, q]
  );

  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const featured = TEMPLATES.find((t) => t.id === FEATURED_ID) ?? TEMPLATES[0];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        Library · {TEMPLATES.length} templates
      </p>
      <div className="mt-1.5 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
          Templates
        </h1>
        <label className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-[13px] dark:border-zinc-800 dark:bg-zinc-900">
          <Search className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter templates…"
            className="w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {["All", ...TEMPLATE_CATEGORIES].map((c) => {
          const n =
            c === "All"
              ? TEMPLATES.length
              : TEMPLATES.filter((t) => t.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
                cat === c
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-500 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              {c}
              <span className="ml-1.5 tabular-nums opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      {!isFiltering && featured && (
        <button
          onClick={() => use(featured.id)}
          className="group mt-6 grid w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] md:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="relative min-h-56 overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
              <BoardPreview kind={featured.preview} accent={featured.accent} seed={featured.id} />
            </div>
            <span className="absolute left-4 top-4 rounded-full bg-zinc-950/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              Template of the moment
            </span>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              {featured.category} · by {featured.author}
            </p>
            <p className="mt-2 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-zinc-950 dark:text-white">
              {featured.name}
            </p>
            <p className="mt-2 max-w-md text-[14px] leading-6 text-zinc-500">
              {featured.description}
            </p>
            <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg bg-zinc-950 px-4 py-2.5 text-[13px] font-semibold text-white transition-transform duration-200 group-hover:translate-x-0.5 dark:bg-white dark:text-zinc-950">
              Use this template
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </button>
      )}

      {total === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <EmptyState
            icon={LayoutTemplate}
            title="No templates match"
            body="Try a different search or category."
          />
        </div>
      ) : (
        sections.map(({ category, items }) => (
          <section key={category} className="mt-10">
            <div className="mb-1 flex items-baseline justify-between">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                {category}
              </h2>
              <span className="text-[12px] tabular-nums text-zinc-400">
                {items.length} {items.length === 1 ? "template" : "templates"}
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
              {items.map((t, i) => (
                <TemplateCard key={t.id} template={t} index={i} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
