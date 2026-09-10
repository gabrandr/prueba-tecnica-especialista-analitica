import {
  LOVER_PRINCIPALS,
  LOVER_TYPES,
  PRODUCT_TYPES,
  SEGMENTS,
  type Client360,
  type DashboardData,
  type DashboardFilters,
  type DashboardMetrics,
  type DataQualityReport,
  type LoverPrincipal,
  type ProductType,
  type Segment,
} from '../types/dashboard'

export const EMPTY_FILTERS: DashboardFilters = {
  search: '',
  segment: '',
  city: '',
  product: '',
  lover: '',
}

const REQUIRED_CLIENT_KEYS: (keyof Client360)[] = [
  'cliente_id',
  'nombre_cliente',
  'segmento_cliente',
  'ciudad',
  'productos',
  'saldo_depositos_conocido',
  'saldo_deuda_conocido',
  'saldo_tarjetas_conocido',
  'cupo_total_tarjetas',
  'consumo_total',
  'lovers',
  'lover_principal',
]

const normalizeSearch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()

export function validateDashboardData(
  clientsValue: unknown,
  reportValue: unknown,
): DashboardData {
  if (!Array.isArray(clientsValue) || clientsValue.length !== 2200) {
    throw new Error('La vista cliente 360 no contiene los 2.200 clientes esperados.')
  }

  const ids = new Set<string>()
  for (const value of clientsValue) {
    if (typeof value !== 'object' || value === null) {
      throw new Error('La vista cliente 360 contiene un registro inválido.')
    }
    const client = value as Record<string, unknown>
    if (REQUIRED_CLIENT_KEYS.some((key) => !(key in client))) {
      throw new Error('La vista cliente 360 no cumple el contrato esperado.')
    }
    if (typeof client.cliente_id !== 'string' || ids.has(client.cliente_id)) {
      throw new Error('Los identificadores de cliente no son únicos.')
    }
    if (
      !SEGMENTS.includes(client.segmento_cliente as Segment) ||
      !Array.isArray(client.productos) ||
      !client.productos.every((product) => PRODUCT_TYPES.includes(product as ProductType)) ||
      !Array.isArray(client.lovers) ||
      !LOVER_PRINCIPALS.includes(client.lover_principal as LoverPrincipal)
    ) {
      throw new Error('La vista cliente 360 contiene categorías fuera del contrato.')
    }
    ids.add(client.cliente_id)
  }

  if (typeof reportValue !== 'object' || reportValue === null) {
    throw new Error('El reporte de calidad no es un objeto válido.')
  }
  const report = reportValue as DataQualityReport
  if (
    typeof report.fecha_corte !== 'string' ||
    typeof report.metricas_negocio?.vencimientos_30_dias !== 'number' ||
    typeof report.metricas_negocio?.participacion_monto_outlier !== 'number'
  ) {
    throw new Error('El reporte de calidad no cumple el contrato esperado.')
  }

  return { clients: clientsValue as Client360[], qualityReport: report }
}

export function filterClients(clients: Client360[], filters: DashboardFilters) {
  const query = normalizeSearch(filters.search)
  const loverIsMultilabel = LOVER_TYPES.includes(filters.lover as never)

  return clients.filter((client) => {
    const matchesSearch =
      query.length === 0 ||
      normalizeSearch(client.nombre_cliente).includes(query) ||
      normalizeSearch(client.cliente_id).includes(query)
    const matchesSegment =
      filters.segment === '' || client.segmento_cliente === filters.segment
    const matchesCity = filters.city === '' || client.ciudad === filters.city
    const matchesProduct =
      filters.product === '' || client.productos.includes(filters.product)
    const matchesLover =
      filters.lover === '' ||
      (loverIsMultilabel
        ? client.lovers.includes(filters.lover as (typeof LOVER_TYPES)[number])
        : client.lover_principal === filters.lover)

    return (
      matchesSearch &&
      matchesSegment &&
      matchesCity &&
      matchesProduct &&
      matchesLover
    )
  })
}

export function calculateMetrics(clients: Client360[]): DashboardMetrics {
  const metrics = clients.reduce(
    (result, client) => {
      result.clients += 1
      result.multiproductClients += Number(client.es_multiproducto)
      result.deposits += client.saldo_depositos_conocido
      result.debt += client.saldo_deuda_conocido
      result.consumption += client.consumo_total
      result.cardBalance += client.saldo_tarjetas_conocido
      result.cardLimit += client.cupo_total_tarjetas
      return result
    },
    {
      clients: 0,
      multiproductClients: 0,
      deposits: 0,
      debt: 0,
      consumption: 0,
      cardBalance: 0,
      cardLimit: 0,
      weightedCardUtilization: null as number | null,
    },
  )
  metrics.weightedCardUtilization =
    metrics.cardLimit > 0 ? metrics.cardBalance / metrics.cardLimit : null
  return metrics
}

export function countProducts(clients: Client360[]) {
  const counts = new Map<ProductType, number>(PRODUCT_TYPES.map((item) => [item, 0]))
  for (const client of clients) {
    for (const product of client.productos) {
      counts.set(product, (counts.get(product) ?? 0) + 1)
    }
  }
  return PRODUCT_TYPES.map((label) => ({ label, value: counts.get(label) ?? 0 }))
}

export function countPrincipalLovers(clients: Client360[]) {
  const counts = new Map<LoverPrincipal, number>(
    LOVER_PRINCIPALS.map((item) => [item, 0]),
  )
  for (const client of clients) {
    counts.set(client.lover_principal, (counts.get(client.lover_principal) ?? 0) + 1)
  }
  return LOVER_PRINCIPALS.map((label) => ({ label, value: counts.get(label) ?? 0 }))
}

export function getFilterOptions(clients: Client360[]) {
  return {
    segments: [...new Set(clients.map((client) => client.segmento_cliente))].sort(),
    cities: [...new Set(clients.map((client) => client.ciudad))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    ),
    products: PRODUCT_TYPES,
    lovers: LOVER_PRINCIPALS,
  }
}
