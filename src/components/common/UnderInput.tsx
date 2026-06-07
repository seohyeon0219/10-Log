import type { InputHTMLAttributes } from 'react'

type UnderInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
  suffix?: string
  variant?: 'default' | 'amount'
}

const inputVariantClasses: Record<NonNullable<UnderInputProps['variant']>, string> = {
  amount: 'text-xl font-bold',
  default: 'text-lg font-semibold',
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

  return (
    <label className={['grid w-full gap-2', className].join(' ').trim()} htmlFor={inputId}>
      {label ? <span className="text-sm font-semibold text-gray-500">{label}</span> : null}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-gray-200 transition focus-within:border-black">
        <input
          className={[
            'min-h-12 w-full min-w-0 border-0 bg-transparent text-black outline-none placeholder:text-gray-300',
            inputVariantClasses[variant],
          ].join(' ')}
          id={inputId}
          {...props}
        />
        <span className="text-base font-bold text-gray-400">{suffix}</span>
      </div>
      {error ? (
        <small className="text-sm font-semibold text-(--color-expense-red)" role="alert">
          {error}
        </small>
      ) : null}
    </label>
  )
}
