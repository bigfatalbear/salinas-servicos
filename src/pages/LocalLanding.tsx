import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, MapPin, MessageCircle, Search, Sparkles } from 'lucide-react'
import { APP_NAME, CITY_NAME } from '../config'
import { specialtiesFor } from '../data/categoryScope'
import { LOCALITIES } from '../data/site'
import { fetchCategories, fetchProfessionals } from '../lib/store'
import type { Category, Professional } from '../lib/types'
import { breadcrumb, seoUrl, useSeo } from '../lib/seo'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { ShareButton } from '../components/ShareButton'

export function LocalLanding() {
  const { categorySlug, localitySlug } = useParams<{
    categorySlug?: string
    localitySlug?: string
  }>()
  const [categories, setCategories] = useState<Category[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([fetchCategories(), fetchProfessionals()])
      .then(([nextCategories, nextProfessionals]) => {
        if (!active) return
        setCategories(nextCategories)
        setProfessionals(nextProfessionals)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const category = categorySlug
    ? categories.find((item) => item.slug === categorySlug) ?? null
    : null
  const locality = localitySlug
    ? LOCALITIES.find((item) => item.slug === localitySlug) ?? null
    : null
  const specialties = useMemo(
    () => (category ? specialtiesFor(category.slug) : []),
    [category],
  )

  const invalid = Boolean(
    (categorySlug && categories.length > 0 && !category) || (localitySlug && !locality),
  )

  const filtered = useMemo(() => {
    return professionals.filter((item) => {
      if (category && item.category?.slug !== category.slug) return false
      if (locality) {
        const neighborhood = (item.neighborhood ?? '').toLowerCase()
        const matches = locality.match.some((value) =>
          neighborhood.includes(value.toLowerCase()),
        )
        if (!matches) return false
      }
      return true
    })
  }, [professionals, category, locality])

  const place = locality?.name ?? CITY_NAME
  const service = category?.name ?? 'Profissionais e serviços'
  const heading = locality ? `${service} em ${place}` : `${service} em ${CITY_NAME}`
  const path = category
    ? `/servicos/${category.slug}${locality ? `/${locality.slug}` : ''}`
    : `/localidades/${locality?.slug ?? ''}`

  const description = category
    ? specialties.length
      ? `Encontre ${category.name.toLowerCase()} em ${place}: ${specialties.slice(0, 5).join(', ')} e mais. Veja perfis da comunidade, fale direto no WhatsApp e recomende quem faz um bom trabalho.`
      : `Encontre ${category.name.toLowerCase()} em ${place}. Veja perfis da comunidade, fale direto no WhatsApp e recomende quem faz um bom trabalho.`
    : `Profissionais e serviços de ${place}, em Salinas da Margarida. Contato direto pelo WhatsApp, sem intermediários e com recomendação da comunidade.`

  const jsonLd = useMemo(() => {
    const list: Array<Record<string, unknown>> = [
      breadcrumb([
        { name: 'Início', path: '/' },
        locality
          ? { name: 'Localidades', path: '/profissionais' }
          : { name: 'Serviços', path: '/categorias' },
        ...(category ? [{ name: category.name, path: `/servicos/${category.slug}` }] : []),
        ...(locality ? [{ name: locality.name, path }] : []),
      ]),
      {
        '@type': 'CollectionPage',
        name: heading,
        description,
        url: seoUrl(path),
        about: { '@type': 'Place', name: `${place}, Salinas da Margarida, Bahia` },
      },
      {
        '@type': 'ItemList',
        name: heading,
        numberOfItems: filtered.length,
        itemListElement: filtered.slice(0, 20).map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.business_name,
          url: seoUrl(`/profissionais/${item.id}`),
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `Como falar com um ${service.toLowerCase()} em ${place}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Abra o perfil desejado e toque em “Chamar no WhatsApp”. O contato é direto com o profissional, sem intermediários.',
            },
          },
          {
            '@type': 'Question',
            name: `O cadastro em ${APP_NAME} é gratuito?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim. Profissionais de Salinas e dos distritos podem criar o perfil gratuitamente e receber contatos pelo WhatsApp.',
            },
          },
          {
            '@type': 'Question',
            name: `Quem atende em ${place}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Os perfis desta página têm atendimento registrado em ${place}. Use a busca para filtrar por serviço, bairro ou sinônimo.`,
            },
          },
          ...(category && specialties.length
            ? [
                {
                  '@type': 'Question',
                  name: `O que está incluído em ${category.name}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `A categoria ${category.name} reúne ${specialties.join(', ')}.`,
                  },
                },
              ]
            : []),
        ],
      },
    ]
    return list
  }, [category, locality, heading, description, path, place, service, specialties, filtered])

  useSeo({ title: heading, description, path, jsonLd })

  if (loading) {
    return (
      <div className="container-wide py-16">
        <Loading label="Carregando serviços..." />
      </div>
    )
  }

  if (invalid || (!category && !locality)) {
    return (
      <div className="container-wide py-16">
        <EmptyState
          icon={Search}
          title="Página não encontrada"
          description="Essa categoria ou localidade ainda não está disponível. Veja todas as categorias e profissionais da cidade."
          action={
            <Link to="/categorias" className="btn btn-primary">
              Ver categorias
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <nav aria-label="Você está aqui" className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-muted">
        <Link to="/" className="transition hover:text-ocean">
          Início
        </Link>
        <span aria-hidden="true">/</span>
        {category ? (
          <>
            <Link to="/categorias" className="transition hover:text-ocean">
              Serviços
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{category.name}</span>
          </>
        ) : (
          <Link to="/profissionais" className="transition hover:text-ocean">
            Profissionais
          </Link>
        )}
        {locality ? (
          <>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{locality.name}</span>
          </>
        ) : null}
      </nav>

      <header className="mt-5 max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-ocean/15 bg-surface/75 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ocean">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {locality ? `${locality.description} · ${CITY_NAME}` : CITY_NAME}
        </span>
        <h1 className="display mt-4 text-balance text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
          {heading}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
        {specialties.length ? (
          <div className="mt-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ocean">
              Esta categoria também inclui
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {specialties.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link to="/profissionais" className="btn btn-primary">
            <Search className="h-4 w-4" aria-hidden="true" />
            Buscar com filtros
          </Link>
          <ShareButton
            label="Compartilhar esta página"
            url={seoUrl(path)}
            title={`${heading} — ${APP_NAME}`}
            text={description}
          />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-2 text-xs font-extrabold text-muted">
            <Sparkles className="h-3.5 w-3.5 text-ocean" aria-hidden="true" />
            {filtered.length} {filtered.length === 1 ? 'perfil' : 'perfis'}
          </span>
        </div>
      </header>

      <section className="pt-9">
        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title={`Ainda não há perfis em ${place}`}
            description="Se você trabalha nessa área, cadastre seu perfil gratuitamente e seja a primeira pessoa a aparecer nesta busca."
            action={
              <Link to="/entrar?modo=cadastro" className="btn btn-primary">
                Criar meu perfil
              </Link>
            }
          />
        )}
      </section>

      <section className="pt-12">
        <h2 className="display text-2xl font-extrabold text-ink sm:text-3xl">
          Outros serviços em {place}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.slice(0, 12).map((item) => (
            <Link
              key={item.id}
              to={`/servicos/${item.slug}${locality ? `/${locality.slug}` : ''}`}
              className="chip"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-10">
        <h2 className="display text-2xl font-extrabold text-ink sm:text-3xl">
          {category ? `${category.name} em outras localidades` : 'Explore por localidade'}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {LOCALITIES.map((item) => (
            <Link
              key={item.slug}
              to={category ? `/servicos/${category.slug}/${item.slug}` : `/localidades/${item.slug}`}
              className="rounded-xl border border-line bg-surface px-3 py-3 text-xs font-extrabold text-ink transition hover:border-ocean/40 hover:text-ocean"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-12">
        <h2 className="display text-2xl font-extrabold text-ink sm:text-3xl">
          Perguntas frequentes
        </h2>
        <div className="mt-4 space-y-2">
          <details className="card p-4" open>
            <summary className="cursor-pointer text-sm font-extrabold text-ink">
              Como falar com um {service.toLowerCase()} em {place}?
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Abra o perfil desejado e toque em “Chamar no WhatsApp”. O contato é direto com o
              profissional, sem intermediários.
            </p>
          </details>
          <details className="card p-4">
            <summary className="cursor-pointer text-sm font-extrabold text-ink">
              O cadastro no {APP_NAME} é gratuito?
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Sim. Profissionais de Salinas e dos distritos podem criar o perfil gratuitamente e
              receber contatos pelo WhatsApp.
            </p>
          </details>
          <details className="card p-4">
            <summary className="cursor-pointer text-sm font-extrabold text-ink">
              Quem atende em {place}?
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Os perfis desta página têm atendimento registrado em {place}. Use a busca para
              filtrar por serviço, bairro ou sinônimo.
            </p>
          </details>
          {category && specialties.length ? (
            <details className="card p-4">
              <summary className="cursor-pointer text-sm font-extrabold text-ink">
                O que está incluído em {category.name}?
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A categoria {category.name} reúne {specialties.join(', ')}. Use a busca para
                encontrar a especialidade que você precisa ou crie seu perfil gratuitamente.
              </p>
            </details>
          ) : null}
        </div>
      </section>

      <section className="pt-12">
        <div className="flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-brand-deep p-7 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-sun">
              Para profissionais
            </p>
            <h2 className="display mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">
              Seu serviço também pode aparecer aqui.
            </h2>
            <p className="mt-1.5 text-sm text-white/65">
              Crie seu perfil gratuitamente e receba contatos direto no WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/entrar?modo=cadastro" className="btn btn-sun">
              Criar meu perfil
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/divulgue"
              className="btn border border-white/20 text-white hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Divulgar o app
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
