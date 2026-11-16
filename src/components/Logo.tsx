import { Link } from 'react-router-dom'
import { APP_NAME, APP_TAGLINE } from '../config'
import { cn } from '../lib/utils'

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link
      to="/"
      className={cn('group flex min-w-0 items-center gap-2.5', className)}
      aria-label={`${APP_NAME} — início`}
    >
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl shadow-sm transition duration-300 group-hover:-rotate-2 group-hover:scale-[1.03]">
        <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="salinas-logo-ocean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0b1f33" />
              <stop offset="55%" stopColor="#087ea4" />
              <stop offset="100%" stopColor="#27c5d9" />
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="15" fill="url(#salinas-logo-ocean)" />
          <circle cx="34" cy="14" r="6" fill="#f5c542" />
          <circle cx="34" cy="14" r="10" fill="#f5c542" opacity=".16" />
          <path
            d="M7 30c5.2-4.8 9.2 4.8 14.4 0s9.2 4.8 14.4 0 5.2-2 5.2-2"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M7 36c5.2-4.8 9.2 4.8 14.4 0s9.2 4.8 14.4 0"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeOpacity=".62"
            strokeWidth="2.2"
          />
          <path
            d="M10 23c4-3.4 7.5 3.4 11.5 0s7.5 3.4 11.5 0"
            fill="none"
            stroke="#f5c542"
            strokeLinecap="round"
            strokeOpacity=".85"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="14" r="1.2" fill="#fff" opacity=".7" />
          <circle cx="17" cy="11" r=".9" fill="#fff" opacity=".5" />
        </svg>
      </span>
      <span className={cn('min-w-0 leading-tight', compact && 'hidden sm:block')}>
        <span className="display block truncate text-[1.05rem] font-extrabold tracking-tight text-deep sm:text-lg">
          {APP_NAME}
        </span>
        <span className="hidden truncate text-[10px] font-bold uppercase tracking-[0.14em] text-tide sm:block">
          {APP_TAGLINE}
        </span>
      </span>
    </Link>
  )
}
