import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'solid' | 'outline'
}

export function IconButton({
  label,
  children,
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}: IconButtonProps) {
  const sizeClass = {
    sm: 'h-9 w-9 min-h-[36px] min-w-[36px]',
    md: 'h-11 w-11 min-h-[44px] min-w-[44px]',
    lg: 'h-12 w-12 min-h-[48px] min-w-[48px]',
  }[size]

  const variantClass = {
    ghost: 'bg-transparent hover:bg-white/8 text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
    solid: 'bg-[var(--accent)]/15 text-[var(--accent)] hover:bg-[var(--accent)]/25',
    outline: 'border border-[var(--border)] bg-[var(--surface)]/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/40',
  }[variant]

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        'inline-flex items-center justify-center rounded-xl transition-colors duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
        sizeClass,
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}