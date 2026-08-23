import StatisticsCard from './StatisticsCard'
import { formatAmount } from '../../utils/formatters'
import type { DayOfWeekSpending } from '../../utils/statisticsCalculators'

type Props = {
  data: DayOfWeekSpending[]
}

export default function SpendingByDayOfWeekCard({ data }: Props) {
  const max = Math.max(...data.map((d) => d.amount), 1)
  const peakItem = data.find((d) => d.isMax)

  return (
    <StatisticsCard title="요일별 지출 패턴">
      {peakItem && peakItem.amount > 0 ? (
        <p className="mt-1 text-[12px] font-semibold text-gray-400">
          <span className="text-(--color-expense-red)">{peakItem.label}요일</span>에 가장 많이 지출했어요
        </p>
      ) : (
        <p className="mt-1 text-[12px] font-semibold text-gray-400">이번 달 지출 내역이 없어요</p>
      )}

      <div className="mt-4 flex items-end justify-between gap-1.5">
        {data.map((item) => {
          const heightPct = max > 0 ? Math.max((item.amount / max) * 100, item.amount > 0 ? 4 : 0) : 0
          return (
            <div className="flex flex-1 flex-col items-center gap-1.5" key={item.label}>
              <div className="flex h-24 w-full items-end">
                <div
                  className={[
                    'w-full rounded-t-[6px] transition-all duration-500',
                    item.isMax
                      ? 'bg-(--color-expense-red)/70'
                      : 'bg-black/[0.08]',
                  ].join(' ')}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span
                className={[
                  'text-xs font-bold',
                  item.isMax ? 'text-(--color-expense-red)' : 'text-gray-400',
                ].join(' ')}
              >
                {item.label}
              </span>
            </div>
          )
        })}
      </div>

      {peakItem && peakItem.amount > 0 && (
        <p className="mt-3 text-right text-xs font-semibold text-gray-400">
          {peakItem.label}요일 합계 {formatAmount(peakItem.amount)}원
        </p>
      )}
    </StatisticsCard>
  )
}
