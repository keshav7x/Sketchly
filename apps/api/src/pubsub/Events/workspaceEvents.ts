export interface WorkspaceEvent {
  type:
    | "workspace.created"
    | "workspace.updated"
    | "workspace.deleted"

  workspaceId: string;

  userId: string;

  payload: unknown;

  timestamp: number;
}

export const workspaceEventName= {
  created: "workspace.created",
  updated: "workspace.updated",
  deleted:"workspace.deleted"
}
