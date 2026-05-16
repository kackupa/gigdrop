import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// GET /api/jobs/user?wallet=xxx - Get jobs for a specific user
export async function GET(request: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
  }

  const user = db.prepare('SELECT * FROM users WHERE wallet_address = ?').get(wallet) as any
  if (!user) {
    return NextResponse.json([])
  }

  const jobs = db.prepare(`
    SELECT j.*, u.display_name as poster_name
    FROM jobs j
    JOIN users u ON j.poster_id = u.id
    WHERE j.poster_id = ? OR j.assigned_to = ?
    ORDER BY j.created_at DESC
    LIMIT 50
  `).all(user.id, user.id)

  return NextResponse.json(jobs)
}
