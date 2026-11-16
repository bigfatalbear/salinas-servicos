import {
  Heart,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
  Waves,
} from 'lucide-react'
import { cn } from '../lib/utils'

const CARDS = [
  {
    initials: 'MM',
    name: 'Márcia Manicure',
    category: 'Manicure',
    location: 'Encarnação',
    color: 'from-coral to-[#b94f3f]',
    rating: '18',
  },
  {
    initials: 'JE',
    name: 'João Eletricista',
    category: 'Elétrica',
    location: 'Centro',
    color: 'from-ocean to-brand-deep',
    rating: '12',
  },
]

export function LocalDiscoveryScene({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Prévia do aplicativo Salinas Serviços com busca por profissionais, perfis locais e contato direto pelo WhatsApp"
      className={cn('overflow-hidden', className)}
      style={{
        background:
          'radial-gradient(circle at 14% 12%, rgba(39,197,217,0.2), transparent 18rem), radial-gradient(circle at 86% 8%, rgba(245,197,66,0.24), transparent 14rem), linear-gradient(160deg, #f7fdfd 0%, #fff8e8 58%, #e8f7f6 100%)',
      }}
    >
      <div aria-hidden="true" className="absolute inset-0">
        <svg
          viewBox="0 0 760 600"
          className="absolute inset-0 h-full w-full text-ocean"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M-30 470c120-46 214 18 340-22 118-37 210-55 480 10"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".16"
            strokeWidth="2"
          />
          <path
            d="M-20 510c142-58 226 24 366-18 128-38 226-42 434 16"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".12"
            strokeWidth="2"
          />
          <path
            d="M0 540c120-42 220 20 352-16 136-37 242-48 408 8v68H0Z"
            fill="#27c5d9"
            opacity=".13"
          />
          <g stroke="currentColor" strokeOpacity=".12" strokeWidth="1.5" fill="none">
            <path d="M96 118 212 84l94 44-38 76-118 12Z" />
            <path d="m212 84 76-54 96 34-24 64-54 44" />
            <path d="m536 96 88 28-14 78-92 12-26-62Z" />
            <path d="m474 272 92-24 56 54-36 74-104-4Z" />
            <path d="m104 300 102-28 38 66-60 58-92-22Z" />
          </g>
          <g fill="currentColor" opacity=".22">
            <circle cx="104" cy="118" r="5" />
            <circle cx="212" cy="84" r="5" />
            <circle cx="536" cy="96" r="5" />
            <circle cx="622" cy="124" r="5" />
            <circle cx="474" cy="272" r="5" />
            <circle cx="104" cy="300" r="5" />
          </g>
          <circle cx="640" cy="86" r="54" fill="#f5c542" opacity=".18" />
          <circle cx="640" cy="86" r="34" fill="#f5c542" opacity=".8" />
        </svg>

        <div className="absolute left-[6%] top-[14%] hidden items-center gap-1.5 rounded-xl border border-line bg-surface/95 px-2.5 py-1.5 shadow-[0_18px_45px_-24px_rgba(11,31,51,0.55)] backdrop-blur sm:flex">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-ocean/10 text-ocean">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-[8px] font-extrabold uppercase tracking-wide text-muted">Centro</p>
            <p className="text-[7px] text-muted/70">perto de você</p>
          </div>
        </div>

        <div className="absolute right-[5%] top-[17%] hidden items-center gap-1.5 rounded-xl border border-line bg-surface/95 px-2.5 py-1.5 shadow-[0_18px_45px_-24px_rgba(11,31,51,0.55)] backdrop-blur sm:flex">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-mangrove text-white">
            <MessageCircle className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-[8px] font-extrabold text-ink">Tem horário?</p>
            <p className="text-[7px] text-muted/70">resposta direta</p>
          </div>
        </div>

        <div className="absolute bottom-[10%] right-[7%] hidden items-center gap-1.5 rounded-xl border border-line bg-surface/95 px-2.5 py-1.5 shadow-[0_18px_45px_-24px_rgba(11,31,51,0.55)] backdrop-blur sm:flex">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-coral/10 text-coral">
            <Heart className="h-3.5 w-3.5 fill-current" />
          </span>
          <div>
            <p className="text-[8px] font-extrabold text-ink">18 recomendações</p>
            <p className="text-[7px] text-muted/70">pela comunidade</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-5">
        <div className="relative w-[72%] max-w-[340px] -rotate-2 rounded-[1.6rem] border border-line bg-surface p-2.5 shadow-[0_30px_80px_-32px_rgba(11,31,51,0.6)] sm:p-3.5">
          <div aria-hidden="true" className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ocean text-white">
                <Waves className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-extrabold text-ink sm:text-[11px]">
                  Salinas Serviços
                </p>
                <p className="flex items-center gap-0.5 text-[7px] text-muted sm:text-[8px]">
                  <MapPin className="h-2 w-2 text-ocean" />
                  Salinas da Margarida
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-sun/25 px-1.5 py-0.5 text-[7px] font-extrabold text-[#8a6513] sm:text-[8px]">
              6 perfis
            </span>
          </div>

          <div
            aria-hidden="true"
            className="mt-2 flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1.5 text-[9px] text-muted sm:text-[10px]"
          >
            <Search className="h-3 w-3 shrink-0 text-ocean" />
            O que você precisa?
          </div>

          <div aria-hidden="true" className="mt-1.5 flex gap-1 overflow-hidden">
            <span className="rounded-full bg-ocean px-1.5 py-0.5 text-[7px] font-bold text-white sm:text-[8px]">
              Manicure
            </span>
            <span className="rounded-full bg-mangrove/10 px-1.5 py-0.5 text-[7px] font-bold text-mangrove sm:text-[8px]">
              Elétrica
            </span>
            <span className="rounded-full bg-sun/25 px-1.5 py-0.5 text-[7px] font-bold text-[#8a6513] sm:text-[8px]">
              Frete
            </span>
          </div>

          <div aria-hidden="true" className="mt-1.5 grid gap-1.5">
            {CARDS.map((card) => (
              <div
                key={card.name}
                className="flex items-center gap-1.5 rounded-xl border border-line bg-sand/55 p-1.5 sm:p-2"
              >
                <span
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-[8px] font-extrabold text-white sm:text-[9px]',
                    card.color,
                  )}
                >
                  {card.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] font-extrabold text-ink sm:text-[10px]">
                    {card.name}
                  </p>
                  <p className="flex items-center gap-0.5 truncate text-[7px] text-muted sm:text-[8px]">
                    <MapPin className="h-2 w-2 shrink-0 text-ocean" />
                    {card.location} · {card.rating} recomendações
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-mangrove px-1.5 py-1 text-[7px] font-bold text-white sm:text-[8px]">
                  <MessageCircle className="h-2.5 w-2.5" />
                  WhatsApp
                </span>
              </div>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="mt-1.5 flex items-center justify-between gap-2 rounded-xl bg-brand-deep px-2.5 py-1.5 text-white"
          >
            <span className="inline-flex items-center gap-1 text-[8px] font-bold sm:text-[9px]">
              <ShieldCheck className="h-3 w-3 text-sun" />
              Contato direto
            </span>
            <span className="inline-flex items-center gap-1 text-[7px] text-white/60 sm:text-[8px]">
              <Star className="h-2.5 w-2.5 text-sun" />
              sem intermediários
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
