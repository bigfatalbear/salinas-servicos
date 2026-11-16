import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <div role="status" className="border-b border-sun/40 bg-sun/15">
      <div className="container-wide flex items-center justify-center gap-2 py-2 text-center text-xs font-semibold text-ink">
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
        Você está offline. Algumas informações podem estar desatualizadas.
      </div>
    </div>
  )
}
