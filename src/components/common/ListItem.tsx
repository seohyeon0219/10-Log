type ListItemProps = {
  amount: number
  color: string
  memo?: string
  onClick?: () => void
  title: string
  type: string
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

export default function ListItem({ amount, color, memo, onClick, title, type }: ListItemProps) {
  const isIncome = type === 'income'
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      className="flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border-0 bg-transparent px-2 py-2 text-left transition interactive-row"
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
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
    </Component>
  )
}
