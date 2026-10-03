import { eq } from "drizzle-orm";
import { db } from "../../db";
import { workspaceTable } from "../../db/schema";
import type { createData } from "./Types/workspace.types";

export class workspaceepostiaryClass{
  constructor(
    private readonly workspaceRepo=db
  ) { }

  create = async (data: createData) => {
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

  findWorkspaceByOwner = async (ownerId:number) => {
    const [workspaces] = await this.workspaceRepo
      .select()
      .from(workspaceTable)
      .where(eq(workspaceTable.ownerId, ownerId))

    return workspaces
  }

  updateWorkspace = async (name: string,workspaceId:number) => {
    const [workspace] = await this.workspaceRepo.update(workspaceTable).set({
      name:name
    }).where(eq(workspaceTable.id,workspaceId)).returning()
    return workspace
  }

  softDelete = async () => {
    const workspace = await this.workspaceRepo.update(workspaceTable).set({
      softDelete:true
    })
    return workspace
  }

  private workspaceExist = async (workspaceId:number):Promise<boolean> => {
    const workspace = await this.findWorkspaceById(workspaceId)
    const exist = workspace ? true : false
    return exist
  }

}

const workspaceRepo = new workspaceepostiaryClass(db)
export default workspaceRepo
