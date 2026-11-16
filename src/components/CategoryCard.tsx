import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Category } from '../lib/types'
import { CategoryIcon } from './CategoryIcon'

const iconTones: Record<string, string> = {
  zap: 'ring-amber-300/20 bg-amber-400/15 text-amber-300',
  sparkles: 'ring-fuchsia-300/20 bg-fuchsia-400/15 text-fuchsia-300',
  truck: 'ring-sky-300/20 bg-sky-400/15 text-sky-300',
  hammer: 'ring-orange-300/20 bg-orange-400/15 text-orange-300',
  paintbrush: 'ring-rose-300/20 bg-rose-400/15 text-rose-300',
  scissors: 'ring-pink-300/20 bg-pink-400/15 text-pink-300',
  car: 'ring-blue-300/20 bg-blue-400/15 text-blue-300',
  'car-taxi-front': 'ring-yellow-300/20 bg-yellow-400/15 text-yellow-300',
  fish: 'ring-cyan-300/20 bg-cyan-400/15 text-cyan-300',
  'shopping-basket': 'ring-emerald-300/20 bg-emerald-400/15 text-emerald-300',
  'brick-wall': 'ring-lime-300/20 bg-lime-400/15 text-lime-300',
  wine: 'ring-red-300/20 bg-red-400/15 text-red-300',
  'monitor-cog': 'ring-indigo-300/20 bg-indigo-400/15 text-indigo-300',
  'party-popper': 'ring-purple-300/20 bg-purple-400/15 text-purple-300',
  home: 'ring-teal-300/20 bg-teal-400/15 text-teal-300',
  'chef-hat': 'ring-orange-300/20 bg-orange-400/15 text-orange-300',
  camera: 'ring-violet-300/20 bg-violet-400/15 text-violet-300',
  sailboat: 'ring-cyan-300/20 bg-cyan-400/15 text-cyan-300',
  grid: 'ring-slate-300/20 bg-slate-400/15 text-slate-300',
}

export function CategoryCard({
  category,
  count,
}: {
  category: Category
  count?: number
}) {
  const tone = iconTones[category.icon ?? 'grid'] ?? iconTones.grid

  return (
    <Link
      to={`/profissionais?categoria=${category.slug}`}
      className="group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-2xl border border-brand-deep-2! bg-brand-deep p-4 text-white shadow-[0_18px_40px_-28px_rgba(0,0,0,0.75)] transition duration-300 hover:-translate-y-1 hover:border-water/50! hover:shadow-[0_22px_50px_-24px_rgba(0,0,0,0.8)] sm:p-5"
      aria-label={`Ver profissionais de ${category.name}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(39,197,217,0.14),transparent_45%)] opacity-80" />
      <div className="relative flex items-start justify-between gap-3">
        <span
          className={`grid h-12 w-12 place-items-center rounded-xl ring-1 ring-inset transition duration-300 group-hover:scale-105 group-hover:brightness-110 ${tone}`}
        >
          <CategoryIcon name={category.icon} className="h-6 w-6" />
        </span>
        <ArrowUpRight
          className="h-[18px] w-[18px] text-white/35 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-water"
          aria-hidden="true"
        />
      </div>
      <div className="relative mt-4">
        <h3 className="text-[17px] font-extrabold leading-tight text-white sm:text-lg">
          {category.name}
        </h3>
        {typeof count === 'number' ? (
          <p className="mt-1 text-[13px] text-white/60 sm:text-sm">
            {count} {count === 1 ? 'profissional' : 'profissionais'}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
