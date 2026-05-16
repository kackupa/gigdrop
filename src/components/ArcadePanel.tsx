'use client'

import { ReactNode } from 'react'

interface ArcadePanelProps {
  children: ReactNode
  title?: string
  step?: string
  className?: string
}

export function ArcadePanel({ children, title, step, className = '' }: ArcadePanelProps) {
  return (
    <div className={`arcade-panel ${className}`}>
      {(title || step) && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
          {step && (
            <span className="text-[9px] tracking-[0.3em] text-[var(--text-label)] uppercase">
              {step}
            </span>
          )}
          {title && (
            <span className="text-[10px] tracking-[0.2em] text-[var(--accent)] uppercase font-semibold ml-auto">
              {title}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
