import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { ArcadePanel } from '@/components/ArcadePanel'

export default function Home() {
  return (
    <main className="min-h-screen dot-bg">
      <Navbar />

      <div className="accent-line">
        {/* Hero */}
        <section className="py-24 px-4 sm:pl-6">
          <div className="max-w-4xl">
            <p className="text-[9px] tracking-[0.35em] text-[var(--accent-dim)] uppercase mb-6 animate-pulse-glow">
              Freelance Marketplace on Solana
            </p>
            <h1 className="text-[clamp(32px,6vw,72px)] font-light leading-[1.1] mb-6">
              Get paid in SOL.<br />
              <span className="text-[var(--accent)] glow-text">No wallet needed to start.</span>
            </h1>
            <p className="text-[var(--text-dim)] text-[13px] max-w-xl mb-12 leading-relaxed">
              Post jobs, hire freelancers, pay with zero-knowledge proofs on Solana.
              Funds are escrowed by smart contract, not a middleman.
            </p>
            <div className="flex gap-4">
              <Link href="/jobs" className="btn-primary">
                Browse Jobs
              </Link>
              <Link href="/post" className="btn-secondary">
                Post a Job
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 sm:pl-6 border-t border-[var(--border)]">
          <div className="max-w-4xl">
            <p className="text-[9px] tracking-[0.35em] text-[var(--accent-dim)] uppercase mb-12">
              How It Works
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <ArcadePanel step="Step 01" title="Post a Job">
                <p className="text-[var(--text-dim)] text-[11px] leading-relaxed">
                  Describe the work, set a budget in SOL. Funds get locked in a DarkDrop escrow.
                </p>
              </ArcadePanel>

              <ArcadePanel step="Step 02" title="Deliver Work">
                <p className="text-[var(--text-dim)] text-[11px] leading-relaxed">
                  A freelancer picks up the job and completes the work. No wallet address exchange needed.
                </p>
              </ArcadePanel>

              <ArcadePanel step="Step 03" title="Get Paid">
                <p className="text-[var(--text-dim)] text-[11px] leading-relaxed">
                  You approve the work, freelancer gets a claim code. They withdraw to any wallet instantly.
                </p>
              </ArcadePanel>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-4 sm:pl-6 border-t border-[var(--border)]">
          <div className="max-w-4xl">
            <p className="text-[9px] tracking-[0.35em] text-[var(--accent-dim)] uppercase mb-12">
              Why GigDrop
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-light text-[var(--accent)] glow-text mb-2">2%</div>
                <div className="text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase">
                  Platform fee (vs 20% on Fiverr)
                </div>
              </div>
              <div>
                <div className="text-4xl font-light text-[var(--accent)] glow-text mb-2">Instant</div>
                <div className="text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase">
                  Payouts via Solana
                </div>
              </div>
              <div>
                <div className="text-4xl font-light text-[var(--accent)] glow-text mb-2">Global</div>
                <div className="text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase">
                  Work from anywhere
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 px-4 sm:pl-6 border-t border-[var(--border)] bg-[rgba(0,0,0,0.8)]">
          <div className="max-w-4xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-[9px] tracking-[0.2em] text-[var(--text-label)] uppercase">
                Powered by DarkDrop on Solana
              </span>
              <span className="badge">V4 DEVNET</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[9px] tracking-[0.15em] text-[var(--text-label)]">
                4 AUDITS
              </span>
              <span className="text-[8px] tracking-[0.1em] text-[var(--text-label)] opacity-50">
                GSig1QYV...AgkU
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
