import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, MapPin, Search, SlidersHorizontal, Star, X } from 'lucide-react'
import { APP_NAME, CITY_NAME } from '../config'
import { LOCALITIES } from '../data/site'
import { professionalSearchScore } from '../lib/search'
import { fetchCategories, fetchProfessionals } from '../lib/store'
import type { Category, Professional } from '../lib/types'
import { cn } from '../lib/utils'
import { EmptyState } from '../components/EmptyState'
import { CardSkeleton } from '../components/Loading'
import { PageHeader } from '../components/PageHeader'
import { ProfessionalCard } from '../components/ProfessionalCard'

type SortMode = 'recommended' | 'recent' | 'name'

export function Professionals() {
  const [searchParams] = useSearchParams()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState(searchParams.get('categoria') ?? '')
  const [local, setLocal] = useState(searchParams.get('local') ?? '')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [sort, setSort] = useState<SortMode>('recommended')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    document.title = `Profissionais — ${APP_NAME}`
  }, [])

  useEffect(() => {
    let active = true
    Promise.all([fetchProfessionals(), fetchCategories()])
      .then(([nextProfessionals, nextCategories]) => {
        if (!active) return
        setProfessionals(nextProfessionals)
        setCategories(nextCategories)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setText(searchParams.get('q') ?? '')
    setCategory(searchParams.get('categoria') ?? '')
    setLocal(searchParams.get('local') ?? '')
  }, [searchParams])

  const filtered = useMemo(() => {
    const term = text.trim()
    const locality = LOCALITIES.find((item) => item.value === local)

    const result = professionals
      .filter((item) => {
        if (featuredOnly && !item.is_featured) return false
        if (category && item.category?.slug !== category) return false
        if (locality) {
          const neighborhood = (item.neighborhood ?? '').toLowerCase()
          const matches = locality.match.some((value) => neighborhood.includes(value.toLowerCase()))
          if (!matches) return false
        }
        return true
      })
      .map((item) => ({ item, score: term ? professionalSearchScore(item, term) : 0 }))
      .filter(({ score }) => !term || score > 0)

    return result
      .sort((a, b) => {
        if (term && sort === 'recommended') {
          const byScore = b.score - a.score
          if (byScore) return byScore
        }
        if (sort === 'name') return a.item.business_name.localeCompare(b.item.business_name, 'pt-BR')
        if (sort === 'recent') return b.item.created_at.localeCompare(a.item.created_at)
        return b.item.recommendations - a.item.recommendations
      })
      .map(({ item }) => item)
  }, [professionals, text, category, local, featuredOnly, sort])

  const hasFilters = Boolean(text || category || local || featuredOnly)
  const activeCount = [text, category, local, featuredOnly].filter(Boolean).length

  function clearFilters() {
    setText('')
    setCategory('')
    setLocal('')
    setFeaturedOnly(false)
  }

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <PageHeader
        eyebrow="Diretório local"
        title="Profissionais de Salinas."
        description={`Busque por nome, serviço, sinônimo ou localidade. Ex.: unha, cftv, mudança, faxina, bebida ou festa. Todos os perfis são da comunidade de ${CITY_NAME}.`}
        action={
          <p className="text-sm font-extrabold text-muted">
            {loading
              ? 'Carregando...'
              : `${filtered.length} ${filtered.length === 1 ? 'perfil' : 'perfis'}`}
          </p>
        }
      />

      <div className="card mt-6 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Buscar profissional</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Ex.: eletricista, unha, cftv, frete..."
              className="field min-h-12 rounded-full! pl-11!"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((current) => !current)}
              className={cn('btn btn-soft shrink-0', showFilters && 'border-ocean! text-ocean!')}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filtros
              {hasFilters ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ocean px-1 text-[10px] text-white">
                  {activeCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setFeaturedOnly((current) => !current)}
              aria-pressed={featuredOnly}
              className={cn(
                'btn shrink-0 border',
                featuredOnly
                  ? 'border-sun bg-sun text-brand-deep'
                  : 'border-line bg-surface text-muted hover:border-ocean hover:text-ocean',
              )}
            >
              <Star
                className={cn('h-4 w-4', featuredOnly && 'fill-current')}
                aria-hidden="true"
              />
              Destaques
            </button>
          </div>
        </div>

        {showFilters ? (
          <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <label>
              <span className="field-label">Categoria</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="field"
              >
                <option value="">Todas as categorias</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="field-label">Localidade</span>
              <select
                value={local}
                onChange={(event) => setLocal(event.target.value)}
                className="field"
              >
                <option value="">Todas as localidades</option>
                {LOCALITIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="field-label">Ordenar por</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortMode)}
                className="field"
              >
                <option value="recommended">Mais recomendados</option>
                <option value="recent">Mais recentes</option>
                <option value="name">Nome (A–Z)</option>
              </select>
            </label>
          </div>
        ) : null}

        {hasFilters ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">
              <Filter className="h-3 w-3" aria-hidden="true" />
              Filtros ativos
            </span>
            {text ? (
              <button type="button" onClick={() => setText('')} className="chip chip-active">
                “{text}” <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ) : null}
            {category ? (
              <button type="button" onClick={() => setCategory('')} className="chip chip-active">
                {categories.find((item) => item.slug === category)?.name ?? category}
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ) : null}
            {local ? (
              <button type="button" onClick={() => setLocal('')} className="chip chip-active">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {local}
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ) : null}
            {featuredOnly ? (
              <button
                type="button"
                onClick={() => setFeaturedOnly(false)}
                className="chip chip-active"
              >
                Destaques <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-ocean underline-offset-2 hover:underline"
            >
              Limpar tudo
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-7">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Nenhum profissional encontrado"
            description="Tente um sinônimo (unha, cftv, mudança, faxina), outro bairro ou remova os filtros para ver todos os perfis."
            action={
              <button type="button" onClick={clearFilters} className="btn btn-primary">
                Limpar filtros
              </button>
            }
          />
        )}
      </div>
    </div>
  )
}
