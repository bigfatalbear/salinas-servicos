import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  LogIn,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { NAV_LINKS } from '../data/site'
import { cn } from '../lib/utils'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { user, isAdmin, professional } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition duration-300',
          scrolled
            ? 'border-line bg-[var(--header)] shadow-[0_10px_40px_-30px_rgba(11,31,51,0.6)] backdrop-blur-xl'
            : 'border-transparent bg-[var(--header)] backdrop-blur-md',
        )}
      >
        <div className="container-wide flex h-16 items-center justify-between gap-3 lg:h-20">
          <Logo />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3.5 py-2 text-sm font-bold transition',
                    isActive
                      ? 'bg-ocean/10 text-ocean'
                      : 'text-ink/65 hover:bg-surface-2 hover:text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:grid" />

            <Link
              to="/profissionais"
              className="icon-btn lg:hidden"
              aria-label="Buscar profissionais"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </Link>

            {isAdmin ? (
              <Link
                to="/admin"
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-ink/65 transition hover:bg-surface-2 hover:text-ink md:inline-flex"
              >
                <ShieldCheck className="h-4 w-4 text-ocean" aria-hidden="true" />
                Admin
              </Link>
            ) : null}

            {user ? (
              <Link
                to="/painel"
                className="hidden min-h-11 items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-3 text-sm font-bold text-ink transition hover:border-ocean hover:text-ocean sm:inline-flex"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-deep text-xs font-extrabold text-white">
                  {professional?.business_name?.slice(0, 1).toUpperCase() || (
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                <span className="hidden max-w-28 truncate xl:inline">Meu painel</span>
              </Link>
            ) : (
              <Link to="/entrar" className="btn btn-soft hidden sm:inline-flex">
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Entrar
              </Link>
            )}

            <Link to="/entrar?modo=cadastro" className="btn btn-primary hidden md:inline-flex">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Anunciar serviço
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="icon-btn lg:hidden"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
