'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { ArcadePanel } from '@/components/ArcadePanel'

interface EscrowStatus {
  job_id: number
  job_title: string
  claim_code: string
  amount_lamports: number
  platform_fee_lamports: number
  status: string
  poster: string
  created_at: string
  funded: boolean
}

export default function VerifyPage() {
  const [jobId, setJobId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EscrowStatus | null>(null)
  const [error, setError] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch(`/api/escrow/verify?job_id=${jobId}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setResult(data)
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
            Verify
          </p>
          <h1 className="text-2xl font-light tracking-wide mb-2">Verify Escrow</h1>
          <p className="text-[var(--text-dim)] text-xs mb-8">
            Check if a job poster has deposited collateral. Verify funds are locked before starting work.
          </p>

          <form onSubmit={handleVerify} className="card mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={jobId}
                onChange={e => setJobId(e.target.value)}
                className="flex-1"
                placeholder="Enter Job ID (e.g. 1, 2, 3...)"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Checking...' : 'Verify'}
              </button>
            </div>
          </form>

          {error && (
            <div className="card border-red-500/30 bg-red-500/5 mb-6">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {result && (
            <ArcadePanel title="Escrow Status">
              {/* Funded Status */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                {result.funded ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] animate-pulse-glow" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--accent)]">
                        Funds Verified
                      </p>
                      <p className="text-[10px] text-[var(--text-dim)]">
                        Collateral is locked in DarkDrop escrow
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,80,80,0.4)]" />
                    <div>
                      <p className="text-sm font-semibold text-red-400">
                        Not Funded
                      </p>
                      <p className="text-[10px] text-[var(--text-dim)]">
                        No collateral has been deposited yet
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Details Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.15em] text-[var(--text-label)] uppercase">
                    Job
                  </span>
                  <span className="text-xs text-[var(--text)]">
                    {result.job_title}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.15em] text-[var(--text-label)] uppercase">
                    Job ID
                  </span>
                  <span className="text-xs text-[var(--text)]">
                    #{result.job_id}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.15em] text-[var(--text-label)] uppercase">
                    Poster
                  </span>
                  <span className="text-xs text-[var(--text)]">
                    {result.poster}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.15em] text-[var(--text-label)] uppercase">
                    Amount Locked
                  </span>
                  <span className="text-sm font-light text-[var(--accent)]">
                    {(result.amount_lamports / 1e9).toFixed(2)} SOL
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.15em] text-[var(--text-label)] uppercase">
                    Platform Fee
                  </span>
                  <span className="text-xs text-[var(--text-dim)]">
                    {(result.platform_fee_lamports / 1e9).toFixed(4)} SOL
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.15em] text-[var(--text-label)] uppercase">
                    Freelancer Receives
                  </span>
                  <span className="text-sm font-light text-[var(--accent)]">
                    {((result.amount_lamports - result.platform_fee_lamports) / 1e9).toFixed(4)} SOL
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.15em] text-[var(--text-label)] uppercase">
                    Escrow Status
                  </span>
                  <span className={`badge ${
                    result.status === 'locked' ? 'status-assigned' :
                    result.status === 'released' ? 'status-completed' :
                    'status-cancelled'
                  }`}>
                    {result.status}
                  </span>
                </div>

                {result.funded && (
                  <div className="pt-4 border-t border-[var(--border)]">
                    <p className="text-[10px] tracking-[0.15em] text-[var(--text-label)] uppercase mb-2">
                      Claim Code (Public)
                    </p>
                    <code className="block text-[11px] text-[var(--accent)] break-all p-3 bg-[rgba(51,255,102,0.02)] border border-[var(--border)]">
                      {result.claim_code}
                    </code>
                  </div>
                )}
              </div>
            </ArcadePanel>
          )}

          {/* Info */}
          <div className="card mt-6">
            <p className="text-[10px] tracking-[0.15em] text-[var(--text-label)] uppercase mb-3">
              How Verification Works
            </p>
            <div className="space-y-2 text-[11px] text-[var(--text-dim)]">
              <p>1. The job poster deposits SOL into a DarkDrop escrow</p>
              <p>2. A claim code is generated and stored on-chain</p>
              <p>3. The claim code proves funds exist without revealing the password</p>
              <p>4. You can verify the claim code before starting work</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
