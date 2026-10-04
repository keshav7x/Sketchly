"use client";

import { useMemo, useState } from "react";
import { LayoutTemplate, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TEMPLATE_CATEGORIES, TEMPLATES } from "@/lib/workspace/data";
import { EmptyState } from "@/components/workspace/empty-state";
import { TemplateCard } from "@/components/workspace/template-card";

export default function TemplatesPage() {
  const [tab, setTab] = useState<string>("All");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      if (tab !== "All" && t.category !== tab) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q))
      );
    });
  }, [tab, query]);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
      <h1 className="text-[22px] font-bold tracking-tight">Templates</h1>
      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        Start from a structure that already works. One click creates the board.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            {TEMPLATE_CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c}>
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <label className="flex h-9 min-w-52 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-[13px] text-zinc-400 sm:max-w-xs dark:border-zinc-800 dark:bg-zinc-900">
          <Search className="h-3.5 w-3.5" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter templates…"
            className="w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
        </label>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <EmptyState
            icon={LayoutTemplate}
            title="No templates match"
            body="Try a different search or category."
          />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
          {items.map((t, i) => (
            <TemplateCard key={t.id} template={t} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
