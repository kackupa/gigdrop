import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { createDrop, calculatePlatformFee } from '@/lib/darkdrop'

// POST /api/escrow - Fund a job escrow via DarkDrop
export async function POST(request: NextRequest) {
  const db = getDb()

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { job_id, wallet_address, claim_code, password, tx_signature } = body

  if (!job_id || !wallet_address || !claim_code || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(job_id) as any
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  const user = db.prepare('SELECT * FROM users WHERE wallet_address = ?').get(wallet_address) as any
  if (!user || user.id !== job.poster_id) {
    return NextResponse.json({ error: 'Only the job poster can fund escrow' }, { status: 403 })
  }

  if (job.status !== 'open') {
    return NextResponse.json({ error: 'Job is not open for funding' }, { status: 400 })
  }

  const platformFee = calculatePlatformFee(job.budget_lamports)

  // Store escrow details
  db.prepare(`
    INSERT INTO escrows (job_id, claim_code, password, amount_lamports, platform_fee_lamports)
    VALUES (?, ?, ?, ?, ?)
  `).run(job_id, claim_code, password, job.budget_lamports, platformFee)

  // Update job with claim code (visible to prove funds exist)
  db.prepare(`
    UPDATE jobs SET darkdrop_claim_code = ?, status = 'assigned' WHERE id = ?
  `).run(claim_code, job_id)

  const updated = db.prepare('SELECT * FROM jobs WHERE id = ?').get(job_id)
  return NextResponse.json(updated, { status: 201 })
}
