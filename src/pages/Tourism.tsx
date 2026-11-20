import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  ExternalLink,
  Heart,
  Lightbulb,
  MapPin,
  Sparkles,
  Waves,
  X,
} from 'lucide-react'
import { APP_NAME, CITY, OFFICIAL_SOURCE } from '../config'
import { LOCALITIES, TOURISM_PLACES, type TourismPlace } from '../data/site'
import { LocalDiscoveryScene } from '../components/LocalDiscoveryScene'
import { LocalityCard } from '../components/LocalityCard'
import { SectionHeading } from '../components/SectionHeading'
import { breadcrumb, seoUrl, useSeo } from '../lib/seo'

const WIKIPEDIA_SOURCE = 'https://pt.wikipedia.org/wiki/Salinas_da_Margarida'

const tourismJsonLd = {
  '@type': 'ItemList',
  name: `Turismo e identidade local de ${CITY}`,
  itemListElement: TOURISM_PLACES.map((place, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: place.title,
    url: seoUrl(`/turismo#${place.slug}`),
  })),
}

export function Tourism() {
  const [open, setOpen] = useState<TourismPlace | null>(null)

  useSeo({
    title: `Turismo e nossa terra — ${APP_NAME}`,
    description:
      'Conheça a história, a cultura e as paisagens de Salinas da Margarida: baía, manguezais, mariscagem, salinas, gastronomia e comunidades do Recôncavo Baiano.',
    path: '/turismo',
    jsonLd: [
      breadcrumb([
        { name: 'Início', path: '/' },
        { name: 'Turismo', path: '/turismo' },
      ]),
      tourismJsonLd,
    ],
  })

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-line bg-surface">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative z-10 p-6 sm:p-9 lg:p-11">
            <p className="eyebrow">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {CITY}
            </p>
            <h1 className="display mt-3 max-w-2xl text-balance text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
              Nossa terra é feita de água, mangue e gente.
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base">
              Salinas da Margarida fica no Recôncavo Baiano, à beira da Baía de Todos-os-Santos.
              A história do sal, da pesca e da mariscagem está presente na paisagem e na vida de
              quem mora aqui.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/profissionais" className="btn btn-primary">
                Encontrar profissionais
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={OFFICIAL_SOURCE}
                target="_blank"
                rel="noreferrer"
                className="btn btn-soft"
              >
                Dados oficiais
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="relative min-h-72 overflow-hidden bg-brand-deep lg:min-h-[30rem]">
            <div className="absolute inset-0 pattern-salt opacity-10" />
            <LocalDiscoveryScene className="absolute inset-0 scale-105" />
          </div>
        </div>
      </section>

      <section className="pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="O que nos cerca"
          title="Paisagens que também são modos de viver."
          description="A baía, os rios e os manguezais não são só cenário: fazem parte do trabalho, da alimentação e da cultura local. Toque em um card para ler a história, o que observar e dicas práticas."
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOURISM_PLACES.map((place) => {
            const Icon = place.icon
            return (
              <button
                key={place.slug}
                type="button"
                onClick={() => setOpen(place)}
                aria-haspopup="dialog"
                className="card card-hover group flex h-full w-full flex-col p-5 text-left"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-ocean">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="display mt-4 text-lg font-extrabold text-ink">{place.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{place.text}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-extrabold text-ocean">
                  Ler história
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          Conteúdo baseado em dados públicos da prefeitura, do IBGE, do IPAC e em registros
          históricos do município.{' '}
          <a
            href={WIKIPEDIA_SOURCE}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-ocean underline-offset-4 hover:underline"
          >
            Ver fontes
            <ExternalLink className="ml-1 inline h-3 w-3" aria-hidden="true" />
          </a>
        </p>
      </section>

      <section className="pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Território"
          title="Da sede aos distritos."
          description="Conheça as localidades que fazem parte do município e encontre profissionais por perto."
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LOCALITIES.map((locality) => (
            <LocalityCard key={locality.value} locality={locality} />
          ))}
        </div>
      </section>

      <section className="pt-14 sm:pt-20">
        <div className="grid gap-8 rounded-[2rem] bg-brand-deep p-7 text-white sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow text-sun!">
              <Waves className="h-3.5 w-3.5" aria-hidden="true" />
              Visite com respeito
            </p>
            <h2 className="display mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
              A beleza daqui também precisa de cuidado.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              Ao visitar a baía, os manguezais e as comunidades, prefira o contato respeitoso,
              valorize o trabalho local e não deixe resíduos. Turismo bom é aquele que também
              cuida de quem vive aqui.
            </p>
          </div>
          <div className="grid gap-2.5">
            {[
              'Respeite o tempo e o trabalho das comunidades',
              'Prefira serviços e produtos locais',
              'Não deixe lixo nas praias, rios ou manguezais',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
              >
                <Heart className="h-4 w-4 shrink-0 text-sun" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-12">
        <div className="flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-line bg-surface p-7 text-center sm:flex-row sm:text-left">
          <div>
            <p className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Rede local
            </p>
            <h2 className="display mt-1 text-2xl font-extrabold text-ink">
              Quem conhece a terra também conhece quem faz.
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Encontre profissionais e serviços de Salinas em um só lugar.
            </p>
          </div>
          <Link to="/profissionais" className="btn btn-primary shrink-0">
            Explorar profissionais
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {open ? (
        <div
          role="presentation"
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-brand-deep/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tourism-dialog-title"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.75rem] bg-surface p-6 shadow-2xl sm:rounded-[1.75rem] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-ocean">
                  <open.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ocean">
                    Turismo e nossa terra
                  </p>
                  <h2
                    id="tourism-dialog-title"
                    className="display mt-1 text-2xl font-extrabold leading-tight text-ink"
                  >
                    {open.title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                autoFocus
                aria-label="Fechar"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-muted transition hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-5 text-pretty text-base font-semibold leading-relaxed text-ink">
              {open.lede}
            </p>

            <h3 className="display mt-6 text-sm font-extrabold uppercase tracking-[0.12em] text-muted">
              História e identidade
            </h3>
            <div className="mt-2 space-y-3">
              {open.story.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            <h3 className="display mt-6 text-sm font-extrabold uppercase tracking-[0.12em] text-muted">
              O que observar
            </h3>
            <ul className="mt-2 space-y-2">
              {open.facts.map((fact) => (
                <li key={fact} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-ocean" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-accent-soft/60 p-4">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-ocean" aria-hidden="true" />
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ocean">
                  Dica de quem é daqui
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{open.tip}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {open.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(null)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-extrabold text-ocean transition hover:bg-accent-soft"
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
