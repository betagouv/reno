import rules from '@/app/règles/rules'
import AideAmpleur from '../ampleur/AideAmpleur'

export default function CreditImpot({
  isEligible,
  engine,
  situation,
  setSearchParams,
  dottedName,
  answeredQuestions,
  expanded,
}) {
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
        </>
      )}
    </AideAmpleur>
  )
}
