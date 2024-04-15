import DPELabel from '../DPELabel'
import { Value } from '../ScenariosSelector'
import Image from 'next/image'
import checkIcon from '@/public/check.svg'
import crossIcon from '@/public/remix-close-empty.svg'
import styled from 'styled-components'

export const InapplicableBlock = styled.div`
  text-decoration: underline;
  text-decoration-color: salmon;
  display: flex;
  align-items: center;
  img {
    margin-right: 0.6rem;
    height: 1.6rem;
    width: auto;
  }
  p {
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

export function ExplicationCommune({ situation, engine }) {
  const commune = engine.evaluate('conditions communes')
  if (!commune.nodeValue)
    return (
      <InapplicableBlock>
        <Image src={crossIcon} alt="Icône d'une croix" />
        <p>
          Vous devez être propriétaire du logement, qui doit être une résidence
          principale, construite il y a au moins 15 ans.
        </p>
      </InapplicableBlock>
    )
  return null
}
export function ExplicationMPRG({ situation, engine }) {
  const revenu = situation['ménage . revenu']
  if (revenu)
    return (
      <InapplicableBlock>
        <Image src={crossIcon} alt="Icône d'une croix" />
        <p>
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
        </p>
      </InapplicableBlock>
    )
}

export function Avis({ engine, situation }) {
  const passoire = engine.evaluate('DPE . actuel . passoire')
  if (passoire.nodeValue)
    return (
      <p>
        💡 Votre logement est une passoire énergétique (DPE{' '}
        <DPELabel index={situation['DPE . actuel'] - 1} />
        ). Il vous est conseillé d'opter pour le{' '}
        <strong>parcours accompagné</strong>.
      </p>
    )
}
