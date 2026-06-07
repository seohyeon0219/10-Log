import StatisticsContent from '../../components/statistics/StatisticsContent'

export default function DesktopStatsContainer() {
  return (
    <section className="mt-6 min-h-80">
      <h2 className="m-0 text-xl font-bold text-black">통계</h2>
      <div className="mt-5">
        <StatisticsContent />
      </div>
    </section>
  )
}
