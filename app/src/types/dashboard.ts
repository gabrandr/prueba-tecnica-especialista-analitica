export const SEGMENTS = ['Affluent', 'Joven', 'Mass', 'Premium', 'PyME'] as const
export type Segment = (typeof SEGMENTS)[number]

export const PRODUCT_TYPES = [
  'Cuenta de Ahorros',
  'Cuenta Corriente',
  'Tarjeta de Crédito',
  'Crédito de Consumo',
  'Crédito Hipotecario',
  'Crédito Vehicular',
] as const
export type ProductType = (typeof PRODUCT_TYPES)[number]

export const LOVER_TYPES = [
  'Travel Lover',
  'Streaming Lover',
  'Food Lover',
  'Tech Lover',
] as const
export type LoverType = (typeof LOVER_TYPES)[number]

export const LOVER_PRINCIPALS = [
  ...LOVER_TYPES,
  'Generalista',
  'Sin información transaccional',
] as const
export type LoverPrincipal = (typeof LOVER_PRINCIPALS)[number]

export interface Client360 {
  cliente_id: string
  nombre_cliente: string
  segmento_cliente: Segment
  segmento_conflictivo: boolean
  ciudad: string
  ciudad_desconocida: boolean
  edad: number
  ingreso_estimado: number
  cantidad_productos: number
  es_multiproducto: boolean
  productos: ProductType[]
  cantidad_productos_sin_saldo: number
  saldo_depositos_conocido: number
  saldo_deuda_conocido: number
  saldo_tarjetas_conocido: number
  saldo_incompleto: boolean
  cupo_total_tarjetas: number
  cantidad_consumos: number
  tiene_consumos: boolean
  consumo_total: number
  consumo_promedio: number | null
  fecha_ultimo_consumo: string | null
  es_travel_lover: boolean
  es_streaming_lover: boolean
  es_food_lover: boolean
  es_tech_lover: boolean
  cantidad_lovers: number
  lovers: LoverType[]
  lover_principal: LoverPrincipal
}

export interface DashboardFilters {
  search: string
  segment: Segment | ''
  city: string
  product: ProductType | ''
  lover: LoverPrincipal | ''
}

export interface DashboardMetrics {
  clients: number
  multiproductClients: number
  deposits: number
  debt: number
  consumption: number
  cardBalance: number
  cardLimit: number
  weightedCardUtilization: number | null
}

export interface DataQualityReport {
  fase: number
  fecha_corte: string
  metricas_negocio: {
    vencimientos_30_dias: number
    vencimientos_90_dias: number
    consumos_outlier: number
    participacion_transacciones_outlier: number
    participacion_monto_outlier: number
  }
}

export interface DashboardData {
  clients: Client360[]
  qualityReport: DataQualityReport
}

export interface PowerBIConfig {
  embedUrl?: string
  reportId?: string
  workspaceId?: string
}
