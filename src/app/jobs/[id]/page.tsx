'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { useWallet } from '@/components/WalletProvider'

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
  const { publicKey, connected } = useWallet()
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
    if (!connected || !publicKey) {
      alert('Please connect your wallet first')
      return
    }

    setReleasing(true)
    try {
      const res = await fetch('/api/escrow/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: job?.id,
          wallet_address: publicKey,
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
      <main className="min-h-screen dot-bg">
        <Navbar />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <p className="text-[var(--text-dim)] text-xs">Loading...</p>
        </div>
      </main>
    )
  }

  if (!job) {
    return (
      <main className="min-h-screen dot-bg">
        <Navbar />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <p className="text-[var(--text-dim)] text-xs">Job not found</p>
        </div>
      </main>
    )
  }

  const statusClass: Record<string, string> = {
    open: 'badge status-open',
    assigned: 'badge status-assigned',
    completed: 'badge status-completed',
    cancelled: 'badge status-cancelled',
  }

  return (
    <main className="min-h-screen dot-bg">
      <Navbar />

      <div className="accent-line">
        <div className="max-w-2xl py-8 px-4 sm:pl-6">
          <p className="text-[9px] tracking-[0.35em] text-[var(--accent-dim)] uppercase mb-2">
            Job #{job.id}
          </p>

          <div className="flex items-start justify-between mb-6">
            <h1 className="text-xl font-light tracking-wide">{job.title}</h1>
            <span className={statusClass[job.status] || 'badge'}>
              {job.status}
            </span>
          </div>

          <div className="card mb-4">
            <p className="text-[var(--text-dim)] text-xs leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card">
              <p className="text-[9px] tracking-[0.3em] text-[var(--text-label)] uppercase mb-1">
                Budget
              </p>
              <p className="text-2xl font-light text-[var(--accent)]">
                {(job.budget_lamports / 1e9).toFixed(2)}
                <span className="text-xs text-[var(--text-label)] ml-1">SOL</span>
              </p>
            </div>
            <div className="card">
              <p className="text-[9px] tracking-[0.3em] text-[var(--text-label)] uppercase mb-1">
                Posted By
              </p>
              <p className="text-sm text-[var(--text)]">
                {job.poster_name || 'Anonymous'}
              </p>
            </div>
          </div>

          {/* Escrow status */}
          {job.darkdrop_claim_code ? (
            <div className="card mb-6 border-[var(--accent-dim)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)] animate-pulse-glow" />
                <span className="text-[10px] tracking-[0.2em] text-[var(--accent)] uppercase font-semibold">
                  Funds Locked in Escrow
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-label)] mb-2 tracking-wide">
                Claim code (proves funds exist):
              </p>
              <code className="block text-[11px] text-[var(--accent)] break-all p-3 bg-[rgba(51,255,102,0.03)] border border-[var(--border)]">
                {job.darkdrop_claim_code}
              </code>
              <div className="mt-4 pt-3 border-t border-[var(--border)]">
                <Link
                  href={`/verify?job_id=${job.id}`}
                  className="btn-secondary inline-block"
                >
                  Verify on Chain
                </Link>
              </div>
            </div>
          ) : (
            <div className="card mb-6 border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[10px] tracking-[0.2em] text-red-400 uppercase font-semibold">
                  No Collateral Deposited
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-dim)]">
                The job poster has not deposited funds yet. Do not start work until collateral is verified.
              </p>
            </div>
          )}

          {/* Release flow */}
          {job.status === 'assigned' && !showPassword && (
            <button
              onClick={handleRelease}
              disabled={releasing || !connected}
              className="btn-primary w-full disabled:opacity-30"
            >
              {releasing ? 'Releasing...' : 'Approve Work & Release Payment'}
            </button>
          )}

          {showPassword && releaseData && (
            <div className="card border-[var(--accent-dim)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <span className="text-[10px] tracking-[0.2em] text-[var(--accent)] uppercase font-semibold">
                  Payment Released
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-dim)] mb-3 tracking-wide">
                Share this password with the freelancer so they can claim:
              </p>
              <code className="block text-xs text-[var(--accent)] break-all p-3 bg-[rgba(51,255,102,0.03)] border border-[var(--border)]">
                {releaseData.password}
              </code>
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <p className="text-[10px] text-[var(--text-label)] tracking-wide">
                  Payout: {(releaseData.amount_lamports / 1e9).toFixed(2)} SOL
                  <span className="mx-2">|</span>
                  Fee: {(releaseData.platform_fee_lamports / 1e9).toFixed(4)} SOL
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
