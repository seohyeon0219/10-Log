import { useState } from 'react'
import logoImage from '../assets/logo.png'
import Button from '../components/common/Button'
import { supabase } from '../lib/supabase'
import './landing/landingPage.css'

export default function LandingPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleGoogleSignIn = async () => {
    setErrorMessage('')
    setIsSigningIn(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      setErrorMessage('구글 로그인 연결 중 문제가 발생했어요.')
      setIsSigningIn(false)
    }
  }

  return (
    <main className="landing-page">
      <section className="landing-content" aria-label="일공로그 시작 화면">
        <img className="landing-logo" src={logoImage} alt="일공로그 로고" />

        <div className="landing-copy">
          <h1>하루 1분, 소비를 돌아보는 시간</h1>
          <p>오늘 1분의 기록이 내일 10분의 가치를 만듭니다.</p>
          <p>돈의 흐름과 함께 나의 성장을 기록해보세요</p>
        </div>

        <Button
          className="landing-google-button"
          disabled={isSigningIn}
          onClick={handleGoogleSignIn}
          type="button"
          variant="secondary"
        >
          <span aria-hidden="true" className="landing-google-mark">G</span>
          {isSigningIn ? '로그인 연결 중...' : '구글 로그인으로 시작하기'}
        </Button>
        {errorMessage ? <p className="landing-error">{errorMessage}</p> : null}
      </section>
    </main>
  )
}
