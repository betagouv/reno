import { Card } from '../UI'
import Value from '../Value'
import AideAmpleur from './AideAmpleur'

export default function AideMAR({
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
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <AideMontant
              {...{
                engine,
                situation,
                dottedName,
              }}
            />
          </div>
        </Card>
      )}
    </AideAmpleur>
  )
}
