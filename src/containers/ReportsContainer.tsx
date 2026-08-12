import BackHeader from '../components/common/BackHeader'

export default function ReportsContainer() {
  return (
    <section className="w-full self-start animate-fade-up md:mt-4 md:min-h-80">
      <BackHeader title="리포트 모아보기" to="/app/more" />
      <p className="py-16 text-center text-sm font-semibold text-gray-400">
        아직 생성된 리포트가 없어요.
      </p>
    </section>
  )
}
