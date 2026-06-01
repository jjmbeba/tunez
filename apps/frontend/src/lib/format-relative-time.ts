const DIVISIONS = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
] as const

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
})

export function formatRelativeTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  let elapsed = (date.getTime() - Date.now()) / 1000

  for (const division of DIVISIONS) {
    if (Math.abs(elapsed) < division.amount) {
      return relativeTimeFormatter.format(Math.round(elapsed), division.unit)
    }

    elapsed /= division.amount
  }

  return relativeTimeFormatter.format(0, 'second')
}
