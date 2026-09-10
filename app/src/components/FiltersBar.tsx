import { useState } from 'react'

import type { DashboardFilters, LoverPrincipal, ProductType, Segment } from '../types/dashboard'
import styles from './Dashboard.module.css'

interface FiltersBarProps {
  filters: DashboardFilters
  options: {
    segments: Segment[]
    cities: string[]
    products: readonly ProductType[]
    lovers: readonly LoverPrincipal[]
  }
  resultCount: number
  onChange: (filters: DashboardFilters) => void
  onClear: () => void
}

export function FiltersBar({ filters, options, resultCount, onChange, onClear }: FiltersBarProps) {
  const [expanded, setExpanded] = useState(false)
  const activeCount = Object.values(filters).filter(Boolean).length
  const update = <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <section className={styles.filtersSection} aria-labelledby="filters-title">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>Exploración</p><h1 id="filters-title">Panorama de clientes</h1></div>
        <p className={styles.resultCount} aria-live="polite"><strong>{resultCount.toLocaleString('es-EC')}</strong> clientes visibles</p>
      </div>
      <button
        className={styles.mobileFilterToggle}
        type="button"
        aria-expanded={expanded}
        aria-controls="dashboard-filters"
        onClick={() => setExpanded((value) => !value)}
      >
        Filtros · {activeCount} activos <span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>
      <div id="dashboard-filters" className={`${styles.filters} ${expanded ? styles.filtersExpanded : ''}`}>
        <label className={styles.searchField}>Buscar cliente
          <input value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Nombre o ID" type="search" />
        </label>
        <label>Segmento
          <select value={filters.segment} onChange={(event) => update('segment', event.target.value as DashboardFilters['segment'])}>
            <option value="">Todos</option>{options.segments.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>Ciudad
          <select value={filters.city} onChange={(event) => update('city', event.target.value)}>
            <option value="">Todas</option>{options.cities.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>Producto
          <select value={filters.product} onChange={(event) => update('product', event.target.value as DashboardFilters['product'])}>
            <option value="">Todos</option>{options.products.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>Lover
          <select value={filters.lover} onChange={(event) => update('lover', event.target.value as DashboardFilters['lover'])}>
            <option value="">Todos</option>{options.lovers.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <button className={styles.clearButton} type="button" onClick={onClear} disabled={activeCount === 0}>Limpiar filtros</button>
      </div>
    </section>
  )
}
