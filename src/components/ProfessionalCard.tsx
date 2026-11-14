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
    <article className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(11,59,90,0.55)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-deep to-tide">
        <Link to={`/profissionais/${professional.id}`} className="block h-full w-full">
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
              <span className="display text-5xl font-bold">{initials(professional.business_name)}</span>
              <CategoryIcon name={professional.category?.icon} className="h-6 w-6 text-gold" />
            </div>
          )}
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {professional.is_featured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-deep-900 shadow-sm">
              <Star className="h-3 w-3 fill-current" />
              Destaque
            </span>
          ) : null}
          {professional.category ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-deep shadow-sm backdrop-blur">
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
              : 'bg-white/90 text-deep hover:bg-white hover:text-coral',
          )}
        >
          <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/profissionais/${professional.id}`}>
          <h3 className="display text-xl font-bold leading-tight text-deep transition group-hover:text-tide">
            {professional.business_name}
          </h3>
        </Link>

        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-deep/55">
          <MapPin className="h-3.5 w-3.5 text-tide" />
          {professional.neighborhood || 'Salinas da Margarida'}
        </p>

        {professional.description ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-deep/65">
            {truncate(professional.description, 110)}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-deep/60">
            <ThumbsUp className="h-3.5 w-3.5 text-tide" />
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
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

