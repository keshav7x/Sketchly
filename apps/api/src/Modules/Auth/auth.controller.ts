import authService, { AuthService } from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { apiResponse } from "../../utils/apiResponse";
import {
  parseEmail,
  parseRequestingUserId,
  parseSessionId,
  parseSessionToken,
  parseUpdateProfile,
  parseUserId,
} from "./auth.utils";

export class AuthController {
  constructor(private readonly service: AuthService = authService) {}

  getUserById = asyncHandler(async (req, res) => {
    const id = parseUserId(req.params.id);
    const data = await this.service.getUserById(id);
    return apiResponse({ res, message: "User fetched", data });
  });

  getUserByEmail = asyncHandler(async (req, res) => {
    const email = parseEmail(req.query.email);
    const data = await this.service.getUserByEmail(email);
    return apiResponse({ res, message: "User fetched", data });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const id = parseUserId(req.params.id);
    const input = parseUpdateProfile(req.body);
    const data = await this.service.updateProfile(id, input);
    return apiResponse({ res, message: "Profile updated", data });
  });

  deleteUser = asyncHandler(async (req, res) => {
    const id = parseUserId(req.params.id);
    const data = await this.service.deleteUser(id);
    return apiResponse({ res, message: "User deleted", data });
  });

  markEmailVerified = asyncHandler(async (req, res) => {
    const id = parseUserId(req.params.id);
    const data = await this.service.markEmailVerified(id);
    return apiResponse({ res, message: "Email verified", data });
  });

  getSessionByToken = asyncHandler(async (req, res) => {
    const token = parseSessionToken(req.params.token);
    const data = await this.service.getSessionByToken(token);
    return apiResponse({ res, message: "Session fetched", data });
  });

  listSessions = asyncHandler(async (req, res) => {
    const userId = parseUserId(req.params.id);
    const data = await this.service.listSessions(userId);
    return apiResponse({ res, message: "Sessions fetched", data });
  });

  revokeSession = asyncHandler(async (req, res) => {
    const sessionId = parseSessionId(req.params.sessionId);
    const requestingUserId = parseRequestingUserId(req.headers["x-user-id"]);
    const data = await this.service.revokeSession(sessionId, requestingUserId);
    return apiResponse({ res, message: "Session revoked", data });
  });

  revokeAllSessions = asyncHandler(async (req, res) => {
    const userId = parseUserId(req.params.id);
    const data = await this.service.revokeAllSessions(userId);
    return apiResponse({ res, message: "All sessions revoked", data });
  });
}

const authController = new AuthController(authService);
export default authController;
