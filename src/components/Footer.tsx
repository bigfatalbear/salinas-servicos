import { Link } from 'react-router-dom'
import { Heart, MapPin, MessageCircle } from 'lucide-react'
import { APP_NAME, CITY, WHATSAPP_MESSAGE } from '../config'
import { whatsappUrl } from '../lib/utils'
import { InstallPrompt } from './InstallPrompt'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-white/60 pb-28 pt-12 lg:pb-10">
      <div className="container-wide">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-deep/60">
              O guia de profissionais de {CITY}. Encontre quem faz, recomende quem você confia e
              fortaleça o trabalho de quem é daqui.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <InstallPrompt />
              <a
                href={whatsappUrl('5571999990000', WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-soft px-4! py-2! text-xs"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com a equipe
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">Navegue</p>
            <ul className="space-y-2.5 text-sm font-medium text-deep/60">
              <li>
                <Link to="/profissionais" className="transition hover:text-tide">
                  Todos os profissionais
                </Link>
              </li>
              <li>
                <Link to="/favoritos" className="transition hover:text-tide">
                  Meus favoritos
                </Link>
              </li>
              <li>
                <Link to="/entrar?modo=cadastro" className="transition hover:text-tide">
                  Cadastrar meu serviço
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="transition hover:text-tide">
                  Sobre o projeto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">Onde estamos</p>
            <p className="flex items-start gap-2 text-sm leading-relaxed text-deep/60">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-tide" />
              {CITY}
              <br />
              Ilha de Itaparica, Bahia
            </p>
            <p className="mt-4 text-xs leading-relaxed text-deep/45">
              Projeto comunitário. Os perfis de demonstração podem ser editados pelos próprios
              profissionais.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-xs text-deep/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {APP_NAME}. Feito para a nossa cidade.
          </p>
          <p className="inline-flex items-center gap-1.5">
            Feito com <Heart className="h-3.5 w-3.5 fill-coral text-coral" /> em Salinas
          </p>
        </div>
      </div>
    </footer>
  )
}

