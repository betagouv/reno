import css from './css/convertToJs'

export default function DifferentialResult({
  value,
  newValue,
  currentQuestion,
}) {
  const diff = value - newValue
  const sign = diff > 0 ? '-' : diff === 0 ? '' : '+',
    abs = Math.abs(diff)

  const color = diff === 0 ? 'inherit' : diff > 0 ? 'orange' : 'lightgreen'
  return (
    <div
      style={css(
        `visibility: ${!currentQuestion || diff === 0 ? 'hidden' : 'visible'}`,
      )}
    >
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
