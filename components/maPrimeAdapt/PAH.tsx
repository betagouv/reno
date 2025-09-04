import rules from '@/app/règles/rules'
import AideAmpleur from '../ampleur/AideAmpleur'
import { ConditionEligibiliteUI } from '../UI'

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
