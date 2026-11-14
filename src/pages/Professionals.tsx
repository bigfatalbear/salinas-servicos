import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Search, SlidersHorizontal, Star, X } from 'lucide-react'
import { CITY } from '../config'
import { fetchCategories, fetchProfessionals } from '../lib/store'
import type { Category, Professional } from '../lib/types'
import { cn } from '../lib/utils'
import { EmptyState } from '../components/EmptyState'
import { CardSkeleton } from '../components/Loading'
import { ProfessionalCard } from '../components/ProfessionalCard'

type SortMode = 'recommended' | 'recent' | 'name'

export function Professionals() {
  const [searchParams] = useSearchParams()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState(searchParams.get('categoria') ?? '')
  const [neighborhood, setNeighborhood] = useState('')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [sort, setSort] = useState<SortMode>('recommended')
  const [showFilters, setShowFilters] = useState(false)

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
  }, [searchParams])

  const neighborhoods = useMemo(
    () =>
      Array.from(
        new Set(
          professionals
            .map((item) => item.neighborhood?.trim())
            .filter((item): item is string => Boolean(item)),
        ),
      ).sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [professionals],
  )

  const filtered = useMemo(() => {
    const term = text.trim().toLowerCase()
    const result = professionals.filter((item) => {
      if (featuredOnly && !item.is_featured) return false
      if (category && item.category?.slug !== category) return false
      if (neighborhood && item.neighborhood !== neighborhood) return false
      if (!term) return true
      return [item.business_name, item.description, item.category?.name, item.neighborhood]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    })

    return result.sort((a, b) => {
      if (sort === 'name') return a.business_name.localeCompare(b.business_name, 'pt-BR')
      if (sort === 'recent') return b.created_at.localeCompare(a.created_at)
      return b.recommendations - a.recommendations
    })
  }, [professionals, text, category, neighborhood, featuredOnly, sort])

  const hasFilters = Boolean(text || category || neighborhood || featuredOnly)
  const activeCount = [text, category, neighborhood, featuredOnly].filter(Boolean).length

  function clearFilters() {
    setText('')
    setCategory('')
    setNeighborhood('')
    setFeaturedOnly(false)
  }

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Diretório local</p>
          <h1 className="display mt-2 text-4xl font-bold text-deep sm:text-5xl">
            Profissionais de Salinas
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-deep/60">
            Busque por nome, serviço ou bairro. Todos os perfis são da comunidade de {CITY}.
          </p>
        </div>
        <p className="text-sm font-semibold text-deep/45">
          {loading ? 'Carregando...' : `${filtered.length} ${filtered.length === 1 ? 'perfil' : 'perfis'}`}
        </p>
      </div>

      <div className="card mt-6 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Buscar profissional</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-deep/35" />
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Busque por nome, serviço ou bairro..."
              className="field rounded-full! py-3! pl-11!"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((current) => !current)}
              className={cn('btn btn-soft shrink-0', showFilters && 'border-tide! text-tide!')}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {hasFilters ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-tide px-1 text-[10px] text-white">
                  {activeCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setFeaturedOnly((current) => !current)}
              className={cn(
                'btn shrink-0 border',
                featuredOnly
                  ? 'border-gold bg-gold text-deep-900'
                  : 'border-[var(--line)] bg-white text-deep/60',
              )}
            >
              <Star className={cn('h-4 w-4', featuredOnly && 'fill-current')} />
              Destaques
            </button>
          </div>
        </div>

        {showFilters ? (
          <div className="mt-4 grid gap-3 border-t border-[var(--line)] pt-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <span className="field-label">Bairro ou distrito</span>
              <select
                value={neighborhood}
                onChange={(event) => setNeighborhood(event.target.value)}
                className="field"
              >
                <option value="">Todos os bairros</option>
                {neighborhoods.map((item) => (
                  <option key={item} value={item}>
                    {item}
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
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-deep/35">
              <Filter className="h-3 w-3" />
              Filtros ativos
            </span>
            {text ? (
              <button type="button" onClick={() => setText('')} className="chip chip-active">
                “{text}” <X className="h-3 w-3" />
              </button>
            ) : null}
            {category ? (
              <button type="button" onClick={() => setCategory('')} className="chip chip-active">
                {categories.find((item) => item.slug === category)?.name ?? category}
                <X className="h-3 w-3" />
              </button>
            ) : null}
            {neighborhood ? (
              <button
                type="button"
                onClick={() => setNeighborhood('')}
                className="chip chip-active"
              >
                {neighborhood} <X className="h-3 w-3" />
              </button>
            ) : null}
            {featuredOnly ? (
              <button
                type="button"
                onClick={() => setFeaturedOnly(false)}
                className="chip chip-active"
              >
                Destaques <X className="h-3 w-3" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-tide underline-offset-2 hover:underline"
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
            description="Tente buscar por outro serviço, bairro ou remova os filtros para ver todos os perfis."
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
