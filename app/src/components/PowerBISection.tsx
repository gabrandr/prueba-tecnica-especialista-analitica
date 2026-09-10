import type { PowerBIConfig } from '../types/dashboard'
import styles from './Dashboard.module.css'

function isValidEmbedUrl(value?: string) {
  if (!value) return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function PowerBISection({ config }: { config: PowerBIConfig }) {
  const configured = isValidEmbedUrl(config.embedUrl)
  return (
    <section className={styles.powerBi} aria-labelledby="powerbi-title">
      <div className={styles.powerBiCopy}>
        <p className={styles.eyebrow}>Power BI</p>
        <h2 id="powerbi-title">Reporte analítico</h2>
        <p>{configured ? 'Visualización configurada desde variables de entorno.' : 'Integración preparada, pendiente de publicación y permisos en Power BI Service.'}</p>
        {!configured ? <ul><li>Publicar el PBIX en un workspace autorizado.</li><li>Configurar URL, report ID y workspace ID.</li><li>Para datos privados, usar Azure AD y un token de embed emitido por un backend seguro.</li></ul> : null}
      </div>
      <div className={styles.powerBiFrame}>
        {configured ? (
          <iframe title="Reporte Power BI de Digotec Analytics" src={config.embedUrl} allowFullScreen />
        ) : (
          <div role="status"><span aria-hidden="true">PBI</span><strong>Reporte no configurado</strong><small>El dashboard React funciona de manera independiente.</small></div>
        )}
      </div>
    </section>
  )
}
