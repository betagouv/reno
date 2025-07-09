import { Card } from '../UI'
import Value from '../Value'
import AideAmpleur from './AideAmpleur'

export default function AideMAR({
  isEligible,
  engine,
  situation,
  dottedName,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName,
        setSearchParams,
        situation,
        answeredQuestions,
        expanded,
      }}
    >
      {' '}
      {expanded && (
        <p>
          Votre Accompagnateur Rénov' évalue avec vous vos besoins, vous aide à
          mobiliser les aides, dont MaPrimeRénov', pour financer vos travaux et
          s'assure de leur qualité et de leur concordance par rapport à l'audit
          énergétique.
        </p>
      )}
      {expanded && (
        <Card $background="#EEEEFF">
          <p>
            Par exemple : pour une prestation Mon Accompagnateur Rénov' de{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: dottedName + ' . prix moyen',
              }}
            />
            , en tant que ménage{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: 'ménage . revenu . classe',
                state: 'prime-black',
              }}
            />{' '}
            vous bénéficiez d'une aide de{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: dottedName + ' . pourcent',
                state: 'prime-black',
              }}
            />{' '}
            appliquée à une assiette de subvention plafonnée à{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: dottedName + ' . plafond',
              }}
            />
            soit{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: dottedName + ' . montant',
                state: 'prime',
              }}
            />{' '}
            d'aide.
          </p>
        </Card>
      )}
    </AideAmpleur>
  )
}
