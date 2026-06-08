type ReviewTransaction = {
  amount: number
  id: string
  type: 'expense' | 'income'
}

type MiniSummaryCardProps = {
  transactions: ReviewTransaction[]
}

const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export default function MiniSummaryCard({ transactions }: MiniSummaryCardProps) {
  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense')
  const incomeTransactions = transactions.filter((transaction) => transaction.type === 'income')
  const spentAmount = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const incomeAmount = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

  return (
    <section className="rounded-xl border border-stone-200/70 bg-[linear-gradient(135deg,#fafaf9_0%,#fffbeb_54%,#f5f5f4_100%)] p-5 shadow-[0_8px_24px_rgba(120,113,108,0.09)] max-[380px]:p-4">
      <div className="flex items-start justify-between gap-4 max-[520px]:grid">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-stone-500">오늘 쓴 금액</p>
          <p className="mt-2 truncate text-[34px] leading-10 font-black text-stone-950 max-[420px]:text-3xl max-[360px]:text-2xl">
            {formatWon(spentAmount)}
          </p>
          <p className="mt-2 break-keep text-sm leading-6 font-bold text-stone-500">
            오늘은 지출 {expenseTransactions.length}건을 기록했어요.
          </p>
        </div>

      </div>
    </section>
  )
}
