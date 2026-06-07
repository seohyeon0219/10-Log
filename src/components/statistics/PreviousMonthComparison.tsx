import { useState } from 'react'
import StatisticsCard from './StatisticsCard'

type PreviousMonthComparisonItem = {
  details?: Array<{
    isEmphasized?: boolean
    label: string
    value: number
  }>
  id: string
  label: string
  rate: number
}

type PreviousMonthComparisonProps = {
  items: PreviousMonthComparisonItem[]
}

const getRateText = (rate: number) => {
  if (rate > 0) {
    return `▲ ${rate}%`
  }

  if (rate < 0) {
    return `▼ ${Math.abs(rate)}%`
  }

  return '0%'
}

const getRateClassName = (rate: number) => {
  if (rate > 0) {
    return 'text-(--color-income-blue)'
  }

  if (rate < 0) {
    return 'text-(--color-expense-red)'
  }

  return 'text-(--color-dark-gray)'
}

const getDetailValueClassName = (label: string) => {
  if (label.includes('지출')) {
    return 'text-(--color-expense-red)'
  }

  if (label.includes('수입') || label.includes('잔액')) {
    return 'text-(--color-income-blue)'
  }

  return 'text-gray-600'
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

export default function PreviousMonthComparison({ items }: PreviousMonthComparisonProps) {
  const [expandedItemId, setExpandedItemId] = useState('')
  const expandedItem = items.find((item) => item.id === expandedItemId)

  return (
    <StatisticsCard className="h-full" eyebrow="전월 비교 분석" title="지난달보다 이렇게 달라졌어요">
      <dl className="mt-5 grid grid-cols-3 gap-3 max-sm:grid-cols-1 max-[380px]:gap-2">
        {items.map((item) => (
          <div className="relative min-w-0 rounded-xl bg-gray-50 p-4 pr-12 max-[380px]:p-3 max-[380px]:pr-11" key={item.id}>
            <dt className="mb-1 text-xs font-semibold text-gray-400">{item.label}</dt>
            <dd className={['block truncate text-base font-bold', getRateClassName(item.rate)].join(' ')}>
              {getRateText(item.rate)}
            </dd>
            <button
              aria-expanded={expandedItemId === item.id}
              aria-label={`${item.label} 상세 보기`}
              className="absolute right-3 bottom-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 active:bg-gray-100"
              onClick={() => setExpandedItemId((currentId) => (currentId === item.id ? '' : item.id))}
              type="button"
            >
              <svg
                aria-hidden="true"
                className={expandedItemId === item.id ? 'rotate-180 transition-transform' : 'transition-transform'}
                fill="none"
                height="7"
                viewBox="0 0 12 7"
                width="12"
              >
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        ))}
      </dl>

      {expandedItem?.details ? (
        <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 max-[380px]:p-3">
          <p className="text-sm font-extrabold text-black">{expandedItem.label} 상세</p>
          <div className="mt-3 grid gap-2">
            {expandedItem.details.map((detail) => (
              <div className={['flex items-center justify-between gap-4 text-sm', detail.isEmphasized ? 'pt-2' : ''].join(' ')} key={detail.label}>
                <span className={detail.isEmphasized ? 'font-bold text-black' : 'font-medium text-gray-400'}>
                  {detail.label}
                </span>
                <strong
                  className={[
                    'text-right',
                    detail.isEmphasized ? 'font-extrabold' : 'font-bold',
                    getDetailValueClassName(detail.label),
                  ].join(' ')}
                >
                  {formatAmount(detail.value)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </StatisticsCard>
  )
}
