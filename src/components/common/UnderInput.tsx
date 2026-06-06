import type { InputHTMLAttributes } from 'react'

type UnderInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
  suffix?: string
}

export default function UnderInput({ error, id, label, className = '', suffix = '원', ...props }: UnderInputProps) {
  const inputId = id ?? props.name

  return (
    <label className={['grid w-full gap-2', className].join(' ').trim()} htmlFor={inputId}>
      {label ? <span className="font-bold text-black">{label}</span> : null}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-(-color-black)">
        <input
          className="min-h-11 w-full min-w-0 border-0 bg-transparent text-black outline-none placeholder:text-(--color-gray)"
          id={inputId}
          {...props}
        />
        <span className="font-bold text-(--color-gray)">{suffix}</span>
      </div>
      {error ? <small className="text-(--color-expense-red)" role="alert">{error}</small> : null}
    </label>
  )
}
