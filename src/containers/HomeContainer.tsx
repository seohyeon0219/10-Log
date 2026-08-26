import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import ResponsiveMonthlyPromise from '../components/calendar/ResponsiveMonthlyPromise'
import FloatingAddButton from '../components/common/FloatingAddButton'
import MonthlyMoneySummary from '../components/statistics/MonthlyMoneySummary'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { getBudgetStatus, getRandomMessage } from '../constants/budgetMessages'
import { useMonthlyPromise } from '../hooks/useMonthlyPromise'
import { useTransactionForm } from '../hooks/useTransactionForm'
import { useCalendarStore } from '../stores/calendarStore'

const DAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export default function HomeContainer() {
  const error = useCalendarStore((state) => state.error)
  const addCategory = useCalendarStore((state) => state.addCategory)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const monthlySummary = useCalendarStore((state) => state.monthlySummary)
  const updateCategory = useCalendarStore((state) => state.updateCategory)
  const useIncomeAsBudget = useCalendarStore((state) => state.monthlyPromise.useIncomeAsBudget)

  const navigate = useNavigate()
  const txForm = useTransactionForm()
  const promise = useMonthlyPromise()

  useEffect(() => {
    void loadMonth(new Date())
  }, [loadMonth])

  const today = new Date()
  const spent = monthlySummary.expense + monthlySummary.fixedExpense
  const totalIncome = monthlySummary.income + monthlySummary.fixedIncome
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const remainingDays = daysInMonth - today.getDate() + 1
  const activeCategories = txForm.type === 'income' ? incomeCategories : expenseCategories

  const effectiveBudget = promise.budgetAmount > 0
    ? promise.budgetAmount
    : useIncomeAsBudget ? totalIncome : 0

  const budgetMessage = useMemo(
    () => getRandomMessage(getBudgetStatus(spent, effectiveBudget)),
    [spent, effectiveBudget],
  )

  return (
    <section className="flex w-full flex-1 flex-col self-start animate-fade-up md:flex-none md:mt-4">
      {/* 날짜 + 검색 */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-[34px] font-semibold leading-none tracking-[-0.035em] text-(--ink-1)">
            {today.getDate()}
          </span>
          <span className="text-[13px] font-semibold text-(--ink-3)">
            {DAYS_EN[today.getDay()]}
          </span>
        </div>
        <button
          aria-label="소비내역 검색"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:opacity-50"
          onClick={() => navigate('/app/search')}
          type="button"
        >
          <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5 text-(--ink-3)" />
        </button>
      </div>

      {/* 예산 메시지 — 첫 줄 600, 둘째 줄 400 */}
      <div className="mt-2 shrink-0">
        {budgetMessage.split('\n').map((line, i) => (
          <p
            className={[
              'text-[13px] leading-[1.4]',
              i === 0 ? 'font-semibold text-(--ink-1)' : 'font-normal text-(--ink-2)',
            ].join(' ')}
            key={i}
          >
            {line}
          </p>
        ))}
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-(--color-expense-red)">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col flex-1 justify-center md:mt-10 md:flex-none md:block">
        <MonthlyMoneySummary
          budgetAmount={effectiveBudget}
          onTopClick={promise.openEdit}
          remainingDays={remainingDays}
          showRemainingBudget
          spentAmount={spent}
        />
      </div>

      <FloatingAddButton
        onAddExpense={() => txForm.open('expense')}
        onAddIncome={() => txForm.open('income')}
      />

      <ResponsiveTransactionForm
        categories={activeCategories}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        isOpen={txForm.isOpen}
        onClose={txForm.close}
        onCreateCategory={addCategory}
        onDelete={txForm.close}
        onDeleteCategory={deleteCategory}
        onSave={txForm.handleSave}
        onUpdateCategory={updateCategory}
        selectedDate={new Date()}
        type={txForm.type}
      />

      <ResponsiveMonthlyPromise
        budgetAmount={promise.budgetAmount}
        initialMode={promise.initialMode}
        isOpen={promise.isEditOpen}
        isRegistered={promise.isRegistered}
        onClose={promise.closeEdit}
        onDelete={promise.handleDelete}
        onSave={promise.handleSave}
        onUseIncomeBudget={promise.handleUseIncomeBudget}
        totalIncome={totalIncome}
      />
    </section>
  )
}
