"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { TemplateT } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import BoardPreview from "./board-preview";

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
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] dark:border-zinc-800 dark:bg-zinc-900"
    >
      <button onClick={use} className="relative block aspect-[16/10] overflow-hidden text-left">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
          <BoardPreview kind={template.preview} accent={template.accent} seed={template.id} />
        </div>
        <span className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-center gap-1.5 bg-gradient-to-t from-zinc-950/75 via-zinc-950/25 to-transparent pb-3 pt-10 text-[13px] font-semibold text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-zinc-950">
            Use template <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-zinc-950/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          {template.category}
        </span>
      </button>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <span className="truncate text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
          {template.name}
        </span>
        <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-zinc-500">
          {template.description}
        </p>
        <div className="mt-2 text-[11px] text-zinc-400">by {template.author}</div>
      </div>
    </motion.div>
  );
}
