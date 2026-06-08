import AiMonthlyReview from '../../components/review/AiMonthlyReview'
import DailyReviewForm from '../../components/review/DailyReviewForm'
import MiniSummaryCard from '../../components/review/MiniSummaryCard'
import ReviewLookback from '../../components/review/ReviewLookback'
import { getMockTodayTransactions, mockReviewLookback } from '../../mocks/data'

export default function DesktopReviewContainer() {
  const todayTransactions = getMockTodayTransactions(new Date())

  return (
    <section className="mt-6 min-h-80">
      <h2 className="m-0 text-xl font-bold text-black">회고</h2>
      <div className="mt-5">
        <MiniSummaryCard transactions={todayTransactions} />
      </div>
      <div className="mt-4">
        <DailyReviewForm transactions={todayTransactions} />
      </div>
      <div className="mt-4">
        <ReviewLookback {...mockReviewLookback} />
      </div>
      <div className="mt-4">
        <AiMonthlyReview monthLabel="6월" />
      </div>
    </section>
  )
}
