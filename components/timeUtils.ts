export const timeIsRunningOut = (to) => {
  const toDate = new Date(Date.parse(to))
  const now = new Date()
  const months = monthDiff(now, toDate)

  const monthsAbs = Math.abs(months)

  const prefix = months < 0 ? 'Depuis' : 'Dans'
  if (months < 12) return `${prefix} ${monthsAbs} mois`
  if (months < 12 + 3) return `${prefix} 1 an`
  if (months < 12 + 8) return `${prefix} 1 an et demi`
  if (months < 12 + 12) return `${prefix} moins de 2 ans`

  const years = Math.floor(monthsAbs / 12),
    reminder = monthsAbs % 12
  if (years > 8) return `${prefix} ${years} ans`
  if (reminder > 6) return `${prefix} moins de ${years + 1} ans`
  return `${prefix} ${years} ans`
}

function monthDiff(dateFrom, dateTo) {
  return (
    dateTo.getMonth() -
    dateFrom.getMonth() +
    12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  )
}
