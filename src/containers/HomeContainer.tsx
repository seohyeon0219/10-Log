import { useEffect, useMemo } from 'react'
import { getBudgetStatus, getRandomMessage } from '../constants/budgetMessages'
import { useCalendarStore } from '../stores/calendarStore'

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토']

export default function HomeContainer() {
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const monthlyPromise = useCalendarStore((state) => state.monthlyPromise)
  const monthlySummary = useCalendarStore((state) => state.monthlySummary)

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const today = new Date()
  const spent = monthlySummary.expense + monthlySummary.fixedExpense
  const remaining = monthlyPromise.budgetAmount > 0 ? monthlyPromise.budgetAmount - spent : null
  const budgetStatus = getBudgetStatus(spent, monthlyPromise.budgetAmount)
  const budgetMessage = useMemo(() => getRandomMessage(budgetStatus), [budgetStatus])
  const dateLabel = `${today.getMonth() + 1}월 ${today.getDate()}일 ${DAYS_KO[today.getDay()]}요일`

  return (
    <section className="w-full self-start md:mt-6">
      <h2 className="mb-4 hidden text-xl font-bold text-black md:mb-0 md:block">홈</h2>

      <div className="mt-4 grid gap-3 md:mt-5">
        <p className="text-lg font-bold text-black">{dateLabel}</p>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-400">이번 달 남은 예산</p>
          {remaining !== null ? (
            <p
              className={[
                'mt-2 text-3xl font-extrabold',
                remaining < 0 ? 'text-(--color-expense-red)' : 'text-black',
              ].join(' ')}
            >
              {remaining < 0 ? '−' : ''}
              {Math.abs(remaining).toLocaleString('ko-KR')}원
            </p>
          ) : (
            <p className="mt-2 text-3xl font-extrabold text-gray-300">예산 미설정</p>
          )}
          <p className="mt-3 text-sm font-medium text-gray-500">{budgetMessage}</p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-400">이번 달 다짐</p>
          <p className="mt-2 text-base font-bold text-black">{monthlyPromise.promise}</p>
        </div>
      </div>
    </section>
  )
}
