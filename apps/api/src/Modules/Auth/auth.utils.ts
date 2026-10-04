import { z } from "zod";
import { ApiError } from "../../utils/apiError";

const userIdSchema = z.object({
  id: z.string().min(1),
});

const sessionIdSchema = z.object({
  sessionId: z.string().min(1),
});

const sessionTokenSchema = z.object({
  token: z.string().min(1),
});

const emailSchema = z.object({
  email: z.string().email(),
});

const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  image: z.string().url().nullable().optional(),
});

export function parseUserId(value: unknown): string {
  const parsed = userIdSchema.safeParse({ id: value });
  if (!parsed.success) throw new ApiError(400, "Invalid user id");
  return parsed.data.id;
}

export function parseSessionId(value: unknown): string {
  const parsed = sessionIdSchema.safeParse({ sessionId: value });
  if (!parsed.success) throw new ApiError(400, "Invalid session id");
  return parsed.data.sessionId;
}

export function parseSessionToken(value: unknown): string {
  const parsed = sessionTokenSchema.safeParse({ token: value });
  if (!parsed.success) throw new ApiError(400, "Invalid session token");
  return parsed.data.token;
}

export function parseEmail(value: unknown): string {
  const parsed = emailSchema.safeParse({ email: value });
  if (!parsed.success) throw new ApiError(400, "Invalid email");
  return parsed.data.email;
}

export function parseUpdateProfile(value: unknown) {
  const parsed = updateProfileSchema.safeParse(value);
  if (!parsed.success) throw new ApiError(400, "Invalid profile data", parsed.error.flatten().fieldErrors);
  if (Object.keys(parsed.data).length === 0) throw new ApiError(400, "No profile fields provided");
  return parsed.data;
}

export function parseRequestingUserId(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) throw new ApiError(401, "Unauthorized");
  return value;
}
