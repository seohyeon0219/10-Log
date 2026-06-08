import { useState } from 'react'
import CategoryChangeRanking from '../../components/statistics/CategoryChangeRanking'
import CategoryTransactionRatio from '../../components/statistics/CategoryTransactionRatio'
import MonthlyMoneySummary from '../../components/statistics/monthlymoneysummary'
import PreviousMonthComparison from '../../components/statistics/PreviousMonthComparison'
import SpendngTransactionLineChart from '../../components/statistics/spendngTransactionLineChart'
import TransactionFormModal from '../../components/transactions/TransactionFormModal'
import type { TransactionType } from '../../components/transactions/transactionFormConfig'
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

export default function MobileStatsContainer() {
  const [selectedStatisticsTransaction, setSelectedStatisticsTransaction] = useState<SelectedStatisticsTransaction | null>(null)
  const monthlyPromise = useStatisticsStore((state) => state.monthlyPromise)

  return (
    <section className="w-full self-start">
      <h2 className="mb-4 text-xl font-bold text-black">통계</h2>
      <div className="grid gap-4">
        <MonthlyMoneySummary {...mockMonthlyMoneySummary} budgetAmount={monthlyPromise.budgetAmount} />
      </div>

      <div className="mt-4 grid gap-4">
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
    </section>
  )
}
