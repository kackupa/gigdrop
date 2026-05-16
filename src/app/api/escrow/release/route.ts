import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// POST /api/escrow/release - Release escrow password to freelancer
export async function POST(request: NextRequest) {
  const db = getDb()

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { job_id, wallet_address } = body

  if (!job_id || !wallet_address) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(job_id) as any
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  const user = db.prepare('SELECT * FROM users WHERE wallet_address = ?').get(wallet_address) as any
  if (!user || user.id !== job.poster_id) {
    return NextResponse.json({ error: 'Only the job poster can release escrow' }, { status: 403 })
  }

  if (job.status !== 'assigned') {
    return NextResponse.json({ error: 'Job must be assigned to release escrow' }, { status: 400 })
  }

  const escrow = db.prepare('SELECT * FROM escrows WHERE job_id = ? AND status = ?').get(job_id, 'locked') as any
  if (!escrow) {
    return NextResponse.json({ error: 'No locked escrow found for this job' }, { status: 404 })
  }

  // Mark escrow as released
  db.prepare('UPDATE escrows SET status = ? WHERE id = ?').run('released', escrow.id)

  // Mark job as completed
  db.prepare('UPDATE jobs SET status = ? WHERE id = ?').run('completed', job_id)

  // Return the password so the poster can share it with the freelancer
  return NextResponse.json({
    message: 'Escrow released. Share this password with the freelancer.',
    password: escrow.password,
    claim_code: escrow.claim_code,
    amount_lamports: escrow.amount_lamports,
    platform_fee_lamports: escrow.platform_fee_lamports,
  })
}
