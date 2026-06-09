import { useEffect, useMemo } from 'react'
import AiMonthlyReview from '../components/review/AiMonthlyReview'
import DailyReviewForm from '../components/review/DailyReviewForm'
import MiniSummaryCard from '../components/review/MiniSummaryCard'
import { useCalendarStore } from '../stores/calendarStore'
import { useReviewStore } from '../stores/reviewStore'

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function ReviewContainer() {
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const calendarTransactions = useCalendarStore((state) => state.transactions)
  const dailyReview = useReviewStore((state) => state.dailyReview)
  const error = useReviewStore((state) => state.error)
  const isLoading = useReviewStore((state) => state.isLoading)
  const loadDailyReview = useReviewStore((state) => state.loadDailyReview)
  const saveDailyReview = useReviewStore((state) => state.saveDailyReview)
  const todayTransactions = useReviewStore((state) => state.todayTransactions)
  const reviewDate = useMemo(() => selectedDate ?? new Date(), [selectedDate])
  const reviewDateKey = getDateKey(reviewDate)
  const calendarReviewTransactions = calendarTransactions.filter(
    (transaction) => transaction.date === reviewDateKey,
  )
  const reviewTransactions =
    calendarReviewTransactions.length > 0 ? calendarReviewTransactions : todayTransactions

  useEffect(() => {
    void loadDailyReview(reviewDate)
  }, [loadDailyReview, reviewDate, reviewDateKey])

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
        <MiniSummaryCard transactions={reviewTransactions} />
      </div>
      <div className="mt-4">
        <DailyReviewForm
          initialReview={dailyReview}
          key={`${reviewDateKey}-${dailyReview?.id ?? 'new-daily-review'}`}
          onSave={(values) => saveDailyReview(reviewDate, values)}
          transactions={reviewTransactions}
        />
      </div>
      <div className="mt-4">
        <AiMonthlyReview monthLabel="6월" />
      </div>
    </section>
  )
}
