import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

console.log("Initializing DB with @neondatabase/serverless HTTP driver...");

// Neon HTTP driver doesn't suffer from Node.js UDP/DNS pooling issues in Next.js
// It connects instantaneously over HTTPS requests, natively fixing all ENOTFOUND crashes!
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
