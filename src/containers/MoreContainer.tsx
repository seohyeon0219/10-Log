import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import CategoryManageBottomSheet from '../components/categories/CategoryManageBottomSheet'
import CategoryManageModal from '../components/categories/CategoryManageModal'
import ConfirmModal from '../components/common/ConfirmModal'
import MenuItem from '../components/common/MenuItem'
import { supabase } from '../lib/supabase'
import { useCalendarStore } from '../stores/calendarStore'

type MenuGroupProps = {
  children: ReactNode
  title: string
}

function MenuGroup({ children, title }: MenuGroupProps) {
  return (
    <div className="mb-4">
      <p className="mb-1 px-1 text-xs font-medium text-gray-400">{title}</p>
      <div className="overflow-hidden rounded-2xl bg-white">{children}</div>
    </div>
  )
}

function Divider() {
  return <div className="mx-5 h-px bg-gray-100" />
}

export default function MoreContainer() {
  const [user, setUser] = useState<User | null>(null)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const addCategory = useCalendarStore((state) => state.addCategory)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const updateCategory = useCalendarStore((state) => state.updateCategory)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    void loadMonth()
  }, [loadMonth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const displayName = (user?.user_metadata?.full_name as string | undefined) || user?.email?.split('@')[0] || '사용자'
  const email = user?.email ?? ''
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const initial = displayName[0]?.toUpperCase() ?? '?'

  return (
    <section className="w-full self-start md:mt-6 md:min-h-80">
      <h2 className="mb-4 hidden text-xl font-bold text-black md:mb-5 md:block">더보기</h2>

      {/* 프로필 */}
      <div className="mb-2 flex items-center gap-4 rounded-2xl bg-white px-5 py-5">
        {avatarUrl ? (
          <img alt="프로필" className="h-12 w-12 flex-none rounded-full object-cover" src={avatarUrl} />
        ) : (
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-black text-lg font-bold text-white">
            {initial}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[16px] font-bold text-black">{displayName}</p>
          <p className="truncate text-sm font-medium text-gray-400">{email}</p>
        </div>
      </div>

      <MenuGroup title="소비 관리">
        <MenuItem label="카테고리 관리" onClick={() => setIsCategoryOpen(true)} />
      </MenuGroup>

      <MenuGroup title="설정">
        <MenuItem label="알림 설정" onClick={() => {}} />
        <Divider />
        <MenuItem label="계정 관리" onClick={() => {}} />
        <Divider />
        <MenuItem
          label="개인정보처리방침"
          onClick={() =>
            window.open(
              'https://harsh-grouse-d8c.notion.site/37abf62d32dd80ba9ca6ca08c4993c73',
              
              '_blank',
              'noopener,noreferrer',
            )
          }
        />
      </MenuGroup>

      {/* 로그아웃 */}
      <div className="mt-1 border-t border-gray-100 pt-2">
        <button
          className="flex w-full items-center justify-center px-4 py-4 text-[15px] font-normal text-gray-400 transition active:bg-gray-50"
          onClick={() => setIsLogoutOpen(true)}
          type="button"
        >
          로그아웃
        </button>
      </div>

      <ConfirmModal
        cancelText="취소"
        confirmText="로그아웃"
        description="로그아웃하면 다시 로그인이 필요해요."
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
        title="로그아웃할까요?"
      />

      {/* 카테고리 관리 오버레이 */}
      <div className="hidden md:block">
        <CategoryManageModal
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          isOpen={isCategoryOpen}
          onCreateCategory={addCategory}
          onClose={() => setIsCategoryOpen(false)}
          onDeleteCategory={deleteCategory}
          onUpdateCategory={updateCategory}
        />
      </div>
      <div className="md:hidden">
        <CategoryManageBottomSheet
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          isOpen={isCategoryOpen}
          onCreateCategory={addCategory}
          onClose={() => setIsCategoryOpen(false)}
          onDeleteCategory={deleteCategory}
          onUpdateCategory={updateCategory}
        />
      </div>
    </section>
  )
}
