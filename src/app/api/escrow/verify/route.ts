import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// GET /api/escrow/verify?job_id=xxx - Verify escrow status for a job
export async function GET(request: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('job_id')

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
  }

  const job = db.prepare(`
    SELECT j.*, u.display_name as poster_name
    FROM jobs j
    JOIN users u ON j.poster_id = u.id
    WHERE j.id = ?
  `).get(jobId) as any

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  const escrow = db.prepare(`
    SELECT * FROM escrows WHERE job_id = ? ORDER BY created_at DESC LIMIT 1
  `).get(jobId) as any

  const funded = !!escrow && escrow.status === 'locked'

  return NextResponse.json({
    job_id: job.id,
    job_title: job.title,
    poster: job.poster_name || 'Anonymous',
    claim_code: escrow?.claim_code || null,
    amount_lamports: escrow?.amount_lamports || job.budget_lamports,
    platform_fee_lamports: escrow?.platform_fee_lamports || 0,
    status: escrow?.status || 'not_deposited',
    funded,
    created_at: job.created_at,
  })
}
