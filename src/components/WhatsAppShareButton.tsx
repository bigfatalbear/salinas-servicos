import { MessageCircle } from 'lucide-react'
import { cn } from '../lib/utils'

export function WhatsAppShareButton({
  text,
  label = 'Compartilhar no WhatsApp',
  className,
}: {
  text: string
  label?: string
  className?: string
}) {
  return (
    <a
      href={`https://wa.me/?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noreferrer"
      className={cn('btn btn-soft', className)}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {label}
    </a>
  )
}
