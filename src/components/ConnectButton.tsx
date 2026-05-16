'use client'

import { useWallet } from './WalletProvider'

export function ConnectButton() {
  const { publicKey, connected, connecting, connect, disconnect, isInstalled } = useWallet()

  if (!isInstalled) {
    return (
      <a
        href="https://phantom.app"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary"
      >
        Install Phantom
      </a>
    )
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[10px] tracking-[0.15em] text-[var(--accent)]">
          {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
        </span>
        <button onClick={disconnect} className="btn-secondary">
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className="btn-primary"
    >
      {connecting ? 'Connecting...' : 'Connect'}
    </button>
  )
}
