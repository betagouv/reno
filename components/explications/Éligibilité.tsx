import DPELabel from '../DPELabel'
import { Value } from '../ScenariosSelector'

export function ExplicationMPRA({ situation, engine }) {
  const dpeActuel = situation['DPE . actuel']

  if (dpeActuel < 3)
    return (
      <p>
        💡 Votre DPE {' '}
        <DPELabel index={dpeActuel - 1} />
        {' '}
        est déjà trop performant.
      </p>
    )
  const sauts = engine.evaluate('sauts')
  if (sauts.nodeValue < 2)
    return (
      <p>
        💡 Votre projet de {sauts.nodeValue} sauts de DPE{' '}
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
    )
}

export function ExplicationCommune({ situation, engine }) {
  const commune = engine.evaluate('conditions communes')
  if (!commune.nodeValue)
    return (
      <p>
        💡 Vous devez être propriétaire du logement, qui doit être une résidence
        principale, construite il y a au moins 15 ans.
      </p>
    )
  return null
}
export function ExplicationMPRG({ situation, engine }) {
  const condition = situation['ménage . revenu']
  if (condition)
    return (
      <p>
        💡 Votre classe de revenu{' '}
        <Value
          {...{
            engine,
            situation,
            dottedName: 'ménage . revenu . classe',
            state: 'final',
          }}
        />{' '}
        est trop élevée.
      </p>
    )
}
