'use client'

import InputSwitch from '@/components/InputSwitch'
import { Section } from '@/components/UI'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import {
  decodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import Publicodes from 'publicodes'
import { Suspense, useMemo } from 'react'
import Stepper from './Stepper'
import Share from './Share'
import simulationConfig from './simulationConfig.yaml'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import UserProblemBanner from '@/components/UserProblemBanner'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import useIsInIframe, { useIsCompact } from '@/components/useIsInIframe'
import LogoCompact from '@/components/LogoCompact'
import Answers, { firstLevelCategory } from './Answers'
import Image from 'next/image'

function Form({ rules }) {
  const isInIframe = useIsInIframe()
  const isCompact = useIsCompact()
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  // this param `objectif` lets us optionally build the form to target one specific publicode rule
  const { objectif, ...situationSearchParams } = searchParams

  const target = objectif ? decodeDottedName(objectif) : 'aides'

  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(simulationConfig.situation || {}),
    ...getAnsweredQuestions(situationSearchParams, rules),
  ]
  const started =
    answeredQuestions.filter((el) => el === 'simulation . mode').length > 1 // because of simulation mode

  const situation = {
    ...(simulationConfig.situation || {}),
    ...getSituation(situationSearchParams, rules),
  }

  const validatedSituation = Object.fromEntries(
    Object.entries(situation).filter(([k, v]) => answeredQuestions.includes(k)),
  )

  const evaluation = engine.setSituation(validatedSituation).evaluate(target),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      simulationConfig,
      rules,
    )

  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]

  const setSearchParams = useSetSearchParams()

  return (
    <div>
      <Section>
        {isInIframe && isCompact && (
          <>
            <LogoCompact
              css={`
                float: right;
              `}
            />
            <Stepper
              {...{
                answeredQuestions,
                nextQuestions,
                currentQuestion,
                rules,
                situation,
              }}
            />
          </>
        )}
        {!isCompact && !(firstLevelCategory(currentQuestion) === 'projet') && (
          <div>
            <Answers
              {...{
                answeredQuestions,
                nextQuestions,
                currentQuestion,
                rules,
                situation,
              }}
            />
          </div>
        )}
        {rule && (
          <InputSwitch
            {...{
              rules,
              currentQuestion,
              situation,
              answeredQuestions,
              setSearchParams,
              engine,
              nextQuestions,
              searchParams,
            }}
          />
        )}
      </Section>
      {false && (!isInIframe || !isCompact) && (
        <>
          <br />
          <UserProblemBanner />
          <Share searchParams={searchParams} />
        </>
      )}
      {false && !isInIframe && (
        <Section>
          <h2>Documentation</h2>
          <p>
            Si vous êtes experts, vous pouvez parcourir notre{' '}
            <Link
              href={
                '/documentation/MPR/?' +
                new URLSearchParams(situationSearchParams).toString()
              }
            >
              documentation complète du calcul
            </Link>
            .
          </p>
        </Section>
      )}
      {isCompact && (
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <a href="https://france-renov.gouv.fr" target="_blank">
            <Image
              src={logoFranceRenov}
              alt="Logo de France Rénov"
              width="80"
            />
          </a>
          <p
            css={`
              font-size: 0.7rem;
              margin: 0;
              margin-left: 10px;
              line-height: 1rem;
            `}
          >
            Une initiative construite avec France&nbsp;Rénov' pour simplifier
            l'information sur les aides à la rénovation énergétique.
          </p>
        </div>
      )}
    </div>
  )
}

export default function ({ rules }) {
  return (
    <Suspense>
      <Form rules={rules} />
    </Suspense>
  )
}
