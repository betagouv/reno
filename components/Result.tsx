import css from '@/components/css/convertToJs'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import { styled } from 'styled-components'

export default function Result({ engine, isFinal, rules, dottedName }) {
  const rule = rules[dottedName]
  const evaluation = engine.evaluate(dottedName)

  const value = formatValue(evaluation)
  const notApplicable = value === 'Non applicable'

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
        box-shadow:
          rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
          rgba(61, 59, 53, 0.16) 0px 0px 0px 1px,
          rgba(61, 59, 53, 0.08) 0px 2px 5px 0px;

		border: 1px ${isFinal ? 'solid' : 'dashed'} black;
        ${notApplicable ? 'opacity: .7;' : ''}
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
      <strong
        style={css(`
		padding: 0 .2rem;
	  ${notApplicable ? 'background: salmon; color: white' : ''}

			  `)}
      >
        {value}
      </strong>
      <div>Estimation {!isFinal ? '' : ' finale'}&nbsp;</div>
    </div>
  )
}

export const Results = styled.ul`
  margin-top: 1rem;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`
