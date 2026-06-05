import { useState } from 'react'
import CategoryModal from '../../components/categories/CategoryModal'
import CategorySelect from '../../components/categories/CategorySelect'
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
import './testPage.css'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [isTransactionListOpen, setIsTransactionListOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0].id)

  return (
    <main className="test-page">
      <section className="test-page-header">
        <p>일공로그 공통 컴포넌트</p>
        <h1>Component Test Page</h1>
      </section>

      <section className="test-section">
        <h2>Button</h2>
        <div className="test-row">
          <Button>검정 버튼</Button>
          <Button variant="secondary">흰색 버튼</Button>
          <Button variant="ghost">고스트 버튼</Button>
        </div>
      </section>

      <section className="test-section">
        <h2>Input</h2>
        <div className="test-grid">
          <AmountInput label="금액" placeholder="숫자만 입력돼요" />
          <UnderInput inputMode="numeric" label="밑줄 금액 입력" placeholder="12000" />
          <Textarea label="오늘 소비에 대한 한줄평" placeholder="오늘 소비를 돌아보며 기록해보세요." />
          <Checkbox name="fixed-transaction">고정 수입/지출로 등록</Checkbox>
        </div>
      </section>

      <section className="test-section">
        <h2>Tabs</h2>
        <Tabs activeTabId={activeTabId} onChange={setActiveTabId} tabs={tabs} />
        <p className="test-helper">현재 선택된 탭: {activeTabId}</p>
      </section>

      <section className="test-section">
        <h2>ActionMenu</h2>
        <div className="test-menu-preview">
          <span>식비 · 12,000원</span>
          <ActionMenu onDelete={() => undefined} onEdit={() => undefined} />
        </div>
      </section>

      <section className="test-section">
        <h2>ConfirmModal / CategoryModal / TransactionBottomSheet</h2>
        <div className="test-row">
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
        <div className="test-grid">
          <UnderInput inputMode="numeric" label="금액" placeholder="12000" />
          <CategorySelect
            categories={categories}
            onChange={setSelectedCategoryId}
            selectedCategoryId={selectedCategoryId}
          />
          <Textarea label="메모" placeholder="선택한 소비에 대한 생각을 남겨보세요." />
        </div>
        <div className="test-actions">
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
        <div className="common-transaction-list-item">
          <span className="common-transaction-list-item-title">
            <span className="common-transaction-list-item-dot" style={{ backgroundColor: '#ff6b1a' }} />
            편의점
          </span>
          <strong className="common-transaction-list-item-amount expense">-323</strong>
        </div>
        <div className="common-transaction-list-item">
          <span className="common-transaction-list-item-title">
            <span className="common-transaction-list-item-dot" style={{ backgroundColor: '#f4b400' }} />
            배달
          </span>
          <strong className="common-transaction-list-item-amount income">+134,124</strong>
        </div>
      </TransactionListBottomSheet>
    </main>
  )
}
