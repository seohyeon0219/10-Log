import { useState } from 'react'
import CalendarDateActions from '../../components/calendar/CalendarDateActions'
import CalendarGrid from '../../components/calendar/CalendarGrid'
import CalendarMonthHeader from '../../components/calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../../components/calendar/CalendarMonthlySummary'
import Button from '../../components/common/Button'
import Checkbox from '../../components/common/Checkbox'
import ConfirmModal from '../../components/common/ConfirmModal'
import Tabs from '../../components/common/Tabs'
import Textarea from '../../components/common/Textarea'
import UnderInput from '../../components/common/UnderInput'
import DesktopSidePanel from '../../components/sidePanel/DesktopSidePanel'
import AmountInput from '../../components/transactions/AmountInput'
import TransactionFormModal from '../../components/transactions/TransactionFormModal'
import TransactionFormBottomSheet from '../../components/transactions/bottomSheet/TransactionFormBottomSheet'
import TransactionListBottomSheet from '../../components/transactions/bottomSheet/TransactionListBottomSheet'
import { mockExpenseCategories, mockIncomeCategories, mockTransactions } from '../../mocks/data'

const tabs = [
  { id: 'stats', label: '통계' },
  { id: 'review', label: '회고' },
  { id: 'categories', label: '카테고리' },
]

type TransactionType = 'income' | 'expense'

const getDateKey = (date: Date, day: number) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dateOfMonth = String(day).padStart(2, '0')

  return `${year}-${month}-${dateOfMonth}`
}

export default function TestPage() {
  const [activeTabId, setActiveTabId] = useState(tabs[0].id)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTransactionFormBottomSheetOpen, setIsTransactionFormBottomSheetOpen] = useState(false)
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [isTransactionListOpen, setIsTransactionListOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')

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

  const handlePrevMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-8xl px-4 py-6 md:px-6">
      <section className="mb-6">
        <p className="text-(--color-gray)">일공로그 공통 컴포넌트</p>
        <h1 className="mt-2 text-3xl font-extrabold">Component Test Page</h1>
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">CalendarMonthHeader</h2>
        <CalendarMonthHeader
          currentDate={currentDate}
          onNextMonth={handleNextMonth}
          onPrevMonth={handlePrevMonth}
        />
        <CalendarMonthlySummary
          expense={3200}
          fixedExpense={456}
          fixedIncome={120000}
          income={54124}
        />
        <CalendarGrid
          currentDate={currentDate}
          dayAmounts={[
            { date: getDateKey(currentDate, 3), expense: 12800 },
            { date: getDateKey(currentDate, 7), income: 54124 },
            { date: getDateKey(currentDate, 12), expense: 3200, income: 120000 },
            { date: getDateKey(currentDate, 18), expense: 456 },
            { date: getDateKey(currentDate, 25), income: 30000, expense: 6800 },
          ]}
          onDateSelect={setSelectedDate}
        />
        <CalendarDateActions
          onAddExpense={() => openTransactionForm('expense')}
          onAddIncome={() => openTransactionForm('income')}
          selectedDate={selectedDate}
        />
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">DesktopSidePanel</h2>
        <DesktopSidePanel />
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
        <h2 className="mb-4 text-base font-bold">Tabs</h2>
        <Tabs activeTabId={activeTabId} onChange={setActiveTabId} tabs={tabs} />
        <p className="text-(--color-gray)">현재 선택된 탭: {activeTabId}</p>
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">ConfirmModal / TransactionBottomSheet</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setIsModalOpen(true)}>확인 모달 열기</Button>
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

      <TransactionListBottomSheet
        isOpen={isTransactionListOpen}
        onAddExpense={() => openTransactionForm('expense')}
        onAddIncome={() => openTransactionForm('income')}
        onClose={() => setIsTransactionListOpen(false)}
        selectedDate={selectedDate}
        transactions={mockTransactions}
      />

      <TransactionFormModal
        categories={transactionType === 'income' ? mockIncomeCategories : mockExpenseCategories}
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onDelete={() => setIsTransactionFormOpen(false)}
        onSave={() => setIsTransactionFormOpen(false)}
        selectedDate={selectedDate}
        type={transactionType}
      />

      <TransactionFormBottomSheet
        categories={transactionType === 'income' ? mockIncomeCategories : mockExpenseCategories}
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
