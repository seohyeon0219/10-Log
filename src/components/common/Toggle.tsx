type ToggleProps = {
  checked: boolean
  children: string
  className?: string
  onChange: (checked: boolean) => void
}

export default function Toggle({ checked, children, className = '', onChange }: ToggleProps) {
  return (
    <label className={['flex cursor-pointer items-center justify-between rounded-2xl bg-black/5 px-4 py-3', className].join(' ').trim()}>
      <span className="text-sm font-semibold text-gray-600">{children}</span>
      <input
        checked={checked}
        className="sr-only"
        onChange={(e) => onChange(e.target.checked)}
        type="checkbox"
      />
      <div className={['relative h-6 w-11 rounded-full transition-colors duration-200', checked ? 'bg-black' : 'bg-black/15'].join(' ')}>
        <div className={['absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200', checked ? 'translate-x-5' : 'translate-x-0.5'].join(' ')} />
      </div>
    </label>
  )
}
