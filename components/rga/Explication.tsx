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

export default function ExplicationCopropriete() {
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [...getAnsweredQuestions(searchParams, rules)]
  const situation = getSituation(searchParams, rules)

  const engineSituation = engine.setSituation(situation)
  const setSearchParams = useSetSearchParams()

  const isEligibile = engineSituation.evaluate('rga . conditions').nodeValue

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
      {isEligibile ? (
        <>
          <p>
            Votre logement est{' '}
            <Badge noIcon severity="success">
              éligible
            </Badge>{' '}
            au dispositif <strong>fond argile</strong>.
          </p>
        </>
      ) : (
        <>
          <p>
            Votre logement{' '}
            <Badge noIcon severity="error">
              n'est pas éligible
            </Badge>{' '}
            au dispositif <strong>fond argile</strong>.
          </p>
        </>
      )}
      <ExplicationsDétaillées {...{ situation, engine }} />
    </>
  )
}
