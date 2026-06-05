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

  return (
    <div className="common-modal-backdrop">
      <section aria-modal="true" className="common-category-modal" role="dialog">
        <header className="common-category-modal-header">
          <h2>{title}</h2>
          <button aria-label="카테고리 모달 닫기" className="common-sheet-close-button" onClick={onClose} type="button">
            ×
          </button>
        </header>

        <div className="common-category-modal-body">
          <Input
            label="카테고리 이름"
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="예: 식비"
            value={name}
          />

          <fieldset className="common-color-fieldset">
            <legend>색상 선택</legend>
            <div className="common-color-grid">
              {categoryColorOptions.map((option) => (
                <button
                  aria-label={`${option} 색상 선택`}
                  aria-pressed={option === color}
                  className="common-color-swatch"
                  key={option}
                  onClick={() => setColor(option)}
                  style={{ backgroundColor: option }}
                  type="button"
                />
              ))}
            </div>
          </fieldset>
        </div>

        <div className="common-category-modal-actions">
          <Button onClick={() => onSubmit({ color, name })}>{mode === 'create' ? '만들기' : '저장하기'}</Button>
          <Button onClick={onClose} variant="secondary">
            닫기
          </Button>
        </div>
      </section>
    </div>
  )
}
