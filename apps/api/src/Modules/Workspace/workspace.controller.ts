import workspaceService, { WorkspaceService } from "./workspace.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { apiResponse } from "../../utils/apiResponse";
import {
  parseCreateWorkspace,
  parseOwnerId,
  parseRequestOwnerId,
  parseUpdateWorkspace,
  parseWorkspaceId,
} from "./workspace.utils";

export class WorkspaceController {
  constructor(private readonly service: WorkspaceService = workspaceService) {}

  create = asyncHandler(async (req, res) => {
    // Allow ownerId from header x-user-id or body; header wins if present
    const headerOwner = req.headers["x-user-id"];
    const body = parseCreateWorkspace({
      ...req.body,
      ...(headerOwner ? { ownerId: headerOwner } : {}),
    });
    const data = await this.service.create(body);
    return apiResponse({
      res,
      statusCode: 201,
      message: "Workspace created",
      data,
    });
  });

  getById = asyncHandler(async (req, res) => {
    const id = parseWorkspaceId(req.params.id);
    const data = await this.service.findWorkspaceById(id);
    return apiResponse({ res, message: "Workspace fetched", data });
  });

  listByOwner = asyncHandler(async (req, res) => {
    // GET /owner/:ownerId OR fallback to ?ownerId= / x-user-id header
    const raw =
      req.params.ownerId ?? req.query.ownerId ?? req.headers["x-user-id"];
    const ownerId = parseRequestOwnerId(raw);
    const data = await this.service.findWorkspaceByOwner(ownerId);
    return apiResponse({ res, message: "Workspaces fetched", data });
  });

  update = asyncHandler(async (req, res) => {
    const workspaceId = parseWorkspaceId(req.params.id);
    const ownerId = parseRequestOwnerId(
      req.headers["x-user-id"] ?? (req.body as { ownerId?: unknown }).ownerId,
    );
    const { name } = parseUpdateWorkspace(req.body);
    const data = await this.service.updateWorkspace(
      workspaceId,
      ownerId,
      name,
    );
    return apiResponse({ res, message: "Workspace updated", data });
  });

  remove = asyncHandler(async (req, res) => {
    const workspaceId = parseWorkspaceId(req.params.id);
    const ownerId = parseRequestOwnerId(
      req.headers["x-user-id"] ??
        (req.body as { ownerId?: unknown })?.ownerId ??
        req.query.ownerId,
    );
    const data = await this.service.deleteWorkspace(workspaceId, ownerId);
    return apiResponse({ res, message: "Workspace deleted", data });
  });

  restore = asyncHandler(async (req, res) => {
    const workspaceId = parseWorkspaceId(req.params.id);
    const ownerId = parseOwnerId(
      (req.body as { ownerId?: unknown }).ownerId ??
        req.headers["x-user-id"],
    );
    const data = await this.service.restoreWorkspace(workspaceId, ownerId);
    return apiResponse({ res, message: "Workspace restored", data });
  });
}

const workspaceController = new WorkspaceController(workspaceService);
export default workspaceController;
