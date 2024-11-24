import { sqliteTable, text, index, integer } from "drizzle-orm/sqlite-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Enable foreign key support (SQLite specific).
export const enableForeignKeys = "PRAGMA foreign_keys = ON;";

// Define the Users table
export const Users = sqliteTable(
  "Users",
  {
    id: text("id").primaryKey(), // UUID primary key
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    created_at: text("created_at").notNull(), // Store datetime as ISO 8601 string
    updated_at: text("updated_at"),
    last_login: text("last_login"),
  },
  (table) => ({
    usernameIndex: index("idx_users_username").on(table.username),
    idIndex: index("idx_users_id").on(table.id),
  })
);

// Define the Messages table with foreign key constraints
export const Messages = sqliteTable(
  "Messages",
  {
    id: text("id").primaryKey(), // ObjectID primary key
    temp_id: text("message_id").notNull(),
    event_type: text("event_type").notNull(),
    sender_id: text("sender_id")
      .notNull()
      .references(() => Users.id, { onDelete: "cascade" }),
    receiver_id: text("receiver_id")
      .notNull()
      .references(() => Users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    created_at: integer("created_at", { mode: "timestamp" }).notNull(), // Store datetime as ISO 8601 string
    fileUrl: text("file_url"),
    delivered: integer("delivered", { mode: "boolean" }).default(false),
    delivered_at: text("delivered_at"),
    status: text("status", {
      enum: ["sent", "stored", "received", "read", "pending"],
    }),
  },
  (table) => ({
    receiverIdIndex: index("idx_messages_receiver_id").on(table.receiver_id),
  })
);

// Define the ChatList table with foreign key constraints
export const ChatList = sqliteTable("ChatList", {
  userId: text("user_id")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),
  lastMessage: text("last_message").references(() => Messages.id, {
    onDelete: "set null",
  }),
  lastMessageDatetime: integer("last_message_datetime", { mode: "timestamp" }), // Store datetime as ISO 8601 string
});

// Infer the TypeScript types for selecting and inserting
export type User = InferSelectModel<typeof Users>;
export type NewUser = InferInsertModel<typeof Users>;
export type Message = InferSelectModel<typeof Messages>;
export type NewMessage = InferInsertModel<typeof Messages>;
export type ChatListEntry = InferSelectModel<typeof ChatList>;
export type NewChatListEntry = InferInsertModel<typeof ChatList>;
