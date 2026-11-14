import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { Professionals } from './pages/Professionals'
import { ProfessionalDetail } from './pages/ProfessionalDetail'
import { Favorites } from './pages/Favorites'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Admin } from './pages/Admin'
import { About } from './pages/About'
import { NotFound } from './pages/NotFound'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="profissionais" element={<Professionals />} />
          <Route path="profissionais/:id" element={<ProfessionalDetail />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route path="entrar" element={<Login />} />
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
    </BrowserRouter>
  )
}
