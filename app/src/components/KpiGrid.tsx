import { formatCompactCurrency, formatNumber, formatPercent } from '../lib/format'
import type { DashboardMetrics } from '../types/dashboard'
import styles from './Dashboard.module.css'

export function KpiGrid({ metrics }: { metrics: DashboardMetrics }) {
  const cards = [
    { label: 'Clientes', value: formatNumber(metrics.clients), detail: 'población filtrada' },
    { label: 'Multiproducto', value: formatNumber(metrics.multiproductClients), detail: 'dos o más productos' },
    { label: 'Depósitos', value: formatCompactCurrency(metrics.deposits), detail: 'saldo conocido' },
    { label: 'Deuda', value: formatCompactCurrency(metrics.debt), detail: 'saldo conocido' },
    { label: 'Consumo', value: formatCompactCurrency(metrics.consumption), detail: 'tarjeta · periodo completo' },
    {
      label: 'Utilización TC',
      value: metrics.weightedCardUtilization === null ? 'Sin cupo aplicable' : formatPercent(metrics.weightedCardUtilization),
      detail: 'saldo de tarjeta / cupo',
    },
  ]
  return (
    <section className={styles.kpiGrid} aria-label="Indicadores de la población filtrada">
      {cards.map((card) => (
        <article className={styles.kpiCard} key={card.label}>
          <p>{card.label}</p><strong>{card.value}</strong><small>{card.detail}</small>
        </article>
      ))}
    </section>
  )
}
