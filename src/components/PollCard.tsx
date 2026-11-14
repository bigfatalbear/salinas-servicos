import { useEffect, useState } from 'react'
import { BarChart3, Check, Loader2, Vote } from 'lucide-react'
import { POLL_OPTIONS, POLL_VOTED_KEY, type PollOption } from '../config'
import { useFlags } from '../context/FlagsContext'
import { useToast } from '../context/ToastContext'
import { fetchPollResults, votePoll } from '../lib/store'
import type { PollResults } from '../lib/types'
import { cn, getVoterToken } from '../lib/utils'

export function PollCard() {
  const { flags, loading } = useFlags()
  const { toast } = useToast()
  const [results, setResults] = useState<PollResults | null>(null)
  const [voted, setVoted] = useState<PollOption | null>(
    () => (localStorage.getItem(POLL_VOTED_KEY) as PollOption | null) ?? null,
  )
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetchPollResults()
      .then(setResults)
      .catch(() => setResults({ yes: 0, no: 0, maybe: 0 }))
  }, [])

  if (loading || !flags.poll_enabled) return null

  const total = results ? results.yes + results.no + results.maybe : 0

  async function handleVote(option: PollOption) {
    if (busy || voted) return
    setBusy(true)
    try {
      const response = await votePoll(option, getVoterToken())
      setResults(response.results)
      setVoted(option)
      localStorage.setItem(POLL_VOTED_KEY, option)
      toast('Obrigado por participar! Sua opinião ajuda a melhorar o app.', 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível registrar seu voto.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[1fr_1.15fr]">
        <div className="bg-deep p-6 text-white sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
            <Vote className="h-3.5 w-3.5" />
            Enquete rápida
          </span>
          <h3 className="display mt-4 text-2xl font-bold leading-tight sm:text-3xl">
            O que você gostaria de ver no Salinas Serviços?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Estamos pensando em incluir avaliações com estrelas nos perfis. Sua resposta ajuda a
            decidir o próximo passo do projeto.
          </p>
          {total > 0 ? (
            <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white/55">
              <BarChart3 className="h-4 w-4 text-gold" />
              {total} {total === 1 ? 'voto registrado' : 'votos registrados'}
            </p>
          ) : null}
        </div>

        <div className="p-5 sm:p-7">
          {voted ? (
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-tide">
                <Check className="h-4 w-4" />
                Você já votou. Veja como está a comunidade:
              </p>
              <div className="space-y-3">
                {POLL_OPTIONS.map((option) => {
                  const count = results?.[option.key] ?? 0
                  const percent = total ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={option.key}>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-semibold">
                        <span className={cn(voted === option.key ? 'text-deep' : 'text-deep/55')}>
                          {option.label}
                          {voted === option.key ? ' · seu voto' : ''}
                        </span>
                        <span className="text-deep/45">{percent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-sand-dark">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-700',
                            voted === option.key ? 'bg-tide' : 'bg-deep/20',
                          )}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-deep/45">
                {total === 0 ? 'Ainda não há votos suficientes para mostrar os percentuais.' : 'Resultado atualizado em tempo real.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-deep/45">
                Escolha uma opção
              </p>
              {POLL_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  disabled={busy}
                  onClick={() => void handleVote(option.key)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-left text-sm font-semibold text-deep transition hover:border-tide hover:bg-sand/60 disabled:opacity-60"
                >
                  {option.label}
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin text-tide" />
                  ) : (
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-[var(--line)] text-[10px] text-deep/35">
                      +
                    </span>
                  )}
                </button>
              ))}
              <p className="pt-1 text-[11px] leading-relaxed text-deep/40">
                É rápido, anônimo e você pode votar apenas uma vez neste dispositivo.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
