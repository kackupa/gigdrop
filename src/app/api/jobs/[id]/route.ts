import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// GET /api/jobs/[id] - Get job details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = getDb()
  const job = db.prepare(`
    SELECT j.*, u.display_name as poster_name
    FROM jobs j
    JOIN users u ON j.poster_id = u.id
    WHERE j.id = ?
  `).get(params.id)

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  // Don't expose password to non-poster
  const { darkdrop_password, ...safeJob } = job as any
  return NextResponse.json(safeJob)
}

// PATCH /api/jobs/[id] - Update job status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = getDb()

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { status, wallet_address } = body

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(params.id) as any
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  // Verify ownership
  const user = db.prepare('SELECT * FROM users WHERE wallet_address = ?').get(wallet_address) as any
  if (!user || user.id !== job.poster_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Validate status transitions
  const validTransitions: Record<string, string[]> = {
    open: ['assigned', 'cancelled'],
    assigned: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  }

  if (!validTransitions[job.status]?.includes(status)) {
    return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 })
  }

  db.prepare('UPDATE jobs SET status = ?, assigned_to = ? WHERE id = ?')
    .run(status, body.assigned_to || job.assigned_to, params.id)

  const updated = db.prepare('SELECT * FROM jobs WHERE id = ?').get(params.id) as any
  const { darkdrop_password, ...safeUpdated } = updated
  return NextResponse.json(safeUpdated)
}
