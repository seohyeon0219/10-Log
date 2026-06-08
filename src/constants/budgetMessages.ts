export const BUDGET_MESSAGES = {
  empty: [
    '이번 달 소비 기록을 시작해볼까요? 작은 기록 하나가 나의 흐름을 보여줘요.',
    '아직 기록된 소비가 없어요. 오늘의 첫 소비를 가볍게 남겨보세요.',
    '이번 달의 돈 흐름은 이제부터 시작이에요. 부담 없이 하나씩 기록해봐요.',
  ],
  safe: [
    '이번 달은 아주 단단하게 보내고 있네요! 지금처럼만 해요.',
    '예산이라는 든든한 울타리 안에서 나를 잘 돌보고 있어요.',
    '잘하고 있어요. 이번 달 나의 소비가 참 건강하게 흘러가고 있네요.',
  ],
  warning: [
    '마라톤의 막바지예요! 마지막까지 페이스 조절을 해볼까요?',
    '잠시 숨을 고를 때예요. 남은 예산으로 어떤 소비가 가장 기쁨을 줄지 생각해봐요.',
  ],
  over: [
    '이번 달은 경험에 조금 더 투자했네요. 이 경험이 다음 달의 더 나은 선택을 만들 거예요.',
    '예산보다 조금 더 썼지만, 그만큼 풍요로운 한 달이었길 바라요.',
    '지출이 조금 앞서 나갔네요. 괜찮아요, 우리에겐 매달 새로운 1일이 오니까요!',
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