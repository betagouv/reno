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
      {expanded && (
        <>
          <p>
            Votre Accompagnateur Rénov' évalue avec vous vos besoins, vous aide
            à mobiliser les aides, dont MaPrimeRénov', pour financer vos travaux
            et s'assure de leur qualité et de leur concordance par rapport à
            l'audit énergétique.
          </p>
          <div className="fr-callout">
            <p className="fr-callout__text">
              Dans votre cas : en tant que ménage{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'ménage . revenu . classe',
                }}
              />{' '}
              vous bénéficiez d'une aide de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . pourcent',
                }}
              />{' '}
              pour une prestation Mon Accompagnateur Rénov' de maximum{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . plafond',
                }}
              />{' '}
              , soit{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . montant',
                }}
              />{' '}
              d'aide.
            </p>
          </div>
        </>
      )}
    </AideAmpleur>
  )
}
