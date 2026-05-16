'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/jobs?status=open')
      .then(res => res.json())
      .then(data => {
        setJobs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen dot-bg">
      <Navbar />

      <div className="accent-line">
        <div className="max-w-4xl py-8 px-4 sm:pl-6">
          <p className="text-[9px] tracking-[0.35em] text-[var(--accent-dim)] uppercase mb-2">
            Marketplace
          </p>
          <h1 className="text-2xl font-light tracking-wide mb-8">Open Jobs</h1>

          {loading ? (
            <p className="text-[var(--text-dim)] text-xs">Loading...</p>
          ) : jobs.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-[var(--text-dim)] text-xs mb-6">
                No open jobs yet. Be the first to post.
              </p>
              <Link href="/post" className="btn-primary">
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map(job => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block card"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-sm font-semibold tracking-wide mb-2">
                        {job.title}
                      </h2>
                      <p className="text-[var(--text-dim)] text-xs mb-3 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex gap-4 text-[10px] text-[var(--text-label)] tracking-[0.1em]">
                        <span>{job.poster_name || 'Anonymous'}</span>
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-lg font-light text-[var(--accent)]">
                        {(job.budget_lamports / 1e9).toFixed(2)}
                        <span className="text-xs text-[var(--text-label)] ml-1">SOL</span>
                      </div>
                      {job.darkdrop_claim_code ? (
                        <span className="badge status-open mt-2">Funded</span>
                      ) : (
                        <span className="badge status-cancelled mt-2">No Collateral</span>
                      )}
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
