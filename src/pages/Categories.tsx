import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Plus, Search, Sparkles } from 'lucide-react'
import { APP_NAME, CITY_NAME } from '../config'
import { fetchCategories, fetchProfessionals } from '../lib/store'
import type { Category, Professional } from '../lib/types'
import { CategoryCard } from '../components/CategoryCard'
import { Loading } from '../components/Loading'
import { PageHeader } from '../components/PageHeader'
import { SectionHeading } from '../components/SectionHeading'
import { ShareButton } from '../components/ShareButton'

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `Categorias — ${APP_NAME}`
  }, [])

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

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const professional of professionals) {
      if (!professional.category_id) continue
      map.set(professional.category_id, (map.get(professional.category_id) ?? 0) + 1)
    }
    return map
  }, [professionals])

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <PageHeader
        eyebrow="Diretório local"
        title="Encontre por categoria."
        description={`Do conserto da casa aos mercados, materiais de construção, mariscos e transporte, veja os serviços disponíveis em ${CITY_NAME} e nos distritos.`}
        action={
          <Link to="/profissionais" className="btn btn-soft">
            <Search className="h-4 w-4" aria-hidden="true" />
            Buscar profissionais
          </Link>
        }
      />

      {loading ? (
        <Loading label="Carregando categorias..." />
      ) : categories.length ? (
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              count={counts.get(category.id) ?? 0}
            />
          ))}
        </div>
      ) : (
        <div className="card mt-7 p-8 text-center text-sm text-muted">
          Nenhuma categoria cadastrada ainda.
        </div>
      )}

      <section className="pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Sua área não está aqui?"
          title="A rede cresce com a cidade."
          description="Se você trabalha com um serviço que ainda não aparece, crie seu perfil e ajude a completar o mapa de talentos de Salinas."
          action={
            <Link to="/entrar?modo=cadastro" className="btn btn-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Anunciar meu serviço
            </Link>
          }
        />
      </section>

      <section className="mt-12">
        <div className="flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-line bg-surface p-7 text-center sm:flex-row sm:text-left">
          <div>
            <p className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Comunidade
            </p>
            <h2 className="display mt-1 text-2xl font-extrabold text-ink">
              Conhece alguém que deveria estar aqui?
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Compartilhe o app e ajude mais gente a ser encontrada.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <ShareButton label="Compartilhar" className="btn-primary!" />
            <Link to="/sobre" className="btn btn-soft">
              Saber mais
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
