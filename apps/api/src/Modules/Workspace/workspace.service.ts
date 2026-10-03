import workspaceRepo, { workspaceepostiaryClass } from "./workspace.repostiary";
import { redis } from "../../config/redisClient";
import { type WorkspaceEvent , workspaceEventName} from "../../pubsub/Events/workspaceEvents";
import { eventBroker } from "../../pubsub/eventBroker";
import type { createData } from "./Types/workspace.types";
import { ApiError } from "../../utils/apiError";

export class workspaceClass{
  private eventBus=eventBroker
  constructor(
    private readonly workspaceRepo: workspaceepostiaryClass
  ) { }

  create = async(data:createData) => {
    const { name, ownerId } = { ...data }
    if (!name) throw new ApiError(400, "Name not provided")
    if (!ownerId) throw new ApiError(401, "unauthorized")

    //!Todo : check for user

    const workspace = await this.workspaceRepo.create({
      name,
      ownerId
    })
    if (!workspace) throw new ApiError(400, "Something went wrong while creating workspace")
    const event:WorkspaceEvent={
      type: "workspace.created",
      workspaceId: workspace.id.toString(),
      userId: workspace.ownerId.toString(),
      payload:{},
      timestamp:Date.now()
    }
    this.eventBus.publish(`workspace:${workspace.id}`,event)
    return workspace
  }

  findWorkspaceById = async (workspaceId: number) => {
    if(!workspaceId) throw new ApiError(400,"Workspace Id not provided")
    const workspace = await this.workspaceRepo
      .findWorkspaceById(workspaceId)
    if (!workspace) throw new ApiError(404, "Workspace not found")
    return workspace
  }

  findWorkspaceByOwner = async(ownerId:number) => {
    const workspaces = await this.workspaceRepo.findWorkspaceByOwner(ownerId)
    if (!workspaces) throw new ApiError(404, "No workspaces found,please create one")

    return workspaces

  }

  updateWorkspace = async (workspaceId: number, ownerId: string,name:string) => {
    if (!workspaceId) throw new ApiError(400, "WorkspaceId not provided")
    if (!ownerId) throw new ApiError(401, "unauthorized access")
    if (!name) throw new ApiError(400, "No name provided")
    const doWorkspaceExist = await this.workspaceRepo.findWorkspaceById(workspaceId)
    if (!doWorkspaceExist) throw new ApiError(404, "Workspace not found")
    //TODO : Verify the user and ownwer , set up RBAC
    const doHaveAccess = (doWorkspaceExist.ownerId.toString() == ownerId.toString())
    if(!doHaveAccess) throw new ApiError(403,"You don't have access to edit the workspace")
    const workspace = await this.workspaceRepo.updateWorkspace(name, workspaceId)
    if(!workspace) throw new ApiError(404,"No workspace found")
    const event: WorkspaceEvent = {
      type: "workspace.updated",
      workspaceId: workspace.id.toString(),
      userId: workspace.ownerId.toString(),
      payload: {
        name: workspace.name,
      },
      timestamp: Date.now(),
    };

    await this.eventBus.publish(
      `workspace:${workspace.id}`,
      event
    );
    return workspace;
  }

}
