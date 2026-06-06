import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppPage from '../pages/AppPage'
import LandingPage from '../pages/LandingPage'
import TestPage from '../pages/test/TestPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  )
}
