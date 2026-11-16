import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { getAuthRedirectUrl, supabase } from '../lib/supabase'
import { fetchMyProfessional, fetchUserRole } from '../lib/store'
import type { Professional, UserRole } from '../lib/types'

interface SignUpInput {
  email: string
  password: string
  businessName: string
  whatsapp: string
  categoryId: string
  neighborhood: string
  address: string
  description: string
}

interface AuthContextValue {
  user: User | null
  role: UserRole | null
  professional: Professional | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<UserRole>
  signUp: (input: SignUpInput) => Promise<{ needsConfirmation: boolean }>
  requestPasswordReset: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (nextUser: User) => {
    const [nextRole, nextProfessional] = await Promise.all([
      fetchUserRole(nextUser.id),
      fetchMyProfessional(nextUser.id),
    ])
    setRole(nextRole)
    setProfessional(nextProfessional)
  }, [])

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      const sessionUser = data.session?.user ?? null
      setUser(sessionUser)
      if (sessionUser) await loadProfile(sessionUser)
      if (active) setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        const resetUrl = getAuthRedirectUrl('/redefinir-senha')
        const currentUrl = `${window.location.origin}${window.location.pathname}`
        if (currentUrl !== resetUrl) {
          window.location.replace(resetUrl)
          return
        }
      }

      const sessionUser = session?.user ?? null
      setUser(sessionUser)
      if (sessionUser) {
        void loadProfile(sessionUser)
      } else {
        setRole(null)
        setProfessional(null)
      }
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [loadProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Não foi possível entrar.')
    const nextRole = await fetchUserRole(data.user.id)
    setRole(nextRole)
    setUser(data.user)
    await loadProfile(data.user)
    return nextRole
  }, [loadProfile])

  const signUp = useCallback(async (input: SignUpInput) => {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: {
          business_name: input.businessName.trim(),
          whatsapp: input.whatsapp.trim(),
          category_id: input.categoryId,
          neighborhood: input.neighborhood.trim(),
          address: input.address.trim(),
          description: input.description.trim(),
        },
      },
    })
    if (error) throw new Error(error.message)
    if (data.user && data.session) await loadProfile(data.user)
    return { needsConfirmation: !data.session }
  }, [loadProfile])

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getAuthRedirectUrl('/redefinir-senha'),
    })
    if (error) throw new Error(error.message)
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(error.message)
    if (data.user) setUser(data.user)
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setProfessional(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    await loadProfile(user)
  }, [loadProfile, user])

  const value = useMemo(
    () => ({
      user,
      role,
      professional,
      loading,
      isAdmin: role === 'admin',
      signIn,
      signUp,
      requestPasswordReset,
      updatePassword,
      signOut,
      refreshProfile,
    }),
    [
      user,
      role,
      professional,
      loading,
      signIn,
      signUp,
      requestPasswordReset,
      updatePassword,
      signOut,
      refreshProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
