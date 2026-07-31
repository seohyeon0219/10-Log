import { useEffect, useMemo, useState } from 'react'
import MonthlyPromiseBottomSheet from '../components/calendar/MonthlyPromiseBottomSheet'
import MonthlyPromiseModal from '../components/calendar/MonthlyPromiseModal'
import FloatingAddButton from '../components/common/FloatingAddButton'
import MonthlyMoneySummary from '../components/statistics/MonthlyMoneySummary'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
import TransactionFormBottomSheet from '../components/transactions/bottomSheet/TransactionFormBottomSheet'
import { getBudgetStatus, getRandomMessage } from '../constants/budgetMessages'
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
    await updateMonthlyPromise(values)
    setIsPromiseEditOpen(false)
  }

  const handleDeletePromise = async () => {
    await deleteMonthlyPromise()
    setUseIncomeAsBudget(false)
    setIsPromiseEditOpen(false)
  }

  const handleUseIncomeBudget = async () => {
    if (monthlyPromise.isRegistered) {
      await deleteMonthlyPromise()
    }
    setUseIncomeAsBudget(true)
    setIsPromiseEditOpen(false)
  }

  const promiseInitialMode = useIncomeAsBudget && !monthlyPromise.isRegistered ? 'income' : 'direct'

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
        <p className="mt-4 break-keep text-base font-semibold leading-7 text-(--color-text-muted)">
          {budgetMessage}
        </p>
      </div>

      {/* 카드 */}
      <div className="mt-[max(1.75rem,calc(50dvh-10rem))] md:mt-10">
        <MonthlyMoneySummary
          action={
            useIncomeAsBudget && !monthlyPromise.isRegistered ? (
              <span className="rounded-full bg-black/6 px-2 py-0.5 text-[11px] font-bold text-(--color-text-muted)">
                수입 기준
              </span>
            ) : monthlyPromise.isRegistered ? (
              <button
                className="rounded-lg px-2 py-1 text-xs font-medium text-(--color-text-muted) transition interactive-icon"
                onClick={() => setIsPromiseEditOpen(true)}
                type="button"
              >
                수정
              </button>
            ) : undefined
          }
          budgetAmount={effectiveBudget}
          onTopClick={
            effectiveBudget === 0 || (useIncomeAsBudget && !monthlyPromise.isRegistered)
              ? () => setIsPromiseEditOpen(true)
              : undefined
          }
          remainingDays={remainingDays}
          showRemainingBudget
          spentAmount={spent}
        />
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
