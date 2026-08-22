import { useRef, useState } from 'react'
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

  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<SatisfactionEmojis>({ ...DEFAULT_SATISFACTION_EMOJIS })
  const firstInputRef = useRef<HTMLInputElement>(null)

  const startEdit = () => {
    setDraft({ ...emojis })
    setIsEditing(true)
    setTimeout(() => firstInputRef.current?.focus(), 50)
  }

  const save = () => {
    for (const opt of OPTIONS) {
      const chars = [...draft[opt.key]]
      const last = chars[chars.length - 1]
      if (last) setSatisfactionEmoji(opt.key, last)
    }
    setIsEditing(false)
  }

  const handleReset = () => {
    for (const opt of OPTIONS) {
      setSatisfactionEmoji(opt.key, DEFAULT_SATISFACTION_EMOJIS[opt.key])
    }
    setIsEditing(false)
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
            {isEditing ? (
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
            ) : (
              <span className="text-2xl">{emojis[opt.key]}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {isEditing ? (
          <Button onClick={save}>저장</Button>
        ) : (
          <Button variant="soft" onClick={startEdit}>수정</Button>
        )}
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
