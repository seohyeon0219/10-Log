import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-[var(--color-black)] text-[var(--color-white)]',
  secondary: 'border-[var(--color-black)] bg-[var(--color-white)] text-[var(--color-black)]',
  ghost: 'border-transparent bg-transparent text-[var(--color-black)]',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'min-h-11 w-full max-w-full cursor-pointer rounded-lg border px-4 font-bold disabled:cursor-not-allowed disabled:opacity-50',
        buttonVariantClasses[variant],
        className,
      ].join(' ').trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
