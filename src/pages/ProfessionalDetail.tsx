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
import { APP_NAME, CITY_NAME, WHATSAPP_MESSAGE } from '../config'
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
    setActivePhoto(0)
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
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''
    document.title = `${professional.business_name} — ${APP_NAME}`
    meta?.setAttribute(
      'content',
      professional.description?.slice(0, 155) ||
        `${professional.business_name} em ${CITY_NAME}. Veja informações e fale pelo WhatsApp.`,
    )
    return () => {
      document.title = previousTitle
      meta?.setAttribute('content', previousDescription)
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
          title: `${professional!.business_name} — ${APP_NAME}`,
          text: `Conheça ${professional!.business_name} em ${CITY_NAME}.`,
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/profissionais"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted transition hover:text-ocean"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para profissionais
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="icon-btn h-9! w-9!"
            aria-label="Compartilhar perfil"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => toggle(professional.id)}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-full border transition',
              favorite
                ? 'border-coral bg-coral text-white'
                : 'border-line bg-surface text-muted hover:border-coral hover:text-coral',
            )}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={favorite}
          >
            <Heart className={cn('h-4 w-4', favorite && 'fill-current')} aria-hidden="true" />
          </button>
          {owner ? (
            <Link to={isAdmin ? '/admin' : '/painel'} className="btn btn-soft px-3! py-2!">
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Editar
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="space-y-4">
          <div className="card overflow-hidden">
            {photos.length ? (
              <>
                <div className="relative aspect-[4/3] bg-brand-deep">
                  <img
                    src={photos[activePhoto] ?? photos[0]}
                    alt={`${professional.business_name} — foto ${activePhoto + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {professional.is_featured ? (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-deep shadow">
                      <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
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
                          'h-16 w-20 overflow-hidden rounded-xl border-2 transition',
                          activePhoto === index
                            ? 'border-ocean'
                            : 'border-transparent opacity-70 hover:opacity-100',
                        )}
                        aria-label={`Ver foto ${index + 1}`}
                        aria-pressed={activePhoto === index}
                      >
                        <img src={photo} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-deep to-ocean text-white">
                <span className="display text-7xl font-extrabold">
                  {initials(professional.business_name)}
                </span>
                <CategoryIcon name={professional.category?.icon} className="h-7 w-7 text-sun" />
              </div>
            )}
          </div>

          <div className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{professional.category?.name || 'Serviço local'}</p>
                <h1 className="display mt-1 text-balance text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
                  {professional.business_name}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="h-4 w-4 text-ocean" aria-hidden="true" />
                  {professional.neighborhood || CITY_NAME}
                  {professional.address ? ` · ${professional.address}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-surface-2 px-3.5 py-2 text-xs font-bold text-muted">
                <ThumbsUp className="h-4 w-4 text-ocean" aria-hidden="true" />
                {formatNumber(recommendations)} recomendações
              </div>
            </div>

            {professional.description ? (
              <p className="mt-5 whitespace-pre-line text-pretty text-sm leading-relaxed text-ink/75 sm:text-base">
                {professional.description}
              </p>
            ) : (
              <p className="mt-5 text-sm text-muted">
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
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Chamar no WhatsApp
              </a>
              <button
                type="button"
                onClick={() => void handleRecommend()}
                disabled={recommended || recommending}
                className={cn(
                  'btn flex-1 py-3!',
                  recommended ? 'border border-ocean/30 bg-ocean/10 text-ocean' : 'btn-soft',
                )}
              >
                <ThumbsUp
                  className={cn('h-4 w-4', recommended && 'fill-current')}
                  aria-hidden="true"
                />
                {recommended ? 'Você recomendou' : 'Recomendar'}
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-muted">
              <BadgeCheck className="h-4 w-4 text-ocean" aria-hidden="true" />
              Contato direto com o profissional, sem intermediários.
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="card p-6">
            <h2 className="display text-xl font-extrabold text-ink">Informações</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
                  Categoria
                </dt>
                <dd className="mt-1 flex items-center gap-2 font-bold text-ink">
                  <CategoryIcon
                    name={professional.category?.icon}
                    className="h-4 w-4 text-ocean"
                  />
                  {professional.category?.name || 'Outros serviços'}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
                  WhatsApp
                </dt>
                <dd className="mt-1 font-bold text-ink">
                  {formatPhone(professional.whatsapp)}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
                  Atendimento
                </dt>
                <dd className="mt-1 font-bold text-ink">
                  {professional.neighborhood || CITY_NAME}
                </dd>
              </div>
              {professional.address ? (
                <div>
                  <dt className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
                    Endereço
                  </dt>
                  <dd className="mt-1 leading-relaxed text-ink/70">{professional.address}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <RatingNotice />

          <div className="rounded-2xl border border-sun/40 bg-sun/10 p-5">
            <p className="text-sm font-extrabold text-ink">Gostou do atendimento?</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
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
              <h2 className="display mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
                Outros profissionais
              </h2>
            </div>
            <Link to="/profissionais" className="text-sm font-bold text-ocean hover:underline">
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
