import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AppLayout from '../layouts/AppLayout'
import CalendarPage from '../pages/CalendarPage'
import HomePage from '../pages/HomePage'
import LandingPage from '../pages/LandingPage'
import MorePage from '../pages/MorePage'
import OnboardingPage from '../pages/OnboardingPage'
import ProfileEditPage from '../pages/ProfileEditPage'
import ReviewPage from '../pages/ReviewPage'
import StatsPage from '../pages/StatsPage'
import TestPage from '../pages/test/TestPage'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return null
  if (!session) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="profile" element={<ProfileEditPage />} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  )
}
