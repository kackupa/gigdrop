import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Get paid in SOL.<br />
            <span className="text-purple-300">No wallet needed to start.</span>
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Post jobs, hire freelancers, pay with zero-knowledge proofs on Solana.
            Funds are escrowed by smart contract, not a middleman.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/jobs" className="btn-primary text-lg px-8 py-3">
              Browse Jobs
            </Link>
            <Link href="/post" className="btn-secondary text-lg px-8 py-3 bg-white/10 hover:bg-white/20 text-white">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
              <p className="text-gray-600">Describe the work, set a budget in SOL. Funds get locked in a DarkDrop escrow.</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Freelancer Delivers</h3>
              <p className="text-gray-600">A freelancer picks up the job and completes the work. No wallet address exchange needed.</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Paid</h3>
              <p className="text-gray-600">You approve the work, freelancer gets a claim code. They withdraw to any wallet instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600">2%</div>
              <div className="text-gray-600 mt-2">Platform fee (vs 20% on Fiverr)</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">Instant</div>
              <div className="text-gray-600 mt-2">Payouts via Solana</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">Global</div>
              <div className="text-gray-600 mt-2">Work from anywhere</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-500 text-sm">
        <p>GigDrop powered by DarkDrop on Solana Devnet</p>
      </footer>
    </main>
  )
}
