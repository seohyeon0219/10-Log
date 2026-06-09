type SimpleListItemProps = {
  amount: number
  categoryColor: string
  categoryName: string
  date: string
  memo?: string
  onClick?: () => void
  type: 'income' | 'expense'
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

export default function SimpleListItem({
  amount,
  categoryColor,
  categoryName,
  date,
  memo,
  onClick,
  type,
}: SimpleListItemProps) {
  const isIncome = type === 'income'
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      className="flex min-h-12 w-full items-center gap-3 rounded-lg border-0 bg-transparent px-2 py-2 text-left transition hover:bg-gray-50 active:bg-gray-100"
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: categoryColor }}
      />

      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate text-sm font-extrabold text-black">{categoryName}</span>
        <span className="flex min-w-0 gap-2 text-xs">
          <span className="shrink-0 font-bold whitespace-nowrap text-gray-400">{date}</span>
          {memo ? (
            <span className="min-w-0 truncate font-bold text-gray-400">{memo}</span>
          ) : null}
        </span>
      </span>

      <strong
        className={[
          'shrink-0 text-sm font-extrabold whitespace-nowrap',
          isIncome ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
        ].join(' ')}
      >
        {isIncome ? '+' : '-'}
        {formatAmount(amount)}
      </strong>
    </Component>
  )
}
