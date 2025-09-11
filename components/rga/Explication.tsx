'use client'

import rules from '@/app/règles/rules'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Tag from '@codegouvfr/react-dsfr/Tag'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import CopyButton from '../CopyButton'
import ExplicationsDétaillées from './ExplicationsDétaillées'

export default function Explication() {
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [...getAnsweredQuestions(searchParams, rules)]
  const situation = getSituation(searchParams, rules)

  const engineSituation = engine.setSituation(situation)
  const setSearchParams = useSetSearchParams()

  const evaluation = engineSituation.evaluate('rga . conditions')
  const isEligibile = evaluation.nodeValue

  return (
    <>
      <Breadcrumb
        currentPageLabel="Éligibilité fond argile"
        homeLinkProps={{
          href: '/',
        }}
        segments={[
          {
            label: 'Simulateur fond argile',
            linkProps: {
              href: '/rga',
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
        <Tag>Fond argile</Tag>
        <h1>Votre éligibilité au fond argile</h1>
      </header>
      <div>
        {isEligibile ? (
          <Badge noIcon severity="success">
            Éligible
          </Badge>
        ) : (
          <Badge noIcon severity="error">
            Non éligible
          </Badge>
        )}
        <p>
          Votre logement {isEligibile ? 'est éligible' : "n'est pas éligible"}{' '}
          au dispositif.
        </p>
      </div>
      <ExplicationsDétaillées {...{ situation, engine, answeredQuestions }} />
    </>
  )
}
