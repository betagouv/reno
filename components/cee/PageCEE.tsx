'use client'
import {
    getAnsweredQuestions,
    getSituation
  } from '@/components/publicodes/situationUtils'
  import { Badge, CTA, CTAWrapper, Main, MiseEnAvant, Section } from '@/components/UI'
  import rules from '@/app/règles/rules'
  import Publicodes, { formatValue } from 'publicodes'
  import getNextQuestions from '@/components/publicodes/getNextQuestions'
  import { useSearchParams } from 'next/navigation'
  import { BlocAideCEE } from '@/components/BlocAideCee'
  import useSetSearchParams from '@/components/useSetSearchParams'
  import Link from 'next/link'
  import OtherSimulateur from '../OtherSimulateur'
  import { parse } from 'marked'
  import css from '@/components/css/convertToJs'
  import { Card } from '@/components/UI'
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
      technique: rules[rule].technique,
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
            <h2>{infoCEE.titre}<Badge>{infoCEE.code}</Badge></h2>
            <MiseEnAvant>
              <h3>Vous êtes éligible à cette aide si:</h3>
              <ul>
                <li>vous êtes <strong>propriétaire ou locataire</strong></li>
                <li>le logement a été <strong>construit depuis plus de 2 ans.</strong></li>
                <li>il s'agit de votre <strong>résidence principale ou secondaire</strong>.</li>
              </ul>
              <p style={css`margin: 1rem 0;`}>Il n'y a <strong>pas de plafond de ressources à respecter</strong>, mais le montant de l'aide CEE peut varier en fonction de vos revenus.</p>
            </MiseEnAvant>
            <h3>Calculer le montant de votre prime en répondant aux questions ci-dessous:</h3>
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
            <details>
              <summary style={css`font-size: 1.25rem;font-weight:bold;`}>Détails techniques</summary>
              <Card dangerouslySetInnerHTML={{ __html: parse(infoCEE.technique) }}
              ></Card>
            </details>
            <OtherSimulateur {...{mprAssocie}} />
        </Section>
      </Main>
    )
  }