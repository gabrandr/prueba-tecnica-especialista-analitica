const currencyFormatter = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const compactCurrencyFormatter = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('es-EC')
const percentFormatter = new Intl.NumberFormat('es-EC', {
  style: 'percent',
  maximumFractionDigits: 2,
})

export const formatCurrency = (value: number) => currencyFormatter.format(value)
export const formatCompactCurrency = (value: number) => compactCurrencyFormatter.format(value)
export const formatNumber = (value: number) => numberFormatter.format(value)
export const formatPercent = (value: number) => percentFormatter.format(value)

export function formatCutoffDate(value: string) {
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}
