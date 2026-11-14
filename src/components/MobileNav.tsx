import { NavLink } from 'react-router-dom'
import {
  Heart,
  Home,
  Info,
  LogIn,
  Search,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

export function MobileNav() {
  const { user, isAdmin } = useAuth()

  const items: Array<{ to: string; label: string; icon: LucideIcon; end?: boolean }> = [
    { to: '/', label: 'Início', icon: Home, end: true },
    { to: '/profissionais', label: 'Buscar', icon: Search },
    { to: '/favoritos', label: 'Favoritos', icon: Heart },
    isAdmin
      ? { to: '/admin', label: 'Admin', icon: ShieldCheck }
      : user
        ? { to: '/painel', label: 'Painel', icon: UserRound }
        : { to: '/entrar', label: 'Entrar', icon: LogIn },
    { to: '/sobre', label: 'Sobre', icon: Info },
  ]

  return (
    <nav
      className="mobile-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 px-2 pb-1 pt-2 lg:hidden"
      aria-label="Navegação móvel"
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
                'flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition',
                isActive ? 'text-tide' : 'text-deep/45 hover:text-deep/75',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}
