import type { ReactNode } from 'react'

type MenuGroupProps = {
  children: ReactNode
  title: string
}

export function MenuGroupDivider() {
  return <div className="mx-5 h-px bg-gray-100" />
}

export default function MenuGroup({ children, title }: MenuGroupProps) {
  return (
    <div className="mb-4">
      <p className="mb-1 px-1 text-xs font-medium text-gray-400">{title}</p>
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-(--color-glass-white) backdrop-blur-sm">
        {children}
      </div>
    </div>
  )
}
