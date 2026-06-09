import type { FormEvent } from 'react'
import { useState } from 'react'
import {
  DAILY_REVIEW_PLACEHOLDERS,
  DAILY_REVIEW_SUCCESS_MESSAGE,
} from '../../constants/reviewMessages'
import Button from '../common/Button'
import FeedbackModal from '../common/FeedbackModal'
import ReviewCommentTextarea from './ReviewCommentTextarea'
import ReviewStarRating from './ReviewStarRating'

type ReviewTransaction = {
  amount: number
  categoryColor: string
  categoryName: string
  id: string
  memo: string
  type: 'expense' | 'income'
}

type DailyReviewFormProps = {
  initialReview?: {
    goodComment: string
    goodTransactionId: string | null
    regretComment: string
    regretTransactionId: string | null
    satisfactionRating: number
  } | null
  onSave?: (values: {
    goodComment: string
    goodTransactionId: string | null
    regretComment: string
    regretTransactionId: string | null
    satisfactionRating: number
  }) => Promise<void> | void
  transactions: ReviewTransaction[]
}

type TransactionSelectFieldProps = {
  emptyText: string
  onSelect: (transactionId: string) => void
  selectedTransactionId: string
  title: string
  transactions: ReviewTransaction[]
}

const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export default function DailyReviewForm({
  initialReview,
  onSave,
  transactions,
}: DailyReviewFormProps) {
  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense')
  const [goodSpendId, setGoodSpendId] = useState(initialReview?.goodTransactionId ?? '')
  const [regretSpendId, setRegretSpendId] = useState(initialReview?.regretTransactionId ?? '')
  const [goodSpendComment, setGoodSpendComment] = useState(initialReview?.goodComment ?? '')
  const [regretSpendComment, setRegretSpendComment] = useState(initialReview?.regretComment ?? '')
  const [satisfactionRating, setSatisfactionRating] = useState(initialReview?.satisfactionRating ?? 5)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSaving(true)

    try {
      await onSave?.({
        goodComment: goodSpendComment.trim(),
        goodTransactionId: goodSpendId || null,
        regretComment: regretSpendComment.trim(),
        regretTransactionId: regretSpendId || null,
        satisfactionRating,
      })
      setIsSuccessOpen(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '회고를 저장하지 못했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <form
        className="rounded-xl border border-stone-200/70 bg-[linear-gradient(135deg,#fafaf9_0%,#fffbeb_56%,#f5f5f4_100%)] p-3 shadow-[0_8px_24px_rgba(120,113,108,0.09)]"
        onSubmit={handleSubmit}
      >
        <div className="rounded-lg border border-white/80 bg-white/70 p-5 max-[380px]:p-4">
          <div>
            <p className="text-sm font-extrabold text-stone-500">일일 회고 폼</p>
            <h3 className="mt-1 break-keep text-2xl leading-8 font-black text-stone-950 max-[420px]:text-xl">
              오늘의 소비를 가볍게 돌아봐요
            </h3>
            <p className="mt-2 break-keep text-sm leading-6 font-bold text-stone-500">
              거래는 한 번 탭해서 고르고, 코멘트는 남기고 싶을 때만 적어도 괜찮아요.
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <ReviewSpendSection
              comment={goodSpendComment}
              emptyText="오늘 지출 거래가 있으면 잘한 소비를 고를 수 있어요."
              onChangeComment={setGoodSpendComment}
              onSelectTransaction={setGoodSpendId}
              placeholder={DAILY_REVIEW_PLACEHOLDERS.goodSpend}
              selectedTransactionId={goodSpendId}
              title="오늘 잘한 소비는 무엇인가요"
              transactions={expenseTransactions}
            />

            <ReviewSpendSection
              comment={regretSpendComment}
              emptyText="오늘 지출 거래가 있으면 후회 소비를 고를 수 있어요."
              onChangeComment={setRegretSpendComment}
              onSelectTransaction={setRegretSpendId}
              placeholder={DAILY_REVIEW_PLACEHOLDERS.regretSpend}
              selectedTransactionId={regretSpendId}
              title="오늘 후회되는 소비는 무엇인가요?"
              transactions={expenseTransactions}
            />
          </div>

          <div className="mt-4 rounded-xl border border-stone-200/80 bg-stone-50/70 p-4">
            <ReviewStarRating
              label="오늘 소비 만족도"
              onChange={setSatisfactionRating}
              value={satisfactionRating}
            />
          </div>

          <div className="mt-5">
            <Button disabled={isSaving} type="submit">
              {isSaving ? '저장 중...' : initialReview ? '회고 수정하기' : '회고 제출하기'}
            </Button>
          </div>

          {errorMessage ? (
            <p className="mt-3 text-sm font-bold text-(--color-expense-red)" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </form>

      <FeedbackModal
        description={DAILY_REVIEW_SUCCESS_MESSAGE.description}
        icon="★"
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title={DAILY_REVIEW_SUCCESS_MESSAGE.title}
      />
    </>
  )
}

type ReviewSpendSectionProps = {
  comment: string
  emptyText: string
  onChangeComment: (comment: string) => void
  onSelectTransaction: (transactionId: string) => void
  placeholder: string
  selectedTransactionId: string
  title: string
  transactions: ReviewTransaction[]
}

function ReviewSpendSection({
  comment,
  emptyText,
  onChangeComment,
  onSelectTransaction,
  placeholder,
  selectedTransactionId,
  title,
  transactions,
}: ReviewSpendSectionProps) {
  return (
    <section className="rounded-xl border border-stone-200/80 bg-white/82 p-4">
      <h4 className="break-keep text-base leading-6 font-black text-stone-950">{title}</h4>

      <TransactionSelectField
        emptyText={emptyText}
        onSelect={onSelectTransaction}
        selectedTransactionId={selectedTransactionId}
        title="거래내역 선택"
        transactions={transactions}
      />

      {selectedTransactionId ? (
        <div className="mt-4">
          <ReviewCommentTextarea
            onChange={onChangeComment}
            placeholder={placeholder}
            value={comment}
          />
        </div>
      ) : null}
    </section>
  )
}

function TransactionSelectField({
  emptyText,
  onSelect,
  selectedTransactionId,
  title,
  transactions,
}: TransactionSelectFieldProps) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-bold text-stone-500">{title}</p>
      {transactions.length > 0 ? (
        <div className="grid max-h-44 gap-2 overflow-y-auto overscroll-contain pr-1">
          {transactions.map((transaction) => {
            const isSelected = selectedTransactionId === transaction.id

            return (
              <button
                aria-pressed={isSelected}
                className={[
                  'flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition',
                  isSelected
                    ? 'border-amber-100 bg-amber-50 text-stone-950 shadow-[0_0_0_3px_rgba(253,230,138,0.24)]'
                    : 'border-stone-200 bg-stone-50/70 text-stone-900 hover:bg-white',
                ].join(' ')}
                key={transaction.id}
                onClick={() => onSelect(transaction.id)}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: transaction.categoryColor }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black">{transaction.categoryName}</span>
                    <span
                      className={[
                        'block truncate text-xs font-bold',
                        isSelected ? 'text-stone-500' : 'text-stone-400',
                      ].join(' ')}
                    >
                      {transaction.memo}
                    </span>
                  </span>
                </span>
                <strong className="shrink-0 text-sm font-black">
                  {formatWon(transaction.amount)}
                </strong>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/70 px-4 py-5 text-sm leading-6 font-bold text-stone-500">
          {emptyText}
        </div>
      )}
    </div>
  )
}
