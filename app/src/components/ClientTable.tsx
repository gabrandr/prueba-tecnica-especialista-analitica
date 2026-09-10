import { formatCompactCurrency, formatCurrency, formatNumber } from '../lib/format'
import type { Client360 } from '../types/dashboard'
import styles from './Dashboard.module.css'

interface ClientTableProps {
  clients: Client360[]
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function ClientTable({ clients, page, pageSize, onPageChange }: ClientTableProps) {
  const pageCount = Math.max(1, Math.ceil(clients.length / pageSize))
  const pageClients = clients.slice((page - 1) * pageSize, page * pageSize)

  return (
    <section className={styles.clientsSection} aria-labelledby="clients-title">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>Detalle</p><h2 id="clients-title">Clientes</h2></div>
        <p>Mostrando {pageClients.length} de {formatNumber(clients.length)}</p>
      </div>
      {clients.length === 0 ? (
        <div className={styles.emptyState} role="status"><span aria-hidden="true">○</span><h3>Sin coincidencias</h3><p>Ajusta o limpia los filtros para volver a explorar la base.</p></div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table>
              <caption className="visually-hidden">Clientes resultantes de los filtros activos</caption>
              <thead><tr><th>Cliente</th><th>Segmento / ciudad</th><th>Productos</th><th>Depósitos</th><th>Deuda</th><th>Consumo</th><th>Lover principal</th></tr></thead>
              <tbody>{pageClients.map((client) => (
                <tr key={client.cliente_id}>
                  <td><strong>{client.nombre_cliente}</strong><small>{client.cliente_id}</small></td>
                  <td>{client.segmento_cliente}<small>{client.ciudad}</small></td>
                  <td>{formatNumber(client.cantidad_productos)}<small>{client.productos.join(' · ')}</small></td>
                  <td>{formatCompactCurrency(client.saldo_depositos_conocido)}</td>
                  <td>{formatCompactCurrency(client.saldo_deuda_conocido)}{client.saldo_incompleto ? <small>Saldo parcial</small> : null}</td>
                  <td>{formatCurrency(client.consumo_total)}<small>{formatNumber(client.cantidad_consumos)} consumos</small></td>
                  <td><span className={styles.loverBadge}>{client.lover_principal}</span>{client.cantidad_lovers > 1 ? <small>{client.cantidad_lovers} afinidades</small> : null}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className={styles.mobileCards}>{pageClients.map((client) => (
            <article key={client.cliente_id}>
              <div><span>{client.cliente_id}</span><span className={styles.loverBadge}>{client.lover_principal}</span></div>
              <h3>{client.nombre_cliente}</h3>
              <p>{client.segmento_cliente} · {client.ciudad}</p>
              <p className={styles.productLine}>{client.productos.join(' · ')}</p>
              <dl>
                <div><dt>Productos</dt><dd>{formatNumber(client.cantidad_productos)}</dd></div>
                <div><dt>Depósitos</dt><dd>{formatCompactCurrency(client.saldo_depositos_conocido)}</dd></div>
                <div>
                  <dt>Deuda</dt>
                  <dd>
                    {formatCompactCurrency(client.saldo_deuda_conocido)}
                    {client.saldo_incompleto ? <small>Saldo parcial</small> : null}
                  </dd>
                </div>
                <div>
                  <dt>Consumo</dt>
                  <dd>
                    {formatCurrency(client.consumo_total)}
                    <small>{formatNumber(client.cantidad_consumos)} consumos</small>
                  </dd>
                </div>
                {client.cantidad_lovers > 1 ? (
                  <div><dt>Afinidades</dt><dd>{client.cantidad_lovers}</dd></div>
                ) : null}
              </dl>
            </article>
          ))}</div>
          <nav className={styles.pagination} aria-label="Paginación de clientes">
            <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>← Anterior</button>
            <span aria-live="polite">Página {page} de {pageCount}</span>
            <button type="button" disabled={page === pageCount} onClick={() => onPageChange(page + 1)}>Siguiente →</button>
          </nav>
        </>
      )}
    </section>
  )
}
