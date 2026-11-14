import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  LogOut,
  MessageCircle,
  MousePointerClick,
  Save,
  Share2,
  ShieldCheck,
  Star,
  ThumbsUp,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { fetchCategories, updateProfessionalByUser } from '../lib/store'
import type { Category, Professional } from '../lib/types'
import { cn, formatNumber } from '../lib/utils'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { PhotoUploader } from '../components/PhotoUploader'

export function Dashboard() {
  const { user, professional, isAdmin, refreshProfile, signOut } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [profile, setProfile] = useState<Professional | null>(professional)
  const [photos, setPhotos] = useState<[string | null, string | null]>([
    professional?.photo_1_url ?? null,
    professional?.photo_2_url ?? null,
  ])
  const [form, setForm] = useState({
    businessName: professional?.business_name ?? '',
    whatsapp: professional?.whatsapp ?? '',
    categoryId: professional?.category_id ?? '',
    neighborhood: professional?.neighborhood ?? '',
    address: professional?.address ?? '',
    description: professional?.description ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!professional)

  useEffect(() => {
    if (professional) {
      setProfile(professional)
      setPhotos([professional.photo_1_url, professional.photo_2_url])
      setForm({
        businessName: professional.business_name,
        whatsapp: professional.whatsapp,
        categoryId: professional.category_id ?? '',
        neighborhood: professional.neighborhood ?? '',
        address: professional.address ?? '',
        description: professional.description ?? '',
      })
      setLoading(false)
    } else if (user) {
      refreshProfile().finally(() => setLoading(false))
    }
  }, [professional, user, refreshProfile])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    if (!user || !profile) return
    setSaving(true)
    try {
      const updated = await updateProfessionalByUser(user.id, {
        business_name: form.businessName.trim(),
        whatsapp: form.whatsapp.trim(),
        category_id: form.categoryId || null,
        neighborhood: form.neighborhood.trim() || null,
        address: form.address.trim() || null,
        description: form.description.trim() || null,
      })
      setProfile(updated)
      await refreshProfile()
      toast('Perfil atualizado com sucesso.', 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível salvar as alterações.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleShare() {
    if (!profile) return
    const url = `${window.location.origin}${import.meta.env.BASE_URL}profissionais/${profile.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: profile.business_name, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast('Link do perfil copiado.', 'success')
      }
    } catch {
      // Compartilhamento cancelado.
    }
  }

  if (loading) {
    return (
      <div className="container-wide py-16">
        <Loading label="Carregando seu painel..." />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container-wide py-16">
        <EmptyState
          icon={UserRound}
          title="Perfil não encontrado"
          description="Não encontramos um perfil profissional vinculado à sua conta. Tente sair e entrar novamente."
          action={
            <button type="button" onClick={() => void refreshProfile()} className="btn btn-primary">
              Tentar novamente
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Meu painel</p>
          <h1 className="display mt-2 text-4xl font-bold text-deep sm:text-5xl">
            Olá, {profile.business_name.split(' ')[0]}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-deep/60">
            Edite seu perfil, fotos e acompanhe como as pessoas estão encontrando seu serviço.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/profissionais/${profile.id}`} className="btn btn-soft">
            <Eye className="h-4 w-4" />
            Ver perfil público
          </Link>
          <button type="button" onClick={() => void handleShare()} className="btn btn-soft">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </button>
          <button
            type="button"
            onClick={async () => {
              await signOut()
              navigate('/')
            }}
            className="btn border border-coral/20 bg-white text-coral hover:bg-coral/5"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>

      {!profile.is_active ? (
        <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm leading-relaxed text-deep/70">
          Seu perfil está aguardando ativação pela administração. Ele ainda não aparece na busca
          pública.
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="card p-4 sm:p-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-tide/10 text-tide">
            <ThumbsUp className="h-4 w-4" />
          </span>
          <p className="display mt-3 text-2xl font-bold text-deep">
            {formatNumber(profile.recommendations)}
          </p>
          <p className="text-[11px] font-semibold text-deep/45">Recomendações</p>
        </div>
        <div className="card p-4 sm:p-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-coral/10 text-coral">
            <MousePointerClick className="h-4 w-4" />
          </span>
          <p className="display mt-3 text-2xl font-bold text-deep">
            {formatNumber(profile.whatsapp_clicks)}
          </p>
          <p className="text-[11px] font-semibold text-deep/45">Cliques no WhatsApp</p>
        </div>
        <div className="card col-span-2 p-4 sm:col-span-1 sm:p-5">
          <span
            className={cn(
              'grid h-9 w-9 place-items-center rounded-xl',
              profile.is_featured ? 'bg-gold/20 text-[#9a7317]' : 'bg-deep/5 text-deep/35',
            )}
          >
            <Star className={cn('h-4 w-4', profile.is_featured && 'fill-current')} />
          </span>
          <p className="display mt-3 text-2xl font-bold text-deep">
            {profile.is_featured ? 'Destaque' : 'Padrão'}
          </p>
          <p className="text-[11px] font-semibold text-deep/45">
            {profile.is_featured ? 'Seu perfil está em evidência' : 'Curadoria do mês'}
          </p>
        </div>
      </div>

      {isAdmin ? (
        <Link
          to="/admin"
          className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-tide/20 bg-tide/5 p-4 text-sm font-semibold text-tide transition hover:bg-tide/10"
        >
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Você também é administrador. Acesse o painel administrativo.
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}

      <div className="mt-7 grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className="card p-5 sm:p-6">
          <h2 className="display text-xl font-bold text-deep">Fotos do perfil</h2>
          <p className="mt-1 text-xs leading-relaxed text-deep/50">
            A primeira foto aparece nos cartões de busca. Use imagens nítidas e com boa luz.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <PhotoUploader
              userId={user!.id}
              slot={1}
              url={photos[0]}
              onChange={(url) => {
                setPhotos((current) => [url, current[1]])
                void refreshProfile()
              }}
            />
            <PhotoUploader
              userId={user!.id}
              slot={2}
              url={photos[1]}
              onChange={(url) => {
                setPhotos((current) => [current[0], url])
                void refreshProfile()
              }}
            />
          </div>

          <div className="mt-5 rounded-xl bg-sand p-4 text-xs leading-relaxed text-deep/55">
            <p className="flex items-center gap-1.5 font-bold text-deep">
              <BadgeCheck className="h-4 w-4 text-tide" />
              Dica de perfil
            </p>
            <p className="mt-1.5">
              Perfis com duas fotos e descrição completa costumam receber mais contatos pelo
              WhatsApp.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="display text-xl font-bold text-deep">Informações do perfil</h2>
              <p className="mt-1 text-xs text-deep/50">Mantenha os dados atualizados.</p>
            </div>
            <span className="hidden rounded-full bg-sand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-deep/40 sm:inline">
              {profile.category?.name || 'Sem categoria'}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="field-label">Nome do negócio ou serviço</span>
              <input
                value={form.businessName}
                onChange={(event) => update('businessName', event.target.value)}
                className="field"
                required
              />
            </label>

            <label className="block">
              <span className="field-label">WhatsApp com DDD</span>
              <input
                value={form.whatsapp}
                onChange={(event) => update('whatsapp', event.target.value)}
                className="field"
                inputMode="tel"
                required
              />
            </label>

            <label className="block">
              <span className="field-label">Categoria</span>
              <select
                value={form.categoryId}
                onChange={(event) => update('categoryId', event.target.value)}
                className="field"
              >
                <option value="">Sem categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="field-label">Bairro ou distrito</span>
              <input
                value={form.neighborhood}
                onChange={(event) => update('neighborhood', event.target.value)}
                className="field"
                placeholder="Ex.: Centro"
              />
            </label>

            <label className="block">
              <span className="field-label">Endereço (opcional)</span>
              <input
                value={form.address}
                onChange={(event) => update('address', event.target.value)}
                className="field"
                placeholder="Rua, referência..."
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="field-label">Descrição do serviço</span>
              <textarea
                value={form.description}
                onChange={(event) => update('description', event.target.value)}
                rows={5}
                className="field resize-none"
                placeholder="Conte o que você faz, como atende e o que está incluso..."
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-1.5 text-xs text-deep/40">
              <MessageCircle className="h-3.5 w-3.5" />
              Seu WhatsApp só aparece para quem clicar no botão de contato.
            </p>
            <button type="submit" disabled={saving} className="btn btn-primary shrink-0">
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
