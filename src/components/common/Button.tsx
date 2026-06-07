import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-black text-white hover:bg-gray-800 active:bg-black',
  secondary: 'border-gray-200 bg-white text-black hover:bg-gray-50 active:bg-gray-100',
  ghost: 'border-transparent bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100',
  soft: 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-200',
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
        'min-h-12 w-full max-w-full cursor-pointer rounded-xl border px-4 text-base font-bold transition disabled:cursor-not-allowed disabled:opacity-50',
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
