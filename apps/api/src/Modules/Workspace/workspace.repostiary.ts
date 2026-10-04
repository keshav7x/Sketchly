import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { workspaceTable } from "../../db/schema";
import type { CreateWorkspaceData } from "./Types/workspace.types";

export type WorkspaceSelect = typeof workspaceTable.$inferSelect;
export type WorkspaceInsert = typeof workspaceTable.$inferInsert;

type DbClient = typeof db;

export class WorkspaceRepository {
  constructor(private readonly dbClient: DbClient = db) {}

  create = async (data: CreateWorkspaceData): Promise<WorkspaceSelect> => {
    const [workspace] = await this.dbClient
      .insert(workspaceTable)
      .values({
        name: data.name,
        ownerId: data.ownerId,
      })
      .returning();
    if (!workspace) throw new Error("Failed to create workspace");
    return workspace;
  };

  findWorkspaceById = async (
    workspaceId: number,
  ): Promise<WorkspaceSelect | undefined> => {
    const [workspace] = await this.dbClient
      .select()
      .from(workspaceTable)
      .where(
        and(
          eq(workspaceTable.id, workspaceId),
          eq(workspaceTable.softDelete, false),
        ),
      )
      .limit(1);
    return workspace;
  };

  // Includes soft-deleted rows — for existence / restore checks
  findWorkspaceByIdIncludingDeleted = async (
    workspaceId: number,
  ): Promise<WorkspaceSelect | undefined> => {
    const [workspace] = await this.dbClient
      .select()
      .from(workspaceTable)
      .where(eq(workspaceTable.id, workspaceId))
      .limit(1);
    return workspace;
  };

  findWorkspaceByOwner = async (
    ownerId: number,
  ): Promise<WorkspaceSelect[]> => {
    return await this.dbClient
      .select()
      .from(workspaceTable)
      .where(
        and(
          eq(workspaceTable.ownerId, ownerId),
          eq(workspaceTable.softDelete, false),
        ),
      );
  };

  updateWorkspace = async (
    name: string,
    workspaceId: number,
  ): Promise<WorkspaceSelect | undefined> => {
    const [workspace] = await this.dbClient
      .update(workspaceTable)
      .set({ name, updatedAt: new Date() })
      .where(eq(workspaceTable.id, workspaceId))
      .returning();
    return workspace;
  };

  softDelete = async (
    workspaceId: number,
  ): Promise<WorkspaceSelect | undefined> => {
    const [workspace] = await this.dbClient
      .update(workspaceTable)
      .set({ softDelete: true, updatedAt: new Date() })
      .where(eq(workspaceTable.id, workspaceId))
      .returning();
    return workspace;
  };

  restore = async (
    workspaceId: number,
  ): Promise<WorkspaceSelect | undefined> => {
    const [workspace] = await this.dbClient
      .update(workspaceTable)
      .set({ softDelete: false, updatedAt: new Date() })
      .where(eq(workspaceTable.id, workspaceId))
      .returning();
    return workspace;
  };

  hardDelete = async (
    workspaceId: number,
  ): Promise<WorkspaceSelect | undefined> => {
    const [workspace] = await this.dbClient
      .delete(workspaceTable)
      .where(eq(workspaceTable.id, workspaceId))
      .returning();
    return workspace;
  };

  workspaceExists = async (workspaceId: number): Promise<boolean> => {
    const workspace =
      await this.findWorkspaceByIdIncludingDeleted(workspaceId);
    return Boolean(workspace);
  };
}

// Backwards-compat alias for the old typo'd name.
// Keeps `import { workspaceepostiaryClass }` working.
export const workspaceepostiaryClass = WorkspaceRepository;
export type workspaceepostiaryClass = WorkspaceRepository;

const workspaceRepo = new WorkspaceRepository(db);
export default workspaceRepo;
