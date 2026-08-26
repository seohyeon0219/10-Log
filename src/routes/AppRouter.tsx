import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getOnboardingCompleted } from '../lib/onboardingApi'
import AppLayout from '../layouts/AppLayout'
import CalendarPage from '../pages/CalendarPage'
import HomePage from '../pages/HomePage'
import LandingPage from '../pages/LandingPage'
import AssetsPage from '../pages/AssetsPage'
import LogPage from '../pages/LogPage'
import TaggingPage from '../pages/TaggingPage'
import SearchPage from '../pages/SearchPage'
import SearchResultsPage from '../pages/SearchResultsPage'
import MorePage from '../pages/MorePage'
import ReportsPage from '../pages/ReportsPage'
import ReportDetailPage from '../pages/ReportDetailPage'
import OnboardingPage from '../pages/OnboardingPage'
import ProfileEditPage from '../pages/ProfileEditPage'
import ReviewPage from '../pages/ReviewPage'
import StatsPage from '../pages/StatsPage'
import AccountDetailPage from '../pages/AccountDetailPage'
import CategoryDetailPage from '../pages/CategoryDetailPage'
import MonthlyInsightsPage from '../pages/MonthlyInsightsPage'
import SpendingPatternsPage from '../pages/SpendingPatternsPage'

function useAuthGuard() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
      if (!session) setOnboardingCompleted(undefined)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    getOnboardingCompleted()
      .then(setOnboardingCompleted)
      .catch(() => setOnboardingCompleted(false))
  }, [session])

  return { session, onboardingCompleted }
}

// 미로그인 → Landing 허용
// 로그인 + 온보딩 미완료 → /onboarding 으로
// 로그인 + 온보딩 완료 → /app/home 으로
function LandingRoute({ children }: { children: ReactNode }) {
  const { session, onboardingCompleted } = useAuthGuard()

  if (session === undefined) return null
  if (!session) return <>{children}</>
  if (onboardingCompleted === undefined) return null
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace />
  return <Navigate to="/app/home" replace />
}

// 로그인 + 온보딩 미완료 → 온보딩 페이지 접근 허용
// 로그인 + 온보딩 완료 → /app/home 으로
// 미로그인 → / 으로
function OnboardingRoute({ children }: { children: ReactNode }) {
  const { session, onboardingCompleted } = useAuthGuard()
  if (session === undefined) return null
  if (!session) return <Navigate to="/" replace />
  if (onboardingCompleted === undefined) return null
  if (onboardingCompleted) return <Navigate to="/app/home" replace />
  return <>{children}</>
}

// 로그인 + 온보딩 완료 → 앱 접근 허용
// 로그인 + 온보딩 미완료 → /onboarding 으로
// 미로그인 → / 으로
function AppRoute({ children }: { children: ReactNode }) {
  const { session, onboardingCompleted } = useAuthGuard()

  if (session === undefined) return null
  if (!session) return <Navigate to="/" replace />
  if (onboardingCompleted === undefined) return null
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingRoute><LandingPage /></LandingRoute>} />
        <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />
        <Route path="/app" element={<AppRoute><AppLayout /></AppRoute>}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="log" element={<LogPage />} />
          <Route path="log/tag" element={<TaggingPage />} />
          <Route path="assets/:id" element={<AccountDetailPage />} />
          <Route path="stats/category/:categoryId" element={<CategoryDetailPage />} />
          <Route path="stats/review" element={<ReviewPage />} />
          <Route path="stats/insights" element={<MonthlyInsightsPage />} />
          <Route path="stats/patterns" element={<SpendingPatternsPage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="search/results" element={<SearchResultsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/:year/:month" element={<ReportDetailPage />} />
          <Route path="profile" element={<ProfileEditPage />} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
