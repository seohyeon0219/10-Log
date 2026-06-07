import StatisticsCard from './StatisticsCard'

type PreviousMonthComparisonItem = {
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

export default function PreviousMonthComparison({ items }: PreviousMonthComparisonProps) {
  return (
    <StatisticsCard eyebrow="전월 비교 분석" title="지난달보다 이렇게 달라졌어요">
      <dl className="mt-5 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
        {items.map((item) => (
          <div className="rounded-xl bg-gray-50 p-4" key={item.id}>
            <dt className="text-sm font-bold text-(--color-dark-gray)">{item.label}</dt>
            <dd className={['mt-2 text-2xl font-extrabold', getRateClassName(item.rate)].join(' ')}>
              {getRateText(item.rate)}
            </dd>
          </div>
        ))}
      </dl>
    </StatisticsCard>
  )
}
