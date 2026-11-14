import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, Search } from 'lucide-react'

export function NotFound() {
  return (
    <div className="container-page py-20">
      <div className="card mx-auto max-w-xl p-8 text-center sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-sand-dark text-tide">
          <Compass className="h-8 w-8" />
        </span>
        <p className="eyebrow mt-5">Erro 404</p>
        <h1 className="display mt-2 text-4xl font-bold text-deep">Essa página não existe.</h1>
        <p className="mt-3 text-sm leading-relaxed text-deep/55">
          O endereço pode ter mudado ou o link está incompleto. Volte para o início e encontre um
          profissional de confiança.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
          <Link to="/profissionais" className="btn btn-soft">
            <Search className="h-4 w-4" />
            Buscar profissionais
          </Link>
        </div>
      </div>
    </div>
  )
}
