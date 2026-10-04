import { Router } from "express";
import authController from "./auth.controller";

const authRouter = Router();

authRouter.get("/users/by-email", authController.getUserByEmail);
authRouter.get("/users/:id", authController.getUserById);
authRouter.patch("/users/:id", authController.updateProfile);
authRouter.delete("/users/:id", authController.deleteUser);
authRouter.post("/users/:id/verify-email", authController.markEmailVerified);

authRouter.get("/users/:id/sessions", authController.listSessions);
authRouter.delete("/users/:id/sessions", authController.revokeAllSessions);

authRouter.get("/sessions/token/:token", authController.getSessionByToken);
authRouter.delete("/sessions/:sessionId", authController.revokeSession);

export default authRouter;
