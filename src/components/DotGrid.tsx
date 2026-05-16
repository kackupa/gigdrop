'use client'

export function DotGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: 'radial-gradient(rgba(51, 255, 102, 0.04) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    />
  )
}
