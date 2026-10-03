import { eq } from "drizzle-orm";
import { db } from "../../db";
import { workspaceTable } from "../../db/schema";

export class workspaceepostiaryClass{
  constructor(
    private readonly workspaceRepo=db
  ) { }

  create = async (data: {
    name: string,
    ownerId: number,
  }) => {
    const [workspace] = await this.workspaceRepo.insert(workspaceTable)
      .values({
        name: data.name!,
        ownerId: data.ownerId!,
      }).returning()
    return workspace
  }

  findWorkspaceById = async (workspaceId: number) => {
      const [workspace] = await this.workspaceRepo
        .select()
        .from(workspaceTable)
        .where(eq(workspaceTable.id, workspaceId));

      return workspace;
  };
  
  }


