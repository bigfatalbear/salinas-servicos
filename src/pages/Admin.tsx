import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Check,
  Eye,
  EyeOff,
  Loader2,
  MousePointerClick,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  Star,
  Tags,
  ThumbsUp,
  Trash2,
  Users,
} from 'lucide-react'
import { useFlags } from '../context/FlagsContext'
import { useToast } from '../context/ToastContext'
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchFeatureFlags,
  fetchPollResults,
  fetchProfessionals,
  updateCategory,
  updateFeatureFlag,
  updateProfessional,
} from '../lib/store'
import type { Category, FeatureFlag, PollResults, Professional } from '../lib/types'
import { cn, formatNumber } from '../lib/utils'
import { CategoryIcon } from '../components/CategoryIcon'
import { Loading } from '../components/Loading'

type Tab = 'perfis' | 'categorias' | 'configuracoes'

const iconOptions = [
  'zap',
  'sparkles',
  'truck',
  'hammer',
  'paintbrush',
  'scissors',
  'car',
  'car-taxi-front',
  'fish',
  'shopping-basket',
  'brick-wall',
  'wine',
  'monitor-cog',
  'party-popper',
  'home',
  'chef-hat',
  'camera',
  'sailboat',
  'grid',
]

export function Admin() {
  const { toast } = useToast()
  const { refresh: refreshFlags } = useFlags()
  const [tab, setTab] = useState<Tab>('perfis')
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [poll, setPoll] = useState<PollResults>({ yes: 0, no: 0, maybe: 0 })
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [busyFlag, setBusyFlag] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'grid', sortOrder: '' })
  const [creatingCategory, setCreatingCategory] = useState(false)

  async function loadAll() {
    setLoading(true)
    try {
      const [nextProfessionals, nextCategories, nextFlags, nextPoll] = await Promise.all([
        fetchProfessionals({ includeInactive: true }),
        fetchCategories(true),
        fetchFeatureFlags(),
        fetchPollResults(),
      ])
      setProfessionals(nextProfessionals)
      setCategories(nextCategories)
      setFlags(nextFlags)
      setPoll(nextPoll)
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível carregar o painel.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAll()
  }, [])

  async function toggleProfessional(professional: Professional, field: 'is_active' | 'is_featured') {
    setBusyId(professional.id)
    try {
      const nextValue = !professional[field]
      const updated = await updateProfessional(professional.id, {
        [field]: nextValue,
        ...(field === 'is_featured'
          ? { featured_order: nextValue ? professionals.filter((item) => item.is_featured).length + 1 : 0 }
          : {}),
      })
      setProfessionals((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      toast(
        field === 'is_active'
          ? `Perfil ${nextValue ? 'ativado' : 'desativado'}.`
          : `Destaque ${nextValue ? 'ativado' : 'removido'}.`,
        'success',
      )
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível atualizar o perfil.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  async function toggleCategory(category: Category) {
    setBusyId(category.id)
    try {
      const updated = await updateCategory(category.id, { active: !category.active })
      setCategories((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      toast(`Categoria ${updated.active ? 'ativada' : 'desativada'}.`, 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível atualizar a categoria.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  async function handleCreateCategory(event: FormEvent) {
    event.preventDefault()
    if (!newCategory.name.trim()) return
    setCreatingCategory(true)
    try {
      const created = await createCategory({
        name: newCategory.name.trim(),
        icon: newCategory.icon,
        sort_order: Number(newCategory.sortOrder) || categories.length + 1,
      })
      setCategories((current) => [...current, created])
      setNewCategory({ name: '', icon: 'grid', sortOrder: '' })
      toast('Categoria criada.', 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível criar a categoria.', 'error')
    } finally {
      setCreatingCategory(false)
    }
  }

  async function handleDeleteCategory(category: Category) {
    if (!window.confirm(`Excluir a categoria “${category.name}”? Os perfis ficarão sem categoria.`)) {
      return
    }
    setBusyId(category.id)
    try {
      await deleteCategory(category.id)
      setCategories((current) => current.filter((item) => item.id !== category.id))
      toast('Categoria excluída.', 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível excluir a categoria.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  async function toggleFlag(flag: FeatureFlag) {
    setBusyFlag(flag.key)
    try {
      const updated = await updateFeatureFlag(flag.key, !flag.enabled)
      setFlags((current) => current.map((item) => (item.key === updated.key ? updated : item)))
      await refreshFlags()
      toast(`“${flag.label ?? flag.key}” ${updated.enabled ? 'ativado' : 'desativado'}.`, 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível atualizar a opção.', 'error')
    } finally {
      setBusyFlag(null)
    }
  }

  const activeCount = professionals.filter((item) => item.is_active).length
  const featuredCount = professionals.filter((item) => item.is_featured).length
  const pollTotal = poll.yes + poll.no + poll.maybe

  if (loading) {
    return (
      <div className="container-wide py-16">
        <Loading label="Carregando painel administrativo..." />
      </div>
    )
  }

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Administração
          </p>
          <h1 className="display mt-2 text-4xl font-bold text-deep sm:text-5xl">
            Painel do Salinas Serviços
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-deep/60">
            Gerencie perfis, categorias, destaques e as opções do aplicativo.
          </p>
        </div>
        <button type="button" onClick={() => void loadAll()} className="btn btn-soft shrink-0">
          <RefreshCw className="h-4 w-4" />
          Atualizar dados
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Perfis cadastrados" value={professionals.length} />
        <StatCard icon={Check} label="Perfis ativos" value={activeCount} tone="tide" />
        <StatCard icon={Star} label="Destaques" value={featuredCount} tone="gold" />
        <StatCard icon={BarChart3} label="Votos na enquete" value={pollTotal} tone="coral" />
      </div>

      <div className="mt-7 flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 no-scrollbar">
        {[
          { key: 'perfis' as const, label: 'Perfis', icon: Users },
          { key: 'categorias' as const, label: 'Categorias', icon: Tags },
          { key: 'configuracoes' as const, label: 'Configurações', icon: Settings },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              'inline-flex flex-1 shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition',
              tab === item.key ? 'bg-brand-deep text-white' : 'text-muted hover:text-ink',
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'perfis' ? (
        <section className="mt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="display text-2xl font-bold text-deep">Perfis profissionais</h2>
              <p className="mt-1 text-xs text-deep/45">
                Ative, desative e escolha os destaques do mês.
              </p>
            </div>
            <p className="text-xs font-semibold text-deep/40">{professionals.length} no total</p>
          </div>

          <div className="mt-4 space-y-3">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className={cn(
                  'card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between',
                  !professional.is_active && 'opacity-70',
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sand-dark text-tide">
                    <CategoryIcon name={professional.category?.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-bold text-deep">{professional.business_name}</p>
                      {professional.is_featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#8a6513]">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Destaque
                        </span>
                      ) : null}
                      {!professional.is_active ? (
                        <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-coral">
                          Inativo
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-deep/45">
                      {professional.category?.name || 'Sem categoria'} ·{' '}
                      {professional.neighborhood || 'Salinas'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-deep/50">
                    <ThumbsUp className="h-3.5 w-3.5 text-tide" />
                    {formatNumber(professional.recommendations)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-deep/50">
                    <MousePointerClick className="h-3.5 w-3.5 text-coral" />
                    {formatNumber(professional.whatsapp_clicks)}
                  </span>
                  <div className="flex items-center gap-4 border-l border-[var(--line)] pl-4">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-deep/55">
                      Ativo
                      <Toggle
                        checked={professional.is_active}
                        disabled={busyId === professional.id}
                        onChange={() => void toggleProfessional(professional, 'is_active')}
                        label={`Ativar ${professional.business_name}`}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-[11px] font-bold text-deep/55">
                      Destaque
                      <Toggle
                        checked={professional.is_featured}
                        disabled={busyId === professional.id}
                        onChange={() => void toggleProfessional(professional, 'is_featured')}
                        label={`Destacar ${professional.business_name}`}
                      />
                    </label>
                  </div>
                  <Link
                    to={`/profissionais/${professional.id}`}
                    className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] text-deep/45 transition hover:border-tide hover:text-tide"
                    aria-label={`Ver perfil de ${professional.business_name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'categorias' ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div>
            <h2 className="display text-2xl font-bold text-deep">Categorias</h2>
            <p className="mt-1 text-xs text-deep/45">
              Ative ou desative categorias e organize a vitrine de serviços.
            </p>
            <div className="mt-4 space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={cn(
                    'card flex items-center justify-between gap-3 p-3.5',
                    !category.active && 'opacity-60',
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sand-dark text-tide">
                      <CategoryIcon name={category.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-deep">{category.name}</p>
                      <p className="text-[10px] font-medium text-deep/35">
                        {category.slug} · ordem {category.sort_order}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Toggle
                      checked={category.active}
                      disabled={busyId === category.id}
                      onChange={() => void toggleCategory(category)}
                      label={`Ativar ${category.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => void handleDeleteCategory(category)}
                      disabled={busyId === category.id}
                      className="grid h-8 w-8 place-items-center rounded-full text-deep/35 transition hover:bg-coral/10 hover:text-coral"
                      aria-label={`Excluir ${category.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateCategory} className="card p-5 lg:sticky lg:top-24">
            <h3 className="display text-xl font-bold text-deep">Nova categoria</h3>
            <p className="mt-1 text-xs leading-relaxed text-deep/45">
              Crie uma categoria para organizar novos tipos de serviço.
            </p>
            <label className="mt-4 block">
              <span className="field-label">Nome</span>
              <input
                value={newCategory.name}
                onChange={(event) =>
                  setNewCategory((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Ex.: Jardineiro"
                className="field"
                required
              />
            </label>
            <label className="mt-3 block">
              <span className="field-label">Ícone</span>
              <select
                value={newCategory.icon}
                onChange={(event) =>
                  setNewCategory((current) => ({ ...current, icon: event.target.value }))
                }
                className="field"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block">
              <span className="field-label">Ordem (opcional)</span>
              <input
                type="number"
                value={newCategory.sortOrder}
                onChange={(event) =>
                  setNewCategory((current) => ({ ...current, sortOrder: event.target.value }))
                }
                placeholder="13"
                className="field"
                min={0}
              />
            </label>
            <button type="submit" disabled={creatingCategory} className="btn btn-primary mt-4 w-full">
              {creatingCategory ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Criar categoria
            </button>
          </form>
        </section>
      ) : null}

      {tab === 'configuracoes' ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="display text-2xl font-bold text-deep">Opções do aplicativo</h2>
            <p className="mt-1 text-xs text-deep/45">
              Ative ou desative recursos sem precisar publicar uma nova versão.
            </p>
            <div className="mt-4 space-y-3">
              {flags.map((flag) => (
                <div key={flag.key} className="card flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-bold text-deep">{flag.label ?? flag.key}</p>
                    <p className="mt-1 text-xs leading-relaxed text-deep/50">
                      {flag.description ?? 'Sem descrição.'}
                    </p>
                    <p className="mt-1.5 font-mono text-[10px] text-deep/30">{flag.key}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {busyFlag === flag.key ? (
                      <Loader2 className="h-4 w-4 animate-spin text-tide" />
                    ) : flag.enabled ? (
                      <Eye className="h-4 w-4 text-tide" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-deep/30" />
                    )}
                    <Toggle
                      checked={flag.enabled}
                      disabled={busyFlag === flag.key}
                      onChange={() => void toggleFlag(flag)}
                      label={`Ativar ${flag.label ?? flag.key}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="display text-2xl font-bold text-deep">Resultado da enquete</h2>
            <p className="mt-1 text-xs text-deep/45">
              {pollTotal} {pollTotal === 1 ? 'voto registrado' : 'votos registrados'} até agora.
            </p>
            <div className="mt-5 space-y-4">
              {[
                { key: 'yes' as const, label: 'Sim, quero avaliações' },
                { key: 'no' as const, label: 'Não preciso' },
                { key: 'maybe' as const, label: 'Talvez' },
              ].map((option) => {
                const count = poll[option.key]
                const percent = pollTotal ? Math.round((count / pollTotal) * 100) : 0
                return (
                  <div key={option.key}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-semibold">
                      <span className="text-deep/70">{option.label}</span>
                      <span className="text-deep/45">
                        {count} · {percent}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-sand-dark">
                      <div
                        className="h-full rounded-full bg-tide transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                fetchPollResults()
                  .then(setPoll)
                  .catch(() => toast('Não foi possível atualizar a enquete.', 'error'))
              }}
              className="btn btn-soft mt-5 w-full"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar resultado
            </button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = 'deep',
}: {
  icon: typeof Users
  label: string
  value: number
  tone?: 'deep' | 'tide' | 'gold' | 'coral'
}) {
  return (
    <div className="card p-4">
      <span
        className={cn(
          'grid h-9 w-9 place-items-center rounded-xl',
          tone === 'deep' && 'bg-deep/5 text-deep',
          tone === 'tide' && 'bg-tide/10 text-tide',
          tone === 'gold' && 'bg-gold/20 text-[#8a6513]',
          tone === 'coral' && 'bg-coral/10 text-coral',
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <p className="display mt-3 text-2xl font-bold text-deep">{formatNumber(value)}</p>
      <p className="text-[11px] font-semibold text-deep/45">{label}</p>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50',
        checked ? 'bg-tide' : 'bg-deep/15',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition',
          checked ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </button>
  )
}
