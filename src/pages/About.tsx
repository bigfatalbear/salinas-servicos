import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ExternalLink,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from 'lucide-react'
import { APP_NAME, CITY, CITY_NAME, OFFICIAL_SOURCE, REGION } from '../config'
import { COMMUNITY_VALUES, HOW_IT_WORKS } from '../data/site'
import { LocalDiscoveryScene } from '../components/LocalDiscoveryScene'
import { SectionHeading } from '../components/SectionHeading'
import { ShareButton } from '../components/ShareButton'

export function About() {
  useEffect(() => {
    document.title = `Sobre — ${APP_NAME}`
  }, [])

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="eyebrow">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {CITY}
          </p>
          <h1 className="display mt-3 max-w-2xl text-balance text-4xl font-extrabold leading-[1.02] text-ink sm:text-6xl">
            Um guia feito por quem vive Salinas.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            O {APP_NAME} nasceu de uma ideia simples: quem trabalha aqui merece ser encontrado com
            facilidade. Reunimos profissionais da sede e dos distritos em um só lugar, com contato
            direto e recomendação da comunidade.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/profissionais" className="btn btn-primary">
              Encontrar profissional
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/entrar?modo=cadastro" className="btn btn-soft">
              <Store className="h-4 w-4" aria-hidden="true" />
              Criar meu perfil
            </Link>
          </div>
        </div>
        <div className="card overflow-hidden p-2.5">
          <LocalDiscoveryScene className="relative aspect-[5/4] rounded-[1.35rem]" />
        </div>
      </section>

      <section className="mt-12 grid gap-3 sm:grid-cols-3">
        {COMMUNITY_VALUES.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-ocean">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="display mt-4 text-xl font-extrabold text-ink">{item.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          )
        })}
      </section>

      <section className="mt-14 grid gap-8 rounded-[2rem] bg-brand-deep p-7 text-white sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="eyebrow text-sun!">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Nossa história
          </p>
          <h2 className="display mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
            Sal, pesca e comunidade.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            A história de Salinas da Margarida está ligada às salinas, à pesca e à mariscagem. As
            primeiras salinas do território datam de 1881, e o município conquistou sua
            emancipação em 27 de julho de 1962. Hoje, a cidade reúne sede, distritos e
            comunidades ribeirinhas com uma identidade profundamente ligada à baía.
          </p>
          <a
            href={OFFICIAL_SOURCE}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sun underline-offset-4 hover:underline"
          >
            Consultar dados oficiais
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <div className="space-y-3">
          {[
            'Sede, distritos e comunidades ribeirinhas',
            'Perfis de profissionais da cidade e dos distritos',
            'Contato direto pelo WhatsApp',
            'Recomendação positiva da comunidade',
            'Destaques escolhidos pela curadoria',
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
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Como funciona"
          title="Tecnologia com cara de cidade pequena."
          description="O app é leve, funciona no celular e pode ser instalado na tela inicial. A ideia é facilitar o dia a dia sem complicar para quem está do outro lado."
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="card p-5">
                <span className="text-xs font-extrabold text-ocean">0{index + 1}</span>
                <span className="mt-3 grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-ocean">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="display mt-4 text-xl font-extrabold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <Sparkles className="h-5 w-5 text-sun" aria-hidden="true" />
          <h3 className="display mt-3 text-xl font-extrabold text-ink">Feito para o celular</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Navegação simples, botões grandes e WhatsApp a um toque. Instale o app e acesse como
            um aplicativo comum.
          </p>
        </div>
        <div className="card p-5">
          <Users className="h-5 w-5 text-ocean" aria-hidden="true" />
          <h3 className="display mt-3 text-xl font-extrabold text-ink">Aberto à comunidade</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Encontrou algum problema ou quer indicar um profissional? Compartilhe o app e ajude a
            melhorar o guia.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-line bg-surface p-7 text-center sm:flex-row sm:text-left">
          <div>
            <p className="eyebrow">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Projeto comunitário
            </p>
            <h2 className="display mt-1 text-2xl font-extrabold text-ink">
              Tem uma sugestão ou quer indicar alguém?
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Estamos construindo este guia junto com a comunidade de {CITY_NAME}.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <ShareButton label="Compartilhar" className="btn-primary!" />
            <Link to="/profissionais" className="btn btn-soft">
              Explorar a rede
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-muted">
        {REGION} · Dados históricos consultados em fontes oficiais.
      </p>
    </div>
  )
}
