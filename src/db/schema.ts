import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  galleries: many(gallery),
}));

export const gallery = pgTable("gallery", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const galleryRelations = relations(gallery, ({ one, many }) => ({
  user: one(user, {
    fields: [gallery.userId],
    references: [user.id],
  }),
  imgs: many(img),
  galleryTags: many(galleryTag),
}));

export const img = pgTable(
  "img",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    galleryId: uuid("gallery_id")
      .notNull()
      .references(() => gallery.id),
    order: integer("order").notNull(), // position in the gallery
  },
  (table) => ({})
);

export const imgRelations = relations(img, ({ one }) => ({
  gallery: one(gallery, {
    fields: [img.galleryId],
    references: [gallery.id],
  }),
}));

export const tag = pgTable("tag", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const tagRelations = relations(tag, ({ many }) => ({
  galleryTags: many(galleryTag),
}));

export const galleryTag = pgTable(
  "gallery_tag",
  {
    galleryId: uuid("gallery_id")
      .notNull()
      .references(() => gallery.id),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tag.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.galleryId, table.tagId] }),
  })
);

export const galleryTagRelations = relations(galleryTag, ({ one, many }) => ({
  gallery: one(gallery, {
    fields: [galleryTag.galleryId],
    references: [gallery.id],
  }),
  tag: one(tag, {
    fields: [galleryTag.tagId],
    references: [tag.id],
  }),
}));
