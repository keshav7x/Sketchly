"use client";

import { cn } from "@/lib/utils";

export function TagChip({ name, className, onClick }: { name: string; className?: string; onClick?: () => void }) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 transition dark:bg-zinc-800 dark:text-zinc-400",
        onClick && "hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100",
        className,
      )}
    >
      <span className="mr-0.5 text-zinc-400 dark:text-zinc-500">#</span>
      {name}
    </Tag>
  );
}
