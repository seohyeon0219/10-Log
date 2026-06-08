import { useState } from 'react'
import { REVIEW_LOOKBACK_COPY } from '../../constants/reviewMessages'

type LookbackSpendItem = {
  category: string
  id: string
  memo: string
}

type ReviewLookbackProps = {
  goodSpends: LookbackSpendItem[]
  regretSpends: LookbackSpendItem[]
  weeklyNote: string
}

export default function ReviewLookback({
  goodSpends,
  regretSpends,
  weeklyNote,
}: ReviewLookbackProps) {
  return (
    <section className="rounded-xl border border-stone-200/70 bg-[linear-gradient(135deg,#fafaf9_0%,#fffbeb_52%,#f5f5f4_100%)] p-3 shadow-[0_8px_24px_rgba(120,113,108,0.09)]">
      <div className="rounded-lg border border-white/80 bg-white/70 p-5 max-[380px]:p-4">
        <div className="flex items-start justify-between gap-4 max-[520px]:grid">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-stone-500">{REVIEW_LOOKBACK_COPY.eyebrow}</p>
            <h3 className="mt-1 break-keep text-2xl leading-8 font-black text-stone-950 max-[420px]:text-xl">
              {REVIEW_LOOKBACK_COPY.title}
            </h3>
            <p className="mt-2 break-keep text-sm leading-6 font-bold text-stone-500">
              오늘 남긴 회고가 이번 달 소비 패턴의 단서가 돼요.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700">
            월간 회고 준비 중
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <LookbackListCard
            accentClassName="bg-emerald-400"
            items={goodSpends}
            title={REVIEW_LOOKBACK_COPY.goodSpendTitle}
          />
          <LookbackListCard
            accentClassName="bg-rose-400"
            items={regretSpends}
            title={REVIEW_LOOKBACK_COPY.regretSpendTitle}
          />
        </div>

        <section className="mt-4 rounded-xl border border-amber-100/80 bg-[linear-gradient(160deg,rgba(255,251,235,0.78)_0%,rgba(255,255,255,0.72)_100%)] p-4">
          <p className="text-sm font-medium text-stone-500">{REVIEW_LOOKBACK_COPY.weeklyTitle}</p>
          <p className="mt-3 whitespace-pre-line break-keep text-medium leading-8 font-bold text-stone-950 max-[420px]:text-lg max-[420px]:leading-7">
            {weeklyNote}
          </p>
        </section>
      </div>
    </section>
  )
}

type LookbackListCardProps = {
  accentClassName: string
  items: LookbackSpendItem[]
  title: string
}

function LookbackListCard({ accentClassName, items, title }: LookbackListCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasMoreItems = items.length > 3
  const visibleItems = isExpanded ? items : items.slice(0, 3)

  return (
    <section className="rounded-xl border border-stone-200/80 bg-white/82 p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="min-w-0 text-base font-black text-stone-950">{title}</h4>
        {hasMoreItems ? (
          <button
            aria-expanded={isExpanded}
            className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-50 hover:text-stone-600 active:bg-stone-100"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            type="button"
          >
            <span className="sr-only">{isExpanded ? '목록 접기' : '목록 더 보기'}</span>
            <LookbackExpandIcon isExpanded={isExpanded} />
          </button>
        ) : null}
      </div>

      <ol
        className={[
          'mt-4 grid gap-3 pr-1',
          isExpanded ? 'max-h-44 overflow-y-auto overscroll-contain' : '',
        ].join(' ').trim()}
      >
        {visibleItems.map((item, index) => (
          <LookbackListItem
            accentClassName={accentClassName}
            index={index}
            item={item}
            key={item.id}
          />
        ))}
      </ol>

      {hasMoreItems && !isExpanded ? (
        <p className="mt-3 text-xs font-bold text-stone-400">최근 3개만 먼저 보여드려요.</p>
      ) : null}
    </section>
  )
}

type LookbackListItemProps = {
  accentClassName: string
  index: number
  item: LookbackSpendItem
}

function LookbackListItem({ accentClassName, index, item }: LookbackListItemProps) {
  return (
    <li className="flex min-w-0 items-start gap-3">
      <span
        className={[
          'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black text-white',
          accentClassName,
        ].join(' ')}
      >
        {index + 1}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-stone-950">{item.category}</p>
        <p className="mt-0.5 break-keep text-sm leading-6 font-semibold text-stone-500">{item.memo}</p>
      </div>
    </li>
  )
}

type LookbackExpandIconProps = {
  isExpanded: boolean
}

function LookbackExpandIcon({ isExpanded }: LookbackExpandIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={isExpanded ? 'rotate-180 transition-transform' : 'transition-transform'}
      fill="none"
      height="7"
      viewBox="0 0 12 7"
      width="12"
    >
      <path
        d="M1 1L6 6L11 1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}
