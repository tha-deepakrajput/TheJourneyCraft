import { db } from "./src/db";
import { users } from "./src/db/schema";

async function main() {
  const allUsers = await db.select().from(users);
  console.log("Users in DB:");
  allUsers.forEach(u => {
    console.log(`Email: ${u.email}, Image: ${u.image}`);
  });
  process.exit(0);
}

main().catch(console.error);
