import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import { APP_NAME, APP_TAGLINE } from '../config'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${APP_NAME} — início`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-deep to-tide text-white shadow-sm">
        <Wrench className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className="display block text-base font-bold tracking-tight text-deep sm:text-lg">
          {APP_NAME}
        </span>
        <span className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-tide sm:block">
          {APP_TAGLINE}
        </span>
      </span>
    </Link>
  )
}
