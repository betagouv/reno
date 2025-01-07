'use client'

import { Card } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import parImage from '@/public/par.png'
import Image from 'next/image'
import FatConseiller from '@/components/FatConseiller'
import EligibilityPAR from '@/components/module/EligibilityPAR'

export default function PAR() {
  const dottedName = 'PAR'

  return (
    <>
      <h2>Le Prêt avance mutation ou rénovation sans intérêt</h2>
      <div
        css={`
          display: flex;
          gap: 1rem;
        `}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: rules[dottedName].descriptionHtml,
          }}
        />
        <div>
          <Image src={parImage} alt="logo PAR+" width="120" />
        </div>
      </div>
      <Card>
        <EligibilityPAR dottedName="PAR" />
      </Card>
      <h3>Comment cela fonctionne?</h3>
      <div
        dangerouslySetInnerHTML={{
          __html: rules[dottedName].explicationHTML,
        }}
      />
      <h3>Les principales conditions d'éligibilité ?</h3>
      <div
        css={`
          list-style-image: url(${checkIcon.src});
          li {
            margin: 1rem 0;
            ul {
              list-style-image: none;
            }
          }
        `}
        dangerouslySetInnerHTML={{
          __html: rules[dottedName].conditionsEligibilitesHTML,
        }}
      />
      <FatConseiller
        {...{
          situation: {},
          margin: 'small',
          titre: 'Comment toucher cette aide ?',
          texte: rules[dottedName].commentFaireHtml,
        }}
      />
    </>
  )
}
