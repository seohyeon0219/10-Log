import { useState } from 'react'
import CategoryChangeRanking from '../components/statistics/CategoryChangeRanking'
import CategoryTransactionRatio from '../components/statistics/CategoryTransactionRatio'
import MonthlyMoneySummary from '../components/statistics/monthlymoneysummary'
import PreviousMonthComparison from '../components/statistics/PreviousMonthComparison'
import SpendngTransactionLineChart from '../components/statistics/spendngTransactionLineChart'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
import type { TransactionType } from '../components/transactions/transactionFormConfig'
import { useCalendarStore } from '../stores/calendarStore'
import { useStatisticsStore } from '../stores/statisticsStore'

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

export default function StatsContainer() {
  const [selectedStatisticsTransaction, setSelectedStatisticsTransaction] = useState<SelectedStatisticsTransaction | null>(null)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const categoryChangeRanking = useStatisticsStore((state) => state.categoryChangeRanking)
  const categoryTransactionRatio = useStatisticsStore((state) => state.categoryTransactionRatio)
  const monthlyMoneySummary = useStatisticsStore((state) => state.monthlyMoneySummary)
  const monthlyPromise = useStatisticsStore((state) => state.monthlyPromise)
  const previousMonthComparison = useStatisticsStore((state) => state.previousMonthComparison)
  const spendingTransactionLineChart = useStatisticsStore((state) => state.spendingTransactionLineChart)

  return (
    <section className="w-full self-start md:mt-6 md:min-h-80">
      <h2 className="mb-4 text-xl font-bold text-black md:m-0">통계</h2>
      <div className="grid gap-4 md:mt-5">
        <MonthlyMoneySummary {...monthlyMoneySummary} budgetAmount={monthlyPromise.budgetAmount} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <PreviousMonthComparison items={previousMonthComparison} />
        <CategoryChangeRanking items={categoryChangeRanking} />
      </div>

      <div className="mt-4">
        <CategoryTransactionRatio
          items={categoryTransactionRatio}
          onSelectTransaction={setSelectedStatisticsTransaction}
        />
      </div>

      <div className="mt-4">
        <SpendngTransactionLineChart data={spendingTransactionLineChart} />
      </div>

      {selectedStatisticsTransaction ? (
        <TransactionFormModal
          categories={selectedStatisticsTransaction.type === 'income' ? incomeCategories : expenseCategories}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
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
