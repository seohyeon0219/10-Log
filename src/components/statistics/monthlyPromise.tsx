import StatisticsCard from './StatisticsCard'

type MonthlyPromiseProps = {
  budgetAmount: number
  monthLabel: string
  onEdit?: () => void
  promise: string
}

const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export default function MonthlyPromise({
  budgetAmount,
  monthLabel,
  onEdit,
  promise,
}: MonthlyPromiseProps) {
  return (
    <StatisticsCard
      action={
        <button
          className="min-h-8 shrink-0 cursor-pointer rounded-lg border-0 bg-gray-100 px-3 text-sm font-extrabold whitespace-nowrap text-gray-500 transition hover:bg-gray-200 active:bg-gray-200"
          onClick={onEdit}
          type="button"
        >
          수정
        </button>
      }
      eyebrow={`${monthLabel} 다짐`}
      eyebrowClassName="text-(--color-income-blue)"
    >
      <div className="mt-5">
        <p className="text-sm font-bold text-(--color-dark-gray)">한 줄 다짐</p>
        <h3 className="mt-2 break-keep text-2xl leading-9 font-extrabold text-black max-[380px]:text-xl max-[380px]:leading-8">
          <span className="bg-linear-to-t from-yellow-200 from-45% to-transparent to-45% px-1 [box-decoration-break:clone]">
            {promise}
          </span>
        </h3>
      </div>

      <div className="mt-5 rounded-xl bg-gray-50 px-4 py-4">
        <div className="flex items-center justify-between gap-4 max-[380px]:items-start">
          <p className="text-sm font-bold text-(--color-dark-gray)">목표 예산</p>
          <p className="text-xl font-extrabold tracking-normal text-black max-[380px]:text-lg">{formatWon(budgetAmount)}</p>
        </div>
      </div>
    </StatisticsCard>
  )
}
