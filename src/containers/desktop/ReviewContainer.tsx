import AiMonthlyReview from '../../components/review/AiMonthlyReview'

export default function DesktopReviewContainer() {
  return (
    <section className="mt-6 min-h-80">
      <h2 className="m-0 text-xl font-bold text-black">회고</h2>
      <div className="mt-5">
        <AiMonthlyReview monthLabel="6월" />
      </div>
    </section>
  )
}
