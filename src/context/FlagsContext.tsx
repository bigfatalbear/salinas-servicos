import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchFeatureFlags, flagsToMap } from '../lib/store'
import type { FeatureFlagMap } from '../lib/types'

interface FlagsContextValue {
  flags: FeatureFlagMap
  loading: boolean
  refresh: () => Promise<void>
}

const FlagsContext = createContext<FlagsContextValue | null>(null)

export function FlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlagMap>({})
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const rows = await fetchFeatureFlags()
      setFlags(flagsToMap(rows))
    } catch {
      setFlags({ poll_enabled: true, ratings_enabled: false })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(() => ({ flags, loading, refresh }), [flags, loading, refresh])

  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>
}

export function useFlags() {
  const context = useContext(FlagsContext)
  if (!context) throw new Error('useFlags deve ser usado dentro de FlagsProvider')
  return context
}
