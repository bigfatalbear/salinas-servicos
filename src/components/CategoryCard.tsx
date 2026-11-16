import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Category } from '../lib/types'
import { CategoryIcon } from './CategoryIcon'

export function CategoryCard({
  category,
  count,
}: {
  category: Category
  count?: number
}) {
  return (
    <Link
      to={`/profissionais?categoria=${category.slug}`}
      className="group relative flex min-h-[8.75rem] flex-col justify-between overflow-hidden rounded-2xl border border-brand-deep-2! bg-brand-deep p-4 text-white shadow-[0_18px_40px_-28px_rgba(0,0,0,0.75)] transition duration-300 hover:-translate-y-1 hover:border-water/50! hover:shadow-[0_22px_50px_-24px_rgba(0,0,0,0.8)] sm:p-5"
      aria-label={`Ver profissionais de ${category.name}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(39,197,217,0.14),transparent_45%)] opacity-80" />
      <div className="relative flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10! bg-brand-deep-2/70 text-water transition duration-300 group-hover:border-water/30! group-hover:bg-water group-hover:text-brand-deep">
          <CategoryIcon name={category.icon} className="h-5 w-5" />
        </span>
        <ArrowUpRight
          className="h-4 w-4 text-white/35 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-water"
          aria-hidden="true"
        />
      </div>
      <div className="relative mt-4">
        <h3 className="text-[15px] font-extrabold leading-tight text-white sm:text-base">
          {category.name}
        </h3>
        {typeof count === 'number' ? (
          <p className="mt-1 text-xs text-white/55">
            {count} {count === 1 ? 'profissional' : 'profissionais'}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
