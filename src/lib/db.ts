import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'gigdrop.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initDb(db)
  }
  return db
}

function initDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_address TEXT UNIQUE NOT NULL,
      display_name TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poster_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      budget_lamports INTEGER NOT NULL,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'assigned', 'completed', 'cancelled')),
      assigned_to INTEGER,
      darkdrop_claim_code TEXT,
      darkdrop_password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (poster_id) REFERENCES users(id),
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS escrows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      claim_code TEXT NOT NULL,
      password TEXT NOT NULL,
      amount_lamports INTEGER NOT NULL,
      platform_fee_lamports INTEGER NOT NULL,
      status TEXT DEFAULT 'locked' CHECK(status IN ('locked', 'released', 'refunded')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id)
    );

    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    CREATE INDEX IF NOT EXISTS idx_jobs_poster ON jobs(poster_id);
    CREATE INDEX IF NOT EXISTS idx_escrows_job ON escrows(job_id);
  `)
}
