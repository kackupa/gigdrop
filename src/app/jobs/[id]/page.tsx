'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Job {
  id: number
  title: string
  description: string
  budget_lamports: number
  status: string
  poster_name: string
  darkdrop_claim_code: string | null
  created_at: string
}

export default function JobDetailPage() {
  const params = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [releaseData, setReleaseData] = useState<any>(null)
  const [releasing, setReleasing] = useState(false)

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setJob(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleRelease = async () => {
    setReleasing(true)
    try {
      const res = await fetch('/api/escrow/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: job?.id,
          wallet_address: 'DemoWallet111111111111111111111111111111111111',
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setReleaseData(data)
        setShowPassword(true)
      }
    } catch (err) {
      console.error('Release failed:', err)
    } finally {
      setReleasing(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    )
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Job not found</p>
      </main>
    )
  }

  const statusColors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-700',
    assigned: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-purple-600">GigDrop</Link>
          <Link href="/jobs" className="btn-secondary">Back to Jobs</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[job.status]}`}>
              {job.status}
            </span>
          </div>

          <p className="text-gray-600 mb-6 whitespace-pre-wrap">{job.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p className="text-2xl font-bold text-purple-600">
                {(job.budget_lamports / 1e9).toFixed(2)} SOL
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Posted by</p>
              <p className="font-medium">{job.poster_name || 'Anonymous'}</p>
            </div>
          </div>

          {/* Escrow status */}
          {job.darkdrop_claim_code && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Funds Locked in Escrow</h3>
              <p className="text-sm text-green-700 mb-2">
                Claim code (proves funds exist):
              </p>
              <code className="block bg-white p-2 rounded text-xs break-all">
                {job.darkdrop_claim_code}
              </code>
            </div>
          )}

          {/* Release flow */}
          {job.status === 'assigned' && !showPassword && (
            <button
              onClick={handleRelease}
              disabled={releasing}
              className="btn-primary w-full py-3 text-lg disabled:opacity-50"
            >
              {releasing ? 'Releasing...' : 'Approve Work & Release Payment'}
            </button>
          )}

          {showPassword && releaseData && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Payment Released!</h3>
              <p className="text-sm text-purple-700 mb-3">
                Share this password with the freelancer so they can claim their payment:
              </p>
              <code className="block bg-white p-3 rounded text-sm break-all font-mono">
                {releaseData.password}
              </code>
              <p className="text-xs text-purple-600 mt-2">
                Freelancer payout: {(releaseData.amount_lamports / 1e9).toFixed(2)} SOL
                (Platform fee: {(releaseData.platform_fee_lamports / 1e9).toFixed(4)} SOL)
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
