import Link from 'next/link'
import { CTA } from '@/components/UI'
import {
  encodeDottedName,
  encodeSituation,
} from '@/components/publicodes/situationUtils'
import { getRuleTitle } from '@/components/publicodes/utils'
import { displayRevenuLabel } from '@/components/RevenuInput'
import DPELabel from '@/components/DPELabel'

export default function AnswerItem({
  answer,
  rules,
  engine,
  situation,
  setSearchParams,
  rawAnsweredQuestions,
  communes,
  setIsOpen,
}) {
  const handleLinkClick = () => {
    setTimeout(() => setIsOpen(false), 200)
  }

  return (
    <>
      <span>{getRuleTitle(answer, rules)}</span>
      <span>
        <CTA
          $fontSize="normal"
          $importance="emptyBackground"
          css={`
            :hover {
              background: var(--color);
              color: white;
            }
          `}
        >
          <Link
            css={`
              padding: 0.3rem !important;
            `}
            onClick={handleLinkClick}
            href={setSearchParams(
              {
                question: encodeDottedName(answer),
                ...encodeSituation(
                  situation,
                  false,
                  rawAnsweredQuestions.filter((q) => q !== answer),
                ),
              },
              'url',
            )}
          >
            <FormattedAnswer
              {...{
                answer,
                situation,
                engine,
                communes,
                rules,
              }}
            />
          </Link>
        </CTA>
      </span>
    </>
  )
}

function FormattedAnswer({ answer, situation, engine, communes, rules }) {
  let unit = rules[answer]?.unité
  const value = situation[answer]

  let formattedValue
  if (answer === 'ménage . revenu') {
    formattedValue = displayRevenuLabel(situation, engine, parseInt(value) + 1)
    unit = ''
  } else if (['ménage . commune', 'logement . commune'].includes(answer)) {
    formattedValue = communes[answer]?.nom
      ? `${communes[answer].nom} (${communes[answer].codeDepartement})`
      : 'Chargement...'
  } else if (answer === 'DPE . actuel') {
    formattedValue = <DPELabel index={value} />
  } else {
    formattedValue = value?.replace(/['"]+/g, '')
  }

  return (
    <>
      {formattedValue} {unit}
      {unit === 'personne' && value > 1 ? 's' : ''}
    </>
  )
}
