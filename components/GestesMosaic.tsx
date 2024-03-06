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
    <div>
      <h2>Quels gestes vous intéressent ?</h2>
      <div
        css={`
          margin-top: 0.6rem;
          position: sticky;
          top: 2rem;
          > div {
            text-align: center;
            padding: 1.2rem 0rem;
            background: #4aeab0;
            border-radius: 2rem;
            width: 6rem;
            margin: 0;
            margin-left: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 140%;
            img {
              width: 1.4rem;
              height: auto;
              margin-right: 0.4rem;
            }
          }
        `}
      >
        <div title={`Vous avez sélectionné ${count} gestes.`}>
          <Image
            src="/basket.svg"
            alt="Symbole d'un représentant vos gestes choisis"
            width="10"
            height="10"
          />
          <span>{count}</span>
        </div>
      </div>
      <div
        css={`
          margin-top: 1rem;
          p {
            max-width: 35rem;
            color: #555;
            line-height: 1.1rem;
            em {
              display: inline;
            }
          }
        `}
      >
        <p>
          <small>
            Pour chaque geste ci-dessous, une <Prime value={'prime'} /> est
            disponible si le montant du geste est en-dessous du plafond{' '}
            <em>max</em>.
          </small>
        </p>
        <p>
          <small>
            Les primes sont personnalisées pour votre classe de revenu{' '}
            <Value
              {...{
                engine,
                situation: { ...situation },
                dottedName: 'ménage . revenu . classe',
                state: 'final',
              }}
            />
            .
          </small>
        </p>
      </div>
      <div
        css={`
          text-align: right;
        `}
      >
        <Link href={resetUrl}>Tout décocher</Link>
      </div>
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

      <Condition conditionValue={conditionValue} />

      <CTAWrapper>
        <CTA $importance={conditionValue ? 'primary' : 'inactive'}>
          {conditionValue ? (
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
                Suivant
              </span>
            </Link>
          ) : (
            <span
              title={
                conditionValue === false
                  ? `Il vous manque un chauffage décarboné pour obtenir une prime`
                  : `Sélectionnez au moins un geste pour passer à l'écran suivant`
              }
            >
              Suivant
            </span>
          )}
        </CTA>
      </CTAWrapper>
      <BlocQuestionRéponse>
        <details>
          <summary open={false}>🙋 Je ne sais pas quoi choisir !</summary>
          <p>
            Le parcours non accompagné de MaPrimeRénov' exige en effet de s'y
            connaitre ou d'avoir réfléchi aux gestes qui sont susceptibles
            d'améliorer efficacement les dépenses énergétiques de votre
            logement.
          </p>
          <p>
            Si cela vous semble trop compliqué, n'hésitez pas à{' '}
            <Link
              href={setSearchParams(
                { objectif: encodeDottedName('MPR . accompagnée') },
                'url',
              )}
            >
              choisir à la place le parcours accompagné
            </Link>
            .
          </p>
        </details>
      </BlocQuestionRéponse>
    </div>
  )
}

const Checkboxes = ({ questions, rules, onChange, situation, engine }) => {
  return questions.map((dottedName) => {
    return (
      <li
        key={dottedName}
        style={css`
          margin-bottom: 0.8rem;
        `}
      >
        <label key={dottedName}>
          <input
            style={css`
              margin-right: 1rem;
              cursor: pointer;
            `}
            type="checkbox"
            checked={situation[dottedName] === 'oui'}
            onChange={() => onChange(dottedName)}
          />
          <Geste {...{ rules, dottedName, engine: engine.setSituation() }} />
        </label>
      </li>
    )
  })
}
