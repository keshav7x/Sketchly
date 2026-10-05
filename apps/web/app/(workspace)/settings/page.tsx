"use client";

import { useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/lib/workspace/store";
import { cn } from "@/lib/utils";

function Row({ title, body, control }: { title: string; body: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold">{title}</div>
        <div className="mt-0.5 text-[13px] text-zinc-500">{body}</div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

export default function SettingsPage() {
  const ws = useWorkspace();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("Keshav");
  const [wsName, setWsName] = useState(ws.activeWorkspace.name);
  const [toggles, setToggles] = useState({ comments: true, shares: true, digest: false });

  const flip = (k: keyof typeof toggles) => setToggles((t) => ({ ...t, [k]: !t[k] }));

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 pt-7 sm:px-8">
      <h1 className="text-[22px] font-bold tracking-tight">Settings</h1>
      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        Local preferences for this workspace demo.
      </p>

      <section className="mt-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest text-zinc-400">Profile</h2>
        <div className="mt-2 rounded-2xl border border-zinc-200/80 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-base font-bold text-white">
              {name.slice(0, 1).toUpperCase() || "K"}
            </div>
            <div className="flex-1">
              <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-60" aria-label="Display name" />
              <div className="mt-1 text-xs text-zinc-500">keshav@sketchly.app</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest text-zinc-400">Appearance</h2>
        <div className="mt-2 rounded-2xl border border-zinc-200/80 bg-white px-2 py-2 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
            {[
              { v: "light", icon: Sun, label: "Light" },
              { v: "dark", icon: Moon, label: "Dark" },
              { v: "system", icon: Monitor, label: "System" },
            ].map(({ v, icon: Icon, label }) => (
              <button
                key={v}
                onClick={() => setTheme(v)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition",
                  theme === v
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-7">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest text-zinc-400">Workspace</h2>
        <div className="mt-2 rounded-2xl border border-zinc-200/80 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3 py-4">
            <Input
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="max-w-60"
              aria-label="Workspace name"
            />
            <Button
              size="sm"
              variant="outline"
              disabled={!wsName.trim() || wsName.trim() === ws.activeWorkspace.name}
              onClick={() => {
                ws.updateWorkspace(ws.activeWorkspaceId, { name: wsName.trim() });
                toast.success("Workspace renamed");
              }}
            >
              Save
            </Button>
          </div>
          <Separator />
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {(
              [
                ["comments", "Comments", "Notify me when someone comments."],
                ["shares", "Shares", "Notify me when a board is shared with me."],
                ["digest", "Weekly recap", "A calm summary of your week, every Monday."],
              ] as const
            ).map(([k, title, body]) => (
              <Row
                key={k}
                title={title}
                body={body}
                control={
                  <button
                    role="switch"
                    aria-checked={toggles[k]}
                    onClick={() => flip(k)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      toggles[k] ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-700",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all dark:bg-zinc-900",
                        toggles[k] ? "left-[22px] dark:bg-zinc-100" : "left-0.5",
                      )}
                    />
                  </button>
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-7">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest text-red-400">Danger zone</h2>
        <div className="mt-2 flex items-center justify-between gap-6 rounded-2xl border border-red-200/70 bg-white px-5 py-4 dark:border-red-900/50 dark:bg-zinc-900">
          <div>
            <div className="text-[13.5px] font-semibold">Leave workspace</div>
            <div className="mt-0.5 text-[13px] text-zinc-500">
              Demo only — nothing actually happens.
            </div>
          </div>
          <Button size="sm" variant="destructive" onClick={() => toast.info("Demo only — you're staying put.")}>
            Leave
          </Button>
        </div>
      </section>
    </div>
  );
}
