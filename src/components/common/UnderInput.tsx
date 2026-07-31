import type { InputHTMLAttributes } from 'react'

type UnderInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
  suffix?: string
  variant?: 'default' | 'amount'
}

export default function UnderInput({
  error,
  id,
  label,
  className = '',
  suffix = '원',
  variant = 'default',
  ...props
}: UnderInputProps) {
  const inputId = id ?? props.name

  if (variant === 'amount') {
    return (
      <label className={['grid w-full gap-2', className].join(' ').trim()} htmlFor={inputId}>
        {label ? <span className="text-sm font-semibold text-gray-500">{label}</span> : null}
        <div className="flex items-center gap-1 rounded-2xl glass-input px-4 transition focus-within:border-black/20 focus-within:bg-white/90">
          <input
            className="min-h-12 w-full min-w-0 border-0 bg-transparent text-lg font-medium text-black outline-none placeholder:text-black/25"
            id={inputId}
            {...props}
          />
          {suffix ? <span className="shrink-0 text-base font-bold text-gray-400">{suffix}</span> : null}
        </div>
        {error ? (
          <small className="text-sm font-semibold text-(--color-expense-red)" role="alert">
            {error}
          </small>
        ) : null}
      </label>
    )
  }

  return (
    <label className={['grid w-full gap-2', className].join(' ').trim()} htmlFor={inputId}>
      {label ? <span className="text-sm font-semibold text-gray-500">{label}</span> : null}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-black/12 transition focus-within:border-black/40">
        <input
          className="min-h-12 w-full min-w-0 border-0 bg-transparent text-lg font-medium text-black outline-none placeholder:text-black/25"
          id={inputId}
          {...props}
        />
        {suffix ? <span className="text-base font-bold text-gray-400">{suffix}</span> : null}
      </div>
      {error ? (
        <small className="text-sm font-semibold text-(--color-expense-red)" role="alert">
          {error}
        </small>
      ) : null}
    </label>
  )
}
