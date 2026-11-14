import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { APP_NAME, CITY, WHATSAPP_MESSAGE } from '../config'
import { whatsappUrl } from '../lib/utils'
import { SectionHeading } from '../components/SectionHeading'

export function About() {
  return (
    <div className="container-wide pt-10 sm:pt-16">
      <div className="max-w-3xl">
        <p className="eyebrow inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {CITY}
        </p>
        <h1 className="display mt-3 text-4xl font-bold leading-[1.05] text-deep sm:text-6xl">
          Um guia feito por quem vive Salinas.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-deep/65 sm:text-lg">
          O {APP_NAME} nasceu de uma ideia simples: quem trabalha aqui merece ser encontrado com
          facilidade. Reunimos profissionais da sede e dos distritos em um só lugar, com contato
          direto e recomendação da comunidade.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Heart,
            title: 'Valorizar o local',
            text: 'Cada perfil é uma história de trabalho e dedicação da nossa gente.',
          },
          {
            icon: ShieldCheck,
            title: 'Sem intermediários',
            text: 'Você fala direto com o profissional pelo WhatsApp, sem taxas escondidas.',
          },
          {
            icon: Users,
            title: 'Comunidade',
            text: 'As recomendações são positivas e ajudam a destacar quem faz bem.',
          },
        ].map((item) => (
          <div key={item.title} className="card p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-tide/10 text-tide">
              <item.icon className="h-5 w-5" />
            </span>
            <h2 className="display mt-4 text-xl font-bold text-deep">{item.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-deep/55">{item.text}</p>
          </div>
        ))}
      </div>

      <section className="mt-14 grid gap-8 rounded-[2rem] bg-deep p-7 text-white sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="eyebrow text-gold!">Como funciona</p>
          <h2 className="display mt-2 text-3xl font-bold leading-tight sm:text-4xl">
            Simples para quem procura. Justo para quem trabalha.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            Busque por serviço ou bairro, salve seus favoritos e chame no WhatsApp. Se você é
            profissional, crie seu perfil gratuitamente e mantenha suas informações atualizadas.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/profissionais" className="btn bg-gold text-deep-900 hover:bg-[#f0d184]">
              Encontrar profissional
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/entrar?modo=cadastro"
              className="btn border border-white/20 text-white hover:bg-white/10"
            >
              Criar meu perfil
            </Link>
          </div>
        </div>
        <div className="space-y-3">
          {[
            'Perfis de profissionais da sede e dos distritos',
            'Duas fotos para mostrar o trabalho',
            'Contato direto pelo WhatsApp',
            'Recomendação positiva da comunidade',
            'Destaques escolhidos pela curadoria',
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
            >
              <Star className="h-4 w-4 shrink-0 fill-gold text-gold" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Nossa intenção"
          title="Tecnologia com cara de cidade pequena."
          description="O app é leve, funciona no celular e pode ser instalado na tela inicial. A ideia é facilitar o dia a dia sem complicar para quem está do outro lado."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <Sparkles className="h-5 w-5 text-gold" />
            <h3 className="display mt-3 text-xl font-bold text-deep">Feito para o celular</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-deep/55">
              Navegação simples, botões grandes e WhatsApp a um toque. Instale o app e acesse como
              um aplicativo comum.
            </p>
          </div>
          <div className="card p-5">
            <MessageCircle className="h-5 w-5 text-tide" />
            <h3 className="display mt-3 text-xl font-bold text-deep">Aberto à comunidade</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-deep/55">
              Encontrou algum problema ou quer indicar um profissional? Fale com a equipe pelo
              WhatsApp e ajude a melhorar o guia.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-[var(--line)] bg-white p-7 text-center sm:flex-row sm:text-left">
        <div>
          <p className="eyebrow">Fale com a gente</p>
          <h2 className="display mt-1 text-2xl font-bold text-deep">
            Tem uma sugestão ou quer indicar alguém?
          </h2>
          <p className="mt-1.5 text-sm text-deep/55">
            Estamos construindo este guia junto com a comunidade.
          </p>
        </div>
        <a
          href={whatsappUrl('5571999990000', WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary shrink-0"
        >
          <MessageCircle className="h-4 w-4" />
          Chamar no WhatsApp
        </a>
      </div>
    </div>
  )
}
