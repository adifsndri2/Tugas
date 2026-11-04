import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const dbPath = resolve(process.cwd(), "db", "catalog.db");
mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS catalogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_path TEXT,
    name TEXT NOT NULL,
    description TEXT,
    link TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
