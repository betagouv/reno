import rules from '@/app/règles/rules'
import Image from 'next/image'
import Link from 'next/link'
import { BlocQuestionRéponse } from './BlocQuestionRéponse'
import { Details, Fieldset } from './BooleanMosaicUI'
import css from './css/convertToJs'
import Geste, { Prime } from './Geste'
import Condition, { computeConditionValue } from './gestes/Condition'
import { encodeDottedName, encodeSituation } from './publicodes/situationUtils'
import { Value } from './ScenariosSelector'
import { CTA, CTAWrapper } from './UI'
import { omit } from './utils'
import { dot } from 'node:test/reporters'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'

const localIsMosaic = (dottedName, rule) =>
  dottedName.startsWith('gestes . ') &&
  rule &&
  ['oui', 'non'].includes(rule['par défaut'])

export const isGestesMosaicQuestion = (currentQuestion, rule) => {
  return localIsMosaic(currentQuestion, rule)
}

export const gestesMosaicQuestions = Object.entries(rules).filter(
  ([dottedName, rule]) => localIsMosaic(dottedName, rule),
)

export const gestesMosaicQuestionText = (rules, currentQuestion) => {
  const rule = rules['gestes . montant']
  return rule.mosaïque && rule.question
}

export default function GestesMosaic({
  rules,
  setSearchParams,
  rule,
  situation,
  answeredQuestions,
  questions,
  engine,
}) {
  const grouped = questions.reduce(
      (memo, [q, rule]) => {
        const categoryDottedName = q.split(' . ').slice(0, -1).join(' . ')

        return {
          ...memo,
          [categoryDottedName]: [...(memo[categoryDottedName] || []), q],
        }
      },

      {},
    ),
    entries = Object.entries(grouped)

  const levels = entries.map(([el]) => el.split(' . ').length),
    minimum = Math.min(...levels),
    maximum = Math.max(...levels)

  if (maximum - minimum > 1) {
    console.log(entries)
    throw new Error('The UI cannot yet handle 3 level mosaic questions')
  }

  const categoryIndex = (category) =>
      rules['gestes . montant'].somme.findIndex((el) => el === category),
    categoryName = (category) => category[0].split(' . ')[1]
  const categories = entries
    .filter((el) => el[0].split(' . ').length === 2)
    .sort(
      (a, b) => categoryIndex(categoryName(a)) - categoryIndex(categoryName(b)),
    )

  console.log({ entries })

  const onChange = (dottedName) => {
    const encodedSituation = encodeSituation(
      {
        ...situation,
        [dottedName]: situation[dottedName] === 'oui' ? 'non' : 'oui',
      },
      false,
      answeredQuestions,
    )
    console.log('on change will set encodedSituation', encodedSituation)

    setSearchParams(encodedSituation, 'push', false)
    console.log('set situation', dottedName)
  }

  const nullSituation = Object.fromEntries(
    questions.map((question) => [question[0], 'non']),
  )
  console.log(nullSituation)
  const runSituation = { ...nullSituation, ...situation }

  const count = questions.filter(
    ([dottedName]) => situation[dottedName] === 'oui',
  ).length

  const nextUrl = setSearchParams(
    {
      ...encodeSituation(runSituation, false, [
        ...answeredQuestions,
        ...questions.map((q) => q[0]),
      ]),
      question: undefined,
    },
    'url',
    false,
  )
  const resetSituation = omit(
    questions.map((q) => q[0]),
    situation,
  )
  console.log('null situation', resetSituation)
  const resetUrl = setSearchParams(
    encodeSituation(resetSituation, false, answeredQuestions),
    'url',
    false,
  )
  const safeEngine = engine.setSituation(resetSituation)

  const conditionValue = computeConditionValue(questions, situation)

  return (
    <CustomQuestionWrapper>
      <BtnBackToParcoursChoice {...{
          setSearchParams,
          situation,
          answeredQuestions
        }}
      />
      <header>
        <small>Les aides à la carte</small>
        <h2>Quels travaux souhaitez-vous entreprendre ?</h2>
      </header>
      <Fieldset>
        <ul>
          {categories.map(([category, dottedNames]) => (
            <li key={category}>
              <Details open={true}>
                <summary>
                  <h4>{rules[category].titre}</h4>
                </summary>

                <ul>
                  <Checkboxes
                    {...{
                      questions: dottedNames,
                      rules,
                      onChange,
                      situation,
                      engine: safeEngine,
                    }}
                  />
                  {entries
                    .filter(
                      ([k, v]) => k.startsWith(category) && k !== category,
                    )
                    .map(([subCategory, dottedNames2]) => {
                      const categoryTitle = rules[subCategory].titre

                      return (
                        <li key={subCategory}>
                          <h5>{categoryTitle}</h5>
                          <ul>
                            <Checkboxes
                              {...{
                                questions: dottedNames2,
                                rules,
                                onChange,
                                situation,
                                engine: safeEngine,
                              }}
                            />
                          </ul>
                        </li>
                      )
                    })}
                </ul>
              </Details>
            </li>
          ))}
        </ul>
      </Fieldset>

      <CTAWrapper
        css={`
          @media (max-width: 800px) {
            position: fixed;
            text-align: center;
            bottom: 0;
            left: 0;
            width: 100%;
            margin: 0;
            background: white;
            padding: 1rem 0;
            --shadow-color: 180deg 2% 61%;
            --shadow-elevation-medium: 0px -0.4px 0.5px hsl(var(--shadow-color) /
                    0.36),
              0px -1.2px 1.3px -0.8px hsl(var(--shadow-color) / 0.36),
              0.1px -2.9px 3.3px -1.7px hsl(var(--shadow-color) / 0.36),
              0.2px -7.1px 8px -2.5px hsl(var(--shadow-color) / 0.36);

            box-shadow: var(--shadow-elevation-medium);
            > div {
              width: 90%;
              margin: 0 auto !important;
            }
          }
        `}
      >
        <CTA $importance={count === 0 ? 'inactive' : 'primary'}>
          <Link href={nextUrl}>
            <span
              css={`
                img {
                  filter: invert(1);
                  width: 1.6rem;
                  margin-right: 0.6rem;
                  height: auto;
                  vertical-align: bottom;
                }
              `}
            >
              <Image
                src="/check.svg"
                width="10"
                height="10"
                alt="Icône coche pleine"
              />
              Valider ma sélection ({count})
            </span>
          </Link>
        </CTA>
      </CTAWrapper>
    </CustomQuestionWrapper>
  )
}

const Checkboxes = ({ questions, rules, onChange, situation, engine }) => {
  return questions.map((dottedName) => {
    const interfaceSituation = { ...situation, [dottedName]: 'oui' }

    const checked = situation[dottedName] === 'oui'
    return (
      <li
        key={dottedName}
        css={`
          margin-bottom: 0.8rem;
        `}
      >
        <label
          key={dottedName}
          css={`
            background: white;
            padding: 0.6rem 0.6rem;
            border: 1px solid #00008f26;
            ${checked && `border: 2px solid var(--color);`}
            border-radius: 0.2rem;
            > div {
              max-width: calc(100% - 4rem);
            }
          `}
        >
          <input
            style={css`
              width: 1.6rem;
              height: 1.6rem;
              margin-right: 1rem;
              cursor: pointer;
            `}
            type="checkbox"
            checked={checked}
            onChange={() => onChange(dottedName)}
          />
          <Geste
            {...{
              rules,
              dottedName,
              engine,
              situation: interfaceSituation,
              expanded: false,
            }}
          />
        </label>
      </li>
    )
  })
}
