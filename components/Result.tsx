import css from '@/components/css/convertToJs'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Image from 'next/image'
import Link from 'next/link'
import { styled } from 'styled-components'
import Check from './Check'
import { Value } from './ScenariosSelector'
import { CTA, CTAWrapper } from './UI'
import {
  ExplicationMPRA,
  ExplicationCommune,
  ExplicationMPRG,
} from './explications/Éligibilité'

/* This component was first written for simulation mode where the state could be success, running or fail. Since then we've switched to a more classic result where it
 * can only be success or fail. I've kept this object for future references, for its colors */
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
  situation,
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

  const state = isNotApplicable ? 'fail' : isFinal ? 'success' : 'running',
    fail = state === 'fail'
  const { color, background, label } = colors[state]

  return (
    <li
      style={css(`
	  color: ${fail ? '#888' : 'inherit'};
        padding: 1.4rem 1.5rem;
        margin: .6rem auto;
		height: 30rem;
		width: 22rem;
        max-width: min(22rem, 90%);
		border: 1px solid ${fail ? '#ddd' : 'var(--color)'};

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
      <p
        css={`
          img {
            width: 1.6rem;
            height: auto;
            margin-right: 0.6rem;
            opacity: 0.4;
            margin-top: -0.3rem;
          }
          display: flex;
          align-items: start;
        `}
      >
        <Image
          src="/quote-remix.svg"
          alt="Icône citation"
          width="10"
          height="10"
        />
        {rule.interface.motivation}
      </p>
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
          min-height: 8rem;
        `}
      >
        {rule.interface.avantages.map((avantage) => (
          <li key={avantage}>
            <span>
              <Check color={fail ? '#888' : '#347c5d'} />
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
          margin-top: 0.1rem;
          ${fail
            ? `
			font-size: 100%;
			padding: .2rem .6rem;
		  background: ${background}; 
		  color: ${color};

		  `
            : `
          text-decoration: underline dotted var(--color);
          text-decoration-thickness: 2px;
		  `}
        `}
      >
        {label}
      </small>
      {fail && (
        <div
          css={`
            margin: 1rem 0;
            color: black;
            text-align: center;
          `}
        >
          {dottedName === 'MPR . non accompagnée' ? (
            <ExplicationMPRG {...{ engine, situation }} />
          ) : (
            <ExplicationMPRA {...{ engine, situation }} />
          )}
        </div>
      )}
      <div
        css={`
          visibility: ${!isNotApplicable && url ? 'visible' : 'hidden'};
        `}
      >
        <CTAWrapper>
          <CTA $fontSize="normal">
            <Link href={url}>{rule.interface.action}</Link>
          </CTA>
        </CTAWrapper>
      </div>
    </li>
  )
}

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
