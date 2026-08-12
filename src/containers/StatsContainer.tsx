import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'
import CategoryChangeRanking from '../components/statistics/CategoryChangeRanking'
import CategoryTransactionRatio from '../components/statistics/CategoryTransactionRatio'
import PreviousMonthComparison from '../components/statistics/PreviousMonthComparison'
import SpendingTransactionLineChart from '../components/statistics/SpendingTransactionLineChart'
import AiMonthlyReview from '../components/review/AiMonthlyReview'
import { Link } from 'react-router-dom'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { useStatsPage } from '../hooks/useStatsPage'

export default function StatsContainer() {
  const stats = useStatsPage()

  return (
    <section className="w-full self-start animate-fade-up md:mt-4 md:min-h-80">
      <div className="mb-4 md:hidden">
        <CalendarMonthHeader
          currentDate={stats.currentDate}
          onNextMonth={stats.goNextMonth}
          onPrevMonth={stats.goPrevMonth}
        />
      </div>

      <Link className="mb-4 block" to="/app/review">
        <AiMonthlyReview monthLabel={`${stats.currentDate.getMonth() + 1}월`} />
      </Link>

      <div>
        <CategoryTransactionRatio
          items={stats.categoryTransactionRatio}
          onRatioTypeChange={stats.setRatioType}
          onSelectTransaction={stats.setSelectedTransaction}
          onSelectedCategoryIdChange={stats.setRatioSelectedCategoryId}
          ratioType={stats.ratioType}
          selectedCategoryId={stats.ratioSelectedCategoryId}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <PreviousMonthComparison items={stats.previousMonthComparison} />
        <CategoryChangeRanking items={stats.categoryChangeRanking} />
      </div>

      <div className="mt-4">
        <SpendingTransactionLineChart data={stats.spendingTransactionLineChart} />
      </div>

      {stats.selectedTransaction ? (
        <ResponsiveTransactionForm
          categories={stats.activeCategories}
          expenseCategories={stats.expenseCategories}
          incomeCategories={stats.incomeCategories}
          initialAmount={stats.selectedTransaction.amount}
          initialCategoryId={stats.selectedTransaction.categoryId}
          initialMemo={stats.selectedTransaction.memo}
          isOpen
          mode="edit"
          onClose={stats.closeTransaction}
          onCreateCategory={stats.addCategory}
          onDelete={stats.removeTransaction}
          onDeleteCategory={stats.deleteCategory}
          onSave={stats.saveTransaction}
          onUpdateCategory={stats.updateCategory}
          selectedDate={new Date(`${stats.selectedTransaction.date}T00:00:00`)}
          type={stats.selectedTransaction.type}
        />
      ) : null}
    </section>
  )
}
