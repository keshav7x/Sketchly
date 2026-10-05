"use client";

import { useCallback, useEffect, useState } from "react";
import { boardApi, type Board } from "./api";

export function useBoards(workspaceId: number | null) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!workspaceId) {
      setBoards([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await boardApi.listByWorkspace(workspaceId);
      setBoards(data);
    } catch (e) {
      // 404 = "no boards yet" from service — treat as empty, not error
      if (e instanceof Error && e.message.toLowerCase().includes("no boards")) {
        setBoards([]);
      } else {
        setError(e instanceof Error ? e.message : "Failed to load boards");
        setBoards([]);
      }
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (name: string, description?: string) => {
      if (!workspaceId) throw new Error("Select a workspace first");
      const board = await boardApi.create(workspaceId, name, description);
      setBoards((prev) => [...prev, board]);
      return board;
    },
    [workspaceId],
  );

  const rename = useCallback(async (id: number, name: string) => {
    const updated = await boardApi.rename(id, name);
    setBoards((prev) => prev.map((b) => (b.id === id ? updated : b)));
  }, []);

  const remove = useCallback(async (id: number) => {
    await boardApi.remove(id);
    setBoards((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { boards, loading, error, refresh, create, rename, remove };
}
