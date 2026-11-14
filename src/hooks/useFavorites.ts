import { useCallback, useEffect, useState } from 'react'
import { readFavorites, writeFavorites } from '../lib/utils'

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(() => readFavorites())

  useEffect(() => {
    const sync = () => setIds(readFavorites())
    window.addEventListener('ss:favorites-changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('ss:favorites-changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggle = useCallback((id: string) => {
    const current = readFavorites()
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]
    writeFavorites(next)
    setIds(next)
    return next.includes(id)
  }, [])

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids])

  return { ids, toggle, isFavorite }
}
