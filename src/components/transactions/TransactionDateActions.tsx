type TransactionDateActionsProps = {
  selectedDate: Date | null
  onAddIncome?: () => void
  onAddExpense?: () => void
}

const formatDateLabel = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`

export default function TransactionDateActions({
  selectedDate,
  onAddIncome,
  onAddExpense,
}: TransactionDateActionsProps) {
  if (!selectedDate) {
    return null
  }

  return (
    <section className="flex items-center justify-between gap-4">
      <p className="m-0 text-base font-bold text-black">{formatDateLabel(selectedDate)}</p>

      <div className="flex shrink-0 items-center gap-2">
        <button
          className="min-h-10 cursor-pointer rounded-xl border border-blue-100/60 bg-blue-50/80 px-4 text-sm font-bold text-(--color-income-blue) transition hover:bg-blue-100/80 active:bg-blue-100"
          onClick={onAddIncome}
          type="button"
        >
          수입
        </button>
        <button
          className="min-h-10 cursor-pointer rounded-xl border border-red-100/60 bg-red-50/80 px-4 text-sm font-bold text-(--color-expense-red) transition hover:bg-red-100/80 active:bg-red-100"
          onClick={onAddExpense}
          type="button"
        >
          지출
        </button>
      </div>
    </section>
  )
}
