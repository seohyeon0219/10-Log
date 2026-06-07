type MonthlyPromiseProps = {
  budgetAmount: number
  isRegistered: boolean
  monthLabel: string
  onEdit?: () => void
  promise: string
}

const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export default function MonthlyPromise({
  budgetAmount,
  isRegistered,
  monthLabel,
  onEdit,
  promise,
}: MonthlyPromiseProps) {
  return (
    <section className="rounded-2xl border border-yellow-100 bg-yellow-50 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] max-[380px]:p-4">
      <div className="flex items-start justify-between gap-4 max-[380px]:gap-3">
        {/* <div className="min-w-0"> */}
          {/* <p className="text-sm font-extrabold text-yellow-700">이번 달 돈 관리의 기준이에요</p> */}
          {/* <p className="text-sm font-extrabold text-(--color-income-blue)">{monthLabel} 다짐</p>
          <p className="mt-1 text-sm font-bold text-yellow-700">이번 달 돈 관리의 기준이에요</p> */}
        {/* </div> */}
        <button
          className={[
            'min-h-8 shrink-0 cursor-pointer rounded-lg border px-3 text-sm font-extrabold whitespace-nowrap transition',
            isRegistered
              ? 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-200'
              : 'border-transparent bg-black text-white shadow-sm hover:bg-gray-800 active:bg-black',
          ].join(' ')}
          onClick={onEdit}
          type="button"
        >
          {isRegistered ? '수정' : '등록'}
        </button>
      </div>

      <div className="mt-5">
        <p className="text-sm font-bold text-(--color-dark-gray)">한 줄 다짐</p>
        <h3 className="mt-2 break-keep text-2xl leading-9 font-extrabold text-black max-[380px]:text-xl max-[380px]:leading-8">
          <span className="bg-linear-to-t from-yellow-200 from-50% to-transparent to-50% px-1 [box-decoration-break:clone]">
            {promise}
          </span>
        </h3>
      </div>

      <div className="mt-5 rounded-xl border border-yellow-100 bg-white/75 px-4 py-4">
        <div className="flex items-center justify-between gap-4 max-[380px]:items-start">
          <p className="text-sm font-bold text-(--color-dark-gray)">목표 예산</p>
          <p className="text-xl font-extrabold tracking-normal text-black max-[380px]:text-lg">{formatWon(budgetAmount)}</p>
        </div>
      </div>
    </section>
  )
}
