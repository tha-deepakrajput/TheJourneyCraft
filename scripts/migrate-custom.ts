import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
config({ path: ".env.local" });

async function run() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    console.log("Adding verified column...");
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false`;
    
    console.log("Adding verification_code column...");
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6)`;
    
    console.log("Adding verification_code_expiry column...");
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code_expiry TIMESTAMP`;
    
    console.log("Adding user_id column to submissions...");
    await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS user_id UUID`;

    try {
      console.log("Adding foreign key constraint...");
      await sql`ALTER TABLE submissions ADD CONSTRAINT submissions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION`;
    } catch (e: any) {
      if (e.message.includes("already exists")) {
        console.log("Foreign key already exists");
      } else {
        throw e;
      }
    }
    
    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration error:", error);
  }
}

run();
