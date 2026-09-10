import { useState } from 'react'

import { DashboardView } from './components/DashboardView'
import { LoginView } from './components/LoginView'
import { useDashboardData } from './hooks/useDashboardData'
import type { PowerBIConfig } from './types/dashboard'
import styles from './App.module.css'

export const AUTH_STORAGE_KEY = 'digotec-demo-auth-v1'

const powerBIConfig: PowerBIConfig = {
  embedUrl: import.meta.env.VITE_POWER_BI_EMBED_URL,
  reportId: import.meta.env.VITE_POWER_BI_REPORT_ID,
  workspaceId: import.meta.env.VITE_POWER_BI_WORKSPACE_ID,
}

function LoadingState() {
  return <main className={styles.statePage} aria-busy="true" aria-live="polite"><div className={styles.loader} aria-hidden="true" /><p>Preparando la vista de clientes…</p><small>Validando 2.200 perfiles y sus métricas.</small></main>
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <main className={styles.statePage}><span className={styles.stateCode}>!</span><h1>No pudimos cargar los datos</h1><p role="alert">{message}</p><button type="button" onClick={onRetry}>Reintentar carga</button></main>
}

function App() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated',
  )
  const { status, data, error, retry } = useDashboardData()

  function login() {
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'authenticated')
    document.documentElement.scrollTop = 0
    setAuthenticated(true)
  }

  function logout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthenticated(false)
  }

  if (!authenticated) return <LoginView onLogin={login} />
  if (status === 'loading') return <LoadingState />
  if (status === 'error') return <ErrorState message={error} onRetry={retry} />
  return <DashboardView data={data} onLogout={logout} powerBIConfig={powerBIConfig} />
}

export default App
