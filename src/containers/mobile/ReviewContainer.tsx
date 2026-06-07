import AiMonthlyReview from '../../components/review/AiMonthlyReview'

export default function MobileReviewContainer() {
  return (
    <section className="w-full self-start">
      <h2 className="mb-4 text-xl font-bold text-black">회고</h2>
      <AiMonthlyReview monthLabel="6월" />
    </section>
  )
}
