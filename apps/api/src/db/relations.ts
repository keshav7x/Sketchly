import { defineRelations } from "drizzle-orm";
import {
  boardTable,
  userTable,
  workspaceTable,
} from "./schema";

export const relations = defineRelations(
  {
    userTable,
    workspaceTable,
    boardTable,
  },
  (r) => ({
    userTable: {
      workspaces: r.many.workspaceTable({
        from: r.userTable.id,
        to: r.workspaceTable.ownerId,
      }),

      boards: r.many.boardTable({
        from: r.userTable.id,
        to: r.boardTable.ownerId,
      }),
    },

    workspaceTable: {
      owner: r.one.userTable({
        from: r.workspaceTable.ownerId,
        to: r.userTable.id,
      }),

      boards: r.many.boardTable({
        from: r.workspaceTable.id,
        to: r.boardTable.workspaceId,
      }),
    },

    boardTable: {
      owner: r.one.userTable({
        from: r.boardTable.ownerId,
        to: r.userTable.id,
      }),

      workspace: r.one.workspaceTable({
        from: r.boardTable.workspaceId,
        to: r.workspaceTable.id,
      }),
    },
  }),
);
