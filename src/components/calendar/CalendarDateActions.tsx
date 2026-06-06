type CalendarDateActionsProps = {
  selectedDate: Date | null
  onAddIncome?: () => void
  onAddExpense?: () => void
}

const formatDateLabel = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`

export default function CalendarDateActions({
  selectedDate,
  onAddIncome,
  onAddExpense,
}: CalendarDateActionsProps) {
  if (!selectedDate) {
    return null
  }

  return (
    <section className="mt-4 flex items-center justify-between gap-4">
      <p className="m-0 text-base font-bold text-black">{formatDateLabel(selectedDate)}</p>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="min-h-10 cursor-pointer rounded-lg border border-(--color-income-blue) px-4 text-sm font-bold text-(--color-income-blue)"
          onClick={onAddIncome}
        >
          수입
        </button>
        <button
          type="button"
          className="min-h-10 cursor-pointer rounded-lg border border-(--color-expense-red) px-4 text-sm font-bold text-(--color-expense-red)"
          onClick={onAddExpense}
        >
          지출
        </button>
      </div>
    </section>
  )
}
