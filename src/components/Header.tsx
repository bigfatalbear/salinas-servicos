import { Link, NavLink } from 'react-router-dom'
import { LogIn, ShieldCheck, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'
import { Logo } from './Logo'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/profissionais', label: 'Profissionais' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/sobre', label: 'Sobre' },
]

export function Header() {
  const { user, isAdmin, professional } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--header)] backdrop-blur-xl">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-white text-deep shadow-sm'
                    : 'text-deep/60 hover:bg-white/70 hover:text-deep',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-deep/65 transition hover:bg-white hover:text-deep sm:inline-flex"
            >
              <ShieldCheck className="h-4 w-4 text-tide" />
              Admin
            </Link>
          ) : null}

          {user ? (
            <Link
              to="/painel"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-deep transition hover:border-tide hover:text-tide"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-deep text-xs font-bold text-white">
                {professional?.business_name?.slice(0, 1).toUpperCase() || (
                  <UserRound className="h-4 w-4" />
                )}
              </span>
              <span className="hidden max-w-28 truncate sm:inline">Meu painel</span>
            </Link>
          ) : (
            <>
              <Link to="/entrar" className="btn btn-soft hidden sm:inline-flex">
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
              <Link to="/entrar?modo=cadastro" className="btn btn-primary">
                Sou profissional
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
