'use client'
import { ConditionEligibiliteUI } from '@/components/UI'
import rules from '@/app/règles/rules'
import FatConseiller from '@/components/FatConseiller'
import EligibilityDenormandie from '@/components/module/EligibilityDenormandie'
import ShareModule from '@/app/module/ShareModule'
import Link from 'next/link'

export default function Denormandie() {
  const dottedName = 'denormandie'

  return (
    <>
      <Link
        className="fr-btn fr-btn--secondary fr-icon-arrow-left-line fr-btn--icon-left fr-mb-5v"
        href="/aides/exoneration-fiscale"
      >
        Retour à la liste des exonérations fiscales
      </Link>
      <h1>Le dispositif Denormandie</h1>
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
      <EligibilityDenormandie dottedName="denormandie" />
      <ShareModule titre="denormandie" />
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
