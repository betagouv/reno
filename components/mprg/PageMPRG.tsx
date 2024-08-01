'use client'
  import { getSituation } from '@/components/publicodes/situationUtils'
  import { CTA, CTAWrapper, Main, Section } from '@/components/UI'
  import rules from '@/app/règles/rules'
  import simulationConfig from '../../app/simulation/simulationConfigMPR.yaml'
  import Publicodes, { formatValue } from 'publicodes'
  import getNextQuestions from '@/components/publicodes/getNextQuestions'
  import { useSearchParams } from 'next/navigation'
  import Link from 'next/link'
  import { BlocAideMPR } from './BlocAideMPR'
  import OtherSimulateur from '../OtherSimulateur'
import useSetSearchParams from '../useSetSearchParams'

  export default function PageMPRG({ params }: { params: { titre: string } }) {

    const engine = new Publicodes(rules)
    const rawSearchParams = useSearchParams(),
      situationSearchParams = Object.fromEntries(rawSearchParams.entries())

    const rule = Object.keys(rules).find((rule) => rules[rule] && rules[rule].titre == decodeURIComponent(params.titre))
    const situation = {
      ...getSituation(situationSearchParams, rules),
    }

    const questions = getNextQuestions(
      engine.evaluate(rule + ' . MPR . montant'),
      [],
      simulationConfig,
      rules,
    )
    const infoMPR = {
      montant: formatValue(engine.setSituation(situation).evaluate(rule + ' . MPR . montant'), { precision: 0 }),
      titre: rules[rule].titre,
      plafond:  formatValue(engine.setSituation(situation).evaluate(rule + ' . MPR . plafond')),
      questions: questions.filter((q) => rules[q].question),
    }

    // Y a-t-il une aide CEE associée?
    const ceeAssocie = Object.keys(rules).includes(rule + " . CEE") ? rules[rule + " . CEE"] : null;

    const setSearchParams = useSetSearchParams()

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
                setSearchParams,
                displayPrime: "bottom"
                }}
            />
            <OtherSimulateur {...{ceeAssocie}} />
        </Section>
      </Main>
    )
  }
  