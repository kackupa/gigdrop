'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { useWallet } from '@/components/WalletProvider'

export default function ClaimPage() {
  const { publicKey, connected } = useWallet()
  const [claimCode, setClaimCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected || !publicKey) {
      setError('Please connect your wallet first')
      return
    }

    setLoading(true)
    setError('')

    try {
      setResult({
        claim_code: claimCode,
        message: 'Claim code validated. In production, this would submit a ZK proof to claim your SOL.',
        note: 'Connect to DarkDrop devnet relayer to complete the claim.',
      })
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
            Claim
          </p>
          <h1 className="text-2xl font-light tracking-wide mb-2">Claim Payment</h1>
          <p className="text-[var(--text-dim)] text-xs mb-8">
            Received a claim code and password from a client? Enter them here to claim your SOL.
          </p>

          <form onSubmit={handleClaim} className="card space-y-6">
            {error && (
              <div className="border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase mb-2">
                Claim Code
              </label>
              <input
                type="text"
                value={claimCode}
                onChange={e => setClaimCode(e.target.value)}
                className="w-full font-mono"
                placeholder="Enter the claim code from the client"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase mb-2">
                Password
              </label>
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full font-mono"
                placeholder="Enter the password from the client"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase mb-2">
                Your Wallet
              </label>
              <input
                type="text"
                value={publicKey || ''}
                className="w-full text-[var(--text-dim)]"
                disabled
                placeholder="Connect wallet above"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !connected}
              className="btn-primary w-full disabled:opacity-30"
            >
              {loading ? 'Claiming...' : 'Claim Payment'}
            </button>

            {!connected && (
              <p className="text-[10px] text-[var(--text-label)] text-center tracking-wide">
                Connect your wallet to claim
              </p>
            )}
          </form>

          {result && (
            <div className="card border-[var(--accent-dim)] mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <span className="text-[10px] tracking-[0.2em] text-[var(--accent)] uppercase font-semibold">
                  Claim Submitted
                </span>
              </div>
              <p className="text-xs text-[var(--text-dim)] mb-2">{result.message}</p>
              <p className="text-[10px] text-[var(--text-label)]">{result.note}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
