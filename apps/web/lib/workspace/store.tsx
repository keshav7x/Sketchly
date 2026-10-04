"use client";

// ---------------------------------------------------------------------------
// Local workspace store. React state only — no backend, no persistence.
// Everything resets on reload, which is exactly what this milestone wants.
// ---------------------------------------------------------------------------

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_BOARDS,
  INITIAL_TAGS,
  WORKSPACES,
  uid,
  type Board,
  type PreviewKind,
  type TagT,
  type TemplateT,
  type WorkspaceT,
} from "./data";

export type BoardView = "grid" | "list";

interface CreateBoardInput {
  name: string;
  workspaceId?: string;
  preview?: PreviewKind;
  accent?: number;
  tags?: string[];
}

interface WorkspaceContextValue {
  workspaces: WorkspaceT[];
  activeWorkspaceId: string;
  activeWorkspace: WorkspaceT;
  switchWorkspace: (id: string) => void;
  createWorkspace: (name: string) => WorkspaceT;
  updateWorkspace: (id: string, patch: Partial<WorkspaceT>) => void;

  boards: Board[];
  boardsInWorkspace: Board[];
  trashedBoards: Board[];
  trashedIds: string[];
  favorites: Board[];
  recentBoards: Board[];
  getBoard: (id: string) => Board | undefined;

  createBoard: (input: CreateBoardInput) => Board;
  renameBoard: (id: string, name: string) => void;
  duplicateBoard: (id: string) => Board | undefined;
  toggleFavorite: (id: string) => void;
  moveBoard: (id: string, workspaceId: string) => void;
  trashBoard: (id: string) => void;
  restoreBoard: (id: string) => void;
  deleteForever: (id: string) => void;
  emptyTrash: () => void;
  touchBoard: (id: string) => void;
  useTemplate: (tpl: TemplateT) => Board;

  tags: TagT[];
  createTag: (name: string) => TagT;
  renameTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
  assignTag: (boardId: string, tagName: string) => void;
  removeTag: (boardId: string, tagName: string) => void;
  tagCount: (name: string) => number;

  view: BoardView;
  setView: (v: BoardView) => void;
  toggleView: () => void;

  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  pendingTag: string | null;
  setPendingTag: (t: string | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const PREVIEW_ROTATION: PreviewKind[] = ["notes", "mindmap", "flow", "kanban", "wireframe", "timeline"];

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<WorkspaceT[]>(WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(WORKSPACES[0]!.id);
  const [boards, setBoards] = useState<Board[]>(INITIAL_BOARDS);
  const [tags, setTags] = useState<TagT[]>(INITIAL_TAGS);
  const [trashedIds, setTrashedIds] = useState<string[]>(["b-landing"]);
  const [view, setView] = useState<BoardView>("grid");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pendingTag, setPendingTag] = useState<string | null>(null);

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0]!;

  const switchWorkspace = useCallback((id: string) => setActiveWorkspaceId(id), []);

  const createWorkspace = useCallback((name: string) => {
    const ws: WorkspaceT = {
      id: uid("ws"),
      name: name.trim(),
      description: "",
      members: 1,
      gradient: Math.floor(Math.random() * 6),
    };
    setWorkspaces((prev) => [...prev, ws]);
    setActiveWorkspaceId(ws.id);
    return ws;
  }, []);

  const updateWorkspace = useCallback((id: string, patch: Partial<WorkspaceT>) => {
    setWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }, []);

  const getBoard = useCallback(
    (id: string) => boards.find((b) => b.id === id),
    [boards],
  );

  const boardsInWorkspace = useMemo(
    () => boards.filter((b) => b.workspaceId === activeWorkspaceId && !trashedIds.includes(b.id)),
    [boards, activeWorkspaceId, trashedIds],
  );

  const trashedBoards = useMemo(
    () => boards.filter((b) => trashedIds.includes(b.id)),
    [boards, trashedIds],
  );

  const favorites = useMemo(
    () => boards.filter((b) => b.favorite && !trashedIds.includes(b.id)),
    [boards, trashedIds],
  );

  const recentBoards = useMemo(
    () =>
      [...boards]
        .filter((b) => !trashedIds.includes(b.id))
        .sort((a, b) => +new Date(b.openedAt) - +new Date(a.openedAt)),
    [boards, trashedIds],
  );

  const createBoard = useCallback(
    (input: CreateBoardInput) => {
      const now = new Date().toISOString();
      const board: Board = {
        id: uid("b"),
        workspaceId: input.workspaceId ?? activeWorkspaceId,
        name: input.name.trim() || "Untitled board",
        owner: "Keshav",
        updatedAt: now,
        openedAt: now,
        tags: input.tags ?? [],
        favorite: false,
        preview: input.preview ?? PREVIEW_ROTATION[Math.floor(Math.random() * PREVIEW_ROTATION.length)]!,
        accent: input.accent ?? Math.floor(Math.random() * 6),
      };
      setBoards((prev) => [board, ...prev]);
      return board;
    },
    [activeWorkspaceId],
  );

  const renameBoard = useCallback((id: string, name: string) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, name: name.trim() || b.name, updatedAt: new Date().toISOString() } : b,
      ),
    );
  }, []);

  const duplicateBoard = useCallback(
    (id: string) => {
      const src = boards.find((b) => b.id === id);
      if (!src) return undefined;
      const now = new Date().toISOString();
      const copy: Board = {
        ...src,
        id: uid("b"),
        name: `${src.name} (copy)`,
        updatedAt: now,
        openedAt: now,
        favorite: false,
      };
      setBoards((prev) => [copy, ...prev]);
      return copy;
    },
    [boards],
  );

  const toggleFavorite = useCallback((id: string) => {
    setBoards((prev) => prev.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
  }, []);

  const moveBoard = useCallback((id: string, workspaceId: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, workspaceId, updatedAt: new Date().toISOString() } : b)),
    );
  }, []);

  const trashBoard = useCallback((id: string) => {
    setTrashedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const restoreBoard = useCallback((id: string) => {
    setTrashedIds((prev) => prev.filter((t) => t !== id));
  }, []);

  const deleteForever = useCallback((id: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== id));
    setTrashedIds((prev) => prev.filter((t) => t !== id));
  }, []);

  const emptyTrash = useCallback(() => {
    setBoards((prev) => prev.filter((b) => !trashedIds.includes(b.id)));
    setTrashedIds([]);
  }, [trashedIds]);

  const touchBoard = useCallback((id: string) => {
    const now = new Date().toISOString();
    setBoards((prev) => prev.map((b) => (b.id === id ? { ...b, openedAt: now } : b)));
  }, []);

  const useTemplate = useCallback(
    (tpl: TemplateT) => {
      const board = createBoard({
        name: tpl.name,
        preview: tpl.preview,
        accent: tpl.accent,
        tags: [...tpl.tags],
      });
      // ensure template tags exist in the tag list
      setTags((prev) => {
        const names = new Set(prev.map((t) => t.name));
        const missing = tpl.tags.filter((t) => !names.has(t)).map((t) => ({ id: uid("t"), name: t }));
        return [...prev, ...missing];
      });
      return board;
    },
    [createBoard],
  );

  const createTag = useCallback((name: string) => {
    const clean = name.trim().replace(/^#/, "").toLowerCase();
    const tag: TagT = { id: uid("t"), name: clean || "untitled" };
    setTags((prev) => {
      if (prev.some((t) => t.name === tag.name)) return prev;
      return [...prev, tag];
    });
    return tag;
  }, []);

  const renameTag = useCallback((id: string, name: string) => {
    const clean = name.trim().replace(/^#/, "").toLowerCase();
    if (!clean) return;
    setTags((prev) => {
      const old = prev.find((t) => t.id === id);
      if (!old) return prev;
      setBoards((bds) =>
        bds.map((b) => (b.tags.includes(old.name) ? { ...b, tags: b.tags.map((t) => (t === old.name ? clean : t)) } : b)),
      );
      return prev.map((t) => (t.id === id ? { ...t, name: clean } : t));
    });
  }, []);

  const deleteTag = useCallback((id: string) => {
    setTags((prev) => {
      const old = prev.find((t) => t.id === id);
      if (old) {
        setBoards((bds) => bds.map((b) => ({ ...b, tags: b.tags.filter((t) => t !== old.name) })));
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const assignTag = useCallback((boardId: string, tagName: string) => {
    const clean = tagName.trim().replace(/^#/, "").toLowerCase();
    if (!clean) return;
    setTags((prev) => (prev.some((t) => t.name === clean) ? prev : [...prev, { id: uid("t"), name: clean }]));
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId && !b.tags.includes(clean) ? { ...b, tags: [...b.tags, clean] } : b)),
    );
  }, []);

  const removeTag = useCallback((boardId: string, tagName: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, tags: b.tags.filter((t) => t !== tagName) } : b)),
    );
  }, []);

  const tagCount = useCallback(
    (name: string) => boards.filter((b) => !trashedIds.includes(b.id) && b.tags.includes(name)).length,
    [boards, trashedIds],
  );

  const toggleView = useCallback(() => {
    setView((v) => (v === "grid" ? "list" : "grid"));
  }, []);

  const value: WorkspaceContextValue = {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    switchWorkspace,
    createWorkspace,
    updateWorkspace,
    boards,
    boardsInWorkspace,
    trashedBoards,
    trashedIds,
    favorites,
    recentBoards,
    getBoard,
    createBoard,
    renameBoard,
    duplicateBoard,
    toggleFavorite,
    moveBoard,
    trashBoard,
    restoreBoard,
    deleteForever,
    emptyTrash,
    touchBoard,
    useTemplate,
    tags,
    createTag,
    renameTag,
    deleteTag,
    assignTag,
    removeTag,
    tagCount,
    view,
    setView,
    toggleView,
    sidebarCollapsed,
    setSidebarCollapsed,
    paletteOpen,
    setPaletteOpen,
    pendingTag,
    setPendingTag,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}
