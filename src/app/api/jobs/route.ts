import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// GET /api/jobs - List all open jobs
export async function GET(request: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'open'

  const jobs = db.prepare(`
    SELECT j.*, u.display_name as poster_name
    FROM jobs j
    JOIN users u ON j.poster_id = u.id
    WHERE j.status = ?
    ORDER BY j.created_at DESC
    LIMIT 50
  `).all(status)

  return NextResponse.json(jobs)
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  const db = getDb()

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { wallet_address, title, description, budget_lamports } = body

  if (!wallet_address || !title || !description || !budget_lamports) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (typeof budget_lamports !== 'number' || budget_lamports <= 0) {
    return NextResponse.json({ error: 'Invalid budget amount' }, { status: 400 })
  }

  // Get or create user (upsert avoids race condition)
  db.prepare('INSERT OR IGNORE INTO users (wallet_address) VALUES (?)').run(wallet_address)
  const user = db.prepare('SELECT * FROM users WHERE wallet_address = ?').get(wallet_address) as any

  // Create job
  const result = db.prepare(`
    INSERT INTO jobs (poster_id, title, description, budget_lamports)
    VALUES (?, ?, ?, ?)
  `).run(user.id, title, description, budget_lamports)

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid)

  return NextResponse.json(job, { status: 201 })
}
