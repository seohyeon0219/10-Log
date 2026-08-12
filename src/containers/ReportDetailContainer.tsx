import { useParams } from 'react-router-dom'
import AiMonthlyReview from '../components/review/AiMonthlyReview'
import BackHeader from '../components/common/BackHeader'

export default function ReportDetailContainer() {
  const { year, month } = useParams<{ year: string; month: string }>()
  const monthLabel = year && month ? `${month}월` : '이번 달'

  return (
    <section className="w-full self-start animate-fade-up md:mt-4 md:min-h-80">
      <BackHeader to="/app/reports" />
      <AiMonthlyReview monthLabel={monthLabel} />
    </section>
  )
}
