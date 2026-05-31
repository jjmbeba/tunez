import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema.js";

export const favorite = sqliteTable(
  "favorite",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stationId: text("station_id").notNull(),
    stationName: text("station_name").notNull(),
    stationFavicon: text("station_favicon"),
    stationStreamUrl: text("station_stream_url").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    uniqueIndex("favorite_user_station_unique").on(table.userId, table.stationId),
    index("favorite_user_id_idx").on(table.userId),
  ],
);

export const listeningHistory = sqliteTable(
  "listening_history",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stationId: text("station_id").notNull(),
    stationName: text("station_name").notNull(),
    stationFavicon: text("station_favicon"),
    stationStreamUrl: text("station_stream_url").notNull(),
    duration: integer("duration").notNull(),
    listenedAt: integer("listened_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("listening_history_user_id_idx").on(table.userId),
    index("listening_history_user_listened_at_idx").on(table.userId, table.listenedAt),
  ],
);

export const favoriteRelations = relations(favorite, ({ one }) => ({
  user: one(user, {
    fields: [favorite.userId],
    references: [user.id],
  }),
}));

export const listeningHistoryRelations = relations(listeningHistory, ({ one }) => ({
  user: one(user, {
    fields: [listeningHistory.userId],
    references: [user.id],
  }),
}));
