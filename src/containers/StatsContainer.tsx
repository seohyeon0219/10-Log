import { useEffect, useMemo, useState } from 'react'
import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'
import CategoryChangeRanking from '../components/statistics/CategoryChangeRanking'
import CategoryTransactionRatio from '../components/statistics/CategoryTransactionRatio'
import PreviousMonthComparison from '../components/statistics/PreviousMonthComparison'
import SpendingTransactionLineChart from '../components/statistics/SpendingTransactionLineChart'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { useRecentMonthsTransactions } from '../hooks/useRecentMonthsTransactions'
import { useCalendarStore } from '../stores/calendarStore'
import { useStatisticsStore } from '../stores/statisticsStore'
import type { TransactionType } from '../types/finance'
import {
  getCategoryChangeRanking,
  getCategoryRatio,
  getLineChartData,
  getPreviousMonthComparison,
} from '../utils/statisticsCalculators'

type SelectedStatisticsTransaction = {
  amount: number
  categoryId: string
  date: string
  id: string
  memo: string
  type: TransactionType
}

export default function StatsContainer() {
  const [selectedStatisticsTransaction, setSelectedStatisticsTransaction] =
    useState<SelectedStatisticsTransaction | null>(null)
  const addCategory = useCalendarStore((state) => state.addCategory)
  const currentDate = useCalendarStore((state) => state.currentDate)
  const goNextMonth = useCalendarStore((state) => state.goNextMonth)
  const goPrevMonth = useCalendarStore((state) => state.goPrevMonth)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const deleteTransaction = useCalendarStore((state) => state.deleteTransaction)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const transactions = useCalendarStore((state) => state.transactions)
  const updateCategory = useCalendarStore((state) => state.updateCategory)
  const updateTransaction = useCalendarStore((state) => state.updateTransaction)
  const ratioType = useStatisticsStore((state) => state.ratioType)
  const ratioSelectedCategoryId = useStatisticsStore((state) => state.ratioSelectedCategoryId)
  const setRatioType = useStatisticsStore((state) => state.setRatioType)
  const setRatioSelectedCategoryId = useStatisticsStore((state) => state.setRatioSelectedCategoryId)
  const { monthsData, previousMonthData } = useRecentMonthsTransactions(currentDate)
  const categoryTransactionRatio = useMemo(() => getCategoryRatio(transactions), [transactions])
  const previousMonthComparison = useMemo(
    () => getPreviousMonthComparison(transactions, previousMonthData),
    [previousMonthData, transactions],
  )
  const categoryChangeRanking = useMemo(
    () => getCategoryChangeRanking(transactions, previousMonthData),
    [previousMonthData, transactions],
  )
  const spendingTransactionLineChart = useMemo(
    () => getLineChartData(currentDate, monthsData),
    [currentDate, monthsData],
  )
  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const activeCategories = selectedStatisticsTransaction?.type === 'income' ? incomeCategories : expenseCategories

  const closeTransactionModal = () => setSelectedStatisticsTransaction(null)

  const saveTransaction = async (values: Parameters<typeof updateTransaction>[1]) => {
    if (!selectedStatisticsTransaction) {
      return
    }

    await updateTransaction(selectedStatisticsTransaction.id, values)
    closeTransactionModal()
  }

  const removeTransaction = async () => {
    if (!selectedStatisticsTransaction) {
      return
    }

    await deleteTransaction(selectedStatisticsTransaction.id)
    closeTransactionModal()
  }

  return (
    <section className="w-full self-start animate-fade-up md:mt-6 md:min-h-80">
      <h2 className="mb-4 hidden text-xl font-bold text-black md:mb-0 md:block">통계</h2>
      <div className="mb-4 md:hidden">
        <CalendarMonthHeader
          currentDate={currentDate}
          onNextMonth={goNextMonth}
          onPrevMonth={goPrevMonth}
        />
      </div>
      <div className="md:mt-5">
        <CategoryTransactionRatio
          items={categoryTransactionRatio}
          onRatioTypeChange={setRatioType}
          onSelectTransaction={setSelectedStatisticsTransaction}
          onSelectedCategoryIdChange={setRatioSelectedCategoryId}
          ratioType={ratioType}
          selectedCategoryId={ratioSelectedCategoryId}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <PreviousMonthComparison items={previousMonthComparison} />
        <CategoryChangeRanking items={categoryChangeRanking} />
      </div>

      <div className="mt-4">
        <SpendingTransactionLineChart data={spendingTransactionLineChart} />
      </div>

      {selectedStatisticsTransaction ? (
        <ResponsiveTransactionForm
          categories={activeCategories}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          initialAmount={selectedStatisticsTransaction.amount}
          initialCategoryId={selectedStatisticsTransaction.categoryId}
          initialMemo={selectedStatisticsTransaction.memo}
          isOpen
          mode="edit"
          onClose={closeTransactionModal}
          onCreateCategory={addCategory}
          onDelete={removeTransaction}
          onDeleteCategory={deleteCategory}
          onSave={saveTransaction}
          onUpdateCategory={updateCategory}
          selectedDate={new Date(`${selectedStatisticsTransaction.date}T00:00:00`)}
          type={selectedStatisticsTransaction.type}
        />
      ) : null}
    </section>
  )
}
