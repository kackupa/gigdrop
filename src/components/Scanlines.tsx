'use client'

export function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)',
      }}
    />
  )
}
