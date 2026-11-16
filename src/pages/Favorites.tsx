import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search } from 'lucide-react'
import { APP_NAME } from '../config'
import { fetchProfessionalsByIds } from '../lib/store'
import type { Professional } from '../lib/types'
import { useFavorites } from '../hooks/useFavorites'
import { EmptyState } from '../components/EmptyState'
import { CardSkeleton } from '../components/Loading'
import { PageHeader } from '../components/PageHeader'
import { ProfessionalCard } from '../components/ProfessionalCard'

export function Favorites() {
  const { ids } = useFavorites()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `Favoritos — ${APP_NAME}`
  }, [])

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
      <PageHeader
        eyebrow="Sua lista"
        title="Meus favoritos."
        description="Os profissionais que você salvou ficam aqui neste dispositivo. Assim é fácil encontrar quem você confia quando precisar."
        action={
          professionals.length ? (
            <p className="text-sm font-extrabold text-muted">
              {professionals.length}{' '}
              {professionals.length === 1 ? 'perfil salvo' : 'perfis salvos'}
            </p>
          ) : null
        }
      />

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
                <Search className="h-4 w-4" aria-hidden="true" />
                Encontrar profissionais
              </Link>
            }
          />
        )}
      </div>

      {professionals.length ? (
        <div className="mt-8 flex justify-center">
          <Link to="/profissionais" className="btn btn-soft">
            <Search className="h-4 w-4" aria-hidden="true" />
            Continuar explorando
          </Link>
        </div>
      ) : null}
    </div>
  )
}
