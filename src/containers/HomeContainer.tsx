import { useEffect, useMemo, useState } from 'react'
import MonthlyPromiseBottomSheet from '../components/calendar/MonthlyPromiseBottomSheet'
import MonthlyPromiseModal from '../components/calendar/MonthlyPromiseModal'
import FloatingAddButton from '../components/common/FloatingAddButton'
import MonthlyMoneySummary from '../components/statistics/MonthlyMoneySummary'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { getBudgetStatus, getRandomMessage } from '../constants/budgetMessages'
import { useCalendarStore } from '../stores/calendarStore'
import type { TransactionFormValues, TransactionType } from '../types/finance'

const DAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export default function HomeContainer() {
  const [isPromiseEditOpen, setIsPromiseEditOpen] = useState(false)
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const error = useCalendarStore((state) => state.error)
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
  const useIncomeAsBudget = useCalendarStore((state) => state.useIncomeAsBudget)
  const setUseIncomeAsBudget = useCalendarStore((state) => state.setUseIncomeAsBudget)

  const openTransactionForm = (type: TransactionType) => {
    setTransactionType(type)
    setIsTransactionFormOpen(true)
  }

  useEffect(() => {
    void loadMonth(new Date())
  }, [loadMonth])

  const today = new Date()
  const spent = monthlySummary.expense + monthlySummary.fixedExpense
  const totalIncome = monthlySummary.income + monthlySummary.fixedIncome
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const remainingDays = daysInMonth - today.getDate() + 1
  const activeCategories = transactionType === 'income' ? incomeCategories : expenseCategories

  const effectiveBudget = monthlyPromise.budgetAmount > 0
    ? monthlyPromise.budgetAmount
    : useIncomeAsBudget ? totalIncome : 0

  const budgetMessage = useMemo(
    () => getRandomMessage(getBudgetStatus(spent, effectiveBudget)),
    [spent, effectiveBudget],
  )

  const handleSaveTransaction = async (values: TransactionFormValues) => {
    await addTransaction(transactionType, values)
    setIsTransactionFormOpen(false)
  }

  const handleSavePromise = async (values: { budgetAmount: number }) => {
    try {
      await updateMonthlyPromise(values)
      setIsPromiseEditOpen(false)
    } catch {
      // 에러는 store.error 상태를 통해 표시됨
    }
  }

  const handleDeletePromise = async () => {
    try {
      await deleteMonthlyPromise()
      setIsPromiseEditOpen(false)
    } catch {
      // 에러는 store.error 상태를 통해 표시됨
    }
  }

  const handleUseIncomeBudget = async () => {
    try {
      await setUseIncomeAsBudget(true)
      setIsPromiseEditOpen(false)
    } catch {
      // 에러는 store.error 상태를 통해 표시됨
    }
  }

  const promiseInitialMode = useIncomeAsBudget && !monthlyPromise.isRegistered ? 'income' : 'direct'

  return (
    <section className="flex w-full flex-1 flex-col self-start animate-fade-up md:flex-none md:mt-6">
      <div className="mt-4 shrink-0 text-center">
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

      {/* 카드 */}
      <div className="flex flex-col flex-1 justify-center md:mt-10 md:flex-none md:block">
        <MonthlyMoneySummary
          budgetAmount={effectiveBudget}
          onTopClick={() => setIsPromiseEditOpen(true)}
          remainingDays={remainingDays}
          showRemainingBudget
          spentAmount={spent}
        />
      </div>

      <FloatingAddButton
        onAddExpense={() => openTransactionForm('expense')}
        onAddIncome={() => openTransactionForm('income')}
      />

      <ResponsiveTransactionForm
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

      <div className="hidden md:block">
        <MonthlyPromiseModal
          budgetAmount={monthlyPromise.budgetAmount}
          initialMode={promiseInitialMode}
          isOpen={isPromiseEditOpen}
          isRegistered={monthlyPromise.isRegistered}
          onClose={() => setIsPromiseEditOpen(false)}
          onDelete={handleDeletePromise}
          onSave={handleSavePromise}
          onUseIncomeBudget={handleUseIncomeBudget}
          totalIncome={totalIncome}
        />
      </div>
      <div className="md:hidden">
        <MonthlyPromiseBottomSheet
          budgetAmount={monthlyPromise.budgetAmount}
          initialMode={promiseInitialMode}
          isOpen={isPromiseEditOpen}
          isRegistered={monthlyPromise.isRegistered}
          onClose={() => setIsPromiseEditOpen(false)}
          onDelete={handleDeletePromise}
          onSave={handleSavePromise}
          onUseIncomeBudget={handleUseIncomeBudget}
          totalIncome={totalIncome}
        />
      </div>
    </section>
  )
}
