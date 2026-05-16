'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { useWallet } from '@/components/WalletProvider'

export default function PostJobPage() {
  const router = useRouter()
  const { publicKey, connected } = useWallet()
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget_sol: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected || !publicKey) {
      setError('Please connect your wallet first')
      return
    }

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
          wallet_address: publicKey,
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
    <main className="min-h-screen dot-bg">
      <Navbar />

      <div className="accent-line">
        <div className="max-w-2xl py-8 px-4 sm:pl-6">
          <p className="text-[9px] tracking-[0.35em] text-[var(--accent-dim)] uppercase mb-2">
            Create
          </p>
          <h1 className="text-2xl font-light tracking-wide mb-8">Post a Job</h1>

          <form onSubmit={handleSubmit} className="card space-y-6">
            {error && (
              <div className="border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full"
                placeholder="e.g. Build a landing page"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full h-32"
                placeholder="Describe what you need done, requirements, deliverables..."
                required
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase mb-2">
                Budget (SOL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.budget_sol}
                onChange={e => setForm({ ...form, budget_sol: e.target.value })}
                className="w-full"
                placeholder="e.g. 5.00"
                required
              />
              <p className="text-[10px] text-[var(--text-label)] mt-2 tracking-wide">
                2% platform fee applies. Freelancer receives 98%.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !connected}
              className="btn-primary w-full disabled:opacity-30"
            >
              {loading ? 'Creating...' : 'Post Job'}
            </button>

            {!connected && (
              <p className="text-[10px] text-[var(--text-label)] text-center tracking-wide">
                Connect your wallet to post a job
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}
