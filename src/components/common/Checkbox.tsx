import type { InputHTMLAttributes, ReactNode } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  children: ReactNode
}

export default function Checkbox({ children, className = '', id, ...props }: CheckboxProps) {
  const checkboxId = id ?? props.name

  return (
    <label className={['inline-flex cursor-pointer items-center gap-2 text-[var(--color-black)]', className].join(' ').trim()} htmlFor={checkboxId}>
      <input
        className="h-[18px] w-[18px] rounded border-[var(--color-black)] accent-[var(--color-black)]"
        id={checkboxId}
        type="checkbox"
        {...props}
      />
      <strong className="font-bold">{children}</strong>
    </label>
  )
}
