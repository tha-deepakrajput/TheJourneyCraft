import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["Creator", "Explorer"]);
export const submissionStatusEnum = pgEnum("submission_status", [
  "Pending",
  "Approved",
  "Rejected",
]);

// ─── Users ───────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: text("image").default(""),
  role: userRoleEnum("role").default("Explorer"),
  password: text("password"),
  verified: boolean("verified").default(false),
  verificationCode: varchar("verification_code", { length: 6 }),
  verificationCodeExpiry: timestamp("verification_code_expiry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Journeys ────────────────────────────────────────────
export const journeys = pgTable("journeys", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  image: text("image").default(""),
  video: text("video").default(""),
  date: varchar("date", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Blogs ───────────────────────────────────────────────
export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  author: varchar("author", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Messages ────────────────────────────────────────────
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Submissions ─────────────────────────────────────────
export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  story: text("story").notNull(),
  images: text("images").array().default([]),
  video: text("video"),
  category: varchar("category", { length: 100 }),
  status: submissionStatusEnum("status").default("Pending"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
