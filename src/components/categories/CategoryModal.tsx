import { useState } from 'react'
import { categoryColorOptions } from '../../constants/categoryColorOptions'
import Button from '../common/Button'
import Input from '../common/Input'

type CategoryModalProps = {
  initialColor?: string
  initialName?: string
  isOpen: boolean
  mode?: 'create' | 'edit'
  onClose: () => void
  onSubmit: (category: { color: string; name: string }) => void
}

export default function CategoryModal({
  initialColor = categoryColorOptions[0],
  initialName = '',
  isOpen,
  mode = 'create',
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const [name, setName] = useState(initialName)
  const [color, setColor] = useState(initialColor)

  if (!isOpen) {
    return null
  }

  const title = mode === 'create' ? '카테고리 만들기' : '카테고리 수정'
  const submitLabel = mode === 'create' ? '만들기' : '저장하기'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
      <section
        aria-modal="true"
        className="grid max-h-[calc(100dvh-48px)] w-full max-w-[420px] overflow-y-auto rounded-[var(--radius-12)] bg-[var(--color-white)] p-6 shadow-[0_24px_60px_rgb(17_17_17_/_18%)] max-[480px]:p-5"
        role="dialog"
      >
        <header className="mb-6 grid grid-cols-[minmax(0,1fr)_36px] items-start gap-3">
          <div className="grid gap-1">
            <h2 className="m-0 text-xl font-extrabold leading-tight text-[var(--color-black)]">{title}</h2>
            <p className="m-0 text-sm font-semibold text-[var(--color-gray)]">이름과 색상을 정해주세요.</p>
          </div>
          <button
            aria-label="카테고리 모달 닫기"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-[var(--radius-8)] border-0 bg-transparent text-2xl leading-none text-gray-400 hover:bg-[var(--color-warm-gray)]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="mb-6 grid gap-5">
          <div className="flex min-h-12 items-center gap-3 rounded-[var(--radius-8)] bg-[var(--color-warm-gray)] px-4">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-bold text-[var(--color-black)]">{name || '카테고리 미리보기'}</span>
          </div>

          <Input
            label="카테고리 이름"
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="예: 식비"
            value={name}
          />

          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-3 p-0 text-sm font-bold text-[var(--color-black)]">색상 선택</legend>
            <div className="grid grid-cols-5 gap-3">
              {categoryColorOptions.map((option) => (
                <button
                  aria-label={`${option} 색상 선택`}
                  aria-pressed={option === color}
                  className={[
                    'aspect-square w-full cursor-pointer rounded-full border-2 border-[var(--color-white)] shadow-[0_0_0_1px_var(--color-gray)] transition',
                    option === color
                      ? 'scale-105 shadow-[0_0_0_3px_var(--color-black)]'
                      : '',
                  ].join(' ').trim()}
                  key={option}
                  onClick={() => setColor(option)}
                  style={{ backgroundColor: option }}
                  type="button"
                />
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid gap-3">
          <Button onClick={() => onSubmit({ color, name })}>{submitLabel}</Button>
          <Button onClick={onClose} variant="secondary">
            닫기
          </Button>
        </div>
      </section>
    </div>
  )
}
