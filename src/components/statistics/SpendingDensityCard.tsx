import StatisticsCard from './StatisticsCard'
import { formatMonthDay, formatWon } from '../../utils/formatters'
import type { SpendingDensity } from '../../utils/statisticsCalculators'

type Props = {
  data: SpendingDensity
}

export default function SpendingDensityCard({ data }: Props) {
  const { dailyAvg, peakDay, refDay, spendingDays } = data
  const nonSpendingDays = refDay - spendingDays

  return (
    <StatisticsCard title="지출 밀도">
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-[14px] bg-black/[0.04] px-3 py-3">
          <p className="text-xs font-semibold text-gray-400">하루 평균 지출</p>
          <p className="mt-1 text-[15px] font-extrabold text-(--color-expense-red)">
            {dailyAvg > 0 ? `-${formatWon(dailyAvg)}` : '—'}
          </p>
          <p className="mt-0.5 text-xs font-medium text-gray-400">1~{refDay}일 기준</p>
        </div>

        <div className="rounded-[14px] bg-black/[0.04] px-3 py-3">
          <p className="text-xs font-semibold text-gray-400">지출한 날</p>
          <p className="mt-1 text-[15px] font-extrabold text-black">
            {spendingDays > 0 ? `${spendingDays}일` : '—'}
          </p>
          <p className="mt-0.5 text-xs font-medium text-gray-400">
            {nonSpendingDays > 0 ? `지출 없는 날 ${nonSpendingDays}일` : '매일 지출'}
          </p>
        </div>
      </div>

      {peakDay && (
        <div className="mt-2 flex items-center justify-between rounded-[14px] bg-black/[0.04] px-3 py-3">
          <div>
            <p className="text-xs font-semibold text-gray-400">가장 많이 쓴 날</p>
            <p className="mt-1 text-[13px] font-bold text-black">{formatMonthDay(peakDay.date)}</p>
          </div>
          <p className="text-[15px] font-extrabold text-(--color-expense-red)">
            -{formatWon(peakDay.amount)}
          </p>
        </div>
      )}
    </StatisticsCard>
  )
}
