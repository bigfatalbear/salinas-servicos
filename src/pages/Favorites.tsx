import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search } from 'lucide-react'
import { fetchProfessionalsByIds } from '../lib/store'
import type { Professional } from '../lib/types'
import { useFavorites } from '../hooks/useFavorites'
import { EmptyState } from '../components/EmptyState'
import { CardSkeleton } from '../components/Loading'
import { ProfessionalCard } from '../components/ProfessionalCard'

export function Favorites() {
  const { ids } = useFavorites()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchProfessionalsByIds(ids)
      .then((result) => {
        if (active) setProfessionals(result)
      })
      .catch(() => {
        if (active) setProfessionals([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [ids])

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Sua lista</p>
          <h1 className="display mt-2 text-4xl font-bold text-deep sm:text-5xl">Meus favoritos</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-deep/60">
            Os profissionais que você salvou ficam aqui neste dispositivo. Assim é fácil encontrar
            quem você confia quando precisar.
          </p>
        </div>
        {professionals.length ? (
          <p className="text-sm font-semibold text-deep/45">
            {professionals.length} {professionals.length === 1 ? 'perfil salvo' : 'perfis salvos'}
          </p>
        ) : null}
      </div>

      <div className="mt-7">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : professionals.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Sua lista está vazia"
            description="Toque no coração dos perfis que você gostou para salvar aqui. Seus favoritos ficam guardados neste dispositivo."
            action={
              <Link to="/profissionais" className="btn btn-primary">
                <Search className="h-4 w-4" />
                Encontrar profissionais
              </Link>
            }
          />
        )}
      </div>

      {professionals.length ? (
        <div className="mt-8 flex justify-center">
          <Link to="/profissionais" className="btn btn-soft">
            <Search className="h-4 w-4" />
            Continuar explorando
          </Link>
        </div>
      ) : null}
    </div>
  )
}
