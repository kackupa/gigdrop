'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-purple-600">GigDrop</Link>
          <Link href="/post" className="btn-primary">Post a Job</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Open Jobs</h1>

        {loading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No open jobs yet. Be the first to post!</p>
            <Link href="/post" className="btn-primary">Post a Job</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                    <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Posted by {job.poster_name || 'Anonymous'}</span>
                      <span>{new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {(job.budget_lamports / 1e9).toFixed(2)} SOL
                    </div>
                    {job.darkdrop_claim_code && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Funded
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
