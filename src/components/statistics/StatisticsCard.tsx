import type { ReactNode } from 'react'

type StatisticsCardProps = {
  action?: ReactNode
  children: ReactNode
  className?: string
  eyebrow?: string
  title?: string
}

export default function StatisticsCard({
  action,
  children,
  className = '',
  eyebrow,
  title,
}: StatisticsCardProps) {
  return (
    <section className={['rounded-[22px] glass-card p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] max-[380px]:p-4', className].join(' ').trim()}>
      {eyebrow || title || action ? (
        <div className="flex items-start justify-between gap-3 max-[380px]:grid max-[380px]:grid-cols-1">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-sm font-semibold text-(--color-dark-gray)">{eyebrow}</p>
            ) : null}
            {title ? <h3 className="mt-1 break-keep text-[15px] font-bold text-black">{title}</h3> : null}
          </div>
          {action ? <div className="shrink-0 max-[380px]:mt-2 max-[380px]:justify-self-start">{action}</div> : null}
        </div>
      ) : null}

      {children}
    </section>
  )
}
