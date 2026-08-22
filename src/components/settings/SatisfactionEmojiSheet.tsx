import { useEffect, useRef, useState } from 'react'
import BottomSheet from '../common/BottomSheet'
import Button from '../common/Button'
import { useSettingsStore, DEFAULT_SATISFACTION_EMOJIS } from '../../stores/settingsStore'
import type { SatisfactionEmojis } from '../../stores/settingsStore'

const OPTIONS: { key: keyof SatisfactionEmojis; label: string }[] = [
  { key: 'satisfied', label: '만족' },
  { key: 'neutral', label: '보통' },
  { key: 'regret', label: '후회' },
]

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function SatisfactionEmojiSheet({ isOpen, onClose }: Props) {
  const emojis = useSettingsStore((s) => s.satisfactionEmojis)
  const setSatisfactionEmoji = useSettingsStore((s) => s.setSatisfactionEmoji)

  const [draft, setDraft] = useState<SatisfactionEmojis>({ ...emojis })
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) setDraft({ ...emojis })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const isDirty = OPTIONS.some((opt) => draft[opt.key] !== emojis[opt.key])

  const save = () => {
    for (const opt of OPTIONS) {
      const chars = [...draft[opt.key]]
      const last = chars[chars.length - 1]
      if (last) setSatisfactionEmoji(opt.key, last)
    }
    onClose()
  }

  const handleReset = () => {
    setDraft({ ...DEFAULT_SATISFACTION_EMOJIS })
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="감정 아이콘 설정">
      <div className="grid gap-3">
        {OPTIONS.map((opt, i) => (
          <div
            key={opt.key}
            className="flex items-center gap-4 rounded-2xl bg-black/4 px-4 py-3"
          >
            <span className="flex-1 text-sm font-bold text-black">{opt.label}</span>
            <input
              ref={i === 0 ? firstInputRef : undefined}
              className="w-12 bg-transparent text-center text-2xl outline-none"
              value={draft[opt.key]}
              onChange={(e) => {
                const chars = [...e.target.value]
                const last = chars[chars.length - 1] ?? draft[opt.key]
                setDraft((prev) => ({ ...prev, [opt.key]: last }))
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        <Button disabled={!isDirty} onClick={save}>저장</Button>
        <button
          className="w-full text-center text-sm font-semibold text-gray-400 transition active:text-gray-600"
          onClick={handleReset}
          type="button"
        >
          기본값으로 초기화
        </button>
      </div>
    </BottomSheet>
  )
}
