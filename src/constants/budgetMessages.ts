export const BUDGET_MESSAGES = {
  empty: [
    '작은 기록 하나가\n나의 흐름을 보여줘요.',
    '아직 기록이 없어요.\n오늘의 첫 소비를 남겨보세요.',
    '부담 없이 하나씩,\n이번 달 기록을 시작해봐요.',
  ],
  safe: [
    '잘하고 있어요.\n지금처럼만 이어가요!',
    '예산 안에서\n나를 잘 돌보고 있어요.',
    '이번 달 소비가\n건강하게 흘러가고 있어요!',
  ],
  warning: [
    '막바지예요!\n남은 예산으로 페이스를 조절해봐요.',
    '잠시 숨을 고를 때예요.\n남은 예산을 알차게 써봐요.',
  ],
  over: [
    '이번 달은 조금 넘었어요.\n다음 달엔 더 나은 선택을!',
    '예산보다 조금 더 썼지만,\n그만큼 풍요로운 한 달이었길!',
    '지출이 앞서 나갔네요.\n괜찮아요, 다음 달이 있어요.',
  ],
} as const

export const DEFAULT_MONTHLY_PROMISE = '이번 달의 돈 관리 다짐을 등록해보세요!'

export type BudgetStatus = keyof typeof BUDGET_MESSAGES

export const getBudgetStatus = (spent: number, budget: number): BudgetStatus => {
  if (spent <= 0 && budget <= 0) {
    return 'empty'
  }

  if (budget <= 0 || spent > budget) {
    return 'over'
  }

  if (spent / budget >= 0.8) {
    return 'warning'
  }

  return 'safe'
}

export const getRandomMessage = (status: BudgetStatus) => {
  const messages = BUDGET_MESSAGES[status]

  return messages[Math.floor(Math.random() * messages.length)]
}