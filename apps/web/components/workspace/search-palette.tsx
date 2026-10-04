"use client";

import { useRouter } from "next/navigation";
import {
  Clock,
  Compass,
  Home,
  LayoutGrid,
  LayoutTemplate,
  Moon,
  PanelLeft,
  Plus,
  Star,
  Tags,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TEMPLATES, timeAgo } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import BoardPreview from "./board-preview";

const NAV_CMDS = [
  { href: "/", label: "Go Home", icon: Home },
  { href: "/explore", label: "Go Explore", icon: Compass },
  { href: "/recent", label: "Go Recent", icon: Clock },
  { href: "/favorites", label: "Go Favorites", icon: Star },
  { href: "/templates", label: "Go Templates", icon: LayoutTemplate },
  { href: "/tags", label: "Go Tags", icon: Tags },
];

export function SearchPalette() {
  const ws = useWorkspace();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  const go = (href: string) => {
    ws.setPaletteOpen(false);
    router.push(href);
  };

  const openBoard = (workspaceId: string, boardId: string) => {
    ws.touchBoard(boardId);
    ws.setPaletteOpen(false);
    router.push(`/w/${workspaceId}/b/${boardId}`);
  };

  const topBoards = ws.recentBoards.slice(0, 6);
  const topTemplates = TEMPLATES.slice(0, 5);

  return (
    <CommandDialog open={ws.paletteOpen} onOpenChange={ws.setPaletteOpen}>
      <CommandInput placeholder="Search boards, templates, commands…" />
      <CommandList>
        <CommandEmpty>No results. Try “architecture”.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV_CMDS.map((n) => (
            <CommandItem key={n.href} value={`go ${n.label}`} onSelect={() => go(n.href)}>
              <n.icon className="h-4 w-4 text-zinc-400" />
              {n.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem
            value="new board"
            onSelect={() => {
              const b = ws.createBoard({ name: "Untitled board" });
              toast.success("Blank board created");
              openBoard(b.workspaceId, b.id);
            }}
          >
            <Plus className="h-4 w-4 text-zinc-400" />
            New board
          </CommandItem>
          <CommandItem value="toggle view" onSelect={() => { ws.toggleView(); ws.setPaletteOpen(false); }}>
            <LayoutGrid className="h-4 w-4 text-zinc-400" />
            Toggle grid / list
          </CommandItem>
          <CommandItem
            value="toggle theme"
            onSelect={() => { setTheme(resolvedTheme === "dark" ? "light" : "dark"); ws.setPaletteOpen(false); }}
          >
            <Moon className="h-4 w-4 text-zinc-400" />
            Toggle theme
          </CommandItem>
          <CommandItem
            value="toggle sidebar"
            onSelect={() => { ws.setSidebarCollapsed(!ws.sidebarCollapsed); ws.setPaletteOpen(false); }}
          >
            <PanelLeft className="h-4 w-4 text-zinc-400" />
            Toggle sidebar
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Boards">
          {topBoards.map((b) => (
            <CommandItem
              key={b.id}
              value={`${b.name} ${b.tags.join(" ")}`}
              onSelect={() => openBoard(b.workspaceId, b.id)}
            >
              <span className="h-8 w-12 shrink-0 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
                <BoardPreview kind={b.preview} accent={b.accent} seed={b.id} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate">{b.name}</span>
                <span className="block text-[11px] text-zinc-500">
                  {ws.workspaces.find((w) => w.id === b.workspaceId)?.name} · {timeAgo(b.openedAt)}
                </span>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Templates">
          {topTemplates.map((t) => (
            <CommandItem
              key={t.id}
              value={`template ${t.name} ${t.category}`}
              onSelect={() => {
                const b = ws.useTemplate(t);
                toast.success(`Created from “${t.name}”`);
                openBoard(b.workspaceId, b.id);
              }}
            >
              <LayoutTemplate className="h-4 w-4 text-zinc-400" />
              <span className="min-w-0 flex-1">
                <span className="block truncate">{t.name}</span>
                <span className="block text-[11px] text-zinc-500">{t.category}</span>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Tags">
          {ws.tags.map((t) => (
            <CommandItem
              key={t.id}
              value={`tag ${t.name}`}
              onSelect={() => {
                ws.setPendingTag(t.name);
                go("/tags");
              }}
            >
              <span className="text-zinc-400">#</span>
              {t.name}
              <span className="ml-auto text-[11px] text-zinc-400">{ws.tagCount(t.name)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
