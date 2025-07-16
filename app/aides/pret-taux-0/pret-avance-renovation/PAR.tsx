'use client'

import { ConditionEligibiliteUI } from '@/components/UI'
import rules from '@/app/règles/rules'
import parImage from '@/public/par.png'
import Image from 'next/image'
import FatConseiller from '@/components/FatConseiller'
import EligibilityPAR from '@/components/module/EligibilityPAR'
import ShareModule from '@/app/module/ShareModule'
import Link from 'next/link'

export default function PAR() {
  const dottedName = 'PAR'

  return (
    <>
      <Link
        className="fr-btn fr-btn--secondary fr-icon-arrow-left-line fr-btn--icon-left fr-mb-5v"
        href="/aides/pret-taux-0"
      >
        Retour à la liste des prêts à taux zéro
      </Link>
      <h1>Le prêt avance rénovation sans intérêt - PAR+</h1>
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
      <EligibilityPAR dottedName="PAR" />
      <ShareModule titre="par" />
      <h2 className="fr-mt-5v">Comment cela fonctionne?</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: rules[dottedName].explicationHTML,
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
