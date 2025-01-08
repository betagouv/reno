'use client'

import { Card } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import FatConseiller from '@/components/FatConseiller'
import { parse } from 'marked'
import EligibilityTaxeFonciere from '@/components/module/EligibilityTaxeFonciere'
import ShareModule from '@/app/module/ShareModule'
export default function TaxeFonciere() {
  const dottedName = 'taxe foncière'

  return (
    <>
      <h2>L'exonération de taxe foncière</h2>
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
      </div>
      <Card>
        <EligibilityTaxeFonciere dottedName="taxe foncière" />
      </Card>
      <ShareModule titre="taxe-fonciere" />
      <h3>Comment cela fonctionne?</h3>
      <div
        dangerouslySetInnerHTML={{
          __html: parse(rules[dottedName + ' . taux'].description),
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
