import { useEffect, useMemo, useState } from 'react'
import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'
import CategoryChangeRanking from '../components/statistics/CategoryChangeRanking'
import CategoryTransactionRatio from '../components/statistics/CategoryTransactionRatio'
import MonthlyMoneySummary from '../components/statistics/monthlymoneysummary'
import PreviousMonthComparison from '../components/statistics/PreviousMonthComparison'
import SpendngTransactionLineChart from '../components/statistics/spendngTransactionLineChart'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
import TransactionFormBottomSheet from '../components/transactions/bottomSheet/TransactionFormBottomSheet'
import type { TransactionType } from '../components/transactions/transactionFormConfig'
import { useRecentMonthsTransactions } from '../hooks/useRecentMonthsTransactions'
import { useCalendarStore } from '../stores/calendarStore'
import { useStatisticsStore } from '../stores/statisticsStore'
import type { Transaction } from '../types/finance'

type SelectedStatisticsTransaction = {
  amount: number
  categoryId: string
  date: string
  id: string
  memo: string
  type: TransactionType
}

type CategoryRatioItem = {
  amount: number
  color: string
  id: string
  label: string
  transactions: Array<{
    amount: number
    categoryId: string
    date: string
    id: string
    memo: string
  }>
}

const getMonthDate = (baseDate: Date, offset: number) =>
  new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 1)

const getRemainingDays = (date: Date) => {
  const today = new Date()
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth()) {
    return Math.max(daysInMonth - today.getDate() + 1, 0)
  }

  return daysInMonth
}

const getRate = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }

  return Math.round(((current - previous) / previous) * 100)
}

const getSummary = (transactions: Transaction[]) =>
  transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.income += transaction.amount
        summary.fixedIncome += transaction.isFixed ? transaction.amount : 0
      }

      if (transaction.type === 'expense') {
        summary.expense += transaction.amount
        summary.fixedExpense += transaction.isFixed ? transaction.amount : 0
      }

      return summary
    },
    {
      expense: 0,
      fixedExpense: 0,
      fixedIncome: 0,
      income: 0,
    },
  )

const getCategoryRatio = (transactions: Transaction[]) => {
  const result: Record<TransactionType, CategoryRatioItem[]> = {
    expense: [],
    income: [],
  }

  transactions.forEach((transaction) => {
    const items = result[transaction.type]
    const item = items.find((category) => category.id === transaction.categoryId)

    if (!item) {
      items.push({
        amount: transaction.amount,
        color: transaction.categoryColor,
        id: transaction.categoryId,
        label: transaction.categoryName,
        transactions: [
          {
            amount: transaction.amount,
            categoryId: transaction.categoryId,
            date: transaction.date,
            id: transaction.id,
            memo: transaction.memo,
          },
        ],
      })

      return
    }

    item.amount += transaction.amount
    item.transactions.push({
      amount: transaction.amount,
      categoryId: transaction.categoryId,
      date: transaction.date,
      id: transaction.id,
      memo: transaction.memo,
    })
  })

  return {
    expense: result.expense.sort((a, b) => b.amount - a.amount),
    income: result.income.sort((a, b) => b.amount - a.amount),
  }
}

const getPreviousMonthComparison = (
  currentTransactions: Transaction[],
  previousTransactions: Transaction[],
) => {
  const current = getSummary(currentTransactions)
  const previous = getSummary(previousTransactions)
  const currentIncome = current.income + current.fixedIncome
  const previousIncome = previous.income + previous.fixedIncome
  const currentExpense = current.expense + current.fixedExpense
  const previousExpense = previous.expense + previous.fixedExpense
  const currentBalance = currentIncome - currentExpense
  const previousBalance = previousIncome - previousExpense

  return [
    {
      details: [
        { label: '수입', value: current.income },
        { label: '고정수입', value: current.fixedIncome },
        { isEmphasized: true, label: '총수입', value: currentIncome },
      ],
      id: 'income',
      label: '수입',
      rate: getRate(currentIncome, previousIncome),
    },
    {
      details: [
        { label: '지출', value: current.expense },
        { label: '고정지출', value: current.fixedExpense },
        { isEmphasized: true, label: '총지출', value: currentExpense },
      ],
      id: 'expense',
      label: '지출',
      rate: getRate(currentExpense, previousExpense),
    },
    {
      details: [
        { label: '총수입', value: currentIncome },
        { label: '총지출', value: currentExpense },
        { isEmphasized: true, label: '잔액', value: currentBalance },
      ],
      id: 'balance',
      label: '잔액',
      rate: getRate(currentBalance, previousBalance),
    },
  ]
}

const getCategoryChangeRanking = (
  currentTransactions: Transaction[],
  previousTransactions: Transaction[],
) => {
  const makeRanking = (type: TransactionType) => {
    const currentMap = new Map<string, { amount: number; label: string }>()
    const previousMap = new Map<string, number>()

    currentTransactions
      .filter((transaction) => transaction.type === type)
      .forEach((transaction) => {
        const current = currentMap.get(transaction.categoryId)
        currentMap.set(transaction.categoryId, {
          amount: (current?.amount ?? 0) + transaction.amount,
          label: transaction.categoryName,
        })
      })

    previousTransactions
      .filter((transaction) => transaction.type === type)
      .forEach((transaction) => {
        previousMap.set(
          transaction.categoryId,
          (previousMap.get(transaction.categoryId) ?? 0) + transaction.amount,
        )
      })

    return Array.from(currentMap.entries())
      .map(([id, item]) => ({
        id,
        label: item.label,
        rate: getRate(item.amount, previousMap.get(id) ?? 0),
      }))
      .sort((a, b) => Math.abs(b.rate) - Math.abs(a.rate))
      .slice(0, 3)
  }

  return {
    expense: makeRanking('expense'),
    income: makeRanking('income'),
  }
}

const getLineChartData = (currentDate: Date, monthTransactions: Transaction[][]) => {
  const currentMonthIndex = monthTransactions.length - 1

  return {
    expense: monthTransactions.map((transactions, index) => ({
      amount: transactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0),
      month: `${getMonthDate(currentDate, index - currentMonthIndex).getMonth() + 1}월`,
    })),
    income: monthTransactions.map((transactions, index) => ({
      amount: transactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0),
      month: `${getMonthDate(currentDate, index - currentMonthIndex).getMonth() + 1}월`,
    })),
  }
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
  const monthlyPromise = useCalendarStore((state) => state.monthlyPromise)
  const monthlySummary = useCalendarStore((state) => state.monthlySummary)
  const transactions = useCalendarStore((state) => state.transactions)
  const updateCategory = useCalendarStore((state) => state.updateCategory)
  const updateTransaction = useCalendarStore((state) => state.updateTransaction)
  const ratioType = useStatisticsStore((state) => state.ratioType)
  const ratioSelectedCategoryId = useStatisticsStore((state) => state.ratioSelectedCategoryId)
  const setRatioType = useStatisticsStore((state) => state.setRatioType)
  const setRatioSelectedCategoryId = useStatisticsStore((state) => state.setRatioSelectedCategoryId)
  const lineChartType = useStatisticsStore((state) => state.lineChartType)
  const setLineChartType = useStatisticsStore((state) => state.setLineChartType)
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
  const monthlyMoneySummary = {
    budgetAmount: monthlyPromise.budgetAmount,
    remainingDays: getRemainingDays(currentDate),
    spentAmount: monthlySummary.expense + monthlySummary.fixedExpense,
  }

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

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
    <section className="w-full self-start md:mt-6 md:min-h-80">
      <h2 className="mb-4 hidden text-xl font-bold text-black md:mb-0 md:block">통계</h2>
      <div className="mb-4 md:hidden">
        <CalendarMonthHeader
          currentDate={currentDate}
          onNextMonth={goNextMonth}
          onPrevMonth={goPrevMonth}
        />
      </div>
      <div className="grid gap-4 md:mt-5">
        <MonthlyMoneySummary {...monthlyMoneySummary} />
      </div>

      <div className="mt-4">
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
        <SpendngTransactionLineChart
          data={spendingTransactionLineChart}
          lineChartType={lineChartType}
          onLineChartTypeChange={setLineChartType}
        />
      </div>

      {selectedStatisticsTransaction ? (
        <>
          <div className="hidden md:block">
            <TransactionFormModal
              categories={
                selectedStatisticsTransaction.type === 'income' ? incomeCategories : expenseCategories
              }
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
          </div>
          <div className="md:hidden">
            <TransactionFormBottomSheet
              categories={
                selectedStatisticsTransaction.type === 'income' ? incomeCategories : expenseCategories
              }
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
          </div>
        </>
      ) : null}
    </section>
  )
}
