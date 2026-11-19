import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Handshake,
  MapPin,
  Megaphone,
  MessageCircle,
  QrCode,
  Sparkles,
  Store,
  Users,
} from 'lucide-react'
import { APP_NAME, CITY, CITY_NAME } from '../config'
import {
  BUSINESS_CATEGORIES,
  LOCALITIES,
  TOURISM_HIGHLIGHTS,
  TRUST_POINTS,
} from '../data/site'
import { fetchCategories, fetchProfessionals } from '../lib/store'
import { useSeo } from '../lib/seo'
import type { Category, Professional } from '../lib/types'
import { CategoryCard } from '../components/CategoryCard'
import { HowItWorks } from '../components/HowItWorks'
import { Loading } from '../components/Loading'
import { MapPreview } from '../components/MapPreview'
import { PollCard } from '../components/PollCard'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { SalinasBanner } from '../components/SalinasBanner'
import { SearchBar } from '../components/SearchBar'
import { SectionHeading } from '../components/SectionHeading'
import { ShareButton } from '../components/ShareButton'

export function Home() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<Professional[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [locality, setLocality] = useState('')

  useSeo({
    title: `${APP_NAME} — ${CITY_NAME}`,
    description:
      'Encontre profissionais, serviços e comércios de Salinas da Margarida. Contato direto pelo WhatsApp e recomendação da comunidade.',
    path: '/',
    jsonLd: [
      {
        '@type': 'WebSite',
        name: APP_NAME,
        url: 'https://bigfatalbear.github.io/salinas-servicos/',
        inLanguage: 'pt-BR',
        potentialAction: {
          '@type': 'SearchAction',
          target:
            'https://bigfatalbear.github.io/salinas-servicos/profissionais?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        name: APP_NAME,
        url: 'https://bigfatalbear.github.io/salinas-servicos/',
        areaServed: { '@type': 'City', name: CITY_NAME },
      },
    ],
  })

  useEffect(() => {
    let active = true
    Promise.all([
      fetchCategories(),
      fetchProfessionals({ featuredOnly: true, limit: 3 }),
      fetchProfessionals(),
    ])
      .then(([nextCategories, nextFeatured, nextProfessionals]) => {
        if (!active) return
        setCategories(nextCategories)
        setFeatured(nextFeatured)
        setProfessionals(nextProfessionals)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (category) params.set('categoria', category)
    if (locality) params.set('local', locality)
    navigate(`/profissionais${params.size ? `?${params.toString()}` : ''}`)
  }

  const highlightProfessionals = featured.length ? featured : professionals.slice(0, 3)

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const professional of professionals) {
      if (!professional.category_id) continue
      map.set(professional.category_id, (map.get(professional.category_id) ?? 0) + 1)
    }
    return map
  }, [professionals])

  return (
    <div className="overflow-hidden">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_8%,rgba(39,197,217,0.18),transparent_34rem),radial-gradient(circle_at_8%_70%,rgba(245,197,66,0.18),transparent_28rem)]" />
        <div className="container-wide pt-5 sm:pt-7">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/entrar?modo=cadastro"
              className="group relative flex min-h-[8rem] flex-col justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-sun to-[#ffd968] p-4 text-brand-deep! shadow-[0_18px_36px_-20px_rgba(245,197,66,0.85)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:brightness-105 sm:min-h-[6rem] sm:flex-row sm:items-center sm:gap-3 sm:p-5"
            >
              <span className="flex w-full items-start justify-between sm:w-auto sm:items-center">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-deep/10 sm:h-11 sm:w-11">
                  <Megaphone className="h-5 w-5" aria-hidden="true" />
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 opacity-60 transition duration-300 group-hover:translate-x-0.5 sm:hidden"
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-extrabold leading-tight">
                  Anunciar
                </span>
                <span className="mt-0.5 block text-xs font-semibold leading-snug text-brand-deep/70">
                  Divulgue seu serviço
                </span>
              </span>
              <ArrowRight
                className="ml-auto hidden h-4 w-4 shrink-0 opacity-60 transition duration-300 group-hover:translate-x-0.5 sm:block"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/profissionais"
              className="group relative flex min-h-[8rem] flex-col justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-ocean to-ocean-dark p-4 text-white! shadow-[0_18px_36px_-20px_rgba(8,126,164,0.9)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:min-h-[6rem] sm:flex-row sm:items-center sm:gap-3 sm:p-5"
            >
              <span className="flex w-full items-start justify-between sm:w-auto sm:items-center">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 sm:h-11 sm:w-11">
                  <Handshake className="h-5 w-5" aria-hidden="true" />
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 opacity-60 transition duration-300 group-hover:translate-x-0.5 sm:hidden"
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-extrabold leading-tight">
                  Contratar
                </span>
                <span className="mt-0.5 block text-xs font-semibold leading-snug text-white/75">
                  Encontre profissionais
                </span>
              </span>
              <ArrowRight
                className="ml-auto hidden h-4 w-4 shrink-0 opacity-60 transition duration-300 group-hover:translate-x-0.5 sm:block"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
        <div className="container-wide grid gap-10 pb-12 pt-9 sm:pt-14 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:pb-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-ocean/15 bg-surface/75 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ocean backdrop-blur">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {CITY}
            </span>

            <h1 className="display mt-5 max-w-2xl text-balance text-[2.65rem] font-extrabold leading-[1.02] text-ink sm:text-6xl">
              Quem faz Salinas acontecer,{' '}
              <span className="relative whitespace-nowrap text-gold-ink">
                num só lugar
                <svg
                  className="absolute -bottom-1 left-0 h-3 w-full text-sun/80"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9c38-7 92-8 196-3"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Encontre eletricistas, manicures, fretes, diaristas, comércios e outros talentos da
              nossa cidade. Sem intermediários: você fala direto com quem faz.
            </p>

            <div className="mt-7">
              <SearchBar
                categories={categories}
                localities={LOCALITIES}
                query={query}
                category={category}
                locality={locality}
                onQueryChange={setQuery}
                onCategoryChange={setCategory}
                onLocalityChange={setLocality}
                onSubmit={handleSearch}
              />
              <p className="mt-2 px-1 text-[11px] font-semibold leading-relaxed text-muted">
                Busque por serviço, sinônimo ou bairro: unha, cftv, mudança, faxina, bebida, festa.
              </p>
            </div>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
              {TRUST_POINTS.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ocean/10 text-ocean">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-ink">{item.label}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg animate-fade-up lg:max-w-none">
            <div className="absolute -left-5 top-10 hidden h-24 w-24 rounded-full border-[12px] border-sun/25 sm:block" />
            <div className="absolute -bottom-7 -right-4 hidden h-36 w-36 rounded-full bg-water/10 sm:block" />
            <div className="card relative overflow-hidden p-2.5 shadow-[var(--shadow-float)]">
              <SalinasBanner className="aspect-[16/9] rounded-[1.35rem]" />
            </div>

          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface/55">
        <div className="container-wide grid grid-cols-3 divide-x divide-line py-5 text-center">
          <Link
            to="/categorias"
            className="group flex flex-col items-center rounded-lg px-2 py-1 transition hover:bg-surface-2"
            aria-label="Ver todas as categorias"
          >
            <p className="display text-2xl font-extrabold text-ink transition group-hover:text-ocean sm:text-3xl">
              {loading ? '—' : categories.length}
            </p>
            <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted transition group-hover:text-ocean sm:text-xs">
              Categorias
            </p>
          </Link>
          <Link
            to="/profissionais"
            className="group flex flex-col items-center rounded-lg px-2 py-1 transition hover:bg-surface-2"
            aria-label="Ver todos os profissionais"
          >
            <p className="display text-2xl font-extrabold text-ink transition group-hover:text-ocean sm:text-3xl">
              {loading ? '—' : professionals.length}
            </p>
            <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted transition group-hover:text-ocean sm:text-xs">
              Profissionais
            </p>
          </Link>
          <a
            href="#localidades"
            className="group flex flex-col items-center rounded-lg px-2 py-1 transition hover:bg-surface-2"
            aria-label="Explorar por localidade"
          >
            <p className="display text-2xl font-extrabold text-ink transition group-hover:text-ocean sm:text-3xl">
              {LOCALITIES.length}
            </p>
            <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted transition group-hover:text-ocean sm:text-xs">
              Localidades
            </p>
          </a>
        </div>
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Encontre por serviço"
          title="O que você precisa hoje?"
          description="Escolha uma categoria e veja quem está disponível em Salinas e nos distritos."
          action={
            <Link to="/categorias" className="btn btn-soft">
              Ver categorias
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        {loading ? (
          <Loading label="Carregando categorias..." />
        ) : (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((item) => (
              <CategoryCard
                key={item.id}
                category={item}
                count={categoryCounts.get(item.id) ?? 0}
              />
            ))}
          </div>
        )}
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Destaques do mês"
          title="Profissionais em evidência"
          description="Perfis escolhidos pela curadoria do Salinas Serviços para aparecerem primeiro."
          action={
            <Link to="/profissionais" className="btn btn-soft">
              Explorar todos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        {loading ? (
          <Loading label="Carregando destaques..." />
        ) : highlightProfessionals.length ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlightProfessionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <div className="card mt-7 p-8 text-center text-sm text-muted">
            Os destaques do mês ainda estão sendo escolhidos. Enquanto isso, veja todos os
            profissionais cadastrados.
          </div>
        )}
      </section>

      <section id="localidades" className="container-wide scroll-mt-24 pt-14 sm:pt-20">
        <MapPreview />
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Como funciona"
          title="Simples para quem procura. Justo para quem trabalha."
          description="Um caminho curto entre a necessidade e quem pode resolver."
        />
        <div className="mt-7">
          <HowItWorks />
        </div>
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Comércio local"
          title="Salinas também é feita de balcão, porta aberta e conversa."
          description="Estamos preparando um espaço para mercados, restaurantes, lojas e outros negócios da cidade."
          action={
            <Link to="/comercios" className="btn btn-soft">
              Conhecer o espaço
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BUSINESS_CATEGORIES.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                to="/comercios"
                className="group flex flex-col items-center rounded-2xl border border-line bg-surface p-4 text-center transition hover:-translate-y-0.5 hover:border-ocean/40 hover:shadow-md"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-surface-2 text-ocean transition group-hover:bg-ocean group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-3 text-xs font-extrabold text-ink">{item.title}</span>
                <span className="mt-1 hidden text-[10px] leading-relaxed text-muted sm:block">
                  {item.text}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-deep p-6 text-white sm:p-9">
          <div className="absolute inset-0 pattern-salt opacity-10" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sun">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Nossa terra
              </span>
              <h2 className="display mt-4 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
                Entre a baía, o mangue e a memória das salinas.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                Salinas da Margarida carrega a história do sal, da pesca e da mariscagem. Conhecer
                esse território é também valorizar quem vive e trabalha aqui.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/turismo" className="btn btn-sun">
                  Conhecer nossa terra
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/sobre"
                  className="btn border border-white/20 text-white hover:bg-white/10"
                >
                  Sobre o projeto
                </Link>
              </div>
            </div>
            <div className="grid gap-2.5">
              {TOURISM_HIGHLIGHTS.slice(0, 3).map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-sun">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold">{item.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/55">{item.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <PollCard />
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Novidades"
          title="Mais gente daqui"
          description="Perfis recentes e outros serviços que fazem parte da nossa rede."
          action={
            <Link to="/profissionais" className="btn btn-soft">
              Ver todos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        {loading ? (
          <Loading label="Carregando profissionais..." />
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {professionals.slice(0, 4).map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        )}
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <div className="grid gap-8 rounded-[2rem] bg-brand-deep p-7 text-white sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sun">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              Para profissionais
            </span>
            <h2 className="display mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Seu trabalho merece ser encontrado.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              Crie seu perfil gratuitamente, adicione duas fotos, descreva seu serviço e receba
              contatos direto no WhatsApp. Sem comissão e sem letras miúdas.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/entrar?modo=cadastro" className="btn btn-sun">
                Criar meu perfil
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <ShareButton
                label="Indicar o app"
                className="border-white/20! bg-white/5! text-white! hover:bg-white/10!"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { number: '01', title: 'Cadastre', text: 'Crie sua conta e monte o perfil.' },
              { number: '02', title: 'Apareça', text: 'Seja encontrado na busca.' },
              { number: '03', title: 'Atenda', text: 'Receba contatos no WhatsApp.' },
            ].map((step) => (
              <div key={step.number} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="display text-2xl font-extrabold text-sun">{step.number}</span>
                <p className="mt-3 text-sm font-extrabold">{step.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/50">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <div className="flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-line bg-surface p-7 text-center sm:flex-row sm:p-8 sm:text-left">
          <div>
            <p className="eyebrow">Comunidade</p>
            <h2 className="display mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
              Indique um profissional de confiança.
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Conhece alguém que faz um trabalho incrível? Compartilhe o app com essa pessoa.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <ShareButton label="Compartilhar o app" className="btn-primary!" />
            <Link to="/divulgue" className="btn btn-soft">
              <QrCode className="h-4 w-4" aria-hidden="true" />
              Divulgar na cidade
            </Link>
            <Link to="/sobre" className="btn btn-soft">
              <Store className="h-4 w-4" aria-hidden="true" />
              Sobre o projeto
            </Link>
          </div>
        </div>
      </section>

      <p className="container-wide mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
        {professionals.length} perfis carregados nesta visita.
      </p>
    </div>
  )
}
