import { useState } from 'react'
import {
  mockCategoryChangeRanking,
  mockCategoryTransactionRatio,
  mockExpenseCategories,
  mockIncomeCategories,
  mockMonthlyMoneySummary,
  mockPreviousMonthComparison,
  mockSpendingTransactionLineChart,
} from '../../mocks/data'
import { useStatisticsStore } from '../../stores/statisticsStore'
import TransactionFormModal from '../transactions/TransactionFormModal'
import type { TransactionType } from '../transactions/transactionFormConfig'
import CategoryChangeRanking from './CategoryChangeRanking'
import CategoryTransactionRatio from './CategoryTransactionRatio'
import PreviousMonthComparison from './PreviousMonthComparison'
import MonthlyMoneySummary from './monthlymoneysummary'
import SpendngTransactionLineChart from './spendngTransactionLineChart'

type SelectedStatisticsTransaction = {
  amount: number
  categoryId: string
  date: string
  id: string
  memo: string
  type: TransactionType
}

const toSelectedDate = (dateText: string) => {
  const [month, day] = dateText.split('/').map(Number)
  const currentYear = new Date().getFullYear()

  return new Date(currentYear, (month || 1) - 1, day || 1)
}

export default function StatisticsContent() {
  const [selectedStatisticsTransaction, setSelectedStatisticsTransaction] = useState<SelectedStatisticsTransaction | null>(null)
  const monthlyPromise = useStatisticsStore((state) => state.monthlyPromise)

  return (
    <>
      <div className="grid gap-4">
        <MonthlyMoneySummary {...mockMonthlyMoneySummary} budgetAmount={monthlyPromise.budgetAmount} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <PreviousMonthComparison items={mockPreviousMonthComparison} />
        <CategoryChangeRanking items={mockCategoryChangeRanking} />
      </div>

      <div className="mt-4">
        <CategoryTransactionRatio
          items={mockCategoryTransactionRatio}
          onSelectTransaction={setSelectedStatisticsTransaction}
        />
      </div>

      <div className="mt-4">
        <SpendngTransactionLineChart data={mockSpendingTransactionLineChart} />
      </div>

      {selectedStatisticsTransaction ? (
        <TransactionFormModal
          categories={selectedStatisticsTransaction.type === 'income' ? mockIncomeCategories : mockExpenseCategories}
          expenseCategories={mockExpenseCategories}
          incomeCategories={mockIncomeCategories}
          initialAmount={selectedStatisticsTransaction.amount}
          initialCategoryId={selectedStatisticsTransaction.categoryId}
          initialMemo={selectedStatisticsTransaction.memo}
          isOpen={Boolean(selectedStatisticsTransaction)}
          mode="edit"
          onClose={() => setSelectedStatisticsTransaction(null)}
          onDelete={() => setSelectedStatisticsTransaction(null)}
          onSave={() => setSelectedStatisticsTransaction(null)}
          selectedDate={toSelectedDate(selectedStatisticsTransaction.date)}
          type={selectedStatisticsTransaction.type}
        />
      ) : null}
    </>
  )
}
