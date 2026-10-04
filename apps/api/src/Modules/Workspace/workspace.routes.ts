import { Router } from "express";
import workspaceController from "./workspace.controller";

const workspaceRouter = Router();

workspaceRouter.post("/", workspaceController.create);
workspaceRouter.get("/owner/:ownerId", workspaceController.listByOwner);
workspaceRouter.get("/:id", workspaceController.getById);
workspaceRouter.patch("/:id", workspaceController.update);
workspaceRouter.delete("/:id", workspaceController.remove);
workspaceRouter.post("/:id/restore", workspaceController.restore);

export default workspaceRouter;
