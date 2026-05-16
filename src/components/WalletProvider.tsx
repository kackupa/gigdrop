'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { connectWallet, disconnectWallet, onWalletChange, isPhantomInstalled } from '@/lib/wallet'

interface WalletContextType {
  publicKey: string | null
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  isInstalled: boolean
}

const WalletContext = createContext<WalletContextType>({
  publicKey: null,
  connected: false,
  connecting: false,
  connect: async () => {},
  disconnect: async () => {},
  isInstalled: false,
})

export function useWallet() {
  return useContext(WalletContext)
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    setIsInstalled(isPhantomInstalled())

    // Check if already connected
    const provider = window.phantom?.solana
    if (provider?.publicKey) {
      setPublicKey(provider.publicKey.toString())
    }

    // Listen for wallet changes
    const cleanup = onWalletChange((key) => {
      setPublicKey(key)
    })

    return cleanup
  }, [])

  const connect = async () => {
    setConnecting(true)
    try {
      const key = await connectWallet()
      setPublicKey(key)
    } catch (err) {
      console.error('Failed to connect wallet:', err)
      alert('Please install Phantom wallet from https://phantom.app')
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    await disconnectWallet()
    setPublicKey(null)
  }

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        connected: !!publicKey,
        connecting,
        connect,
        disconnect,
        isInstalled,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
