import { useEffect, useMemo } from 'react'
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
      <div className="mt-8 shrink-0 text-center">
        <p className="text-[20px] font-bold tracking-[3px] text-(--color-text-sand)">
          {DAYS_EN[today.getDay()]}
        </p>
        <div className="mt-1 flex items-baseline justify-center gap-2.5">
          <span className="text-[58px] font-bold leading-[0.9] tracking-[-2px] text-black">
            {today.getDate()}
          </span>
          <span className="text-[14px] font-semibold text-(--color-text-sand)">
            {today.getFullYear()}
          </span>
        </div>
        <p className="mt-6 whitespace-pre-line text-base font-semibold leading-7 text-(--color-text-dim)">
          {budgetMessage}
        </p>
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
