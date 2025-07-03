import crossIcon from '@/public/remix-close-empty.svg'
import Image from 'next/image'
import styled from 'styled-components'
import DPELabel from '../dpe/DPELabel'
import Value from '@/components/Value'
import { MiseEnAvant } from '../UI'

export const InapplicableBlock = styled.div`
  margin: 1rem 0;
  display: flex;
  align-items: center;
  img {
    margin-right: 0.6rem;
    height: 1.6rem;
    width: auto;
  }
  p {
    text-decoration: underline;
    text-decoration-color: salmon;
    text-align: left;
    margin: 0;
  }
`
export function ExplicationMPRA({ situation, engine }) {
  const dpeActuel = situation['DPE . actuel']

  if (dpeActuel < 3)
    return (
      <InapplicableBlock>
        <Image src={crossIcon} alt="Icône d'une croix" />
        <p>
          Votre DPE {' '}
          <DPELabel index={dpeActuel - 1} />
          {' '}
          est déjà trop performant.
        </p>
      </InapplicableBlock>
    )
  const sauts = engine.evaluate('sauts')
  if (sauts.nodeValue < 2)
    return (
      <InapplicableBlock>
        <Image src={crossIcon} alt="Icône d'une croix" />
        <p>
          Votre projet de {sauts.nodeValue} sauts de DPE{' '}
          <span
            css={`
              white-space: nowrap;
            `}
          >
            (de <DPELabel index={situation['DPE . actuel'] - 1} />
            &nbsp;à&nbsp;
            <DPELabel index={situation['projet . DPE visé'] - 1} />)
          </span>{' '}
          est insuffisant.
        </p>
      </InapplicableBlock>
    )
}

export function ExplicationMPRG({ situation, engine }) {
  const revenu = situation['ménage . revenu']
  if (revenu)
    return (
      <InapplicableBlock>
        <Image src={crossIcon} alt="Icône d'une croix" />
        <div>
          <p>Vous n'êtes pas éligible à MaPrimeRénov' rénovation par geste.</p>
          <small>
            Votre revenu de{' '}
            <span
              css={`
                white-space: nowrap;
              `}
            >
              classe{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'ménage . revenu . classe',
                  state: 'final',
                }}
              />{' '}
            </span>{' '}
            dépasse le seuil d'éligibilité.
          </small>
        </div>
      </InapplicableBlock>
    )
}

export function Avis({ engine, situation }) {
  const passoire = engine.evaluate('DPE . actuel . passoire')
  if (passoire.nodeValue)
    return (
      <MiseEnAvant
        css={`
          margin-top: 1rem;
        `}
      >
        <p>
          Votre logement DPE <DPELabel index={situation['DPE . actuel'] - 1} />{' '}
          est une passoire énergétique. Il vous est conseillé d'opter pour le{' '}
          <strong>parcours accompagné</strong>.
        </p>
      </MiseEnAvant>
    )
}
