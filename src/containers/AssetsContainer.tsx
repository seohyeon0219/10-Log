import { useNavigate } from 'react-router-dom'
import AiMonthlyReview from '../components/review/AiMonthlyReview'
import StatisticsCard from '../components/statistics/StatisticsCard'

export default function AssetsContainer() {
  const navigate = useNavigate()

  return (
    <section className="w-full self-start animate-fade-up md:mt-4 md:min-h-80">
      <button
        className="mb-4 w-full text-left transition active:opacity-70"
        onClick={() => navigate('/app/review')}
        type="button"
      >
        <AiMonthlyReview />
      </button>

      <StatisticsCard eyebrow="자산 관리" title="내 자산 현황">
        <div className="mt-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/25 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-black/40" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-muted)">
            준비 중
          </span>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-(--color-text-muted)">
          예금, 적금, 투자 등 내 자산을 한눈에 관리할 수 있는 기능이 준비 중이에요.
        </p>
      </StatisticsCard>
    </section>
  )
}
