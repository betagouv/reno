'use client'

import { ConditionEligibiliteUI } from '@/components/UI'
import rules from '@/app/règles/rules'
import FatConseiller from '@/components/FatConseiller'
import { parse } from 'marked'
import EligibilityTaxeFonciere from '@/components/module/EligibilityTaxeFonciere'
import ShareModule from '@/app/module/ShareModule'
import Link from 'next/link'

export default function TaxeFonciere() {
  const dottedName = 'taxe foncière'

  return (
    <>
      <Link
        className="fr-btn fr-btn--secondary fr-icon-arrow-left-line fr-btn--icon-left fr-mb-5v"
        href="/aides/exoneration-fiscale"
      >
        Retour à la liste des exonérations fiscales
      </Link>
      <h1>L'exonération de taxe foncière</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: rules[dottedName].descriptionHtml,
        }}
      />
      <EligibilityTaxeFonciere dottedName="taxe foncière" />
      <ShareModule titre="taxe-fonciere" />
      <h2 className="fr-mt-5v">Comment cela fonctionne?</h2>
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
