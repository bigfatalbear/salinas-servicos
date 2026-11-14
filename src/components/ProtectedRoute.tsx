import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loading } from './Loading'

export function ProtectedRoute({
  children,
  admin = false,
}: {
  children: ReactNode
  admin?: boolean
}) {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="container-page py-16">
        <Loading label="Verificando seu acesso..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/entrar" state={{ from: location.pathname }} replace />
  }

  if (admin && !isAdmin) {
    return <Navigate to="/painel" replace />
  }

  return <>{children}</>
}
