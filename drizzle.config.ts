import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load .env.local (Next.js convention)
config({ path: ".env.local" });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Use standard postgres driver for migrations instead of websocket-based serverless driver
  driver: undefined,
});
