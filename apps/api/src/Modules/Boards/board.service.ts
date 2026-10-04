import boardRepo, { type BoardRepository } from "./board.repository";
import type { CreateBoardData, UpdateBoardData } from "./Types/board.types";
import { ApiError } from "../../utils/apiError";

export class BoardService {
  constructor(private readonly repo: BoardRepository = boardRepo) {}

  create = async (data: CreateBoardData) => {
    const { name, ownerId, workspaceId } = data;
    if (!name) throw new ApiError(400, "Name not provided");
    if (!ownerId) throw new ApiError(401, "Unauthorized");
    if (!workspaceId) throw new ApiError(400, "WorkspaceId not provided");

    // TODO: verify workspace exists + belongs to owner -> 404/403
    // Unique (workspaceId, name) conflict will throw from DB -> map to 409 later
    const board = await this.repo.create(data);
    if (!board)
      throw new ApiError(400, "Something went wrong while creating board");
    return board;
  };

  findBoardById = async (boardId: number, ownerId: number) => {
    if (!boardId) throw new ApiError(400, "Board Id not provided");
    if (!ownerId) throw new ApiError(401, "Unauthorized");
    const board = await this.repo.findBoardById(boardId);
    if (!board) throw new ApiError(404, "Board not found");
    if (Number(board.ownerId) !== Number(ownerId))
      throw new ApiError(403, "You don't have access to this board");
    return board;
  };

  listByWorkspace = async (workspaceId: number, ownerId: number) => {
    if (!workspaceId) throw new ApiError(400, "WorkspaceId not provided");
    if (!ownerId) throw new ApiError(401, "Unauthorized");
    const boards = await this.repo.findBoardsByWorkspace(workspaceId, ownerId);
    if (!boards || boards.length === 0)
      throw new ApiError(404, "No boards found, please create one");
    return boards;
  };

  listByOwner = async (ownerId: number) => {
    if (!ownerId) throw new ApiError(401, "Unauthorized");
    const boards = await this.repo.findBoardsByOwner(ownerId);
    if (!boards || boards.length === 0)
      throw new ApiError(404, "No boards found, please create one");
    return boards;
  };

  updateBoard = async (
    boardId: number,
    ownerId: number,
    data: UpdateBoardData,
  ) => {
    if (!boardId) throw new ApiError(400, "BoardId not provided");
    if (!ownerId) throw new ApiError(401, "Unauthorized access");
    if (!data || (data.name === undefined && data.description === undefined))
      throw new ApiError(400, "No board fields provided");

    const existing = await this.repo.findBoardById(boardId);
    if (!existing) throw new ApiError(404, "Board not found");
    if (Number(existing.ownerId) !== Number(ownerId))
      throw new ApiError(403, "You don't have access to edit this board");

    const board = await this.repo.updateBoard(boardId, data);
    if (!board) throw new ApiError(404, "Board not found");
    return board;
  };

  deleteBoard = async (boardId: number, ownerId: number) => {
    if (!boardId) throw new ApiError(400, "BoardId not provided");
    if (!ownerId) throw new ApiError(401, "Unauthorized access");

    const existing = await this.repo.findBoardById(boardId);
    if (!existing) throw new ApiError(404, "Board not found");
    if (Number(existing.ownerId) !== Number(ownerId))
      throw new ApiError(403, "You don't have access to delete this board");

    const board = await this.repo.deleteBoard(boardId);
    if (!board) throw new ApiError(404, "Board not found");
    return board;
  };
}

const boardService = new BoardService(boardRepo);
export default boardService;
