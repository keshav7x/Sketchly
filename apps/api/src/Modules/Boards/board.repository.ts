import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { boardTable } from "../../db/schema";
import type { CreateBoardData, UpdateBoardData } from "./Types/board.types";

export type BoardSelect = typeof boardTable.$inferSelect;
export type BoardInsert = typeof boardTable.$inferInsert;

type DbClient = typeof db;

export class BoardRepository {
  constructor(private readonly dbClient: DbClient = db) {}

  create = async (data: CreateBoardData): Promise<BoardSelect> => {
    const [board] = await this.dbClient
      .insert(boardTable)
      .values({
        name: data.name,
        description: data.description ?? null,
        ownerId: data.ownerId,
        workspaceId: data.workspaceId,
      })
      .returning();
    if (!board) throw new Error("Failed to create board");
    return board;
  };

  findBoardById = async (
    boardId: number,
  ): Promise<BoardSelect | undefined> => {
    const [board] = await this.dbClient
      .select()
      .from(boardTable)
      .where(eq(boardTable.id, boardId))
      .limit(1);
    return board;
  };

  findBoardsByWorkspace = async (
    workspaceId: number,
    ownerId: number,
  ): Promise<BoardSelect[]> => {
    return await this.dbClient
      .select()
      .from(boardTable)
      .where(
        and(
          eq(boardTable.workspaceId, workspaceId),
          eq(boardTable.ownerId, ownerId),
        ),
      );
  };

  findBoardsByOwner = async (ownerId: number): Promise<BoardSelect[]> => {
    return await this.dbClient
      .select()
      .from(boardTable)
      .where(eq(boardTable.ownerId, ownerId));
  };

  updateBoard = async (
    boardId: number,
    data: UpdateBoardData,
  ): Promise<BoardSelect | undefined> => {
    const [board] = await this.dbClient
      .update(boardTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(boardTable.id, boardId))
      .returning();
    return board;
  };

  deleteBoard = async (
    boardId: number,
  ): Promise<BoardSelect | undefined> => {
    const [board] = await this.dbClient
      .delete(boardTable)
      .where(eq(boardTable.id, boardId))
      .returning();
    return board;
  };

  boardExists = async (boardId: number): Promise<boolean> => {
    const board = await this.findBoardById(boardId);
    return Boolean(board);
  };
}

const boardRepo = new BoardRepository(db);
export default boardRepo;
