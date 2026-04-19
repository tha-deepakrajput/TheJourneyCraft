const { Client } = require('pg');

async function testConnection() {
  const url = process.env.TEST_URL || "postgresql://neondb_owner:npg_R8OPsvW1Arou@ep-gentle-butterfly-amssq9jo-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const client = new Client({
    connectionString: url,
  });

  try {
    await client.connect();
    console.log("Connected successfully to DB!");
    const res = await client.query('SELECT current_database();');
    console.log("Database:", res.rows[0]);
    await client.end();
  } catch (e) {
    console.error("Connection failed:", e);
  }
}

testConnection();
