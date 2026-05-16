import type { Metadata } from 'next'
import { WalletProvider } from '@/components/WalletProvider'
import { DotGrid } from '@/components/DotGrid'
import { Scanlines } from '@/components/Scanlines'
import './globals.css'

export const metadata: Metadata = {
  title: 'GigDrop — Zero-Knowledge Freelance Payments',
  description: 'Freelance marketplace powered by DarkDrop on Solana. Get paid in SOL with zero-knowledge proofs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <DotGrid />
          <Scanlines />
          <div className="relative z-10">
            {children}
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}
