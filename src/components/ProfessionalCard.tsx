import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, MessageCircle, Star, ThumbsUp } from 'lucide-react'
import { WHATSAPP_MESSAGE } from '../config'
import { registerWhatsAppClick } from '../lib/store'
import type { Professional } from '../lib/types'
import { cn, formatNumber, imageUrl, initials, truncate, whatsappUrl } from '../lib/utils'
import { CategoryIcon } from './CategoryIcon'
import { useFavorites } from '../hooks/useFavorites'

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const { isFavorite, toggle } = useFavorites()
  const [imageFailed, setImageFailed] = useState(false)
  const photo = imageUrl(professional.photo_1_url)
  const favorite = isFavorite(professional.id)

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-deep to-ocean">
        <Link
          to={`/profissionais/${professional.id}`}
          className="block h-full w-full"
          aria-label={`Ver perfil de ${professional.business_name}`}
        >
          {photo && !imageFailed ? (
            <img
              src={photo}
              alt={`Foto de ${professional.business_name}`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/90">
              <span className="display text-5xl font-extrabold">
                {initials(professional.business_name)}
              </span>
              <CategoryIcon
                name={professional.category?.icon}
                className="h-6 w-6 text-sun"
              />
            </div>
          )}
        </Link>

        <div className="absolute left-3 top-3 flex max-w-[calc(100%-4rem)] flex-wrap gap-2">
          {professional.is_featured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-sun px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-brand-deep shadow-sm">
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              Destaque
            </span>
          ) : null}
          {professional.category ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-ink shadow-sm backdrop-blur">
              <CategoryIcon name={professional.category.icon} className="h-3 w-3" />
              {professional.category.name}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => toggle(professional.id)}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={favorite}
          className={cn(
            'absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full shadow-sm backdrop-blur transition',
            favorite
              ? 'bg-coral text-white'
              : 'bg-surface/90 text-ink hover:bg-surface hover:text-coral',
          )}
        >
          <Heart className={cn('h-4 w-4', favorite && 'fill-current')} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/profissionais/${professional.id}`}>
          <h3 className="display text-xl font-extrabold leading-tight text-ink transition group-hover:text-ocean">
            {professional.business_name}
          </h3>
        </Link>

        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-muted">
          <MapPin className="h-3.5 w-3.5 text-ocean" aria-hidden="true" />
          {professional.neighborhood || 'Salinas da Margarida'}
        </p>

        {professional.description ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
            {truncate(professional.description, 110)}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
            <ThumbsUp className="h-3.5 w-3.5 text-ocean" aria-hidden="true" />
            {formatNumber(professional.recommendations)}
            <span className="hidden sm:inline">recomendações</span>
          </span>

          <a
            href={whatsappUrl(professional.whatsapp, `${WHATSAPP_MESSAGE} Vi seu perfil no app.`)}
            target="_blank"
            rel="noreferrer"
            onClick={() => void registerWhatsAppClick(professional.id)}
            className="btn btn-primary px-4! py-2! text-xs"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
