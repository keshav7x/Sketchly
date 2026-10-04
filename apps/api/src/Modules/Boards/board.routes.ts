import { Router } from "express";
import boardController from "./board.controller";

const boardRouter = Router();

// NOTE: specific routes before "/:id" so "owner"/"workspace" aren't treated as ids
boardRouter.post("/", boardController.create);
boardRouter.get("/owner/:ownerId", boardController.listByOwner);
boardRouter.get("/workspace/:workspaceId", boardController.listByWorkspace);
boardRouter.get("/:id", boardController.getById);
boardRouter.patch("/:id", boardController.update);
boardRouter.delete("/:id", boardController.remove);

export default boardRouter;
