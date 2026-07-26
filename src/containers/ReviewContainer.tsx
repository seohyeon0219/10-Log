import { useState } from 'react'
import AiMonthlyReview from '../components/review/AiMonthlyReview'
import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'

export default function ReviewContainer() {
  const [reviewMonth, setReviewMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
  )

  const goPrevReviewMonth = () =>
    setReviewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const goNextReviewMonth = () =>
    setReviewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  return (
    <section className="w-full self-start md:mt-6 md:min-h-80">
      <h2 className="mb-4 hidden text-xl font-bold text-black md:mb-0 md:block">로그</h2>
      <div className="mb-4 md:hidden">
        <CalendarMonthHeader
          currentDate={reviewMonth}
          onNextMonth={goNextReviewMonth}
          onPrevMonth={goPrevReviewMonth}
        />
      </div>
      <div className="md:mt-5">
        <AiMonthlyReview monthLabel={`${reviewMonth.getMonth() + 1}월`} />
      </div>
    </section>
  )
}
