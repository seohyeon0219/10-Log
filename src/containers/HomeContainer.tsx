import { useEffect, useState } from 'react'
import MonthlyPromiseBottomSheet from '../components/calendar/MonthlyPromiseBottomSheet'
import MonthlyPromiseModal from '../components/calendar/MonthlyPromiseModal'
import FloatingAddButton from '../components/common/FloatingAddButton'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
import TransactionFormBottomSheet from '../components/transactions/bottomSheet/TransactionFormBottomSheet'
import { useCalendarStore } from '../stores/calendarStore'
import type { TransactionFormValues, TransactionType } from '../types/finance'

const DAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export default function HomeContainer() {
  const [isPromiseEditOpen, setIsPromiseEditOpen] = useState(false)
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const addTransaction = useCalendarStore((state) => state.addTransaction)
  const addCategory = useCalendarStore((state) => state.addCategory)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const monthlyPromise = useCalendarStore((state) => state.monthlyPromise)
  const monthlySummary = useCalendarStore((state) => state.monthlySummary)
  const updateCategory = useCalendarStore((state) => state.updateCategory)
  const updateMonthlyPromise = useCalendarStore((state) => state.updateMonthlyPromise)
  const deleteMonthlyPromise = useCalendarStore((state) => state.deleteMonthlyPromise)

  const openTransactionForm = (type: TransactionType) => {
    setTransactionType(type)
    setIsTransactionFormOpen(true)
  }

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
  const activeCategories = transactionType === 'income' ? incomeCategories : expenseCategories

  const handleSaveTransaction = async (values: TransactionFormValues) => {
    await addTransaction(transactionType, values)
    setIsTransactionFormOpen(false)
  }

  const handleSavePromise = async (values: { budgetAmount: number }) => {
    await updateMonthlyPromise({ ...values, promise: '' })
    setIsPromiseEditOpen(false)
  }

  const handleDeletePromise = async () => {
    await deleteMonthlyPromise()
    setIsPromiseEditOpen(false)
  }

  return (
    <section className="w-full self-start animate-fade-up md:mt-6">
      <div className="mt-4">
        <p className="text-[13px] font-bold tracking-[3px] text-(--color-text-sand)">
          {DAYS_EN[today.getDay()]}
        </p>
        <div className="mt-1 flex items-baseline gap-2.5">
          <span className="text-[58px] font-bold leading-[0.9] tracking-[-2px] text-black">
            {today.getDate()}
          </span>
          <span className="text-[14px] font-semibold text-(--color-text-sand)">
            {today.getFullYear()}
          </span>
        </div>
      </div>

      {/* 카드 */}
      <div className="mt-[max(1.75rem,calc(50dvh-10rem))] rounded-[22px] glass-card p-5 shadow-sm md:mt-10">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-(--color-text-muted)">이번 달 소비 목표</p>
          <button
            className="rounded-lg px-2 py-1 text-xs font-medium text-(--color-text-muted) transition interactive-icon"
            onClick={() => setIsPromiseEditOpen(true)}
            type="button"
          >
            {monthlyPromise.isRegistered ? '수정' : '등록'}
          </button>
        </div>
        <p className="mt-2 text-[26px] font-extrabold leading-none text-black">
          {monthlyPromise.budgetAmount > 0
            ? `${monthlyPromise.budgetAmount.toLocaleString('ko-KR')}원`
            : '—'}
        </p>

        {monthlyPromise.budgetAmount > 0 && (
          <div className="mt-4 border-t border-black/6 pt-4">
            <p className="text-xs font-semibold text-(--color-text-muted)">남은 금액</p>
            <p
              className={[
                'mt-1 text-xl font-extrabold leading-none',
                remaining !== null && remaining < 0
                  ? 'text-(--color-expense-red)'
                  : 'text-black',
              ].join(' ')}
            >
              {remaining !== null
                ? `${remaining < 0 ? '−' : ''}${Math.abs(remaining).toLocaleString('ko-KR')}원`
                : '—'}
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/6">
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
              {spent.toLocaleString('ko-KR')}원 사용 · {spentPercentage}%
            </p>
          </div>
        )}
      </div>

      <FloatingAddButton
        onAddExpense={() => openTransactionForm('expense')}
        onAddIncome={() => openTransactionForm('income')}
      />

      <div className="hidden md:block">
        <TransactionFormModal
          categories={activeCategories}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          isOpen={isTransactionFormOpen}
          onClose={() => setIsTransactionFormOpen(false)}
          onCreateCategory={addCategory}
          onDelete={() => setIsTransactionFormOpen(false)}
          onDeleteCategory={deleteCategory}
          onSave={handleSaveTransaction}
          onUpdateCategory={updateCategory}
          selectedDate={new Date()}
          type={transactionType}
        />
      </div>
      <div className="md:hidden">
        <TransactionFormBottomSheet
          categories={activeCategories}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          isOpen={isTransactionFormOpen}
          onClose={() => setIsTransactionFormOpen(false)}
          onCreateCategory={addCategory}
          onDelete={() => setIsTransactionFormOpen(false)}
          onDeleteCategory={deleteCategory}
          onSave={handleSaveTransaction}
          onUpdateCategory={updateCategory}
          selectedDate={new Date()}
          type={transactionType}
        />
      </div>

      <div className="hidden md:block">
        <MonthlyPromiseModal
          budgetAmount={monthlyPromise.budgetAmount}
          isOpen={isPromiseEditOpen}
          isRegistered={monthlyPromise.isRegistered}
          onClose={() => setIsPromiseEditOpen(false)}
          onDelete={handleDeletePromise}
          onSave={handleSavePromise}
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
        />
      </div>
    </section>
  )
}
