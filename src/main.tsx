import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource/playfair-display/600.css'
import '@fontsource/playfair-display/700.css'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { FlagsProvider } from './context/FlagsContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <FlagsProvider>
          <App />
        </FlagsProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)
