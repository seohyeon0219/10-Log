type ListItemProps = {
  amount: number
  color: string
  memo?: string
  title: string
  type: string
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

export default function ListItem({ amount, color, memo, title, type }: ListItemProps) {
  const isIncome = type === 'income'

  return (
    <div className="flex min-h-14 items-center justify-between gap-4 rounded-xl px-2 py-2 transition hover:bg-gray-50 active:bg-gray-100">
      <div className="flex min-w-0 items-center gap-3">
        <span className="h-3 w-3 flex-none rounded-full" style={{ backgroundColor: color }} />
        <div className="min-w-0">
          <p className="m-0 truncate text-[15px] leading-5 font-bold text-black">{title}</p>
          {memo ? (
            <p className="m-0 mt-0.5 truncate text-[13px] leading-5 font-semibold text-gray-400">
              {memo}
            </p>
          ) : null}
        </div>
      </div>

      <strong
        className={[
          'shrink-0 text-right text-[15px] leading-5 font-bold',
          isIncome ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
        ].join(' ')}
      >
        {isIncome ? '+' : '-'}
        {formatAmount(amount)}
      </strong>
    </div>
  )
}
