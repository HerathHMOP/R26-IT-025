/*
const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function ensureDatabase(connection, dbName) {
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\`
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci`
  );
}

async function ensureMigrationsTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function getAppliedMigrations(connection) {
  const [rows] = await connection.query(
    "SELECT filename FROM schema_migrations"
  );

  return new Set(rows.map((row) => row.filename));
}

async function run() {
  const host = process.env.DB_HOST ?? "localhost";
  const user = process.env.DB_USER ?? "root";
  const password = process.env.DB_PASSWORD ?? "";
  const dbName = process.env.DB_NAME ?? "lms";

  // Create DB if not exists
  const bootstrapConn = await mysql.createConnection({
    host,
    user,
    password,
    multipleStatements: true,
  });

  await ensureDatabase(bootstrapConn, dbName);
  await bootstrapConn.end();

  // Connect to actual DB
  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database: dbName,
    multipleStatements: true,
  });

  await ensureMigrationsTable(connection);

  const applied = await getAppliedMigrations(connection);

  const migrationsDir = path.join(__dirname, "migrations");

  const migrationFiles = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const filename of migrationFiles) {
    if (applied.has(filename)) {
      continue;
    }

    const sql = await fs.readFile(
      path.join(migrationsDir, filename),
      "utf8"
    );

    await connection.beginTransaction();

    try {
      await connection.query(sql);

      await connection.query(
        "INSERT INTO schema_migrations (filename) VALUES (?)",
        [filename]
      );

      await connection.commit();

      console.log(`Applied migration: ${filename}`);
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }

  await connection.end();

  console.log("Migrations complete.");
}

run().catch((error) => {
  console.error("Migration failed:");
  console.error("message:", error.message || "(no message)");

  if (error.code) console.error("code:", error.code);
  if (error.errno) console.error("errno:", error.errno);
  if (error.sqlState) console.error("sqlState:", error.sqlState);
  if (error.sqlMessage) console.error("sqlMessage:", error.sqlMessage);
  if (error.stack) console.error(error.stack);

  process.exit(1);
});
*/


const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function ensureDatabase(connection, dbName) {
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\`
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci`
  );
}

async function ensureMigrationsTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function getAppliedMigrations(connection) {
  const [rows] = await connection.query("SELECT filename FROM schema_migrations");
  return new Set(rows.map((row) => row.filename));
}

async function run() {
  const host = process.env.DB_HOST ?? "localhost";
  const user = process.env.DB_USER ?? "root";
  const password = process.env.DB_PASSWORD ?? "";
  const dbName = process.env.DB_NAME ?? "lms";

  const bootstrapConn = await mysql.createConnection({ host, user, password, multipleStatements: true });
  await ensureDatabase(bootstrapConn, dbName);
  await bootstrapConn.end();

  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database: dbName,
    multipleStatements: true
  });

  await ensureMigrationsTable(connection);
  const applied = await getAppliedMigrations(connection);

  const migrationsDir = path.join(__dirname, "migrations");
  const migrationFiles = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const filename of migrationFiles) {
    if (applied.has(filename)) {
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, filename), "utf8");
    await connection.beginTransaction();
    try {
      await connection.query(sql);
      await connection.query("INSERT INTO schema_migrations (filename) VALUES (?)", [filename]);
      await connection.commit();
      console.log(`Applied migration: ${filename}`);
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }

  await connection.end();
  console.log("Migrations complete.");
}

run().catch((error) => {
  console.error("Migration failed:");
  console.error("  message:", error.message || "(no message)");
  if (error.code) console.error("  code:", error.code);
  if (error.errno) console.error("  errno:", error.errno);
  if (error.sqlState) console.error("  sqlState:", error.sqlState);
  if (error.sqlMessage) console.error("  sqlMessage:", error.sqlMessage);
  if (error.stack) console.error(error.stack);
  process.exit(1);
});
