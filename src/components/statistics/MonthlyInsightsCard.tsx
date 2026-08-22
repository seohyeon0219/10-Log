import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import StatisticsCard from './StatisticsCard'
import { formatMonthDay, formatWon } from '../../utils/formatters'
import type { MonthlyInsightsData, SpendingDensity } from '../../utils/statisticsCalculators'

type Props = {
  data: MonthlyInsightsData
  density?: SpendingDensity
  showDetailLink?: boolean
}

export default function MonthlyInsightsCard({ data, density, showDetailLink = true }: Props) {
  const { threeMonthComparison: cmp, topExpenses } = data
  const isHigher = cmp.rate > 0
  const hasAvg = cmp.avgAmount > 0

  return (
    <StatisticsCard
      action={
        showDetailLink ? (
          <Link className="text-gray-400 hover:text-gray-600" to="/app/stats/insights">
            <ChevronRightIcon aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : null
      }
      title="이번 달 인사이트"
    >
      <div className="mt-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-[13px] font-bold text-black">최근 3개월 평균 대비 지출</p>
            <p className="mt-0.5 text-[11.5px] font-medium text-gray-400">
              1일 ~ {cmp.dayOfMonth}일 기준
            </p>
          </div>
          {hasAvg && (
            <span
              className={[
                'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold',
                isHigher
                  ? 'bg-(--color-expense-red)/10 text-(--color-expense-red)'
                  : 'bg-(--color-income-blue)/10 text-(--color-income-blue)',
              ].join(' ')}
            >
              {isHigher ? '+' : ''}{cmp.rate}%
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[14px] bg-black/4 px-3 py-2.5">
            <p className="text-[11px] font-semibold text-gray-400">이번 달</p>
            <p className="mt-1 text-[15px] font-extrabold text-(--color-expense-red)">
              -{formatWon(cmp.currentAmount)}
            </p>
          </div>
          <div className="rounded-[14px] bg-black/4 px-3 py-2.5">
            <p className="text-[11px] font-semibold text-gray-400">3개월 평균</p>
            <p className="mt-1 text-[15px] font-extrabold text-black">
              {hasAvg ? `-${formatWon(cmp.avgAmount)}` : '—'}
            </p>
          </div>
        </div>
      </div>

      {topExpenses.length > 0 && (
        <>
          <div className="my-4 border-t border-black/6" />

          <div>
            <p className="mb-3 text-[13px] font-bold text-black">최대 단일 지출 top 3</p>
            <div className="grid gap-1.5">
              {topExpenses.map((tx, i) => (
                <div
                  className="flex items-center gap-2.5 rounded-[14px] bg-black/4 px-3 py-2.5"
                  key={tx.id}
                >
                  <span className="w-3.5 shrink-0 text-center text-[11px] font-bold text-gray-300">
                    {i + 1}
                  </span>
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: tx.categoryColor }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-black">
                      {tx.categoryName}
                    </span>
                    <span className="block text-[11px] font-medium text-gray-400">
                      {formatMonthDay(tx.date)}
                      {tx.memo ? ` · ${tx.memo}` : ''}
                    </span>
                  </span>
                  <span className="shrink-0 text-[13px] font-extrabold text-(--color-expense-red)">
                    -{formatWon(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {topExpenses.length === 0 && (
        <p className="mt-4 text-center text-sm font-semibold text-gray-400">
          이번 달 지출 내역이 없어요.
        </p>
      )}

      {density && (
        <>
          <div className="my-4 border-t border-black/6" />

          <p className="mb-3 text-[13px] font-bold text-black">지출 밀도</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[14px] bg-black/4 px-3 py-2.5">
              <p className="text-[11px] font-semibold text-gray-400">하루 평균 지출</p>
              <p className="mt-1 text-[15px] font-extrabold text-(--color-expense-red)">
                {density.dailyAvg > 0 ? `-${formatWon(density.dailyAvg)}` : '—'}
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-gray-400">1~{density.refDay}일 기준</p>
            </div>
            <div className="rounded-[14px] bg-black/4 px-3 py-2.5">
              <p className="text-[11px] font-semibold text-gray-400">지출한 날</p>
              <p className="mt-1 text-[15px] font-extrabold text-black">
                {density.spendingDays > 0 ? `${density.spendingDays}일` : '—'}
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-gray-400">
                {density.refDay - density.spendingDays > 0
                  ? `지출 없는 날 ${density.refDay - density.spendingDays}일`
                  : '매일 지출'}
              </p>
            </div>
          </div>

          {density.peakDay && (
            <div className="mt-2 flex items-center justify-between rounded-[14px] bg-black/4 px-3 py-2.5">
              <div>
                <p className="text-[11px] font-semibold text-gray-400">가장 많이 쓴 날</p>
                <p className="mt-1 text-[13px] font-bold text-black">{formatMonthDay(density.peakDay.date)}</p>
              </div>
              <p className="text-[15px] font-extrabold text-(--color-expense-red)">
                -{formatWon(density.peakDay.amount)}
              </p>
            </div>
          )}
        </>
      )}
    </StatisticsCard>
  )
}
