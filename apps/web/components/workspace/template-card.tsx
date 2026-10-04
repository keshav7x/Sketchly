"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { TemplateT } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import BoardPreview from "./board-preview";
import { TagChip } from "./tag-chip";

export function TemplateCard({ template, index = 0 }: { template: TemplateT; index?: number }) {
  const ws = useWorkspace();
  const router = useRouter();

  const use = () => {
    const b = ws.useTemplate(template);
    toast.success(`Created “${b.name}” from template`);
    router.push(`/w/${b.workspaceId}/b/${b.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.045, 0.3), ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] dark:border-zinc-800 dark:bg-zinc-900"
    >
      <button onClick={use} className="relative block aspect-[8/5] overflow-hidden text-left">
        <div className="h-full w-full transition duration-300 group-hover:scale-[1.03]">
          <BoardPreview kind={template.preview} accent={template.accent} seed={template.id} />
        </div>
        <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center gap-1.5 bg-gradient-to-t from-zinc-950/70 to-transparent pb-2.5 pt-8 text-[13px] font-semibold text-white opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          Use template <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>
      <div className="flex flex-1 flex-col px-3.5 pb-3 pt-3">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13.5px] font-semibold text-zinc-900 dark:text-zinc-100">
            {template.name}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {template.description}
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {template.category}
          </span>
          {template.tags.slice(0, 2).map((t) => (
            <TagChip key={t} name={t} />
          ))}
        </div>
        <div className="mt-2 text-[11px] text-zinc-400">by {template.author}</div>
      </div>
    </motion.div>
  );
}
