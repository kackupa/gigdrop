import type { Metadata } from 'next'
import { WalletProvider } from '@/components/WalletProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'GigDrop - Get paid in SOL for freelance work',
  description: 'Freelance marketplace powered by DarkDrop zero-knowledge payments on Solana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}
