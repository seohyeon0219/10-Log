import { useState } from 'react'
import CalendarGrid from '../../components/calendar/CalendarGrid'
import CategoryManageBottomSheet from '../../components/categories/CategoryManageBottomSheet'
import CategoryManageModal from '../../components/categories/CategoryManageModal'
import Button from '../../components/common/Button'
import Checkbox from '../../components/common/Checkbox'
import ConfirmModal from '../../components/common/ConfirmModal'
import ListItem from '../../components/common/ListItem'
import Tabs from '../../components/common/Tabs'
import Textarea from '../../components/common/Textarea'
import UnderInput from '../../components/common/UnderInput'
import Header from '../../components/navigation/DesktopHeader'
import MonthlyPromiseBottomSheet from '../../components/calendar/MonthlyPromiseBottomSheet'
import MonthlyPromiseModal from '../../components/calendar/MonthlyPromiseModal'
import CategoryChangeRanking from '../../components/statistics/CategoryChangeRanking'
import CategoryTransactionRatio from '../../components/statistics/CategoryTransactionRatio'
import PreviousMonthComparison from '../../components/statistics/PreviousMonthComparison'
import MonthlyMoneySummary from '../../components/statistics/monthlymoneysummary'
import SpendngTransactionLineChart from '../../components/statistics/spendngTransactionLineChart'
import AiMonthlyReview from '../../components/review/AiMonthlyReview'
import AmountInput from '../../components/transactions/AmountInput'
import TransactionFormModal from '../../components/transactions/TransactionFormModal'
import TransactionDateActions from '../../components/transactions/TransactionDateActions'
import TransactionFormBottomSheet from '../../components/transactions/bottomSheet/TransactionFormBottomSheet'
import TransactionListBottomSheet from '../../components/transactions/bottomSheet/TransactionListBottomSheet'
import {
  getMockCalendarDayAmounts,
  getMockTransactions,
  mockCategoryChangeRanking,
  mockCategoryTransactionRatio,
  mockExpenseCategories,
  mockIncomeCategories,
  mockMonthlyMoneySummary,
  mockMonthlyPromise,
  mockPreviousMonthComparison,
  mockSpendingTransactionLineChart,
  mockTransactions,
} from '../../mocks/data'

const tabs = [
  { id: 'stats', label: '통계' },
  { id: 'review', label: '회고' },
  { id: 'categories', label: '카테고리' },
]

type TransactionType = 'income' | 'expense'

type SelectedStatisticsTransaction = {
  amount: number
  categoryId: string
  date: string
  id: string
  memo: string
  type: TransactionType
}

const getDateKey = (date: Date, day: number) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dateOfMonth = String(day).padStart(2, '0')

  return `${year}-${month}-${dateOfMonth}`
}

export default function TestPage() {
  const [activeTabId, setActiveTabId] = useState(tabs[0].id)
  const [currentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTransactionFormBottomSheetOpen, setIsTransactionFormBottomSheetOpen] = useState(false)
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [isTransactionListOpen, setIsTransactionListOpen] = useState(false)
  const [isCategoryManageOpen, setIsCategoryManageOpen] = useState(false)
  const [isCategoryManageBottomSheetOpen, setIsCategoryManageBottomSheetOpen] = useState(false)
  const [isMonthlyPromiseModalOpen, setIsMonthlyPromiseModalOpen] = useState(false)
  const [isMonthlyPromiseBottomSheetOpen, setIsMonthlyPromiseBottomSheetOpen] = useState(false)
  const [selectedStatisticsTransaction, setSelectedStatisticsTransaction] = useState<SelectedStatisticsTransaction | null>(null)
  const [ratioType, setRatioType] = useState<TransactionType>('expense')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [monthlyPromise, setMonthlyPromise] = useState(mockMonthlyPromise)
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const selectedDateKey = selectedDate ? getDateKey(selectedDate, selectedDate.getDate()) : ''
  const selectedDateTransactions = getMockTransactions(currentDate).filter(
    (transaction) => transaction.date === selectedDateKey,
  )
  const deleteMonthlyPromise = () => {
    setMonthlyPromise((promise) => ({
      ...promise,
      isRegistered: false,
    }))
  }
  const updateMonthlyPromise = (values: { budgetAmount: number; promise: string }) => {
    setMonthlyPromise((promise) => ({
      ...promise,
      ...values,
      isRegistered: true,
    }))
  }

  const openTransactionForm = (type: TransactionType) => {
    setTransactionType(type)
    setSelectedDate((date) => date ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    setIsTransactionFormOpen(true)
  }

  const openTransactionFormBottomSheet = (type: TransactionType) => {
    setTransactionType(type)
    setSelectedDate((date) => date ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    setIsTransactionFormBottomSheetOpen(true)
  }

  const handleDateSelect = (date: Date) => {
    const dateKey = getDateKey(date, date.getDate())

    setSelectedDate((currentSelectedDate) => {
      if (currentSelectedDate && getDateKey(currentSelectedDate, currentSelectedDate.getDate()) === dateKey) {
        return null
      }

      return date
    })
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-8xl px-4 py-6 md:px-6">
      <section className="mb-6">
        <p className="text-(--color-gray)">일공로그 공통 컴포넌트</p>
        <h1 className="mt-2 text-3xl font-extrabold">Component Test Page</h1>
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">Header / Calendar</h2>
        <Header />
        <CalendarGrid
          currentDate={currentDate}
          dayAmounts={getMockCalendarDayAmounts(currentDate)}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
        <TransactionDateActions
          onAddExpense={() => openTransactionForm('expense')}
          onAddIncome={() => openTransactionForm('income')}
          selectedDate={selectedDate}
        />
        {selectedDate ? (
          <div className="mt-3 grid gap-1 border-t border-gray-100 pt-2">
            {selectedDateTransactions.map((transaction) => (
              <ListItem
                amount={transaction.amount}
                color={transaction.categoryColor}
                key={transaction.id}
                memo={transaction.memo}
                title={transaction.categoryName}
                type={transaction.type}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">Button</h2>
        <div className="flex flex-wrap gap-3">
          <Button>검정 버튼</Button>
          <Button variant="secondary">흰색 버튼</Button>
          <Button variant="ghost">고스트 버튼</Button>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">Input</h2>
        <div className="grid gap-4">
          <AmountInput label="금액" placeholder="숫자만 입력돼요" />
          <UnderInput inputMode="numeric" label="밑줄 금액 입력" placeholder="12000" />
          <Textarea label="오늘 소비에 대한 한줄평" placeholder="오늘 소비를 돌아보며 기록해보세요." />
          <Checkbox name="fixed-transaction">고정 수입/지출로 등록</Checkbox>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">ListItem</h2>
        <div className="grid gap-1">
          {mockTransactions.map((transaction) => (
            <ListItem
              amount={transaction.amount}
              color={transaction.categoryColor}
              key={transaction.id}
              memo={transaction.memo}
              title={transaction.categoryName}
              type={transaction.type}
            />
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">Tabs</h2>
        <Tabs activeTabId={activeTabId} onChange={setActiveTabId} tabs={tabs} />
        <p className="text-(--color-gray)">현재 선택된 탭: {activeTabId}</p>
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-gray-50 p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">Statistics</h2>
        <div className="grid gap-4">
          <MonthlyMoneySummary {...mockMonthlyMoneySummary} budgetAmount={monthlyPromise.budgetAmount} />
          <PreviousMonthComparison items={mockPreviousMonthComparison} />
          <CategoryChangeRanking items={mockCategoryChangeRanking} />
          <CategoryTransactionRatio
            items={mockCategoryTransactionRatio}
            onRatioTypeChange={setRatioType}
            onSelectTransaction={setSelectedStatisticsTransaction}
            onSelectedCategoryIdChange={setSelectedCategoryId}
            ratioType={ratioType}
            selectedCategoryId={selectedCategoryId}
          />
          <SpendngTransactionLineChart data={mockSpendingTransactionLineChart} />
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">Review</h2>
        <AiMonthlyReview monthLabel="6월" />
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">ConfirmModal / TransactionBottomSheet</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setIsModalOpen(true)}>확인 모달 열기</Button>
          <Button onClick={() => setIsCategoryManageOpen(true)} variant="secondary">
            카테고리 관리 모달 열기
          </Button>
          <Button onClick={() => setIsCategoryManageBottomSheetOpen(true)} variant="secondary">
            카테고리 관리 바텀시트 열기
          </Button>
          <Button onClick={() => setIsMonthlyPromiseBottomSheetOpen(true)} variant="secondary">
            월간 다짐 바텀시트 열기
          </Button>
          <Button onClick={() => openTransactionForm('income')} variant="secondary">
            수입 입력 모달 열기
          </Button>
          <Button onClick={() => openTransactionForm('expense')} variant="secondary">
            지출 입력 모달 열기
          </Button>
          <Button onClick={() => openTransactionFormBottomSheet('income')} variant="secondary">
            수입 입력 바텀시트 열기
          </Button>
          <Button onClick={() => openTransactionFormBottomSheet('expense')} variant="secondary">
            지출 입력 바텀시트 열기
          </Button>
          <Button
            onClick={() => {
              setSelectedDate((date) => date ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
              setIsTransactionListOpen(true)
            }}
            variant="secondary"
          >
            거래 목록 바텀시트 열기
          </Button>
        </div>
      </section>

      <ConfirmModal
        cancelText="닫기"
        confirmText="로그아웃"
        description="로그아웃하면 현재 작성 중인 내용은 저장되지 않을 수 있어요."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
        title="정말 로그아웃하시겠어요?"
      />

      <CategoryManageModal
        expenseCategories={mockExpenseCategories}
        incomeCategories={mockIncomeCategories}
        isOpen={isCategoryManageOpen}
        onClose={() => setIsCategoryManageOpen(false)}
      />

      <CategoryManageBottomSheet
        expenseCategories={mockExpenseCategories}
        incomeCategories={mockIncomeCategories}
        isOpen={isCategoryManageBottomSheetOpen}
        onClose={() => setIsCategoryManageBottomSheetOpen(false)}
      />

      {isMonthlyPromiseModalOpen ? (
        <MonthlyPromiseModal
          budgetAmount={monthlyPromise.budgetAmount}
          isRegistered={monthlyPromise.isRegistered}
          isOpen={isMonthlyPromiseModalOpen}
          onClose={() => setIsMonthlyPromiseModalOpen(false)}
          onDelete={deleteMonthlyPromise}
          onSave={(values) => {
            updateMonthlyPromise(values)
            setIsMonthlyPromiseModalOpen(false)
          }}
          promise={monthlyPromise.promise}
        />
      ) : null}

      <MonthlyPromiseBottomSheet
        budgetAmount={monthlyPromise.budgetAmount}
        isRegistered={monthlyPromise.isRegistered}
        isOpen={isMonthlyPromiseBottomSheetOpen}
        onClose={() => setIsMonthlyPromiseBottomSheetOpen(false)}
        onDelete={deleteMonthlyPromise}
        onSave={(values) => {
          updateMonthlyPromise(values)
          setIsMonthlyPromiseBottomSheetOpen(false)
        }}
        promise={monthlyPromise.promise}
      />

      <TransactionListBottomSheet
        isOpen={isTransactionListOpen}
        onAddExpense={() => openTransactionForm('expense')}
        onAddIncome={() => openTransactionForm('income')}
        onClose={() => setIsTransactionListOpen(false)}
        selectedDate={selectedDate}
        transactions={selectedDateTransactions}
      />

      <TransactionFormModal
        categories={transactionType === 'income' ? mockIncomeCategories : mockExpenseCategories}
        expenseCategories={mockExpenseCategories}
        incomeCategories={mockIncomeCategories}
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onDelete={() => setIsTransactionFormOpen(false)}
        onSave={() => setIsTransactionFormOpen(false)}
        selectedDate={selectedDate}
        type={transactionType}
      />

      {selectedStatisticsTransaction ? (
        <TransactionFormModal
          categories={
            selectedStatisticsTransaction.type === 'income' ? mockIncomeCategories : mockExpenseCategories
          }
          expenseCategories={mockExpenseCategories}
          incomeCategories={mockIncomeCategories}
          initialAmount={selectedStatisticsTransaction.amount}
          initialCategoryId={selectedStatisticsTransaction.categoryId}
          initialMemo={selectedStatisticsTransaction.memo}
          isOpen={Boolean(selectedStatisticsTransaction)}
          mode="edit"
          onClose={() => setSelectedStatisticsTransaction(null)}
          onDelete={() => setSelectedStatisticsTransaction(null)}
          onSave={() => setSelectedStatisticsTransaction(null)}
          selectedDate={new Date(`2026/${selectedStatisticsTransaction.date.replace('/', '/')}`)}
          type={selectedStatisticsTransaction.type}
        />
      ) : null}

      <TransactionFormBottomSheet
        categories={transactionType === 'income' ? mockIncomeCategories : mockExpenseCategories}
        expenseCategories={mockExpenseCategories}
        incomeCategories={mockIncomeCategories}
        isOpen={isTransactionFormBottomSheetOpen}
        onClose={() => setIsTransactionFormBottomSheetOpen(false)}
        onDelete={() => setIsTransactionFormBottomSheetOpen(false)}
        onSave={() => setIsTransactionFormBottomSheetOpen(false)}
        selectedDate={selectedDate}
        type={transactionType}
      />
    </main>
  )
}
