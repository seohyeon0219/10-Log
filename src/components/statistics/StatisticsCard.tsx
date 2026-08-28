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
    <section className={['rounded-[26px] glass-card pt-5 px-4.5 pb-4.5', className].join(' ').trim()}>
      {eyebrow || title || action ? (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-medium text-(--ink-3)">{eyebrow}</p>
            ) : null}
            {title ? <h3 className="break-keep text-[18px] font-semibold leading-none text-(--ink-1)">{title}</h3> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      {children}
    </section>
  )
}
