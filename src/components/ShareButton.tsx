import { Share2 } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { APP_DESCRIPTION, APP_NAME, SITE_URL } from '../config'
import { cn } from '../lib/utils'

export function ShareButton({
  label = 'Compartilhar o app',
  className,
  url = SITE_URL,
  title = APP_NAME,
  text = APP_DESCRIPTION,
}: {
  label?: string
  className?: string
  url?: string
  title?: string
  text?: string
}) {
  const { toast } = useToast()

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
        return
      }
      await navigator.clipboard.writeText(url)
      toast('Link copiado. Agora é só compartilhar!', 'success')
    } catch {
      // Compartilhamento cancelado pelo usuário.
    }
  }

  return (
    <button type="button" onClick={() => void handleShare()} className={cn('btn btn-soft', className)}>
      <Share2 className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  )
}
