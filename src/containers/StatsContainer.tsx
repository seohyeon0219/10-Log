import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'
import InfoChip from '../components/common/InfoChip'
import ReportProgressCard from '../components/log/ReportProgressCard'
import CategoryChangeRanking from '../components/statistics/CategoryChangeRanking'
import CategoryTransactionRatio from '../components/statistics/CategoryTransactionRatio'
import MonthlyInsightsCard from '../components/statistics/MonthlyInsightsCard'
import PreviousMonthComparison from '../components/statistics/PreviousMonthComparison'
import SpendingByDayOfWeekCard from '../components/statistics/SpendingByDayOfWeekCard'
import SpendingByWeekCard from '../components/statistics/SpendingByWeekCard'
import SpendingTransactionLineChart from '../components/statistics/SpendingTransactionLineChart'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { useStatsPage } from '../hooks/useStatsPage'

export default function StatsContainer() {
  const stats = useStatsPage()

  const satisfactionCount = useMemo(() => {
    return stats.transactions.filter((tx) => tx.type === 'expense' && tx.satisfaction).length
  }, [stats.transactions])

  const insights = useMemo(() => {
    const map = new Map<string, { name: string; satisfied: number; regret: number; tagged: number }>()
    for (const cat of stats.expenseCategories) {
      map.set(cat.id, { name: cat.name, satisfied: 0, regret: 0, tagged: 0 })
    }
    for (const tx of stats.transactions) {
      if (tx.type !== 'expense' || !tx.categoryId || !tx.satisfaction) continue
      const s = map.get(tx.categoryId)
      if (!s) continue
      s.tagged++
      if (tx.satisfaction === 'satisfied') s.satisfied++
      if (tx.satisfaction === 'regret') s.regret++
    }
    const sentences: string[] = []
    let topSatisfied: { name: string; satisfied: number } | null = null
    let topRegret: { name: string; regret: number } | null = null
    for (const s of map.values()) {
      if (s.satisfied >= 2 && s.satisfied / s.tagged > 0.5) {
        if (!topSatisfied || s.satisfied > topSatisfied.satisfied) topSatisfied = s
      }
      if (s.regret >= 1) {
        if (!topRegret || s.regret > topRegret.regret) topRegret = s
      }
    }
    if (topSatisfied) sentences.push(`이번 달 ${topSatisfied.name} 지출은 대부분 만족으로 남았어요`)
    if (topRegret) sentences.push(`후회 소비가 가장 많았던 카테고리는 ${topRegret.name}예요`)
    return sentences
  }, [stats.transactions, stats.expenseCategories])

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
        <Link to="/app/stats/review">
          <ReportProgressCard currentDate={stats.currentDate} insights={insights} satisfactionCount={satisfactionCount} />
        </Link>

        <InfoChip>기본 분석</InfoChip>

        <CategoryTransactionRatio
          items={stats.categoryTransactionRatio}
          onRatioTypeChange={stats.setRatioType}
          onSelectedCategoryIdChange={stats.setRatioSelectedCategoryId}
          ratioType={stats.ratioType}
          selectedCategoryId={stats.ratioSelectedCategoryId}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <PreviousMonthComparison items={stats.previousMonthComparison} />
          <CategoryChangeRanking items={stats.categoryChangeRanking} />
        </div>

        <SpendingTransactionLineChart
          data={stats.spendingTransactionLineChart}
          lastYearExpense={stats.lastYearExpense}
        />

        <InfoChip className="mt-4">상세 분석</InfoChip>

        <MonthlyInsightsCard data={stats.monthlyInsights} density={stats.spendingDensity} showDetailLink={false} />
        <SpendingByDayOfWeekCard data={stats.spendingByDayOfWeek} />
        <SpendingByWeekCard data={stats.spendingByWeek} />
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
