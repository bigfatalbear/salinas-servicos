import { Loader2 } from 'lucide-react'

export function Loading({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-muted">
      <Loader2 className="h-7 w-7 animate-spin text-ocean" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-10 w-full rounded-full" />
      </div>
    </div>
  )
}
