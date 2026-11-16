import { NavLink, Link } from 'react-router-dom'
import { Grid2X2, Home, Plus, Search, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

export function MobileNav() {
  const { user } = useAuth()
  const profileTo = user ? '/painel' : '/entrar'

  const items = [
    { to: '/', label: 'Início', icon: Home, end: true },
    { to: '/profissionais', label: 'Buscar', icon: Search },
    { to: '/categorias', label: 'Categorias', icon: Grid2X2 },
  ]

  return (
    <nav
      className="mobile-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-0.5 px-2 pb-1 pt-1.5 lg:hidden"
      aria-label="Navegação mobile"
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-bold transition',
                isActive
                  ? 'bg-ocean/10 text-ocean'
                  : 'text-muted hover:bg-surface-2 hover:text-ink',
              )
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </NavLink>
        )
      })}

      <Link
        to="/entrar?modo=cadastro"
        className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-bold text-muted transition hover:bg-surface-2 hover:text-ink"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-ocean text-white shadow-sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
        </span>
        Anunciar
      </Link>

      <NavLink
        to={profileTo}
        className={({ isActive }) =>
          cn(
            'flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-bold transition',
            isActive
              ? 'bg-ocean/10 text-ocean'
              : 'text-muted hover:bg-surface-2 hover:text-ink',
          )
        }
      >
        <UserRound className="h-5 w-5" aria-hidden="true" />
        Perfil
      </NavLink>
    </nav>
  )
}
