import { useEffect } from 'react'
import AiMonthlyReview from '../components/review/AiMonthlyReview'
import DailyReviewForm from '../components/review/DailyReviewForm'
import MiniSummaryCard from '../components/review/MiniSummaryCard'
import { useReviewStore } from '../stores/reviewStore'

export default function ReviewContainer() {
  const dailyReview = useReviewStore((state) => state.dailyReview)
  const error = useReviewStore((state) => state.error)
  const isLoading = useReviewStore((state) => state.isLoading)
  const loadTodayReview = useReviewStore((state) => state.loadTodayReview)
  const saveDailyReview = useReviewStore((state) => state.saveDailyReview)
  const todayTransactions = useReviewStore((state) => state.todayTransactions)

  useEffect(() => {
    void loadTodayReview()
  }, [loadTodayReview])

  return (
    <section className="w-full self-start md:mt-6 md:min-h-80">
      <h2 className="mb-4 hidden text-xl font-bold text-black md:mb-0 md:block">회고</h2>
      {error ? (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-(--color-expense-red)">
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="mb-4 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-500">
          오늘 거래를 불러오는 중이에요.
        </div>
      ) : null}
      <div className="md:mt-5">
        <MiniSummaryCard transactions={todayTransactions} />
      </div>
      <div className="mt-4">
        <DailyReviewForm
          initialReview={dailyReview}
          key={dailyReview?.id ?? 'new-daily-review'}
          onSave={saveDailyReview}
          transactions={todayTransactions}
        />
      </div>
      <div className="mt-4">
        <AiMonthlyReview monthLabel="이번 달" />
      </div>
    </section>
  )
}
