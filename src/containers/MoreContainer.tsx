import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ResponsiveCategoryManage from '../components/categories/ResponsiveCategoryManage'
import ConfirmModal from '../components/common/ConfirmModal'
import MenuGroup, { MenuGroupDivider } from '../components/common/MenuGroup'
import MenuItem from '../components/common/MenuItem'
import ResponsiveThemeSelect from '../components/settings/ResponsiveThemeSelect'
import SatisfactionEmojiSheet from '../components/settings/SatisfactionEmojiSheet'
import { supabase } from '../lib/supabase'
import { useCalendarStore } from '../stores/calendarStore'

export default function MoreContainer() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)
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
    <section className="w-full self-start animate-fade-up md:mt-4 md:min-h-80">
      {/* 프로필 */}
      <div className="mb-2 flex items-center gap-4 rounded-2xl border border-white/60 bg-(--color-glass-white) px-5 py-5 backdrop-blur-sm">
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
        <MenuGroupDivider />
        <MenuItem label="자산·부채 관리" onClick={() => void navigate('/app/assets')} />
        <MenuGroupDivider />
        <MenuItem label="리포트 모아보기" onClick={() => void navigate('/app/reports')} />
      </MenuGroup>

      <MenuGroup title="설정">
        <MenuItem label="나의 정보" onClick={() => void navigate('/app/profile')} />
        <MenuGroupDivider />
        <MenuItem label="화면 테마" onClick={() => setIsThemeOpen(true)} />
        <MenuGroupDivider />
        <MenuItem label="감정 아이콘 설정" onClick={() => setIsEmojiOpen(true)} />
        <MenuGroupDivider />
        <MenuItem
          label="알림 설정"
          onClick={() => {
            window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'OPEN_NOTIFICATION_SETTINGS' }))
          }}
        />
        <MenuGroupDivider />
        <MenuItem label="계정 관리" onClick={() => {}} />
        <MenuGroupDivider />
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

      <ResponsiveThemeSelect isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
      <SatisfactionEmojiSheet isOpen={isEmojiOpen} onClose={() => setIsEmojiOpen(false)} />

      <ResponsiveCategoryManage
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        isOpen={isCategoryOpen}
        onCreateCategory={addCategory}
        onClose={() => setIsCategoryOpen(false)}
        onDeleteCategory={deleteCategory}
        onUpdateCategory={updateCategory}
      />
    </section>
  )
}
