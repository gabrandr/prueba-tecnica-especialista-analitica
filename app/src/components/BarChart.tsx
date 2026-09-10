import { formatNumber } from '../lib/format'
import styles from './Dashboard.module.css'

interface BarChartProps {
  title: string
  eyebrow: string
  description: string
  data: { label: string; value: number }[]
  variant?: 'blue' | 'gold'
}

export function BarChart({ title, eyebrow, description, data, variant = 'blue' }: BarChartProps) {
  const maximum = Math.max(...data.map((item) => item.value), 1)
  return (
    <article className={styles.chartCard}>
      <header><p className={styles.eyebrow}>{eyebrow}</p><h3>{title}</h3><p>{description}</p></header>
      <div className={styles.bars} role="img" aria-label={`${title}. ${data.map((item) => `${item.label}: ${item.value}`).join('; ')}`}>
        {data.map((item) => (
          <div className={styles.barRow} key={item.label}>
            <div className={styles.barMeta}><span>{item.label}</span><strong>{formatNumber(item.value)}</strong></div>
            <div className={styles.barTrack} aria-hidden="true"><span className={variant === 'gold' ? styles.barGold : ''} style={{ width: `${(item.value / maximum) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </article>
  )
}
