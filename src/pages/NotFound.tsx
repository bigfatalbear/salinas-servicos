import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, Search } from 'lucide-react'

export function NotFound() {
  return (
    <div className="container-page py-20">
      <div className="card mx-auto max-w-xl p-8 text-center sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent-soft text-ocean">
          <Compass className="h-8 w-8" aria-hidden="true" />
        </span>
        <p className="eyebrow mt-5">Erro 404</p>
        <h1 className="display mt-2 text-balance text-4xl font-extrabold text-ink">
          Essa página não existe.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          O endereço pode ter mudado ou o link está incompleto. Volte para o início e encontre um
          profissional de confiança.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao início
          </Link>
          <Link to="/profissionais" className="btn btn-soft">
            <Search className="h-4 w-4" aria-hidden="true" />
            Buscar profissionais
          </Link>
        </div>
      </div>
    </div>
  )
}
