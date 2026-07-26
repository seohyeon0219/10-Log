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
    <section className="w-full self-start md:mt-6">
      <div className="mt-4 md:mt-5">
        {/* 날짜 */}
        <div className="w-fit">
          <p className="text-[20px] font-bold tracking-[3px] text-(--color-text-muted)">
            {DAYS_EN[today.getDay()]}
          </p>
          <p className="mt-1.5 text-[64px] font-extrabold leading-[0.9] tracking-[-2px] text-black">
            {today.getDate()}
          </p>
          <div className="-mt-5.5">
            <div className="my-2.5 h-px w-20 bg-white/90" />
            <p className="text-base font-bold text-right text-(--color-text-muted)">
              {today.getFullYear()}
            </p>
          </div>
        </div>

        {/* 한 줄 평 */}
        <p className="mt-6 break-keep text-base font-bold leading-relaxed text-(--color-text-dim)">
          {budgetMessage}
        </p>

        {/* 카드 */}
        <div className="mt-24 rounded-[22px] bg-(--color-glass-white) p-5 shadow-sm backdrop-blur-sm">
          {/* 다짐 */}
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 flex-1 break-keep text-lg font-extrabold text-black">
              <span
                style={{
                  backgroundImage: 'linear-gradient(transparent 55%, #ffe58f 55%)',
                  boxDecorationBreak: 'clone',
                  WebkitBoxDecorationBreak: 'clone',
                }}
              >
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
                  className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold"
                  style={{ background: 'rgba(24,99,220,0.12)', color: '#1863dc' }}
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
