import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Grid2X2,
  Heart,
  Home,
  Info,
  LogIn,
  Palmtree,
  Plus,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { NAV_LINKS } from '../data/site'
import { cn } from '../lib/utils'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const iconByTo: Record<string, LucideIcon> = {
  '/': Home,
  '/categorias': Grid2X2,
  '/profissionais': Search,
  '/comercios': Store,
  '/turismo': Palmtree,
  '/sobre': Info,
}

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, isAdmin } = useAuth()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-brand-deep/55 backdrop-blur-[2px]"
        aria-label="Fechar menu"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        className="absolute inset-y-0 right-0 flex w-[min(88vw,23rem)] flex-col overflow-y-auto border-l border-line bg-surface p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3">
          <span onClick={onClose}>
            <Logo />
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="icon-btn shrink-0"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-7 flex flex-col gap-1" aria-label="Navegação principal mobile">
          {NAV_LINKS.map((item) => {
            const Icon = iconByTo[item.to] ?? Home
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-12 items-center gap-3 rounded-2xl px-3.5 text-sm font-bold transition',
                    isActive
                      ? 'bg-ocean/10 text-ocean'
                      : 'text-ink/75 hover:bg-surface-2 hover:text-ink',
                  )
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-5 border-t border-line pt-5">
          <Link
            to="/entrar?modo=cadastro"
            className="btn btn-primary w-full"
            onClick={onClose}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Anunciar meu serviço
          </Link>
          <Link
            to="/favoritos"
            className="btn btn-soft mt-2 w-full"
            onClick={onClose}
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            Meus favoritos
          </Link>
        </div>

        <div className="mt-auto space-y-2 pt-6">
          {user ? (
            <>
              <Link
                to="/painel"
                className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-ink/75 hover:bg-surface-2"
                onClick={onClose}
              >
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Meu painel
              </Link>
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-ink/75 hover:bg-surface-2"
                  onClick={onClose}
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Administração
                </Link>
              ) : null}
            </>
          ) : (
            <Link
              to="/entrar"
              className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-ink/75 hover:bg-surface-2"
              onClick={onClose}
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Entrar
            </Link>
          )}
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface-2 px-3 py-2.5">
            <span className="text-xs font-bold text-muted">Aparência</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
