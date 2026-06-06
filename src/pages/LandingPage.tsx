import { useState } from 'react'
import logoImage from '../assets/logo.png'
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
    <main className="flex min-h-dvh items-center justify-center bg-white p-6 max-sm:items-start max-sm:pt-48">
      <section className="flex w-full max-w-md flex-col items-center gap-12 text-center" aria-label="일공로그 시작 화면">
        <div className="flex flex-col items-center gap-1">
          <img className="h-auto w-32 max-w-xs object-contain" src={logoImage} alt="일공로그 로고" />

          <h1 className="m-0 text-base leading-relaxed font-semibold text-black">
            하루 1분, 소비를 돌아보는 시간
          </h1>
          <p className="m-0 text-sm leading-relaxed font-medium text-gray-400">
            오늘 1분의 기록이 내일 10분의 가치를 만듭니다.
          </p>
          {/* <p className="m-0 text-sm leading-relaxed font-medium text-(--color-gray)">
            돈의 흐름과 함께 나의 성장을 기록해보세요
          </p> */}
        </div>

        <button
          className="inline-flex h-12 w-full max-w-sm cursor-pointer items-center justify-center gap-5 rounded-2xl border border-gray-200 bg-white px-8 text-sm font-medium text-gray-700 shadow-md transition disabled:cursor-not-allowed disabled:opacity-60 max-sm:gap-4"
          disabled={isSigningIn}
          onClick={handleGoogleSignIn}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-7 w-7 flex-none max-sm:h-6 max-sm:w-6"
            viewBox="0 0 48 48"
          >
            <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.52h11.84c-.52 2.74-2.08 5.06-4.42 6.62v5.5h7.16c4.18-3.86 6.54-9.54 6.54-16.14z" />
            <path fill="#34A853" d="M24 46c5.98 0 11-1.98 14.58-5.36l-7.16-5.5c-1.98 1.32-4.5 2.1-7.42 2.1-5.76 0-10.64-3.88-12.38-9.1H4.24v5.68C7.84 40.98 15.24 46 24 46z" />
            <path fill="#FBBC05" d="M11.62 28.14c-.44-1.32-.7-2.72-.7-4.14s.26-2.82.7-4.14v-5.68H4.24C2.74 17.18 1.88 20.48 1.88 24s.86 6.82 2.36 9.82l7.38-5.68z" />
            <path fill="#EA4335" d="M24 10.76c3.26 0 6.18 1.12 8.48 3.32l6.34-6.34C34.98 4.16 29.98 2 24 2 15.24 2 7.84 7.02 4.24 14.18l7.38 5.68c1.74-5.22 6.62-9.1 12.38-9.1z" />
          </svg>
          <span>{isSigningIn ? '로그인 연결 중...' : 'Google로 시작하기'}</span>
        </button>
        {errorMessage ? <p className="m-0 text-sm font-bold text-(--color-expense-red)">{errorMessage}</p> : null}
      </section>
    </main>
  )
}
