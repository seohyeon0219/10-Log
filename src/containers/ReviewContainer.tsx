import AiMonthlyReview from '../components/review/AiMonthlyReview'
import BackHeader from '../components/common/BackHeader'

const thisMonth = new Date()

export default function ReviewContainer() {
  return (
    <section className="w-full self-start animate-fade-up md:mt-4 md:min-h-80">
      <BackHeader to="/app/stats" />
      <AiMonthlyReview monthLabel={`${thisMonth.getMonth() + 1}월`} />
    </section>
  )
}
