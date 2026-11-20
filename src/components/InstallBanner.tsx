import { useEffect, useState } from 'react'
import { Download, Share, Smartphone, X } from 'lucide-react'
import { INSTALL_KEY } from '../config'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_DAYS = 14

function isIos() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function wasRecentlyDismissed() {
  try {
    const raw = localStorage.getItem(INSTALL_KEY)
    if (!raw) return false
    const dismissedAt = Number(raw)
    if (!Number.isFinite(dismissedAt)) return false
    return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export function InstallBanner() {
  const [visible, setVisible] = useState(() => !isStandalone() && !wasRecentlyDismissed())
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault()
      setPromptEvent(event as BeforeInstallPromptEvent)
      setVisible(true)
    }
    const onInstalled = () => setVisible(false)

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  function dismiss() {
    try {
      localStorage.setItem(INSTALL_KEY, String(Date.now()))
    } catch {
      // Sem localStorage: apenas esconde nesta visita.
    }
    setVisible(false)
    setShowHelp(false)
  }

  async function install() {
    if (!promptEvent) {
      setShowHelp((current) => !current)
      return
    }
    await promptEvent.prompt()
    const choice = await promptEvent.userChoice
    if (choice.outcome === 'accepted') {
      setVisible(false)
      setPromptEvent(null)
    }
  }

  if (!visible) return null

  return (
    <div className="relative z-50 border-b border-white/10 bg-gradient-to-r from-brand-deep via-brand-deep-2 to-ocean text-white">
      <div className="container-wide flex items-center gap-3 py-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/12 text-sun">
          <Smartphone className="h-4 w-4" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold leading-tight">
            Instale o Salinas Serviços
          </p>
          <p className="truncate text-[11px] leading-tight text-white/65">
            Acesso rápido na tela inicial, sem baixar da loja.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void install()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sun px-3.5 py-2 text-xs font-extrabold text-brand-deep transition hover:brightness-105"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          {promptEvent ? 'Instalar' : showHelp ? 'Fechar ajuda' : 'Como instalar'}
        </button>

        <button
          type="button"
          onClick={dismiss}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Ocultar aviso de instalação"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {showHelp && !promptEvent ? (
        <div className="container-wide pb-3">
          <p className="rounded-xl bg-white/10 px-3 py-2 text-[11px] leading-relaxed text-white/80">
            {isIos() ? (
              <>
                <Share className="mr-1 inline h-3.5 w-3.5 text-sun" aria-hidden="true" />
                No Safari, toque no botão <strong>Compartilhar</strong> e escolha{' '}
                <strong>Adicionar à Tela de Início</strong>.
              </>
            ) : (
              <>
                Abra o menu do navegador e escolha <strong>Instalar aplicativo</strong> ou{' '}
                <strong>Adicionar à tela inicial</strong>.
              </>
            )}
          </p>
        </div>
      ) : null}
    </div>
  )
}
