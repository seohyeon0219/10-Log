import { DEFAULT_MONTHLY_PROMISE } from '../constants/budgetMessages'

export const mockMonthlySummary = {
  expense: 3200,
  fixedExpense: 456,
  fixedIncome: 120000,
  income: 54124,
}

export const mockMonthlyPromise = {
  budgetAmount: 200000,
  isRegistered: false,
  monthLabel: '이번 달',
  promise: DEFAULT_MONTHLY_PROMISE,
}

export const mockMonthlyMoneySummary = {
  budgetAmount: 200000,
  remainingDays: 10,
  spentAmount: 120000,
}

export const mockPreviousMonthComparison = [
  {
    id: 'income',
    label: '수입',
    rate: 5,
    details: [
      { label: '수입', value: 54124 },
      { label: '고정수입', value: 120000 },
      { label: '총수입', value: 174124, isEmphasized: true },
    ],
  },
  {
    id: 'expense',
    label: '지출',
    rate: -12,
    details: [
      { label: '지출', value: 3200 },
      { label: '고정지출', value: 456 },
      { label: '총지출', value: 3656, isEmphasized: true },
    ],
  },
  {
    id: 'balance',
    label: '잔액',
    rate: 18,
    details: [
      { label: '총수입', value: 174124 },
      { label: '총지출', value: 3656 },
      { label: '잔액', value: 170468, isEmphasized: true },
    ],
  },
]

export const mockCategoryChangeRanking = {
  expense: [
    { id: 'food', label: '식비', rate: -20 },
    { id: 'transport', label: '교통', rate: -15 },
    { id: 'shopping', label: '쇼핑', rate: 35 },
  ],
  income: [
    { id: 'salary', label: '급여', rate: 5 },
    { id: 'side-job', label: '부수입', rate: 28 },
    { id: 'allowance', label: '용돈', rate: -10 },
  ],
}

export const mockCategoryTransactionRatio = {
  expense: [
    {
      id: 'food',
      label: '식비',
      amount: 48000,
      color: '#f05650',
      transactions: [
        { id: 'food-1', date: '6/3', memo: '점심', amount: 12000 },
        { id: 'food-2', date: '6/5', memo: '카페', amount: 5500 },
        { id: 'food-3', date: '6/8', memo: '저녁', amount: 18000 },
      ],
    },
    {
      id: 'shopping',
      label: '쇼핑',
      amount: 30000,
      color: '#ab47bc',
      transactions: [
        { id: 'shopping-1', date: '6/7', memo: '생활용품', amount: 16000 },
        { id: 'shopping-2', date: '6/14', memo: '티셔츠', amount: 14000 },
      ],
    },
    {
      id: 'transport',
      label: '교통',
      amount: 18000,
      color: '#007fff',
      transactions: [
        { id: 'transport-1', date: '6/2', memo: '지하철', amount: 3200 },
        { id: 'transport-2', date: '6/9', memo: '택시', amount: 14800 },
      ],
    },
    {
      id: 'culture',
      label: '문화',
      amount: 12000,
      color: '#00a878',
      transactions: [{ id: 'culture-1', date: '6/11', memo: '영화', amount: 12000 }],
    },
    {
      id: 'etc',
      label: '기타',
      amount: 12000,
      color: '#898989',
      transactions: [{ id: 'etc-1', date: '6/16', memo: '소모품', amount: 12000 }],
    },
  ],
  income: [
    {
      id: 'salary',
      label: '급여',
      amount: 2400000,
      color: '#1863dc',
      transactions: [{ id: 'salary-1', date: '6/25', memo: '월급', amount: 2400000 }],
    },
    {
      id: 'side-job',
      label: '부수입',
      amount: 300000,
      color: '#4c8df6',
      transactions: [{ id: 'side-job-1', date: '6/12', memo: '외주 정산', amount: 300000 }],
    },
    {
      id: 'allowance',
      label: '용돈',
      amount: 100000,
      color: '#69a7ff',
      transactions: [{ id: 'allowance-1', date: '6/1', memo: '용돈', amount: 100000 }],
    },
  ],
}

export const mockSpendingTransactionLineChart = {
  expense: [
    { month: '1월', amount: 180000 },
    { month: '2월', amount: 210000 },
    { month: '3월', amount: 160000 },
    { month: '4월', amount: 240000 },
    { month: '5월', amount: 190000 },
    { month: '6월', amount: 120000 },
  ],
  income: [
    { month: '1월', amount: 2500000 },
    { month: '2월', amount: 2500000 },
    { month: '3월', amount: 2600000 },
    { month: '4월', amount: 2550000 },
    { month: '5월', amount: 2650000 },
    { month: '6월', amount: 2800000 },
  ],
}

export const mockReviewLookback = {
  goodSpends: [
    {
      id: 'good-food',
      category: '식비',
      memo: '친구와의 약속',
    },
    {
      id: 'good-learning',
      category: '자기계발',
      memo: '강의 결제',
    },
    {
      id: 'good-living',
      category: '생활용품',
      memo: '꼭 필요했던 구매',
    },
    {
      id: 'good-culture',
      category: '문화',
      memo: '전시를 보며 기분 전환',
    },
    {
      id: 'good-health',
      category: '건강',
      memo: '미뤄둔 운동 등록',
    },
  ],
  regretSpends: [
    {
      id: 'regret-coffee',
      category: '카페',
      memo: '습관처럼 산 커피',
    },
    {
      id: 'regret-delivery',
      category: '배달',
      memo: '늦은 저녁 주문',
    },
    {
      id: 'regret-shopping',
      category: '쇼핑',
      memo: '계획에 없던 구매',
    },
    {
      id: 'regret-snack',
      category: '간식',
      memo: '배고프지 않았는데 산 간식',
    },
    {
      id: 'regret-taxi',
      category: '교통',
      memo: '조금만 일찍 나왔으면 줄였을 택시비',
    },
  ],
  weeklyNote: '이번 주는 식비를 줄이는 대신\n취미에 투자하며 만족도가 높아졌어요.\n\n꽤나 전략적인 일주일이었네요.',
}

export const mockNavTabs = [
  { id: 'calendar', label: '캘린더' },
  { id: 'stats', label: '통계' },
  { id: 'review', label: '회고' },
  { id: 'more', label: '더보기' },
]

const getDateKey = (date: Date, day: number) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dateOfMonth = String(day).padStart(2, '0')

  return `${year}-${month}-${dateOfMonth}`
}

type MockTransaction = {
  amount: number
  categoryColor: string
  categoryName: string
  day: number
  id: string
  memo: string
  type: 'expense' | 'income'
}

export const mockTransactions: MockTransaction[] = [
  {
    id: 'transaction-1',
    amount: 12800,
    categoryColor: '#f05650',
    categoryName: '식비',
    day: 3,
    memo: '점심 식사',
    type: 'expense',
  },
  {
    id: 'transaction-2',
    amount: 54124,
    categoryColor: '#1863dc',
    categoryName: '급여',
    day: 12,
    memo: '추가 정산',
    type: 'income',
  },
  {
    id: 'transaction-3',
    amount: 3200,
    categoryColor: '#007fff',
    categoryName: '교통',
    day: 12,
    memo: '지하철',
    type: 'expense',
  },
  {
    id: 'transaction-5',
    amount: 34000,
    categoryColor: '#00a878',
    categoryName: '문화',
    day: 8,
    memo: '전시 티켓',
    type: 'expense',
  },
  {
    id: 'transaction-6',
    amount: 12000,
    categoryColor: '#f05650',
    categoryName: '식비',
    day: 8,
    memo: '점심 식사',
    type: 'expense',
  },
  {
    id: 'transaction-7',
    amount: 80000,
    categoryColor: '#4c8df6',
    categoryName: '부수입',
    day: 8,
    memo: '작업 정산',
    type: 'income',
  },
  {
    id: 'transaction-8',
    amount: 4500,
    categoryColor: '#ffb74d',
    categoryName: '카페',
    day: 8,
    memo: '아침 라떼',
    type: 'expense',
  },
  {
    id: 'transaction-9',
    amount: 3200,
    categoryColor: '#007fff',
    categoryName: '교통',
    day: 8,
    memo: '버스',
    type: 'expense',
  },
  {
    id: 'transaction-10',
    amount: 18500,
    categoryColor: '#ab47bc',
    categoryName: '쇼핑',
    day: 8,
    memo: '생활용품',
    type: 'expense',
  },
  {
    id: 'transaction-11',
    amount: 9000,
    categoryColor: '#f05650',
    categoryName: '식비',
    day: 8,
    memo: '저녁 김밥',
    type: 'expense',
  },
  {
    id: 'transaction-12',
    amount: 7000,
    categoryColor: '#898989',
    categoryName: '기타',
    day: 8,
    memo: '문구류',
    type: 'expense',
  },
  {
    id: 'transaction-13',
    amount: 25000,
    categoryColor: '#00a878',
    categoryName: '문화',
    day: 8,
    memo: '독립서점 책',
    type: 'expense',
  },
  {
    id: 'transaction-14',
    amount: 35000,
    categoryColor: '#69a7ff',
    categoryName: '용돈',
    day: 8,
    memo: '가족 정산',
    type: 'income',
  },
  {
    id: 'transaction-4',
    amount: 6800,
    categoryColor: '#ffb74d',
    categoryName: '카페',
    day: 25,
    memo: '오후 커피',
    type: 'expense',
  },
]

export const getMockTransactions = (currentDate: Date) =>
  mockTransactions.map((transaction) => ({
    ...transaction,
    date: getDateKey(currentDate, transaction.day),
  }))

export const getMockTodayTransactions = (currentDate: Date) => {
  const todayKey = getDateKey(currentDate, currentDate.getDate())

  return getMockTransactions(currentDate).filter((transaction) => transaction.date === todayKey)
}

export const getMockCalendarDayAmounts = (currentDate: Date) =>
  getMockTransactions(currentDate).reduce<
    Array<{ date: string; expense?: number; income?: number }>
  >((dayAmounts, transaction) => {
    const dayAmount = dayAmounts.find((amount) => amount.date === transaction.date)

    if (!dayAmount) {
      dayAmounts.push({
        date: transaction.date,
        [transaction.type]: transaction.amount,
      })

      return dayAmounts
    }

    if (transaction.type === 'income') {
      dayAmount.income = (dayAmount.income ?? 0) + transaction.amount
    }

    if (transaction.type === 'expense') {
      dayAmount.expense = (dayAmount.expense ?? 0) + transaction.amount
    }

    return dayAmounts
  }, [])

export const mockIncomeCategories = [
  { id: 'salary', name: '급여', color: '#1863dc' },
  { id: 'side-job', name: '부수입', color: '#4c8df6' },
  { id: 'allowance', name: '용돈', color: '#69a7ff' },
]

export const mockExpenseCategories = [
  { id: 'food', name: '식비', color: '#f05650' },
  { id: 'coffee', name: '카페', color: '#ffb74d' },
  { id: 'transport', name: '교통', color: '#007fff' },
  { id: 'shopping', name: '쇼핑', color: '#ab47bc' },
  { id: 'culture', name: '문화', color: '#00a878' },
  { id: 'etc', name: '기타', color: '#898989' },
]
