'use client'
import {
  getAnsweredQuestions
} from '@/components/publicodes/situationUtils'
import GesteQuestion from '@/components/GesteQuestion'
import { Main } from '@/components/UI'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import useSetSearchParams from '@/components/useSetSearchParams'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { useSearchParams } from 'next/navigation'

export default function CeeCode({ params }: { params: { code: string } }) {

  const engine = new Publicodes(rules)
  const setSearchParams = useSetSearchParams()
  const searchParams = Object.fromEntries(useSearchParams().entries())

  const rule = Object.keys(rules).filter((rule) => rules[rule] && rules[rule].code == params.code)[0]
  const answeredQuestions = getAnsweredQuestions(searchParams, rules)

  const nextQuestions = getNextQuestions(
    engine.evaluate(rule + ' . montant'),
    [],
    [],
    rules,
  )
  const situation = engine.evaluate(rule + ' . montant')
  const infoCEE = {
    montant: formatValue(situation, { precision: 0 }),
    titre: rules[rule].titre,
    lien: rules[rule].lien,
    questions: nextQuestions,
  }

  console.log('ici');
  console.log('infoCEE', infoCEE)
  console.log('setSearchParams', setSearchParams)
  console.log('answeredQuestions', answeredQuestions)
  console.log('questions', infoCEE.questions)
  return (
    <Main>
      {infoCEE.titre}<br />
      {infoCEE.lien}
      {infoCEE.questions?.map((question, idx) => (
        <GesteQuestion
          key={idx}
          {...{
            rules,
            question,
            engine,
            situation,
            answeredQuestions,
            setSearchParams,
          }}
        />
      ))}
    </Main>
  )
}
