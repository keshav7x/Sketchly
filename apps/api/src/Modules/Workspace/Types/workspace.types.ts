export interface CreateWorkspaceData {
  name: string;
  ownerId: number;
}

export interface UpdateWorkspaceData {
  name: string;
}

export interface WorkspaceIdInput {
  workspaceId: number;
}

export interface WorkspaceOwnerInput {
  ownerId: number;
}

// Keep old name working so existing imports don't break
export type createData = CreateWorkspaceData;
