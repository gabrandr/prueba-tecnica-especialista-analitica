import { useCallback, useEffect, useState } from 'react'

import { validateDashboardData } from '../lib/dashboard'
import type { DashboardData } from '../types/dashboard'

type DataState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: DashboardData; error: null }
  | { status: 'error'; data: null; error: string }

export function useDashboardData() {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<DataState>({
    status: 'loading',
    data: null,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadData() {
      try {
        const [clientsResponse, reportResponse] = await Promise.all([
          fetch('/data/clientes_360.json', { signal: controller.signal }),
          fetch('/data/data_quality_report.json', { signal: controller.signal }),
        ])
        if (!clientsResponse.ok || !reportResponse.ok) {
          throw new Error('No fue posible descargar los archivos analíticos.')
        }
        const [clients, report] = await Promise.all([
          clientsResponse.json(),
          reportResponse.json(),
        ])
        setState({
          status: 'success',
          data: validateDashboardData(clients, report),
          error: null,
        })
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            data: null,
            error: error instanceof Error ? error.message : 'Error de datos desconocido.',
          })
        }
      }
    }

    void loadData()
    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading', data: null, error: null })
    setAttempt((value) => value + 1)
  }, [])
  return { ...state, retry }
}
