import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function Home() {
  return (
    <main className="min-h-screen dot-bg">
      <Navbar />

      <div className="accent-line">
        {/* Hero */}
        <section className="py-20 px-4 sm:pl-6">
          <div className="max-w-4xl">
            <p className="text-[9px] tracking-[0.35em] text-[var(--accent-dim)] uppercase mb-6">
              Freelance Marketplace on Solana
            </p>
            <h1 className="text-[clamp(28px,5vw,64px)] font-light leading-tight mb-6">
              Get paid in SOL.<br />
              <span className="text-[var(--accent)]">No wallet needed to start.</span>
            </h1>
            <p className="text-[var(--text-dim)] text-sm max-w-xl mb-10 leading-relaxed">
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
        <section className="py-16 px-4 sm:pl-6">
          <div className="max-w-4xl">
            <p className="text-[9px] tracking-[0.35em] text-[var(--accent-dim)] uppercase mb-10">
              How It Works
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                  <span className="text-[9px] tracking-[0.3em] text-[var(--text-label)] uppercase">Step 01</span>
                </div>
                <h3 className="text-[15px] font-semibold tracking-[0.12em] text-[var(--accent)] mb-2 uppercase">
                  Post a Job
                </h3>
                <p className="text-[var(--text-dim)] text-xs leading-relaxed">
                  Describe the work, set a budget in SOL. Funds get locked in a DarkDrop escrow.
                </p>
              </div>

              {/* Step 2 */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                  <span className="text-[9px] tracking-[0.3em] text-[var(--text-label)] uppercase">Step 02</span>
                </div>
                <h3 className="text-[15px] font-semibold tracking-[0.12em] text-[var(--accent)] mb-2 uppercase">
                  Deliver Work
                </h3>
                <p className="text-[var(--text-dim)] text-xs leading-relaxed">
                  A freelancer picks up the job and completes the work. No wallet address exchange needed.
                </p>
              </div>

              {/* Step 3 */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                  <span className="text-[9px] tracking-[0.3em] text-[var(--text-label)] uppercase">Step 03</span>
                </div>
                <h3 className="text-[15px] font-semibold tracking-[0.12em] text-[var(--accent)] mb-2 uppercase">
                  Get Paid
                </h3>
                <p className="text-[var(--text-dim)] text-xs leading-relaxed">
                  You approve the work, freelancer gets a claim code. They withdraw to any wallet instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-4 sm:pl-6 border-t border-[var(--border)]">
          <div className="max-w-4xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-light text-[var(--accent)] mb-1">2%</div>
                <div className="text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase">
                  Platform fee (vs 20% on Fiverr)
                </div>
              </div>
              <div>
                <div className="text-3xl font-light text-[var(--accent)] mb-1">Instant</div>
                <div className="text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase">
                  Payouts via Solana
                </div>
              </div>
              <div>
                <div className="text-3xl font-light text-[var(--accent)] mb-1">Global</div>
                <div className="text-[10px] tracking-[0.2em] text-[var(--text-label)] uppercase">
                  Work from anywhere
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 px-4 sm:pl-6 border-t border-[var(--border)] bg-[rgba(0,0,0,0.8)]">
          <div className="max-w-4xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-[9px] tracking-[0.2em] text-[var(--text-label)] uppercase">
                Powered by DarkDrop on Solana
              </span>
              <span className="badge">V4 DEVNET</span>
            </div>
            <span className="text-[9px] tracking-[0.15em] text-[var(--text-label)]">
              4 AUDITS
            </span>
          </div>
        </footer>
      </div>
    </main>
  )
}
