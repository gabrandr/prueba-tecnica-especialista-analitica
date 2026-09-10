import { describe, expect, it } from 'vitest'
import { calculateMetrics, EMPTY_FILTERS, filterClients, validateDashboardData } from './dashboard'
import { makeClient, makeFullClientList, reportFixture } from '../test/fixtures'

describe('lógica del dashboard', () => {
  it('valida 2.200 clientes únicos y el reporte', () => {
    expect(validateDashboardData(makeFullClientList(), reportFixture).clients).toHaveLength(2200)
  })

  it('combina búsqueda sin tildes, segmento, producto y Lover multilabel', () => {
    const clients = [
      makeClient({ nombre_cliente: 'Ángela Solís', lovers: ['Travel Lover', 'Food Lover'], cantidad_lovers: 2, lover_principal: 'Food Lover' }),
      makeClient({ cliente_id: 'C000002', nombre_cliente: 'Otro cliente', lovers: [], lover_principal: 'Generalista' }),
    ]
    expect(filterClients(clients, { search: 'angela', segment: 'Affluent', city: 'Guayaquil', product: 'Tarjeta de Crédito', lover: 'Travel Lover' })).toHaveLength(1)
    expect(filterClients(clients, { ...EMPTY_FILTERS, lover: 'Generalista' })).toEqual([clients[1]])
  })

  it('recalcula saldos y utilización ponderada, evitando división por cero', () => {
    const metrics = calculateMetrics([makeClient(), makeClient({ cliente_id: 'C000002', saldo_tarjetas_conocido: 100, cupo_total_tarjetas: 1000 })])
    expect(metrics.clients).toBe(2)
    expect(metrics.weightedCardUtilization).toBeCloseTo(0.2)
    expect(calculateMetrics([makeClient({ cupo_total_tarjetas: 0, saldo_tarjetas_conocido: 0 })]).weightedCardUtilization).toBeNull()
  })
})
