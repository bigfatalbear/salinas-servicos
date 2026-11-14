import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  MapPin,
  MessageCircle,
  Pencil,
  Share2,
  Star,
  ThumbsUp,
  UserRound,
} from 'lucide-react'
import { WHATSAPP_MESSAGE } from '../config'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  fetchProfessional,
  fetchProfessionals,
  recommendProfessional,
  registerWhatsAppClick,
} from '../lib/store'
import type { Professional } from '../lib/types'
import {
  cn,
  formatNumber,
  formatPhone,
  getVoterToken,
  imageUrl,
  initials,
  readRecommended,
  whatsappUrl,
  writeRecommended,
} from '../lib/utils'
import { useFavorites } from '../hooks/useFavorites'
import { CategoryIcon } from '../components/CategoryIcon'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { RatingNotice } from '../components/RatingNotice'

export function ProfessionalDetail() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const { isFavorite, toggle } = useFavorites()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [similar, setSimilar] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState(0)
  const [recommended, setRecommended] = useState(false)
  const [recommending, setRecommending] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    let active = true
    if (!id) return
    setLoading(true)
    setRecommended(readRecommended().includes(id))
    fetchProfessional(id)
      .then(async (result) => {
        if (!active) return
        setProfessional(result)
        setRecommendations(result?.recommendations ?? 0)
        if (result) {
          const all = await fetchProfessionals({ limit: 30 })
          if (active) {
            setSimilar(
              all
                .filter(
                  (item) =>
                    item.id !== result.id &&
                    (!result.category_id || item.category_id === result.category_id),
                )
                .slice(0, 3),
            )
          }
        }
      })
      .catch(() => {
        if (active) setProfessional(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    if (!professional) return
    const previous = document.title
    document.title = `${professional.business_name} — Salinas Serviços`
    return () => {
      document.title = previous
    }
  }, [professional])

  if (loading) {
    return (
      <div className="container-wide py-16">
        <Loading label="Carregando perfil..." />
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="container-wide py-16">
        <EmptyState
          icon={UserRound}
          title="Perfil não encontrado"
          description="Este profissional pode ter sido removido ou desativado. Veja outros perfis disponíveis."
          action={
            <Link to="/profissionais" className="btn btn-primary">
              Ver profissionais
            </Link>
          }
        />
      </div>
    )
  }

  const photos = [professional.photo_1_url, professional.photo_2_url]
    .filter((photo): photo is string => Boolean(photo))
    .map(imageUrl)
  const favorite = isFavorite(professional.id)
  const owner = user?.id === professional.user_id || isAdmin
  const waMessage = `${WHATSAPP_MESSAGE} Vi o perfil de ${professional.business_name}.`

  async function handleRecommend() {
    if (recommended || recommending || !professional) return
    setRecommending(true)
    try {
      const response = await recommendProfessional(professional.id, getVoterToken())
      setRecommendations(response.recommendations)
      setRecommended(true)
      writeRecommended([...readRecommended(), professional.id])
      toast(
        response.added
          ? 'Obrigado! Sua recomendação ajuda este profissional a aparecer mais.'
          : 'Você já havia recomendado este profissional.',
        'success',
      )
    } catch (error) {
      toast(
        error instanceof Error ? error.message : 'Não foi possível registrar a recomendação.',
        'error',
      )
    } finally {
      setRecommending(false)
    }
  }

  async function handleShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${professional!.business_name} — Salinas Serviços`,
          text: `Conheça ${professional!.business_name} em Salinas da Margarida.`,
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        toast('Link copiado para a área de transferência.', 'success')
      }
    } catch {
      // Compartilhamento cancelado pelo usuário.
    }
  }

  return (
    <div className="container-wide pt-6 sm:pt-10">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          to="/profissionais"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-deep/55 transition hover:text-tide"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para profissionais
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] bg-white text-deep/55 transition hover:border-tide hover:text-tide"
            aria-label="Compartilhar perfil"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggle(professional.id)}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-full border transition',
              favorite
                ? 'border-coral bg-coral text-white'
                : 'border-[var(--line)] bg-white text-deep/55 hover:border-coral hover:text-coral',
            )}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
          </button>
          {owner ? (
            <Link
              to={isAdmin ? '/admin' : '/painel'}
              className="btn btn-soft px-3! py-2!"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-4">
          <div className="card overflow-hidden">
            {photos.length ? (
              <>
                <div className="relative aspect-[4/3] bg-gradient-to-br from-deep to-tide">
                  <img
                    src={photos[activePhoto] ?? photos[0]}
                    alt={`${professional.business_name} — foto ${activePhoto + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {professional.is_featured ? (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-deep-900 shadow">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      Destaque do mês
                    </span>
                  ) : null}
                </div>
                {photos.length > 1 ? (
                  <div className="flex gap-2 p-3">
                    {photos.map((photo, index) => (
                      <button
                        key={photo}
                        type="button"
                        onClick={() => setActivePhoto(index)}
                        className={cn(
                          'h-16 w-20 overflow-hidden rounded-lg border-2 transition',
                          activePhoto === index ? 'border-tide' : 'border-transparent opacity-70',
                        )}
                        aria-label={`Ver foto ${index + 1}`}
                      >
                        <img src={photo} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-gradient-to-br from-deep to-tide text-white">
                <span className="display text-7xl font-bold">{initials(professional.business_name)}</span>
                <CategoryIcon name={professional.category?.icon} className="h-7 w-7 text-gold" />
              </div>
            )}
          </div>

          <div className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{professional.category?.name || 'Serviço local'}</p>
                <h1 className="display mt-1 text-3xl font-bold leading-tight text-deep sm:text-4xl">
                  {professional.business_name}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-deep/55">
                  <MapPin className="h-4 w-4 text-tide" />
                  {professional.neighborhood || 'Salinas da Margarida'}
                  {professional.address ? ` · ${professional.address}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-sand-dark px-3.5 py-2 text-xs font-bold text-deep/65">
                <ThumbsUp className="h-4 w-4 text-tide" />
                {formatNumber(recommendations)} recomendações
              </div>
            </div>

            {professional.description ? (
              <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-deep/70 sm:text-base">
                {professional.description}
              </p>
            ) : (
              <p className="mt-5 text-sm text-deep/50">
                Este profissional ainda não adicionou uma descrição.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={whatsappUrl(professional.whatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                onClick={() => void registerWhatsAppClick(professional.id)}
                className="btn btn-primary flex-1 py-3!"
              >
                <MessageCircle className="h-4 w-4" />
                Chamar no WhatsApp
              </a>
              <button
                type="button"
                onClick={() => void handleRecommend()}
                disabled={recommended || recommending}
                className={cn(
                  'btn flex-1 py-3!',
                  recommended
                    ? 'border border-tide/30 bg-tide/10 text-tide'
                    : 'btn-soft',
                )}
              >
                <ThumbsUp className={cn('h-4 w-4', recommended && 'fill-current')} />
                {recommended ? 'Você recomendou' : 'Recomendar'}
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-deep/40">
              <BadgeCheck className="h-4 w-4 text-tide" />
              Contato direto com o profissional, sem intermediários.
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="card p-6">
            <h2 className="display text-xl font-bold text-deep">Informações</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-deep/35">
                  Categoria
                </dt>
                <dd className="mt-1 flex items-center gap-2 font-semibold text-deep">
                  <CategoryIcon name={professional.category?.icon} className="h-4 w-4 text-tide" />
                  {professional.category?.name || 'Outros serviços'}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-deep/35">
                  WhatsApp
                </dt>
                <dd className="mt-1 font-semibold text-deep">{formatPhone(professional.whatsapp)}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-deep/35">
                  Atendimento
                </dt>
                <dd className="mt-1 font-semibold text-deep">
                  {professional.neighborhood || 'Salinas da Margarida'}
                </dd>
              </div>
              {professional.address ? (
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-deep/35">
                    Endereço
                  </dt>
                  <dd className="mt-1 leading-relaxed text-deep/70">{professional.address}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <RatingNotice />

          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5">
            <p className="text-sm font-bold text-deep">Gostou do atendimento?</p>
            <p className="mt-1 text-xs leading-relaxed text-deep/55">
              Recomende este profissional para que mais pessoas da comunidade encontrem um bom
              serviço.
            </p>
          </div>
        </aside>
      </div>

      {similar.length ? (
        <section className="pt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Talvez você precise</p>
              <h2 className="display mt-1 text-2xl font-bold text-deep sm:text-3xl">
                Outros profissionais
              </h2>
            </div>
            <Link to="/profissionais" className="text-sm font-semibold text-tide hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <ProfessionalCard key={item.id} professional={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
