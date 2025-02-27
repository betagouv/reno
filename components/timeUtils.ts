export const timeIsRunningOut = (to) => {
  const toDate = new Date(Date.parse(to))
  const now = new Date()
  const months = monthDiff(now, toDate)

  if (months < 12) return months + ' mois'
  if (months < 12 + 3) return '1 an'
  if (months < 12 + 8) return '1 an et demi'
  if (months < 12 + 12) return 'moins de 2 ans'

  const years = Math.floor(months / 12),
    reminder = months % 12
  if (years > 8) return years + ' ans'
  if (reminder > 6) return `moins de ${years + 1} ans`
  return `${years} ans`
}

function monthDiff(dateFrom, dateTo) {
  return (
    dateTo.getMonth() -
    dateFrom.getMonth() +
    12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  )
}
