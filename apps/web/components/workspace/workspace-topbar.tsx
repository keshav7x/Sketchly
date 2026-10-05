"use client";

import { usePathname } from "next/navigation";
import { Bell, CheckCheck, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { NOTICES, timeAgo } from "@/lib/workspace/data";
import { useWorkspace } from "@/lib/workspace/store";
import { useState } from "react";
import { NewBoardMenu } from "./new-board-menu";

const CRUMBS: Record<string, string> = {
  "/": "Home",
  "/explore": "Explore",
  "/recent": "Recent",
  "/favorites": "Favorites",
  "/shared": "Shared with me",
  "/templates": "Templates",
  "/tags": "Tags",
  "/trash": "Trash",
  "/settings": "Settings",
};

export function WorkspaceTopbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const ws = useWorkspace();
  const [read, setRead] = useState<string[]>([]);

  const isBoard = pathname.startsWith("/w/");
  const boardId = isBoard ? pathname.split("/").pop() : undefined;
  const board = boardId ? ws.getBoard(boardId) : undefined;
  const section = board ? board.name : (CRUMBS[pathname] ?? "Home");
  const unread = NOTICES.filter((n) => !read.includes(n.id)).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-zinc-200/80 bg-white/80 px-3 backdrop-blur-md sm:px-4 dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onMenu}
        aria-label="Open navigation"
        className="text-zinc-500 lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <nav className="flex min-w-0 items-center gap-1.5 text-[13px]">
        {!isBoard && (
          <span className="truncate font-semibold text-zinc-900 dark:text-zinc-100">{section}</span>
        )}
        {isBoard && board && (
          <>
            <span className="shrink-0 text-zinc-400 dark:text-zinc-500">{ws.activeWorkspace.name}</span>
            <span className="shrink-0 text-zinc-300 dark:text-zinc-700">/</span>
            <span className="truncate font-semibold text-zinc-900 dark:text-zinc-100">{board.name}</span>
          </>
        )}
      </nav>

      <div className="flex-1" />

      <button
        onClick={() => ws.setPaletteOpen(true)}
        className="hidden h-8 w-64 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 text-[13px] text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-500 sm:flex dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search boards…</span>
        <kbd className="rounded border border-zinc-200 bg-white px-1 font-mono text-[10px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">
          ⌘K
        </kbd>
      </button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => ws.setPaletteOpen(true)}
        aria-label="Search"
        className="text-zinc-500 sm:hidden"
      >
        <Search className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Toggle theme"
        className="text-zinc-500"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition dark:rotate-0 dark:scale-100" />
      </Button>

      <Popover>
        <PopoverTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative text-zinc-500" />
          }
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950" />
          )}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-1.5">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[13px] font-semibold">Notifications</span>
            <button
              onClick={() => setRead(NOTICES.map((n) => n.id))}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          </div>
          <Separator className="mb-1" />
          {NOTICES.map((n) => (
            <div key={n.id} className="flex gap-2.5 rounded-lg px-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${read.includes(n.id) ? "bg-zinc-300 dark:bg-zinc-700" : "bg-violet-500"}`} />
              <div className="min-w-0">
                <div className="text-[13px] font-medium">{n.title}</div>
                <div className="truncate text-xs text-zinc-500">{n.body}</div>
                <div className="mt-0.5 text-[11px] text-zinc-400">{timeAgo(n.time)}</div>
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>

      <div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white"
        title="Keshav (you)"
      >
        K
      </div>

      <div className="hidden sm:block">
        <NewBoardMenu compact />
      </div>
    </header>
  );
}
