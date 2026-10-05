"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus, Settings2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/lib/workspace/store";
import { InputDialog } from "./dialogs";

export function WsAvatar({ name, size = "md" }: { name: string; gradient?: number; size?: "sm" | "md" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-md bg-zinc-900 font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900 ${
        size === "sm" ? "h-7 w-7 text-xs" : "h-8 w-8 text-[13px]"
      }`}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export { ACCENTS } from "@/lib/workspace/data";

export function WorkspaceSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const ws = useWorkspace();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const active = ws.activeWorkspace;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              title={active.name}
              className={`flex w-full items-center gap-2.5 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                collapsed ? "justify-center" : ""
              }`}
            />
          }
        >
          <WsAvatar name={active.name} gradient={active.gradient} />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                  {active.name}
                </span>
                <span className="block text-[11px] text-zinc-400 dark:text-zinc-500">
                  {active.members} member{active.members === 1 ? "" : "s"}
                </span>
              </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" />
            </>
          )}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-1.5" sideOffset={8}>
          <Command>
            <CommandInput placeholder="Switch workspace…" className="h-8 text-[13px]" />
            <CommandList>
              <CommandEmpty className="py-4 text-center text-[13px] text-zinc-500">
                No workspace found.
              </CommandEmpty>
              <CommandGroup heading="Workspaces">
                {ws.workspaces.map((w) => (
                  <CommandItem
                    key={w.id}
                    value={w.name}
                    onSelect={() => {
                      ws.switchWorkspace(w.id);
                      setOpen(false);
                    }}
                    className="gap-2.5"
                  >
                    <WsAvatar name={w.name} gradient={w.gradient} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{w.name}</span>
                      <span className="block text-[11px] text-zinc-500">
                        {w.members} member{w.members === 1 ? "" : "s"}
                      </span>
                    </span>
                    {w.id === ws.activeWorkspaceId && <Check className="h-4 w-4 shrink-0" />}
                  </CommandItem>
                ))}
              </CommandGroup>
              <Separator className="my-1.5" />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setCreateOpen(true);
                  }}
                  className="gap-2.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[13px]">Create workspace</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    router.push("/settings");
                  }}
                  className="gap-2.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <Settings2 className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[13px]">Workspace settings</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <InputDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create workspace"
        description="A new home for a different kind of visual work."
        placeholder="e.g. Side Projects"
        submitLabel="Create"
        onSubmit={(v) => ws.createWorkspace(v)}
      />
    </>
  );
}
