import AideAmpleur from '../ampleur/AideAmpleur'

export default function PAH({
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
    />
  )
}
