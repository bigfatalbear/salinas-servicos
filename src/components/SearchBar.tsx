import { type FormEvent } from 'react'
import { ArrowRight, ChevronDown, MapPin, Search } from 'lucide-react'
import type { Category } from '../lib/types'
import type { Locality } from '../data/site'

export function SearchBar({
  categories,
  localities,
  query,
  category,
  locality,
  onQueryChange,
  onCategoryChange,
  onLocalityChange,
  onSubmit,
}: {
  categories: Category[]
  localities: Locality[]
  query: string
  category: string
  locality: string
  onQueryChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onLocalityChange: (value: string) => void
  onSubmit: (event: FormEvent) => void
}) {
  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Buscar profissionais e serviços"
      className="card grid gap-2 p-2.5 shadow-[var(--shadow-float)] sm:grid-cols-2"
    >
      <label className="relative block min-w-0 sm:order-1">
        <span className="sr-only">O que você procura?</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Ex.: eletricista, unha, frete, cftv..."
          className="field min-h-12 rounded-full! pl-11!"
        />
      </label>

      <label className="relative block min-w-0 sm:order-3">
        <span className="sr-only">Localização</span>
        <MapPin
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <select
          value={locality}
          onChange={(event) => onLocalityChange(event.target.value)}
          className="field min-h-12 appearance-none rounded-full! pl-10! pr-9!"
        >
          <option value="">Todas as localidades</option>
          {localities.map((item) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </label>

      <label className="relative block min-w-0 sm:order-4">
        <span className="sr-only">Categoria</span>
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="field min-h-12 appearance-none rounded-full! px-4! pr-9!"
        >
          <option value="">Todas as categorias</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </label>

      <button type="submit" className="btn btn-primary min-h-12 px-6! sm:order-2">
        Encontrar serviço
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}
