import { Link } from 'react-router-dom'
import { Heart, MapPin } from 'lucide-react'
import { APP_NAME, APP_TAGLINE, CITY, OFFICIAL_SOURCE, REGION } from '../config'
import { NAV_LINKS } from '../data/site'
import { InstallPrompt } from './InstallPrompt'
import { Logo } from './Logo'
import { ShareButton } from './ShareButton'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface/70 pb-28 pt-12 lg:pb-10">
      <div className="container-wide">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.8fr_0.9fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {APP_TAGLINE} O guia de profissionais e serviços de {CITY}, feito para aproximar
              quem precisa de quem faz.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <InstallPrompt />
              <ShareButton label="Compartilhar" />
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm font-semibold text-ink/65">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition hover:text-ocean">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">
              Para você
            </p>
            <ul className="space-y-2.5 text-sm font-semibold text-ink/65">
              <li>
                <Link to="/entrar?modo=cadastro" className="transition hover:text-ocean">
                  Anunciar meu serviço
                </Link>
              </li>
              <li>
                <Link to="/favoritos" className="transition hover:text-ocean">
                  Meus favoritos
                </Link>
              </li>
              <li>
                <Link to="/entrar" className="transition hover:text-ocean">
                  Entrar no painel
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="transition hover:text-ocean">
                  Sobre o projeto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">
              Nossa terra
            </p>
            <p className="flex items-start gap-2 text-sm leading-relaxed text-ink/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ocean" aria-hidden="true" />
              <span>
                {CITY}
                <br />
                {REGION}
              </span>
            </p>
            <a
              href={OFFICIAL_SOURCE}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-xs font-bold text-ocean underline-offset-2 hover:underline"
            >
              Dados oficiais do município
            </a>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Projeto comunitário. Perfis de demonstração podem ser editados pelos próprios
              profissionais.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {APP_NAME}. Feito para a nossa cidade.
          </p>
          <p className="inline-flex items-center gap-1.5">
            Feito com <Heart className="h-3.5 w-3.5 fill-coral text-coral" aria-hidden="true" /> em
            Salinas
          </p>
        </div>
      </div>
    </footer>
  )
}
