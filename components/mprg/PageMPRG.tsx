'use client'
import {
    getAnsweredQuestions,
    getSituation
  } from '@/components/publicodes/situationUtils'
  import { CTA, CTAWrapper, Main, Section } from '@/components/UI'
  import rules from '@/app/règles/rules'
  import simulationConfig from '../../app/simulation/simulationConfigMPR.yaml'
  import Publicodes, { formatValue } from 'publicodes'
  import getNextQuestions from '@/components/publicodes/getNextQuestions'
  import { useSearchParams } from 'next/navigation'
  import useSetSearchParams from '@/components/useSetSearchParams'
  import Link from 'next/link'
  import { BlocAideMPR } from './BlocAideMPR'
import OtherSimulateur from '../OtherSimulateur'

  export default function PageMPRG({ params }: { params: { titre: string } }) {

    const engine = new Publicodes(rules)
    const rawSearchParams = useSearchParams(),
      situationSearchParams = Object.fromEntries(rawSearchParams.entries())

    const rule = Object.keys(rules).find((rule) => rules[rule] && rules[rule].titre == decodeURIComponent(params.titre))
    const answeredQuestions = [
      ...getAnsweredQuestions(situationSearchParams, rules),
    ]
    const situation = {
      ...getSituation(situationSearchParams, rules),
    }

    const montant = engine.evaluate(rule + ' . MPR . montant')

    const nextQuestions = getNextQuestions(
      montant,
      answeredQuestions,
      simulationConfig,
      rules,
    )

    const infoMPR = {
      montant: formatValue(engine.setSituation(situation).evaluate(rule + ' . MPR . montant'), { precision: 0 }),
      titre: rules[rule].titre,
      questions: nextQuestions.filter((q) => rules[q].question),
    }

    const setSearchParams = useSetSearchParams()

    // Y a-t-il une aide CEE associée?
    const ceeAssocie = Object.keys(rules).includes(rule + " . CEE") ? rules[rule + " . CEE"] : null;
    return (
      <Main>
        <Section>
            <CTAWrapper $justify="end">
                <CTA
                $fontSize="normal"
                $importance="secondary"
                css={`
                    a {
                    padding: 0.5rem 0.8rem;
                    }
                `}
                >
                <Link href="/maprimerenov">⬅ Retour à la liste des aides MaPrimeRénov'</Link>
                </CTA>
            </CTAWrapper>
            <h2>{infoMPR.titre}</h2>
            <BlocAideMPR
                {...{
                infoMPR,
                rules,
                engine,
                situation,
                answeredQuestions,
                setSearchParams
                }}
            />
            <OtherSimulateur {...{ceeAssocie}} />
        </Section>
      </Main>
    )
  }
  