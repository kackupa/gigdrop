// Phantom wallet integration

export interface PhantomProvider {
  isPhantom: boolean
  publicKey: { toString(): string } | null
  connect(): Promise<{ publicKey: { toString(): string } }>
  disconnect(): Promise<void>
  signTransaction(transaction: any): Promise<any>
  signAllTransactions(transactions: any[]): Promise<any[]>
  on(event: string, callback: (...args: any[]) => void): void
}

declare global {
  interface Window {
    phantom?: { solana?: PhantomProvider }
  }
}

export function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === 'undefined') return null
  return window.phantom?.solana || null
}

export function isPhantomInstalled(): boolean {
  return !!getPhantomProvider()
}

export async function connectWallet(): Promise<string> {
  const provider = getPhantomProvider()
  if (!provider) {
    throw new Error('Phantom wallet not installed. Get it at https://phantom.app')
  }
  const response = await provider.connect()
  return response.publicKey.toString()
}

export async function disconnectWallet(): Promise<void> {
  const provider = getPhantomProvider()
  if (provider) {
    await provider.disconnect()
  }
}

export function onWalletChange(callback: (publicKey: string | null) => void): () => void {
  const provider = getPhantomProvider()
  if (!provider) return () => {}

  const handler = () => {
    callback(provider.publicKey?.toString() || null)
  }

  provider.on('accountChanged', handler)
  return () => {
    // Phantom doesn't have a removeListener, so we just no-op
  }
}
