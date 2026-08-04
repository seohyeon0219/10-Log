import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsDesktop } from '../hooks/useIsDesktop'
import ResponsiveCategoryManage from '../components/categories/ResponsiveCategoryManage'
import BottomSheet from '../components/common/BottomSheet'
import ConfirmModal from '../components/common/ConfirmModal'
import FormModal from '../components/common/FormModal'
import MenuGroup, { MenuGroupDivider } from '../components/common/MenuGroup'
import MenuItem from '../components/common/MenuItem'
import { supabase } from '../lib/supabase'
import { useCalendarStore } from '../stores/calendarStore'
import { THEME_GRADIENTS, THEME_LABELS, useThemeStore, type AppTheme } from '../stores/themeStore'

const THEME_OPTIONS: AppTheme[] = ['yellow', 'blue']

function ThemeSelectContent({ onClose }: { onClose: () => void }) {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const [pending, setPending] = useState<AppTheme>(theme)

  const handleSave = () => {
    setTheme(pending)
    onClose()
  }

  return (
    <div className="grid gap-4 pb-2">
      <div className="grid grid-cols-2 gap-3">
        {THEME_OPTIONS.map((option) => {
          const isSelected = pending === option
          return (
            <button
              key={option}
              className={[
                'relative overflow-hidden rounded-2xl transition-all duration-200',
                isSelected
                  ? 'shadow-[0_0_0_2px_rgba(0,0,0,0.18),0_6px_20px_rgba(0,0,0,0.1)] scale-[1.03]'
                  : 'shadow-[0_2px_8px_rgba(0,0,0,0.07)] hover:scale-[1.01] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
              ].join(' ')}
              onClick={() => setPending(option)}
              style={{ background: THEME_GRADIENTS[option] }}
              type="button"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full blur-3xl"
                style={{ background: option === 'blue' ? 'rgba(169,201,255,0.7)' : 'rgba(232,232,232,0.8)' }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-3xl"
                style={{ background: option === 'blue' ? 'rgba(169,201,255,0.5)' : 'rgba(240,222,218,0.7)' }}
              />
              <div className="relative flex h-32 flex-col items-center justify-end px-4 pb-4">
                <span className="rounded-full border border-white/60 bg-white/55 px-3 py-1 text-xs font-bold text-black backdrop-blur-sm">
                  {THEME_LABELS[option]}
                </span>
              </div>
            </button>
          )
        })}
      </div>
      <button
        className="min-h-12 w-full rounded-xl bg-black text-base font-bold text-white transition hover:bg-gray-800 active:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        disabled={pending === theme}
        onClick={handleSave}
        type="button"
      >
        저장
      </button>
    </div>
  )
}

export default function MoreContainer() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const isDesktop = useIsDesktop()

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
    <section className="w-full self-start animate-fade-up md:mt-6 md:min-h-80">
      <h2 className="mb-4 hidden text-xl font-bold text-black md:mb-5 md:block">더보기</h2>

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
      </MenuGroup>

      <MenuGroup title="설정">
        <MenuItem label="나의 정보" onClick={() => void navigate('/app/profile')} />
        <MenuGroupDivider />
        <MenuItem label="화면 테마" onClick={() => setIsThemeOpen(true)} />
        <MenuGroupDivider />
        <MenuItem label="알림 설정" onClick={() => {}} />
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

      <FormModal
        isOpen={isDesktop && isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        title="화면 테마"
      >
        <ThemeSelectContent onClose={() => setIsThemeOpen(false)} />
      </FormModal>
      <BottomSheet
        isOpen={!isDesktop && isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        title="화면 테마"
      >
        <ThemeSelectContent onClose={() => setIsThemeOpen(false)} />
      </BottomSheet>

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
