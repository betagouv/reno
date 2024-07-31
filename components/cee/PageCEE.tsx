'use client'
import {
    getAnsweredQuestions,
    getSituation
  } from '@/components/publicodes/situationUtils'
  import { CTA, CTAWrapper, Main, Section } from '@/components/UI'
  import rules from '@/app/règles/rules'
  import Publicodes, { formatValue } from 'publicodes'
  import getNextQuestions from '@/components/publicodes/getNextQuestions'
  import { useSearchParams } from 'next/navigation'
  import { BlocAideCEE } from '@/components/BlocAideCee'
  import useSetSearchParams from '@/components/useSetSearchParams'
  import Link from 'next/link'
  import OtherSimulateur from '../OtherSimulateur'

  export default function PageCEE({ params }: { params: { code: string } }) {

    const engine = new Publicodes(rules)
    const rawSearchParams = useSearchParams(),
      situationSearchParams = Object.fromEntries(rawSearchParams.entries())

    const allRuleConcerned = Object.keys(rules).filter((rule) => rules[rule] && rules[rule].code == params.code)
    const rule = allRuleConcerned[0]
    const answeredQuestions = [
      ...getAnsweredQuestions(situationSearchParams, rules),
    ]
    const situation = {
      ...getSituation(situationSearchParams, rules),
    }

    // Y a-t-il des MPR associés?
    const mprAssocie = allRuleConcerned.map((rule) => rule.replace(". CEE", ". MPR"))
                                .filter((rule) => Object.keys(rules).includes(rule)) // On vérifie qu'il y a une règle MPR qui existe pour ce geste
                                .map((rule) => rule.replace(" . MPR", ""))
                                .map((rule) => rules[rule] && rules[rule].titre)

    const montant = engine.evaluate(rule + ' . montant')

    const nextQuestions = getNextQuestions(
      montant,
      [],
      [],
      rules,
    )

    const infoCEE = {
      montant: formatValue(engine.setSituation(situation).evaluate(rule + ' . montant'), { precision: 0 }),
      code: rules[rule].code,
      titre: rules[rule].titre,
      lien: rules[rule].lien,
      questions: nextQuestions.filter((q) => rules[q].question),
    }
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
                <Link href="/cee">⬅ Retour à la liste des aides CEE</Link>
                </CTA>
            </CTAWrapper>
            <h2>{infoCEE.code}: {infoCEE.titre}</h2>
            <BlocAideCEE
                {...{
                infoCEE,
                rules,
                engine,
                situation,
                answeredQuestions,
                setSearchParams
                }}
            />
            <OtherSimulateur {...{mprAssocie}} />
        </Section>
      </Main>
    )
  }