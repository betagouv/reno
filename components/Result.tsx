import css from '@/components/css/convertToJs'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import { styled } from 'styled-components'
import Image from 'next/image'
import { CTA, CTAWrapper } from './UI'
import Link from 'next/link'

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
  openByDefault,
  url,
}) {
  const rule = rules[dottedName]
  const evaluation = engine.evaluate(dottedName)
  console.log('result', evaluation)
  console.log('condi', engine.evaluate('MPR . non accompagnée . conditions'))

  const value = formatValue(evaluation, { precision: 0 })
  const isNotApplicable =
    value === 'Non applicable' || evaluation.nodeValue === 0

  const state = isNotApplicable ? 'fail' : isFinal ? 'success' : 'running'
  const { color, background, label } = colors[state]

  return (
    <li
      style={css(`
        padding: 1.2vh;
        margin: .6rem auto;
		width: 18rem;
        max-width: min(18rem, 90%);
		border: ${
      isFinal || isNotApplicable ? '2px solid' : '2px dashed'
    } ${background};
        ${isNotApplicable ? 'opacity: .7;' : ''}

	position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
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
          font-size: 100%;
          font-weight: 400;
          margin: 0.15rem 0;
        `}
        dangerouslySetInnerHTML={{ __html: rule.titreHtml }}
      />
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
      <Badge $background={background}>{label}</Badge>
      {openByDefault ? (
        <Explanation
          dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}
        />
      ) : (
        <InvisibleDetails open={openByDefault}>
          <summary>
            <span>En savoir plus</span>
            <img
              src="/close.svg"
              alt="Fermer les détails"
              width="10"
              height="10"
            />
          </summary>
          <Explanation
            dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}
          />
        </InvisibleDetails>
      )}
      {!isNotApplicable && url && (
        <CTAWrapper>
          <CTA>
            <Link href={url}>Suivant</Link>
          </CTA>
        </CTAWrapper>
      )}
    </li>
  )
}

const Explanation = styled.div`
  margin: 0.8rem 0;
  font-size: 90%;
  margin-left: 1rem;
  height: 14rem;
`

export const Badge = styled.strong`
  padding: 0 0.2rem;
  background: ${(p) => p.$background};
  color: ${(p) => p.$color || 'white'};
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
