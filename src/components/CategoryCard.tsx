import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Category } from '../lib/types'
import { CategoryIcon } from './CategoryIcon'

interface Tone {
  card: string
  chip: string
  glow: string
}

const tones: Record<string, Tone> = {
  zap: {
    card: 'from-amber-200 via-yellow-200 to-orange-300',
    chip: 'from-amber-500 to-orange-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(245,158,11,0.85)]',
  },
  sparkles: {
    card: 'from-fuchsia-200 via-pink-200 to-purple-300',
    chip: 'from-fuchsia-500 to-purple-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(217,70,239,0.8)]',
  },
  truck: {
    card: 'from-sky-200 via-cyan-200 to-blue-300',
    chip: 'from-sky-500 to-blue-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(14,165,233,0.8)]',
  },
  hammer: {
    card: 'from-orange-200 via-amber-200 to-rose-300',
    chip: 'from-orange-500 to-red-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(249,115,22,0.8)]',
  },
  paintbrush: {
    card: 'from-rose-200 via-pink-200 to-fuchsia-300',
    chip: 'from-rose-500 to-fuchsia-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(244,63,94,0.8)]',
  },
  scissors: {
    card: 'from-pink-200 via-rose-200 to-red-300',
    chip: 'from-pink-500 to-rose-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(236,72,153,0.8)]',
  },
  car: {
    card: 'from-blue-200 via-sky-200 to-indigo-300',
    chip: 'from-blue-500 to-indigo-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(59,130,246,0.8)]',
  },
  'car-taxi-front': {
    card: 'from-yellow-200 via-amber-200 to-orange-300',
    chip: 'from-yellow-500 to-amber-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(234,179,8,0.8)]',
  },
  fish: {
    card: 'from-cyan-200 via-teal-200 to-sky-300',
    chip: 'from-cyan-500 to-teal-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(6,182,212,0.8)]',
  },
  'shopping-basket': {
    card: 'from-emerald-200 via-green-200 to-teal-300',
    chip: 'from-emerald-500 to-green-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(16,185,129,0.8)]',
  },
  'brick-wall': {
    card: 'from-lime-200 via-emerald-200 to-green-300',
    chip: 'from-lime-500 to-emerald-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(132,204,22,0.8)]',
  },
  wine: {
    card: 'from-red-200 via-rose-200 to-pink-300',
    chip: 'from-red-500 to-rose-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(239,68,68,0.8)]',
  },
  'monitor-cog': {
    card: 'from-indigo-200 via-blue-200 to-sky-300',
    chip: 'from-indigo-500 to-blue-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(99,102,241,0.8)]',
  },
  'party-popper': {
    card: 'from-purple-200 via-fuchsia-200 to-pink-300',
    chip: 'from-purple-500 to-pink-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(168,85,247,0.8)]',
  },
  home: {
    card: 'from-teal-200 via-emerald-200 to-cyan-300',
    chip: 'from-teal-500 to-emerald-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(20,184,166,0.8)]',
  },
  'chef-hat': {
    card: 'from-orange-200 via-amber-200 to-yellow-300',
    chip: 'from-orange-500 to-amber-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(251,146,60,0.8)]',
  },
  camera: {
    card: 'from-violet-200 via-indigo-200 to-blue-300',
    chip: 'from-violet-500 to-indigo-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(139,92,246,0.8)]',
  },
  sailboat: {
    card: 'from-cyan-200 via-sky-200 to-blue-300',
    chip: 'from-cyan-500 to-blue-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(56,189,248,0.8)]',
  },
  shirt: {
    card: 'from-purple-200 via-violet-200 to-indigo-300',
    chip: 'from-purple-500 to-indigo-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(147,51,234,0.8)]',
  },
  megaphone: {
    card: 'from-orange-200 via-rose-200 to-red-300',
    chip: 'from-orange-500 to-rose-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(251,113,133,0.8)]',
  },
  'paw-print': {
    card: 'from-sky-200 via-teal-200 to-emerald-300',
    chip: 'from-teal-500 to-cyan-600',
    glow: 'shadow-[0_18px_40px_-24px_rgba(20,184,166,0.8)]',
  },
  grid: {
    card: 'from-slate-200 via-sky-200 to-cyan-300',
    chip: 'from-slate-500 to-sky-600',
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
        <span
          className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-[0_10px_22px_-10px_rgba(11,31,51,0.6)] ring-1 ring-inset ring-white/30 transition duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tone.chip}`}
        >
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
