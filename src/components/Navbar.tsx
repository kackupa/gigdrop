'use client'

import Link from 'next/link'
import { ConnectButton } from './ConnectButton'

export function Navbar() {
  return (
    <nav className="border-b border-[var(--border)] px-4 sm:pl-6 py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-sm font-semibold tracking-[0.2em] text-[var(--accent)] uppercase">
          GigDrop
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/jobs" className="text-[11px] tracking-[0.15em] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors uppercase">
            Jobs
          </Link>
          <Link href="/post" className="text-[11px] tracking-[0.15em] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors uppercase">
            Post
          </Link>
          <Link href="/claim" className="text-[11px] tracking-[0.15em] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors uppercase">
            Claim
          </Link>
          <Link href="/verify" className="text-[11px] tracking-[0.15em] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors uppercase">
            Verify
          </Link>
          <Link href="/dashboard" className="text-[11px] tracking-[0.15em] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors uppercase">
            Dashboard
          </Link>
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}
