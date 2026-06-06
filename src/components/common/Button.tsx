import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-black text-white',
  secondary: 'border-black bg-white text-black',
  ghost: 'border-transparent bg-transparent text-black',
  soft: 'border-transparent bg-gray-100 text-gray-500',
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
