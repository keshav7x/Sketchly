import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  index,
} from "drizzle-orm/pg-core";

export const userTable = pgTable(
  "user",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity(),

    email: varchar({ length: 255 })
      .notNull()
      .unique(),

    age: integer(),

    isVerified: boolean()
      .notNull()
      .default(false),

    createdAt: timestamp({
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp({
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
);



export const workspaceTable = pgTable(
  "workspace",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity(),

    ownerId: integer()
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    name: varchar({ length: 100 })
      .notNull(),

    softDelete:boolean().default(false),

    createdAt: timestamp({
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp({
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    index("workspace_owner_id_idx").on(table.ownerId),
    uniqueIndex("workspace_owner_name_unique").on(
      table.ownerId,
      table.name,
    ),
  ],
);



export const boardTable = pgTable(
  "board",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity(),

    name: varchar({ length: 100 })
      .notNull(),

    description: text(),

    ownerId: integer()
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    workspaceId: integer()
      .notNull()
      .references(() => workspaceTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),


    version: integer()
      .notNull()
      .default(0),

    createdAt: timestamp({
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp({
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    index("board_owner_id_idx").on(table.ownerId),
    index("board_workspace_id_idx").on(table.workspaceId),
    uniqueIndex("board_workspace_name_unique").on(
      table.workspaceId,
      table.name,
    ),
  ],
);