import AideAmpleur from './AideAmpleur'
import rules from '@/app/règles/rules'
import Value from '../Value'
import { Highlight } from '@codegouvfr/react-dsfr/Highlight'
// Note : Nous ignorons pour l'instant le PAR "pas plus", qui ne garantit pas un taux zéro, et qui n'est donc pas à propremement parler une aide de l'État.

export default function PAR({
  isEligible,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'PAR'
  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName: dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      {expanded && (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].explicationHTML,
            }}
          />
          <Highlight>
            En tant que ménage{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: 'ménage . revenu . classe',
              }}
            />{' '}
            , vous êtes éligible à un prêt d'un montant maximum de{' '}
            <Value
              {...{
                state: 'success',
                engine,
                situation,
                dottedName: 'PAR . montant',
                state: 'prime',
              }}
            />{' '}
            sans intérêt pendant{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: 'PAR . durée',
              }}
            />
            .
          </Highlight>
        </>
      )}
    </AideAmpleur>
  )
}
