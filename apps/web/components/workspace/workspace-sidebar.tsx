"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock,
  Compass,
  Home,
  LayoutTemplate,
  LifeBuoy,
  PanelLeft,
  Settings,
  Star,
  Tags,
  Trash2,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useWorkspace } from "@/lib/workspace/store";
import { cn } from "@/lib/utils";
import { WorkspaceSwitcher } from "./workspace-switcher";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/recent", label: "Recent", icon: Clock },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/shared", label: "Shared with me", icon: Users },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/tags", label: "Tags", icon: Tags },
];

const BOTTOM = [
  { href: "/trash", label: "Trash", icon: Trash2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavItem({
  href,
  label,
  icon: Icon,
  collapsed,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  collapsed: boolean;
  badge?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  const cls = cn(
    "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
    collapsed && "justify-center px-0",
    active
      ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
      : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100",
  );
  const inner = (
    <>
      <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2 : 1.75} />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
      {!collapsed && badge !== undefined && badge > 0 && (
        <span className="text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">{badge}</span>
      )}
    </>
  );
  if (!collapsed) {
    return (
      <Link href={href} onClick={onNavigate} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger render={<Link href={href} onClick={onNavigate} className={cls} />}>
        {inner}
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function HelpButton({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const cls = cn(
    "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-zinc-600 transition-colors hover:bg-zinc-100/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100",
    collapsed && "justify-center px-0",
  );
  const btn = (
    <button onClick={() => setOpen(true)} className={cls} aria-label="Help">
      <LifeBuoy className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      {!collapsed && <span>Help</span>}
    </button>
  );
  return (
    <>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger render={btn} />
          <TooltipContent side="right" className="text-xs">
            Help
          </TooltipContent>
        </Tooltip>
      ) : (
        btn
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[15px]">Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 text-sm">
            {[
              ["Search or run a command", "⌘K"],
              ["Toggle grid / list", "⌘K → Toggle view"],
              ["Switch theme", "⌘K → Toggle theme"],
              ["Close dialogs", "Esc"],
            ].map(([label, keys]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
                <kbd className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {keys}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const ws = useWorkspace();
  const collapsed = ws.sidebarCollapsed;
  const miniBoards = ws.recentBoards
    .filter((b) => b.workspaceId === ws.activeWorkspaceId)
    .slice(0, 4);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 px-3 pt-3">
        <div className="min-w-0 flex-1">
          <WorkspaceSwitcher collapsed={collapsed} />
        </div>
        {!collapsed && (
          <button
            onClick={() => ws.setSidebarCollapsed(true)}
            aria-label="Collapse sidebar"
            className="shrink-0 rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-2 flex-1 overflow-y-auto px-3 pb-2">
        <nav className="flex flex-col gap-px">
          {NAV.map((n) => (
            <NavItem
              key={n.href}
              {...n}
              collapsed={collapsed}
              onNavigate={onNavigate}
              badge={
                n.href === "/favorites"
                  ? ws.favorites.length
                  : n.href === "/shared"
                    ? 3
                    : undefined
              }
            />
          ))}
        </nav>

        {!collapsed && (
          <>
            <div className="mb-1 mt-4 flex items-center justify-between px-2">
              <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                Boards
              </span>
              <Link
                href="/"
                onClick={onNavigate}
                className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-px">
              {miniBoards.map((b) => (
                <Link
                  key={b.id}
                  href={`/w/${b.workspaceId}/b/${b.id}`}
                  onClick={onNavigate}
                  className="truncate rounded-md px-2 py-1.5 text-[13px] text-zinc-600 transition-colors hover:bg-zinc-100/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                >
                  {b.name}
                </Link>
              ))}
              {miniBoards.length === 0 && (
                <p className="px-2 py-1 text-xs text-zinc-400">No boards here yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="px-3 pb-3">
        <Separator className="mb-2" />
        <nav className="flex flex-col gap-px">
          {BOTTOM.map((n) => (
            <NavItem
              key={n.href}
              {...n}
              collapsed={collapsed}
              onNavigate={onNavigate}
              badge={n.href === "/trash" ? ws.trashedBoards.length : undefined}
            />
          ))}
          <HelpButton collapsed={collapsed} />
        </nav>
      </div>
    </div>
  );
}

export function WorkspaceSidebar() {
  const ws = useWorkspace();
  return (
    <TooltipProvider>
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r border-zinc-200 bg-white transition-[width] duration-200 ease-out lg:block dark:border-zinc-800 dark:bg-zinc-950 ${
          ws.sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        {ws.sidebarCollapsed ? (
          <div className="flex h-full flex-col items-center pt-3">
            <WorkspaceSwitcher collapsed />
            <div className="mt-2 flex flex-col items-center gap-px">
              {NAV.map((n) => (
                <NavItem key={n.href} {...n} collapsed />
              ))}
            </div>
            <div className="mt-auto flex flex-col items-center gap-px pb-3">
              {BOTTOM.map((n) => (
                <NavItem key={n.href} {...n} collapsed />
              ))}
              <button
                onClick={() => ws.setSidebarCollapsed(false)}
                aria-label="Expand sidebar"
                className="mt-1 rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <PanelLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        ) : (
          <SidebarContent />
        )}
      </aside>
    </TooltipProvider>
  );
}
