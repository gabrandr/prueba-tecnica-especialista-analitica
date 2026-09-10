import { formatNumber, formatPercent } from '../lib/format'
import type { DataQualityReport } from '../types/dashboard'
import styles from './Dashboard.module.css'

export function OpportunityPanel({ report }: { report: DataQualityReport }) {
  const metrics = report.metricas_negocio
  return (
    <section className={styles.opportunities} aria-labelledby="opportunities-title">
      <div className={styles.opportunityIntro}>
        <p className={styles.eyebrow}>Acción sugerida</p>
        <h2 id="opportunities-title">Señales de la base completa</h2>
        <p>No cambian con los filtros porque el archivo cliente 360 no contiene su detalle por persona.</p>
      </div>
      <div className={styles.signal}><strong>{formatNumber(metrics.vencimientos_30_dias)}</strong><span>productos vencen<br />en 30 días</span></div>
      <div className={styles.signal}><strong>{formatNumber(metrics.vencimientos_90_dias)}</strong><span>productos vencen<br />en 90 días</span></div>
      <div className={styles.signal}><strong>{formatPercent(metrics.participacion_monto_outlier)}</strong><span>del monto está marcado<br />como consumo atípico</span></div>
    </section>
  )
}
