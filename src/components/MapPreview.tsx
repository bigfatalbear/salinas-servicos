import { Link } from 'react-router-dom'
import { ArrowRight, Compass, MapPin } from 'lucide-react'
import { LOCALITIES } from '../data/site'

const points = [
  { x: 168, y: 132 },
  { x: 236, y: 92 },
  { x: 292, y: 148 },
  { x: 126, y: 190 },
  { x: 260, y: 206 },
  { x: 334, y: 112 },
]

export function MapPreview() {
  return (
    <div className="card overflow-hidden">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-72 overflow-hidden bg-brand-deep p-5 text-white sm:p-7">
          <div className="absolute inset-0 pattern-salt opacity-20" />
          <svg
            viewBox="0 0 420 300"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M-20 78c66-26 106 18 160 3 58-16 84-46 144-30 61 16 92 66 156 44v240H-20Z"
              fill="#0e3447"
            />
            <path
              d="M-20 138c55-24 94 18 150 4 56-14 83-45 143-30 58 15 94 63 157 41v180H-20Z"
              fill="#087ea4"
              opacity=".72"
            />
            <path
              d="M-20 188c58-18 101 18 158 4 53-13 89-39 145-25 55 13 88 53 147 34v120H-20Z"
              fill="#27c5d9"
              opacity=".25"
            />
            <path
              d="M18 214c54-18 92 16 146 3 54-14 88-36 143-22 44 11 77 42 123 27"
              fill="none"
              stroke="#baf5fb"
              strokeOpacity=".35"
              strokeWidth="2"
            />
            <path
              d="M50 98c26-17 45-18 68-6 20 10 34 12 54 2 23-12 37-15 58-2 22 14 36 17 58 7"
              fill="none"
              stroke="#f5c542"
              strokeOpacity=".35"
              strokeWidth="2"
            />
            {points.map((point, index) => (
              <g key={LOCALITIES[index]?.name ?? index}>
                <circle cx={point.x} cy={point.y} r="10" fill="#f5c542" opacity=".16" />
                <circle cx={point.x} cy={point.y} r="4" fill="#f5c542" />
                <circle cx={point.x} cy={point.y} r="1.5" fill="#0b1f33" />
              </g>
            ))}
          </svg>

          <div className="relative flex h-full min-h-72 flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sun backdrop-blur">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                Território local
              </span>
              <h2 className="display mt-4 max-w-xs text-3xl font-extrabold leading-tight">
                Da sede aos distritos, tudo perto.
              </h2>
            </div>
            <p className="relative mt-8 max-w-sm text-sm leading-relaxed text-white/65">
              Salinas da Margarida reúne sede, ilhas e comunidades ribeirinhas. Escolha uma
              localidade para encontrar quem atende por perto.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-2 text-sm font-extrabold text-ink">
            <MapPin className="h-4 w-4 text-ocean" aria-hidden="true" />
            Explore por localidade
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {LOCALITIES.map((locality) => (
              <Link
                key={locality.value}
                to={`/localidades/${locality.slug}`}
                className="group flex min-h-12 items-center justify-between gap-2 rounded-xl border border-line bg-surface-2 px-3 text-left transition hover:border-ocean/40 hover:bg-surface"
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-extrabold text-ink">
                    {locality.name}
                  </span>
                  <span className="block truncate text-[10px] text-muted">
                    {locality.description}
                  </span>
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-muted/50 transition group-hover:translate-x-0.5 group-hover:text-ocean"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
          <Link
            to="/profissionais"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-ocean underline-offset-4 hover:underline"
          >
            Ver todos os profissionais
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
