import StatisticsCard from './StatisticsCard'
import { formatAmount } from '../../utils/formatters'
import type { WeekSpending } from '../../utils/statisticsCalculators'

type Props = {
  data: WeekSpending[]
}

export default function SpendingByWeekCard({ data }: Props) {
  const max = Math.max(...data.map((d) => d.amount), 1)
  const peakItem = data.find((d) => d.isMax)

  return (
    <StatisticsCard title="주차별 지출">
      {peakItem && peakItem.amount > 0 ? (
        <p className="mt-1 text-[12px] font-semibold text-gray-400">
          <span className="text-(--color-expense-red)">{peakItem.label}</span>에 지출이 가장 많았어요
        </p>
      ) : (
        <p className="mt-1 text-[12px] font-semibold text-gray-400">이번 달 지출 내역이 없어요</p>
      )}

      <div className="mt-4 grid gap-2.5">
        {data.map((item) => {
          const widthPct = max > 0 ? Math.max((item.amount / max) * 100, item.amount > 0 ? 2 : 0) : 0
          return (
            <div className="flex items-center gap-3" key={item.label}>
              <span
                className={[
                  'w-9 shrink-0 text-[12px] font-bold',
                  item.isMax ? 'text-(--color-expense-red)' : 'text-gray-400',
                ].join(' ')}
              >
                {item.label}
              </span>
              <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className={[
                    'absolute inset-y-0 left-0 rounded-full transition-all duration-500',
                    item.isMax ? 'bg-(--color-expense-red)/70' : 'bg-black/[0.12]',
                  ].join(' ')}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span
                className={[
                  'w-20 shrink-0 text-right text-[12px] font-bold',
                  item.isMax ? 'text-(--color-expense-red)' : 'text-gray-500',
                ].join(' ')}
              >
                {item.amount > 0 ? `${formatAmount(item.amount)}원` : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </StatisticsCard>
  )
}
