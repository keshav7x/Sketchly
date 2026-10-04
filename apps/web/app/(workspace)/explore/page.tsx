"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/workspace/data";
import { BoardCollection } from "@/components/workspace/board-collection";
import { TemplateCard } from "@/components/workspace/template-card";
import { useWorkspace } from "@/lib/workspace/store";

export default function ExplorePage() {
  const ws = useWorkspace();
  const featured = ws.recentBoards.slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
      <h1 className="text-[22px] font-bold tracking-tight">Explore</h1>
      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        Ways to use your visual workspace — boards, templates and ideas worth stealing.
      </p>

      <section className="mt-6">
        <h2 className="mb-3 text-[15px] font-semibold">Featured</h2>
        <BoardCollection boards={featured} large />
      </section>

      {TEMPLATE_CATEGORIES.map((cat) => {
        const items = TEMPLATES.filter((t) => t.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="mt-9">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-[15px] font-semibold">{cat}</h2>
              <span className="text-xs text-zinc-400">{items.length} templates</span>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-3">
                {items.map((t, i) => (
                  <div key={t.id} className="w-[240px] shrink-0">
                    <TemplateCard template={t} index={i} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        );
      })}
    </div>
  );
}
