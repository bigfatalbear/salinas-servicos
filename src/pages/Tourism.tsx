import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Heart, MapPin, Sparkles, Waves } from 'lucide-react'
import { APP_NAME, CITY, OFFICIAL_SOURCE } from '../config'
import { LOCALITIES, TOURISM_CARDS } from '../data/site'
import { LocalDiscoveryScene } from '../components/LocalDiscoveryScene'
import { LocalityCard } from '../components/LocalityCard'
import { SectionHeading } from '../components/SectionHeading'

export function Tourism() {
  useEffect(() => {
    document.title = `Turismo e nossa terra — ${APP_NAME}`
  }, [])

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
          description="A baía, os rios e os manguezais não são só cenário: fazem parte do trabalho, da alimentação e da cultura local."
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOURISM_CARDS.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="card card-hover p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-ocean">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="display mt-4 text-lg font-extrabold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            )
          })}
        </div>
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
    </div>
  )
}
