import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  center = false,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  center?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        center && 'items-center text-center sm:flex-col sm:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', center && 'mx-auto')}>
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h2 className="display text-3xl font-bold leading-tight text-deep sm:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-deep/65 sm:text-base">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
