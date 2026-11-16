import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, MapPin, Plus, Store } from 'lucide-react'
import { APP_NAME, CITY_NAME } from '../config'
import { BUSINESS_CATEGORIES } from '../data/site'
import { PageHeader } from '../components/PageHeader'
import { SectionHeading } from '../components/SectionHeading'
import { ShareButton } from '../components/ShareButton'

export function Businesses() {
  useEffect(() => {
    document.title = `Comércios — ${APP_NAME}`
  }, [])

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <PageHeader
        eyebrow="Comércio local"
        title="Quem abre a porta em Salinas."
        description="Mercados, restaurantes, lojas e serviços que fazem parte da rotina da cidade. Estamos preparando um diretório simples, sem complicação e feito para o comércio local."
        action={
          <Link to="/entrar?modo=cadastro" className="btn btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Cadastrar meu comércio
          </Link>
        }
      />

      <section className="mt-8">
        <div className="grid gap-4 rounded-[2rem] border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sun/20 text-ink">
              <Store className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-ink">Diretório em construção</p>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                A estrutura de comércios está sendo preparada com cuidado para receber dados
                reais, fotos e informações de contato verificadas. Enquanto isso, você já pode
                cadastrar seu negócio na rede.
              </p>
            </div>
          </div>
          <Link to="/entrar?modo=cadastro" className="btn btn-soft shrink-0">
            Quero participar
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Categorias"
          title="O comércio que faz a cidade girar."
          description="Uma prévia do que vamos reunir aqui."
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_CATEGORIES.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="card card-hover p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-ocean">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="display mt-4 text-lg font-extrabold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="pt-14 sm:pt-20">
        <div className="grid gap-8 rounded-[2rem] bg-brand-deep p-7 text-white sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow text-sun!">Para o comércio</p>
            <h2 className="display mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
              Sua porta aberta também pode ser encontrada.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              Um perfil simples, com endereço, contato e fotos, ajuda quem está por perto a
              encontrar você. Sem taxa de intermediação e sem complicação.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/entrar?modo=cadastro" className="btn btn-sun">
                Criar meu perfil
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <ShareButton
                label="Compartilhar"
                className="border-white/20! bg-white/5! text-white! hover:bg-white/10!"
              />
            </div>
          </div>
          <ul className="space-y-3">
            {[
              'Cadastro gratuito para negócios locais',
              'Contato direto pelo WhatsApp',
              'Espaço para fotos e descrição',
              'Feito para a realidade de Salinas',
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
              >
                <Check className="h-4 w-4 shrink-0 text-sun" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pt-12">
        <div className="flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-line bg-surface p-7 text-center sm:flex-row sm:text-left">
          <div>
            <p className="eyebrow">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {CITY_NAME}
            </p>
            <h2 className="display mt-1 text-2xl font-extrabold text-ink">
              Enquanto o diretório cresce, encontre um profissional.
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              A rede de serviços já está no ar e pronta para conectar você.
            </p>
          </div>
          <Link to="/profissionais" className="btn btn-primary shrink-0">
            Ver profissionais
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
