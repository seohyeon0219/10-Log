import { useEffect, useMemo, useState } from 'react'
import MonthlyPromiseBottomSheet from '../components/calendar/MonthlyPromiseBottomSheet'
import MonthlyPromiseModal from '../components/calendar/MonthlyPromiseModal'
import Button from '../components/common/Button'
import { getBudgetStatus, getRandomMessage } from '../constants/budgetMessages'
import { useCalendarStore } from '../stores/calendarStore'

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토']

export default function HomeContainer() {
  const [isPromiseEditOpen, setIsPromiseEditOpen] = useState(false)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const monthlyPromise = useCalendarStore((state) => state.monthlyPromise)
  const monthlySummary = useCalendarStore((state) => state.monthlySummary)
  const updateMonthlyPromise = useCalendarStore((state) => state.updateMonthlyPromise)
  const deleteMonthlyPromise = useCalendarStore((state) => state.deleteMonthlyPromise)

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const today = new Date()
  const spent = monthlySummary.expense + monthlySummary.fixedExpense
  const remaining = monthlyPromise.budgetAmount > 0 ? monthlyPromise.budgetAmount - spent : null
  const spentPercentage =
    monthlyPromise.budgetAmount > 0
      ? Math.round((spent / monthlyPromise.budgetAmount) * 100)
      : 0
  const budgetStatus = getBudgetStatus(spent, monthlyPromise.budgetAmount)
  const budgetMessage = useMemo(() => getRandomMessage(budgetStatus), [budgetStatus])

  const yearLabel = `${today.getFullYear()}년`
  const dateLabel = `${today.getMonth() + 1}월 ${today.getDate()}일 ${DAYS_KO[today.getDay()]}요일`

  const handleSavePromise = async (values: { budgetAmount: number; promise: string }) => {
    await updateMonthlyPromise(values)
    setIsPromiseEditOpen(false)
  }

  const handleDeletePromise = async () => {
    await deleteMonthlyPromise()
    setIsPromiseEditOpen(false)
  }

  return (
    <section className="w-full self-start md:mt-6">
      <h2 className="mb-4 hidden text-xl font-bold text-black md:mb-0 md:block">홈</h2>

      <div className="mt-4 md:mt-5">
        {/* 날짜 */}
        <p className="text-sm font-semibold text-gray-400">{yearLabel}</p>
        <p className="mt-0.5 text-3xl font-extrabold text-black">{dateLabel}</p>

        {/* 다짐 */}
        <div className="mt-5 flex items-center gap-3">
          <p className="flex-1 text-base font-bold text-black">
            <span style={{ backgroundImage: 'linear-gradient(transparent 55%, #ffe58f 55%)', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
              {monthlyPromise.promise}
            </span>
          </p>
          <Button
            className="min-h-0! w-auto! shrink-0 px-4! py-2 text-sm!"
            onClick={() => setIsPromiseEditOpen(true)}
            variant="ghost"
          >
            {monthlyPromise.isRegistered ? '수정' : '등록'}
          </Button>
        </div>

        {/* 카드 */}
        <div className="mt-5 rounded-2xl bg-(--color-glass-white) p-5 shadow-sm backdrop-blur-sm">
          {/* 남은 예산 */}
          <p className="text-sm font-semibold text-gray-400">이번 달 남은 예산</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p
              className={[
                'text-4xl font-extrabold',
                remaining !== null && remaining < 0
                  ? 'text-(--color-expense-red)'
                  : 'text-black',
              ].join(' ')}
            >
              {remaining !== null
                ? `${remaining < 0 ? '−' : ''}${Math.abs(remaining).toLocaleString('ko-KR')}원`
                : '—'}
            </p>
            {monthlyPromise.budgetAmount > 0 && (
              <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-500">
                {spentPercentage}% 사용
              </span>
            )}
          </div>

          {monthlyPromise.budgetAmount > 0 && (
            <>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={[
                    'h-full rounded-full transition-all duration-500',
                    remaining !== null && remaining < 0
                      ? 'bg-(--color-expense-red)'
                      : 'bg-(--color-income-blue)',
                  ].join(' ')}
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {spent.toLocaleString('ko-KR')}원 / {monthlyPromise.budgetAmount.toLocaleString('ko-KR')}원 사용했어요
              </p>
            </>
          )}

          <hr className="my-4 border-gray-100" />

          {/* 한 줄 평 */}
          <p className="text-sm font-semibold text-gray-400">이번 달 한 줄 평</p>
          <p className="mt-2 text-base font-bold leading-relaxed text-black">{budgetMessage}</p>
        </div>
      </div>

      <div className="hidden md:block">
        <MonthlyPromiseModal
          budgetAmount={monthlyPromise.budgetAmount}
          isOpen={isPromiseEditOpen}
          isRegistered={monthlyPromise.isRegistered}
          onClose={() => setIsPromiseEditOpen(false)}
          onDelete={handleDeletePromise}
          onSave={handleSavePromise}
          promise={monthlyPromise.promise}
        />
      </div>
      <div className="md:hidden">
        <MonthlyPromiseBottomSheet
          budgetAmount={monthlyPromise.budgetAmount}
          isOpen={isPromiseEditOpen}
          isRegistered={monthlyPromise.isRegistered}
          onClose={() => setIsPromiseEditOpen(false)}
          onDelete={handleDeletePromise}
          onSave={handleSavePromise}
          promise={monthlyPromise.promise}
        />
      </div>
    </section>
  )
}
