import { useEffect, useMemo, useState } from 'react'
import MonthlyPromiseBottomSheet from '../components/calendar/MonthlyPromiseBottomSheet'
import MonthlyPromiseModal from '../components/calendar/MonthlyPromiseModal'
import Button from '../components/common/Button'
import { getBudgetStatus, getRandomMessage } from '../constants/budgetMessages'
import { useCalendarStore } from '../stores/calendarStore'

const DAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

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

  const handleSavePromise = async (values: { budgetAmount: number; promise: string }) => {
    await updateMonthlyPromise(values)
    setIsPromiseEditOpen(false)
  }

  const handleDeletePromise = async () => {
    await deleteMonthlyPromise()
    setIsPromiseEditOpen(false)
  }

  return (
    <section className="w-full self-start animate-fade-up md:mt-6">
      <div className="mt-4 flex flex-col gap-7 md:mt-5">
        {/* 날짜 블록 */}
        <div>
          <p className="text-[13px] font-bold tracking-[3px] text-[#a89a72]">
            {DAYS_EN[today.getDay()]}
          </p>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className="text-[58px] font-bold leading-[0.9] tracking-[-2px] text-[#161512]">
              {today.getDate()}
            </span>
            <span className="text-[14px] font-semibold text-[#a89a72]">
              {today.getFullYear()}
            </span>
          </div>
        </div>

        {/* 한 줄 평 */}
        <div className="border-l-2 border-l-[rgba(166,138,58,0.35)] pl-3.5">
          <p className="break-keep text-[15.5px] font-semibold leading-[1.55] text-[#4a4640]">
            {budgetMessage}
          </p>
        </div>

        {/* 카드 */}
        <div className="rounded-[22px] bg-(--color-glass-white) p-5 shadow-sm backdrop-blur-sm">
          {/* 다짐 */}
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 flex-1 break-keep text-lg font-extrabold text-black">
              <span className="box-decoration-clone bg-[linear-gradient(transparent_55%,#ffe58f_55%)]">
                {monthlyPromise.promise}
              </span>
            </p>
            <Button
              className="min-h-0! w-auto! shrink-0 px-3! py-1.5 text-sm!"
              onClick={() => setIsPromiseEditOpen(true)}
              variant="ghost"
            >
              {monthlyPromise.isRegistered ? '수정' : '등록'}
            </Button>
          </div>

          {/* 남은 예산 */}
          <div className="mt-5">
            <p className="text-xs font-bold text-(--color-text-muted)">
              이번 달 남은 예산
            </p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <p
                className={[
                  'text-[28px] font-extrabold leading-none',
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
                <span
                  className="shrink-0 rounded-full bg-[rgba(24,99,220,0.12)] px-3 py-1.5 text-sm font-semibold text-[#1863dc]"
                >
                  {spentPercentage}% 사용
                </span>
              )}
            </div>

            {monthlyPromise.budgetAmount > 0 && (
              <>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/6">
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
                <p className="mt-2 text-xs font-semibold text-(--color-text-muted)">
                  {spent.toLocaleString('ko-KR')}원 / {monthlyPromise.budgetAmount.toLocaleString('ko-KR')}원 사용했어요
                </p>
              </>
            )}
          </div>
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
