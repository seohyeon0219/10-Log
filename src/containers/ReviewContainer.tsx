import AiMonthlyReview from '../components/review/AiMonthlyReview'
import DailyReviewForm from '../components/review/DailyReviewForm'
import MiniSummaryCard from '../components/review/MiniSummaryCard'
import ReviewLookback from '../components/review/ReviewLookback'
import { getMockTodayTransactions, mockReviewLookback } from '../mocks/data'

export default function ReviewContainer() {
  const todayTransactions = getMockTodayTransactions(new Date())

  return (
    <section className="w-full self-start md:mt-6 md:min-h-80">
      <h2 className="mb-4 text-xl font-bold text-black md:m-0">회고</h2>
      <div className="md:mt-5">
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
