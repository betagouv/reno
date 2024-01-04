import css from '@/components/css/convertToJs'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import { styled } from 'styled-components'

const colors = {
  success: { color: '#297254', background: '#c4fad5' },
  running: { background: '#2a82dd', color: 'white' },
  fail: { background: 'salmon', color: 'white' },
}

export default function Result({ engine, isFinal, rules, dottedName }) {
  const rule = rules[dottedName]
  const evaluation = engine.evaluate(dottedName)

  const value = formatValue(evaluation)
  const isNotApplicable = value === 'Non applicable'

  const { color, background } =
    colors[isNotApplicable ? 'fail' : isFinal ? 'success' : 'running']

  return (
    <div
      style={css(`
        padding: 1.2vh;
        margin: 0 auto;
        width: 14rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
		border: ${
      isFinal || isNotApplicable ? '2px solid' : '2px dashed'
    } ${background};
        ${isNotApplicable ? 'opacity: .7;' : ''}

		${
      isFinal || isNotApplicable
        ? `
        box-shadow:
          rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
          rgba(61, 59, 53, 0.16) 0px 0px 0px 1px,
          rgba(61, 59, 53, 0.08) 0px 2px 5px 0px;
		  `
        : ''
    } 
      `)}
    >
      <h3
        style={css`
          font-size: 100%;
          margin: 0;
          font-weight: 500;
        `}
      >
        {rule.titre}
      </h3>
      <div
        style={css(`
          visibility: ${isNotApplicable ? 'hidden' : ''};
          margin: 0.3rem 0;
        `)}
      >
        {isFinal ? `` : `Jusqu'à `} {value}
      </div>
      {isNotApplicable ? (
        <Badge $background={colors.fail.background}>Non éligible</Badge>
      ) : isFinal ? (
        <Badge
          $color={colors.success.color}
          $background={colors.success.background}
        >
          Estimation finale
        </Badge>
      ) : (
        <Badge $background={colors.running.background}>Sous conditions</Badge>
      )}
    </div>
  )
}

export const Badge = styled.strong`
  padding: 0 0.2rem;
  background: ${(p) => p.$background};
  color: ${(p) => p.$color || 'white'};
`

export const Results = styled.ul`
  margin-top: 1rem;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`
