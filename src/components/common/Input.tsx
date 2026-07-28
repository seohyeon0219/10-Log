import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
}

export default function Input({ error, id, label, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <label className={['grid w-full gap-2', className].join(' ').trim()} htmlFor={inputId}>
      {label ? <span className="text-sm font-semibold text-gray-500">{label}</span> : null}
      <input
        className="min-h-12 w-full rounded-2xl glass-input px-4 text-base font-semibold text-black outline-none transition placeholder:text-black/25 focus:border-black/20 focus:bg-white/90"
        id={inputId}
        {...props}
      />
      {error ? (
        <small className="text-sm font-semibold text-(--color-expense-red)" role="alert">
          {error}
        </small>
      ) : null}
    </label>
  )
}
