"use client";

import { useCallback, useEffect, useState } from "react";
import { DEV_USER_ID, workspaceApi, type Workspace } from "./api";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workspaceApi.list();
      setWorkspaces(data);
      setActiveId((prev) => {
        if (prev && data.some((w) => w.id === prev)) return prev;
        return data[0]?.id ?? null;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load workspaces");
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (name: string) => {
      const ws = await workspaceApi.create(name);
      setWorkspaces((prev) => [...prev, ws]);
      setActiveId(ws.id);
      return ws;
    },
    [],
  );

  const rename = useCallback(async (id: number, name: string) => {
    const updated = await workspaceApi.rename(id, name);
    setWorkspaces((prev) => prev.map((w) => (w.id === id ? updated : w)));
  }, []);

  const remove = useCallback(
    async (id: number) => {
      await workspaceApi.remove(id);
      setWorkspaces((prev) => prev.filter((w) => w.id !== id));
      setActiveId((prevActive) => {
        if (prevActive !== id) return prevActive;
        // pick next available after removal
        const remaining = workspaces.filter((w) => w.id !== id);
        return remaining[0]?.id ?? null;
      });
    },
    [workspaces],
  );

  return {
    workspaces,
    activeId,
    setActiveId,
    loading,
    error,
    refresh,
    create,
    rename,
    remove,
    devUserId: DEV_USER_ID,
  };
}
