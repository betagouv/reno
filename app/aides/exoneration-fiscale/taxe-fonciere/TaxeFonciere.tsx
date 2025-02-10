'use client'

import { Card, ConditionEligibiliteUI } from '@/components/UI'
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
      <h1>L'exonération de taxe foncière</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: rules[dottedName].descriptionHtml,
        }}
      />
      <Card>
        <EligibilityTaxeFonciere dottedName="taxe foncière" />
      </Card>
      <ShareModule titre="taxe-fonciere" />
      <h2>Comment cela fonctionne?</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: parse(rules[dottedName + ' . taux'].description),
        }}
      />
      <ConditionEligibiliteUI>
        {rules[dottedName].conditionsEligibilitesHTML}
      </ConditionEligibiliteUI>
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
