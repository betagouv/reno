import css from '@/components/css/convertToJs'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import { styled } from 'styled-components'
import Image from 'next/image'
import { CTA, CTAWrapper } from './UI'
import Link from 'next/link'
import Check from './Check'

export const colors = {
  success: {
    background: '#297254',
    lightBackground: '#c4fad5', //TODO use this for the contour, more beautiful
    label: 'Estimation finale',
  },
  running: {
    background: 'var(--color)',
    color: 'white',
    label: 'Sous conditions',
  },
  fail: {
    background: 'salmon',
    lightBackground: '#f6b7af',
    color: 'white',
    label: 'Non éligible',
  },
  //  waiting: { background: '#9f9f9f', color: 'white', label: 'À suivre' },
}

export default function Result({
  engine,
  isFinal,
  rules,
  dottedName,
  hideNumeric = false,
  index,
  url,
}) {
  const rule = rules[dottedName]
  const evaluation = engine.evaluate(dottedName)
  console.log('result', evaluation)
  console.log(
    'condi',
    engine.evaluate('MPR . non accompagnée . conditions excluantes'),
  )

  const value = formatValue(evaluation, { precision: 0 })
  const isNotApplicable =
    value === 'Non applicable' || evaluation.nodeValue === 0

  const state = isNotApplicable ? 'fail' : isFinal ? 'success' : 'running'
  const { color, background, label } = colors[state]

  return (
    <li
      style={css(`
        padding: 1.4rem 1.5rem;
        margin: .6rem auto;
		height: 30rem;
		width: 22rem;
        max-width: min(22rem, 90%);
		border: 1px solid #dddddd;

	position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
	justify-content: space-between;
      `)}
    >
      <span
        css={`
          line-height: 1.5rem;
          left: -2px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%) translateX(-50%);
          border-radius: 3rem;
          width: 3.6rem;
          height: 3.6rem;
          background: white;
          text-align: center;
          img {
            width: 100%;
            height: auto;
          }
          z-index: 1;
        `}
      >
        <Image
          src={'/' + rule.illustration}
          alt={'Illustration de ' + rule.titre}
          width="20"
          height="20"
        />
      </span>
      <h3
        style={css`
          font-weight: 400;
          margin: 0.15rem 0 1rem;
          color: var(--color);
        `}
        dangerouslySetInnerHTML={{ __html: rule.titreHtml }}
      />
      <p>{rule.interface.motivation}</p>
      <ol
        css={`
          margin: 1rem 0;
          list-style-type: none;

          li {
            margin-bottom: 0.6rem;
            display: flex;
            align-items: center;
            svg {
              margin-right: 0.6rem;
              width: 1.4rem;
              height: auto;
            }
          }
          height: 10rem;
        `}
      >
        {rule.interface.avantages.map((avantage) => (
          <li key={avantage}>
            <span>
              <Check color="#347c5d" />
            </span>
            <span>{avantage}</span>
          </li>
        ))}
      </ol>
      <div
        style={css(`
          visibility: ${
            // TODO pour l'instant, on cache la valeur numérique de ce parcours, car on sait pas trop comment l'estimer, il faudrait définir un montant pour chaque geste, des m², un nombre de fenêtres etc.
            isNotApplicable ? 'hidden' : ''
          };
			${hideNumeric && !isFinal ? 'visibility: hidden;' : ''}
          margin: 0.15rem 0;
        `)}
      >
        {isFinal ? `` : `Jusqu'à `} {value}
      </div>
      <small
        css={`
          padding: 0 0.2rem;
          text-decoration: underline dotted var(--color);
          text-decoration-thickness: 2px;
          margin-top: 0.1rem;
        `}
      >
        {label}
      </small>
      {!isNotApplicable && url && (
        <CTAWrapper>
          <CTA $fontSize="normal">
            <Link href={url}>{rule.interface.action}</Link>
          </CTA>
        </CTAWrapper>
      )}
    </li>
  )
}

const Explanation = styled.div`
  margin: 0.8rem 0;
  margin-left: 1rem;
  height: 14rem;
`

export const Badge = styled.strong`
  padding: 0 0.2rem;
  background: ${(p) => p.$background};
  color: ${(p) => p.$color || 'white'};
  border: ${(p) => p.$border || 'none'};
  margin-top: 0.1rem;
`

export const Results = styled.ul`
  padding-left: 0;
  margin-top: 1rem;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  @media (max-width: 800px) {
    flex-direction: column;
    > span {
      margin: 0.6rem;
    }
  }
`

const InvisibleDetails = styled.details`
  margin-top: 0.8rem;
  summary {
    list-style-type: none;
    justify-content: center;
    cursor: help;
  }
  &[open] summary {
    display: flex;
    justify-content: end;
    span {
      display: none;
    }
  }
  summary img {
    width: 1rem;
    height: auto;
    filter: invert(1);
    opacity: 0.4;
  }
  &:not([open]) summary img {
    display: none;
  }
`
