import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Locality } from '../data/site'

export function LocalityCard({ locality }: { locality: Locality }) {
  const Icon = locality.icon

  return (
    <Link
      to={`/profissionais?local=${encodeURIComponent(locality.value)}`}
      className="group flex min-h-28 flex-col justify-between rounded-2xl border border-line bg-surface-2 p-4 transition duration-300 hover:border-ocean/40 hover:bg-surface"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface text-ocean shadow-sm">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <ArrowRight
          className="h-4 w-4 text-muted/40 transition group-hover:translate-x-0.5 group-hover:text-ocean"
          aria-hidden="true"
        />
      </div>
      <div className="mt-3">
        <p className="text-sm font-extrabold text-ink">{locality.name}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{locality.description}</p>
      </div>
    </Link>
  )
}
