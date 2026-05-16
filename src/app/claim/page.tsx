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
      // In production, this would call DarkDrop's claim endpoint
      // For now, we show the freelancer what they'd receive
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
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Claim Payment</h1>

        <div className="card">
          <p className="text-gray-600 mb-6">
            Received a claim code and password from a client? Enter them here to claim your SOL payment.
          </p>

          <form onSubmit={handleClaim} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Claim Code</label>
              <input
                type="text"
                value={claimCode}
                onChange={e => setClaimCode(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
                placeholder="Enter the claim code from the client"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
                placeholder="Enter the password from the client"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Wallet</label>
              <input
                type="text"
                value={publicKey || ''}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-600"
                disabled
                placeholder="Connect wallet above"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !connected}
              className="btn-primary w-full py-3 text-lg disabled:opacity-50"
            >
              {loading ? 'Claiming...' : 'Claim Payment'}
            </button>
          </form>

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Claim Submitted</h3>
              <p className="text-sm text-green-700">{result.message}</p>
              <p className="text-xs text-green-600 mt-2">{result.note}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
