import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  LockKeyhole,
  Mail,
  MessageCircle,
  ShieldCheck,
  Store,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { fetchCategories } from '../lib/store'
import type { Category } from '../lib/types'
import { cn } from '../lib/utils'
import { CategoryIcon } from '../components/CategoryIcon'

type Mode = 'entrar' | 'cadastro' | 'recuperar'

function parseMode(value: string | null): Mode {
  return value === 'cadastro' || value === 'recuperar' ? value : 'entrar'
}

export function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAdmin, signIn, signUp, requestPasswordReset } = useAuth()
  const { toast } = useToast()
  const [mode, setMode] = useState<Mode>(() => parseMode(searchParams.get('modo')))
  const [categories, setCategories] = useState<Category[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    businessName: '',
    whatsapp: '',
    categoryId: '',
    neighborhood: '',
    address: '',
    description: '',
  })

  useEffect(() => {
    setMode(parseMode(searchParams.get('modo')))
  }, [searchParams])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode)
    setError('')
    setResetSent(false)
    setShowPassword(false)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'recuperar') {
        if (!form.email.trim()) throw new Error('Informe o e-mail da sua conta.')
        await requestPasswordReset(form.email.trim())
        setResetSent(true)
        toast('Se este e-mail estiver cadastrado, o link foi enviado.', 'success')
        return
      }

      if (mode === 'entrar') {
        if (!form.email.trim() || !form.password) throw new Error('Preencha e-mail e senha.')
        const role = await signIn(form.email.trim(), form.password)
        toast('Bem-vindo de volta!', 'success')
        const from = (location.state as { from?: string } | null)?.from
        navigate(role === 'admin' ? '/admin' : from || '/painel', { replace: true })
      } else {
        if (!form.businessName.trim()) throw new Error('Informe o nome do seu negócio.')
        if (form.whatsapp.replace(/\D/g, '').length < 10) {
          throw new Error('Informe um WhatsApp válido com DDD.')
        }
        if (!form.categoryId) throw new Error('Escolha uma categoria.')
        if (form.password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.')
        const result = await signUp({
          email: form.email.trim(),
          password: form.password,
          businessName: form.businessName,
          whatsapp: form.whatsapp,
          categoryId: form.categoryId,
          neighborhood: form.neighborhood,
          address: form.address,
          description: form.description,
        })
        if (result.needsConfirmation) {
          toast('Cadastro criado! Confirme seu e-mail para entrar.', 'success')
          changeMode('entrar')
        } else {
          toast('Perfil criado com sucesso. Bem-vindo ao Salinas Serviços!', 'success')
          navigate('/painel', { replace: true })
        }
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Não foi possível concluir agora.',
      )
    } finally {
      setBusy(false)
    }
  }

  if (user) {
    return (
      <div className="container-page py-16">
        <div className="card mx-auto max-w-lg p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ocean/10 text-ocean">
            <BadgeCheck className="h-7 w-7" />
          </span>
          <h1 className="display mt-4 text-3xl font-extrabold text-ink">Você já está conectado</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Acesse seu painel para editar o perfil, fotos e acompanhar os contatos.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to={isAdmin ? '/admin' : '/painel'} className="btn btn-primary">
              Ir para o painel
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/profissionais" className="btn btn-soft">
              Ver profissionais
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-wide py-8 sm:py-14">
      <div className="grid overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_30px_90px_-45px_rgba(11,59,90,0.45)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-brand-deep p-9 text-white lg:block">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-gold/15" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-ocean/25 blur-2xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              <Store className="h-3.5 w-3.5" />
              Para profissionais
            </span>
            <h2 className="display mt-6 text-4xl font-bold leading-[1.08]">
              Seu serviço no mapa de Salinas.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Crie seu perfil em poucos minutos, mostre seu trabalho com duas fotos e receba
              contatos direto no WhatsApp.
            </p>

            <ul className="mt-8 space-y-4 text-sm">
              {[
                { icon: BadgeCheck, text: 'Cadastro gratuito e sem comissão' },
                { icon: MessageCircle, text: 'Contato direto pelo WhatsApp' },
                { icon: Heart, text: 'Recomendações da comunidade' },
                { icon: ShieldCheck, text: 'Você controla seus dados' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-white/75">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-gold">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/55">
              Dica: use fotos nítidas do seu trabalho e escreva uma descrição curta com os serviços
              que você oferece.
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-9 lg:p-12">
          <div className="flex items-center gap-1 rounded-full bg-surface-2 p-1">
            <button
              type="button"
              onClick={() => changeMode('entrar')}
              className={cn(
                'flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition',
                mode === 'entrar' ? 'bg-surface text-ink shadow-sm' : 'text-muted',
              )}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => changeMode('cadastro')}
              className={cn(
                'flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition',
                mode === 'cadastro' ? 'bg-surface text-ink shadow-sm' : 'text-muted',
              )}
            >
              Criar perfil
            </button>
          </div>

          <h1 className="display mt-7 text-3xl font-extrabold text-ink">
            {mode === 'entrar'
              ? 'Que bom te ver por aqui.'
              : mode === 'cadastro'
                ? 'Vamos criar seu perfil.'
                : 'Recupere seu acesso.'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {mode === 'entrar'
              ? 'Acesse para editar seu perfil, fotos e acompanhar seus contatos.'
              : mode === 'cadastro'
                ? 'Preencha os dados principais. Você poderá ajustar tudo depois no painel.'
                : 'Informe o e-mail cadastrado. Enviaremos um link para você criar uma nova senha.'}
          </p>

          {mode === 'recuperar' && resetSent ? (
            <div className="mt-8 rounded-2xl border border-mangrove/20 bg-mangrove/5 p-5 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-mangrove/10 text-mangrove">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="display mt-3 text-xl font-extrabold text-ink">Link enviado</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Se este e-mail estiver cadastrado, você receberá um link para criar uma nova
                senha. Verifique também a caixa de spam.
              </p>
              <button
                type="button"
                onClick={() => changeMode('entrar')}
                className="btn btn-primary mt-5 w-full"
              >
                Voltar para entrar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'cadastro' ? (
              <>
                <label className="block">
                  <span className="field-label">Nome do negócio ou serviço</span>
                  <input
                    value={form.businessName}
                    onChange={(event) => update('businessName', event.target.value)}
                    placeholder="Ex.: João Eletricista"
                    className="field"
                    required
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="field-label">WhatsApp com DDD</span>
                    <input
                      value={form.whatsapp}
                      onChange={(event) => update('whatsapp', event.target.value)}
                      placeholder="71 99999-0000"
                      inputMode="tel"
                      className="field"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Categoria</span>
                    <select
                      value={form.categoryId}
                      onChange={(event) => update('categoryId', event.target.value)}
                      className="field"
                      required
                    >
                      <option value="">Escolha...</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="field-label">Bairro ou distrito</span>
                    <input
                      value={form.neighborhood}
                      onChange={(event) => update('neighborhood', event.target.value)}
                      placeholder="Ex.: Centro"
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Endereço (opcional)</span>
                    <input
                      value={form.address}
                      onChange={(event) => update('address', event.target.value)}
                      placeholder="Rua, referência..."
                      className="field"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="field-label">Descrição do serviço</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => update('description', event.target.value)}
                    rows={3}
                    placeholder="Conte o que você faz, como atende e o que está incluso..."
                    className="field resize-none"
                  />
                </label>
              </>
            ) : null}

            <label className="block">
              <span className="field-label">E-mail</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder="voce@email.com"
                  className="field pl-10!"
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            {mode !== 'recuperar' ? (
              <label className="block">
                <span className="field-label">Senha</span>
                <span className="relative block">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => update('password', event.target.value)}
                    placeholder={mode === 'cadastro' ? 'Mínimo de 6 caracteres' : 'Sua senha'}
                    className="field pl-10! pr-10!"
                    autoComplete={mode === 'entrar' ? 'current-password' : 'new-password'}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
            ) : null}

            {error ? (
              <div className="rounded-xl border border-coral/25 bg-coral/5 px-4 py-3 text-sm text-coral">
                {error}
              </div>
            ) : null}

            <button type="submit" disabled={busy} className="btn btn-primary w-full py-3!">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === 'entrar'
                ? 'Entrar no painel'
                : mode === 'cadastro'
                  ? 'Criar meu perfil'
                  : 'Enviar link de recuperação'}
              {!busy ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
          )}

          <div className="mt-5 space-y-2 text-center text-xs leading-relaxed text-muted">
            {mode === 'entrar' ? (
              <p>
                Ainda não tem perfil?{' '}
                <button
                  type="button"
                  onClick={() => changeMode('cadastro')}
                  className="font-semibold text-ocean hover:underline"
                >
                  Cadastre seu serviço
                </button>
              </p>
            ) : mode === 'cadastro' ? (
              <p>
                Já tem cadastro?{' '}
                <button
                  type="button"
                  onClick={() => changeMode('entrar')}
                  className="font-semibold text-ocean hover:underline"
                >
                  Entrar
                </button>
              </p>
            ) : (
              <p>
                Lembrou a senha?{' '}
                <button
                  type="button"
                  onClick={() => changeMode('entrar')}
                  className="font-semibold text-ocean hover:underline"
                >
                  Voltar para entrar
                </button>
              </p>
            )}

            {mode !== 'recuperar' ? (
              <p>
                <button
                  type="button"
                  onClick={() => changeMode('recuperar')}
                  className="font-semibold text-ocean hover:underline"
                >
                  Esqueci minha senha
                </button>
              </p>
            ) : null}

            {mode === 'cadastro' ? (
              <p>
                Ao criar seu perfil, você concorda em manter as informações atualizadas e
                respeitar a comunidade.
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted">
            <CategoryIcon name="sparkles" className="h-3.5 w-3.5 text-ocean" />
            Feito para profissionais de Salinas da Margarida
          </div>
        </div>
      </div>
    </div>
  )
}
