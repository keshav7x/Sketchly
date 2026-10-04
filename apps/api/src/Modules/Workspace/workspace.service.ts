import workspaceRepo, {
  type WorkspaceRepository,
} from "./workspace.repostiary";
import type { CreateWorkspaceData } from "./Types/workspace.types";
import { eventBroker } from "../../pubsub/eventBroker";
import type { WorkspaceEvent } from "../../pubsub/Events/workspaceEvents";
import { ApiError } from "../../utils/apiError";

export class WorkspaceService {
  private eventBus = eventBroker;
  constructor(private readonly repo: WorkspaceRepository = workspaceRepo) {}

  create = async (data: CreateWorkspaceData) => {
    const { name, ownerId } = data;
    if (!name) throw new ApiError(400, "Name not provided");
    if (!ownerId) throw new ApiError(401, "Unauthorized");

    // TODO: check user exists + handle unique (ownerId, name) conflict -> 409
    const workspace = await this.repo.create({ name, ownerId });
    if (!workspace)
      throw new ApiError(
        400,
        "Something went wrong while creating workspace",
      );

    const event: WorkspaceEvent = {
      type: "workspace.created",
      workspaceId: workspace.id.toString(),
      userId: workspace.ownerId.toString(),
      payload: { name: workspace.name },
      timestamp: Date.now(),
    };
    await this.eventBus.publish(`workspace:${workspace.id}`, event);
    return workspace;
  };

  findWorkspaceById = async (workspaceId: number) => {
    if (!workspaceId) throw new ApiError(400, "Workspace Id not provided");
    const workspace = await this.repo.findWorkspaceById(workspaceId);
    if (!workspace) throw new ApiError(404, "Workspace not found");
    return workspace;
  };

  findWorkspaceByOwner = async (ownerId: number) => {
    if (!ownerId) throw new ApiError(401, "Unauthorized");
    const workspaces = await this.repo.findWorkspaceByOwner(ownerId);
    if (!workspaces || workspaces.length === 0)
      throw new ApiError(404, "No workspaces found, please create one");
    return workspaces;
  };

  updateWorkspace = async (
    workspaceId: number,
    ownerId: number,
    name: string,
  ) => {
    if (!workspaceId) throw new ApiError(400, "WorkspaceId not provided");
    if (!ownerId) throw new ApiError(401, "Unauthorized access");
    if (!name) throw new ApiError(400, "No name provided");

    const existing = await this.repo.findWorkspaceById(workspaceId);
    if (!existing) throw new ApiError(404, "Workspace not found");
    if (Number(existing.ownerId) !== Number(ownerId))
      throw new ApiError(403, "You don't have access to edit the workspace");

    const workspace = await this.repo.updateWorkspace(name, workspaceId);
    if (!workspace) throw new ApiError(404, "No workspace found");

    const event: WorkspaceEvent = {
      type: "workspace.updated",
      workspaceId: workspace.id.toString(),
      userId: workspace.ownerId.toString(),
      payload: { name: workspace.name },
      timestamp: Date.now(),
    };
    await this.eventBus.publish(`workspace:${workspace.id}`, event);
    return workspace;
  };

  deleteWorkspace = async (workspaceId: number, ownerId: number) => {
    if (!workspaceId) throw new ApiError(400, "WorkspaceId not provided");
    if (!ownerId) throw new ApiError(401, "Unauthorized access");

    const existing = await this.repo.findWorkspaceById(workspaceId);
    if (!existing) throw new ApiError(404, "Workspace not found");
    if (Number(existing.ownerId) !== Number(ownerId))
      throw new ApiError(
        403,
        "You don't have access to delete the workspace",
      );

    const workspace = await this.repo.softDelete(workspaceId);
    if (!workspace) throw new ApiError(404, "No workspace found");

    const event: WorkspaceEvent = {
      type: "workspace.deleted",
      workspaceId: workspace.id.toString(),
      userId: workspace.ownerId.toString(),
      payload: {},
      timestamp: Date.now(),
    };
    await this.eventBus.publish(`workspace:${workspace.id}`, event);
    return workspace;
  };

  restoreWorkspace = async (workspaceId: number, ownerId: number) => {
    if (!workspaceId) throw new ApiError(400, "WorkspaceId not provided");
    if (!ownerId) throw new ApiError(401, "Unauthorized access");

    const existing =
      await this.repo.findWorkspaceByIdIncludingDeleted(workspaceId);
    if (!existing) throw new ApiError(404, "Workspace not found");
    if (Number(existing.ownerId) !== Number(ownerId))
      throw new ApiError(
        403,
        "You don't have access to restore the workspace",
      );

    const workspace = await this.repo.restore(workspaceId);
    if (!workspace) throw new ApiError(404, "No workspace found");
    return workspace;
  };
}

// Backwards-compat alias for old name
export const workspaceClass = WorkspaceService;

const workspaceService = new WorkspaceService(workspaceRepo);
export default workspaceService;
