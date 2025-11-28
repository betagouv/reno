'use client'

import rules from '@/app/règles/rules'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import CopyButton from '../CopyButton'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Tag from '@codegouvfr/react-dsfr/Tag'
import ExplicationCoproprieteContent from './ExplicationCoproprieteContent'

export default function ExplicationCopropriete() {
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams()
  const searchParams = Object.fromEntries(rawSearchParams.entries())
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [...getAnsweredQuestions(searchParams, rules)]
  const situation = getSituation(searchParams, rules)

  const setSearchParams = useSetSearchParams()

  return (
    <>
      <Breadcrumb
        currentPageLabel="L'éligibilité de la copropriété"
        homeLinkProps={{
          href: '/',
        }}
        segments={[
          {
            label: 'Simulateur copropriété',
            linkProps: {
              href: '/copropriete',
            },
          },
        ]}
      />
      <div
        css={`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <BtnBackToParcoursChoice
          {...{
            setSearchParams,
            situation,
            answeredQuestions: answeredQuestions.slice(0, -1),
          }}
        />
        <CopyButton searchParams={searchParams} />
      </div>
      <header className="fr-mt-5v">
        <Tag>MaPrimeRénov’ Copropriété</Tag>
        <h1>Financer une rénovation d’ampleur de votre copropriété</h1>
      </header>

      <ExplicationCoproprieteContent
        engine={engine}
        situation={situation}
        setSearchParams={setSearchParams}
        answeredQuestions={answeredQuestions}
      />
    </>
  )
}
