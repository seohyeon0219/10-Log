import type { ReactNode } from 'react'

type InfoChipProps = {
  children: ReactNode
  className?: string
  dotColor?: string
}

export default function InfoChip({ children, className = '', dotColor = 'currentColor' }: InfoChipProps) {
  return (
    <div
      className={[
        'inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm',
        className,
      ].join(' ').trim()}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dotColor }} />
      {children}
    </div>
  )
}
