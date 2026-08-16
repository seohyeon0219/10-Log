import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'
import CategoryChangeRanking from '../components/statistics/CategoryChangeRanking'
import CategoryTransactionRatio from '../components/statistics/CategoryTransactionRatio'
import MonthlyInsightsCard from '../components/statistics/MonthlyInsightsCard'
import PreviousMonthComparison from '../components/statistics/PreviousMonthComparison'
import SpendingByDayOfWeekCard from '../components/statistics/SpendingByDayOfWeekCard'
import SpendingByWeekCard from '../components/statistics/SpendingByWeekCard'
import SpendingDensityCard from '../components/statistics/SpendingDensityCard'
import SpendingTransactionLineChart from '../components/statistics/SpendingTransactionLineChart'
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

      <div className="grid gap-4">
        <CategoryTransactionRatio
          items={stats.categoryTransactionRatio}
          onRatioTypeChange={stats.setRatioType}
          onSelectTransaction={stats.setSelectedTransaction}
          onSelectedCategoryIdChange={stats.setRatioSelectedCategoryId}
          ratioType={stats.ratioType}
          selectedCategoryId={stats.ratioSelectedCategoryId}
        />

        <MonthlyInsightsCard data={stats.monthlyInsights} showDetailLink={false} />

        <div className="grid gap-4 md:grid-cols-2">
          <PreviousMonthComparison items={stats.previousMonthComparison} />
          <CategoryChangeRanking items={stats.categoryChangeRanking} />
        </div>

        <SpendingTransactionLineChart
          data={stats.spendingTransactionLineChart}
          lastYearExpense={stats.lastYearExpense}
        />

        <SpendingByDayOfWeekCard data={stats.spendingByDayOfWeek} />
        <SpendingByWeekCard data={stats.spendingByWeek} />
        <SpendingDensityCard data={stats.spendingDensity} />
      </div>

      {stats.selectedTransaction ? (
        <ResponsiveTransactionForm
          categories={stats.activeCategories}
          expenseCategories={stats.expenseCategories}
          incomeCategories={stats.incomeCategories}
          initialAmount={stats.selectedTransaction.amount}
          initialCategoryId={stats.selectedTransaction.categoryId}
          initialMemo={stats.selectedTransaction.memo}
          initialSatisfaction={stats.selectedTransaction.satisfaction}
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
