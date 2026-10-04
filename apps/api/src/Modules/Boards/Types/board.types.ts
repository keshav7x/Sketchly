export interface CreateBoardData {
  name: string;
  description?: string;
  ownerId: number;
  workspaceId: number;
}

export interface UpdateBoardData {
  name?: string;
  description?: string | null;
}

export interface BoardIdInput {
  boardId: number;
}

export interface BoardWorkspaceInput {
  workspaceId: number;
}
