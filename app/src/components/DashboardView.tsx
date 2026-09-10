import { useMemo, useState } from 'react'

import { calculateMetrics, countPrincipalLovers, countProducts, EMPTY_FILTERS, filterClients, getFilterOptions } from '../lib/dashboard'
import { formatCutoffDate } from '../lib/format'
import type { DashboardData, DashboardFilters, PowerBIConfig } from '../types/dashboard'
import { BarChart } from './BarChart'
import { ClientTable } from './ClientTable'
import { FiltersBar } from './FiltersBar'
import { KpiGrid } from './KpiGrid'
import { OpportunityPanel } from './OpportunityPanel'
import { PowerBISection } from './PowerBISection'
import styles from './Dashboard.module.css'

interface DashboardViewProps {
  data: DashboardData
  onLogout: () => void
  powerBIConfig: PowerBIConfig
}

export function DashboardView({ data, onLogout, powerBIConfig }: DashboardViewProps) {
  const [filters, setFilters] = useState<DashboardFilters>(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const options = useMemo(() => getFilterOptions(data.clients), [data.clients])
  const filteredClients = useMemo(() => filterClients(data.clients, filters), [data.clients, filters])
  const metrics = useMemo(() => calculateMetrics(filteredClients), [filteredClients])
  const productData = useMemo(() => countProducts(filteredClients), [filteredClients])
  const loverData = useMemo(() => countPrincipalLovers(filteredClients), [filteredClients])

  function handleFilterChange(nextFilters: DashboardFilters) {
    setFilters(nextFilters)
    setPage(1)
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
      <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}><span aria-hidden="true">D</span><strong>Digotec Analytics</strong><small>Cliente 360</small></div>
        <div className={styles.headerActions}><p>Corte <strong>{formatCutoffDate(data.qualityReport.fecha_corte)}</strong></p><button type="button" onClick={onLogout}>Cerrar sesión</button></div>
      </header>
      <main id="main-content" className={styles.main}>
        <FiltersBar filters={filters} options={options} resultCount={filteredClients.length} onChange={handleFilterChange} onClear={clearFilters} />
        <KpiGrid metrics={metrics} />
        <section aria-labelledby="charts-title">
          <h2 id="charts-title" className="visually-hidden">Visualizaciones de la población filtrada</h2>
          <div className={styles.chartGrid}>
          <BarChart eyebrow="Portafolio" title="Tenencia por producto" description="Relaciones cliente-producto; un cliente puede aparecer en varias barras." data={productData} />
          <BarChart eyebrow="Comportamiento" title="Segmentación principal" description="Una clasificación por cliente, sin doble conteo." data={loverData} variant="gold" />
          </div>
        </section>
        <OpportunityPanel report={data.qualityReport} />
        <ClientTable clients={filteredClients} page={page} pageSize={10} onPageChange={setPage} />
        <PowerBISection config={powerBIConfig} />
      </main>
      <footer className={styles.footer}><span>Digotec Analytics · MVP demostrativo</span><span>Datos sintéticos · montos presentados en USD*</span></footer>
      </div>
    </>
  )
}
