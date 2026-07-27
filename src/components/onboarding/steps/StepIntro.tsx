type Props = {
  onNext: () => void
}

export default function StepIntro({ onNext }: Props) {
  return (
    <button
      className="flex h-full w-full flex-col items-start justify-center px-8 pb-[env(safe-area-inset-bottom)] text-left"
      onClick={onNext}
      type="button"
    >
      <p className="text-[15px] font-semibold text-(--color-text-muted)">안녕하세요! 👋</p>
      <h1 className="mt-4 text-[30px] font-extrabold leading-snug text-black">
        더 나은 자산관리를<br />위한 첫걸음,
      </h1>
      <p className="mt-6 text-[16px] font-medium leading-relaxed text-(--color-text-dim)">
        몇 가지 질문을 준비했어요.<br />
        답변을 바탕으로 당신에게<br />
        맞는 서비스를 제공해드릴게요.
      </p>
      <p className="mt-10 text-[13px] text-(--color-text-muted)">화면을 터치하면 시작해요</p>
    </button>
  )
}
