"use client";

import { useRouter } from "next/navigation";
import { LayoutTemplate, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TEMPLATES } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";

const FEATURED_TEMPLATES = ["tpl-sys-arch", "tpl-brainstorm", "tpl-mindmap", "tpl-journey"];

export function NewBoardMenu({ compact = false }: { compact?: boolean }) {
  const ws = useWorkspace();
  const router = useRouter();
  const featured = FEATURED_TEMPLATES.map((id) => TEMPLATES.find((t) => t.id === id)!).filter(Boolean);
  const existing = ws.boardsInWorkspace.slice(0, 6);

  const openBoard = (workspaceId: string, boardId: string) => {
    ws.touchBoard(boardId);
    router.push(`/w/${workspaceId}/b/${boardId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size={compact ? "sm" : "default"} className="gap-1.5" />}>
        <Plus className="h-4 w-4" />
        New Board
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem
          onSelect={() => {
            const b = ws.createBoard({ name: "Untitled board" });
            toast.success("Blank board created");
            openBoard(b.workspaceId, b.id);
          }}
        >
          <Plus className="h-4 w-4 text-zinc-400" />
          Blank board
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LayoutTemplate className="h-4 w-4 text-zinc-400" />
            From template
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-60">
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider">
              Popular templates
            </DropdownMenuLabel>
            {featured.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onSelect={() => {
                  const b = ws.useTemplate(t);
                  toast.success(`Created from “${t.name}”`);
                  openBoard(b.workspaceId, b.id);
                }}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px]">{t.name}</span>
                  <span className="block text-[11px] text-zinc-500">{t.category}</span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Duplicate existing</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-60">
            {existing.length === 0 && (
              <DropdownMenuLabel className="font-normal text-zinc-500">
                No boards in this workspace yet.
              </DropdownMenuLabel>
            )}
            {existing.map((b) => (
              <DropdownMenuItem
                key={b.id}
                onSelect={() => {
                  const copy = ws.duplicateBoard(b.id);
                  if (copy) {
                    toast.success(`Duplicated as “${copy.name}”`);
                    openBoard(copy.workspaceId, copy.id);
                  }
                }}
              >
                <span className="truncate text-[13px]">{b.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
