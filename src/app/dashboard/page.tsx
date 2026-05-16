'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { ArcadePanel } from '@/components/ArcadePanel'
import { useWallet } from '@/components/WalletProvider'

interface Job {
  id: number
  title: string
  description: string
  budget_lamports: number
  status: string
  poster_name: string
  created_at: string
  darkdrop_claim_code: string | null
}

export default function DashboardPage() {
  const { publicKey, connected } = useWallet()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!connected || !publicKey) {
      setLoading(false)
      return
    }

    fetch(`/api/jobs/user?wallet=${publicKey}`)
      .then(res => res.json())
      .then(data => {
        setJobs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [connected, publicKey])

  const filteredJobs = filter === 'all'
    ? jobs
    : jobs.filter(j => j.status === filter)

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    assigned: jobs.filter(j => j.status === 'assigned').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    totalValue: jobs.reduce((sum, j) => sum + j.budget_lamports, 0),
  }

  if (!connected) {
    return (
      <main className="min-h-screen dot-bg">
        <Navbar />
        <div className="accent-line">
          <div className="max-w-4xl py-20 px-4 sm:pl-6 text-center">
            <p className="text-[9px] tracking-[0.35em] text-[var(--accent-dim)] uppercase mb-4">
              Dashboard
            </p>
            <h1 className="text-2xl font-light mb-4">Connect Your Wallet</h1>
            <p className="text-[var(--text-dim)] text-xs mb-8">
              Connect your Phantom wallet to view your jobs and earnings.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen dot-bg">
      <Navbar />

      <div className="accent-line">
        <div className="max-w-4xl py-8 px-4 sm:pl-6">
          <p className="text-[9px] tracking-[0.35em] text-[var(--accent-dim)] uppercase mb-2">
            Dashboard
          </p>
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-2xl font-light">
              {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
            </h1>
            <span className="badge status-open animate-pulse-glow">Connected</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <ArcadePanel>
              <p className="text-[9px] tracking-[0.3em] text-[var(--text-label)] uppercase mb-1">
                Total Jobs
              </p>
              <p className="text-2xl font-light text-[var(--accent)]">
                {stats.total}
              </p>
            </ArcadePanel>

            <ArcadePanel>
              <p className="text-[9px] tracking-[0.3em] text-[var(--text-label)] uppercase mb-1">
                Open
              </p>
              <p className="text-2xl font-light text-[var(--accent)]">
                {stats.open}
              </p>
            </ArcadePanel>

            <ArcadePanel>
              <p className="text-[9px] tracking-[0.3em] text-[var(--text-label)] uppercase mb-1">
                In Progress
              </p>
              <p className="text-2xl font-light text-[#ffc833]">
                {stats.assigned}
              </p>
            </ArcadePanel>

            <ArcadePanel>
              <p className="text-[9px] tracking-[0.3em] text-[var(--text-label)] uppercase mb-1">
                Total Value
              </p>
              <p className="text-2xl font-light text-[var(--accent)]">
                {(stats.totalValue / 1e9).toFixed(2)}
                <span className="text-xs text-[var(--text-label)] ml-1">SOL</span>
              </p>
            </ArcadePanel>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {['all', 'open', 'assigned', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all ${
                  filter === f
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[rgba(51,255,102,0.06)]'
                    : 'border-[var(--border)] text-[var(--text-label)] hover:border-[var(--accent-dim)]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          {loading ? (
            <p className="text-[var(--text-dim)] text-xs">Loading...</p>
          ) : filteredJobs.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-[var(--text-dim)] text-xs mb-4">
                No jobs found.
              </p>
              <Link href="/post" className="btn-primary">
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredJobs.map(job => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block card"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xs font-semibold tracking-wide">
                          {job.title}
                        </h2>
                        <span className={`badge ${
                          job.status === 'open' ? 'status-open' :
                          job.status === 'assigned' ? 'status-assigned' :
                          job.status === 'completed' ? 'status-completed' :
                          'status-cancelled'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-[var(--text-dim)] text-[10px] line-clamp-1">
                        {job.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-light text-[var(--accent)]">
                        {(job.budget_lamports / 1e9).toFixed(2)}
                        <span className="text-[10px] text-[var(--text-label)] ml-1">SOL</span>
                      </div>
                      <div className="text-[9px] text-[var(--text-label)]">
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
