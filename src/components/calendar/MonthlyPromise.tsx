type MonthlyPromiseProps = {
  budgetAmount: number
  isRegistered: boolean
  onEdit?: () => void
  promise: string
}

const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export default function MonthlyPromise({
  budgetAmount,
  isRegistered,
  onEdit,
  promise,
}: MonthlyPromiseProps) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-[0_4px_14px_rgba(0,0,0,0.03)] max-[380px]:px-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 max-[640px]:grid-cols-[minmax(0,1fr)_auto] max-[640px]:gap-y-3">
        <div className="flex min-w-0 items-center gap-4 max-[640px]:items-start max-[380px]:gap-3">
          <p className="shrink-0 text-sm font-semibold text-(--color-dark-gray)">한 줄 다짐</p>
          <h3 className="min-w-0 break-keep text-xl leading-8 font-extrabold text-black max-[380px]:text-lg max-[380px]:leading-7">
            <span className="bg-linear-to-t from-yellow-200 from-50% to-transparent to-50% px-1 [box-decoration-break:clone]">
              {promise}
            </span>
          </h3>
        </div>
        <div className="flex justify-center items-center rounded-xl bg-gray-50 gap-5 px-4 py-3 max-[640px]:col-start-1 max-[640px]:row-start-2 max-[380px]:px-3">
          <p className="text-xs font-bold text-(--color-dark-gray)">목표 예산</p>
          <p className="text-base font-extrabold tracking-normal text-black">{formatWon(budgetAmount)}</p>
        </div>
        <button
          className={[
            'min-h-9 shrink-0 cursor-pointer rounded-lg border px-3 text-sm font-extrabold whitespace-nowrap transition max-[640px]:col-start-2 max-[640px]:row-span-2 max-[640px]:row-start-1',
            isRegistered
              ? 'border-transparent text-gray-500 hover:bg-gray-100 active:bg-gray-100'
              : 'border-transparent bg-black text-white shadow-sm hover:bg-gray-800 active:bg-black',
          ].join(' ')}
          onClick={onEdit}
          type="button"
        >
          {isRegistered ? '수정' : '등록'}
        </button>
      </div>
    </section>
  )
}
