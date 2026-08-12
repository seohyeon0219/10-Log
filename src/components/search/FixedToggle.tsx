type FixedToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function FixedToggle({ checked, onChange }: FixedToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-white/55 px-4 py-3">
      <span className="text-sm font-semibold text-gray-700">고정 수입/지출만 보기</span>
      <input
        checked={checked}
        className="sr-only"
        onChange={(e) => onChange(e.target.checked)}
        type="checkbox"
      />
      <div
        className={[
          'relative h-6 w-11 rounded-full transition-colors',
          checked ? 'bg-black' : 'bg-gray-300',
        ].join(' ')}
      >
        <div
          className={[
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          ].join(' ')}
        />
      </div>
    </label>
  )
}
