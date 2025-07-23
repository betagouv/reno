'use client'

import { PrimeWithLabel } from '@/components/ampleur/AideAmpleur'
import Badge from '@codegouvfr/react-dsfr/Badge'

export const computeStatusTitle = (status) =>
  status
    ? 'Nous avons déterminé que vous êtes éligible à cette aide.'
    : status === null
      ? 'Nous ne pouvons pas encore vous dire si vous êtes éligible à cette aide.'
      : 'Non éligible'

export const AmpleurAideSummary = ({
  text,
  text2,
  status,
  evaluation,
  engine,
  situation,
  dottedName,
}) => {
  return (
    <>
      <>
        {text && <>{text}</>}
        {text2 && <>&nbsp;-&nbsp;{text2}</>}
      </>
      {status ? (
        <PrimeWithLabel
          {...{
            severity: 'success',
            montant: evaluation,
            engine,
            situation,
            dottedName,
          }}
        ></PrimeWithLabel>
      ) : (
        <Badge noIcon>{computeStatusTitle(status)}</Badge>
      )}
    </>
  )
}
