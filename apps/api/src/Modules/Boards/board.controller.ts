import boardService, { BoardService } from "./board.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { apiResponse } from "../../utils/apiResponse";
import {
  parseBoardId,
  parseCreateBoard,
  parseRequestOwnerId,
  parseUpdateBoard,
  parseWorkspaceId,
} from "./board.utils";

export class BoardController {
  constructor(private readonly service: BoardService = boardService) {}

  create = asyncHandler(async (req, res) => {
    // ownerId from x-user-id header wins over body (single-user mode)
    const headerOwner = req.headers["x-user-id"];
    const body = parseCreateBoard({
      ...req.body,
      ...(headerOwner ? { ownerId: headerOwner } : {}),
    });
    const data = await this.service.create(body);
    return apiResponse({
      res,
      statusCode: 201,
      message: "Board created",
      data,
    });
  });

  getById = asyncHandler(async (req, res) => {
    const id = parseBoardId(req.params.id);
    const ownerId = parseRequestOwnerId(
      req.headers["x-user-id"] ?? req.query.ownerId,
    );
    const data = await this.service.findBoardById(id, ownerId);
    return apiResponse({ res, message: "Board fetched", data });
  });

  listByWorkspace = asyncHandler(async (req, res) => {
    const workspaceId = parseWorkspaceId(req.params.workspaceId);
    const ownerId = parseRequestOwnerId(
      req.headers["x-user-id"] ?? req.query.ownerId,
    );
    const data = await this.service.listByWorkspace(workspaceId, ownerId);
    return apiResponse({ res, message: "Boards fetched", data });
  });

  listByOwner = asyncHandler(async (req, res) => {
    const raw =
      req.params.ownerId ?? req.query.ownerId ?? req.headers["x-user-id"];
    const ownerId = parseRequestOwnerId(raw);
    const data = await this.service.listByOwner(ownerId);
    return apiResponse({ res, message: "Boards fetched", data });
  });

  update = asyncHandler(async (req, res) => {
    const boardId = parseBoardId(req.params.id);
    const ownerId = parseRequestOwnerId(
      req.headers["x-user-id"] ?? (req.body as { ownerId?: unknown }).ownerId,
    );
    const input = parseUpdateBoard(req.body);
    const data = await this.service.updateBoard(boardId, ownerId, input);
    return apiResponse({ res, message: "Board updated", data });
  });

  remove = asyncHandler(async (req, res) => {
    const boardId = parseBoardId(req.params.id);
    const ownerId = parseRequestOwnerId(
      req.headers["x-user-id"] ??
        (req.body as { ownerId?: unknown })?.ownerId ??
        req.query.ownerId,
    );
    const data = await this.service.deleteBoard(boardId, ownerId);
    return apiResponse({ res, message: "Board deleted", data });
  });
}

const boardController = new BoardController(boardService);
export default boardController;
