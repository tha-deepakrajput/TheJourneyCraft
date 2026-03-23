import { config } from "dotenv";
config({ path: ".env.local" });

import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, uuid, varchar, text, pgEnum } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

// Define the users table schema inline (must match src/db/schema.ts)
const userRoleEnum = pgEnum("user_role", ["Creator", "Explorer"]);
const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: text("image").default(""),
  role: userRoleEnum("role").default("Explorer"),
  password: text("password"),
});

async function seed() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Check if admin already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@journeycraft.com"));

    if (existingUser) {
      await db
        .update(users)
        .set({ name: "Admin", role: "Creator", password: hashedPassword })
        .where(eq(users.email, "admin@journeycraft.com"));
      console.log("Admin user updated successfully.");
    } else {
      await db.insert(users).values({
        name: "Admin",
        email: "admin@journeycraft.com",
        role: "Creator",
        password: hashedPassword,
      });
      console.log("Admin user created successfully.");
    }

    console.log("Seed complete! Email: admin@journeycraft.com / Password: admin123");
  } catch (e) {
    console.error("Seed error:", e);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed();
