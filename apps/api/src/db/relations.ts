import { relations } from "drizzle-orm";
import {
  boardTable,
  userTable,
  workspaceTable,
} from "./schema";

export const userRelations = relations(
  userTable,
  ({ many }) => ({
    workspaces: many(workspaceTable),
    boards: many(boardTable),
  }),
);

export const workspaceRelations = relations(
  workspaceTable,
  ({ one, many }) => ({
    owner: one(userTable, {
      fields: [workspaceTable.ownerId],
      references: [userTable.id],
    }),

    boards: many(boardTable),
  }),
);

export const boardRelations = relations(
  boardTable,
  ({ one }) => ({
    owner: one(userTable, {
      fields: [boardTable.ownerId],
      references: [userTable.id],
    }),

    workspace: one(workspaceTable, {
      fields: [boardTable.workspaceId],
      references: [workspaceTable.id],
    }),
  }),
);
