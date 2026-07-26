import Button from '../common/Button'

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
    <section className="rounded-2xl border border-gray-100 bg-(--color-glass-white) px-5 py-4 shadow-[0_4px_14px_rgba(0,0,0,0.03)] backdrop-blur-sm max-[380px]:px-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 max-[640px]:grid-cols-[minmax(0,1fr)_auto] max-[640px]:gap-y-3">
        <div className="flex min-w-0 items-center gap-4 max-[640px]:items-start max-[380px]:gap-3">
          <p className="shrink-0 text-sm font-semibold text-(--color-dark-gray) max-[640px]:mt-1">한 줄 다짐</p>
          <h3 className="min-w-0 break-keep text-xl leading-8 font-extrabold text-black max-[640px]:text-lg max-[640px]:leading-7 max-[380px]:text-lg max-[380px]:leading-7">
            <span style={{ backgroundImage: 'linear-gradient(transparent 55%, #ffe58f 55%)', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
              {promise}
            </span>
          </h3>
        </div>
        <div className="flex items-center justify-center gap-5 rounded-xl bg-gray-50 px-4 py-3 max-[640px]:col-start-1 max-[640px]:row-start-2 max-[380px]:gap-3 max-[380px]:px-3">
          <p className="text-xs font-bold text-(--color-dark-gray)">목표 예산</p>
          <p className="whitespace-nowrap text-base font-extrabold tracking-normal text-black max-[380px]:text-sm">{formatWon(budgetAmount)}</p>
        </div>
        <Button
          className="min-h-0! w-auto! shrink-0 px-3! py-1.5 text-sm! max-[640px]:col-start-2 max-[640px]:row-start-2"
          onClick={onEdit}
          variant="ghost"
        >
          {isRegistered ? '수정' : '등록'}
        </Button>
      </div>
    </section>
  )
}
