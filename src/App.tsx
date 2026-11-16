import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { Loading } from './components/Loading'
import { ProtectedRoute } from './components/ProtectedRoute'

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })))
const Categories = lazy(() =>
  import('./pages/Categories').then((module) => ({ default: module.Categories })),
)
const Professionals = lazy(() =>
  import('./pages/Professionals').then((module) => ({ default: module.Professionals })),
)
const ProfessionalDetail = lazy(() =>
  import('./pages/ProfessionalDetail').then((module) => ({
    default: module.ProfessionalDetail,
  })),
)
const Businesses = lazy(() =>
  import('./pages/Businesses').then((module) => ({ default: module.Businesses })),
)
const Tourism = lazy(() =>
  import('./pages/Tourism').then((module) => ({ default: module.Tourism })),
)
const Favorites = lazy(() =>
  import('./pages/Favorites').then((module) => ({ default: module.Favorites })),
)
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })))
const ResetPassword = lazy(() =>
  import('./pages/ResetPassword').then((module) => ({ default: module.ResetPassword })),
)
const Dashboard = lazy(() =>
  import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })),
)
const Admin = lazy(() => import('./pages/Admin').then((module) => ({ default: module.Admin })))
const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })))
const NotFound = lazy(() =>
  import('./pages/NotFound').then((module) => ({ default: module.NotFound })),
)

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Suspense
        fallback={
          <div className="container-wide py-24">
            <Loading label="Carregando página..." />
          </div>
        }
      >
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="categorias" element={<Categories />} />
            <Route path="profissionais" element={<Professionals />} />
            <Route path="profissionais/:id" element={<ProfessionalDetail />} />
            <Route path="comercios" element={<Businesses />} />
            <Route path="turismo" element={<Tourism />} />
            <Route path="favoritos" element={<Favorites />} />
            <Route path="entrar" element={<Login />} />
            <Route path="redefinir-senha" element={<ResetPassword />} />
            <Route path="sobre" element={<About />} />
            <Route
              path="painel"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute admin>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
