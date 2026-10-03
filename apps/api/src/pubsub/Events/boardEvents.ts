export interface BoardEvent {
  type:
    | "shape.created"
    | "shape.updated"
    | "shape.deleted"
    | "cursor.moved";

  boardId: string;

  userId: string;

  payload: unknown;

  timestamp: number;
}