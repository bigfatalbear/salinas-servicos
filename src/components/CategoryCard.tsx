import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Category } from '../lib/types'
import { CategoryIcon } from './CategoryIcon'

interface Tone {
  card: string
  glow: string
}

const tones: Record<string, Tone> = {
  zap: {
    card: 'from-amber-300 via-yellow-300 to-orange-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(245,158,11,0.85)]',
  },
  sparkles: {
    card: 'from-fuchsia-300 via-pink-300 to-purple-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(217,70,239,0.8)]',
  },
  truck: {
    card: 'from-sky-300 via-cyan-300 to-blue-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(14,165,233,0.8)]',
  },
  hammer: {
    card: 'from-orange-300 via-amber-300 to-rose-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(249,115,22,0.8)]',
  },
  paintbrush: {
    card: 'from-rose-300 via-pink-300 to-fuchsia-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(244,63,94,0.8)]',
  },
  scissors: {
    card: 'from-pink-300 via-rose-300 to-red-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(236,72,153,0.8)]',
  },
  car: {
    card: 'from-blue-300 via-sky-300 to-indigo-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(59,130,246,0.8)]',
  },
  'car-taxi-front': {
    card: 'from-yellow-300 via-amber-300 to-orange-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(234,179,8,0.8)]',
  },
  fish: {
    card: 'from-cyan-300 via-teal-300 to-sky-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(6,182,212,0.8)]',
  },
  'shopping-basket': {
    card: 'from-emerald-300 via-green-300 to-teal-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(16,185,129,0.8)]',
  },
  'brick-wall': {
    card: 'from-lime-300 via-emerald-300 to-green-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(132,204,22,0.8)]',
  },
  wine: {
    card: 'from-red-300 via-rose-300 to-pink-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(239,68,68,0.8)]',
  },
  'monitor-cog': {
    card: 'from-indigo-300 via-blue-300 to-sky-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(99,102,241,0.8)]',
  },
  'party-popper': {
    card: 'from-purple-300 via-fuchsia-300 to-pink-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(168,85,247,0.8)]',
  },
  home: {
    card: 'from-teal-300 via-emerald-300 to-cyan-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(20,184,166,0.8)]',
  },
  'chef-hat': {
    card: 'from-orange-300 via-amber-300 to-yellow-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(251,146,60,0.8)]',
  },
  camera: {
    card: 'from-violet-300 via-indigo-300 to-blue-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(139,92,246,0.8)]',
  },
  sailboat: {
    card: 'from-cyan-300 via-sky-300 to-blue-400',
    glow: 'shadow-[0_18px_40px_-24px_rgba(56,189,248,0.8)]',
  },
  grid: {
    card: 'from-slate-200 via-sky-200 to-cyan-300',
    glow: 'shadow-[0_18px_40px_-24px_rgba(148,163,184,0.8)]',
  },
}

export function CategoryCard({
  category,
  count,
}: {
  category: Category
  count?: number
}) {
  const tone = tones[category.icon ?? 'grid'] ?? tones.grid

  return (
    <Link
      to={`/servicos/${category.slug}`}
      className={`group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-brand-deep ring-1 ring-inset ring-white/50 transition duration-300 hover:-translate-y-1 hover:brightness-105 ${tone.card} ${tone.glow} hover:shadow-[0_24px_50px_-22px_rgba(11,31,51,0.55)] sm:p-5`}
      aria-label={`Ver profissionais de ${category.name}`}
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/40 blur-2xl transition duration-500 group-hover:scale-125" />
      <div className="pointer-events-none absolute -bottom-12 -left-6 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/60 text-brand-deep shadow-[0_8px_20px_-10px_rgba(11,31,51,0.45)] ring-1 ring-white/70 backdrop-blur transition duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-white/80">
          <CategoryIcon name={category.icon} className="h-6 w-6" />
        </span>
        <ArrowUpRight
          className="h-[18px] w-[18px] text-brand-deep/40 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-deep"
          aria-hidden="true"
        />
      </div>
      <div className="relative mt-4">
        <h3 className="text-[17px] font-extrabold leading-tight text-brand-deep sm:text-lg">
          {category.name}
        </h3>
        {typeof count === 'number' ? (
          <p className="mt-1 text-[13px] font-semibold text-brand-deep/65 sm:text-sm">
            {count} {count === 1 ? 'profissional' : 'profissionais'}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
