import { useState } from 'react'
import logoImage from '../assets/logo.png'
import Button from '../components/common/Button'
import { supabase } from '../lib/supabase'

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
    <main className="grid min-h-dvh place-items-center bg-[var(--color-white)] p-6 max-[480px]:items-start max-[480px]:pt-[20vh]">
      <section className="grid w-[min(420px,100%)] justify-items-center gap-6 text-center" aria-label="일공로그 시작 화면">
        <img className="h-auto w-[min(144px,42vw)] object-contain" src={logoImage} alt="일공로그 로고" />

        <div className="grid gap-3">
          <h1 className="m-0 text-[clamp(1.5rem,6vw,2rem)] leading-[1.3] font-extrabold text-[var(--color-black)]">
            하루 1분, 소비를 돌아보는 시간
          </h1>
          <p className="m-0 font-semibold leading-[1.6] text-[var(--color-gray)]">
            오늘 1분의 기록이 내일 10분의 가치를 만듭니다.
          </p>
          <p className="m-0 font-semibold leading-[1.6] text-[var(--color-gray)]">
            돈의 흐름과 함께 나의 성장을 기록해보세요
          </p>
        </div>

        <Button
          className="inline-flex items-center justify-center gap-3"
          disabled={isSigningIn}
          onClick={handleGoogleSignIn}
          type="button"
          variant="secondary"
        >
          <span
            aria-hidden="true"
            className="grid h-6 w-6 place-items-center rounded-full border border-[var(--color-gray)] text-sm font-extrabold text-[var(--color-black)]"
          >
            G
          </span>
          {isSigningIn ? '로그인 연결 중...' : '구글 로그인으로 시작하기'}
        </Button>
        {errorMessage ? <p className="m-0 text-sm font-bold text-[var(--color-expense-red)]">{errorMessage}</p> : null}
      </section>
    </main>
  )
}
