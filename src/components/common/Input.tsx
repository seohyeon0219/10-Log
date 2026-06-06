import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
}

export default function Input({ error, id, label, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <label className={['grid w-full gap-2', className].join(' ').trim()} htmlFor={inputId}>
      {label ? <span className="font-bold text-[var(--color-black)]">{label}</span> : null}
      <input
        className="min-h-11 w-full rounded-lg border border-[var(--color-gray)] px-3 text-[var(--color-black)] outline-none focus:border-[var(--color-gray)]"
        id={inputId}
        {...props}
      />
      {error ? <small className="text-[var(--color-expense-red)]" role="alert">{error}</small> : null}
    </label>
  )
}
