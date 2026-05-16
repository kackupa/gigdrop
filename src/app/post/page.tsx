'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PostJobPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget_sol: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // In production, this would come from wallet connection
  const DEMO_WALLET = 'DemoWallet111111111111111111111111111111111111'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const budgetLamports = Math.floor(parseFloat(form.budget_sol) * 1e9)

      if (isNaN(budgetLamports) || budgetLamports <= 0) {
        throw new Error('Invalid budget amount')
      }

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: DEMO_WALLET,
          title: form.title,
          description: form.description,
          budget_lamports: budgetLamports,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create job')
      }

      const job = await res.json()
      router.push(`/jobs/${job.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-purple-600">GigDrop</Link>
          <Link href="/jobs" className="btn-secondary">Browse Jobs</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Post a Job</h1>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g. Build a landing page"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 h-32"
              placeholder="Describe what you need done, requirements, deliverables..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Budget (SOL)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.budget_sol}
              onChange={e => setForm({ ...form, budget_sol: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g. 5.00"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              2% platform fee applies. Freelancer receives 98%.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Post Job'}
          </button>
        </form>
      </div>
    </main>
  )
}
