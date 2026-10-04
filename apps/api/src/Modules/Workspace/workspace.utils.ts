import { z } from "zod";
import { ApiError } from "../../utils/apiError";

const workspaceIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const ownerIdSchema = z.object({
  ownerId: z.coerce.number().int().positive(),
});

const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(100),
  ownerId: z.coerce.number().int().positive(),
});

const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export function parseWorkspaceId(value: unknown): number {
  const parsed = workspaceIdSchema.safeParse({ id: value });
  if (!parsed.success) throw new ApiError(400, "Invalid workspace id");
  return parsed.data.id;
}

export function parseOwnerId(value: unknown): number {
  const parsed = ownerIdSchema.safeParse({ ownerId: value });
  if (!parsed.success) throw new ApiError(400, "Invalid owner id");
  return parsed.data.ownerId;
}

export function parseCreateWorkspace(value: unknown) {
  const parsed = createWorkspaceSchema.safeParse(value);
  if (!parsed.success)
    throw new ApiError(
      400,
      "Invalid workspace data",
      parsed.error.flatten().fieldErrors,
    );
  return parsed.data;
}

export function parseUpdateWorkspace(value: unknown) {
  const parsed = updateWorkspaceSchema.safeParse(value);
  if (!parsed.success)
    throw new ApiError(
      400,
      "Invalid workspace data",
      parsed.error.flatten().fieldErrors,
    );
  return parsed.data;
}

export function parseRequestOwnerId(value: unknown): number {
  const num =
    typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  return parseOwnerId(num);
}
