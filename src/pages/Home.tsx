import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { CITY, WHATSAPP_MESSAGE } from '../config'
import { fetchCategories, fetchProfessionals } from '../lib/store'
import type { Category, Professional } from '../lib/types'
import { formatNumber, imageUrl, initials, whatsappUrl } from '../lib/utils'
import { CategoryIcon } from '../components/CategoryIcon'
import { Loading } from '../components/Loading'
import { PollCard } from '../components/PollCard'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { SectionHeading } from '../components/SectionHeading'

export function Home() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<Professional[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      fetchCategories(),
      fetchProfessionals({ featuredOnly: true, limit: 3 }),
      fetchProfessionals({ limit: 8 }),
    ])
      .then(([nextCategories, nextFeatured, nextProfessionals]) => {
        if (!active) return
        setCategories(nextCategories)
        setFeatured(nextFeatured)
        setProfessionals(nextProfessionals)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const hero = featured[0] ?? professionals[0]

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (category) params.set('categoria', category)
    navigate(`/profissionais${params.size ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(14,140,140,0.16),transparent_42%),radial-gradient(circle_at_10%_80%,rgba(233,196,106,0.2),transparent_38%)]" />
        <div className="container-wide grid gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-tide/20 bg-white/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-tide backdrop-blur">
              <MapPin className="h-3.5 w-3.5" />
              {CITY}
            </span>
            <h1 className="display mt-5 max-w-xl text-[2.7rem] font-bold leading-[1.04] text-deep sm:text-6xl">
              Quem faz Salinas acontecer,{' '}
              <span className="relative whitespace-nowrap text-tide">
                num só lugar
                <svg
                  className="absolute -bottom-1 left-0 h-3 w-full text-gold/80"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 9c38-7 92-8 196-3" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-deep/65 sm:text-lg">
              Encontre eletricistas, manicures, fretes, diaristas e outros profissionais da nossa
              cidade. Sem intermediários: você fala direto no WhatsApp.
            </p>

            <form onSubmit={handleSearch} className="mt-7 flex flex-col gap-2 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Buscar profissional ou serviço</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-deep/35" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar serviço ou profissional"
                  className="field rounded-full! py-3.5! pl-11!"
                />
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="field rounded-full! py-3.5! sm:w-56"
                aria-label="Categoria"
              >
                <option value="">Todas as categorias</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary shrink-0 px-6! py-3.5!">
                Buscar
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-deep/50">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-tide" />
                Perfis locais
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4 text-tide" />
                Contato direto
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-coral" />
                Recomendação da comunidade
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md animate-fade-up lg:max-w-none">
            <div className="absolute -left-4 top-10 hidden h-24 w-24 rounded-full border-[12px] border-gold/25 sm:block" />
            <div className="absolute -bottom-6 -right-2 hidden h-32 w-32 rounded-full bg-tide/10 sm:block" />
            {hero ? (
              <Link
                to={`/profissionais/${hero.id}`}
                className="card relative block overflow-hidden rounded-[2rem]! p-2 shadow-[0_30px_80px_-35px_rgba(11,59,90,0.5)]"
              >
                <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-deep to-tide">
                  {hero.photo_1_url ? (
                    <img
                      src={imageUrl(hero.photo_1_url)}
                      alt={hero.business_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-7xl font-bold text-white/90">
                      {initials(hero.business_name)}
                    </div>
                  )}
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-deep-900 shadow">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    Destaque do mês
                  </span>
                </div>
                <div className="flex items-end justify-between gap-4 px-4 pb-4 pt-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-tide">
                      {hero.category?.name || 'Profissional local'}
                    </p>
                    <h2 className="display mt-1 text-2xl font-bold text-deep">{hero.business_name}</h2>
                    <p className="mt-1 flex items-center gap-1 text-xs text-deep/50">
                      <MapPin className="h-3.5 w-3.5" />
                      {hero.neighborhood || 'Salinas da Margarida'}
                    </p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-tide text-white">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            ) : (
              <div className="card grid aspect-[5/4] place-items-center bg-gradient-to-br from-deep to-tide text-center text-white">
                <div>
                  <Sparkles className="mx-auto h-10 w-10 text-gold" />
                  <p className="display mt-3 text-2xl font-bold">Sua cidade, seus talentos.</p>
                  <p className="mt-1 text-sm text-white/60">Cadastre seu serviço gratuitamente.</p>
                </div>
              </div>
            )}

            <div className="mx-auto mt-5 flex max-w-xs items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 shadow-lg">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-coral/10 text-coral">
                <Heart className="h-4 w-4 fill-current" />
              </span>
              <div>
                <p className="text-xs font-bold text-deep">Feito por gente daqui</p>
                <p className="text-[11px] text-deep/45">Valorize o comércio local</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white/50">
        <div className="container-wide grid grid-cols-3 divide-x divide-[var(--line)] py-5 text-center">
          <div>
            <p className="display text-2xl font-bold text-deep sm:text-3xl">{categories.length || 12}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-deep/40 sm:text-xs">
              Categorias
            </p>
          </div>
          <div>
            <p className="display text-2xl font-bold text-deep sm:text-3xl">
              {professionals.length || 6}+
            </p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-deep/40 sm:text-xs">
              Profissionais
            </p>
          </div>
          <div>
            <p className="display text-2xl font-bold text-deep sm:text-3xl">100%</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-deep/40 sm:text-xs">
              Local
            </p>
          </div>
        </div>
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Encontre por serviço"
          title="O que você precisa hoje?"
          description="Escolha uma categoria e veja quem está disponível em Salinas e nos distritos."
          action={
            <Link to="/profissionais" className="btn btn-soft">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {loading ? (
          <Loading label="Carregando categorias..." />
        ) : (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((item) => (
              <Link
                key={item.id}
                to={`/profissionais?categoria=${item.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-tide/40 hover:shadow-md"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sand-dark text-tide transition group-hover:bg-tide group-hover:text-white">
                  <CategoryIcon name={item.icon} className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold leading-tight text-deep">{item.name}</span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-deep/20 transition group-hover:text-tide" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Destaques do mês"
          title="Profissionais em evidência"
          description="Perfis escolhidos pela curadoria do Salinas Serviços para aparecerem primeiro."
          action={
            <Link to="/profissionais" className="btn btn-soft">
              Explorar todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {loading ? (
          <Loading label="Carregando destaques..." />
        ) : featured.length ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <div className="card mt-7 p-8 text-center text-sm text-deep/55">
            Os destaques do mês ainda estão sendo escolhidos. Enquanto isso, veja todos os
            profissionais cadastrados.
          </div>
        )}
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <PollCard />
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <div className="grid gap-8 rounded-[2rem] bg-deep p-7 text-white sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              <Users className="h-3.5 w-3.5" />
              Para profissionais
            </span>
            <h2 className="display mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              Seu trabalho merece ser encontrado.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              Crie seu perfil gratuitamente, adicione duas fotos, descreva seu serviço e receba
              contatos direto no WhatsApp. Sem comissão e sem letras miúdas.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/entrar?modo=cadastro" className="btn bg-gold text-deep-900 hover:bg-[#f0d184]">
                Criar meu perfil
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl('5571999990000', WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noreferrer"
                className="btn border border-white/20 text-white hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Tirar dúvidas
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { number: '01', title: 'Cadastre', text: 'Crie sua conta e monte o perfil.' },
              { number: '02', title: 'Apareça', text: 'Seja encontrado na busca.' },
              { number: '03', title: 'Atenda', text: 'Receba contatos no WhatsApp.' },
            ].map((step) => (
              <div key={step.number} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="display text-2xl font-bold text-gold">{step.number}</span>
                <p className="mt-3 text-sm font-bold">{step.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/50">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Novidades"
          title="Mais gente daqui"
          description="Perfis recentes e outros serviços que fazem parte da nossa rede."
          action={
            <Link to="/profissionais" className="btn btn-soft">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {loading ? (
          <Loading label="Carregando profissionais..." />
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {professionals.slice(0, 4).map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        )}
      </section>

      <section className="container-wide pt-14 sm:pt-20">
        <div className="flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-[var(--line)] bg-white p-7 text-center sm:flex-row sm:p-8 sm:text-left">
          <div>
            <p className="eyebrow">Comunidade</p>
            <h2 className="display mt-1 text-2xl font-bold text-deep sm:text-3xl">
              Indique um profissional de confiança.
            </h2>
            <p className="mt-1.5 text-sm text-deep/55">
              Conhece alguém que faz um trabalho incrível? Compartilhe o app com essa pessoa.
            </p>
          </div>
          <a
            href={whatsappUrl(
              '5571999990000',
              'Olá! Quero indicar um profissional para o Salinas Serviços.',
            )}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
            Indicar pelo WhatsApp
          </a>
        </div>
      </section>

      <p className="container-wide mt-8 text-center text-xs text-deep/40">
        {formatNumber(professionals.length)} perfis carregados nesta visita.
      </p>
    </div>
  )
}

