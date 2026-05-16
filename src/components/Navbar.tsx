'use client'

import Link from 'next/link'
import { ConnectButton } from './ConnectButton'

export function Navbar() {
  return (
    <nav className="bg-white border-b px-4 py-3">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-purple-600">
          GigDrop
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
            Browse Jobs
          </Link>
          <Link href="/post" className="text-gray-600 hover:text-gray-900">
            Post a Job
          </Link>
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}
