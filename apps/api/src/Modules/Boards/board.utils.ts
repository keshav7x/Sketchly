import { z } from "zod";
import { ApiError } from "../../utils/apiError";

const boardIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const workspaceIdSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
});

const ownerIdSchema = z.object({
  ownerId: z.coerce.number().int().positive(),
});

const createBoardSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(1000).optional(),
  ownerId: z.coerce.number().int().positive(),
  workspaceId: z.coerce.number().int().positive(),
});

const updateBoardSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(1000).nullable().optional(),
  })
  .refine((v) => v.name !== undefined || v.description !== undefined, {
    message: "No board fields provided",
  });

export function parseBoardId(value: unknown): number {
  const parsed = boardIdSchema.safeParse({ id: value });
  if (!parsed.success) throw new ApiError(400, "Invalid board id");
  return parsed.data.id;
}

export function parseWorkspaceId(value: unknown): number {
  const parsed = workspaceIdSchema.safeParse({ workspaceId: value });
  if (!parsed.success) throw new ApiError(400, "Invalid workspace id");
  return parsed.data.workspaceId;
}

export function parseOwnerId(value: unknown): number {
  const parsed = ownerIdSchema.safeParse({ ownerId: value });
  if (!parsed.success) throw new ApiError(400, "Invalid owner id");
  return parsed.data.ownerId;
}

export function parseCreateBoard(value: unknown) {
  const parsed = createBoardSchema.safeParse(value);
  if (!parsed.success)
    throw new ApiError(
      400,
      "Invalid board data",
      parsed.error.flatten().fieldErrors,
    );
  return parsed.data;
}

export function parseUpdateBoard(value: unknown) {
  const parsed = updateBoardSchema.safeParse(value);
  if (!parsed.success)
    throw new ApiError(
      400,
      "Invalid board data",
      parsed.error.flatten().fieldErrors,
    );
  return parsed.data;
}

export function parseRequestOwnerId(value: unknown): number {
  const num =
    typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  return parseOwnerId(num);
}
