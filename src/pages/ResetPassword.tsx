import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { supabase } from '../lib/supabase'

type Status = 'checking' | 'ready' | 'invalid'

export function ResetPassword() {
  const navigate = useNavigate()
  const { user, updatePassword, signOut } = useAuth()
  const { toast } = useToast()
  const [status, setStatus] = useState<Status>('checking')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let timer: number | undefined

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setStatus('ready')
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session) {
        setStatus('ready')
        return
      }
      timer = window.setTimeout(() => {
        if (active) setStatus((current) => (current === 'checking' ? 'invalid' : current))
      }, 2000)
    })

    return () => {
      active = false
      if (timer) window.clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setBusy(true)
    try {
      await updatePassword(password)
      await signOut()
      toast('Senha alterada com sucesso. Entre com a nova senha.', 'success')
      navigate('/entrar', { replace: true })
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Não foi possível alterar a senha.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-page py-10 sm:py-16">
      <div className="card mx-auto max-w-lg overflow-hidden p-6 sm:p-9">
        <Link
          to="/entrar"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition hover:text-ocean"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Voltar para entrar
        </Link>

        {status === 'checking' ? (
          <div className="py-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-ocean" aria-hidden="true" />
            <h1 className="display mt-4 text-2xl font-extrabold text-ink">Validando seu link...</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">Isso leva só um instante.</p>
          </div>
        ) : status === 'invalid' ? (
          <div className="py-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-coral/10 text-coral">
              <ShieldCheck className="h-7 w-7" aria-hidden="true" />
            </span>
            <h1 className="display mt-4 text-2xl font-extrabold text-ink">
              Link inválido ou expirado
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              O link de recuperação pode ter expirado. Solicite um novo para continuar.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link to="/entrar?modo=recuperar" className="btn btn-primary">
                Solicitar novo link
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/entrar" className="btn btn-soft">
                Voltar para entrar
              </Link>
            </div>
          </div>
        ) : (
          <>
            <span className="mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-ocean/10 text-ocean">
              <KeyRound className="h-7 w-7" aria-hidden="true" />
            </span>
            <h1 className="display mt-4 text-2xl font-extrabold text-ink">Crie uma nova senha</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Defina uma senha segura para acessar sua conta.
            </p>
            {user?.email ? (
              <span className="mt-3 inline-block rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink">
                {user.email}
              </span>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="field-label">Nova senha</span>
                <span className="relative block">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    className="field pl-10! pr-10!"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </span>
              </label>

              <label className="block">
                <span className="field-label">Confirmar nova senha</span>
                <span className="relative block">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repita a nova senha"
                    className="field pl-10!"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </span>
              </label>

              {error ? (
                <div className="rounded-xl border border-coral/25 bg-coral/5 px-4 py-3 text-sm text-coral">
                  {error}
                </div>
              ) : null}

              <button type="submit" disabled={busy} className="btn btn-primary w-full py-3!">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                Salvar nova senha
                {!busy ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
              </button>
            </form>

            <p className="mt-4 text-center text-xs leading-relaxed text-muted">
              O link é válido por tempo limitado. Se expirar, solicite outro.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
