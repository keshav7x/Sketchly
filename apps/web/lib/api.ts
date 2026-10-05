// Single-user dev client. No auth yet — hardcoded user id sent as x-user-id,
// matching board.service.ts / workspace.service.ts expectations.
export const DEV_USER_ID = 1;

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface Workspace {
  id: number;
  name: string;
  ownerId: number;
  softDelete?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Board {
  id: number;
  name: string;
  description?: string | null;
  ownerId: number;
  workspaceId: number;
  version: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": String(DEV_USER_ID),
      ...(init.headers ?? {}),
    },
  });
  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || !json) {
    const msg =
      (json as unknown as { message?: string } | null)?.message ??
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json.data;
}

// ---------- Workspaces ----------
export const workspaceApi = {
  list: () => request<Workspace[]>(`/api/workspaces/owner/${DEV_USER_ID}`),
  get: (id: number) => request<Workspace>(`/api/workspaces/${id}`),
  create: (name: string) =>
    request<Workspace>(`/api/workspaces`, {
      method: "POST",
      body: JSON.stringify({ name, ownerId: DEV_USER_ID }),
    }),
  rename: (id: number, name: string) =>
    request<Workspace>(`/api/workspaces/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
  remove: (id: number) =>
    request<Workspace>(`/api/workspaces/${id}`, { method: "DELETE" }),
};

// ---------- Boards ----------
export const boardApi = {
  listByWorkspace: (workspaceId: number) =>
    request<Board[]>(`/api/boards/workspace/${workspaceId}?ownerId=${DEV_USER_ID}`),
  get: (id: number) =>
    request<Board>(`/api/boards/${id}?ownerId=${DEV_USER_ID}`),
  create: (workspaceId: number, name: string, description?: string) =>
    request<Board>(`/api/boards`, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        workspaceId,
        ownerId: DEV_USER_ID,
      }),
    }),
  rename: (id: number, name: string) =>
    request<Board>(`/api/boards/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
  remove: (id: number) =>
    request<Board>(`/api/boards/${id}`, { method: "DELETE" }),
};
