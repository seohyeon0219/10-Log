import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppPage from '../pages/AppPage'
import CalendarPage from '../pages/CalendarPage'
import LandingPage from '../pages/LandingPage'
import MorePage from '../pages/MorePage'
import ReviewPage from '../pages/ReviewPage'
import StatsPage from '../pages/StatsPage'
import TestPage from '../pages/test/TestPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppPage />}>
          <Route index element={<Navigate to="calendar" replace />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="*" element={<Navigate to="calendar" replace />} />
        </Route>
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  )
}
