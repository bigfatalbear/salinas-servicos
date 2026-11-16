import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { cn } from '../lib/utils'

const labels = {
  system: 'Tema do sistema',
  light: 'Tema claro',
  dark: 'Tema escuro',
} as const

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, cycleMode } = useTheme()
  const Icon = mode === 'system' ? Monitor : mode === 'light' ? Sun : Moon
  const nextLabel =
    mode === 'system' ? 'claro' : mode === 'light' ? 'escuro' : 'do sistema'

  return (
    <button
      type="button"
      onClick={cycleMode}
      className={cn('icon-btn', className)}
      aria-label={`${labels[mode]}. Alternar para tema ${nextLabel}`}
      title={`${labels[mode]} — alternar para ${nextLabel}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
