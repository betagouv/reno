import css from './css/convertToJs'

export default function DifferentialResult({
  value,
  newValue,
  currentQuestion,
}) {
  const diff = value - newValue
  if (diff === 0) return null
  const sign = diff > 0 ? '-' : diff === 0 ? '' : '+',
    abs = Math.abs(diff)

  if (!currentQuestion) return null
  const color = diff === 0 ? 'inherit' : diff > 0 ? 'orange' : 'lightgreen'
  return (
    <div>
      Estimation temporaire&nbsp;:&nbsp;
      <span
        style={css(`
          text-decoration: underline;
          text-decoration-color: ${color};
		  text-decoration-thickness: 3px
        `)}
      >
        {sign}&nbsp;{abs}&nbsp;€
      </span>
    </div>
  )
}
