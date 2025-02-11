'use client'

import { PrimeStyle } from '@/components/UI'
import { PrimeWithLabel } from '@/components/ampleur/AideAmpleur'
import StatusIcon from '@/components/ampleur/StatusIcon'

export const computeStatusTitle = (status) =>
  status
    ? 'Nous avons déterminé que vous êtes éligible à cette aide.'
    : status === null
      ? 'Nous ne pouvons pas encore vous dire si vous êtes éligible à cette aide.'
      : "Vous n'êtes pas éligible à cette aide"

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
      <h3
        css={`
          display: flex;
          align-items: center;
          opacity: ${!status ? '.65' : '1'};
          font-weight: 400;
          margin: 0 0 0.4rem 0;
          font-size: 100%;
        `}
      >
        {text && (
          <>
            {!status && <StatusIcon status={status} />}
            {text}
          </>
        )}
        {text2 && <>&nbsp;-&nbsp;{text2}</>}
      </h3>
      <div
        css={`
          display: flex;
          justify-content: start;
        `}
      >
        {status ? (
          <PrimeWithLabel
            css={`
              font-size: 90%;
              margin-top: 0.5rem;
            `}
            {...{
              montant: evaluation,
              engine,
              situation,
              dottedName,
            }}
          ></PrimeWithLabel>
        ) : (
          <PrimeStyle $inactive={true}>{computeStatusTitle(status)}</PrimeStyle>
        )}
      </div>
    </>
  )
}
