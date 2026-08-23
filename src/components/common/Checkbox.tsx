import type { InputHTMLAttributes, ReactNode } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  children: ReactNode
  variant?: 'default' | 'toggle'
}

export default function Checkbox({ children, className = '', id, variant = 'default', checked, ...props }: CheckboxProps) {
  const checkboxId = id ?? props.name

  if (variant === 'toggle') {
    return (
      <label
        className={['flex cursor-pointer items-center justify-between rounded-2xl bg-black/5 px-4 py-3', className].join(' ').trim()}
        htmlFor={checkboxId}
      >
        <span className="text-sm font-semibold text-gray-600">{children}</span>
        <div className={['relative h-6 w-11 rounded-full transition-colors duration-200', checked ? 'bg-black' : 'bg-black/15'].join(' ')}>
          <div className={['absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200', checked ? 'translate-x-5' : 'translate-x-0.5'].join(' ')} />
        </div>
        <input
          checked={checked}
          className="sr-only"
          id={checkboxId}
          type="checkbox"
          {...props}
        />
      </label>
    )
  }

  return (
    <label
      className={['inline-flex cursor-pointer items-center gap-2.5 text-black', className].join(' ').trim()}
      htmlFor={checkboxId}
    >
      <input
        checked={checked}
        className="h-5 w-5 rounded-md border-gray-300 accent-black"
        id={checkboxId}
        type="checkbox"
        {...props}
      />
      <strong className="text-sm font-semibold text-gray-600">{children}</strong>
    </label>
  )
}
