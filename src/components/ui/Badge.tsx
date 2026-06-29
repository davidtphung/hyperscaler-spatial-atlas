import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  variant?: 'solid' | 'outline'
  className?: string
}

export function Badge({ children, color, variant = 'outline', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide',
        variant === 'outline' && 'border',
        className
      )}
      style={
        color
          ? {
              borderColor: `${color}40`,
              color,
              backgroundColor: variant === 'solid' ? `${color}20` : 'transparent',
            }
          : undefined
      }
    >
      {children}
    </span>
  )
}