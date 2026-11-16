import { Info, ThumbsUp } from 'lucide-react'
import { useFlags } from '../context/FlagsContext'

export function RatingNotice() {
  const { flags } = useFlags()

  if (flags.ratings_enabled) {
    return (
      <div className="flex gap-3 rounded-2xl border border-ocean/20 bg-ocean/5 p-4 text-sm leading-relaxed text-ink/70">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ocean" />
        <p>
          As avaliações com estrelas estão chegando. Enquanto isso, use o botão de recomendação para
          apoiar este profissional.
        </p>
      </div>
    )
  }

  return (
    <div className="flex gap-3 rounded-2xl border border-line bg-surface-2/60 p-4 text-sm leading-relaxed text-ink/65">
      <ThumbsUp className="mt-0.5 h-4 w-4 shrink-0 text-ocean" />
      <p>
        Ainda não usamos estrelas por aqui. A recomendação é positiva e ajuda a mostrar quem faz um
        bom trabalho na comunidade.
      </p>
    </div>
  )
}
