import { useState } from 'react'
import CategoryModal from '../../components/categories/CategoryModal'
import CategorySelect from '../../components/categories/CategorySelect'
import CalendarMonthHeader from '../../components/calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../../components/calendar/CalendarMonthlySummary'
import ActionMenu from '../../components/common/ActionMenu'
import Button from '../../components/common/Button'
import Checkbox from '../../components/common/Checkbox'
import ConfirmModal from '../../components/common/ConfirmModal'
import Tabs from '../../components/common/Tabs'
import Textarea from '../../components/common/Textarea'
import UnderInput from '../../components/common/UnderInput'
import AmountInput from '../../components/transactions/AmountInput'
import TransactionFormBottomSheet from '../../components/transactions/bottomSheet/TransactionFormBottomSheet'
import TransactionListBottomSheet from '../../components/transactions/bottomSheet/TransactionListBottomSheet'

const tabs = [
  { id: 'stats', label: '통계' },
  { id: 'review', label: '회고' },
  { id: 'categories', label: '카테고리' },
]

const categories = [
  { id: 'food', name: '식비', color: '#f05650' },
  { id: 'coffee', name: '카페', color: '#ffb74d' },
  { id: 'transport', name: '교통', color: '#007fff' },
  { id: 'shopping', name: '쇼핑', color: '#ab47bc' },
]

export default function TestPage() {
  const [activeTabId, setActiveTabId] = useState(tabs[0].id)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [isTransactionListOpen, setIsTransactionListOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0].id)

  const handlePrevMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-8xl p-6 max-sm:p-4">
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
        <h2 className="mb-4 text-base font-bold">ActionMenu</h2>
        <div className="flex w-full items-center justify-between gap-4 rounded-lg border border-(--color-gray) p-3">
          <span>식비 · 12,000원</span>
          <ActionMenu onDelete={() => undefined} onEdit={() => undefined} />
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-(--color-gray) bg-white p-6 max-sm:p-4">
        <h2 className="mb-4 text-base font-bold">ConfirmModal / CategoryModal / TransactionBottomSheet</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setIsModalOpen(true)}>확인 모달 열기</Button>
          <Button onClick={() => setIsCategoryModalOpen(true)} variant="secondary">
            카테고리 모달 열기
          </Button>
          <Button onClick={() => setIsTransactionFormOpen(true)} variant="secondary">
            거래 입력 바텀시트 열기
          </Button>
          <Button onClick={() => setIsTransactionListOpen(true)} variant="secondary">
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

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={() => setIsCategoryModalOpen(false)}
      />

      <TransactionFormBottomSheet
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        title="지출 추가"
      >
        <div className="grid gap-4">
          <UnderInput inputMode="numeric" label="금액" placeholder="12000" />
          <CategorySelect
            categories={categories}
            onChange={setSelectedCategoryId}
            selectedCategoryId={selectedCategoryId}
          />
          <Textarea label="메모" placeholder="선택한 소비에 대한 생각을 남겨보세요." />
        </div>
        <div className="mt-4">
          <Button onClick={() => setIsTransactionFormOpen(false)}>저장하기</Button>
        </div>
      </TransactionFormBottomSheet>

      <TransactionListBottomSheet
        dateLabel="6월 2일 (화)"
        isOpen={isTransactionListOpen}
        onAddExpense={() => setIsTransactionFormOpen(true)}
        onAddIncome={() => setIsTransactionFormOpen(true)}
        onClose={() => setIsTransactionListOpen(false)}
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4">
          <span className="inline-flex min-w-0 items-center gap-3 font-extrabold text-gray-800">
            <span className="h-2 w-2 flex-none rounded-full" style={{ backgroundColor: '#ff6b1a' }} />
            편의점
          </span>
          <strong className="font-black text-(--color-expense-red)">-323</strong>
        </div>
        <div className="flex items-center justify-between gap-4 py-4">
          <span className="inline-flex min-w-0 items-center gap-3 font-extrabold text-gray-800">
            <span className="h-2 w-2 flex-none rounded-full" style={{ backgroundColor: '#f4b400' }} />
            배달
          </span>
          <strong className="font-black text-(--color-income-blue)">+134,124</strong>
        </div>
      </TransactionListBottomSheet>
    </main>
  )
}
