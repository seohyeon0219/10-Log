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
      className="grid min-h-12 w-full grid-cols-[64px_84px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-2 text-left transition hover:bg-gray-50 active:bg-gray-100 max-[380px]:grid-cols-[minmax(0,1fr)_auto] max-[380px]:gap-x-3 max-[380px]:gap-y-1"
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <span className="text-sm font-bold whitespace-nowrap text-gray-400 max-[380px]:col-start-1 max-[380px]:row-start-1">{date}</span>
      <span className="flex min-w-0 items-center gap-2 max-[380px]:col-start-1 max-[380px]:row-start-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: categoryColor }} />
        <span className="min-w-0 truncate text-sm font-extrabold text-black">{categoryName}</span>
      </span>
      <span className="min-w-0 truncate text-sm font-bold text-gray-500 max-[380px]:col-start-1 max-[380px]:row-start-3">{memo}</span>
      <strong
        className={[
          'text-right text-sm font-extrabold whitespace-nowrap max-[380px]:col-start-2 max-[380px]:row-span-3 max-[380px]:row-start-1',
          isIncome ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
        ].join(' ')}
      >
        {isIncome ? '+' : '-'}
        {formatAmount(amount)}
      </strong>
    </Component>
  )
}
