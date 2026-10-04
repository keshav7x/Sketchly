import authRepository, { AuthRepository } from "./auth.repository";
import { ApiError } from "../../utils/apiError";
import type { UpdateProfileInput } from "./Types/auth.types";

export class AuthService {
  constructor(private readonly authRepo: AuthRepository = authRepository) {}

  getUserById = async (id: string) => {
    if (!id) throw new ApiError(400, "User id not provided");
    const user = await this.authRepo.findUserById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  };

  getUserByEmail = async (email: string) => {
    if (!email) throw new ApiError(400, "Email not provided");
    const user = await this.authRepo.findUserByEmail(email);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  };

  updateProfile = async (id: string, input: UpdateProfileInput) => {
    if (!id) throw new ApiError(400, "User id not provided");
    const existing = await this.authRepo.findUserById(id);
    if (!existing) throw new ApiError(404, "User not found");
    const updated = await this.authRepo.updateUser(id, input);
    if (!updated) throw new ApiError(404, "User not found");
    return updated;
  };

  deleteUser = async (id: string) => {
    if (!id) throw new ApiError(400, "User id not provided");
    const existing = await this.authRepo.findUserById(id);
    if (!existing) throw new ApiError(404, "User not found");
    const deleted = await this.authRepo.deleteUserById(id);
    if (!deleted) throw new ApiError(404, "User not found");
    return deleted;
  };

  markEmailVerified = async (id: string) => {
    if (!id) throw new ApiError(400, "User id not provided");
    const existing = await this.authRepo.findUserById(id);
    if (!existing) throw new ApiError(404, "User not found");
    const updated = await this.authRepo.setEmailVerified(id, true);
    if (!updated) throw new ApiError(404, "User not found");
    return updated;
  };

  getSessionByToken = async (token: string) => {
    if (!token) throw new ApiError(400, "Session token not provided");
    const found = await this.authRepo.findSessionByToken(token);
    if (!found) throw new ApiError(404, "Session not found");
    return found;
  };

  listSessions = async (userId: string) => {
    if (!userId) throw new ApiError(401, "Unauthorized");
    const exists = await this.authRepo.userExistsById(userId);
    if (!exists) throw new ApiError(404, "User not found");
    return await this.authRepo.findSessionsByUserId(userId);
  };

  revokeSession = async (sessionId: string, requestingUserId: string) => {
    if (!sessionId) throw new ApiError(400, "Session id not provided");
    if (!requestingUserId) throw new ApiError(401, "Unauthorized");
    const found = await this.authRepo.findSessionById(sessionId);
    if (!found) throw new ApiError(404, "Session not found");
    if (found.userId !== requestingUserId) throw new ApiError(403, "You don't have access to this session");
    const deleted = await this.authRepo.deleteSessionById(sessionId);
    if (!deleted) throw new ApiError(404, "Session not found");
    return deleted;
  };

  revokeAllSessions = async (userId: string) => {
    if (!userId) throw new ApiError(401, "Unauthorized");
    const exists = await this.authRepo.userExistsById(userId);
    if (!exists) throw new ApiError(404, "User not found");
    return await this.authRepo.deleteSessionsByUserId(userId);
  };
}

const authService = new AuthService(authRepository);
export default authService;
