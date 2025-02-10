'use client'
import { Card, ConditionEligibiliteUI } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import FatConseiller from '@/components/FatConseiller'
import EligibilityDenormandie from '@/components/module/EligibilityDenormandie'
import ShareModule from '@/app/module/ShareModule'

export default function Denormandie() {
  const dottedName = 'denormandie'

  return (
    <>
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
      <Card>
        <EligibilityDenormandie dottedName="denormandie" />
      </Card>
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
