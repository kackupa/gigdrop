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
        className="btn-secondary text-sm"
      >
        Install Phantom
      </a>
    )
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
        </span>
        <button onClick={disconnect} className="btn-secondary text-sm">
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className="btn-primary text-sm disabled:opacity-50"
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
