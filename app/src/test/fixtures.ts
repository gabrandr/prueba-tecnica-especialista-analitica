import type { Client360, DataQualityReport } from '../types/dashboard'

export function makeClient(overrides: Partial<Client360> = {}): Client360 {
  return {
    cliente_id: 'C000001', nombre_cliente: 'Cliente Ángela', segmento_cliente: 'Affluent', segmento_conflictivo: false,
    ciudad: 'Guayaquil', ciudad_desconocida: false, edad: 37, ingreso_estimado: 5000,
    cantidad_productos: 2, es_multiproducto: true, productos: ['Cuenta de Ahorros', 'Tarjeta de Crédito'],
    cantidad_productos_sin_saldo: 0, saldo_depositos_conocido: 1000, saldo_deuda_conocido: 500,
    saldo_tarjetas_conocido: 500, saldo_incompleto: false, cupo_total_tarjetas: 2000,
    cantidad_consumos: 3, tiene_consumos: true, consumo_total: 200, consumo_promedio: 66.67,
    fecha_ultimo_consumo: '2026-08-01', es_travel_lover: true, es_streaming_lover: false,
    es_food_lover: false, es_tech_lover: false, cantidad_lovers: 1, lovers: ['Travel Lover'],
    lover_principal: 'Travel Lover', ...overrides,
  }
}

export const reportFixture: DataQualityReport = {
  fase: 4,
  fecha_corte: '2026-08-31',
  metricas_negocio: {
    vencimientos_30_dias: 22, vencimientos_90_dias: 153, consumos_outlier: 1231,
    participacion_transacciones_outlier: 0.082767, participacion_monto_outlier: 0.376309,
  },
}

export const makeFullClientList = () => Array.from({ length: 2200 }, (_, index) =>
  makeClient({ cliente_id: `C${String(index + 1).padStart(6, '0')}`, nombre_cliente: `Cliente ${String(index + 1).padStart(4, '0')}` }),
)
