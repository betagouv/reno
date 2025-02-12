import { Card } from '../UI'
import AideAmpleur from './AideAmpleur'
import rules from '@/app/règles/rules'
import Value from '../Value'
// Note : Nous ignorons pour l'instant le PAR "pas plus", qui ne garantit pas un taux zéro, et qui n'est donc pas à propremement parler une aide de l'État.

export default function PAR({
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
        engine,
        dottedName: 'PAR',
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
          <Card $background="#EEEEFF">
            <p>
              En tant que ménage{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'ménage . revenu . classe',
                  state: 'prime-black',
                }}
              />{' '}
              , vous êtes éligible à un prêt d'un montant maximum de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'PAR . montant',
                  state: 'prime',
                }}
              />{' '}
              sans intérêt pendant
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'PAR . durée',
                }}
              />
              .
            </p>
          </Card>
        </>
      )}
    </AideAmpleur>
  )
}
