import RevenuInput from '@/components/RevenuInput'
import Select from '@/components/Select'
import rules from '@/app/règles/rules'
import {
  encodeDottedName,
  encodeSituation,
} from '@/components/publicodes/situationUtils'
import rightArrow from '@/public/flèche-vers-droite.svg'
import sablier from '@/public/sablier.svg'
import { push } from '@socialgouv/matomo-next'
import Image from 'next/image'
import styled from 'styled-components'
import { getRevenusList } from '@/components/RevenuInput'
import { usageLogement, usageLogementValues } from './AmpleurInputs'
import { formatValue } from 'publicodes'
import AddressSearch from '@/components/AddressSearch'
import { formatNumberWithSpaces } from '@/components/utils'

export const CommuneLogement = ({
  situation,
  onChange,
  text = 'Ce logement est situé à',
}) => (
  <section
    css={`
      display: flex;
      align-items: center;
    `}
  >
    <Dot />
    <label
      htmlFor=""
      css={`
        display: flex;
        align-items: center;
        input {
          height: 2.4rem !important;
          border-bottom: 2px solid var(--color);
        }
      `}
    >
      {text} :&nbsp;{' '}
      <AddressSearch
        {...{
          type: 'logement . commune',
          setChoice: (result) => {
            onChange(result)
          },
          situation,
        }}
      />
    </label>
  </section>
)

export const TypeResidence = ({
  setSearchParams,
  situation,
  answeredQuestions,
  dot = true,
}) => (
  <section>
    {dot && <Dot />}
    <label htmlFor="">
      Ce logement sera :{' '}
      <Select
        css={`
          background: #f5f5fe;
          max-width: 90vw;
        `}
        disableInstruction={false}
        onChange={(e) => {
          const additionalSituation = usageLogementValues.find(
            ({ valeur }) => valeur == e,
          ).situation
          push(['trackEvent', 'Module', 'Interaction', 'usage ' + e])

          const encodedSituation = encodeSituation(additionalSituation, true, [
            ...Object.keys(additionalSituation),
          ])
          setSearchParams(encodedSituation)
        }}
        value={
          answeredQuestions.includes(
            Object.keys(usageLogementValues[0].situation)[0],
          )
            ? usageLogement(situation)
            : ''
        }
        values={usageLogementValues}
      />
    </label>
  </section>
)

export const LogementType = ({
  setSearchParams,
  situation,
  text,
  rule = 'logement . type',
}) => (
  <section>
    <Dot />
    <label htmlFor="">
      {text ? text : rules[rule]['question']}:{' '}
      <Select
        css={`
          background: #f5f5fe;
          max-width: 90vw;
        `}
        disableInstruction={false}
        onChange={(e) => {
          push(['trackEvent', 'Module', 'Interaction', 'type logement ' + e])
          setSearchParams({
            [encodeDottedName(rule)]: `"${e}"*`,
          })
        }}
        value={situation[rule]?.replaceAll('"', '')}
        values={rules[rule]['une possibilité parmi']['possibilités'].map(
          (i) => {
            const ruleEntry = rules[`logement . type . ${i}`]
            ruleEntry.valeur = ruleEntry.valeur.replaceAll("'", '')
            return ruleEntry
          },
        )}
      />
    </label>
  </section>
)

export const PersonnesQuestion = ({
  situation,
  onChange,
  answeredQuestions,
  dot = true,
  text = 'Dans un ménage de',
}) => (
  <section>
    {dot && <Dot />}
    <label>
      <span>{text}</span>{' '}
      <input
        type="number"
        min="1"
        inputMode="numeric"
        pattern="[1-9]+"
        defaultValue={
          answeredQuestions.includes('ménage . personnes')
            ? situation['ménage . personnes']
            : undefined
        }
        onChange={(e) => {
          const { value } = e.target
          const invalid = isNaN(value) || value <= 0
          if (invalid) return
          push(['trackEvent', 'Module', 'Interaction', 'personne ' + value])
          onChange('ménage . personnes')(e)
        }}
        css={`
          width: 3rem !important;
        `}
      />{' '}
      personnes.
    </label>
  </section>
)
export const MontantQuestion = ({
  situation,
  setSearchParams,
  answeredQuestions,
  rule,
  text,
  dot = true,
}) => {
  return (
    <section>
      {dot && <Dot />}
      <label>
        <span>{text}&nbsp;:&nbsp;</span>
        <input
          css={`
            width: 8rem;
          `}
          type="text"
          inputMode="numeric"
          pattern="\d+"
          defaultValue={
            answeredQuestions.includes(rule)
              ? formatNumberWithSpaces(situation[rule])
              : undefined
          }
          onChange={(e) => {
            const price = e.target.value.replace(/\s/g, '')
            const invalid = isNaN(price) || price <= 0
            if (invalid) return
            push(['trackEvent', 'Module', 'Interaction', 'prix achat ' + price])
            setSearchParams({
              [encodeDottedName(rule)]: price + '*',
            })
            e.target.value = formatNumberWithSpaces(price)
          }}
        />{' '}
        €
      </label>
    </section>
  )
}

const revenuQuestionDependencies = [
  'ménage . personnes',
  'logement . propriétaire occupant',
]
const revenuQuestionDependenciesSatisfied = (answeredQuestions) => {
  return (
    revenuQuestionDependencies.every((dottedName) =>
      answeredQuestions.includes(dottedName),
    ) &&
    (answeredQuestions.includes('ménage . région . IdF') ||
      answeredQuestions.includes('logement . région . IdF'))
  )
}

export const RevenuQuestion = ({
  answeredQuestions,
  setSearchParams,
  engine,
  situation,
  dot = true,
}) => {
  const thisQuestionSatisfied = answeredQuestions.includes('ménage . revenu')
  if (revenuQuestionDependenciesSatisfied(answeredQuestions)) {
    const currentValue = situation['ménage . revenu']
    const onChange = (value) => {
      if (value === '') return
      push(['trackEvent', 'Module', 'Interaction', 'revenu ' + value])
      const encodedSituation = encodeSituation(
        {
          'ménage . revenu': value == undefined ? undefined : value,
        },
        false,
        ['ménage . revenu'],
      )
      setSearchParams(encodedSituation)
    }
    return (
      <section
        css={`
          display: flex;
          align-items: center;
        `}
      >
        {dot && <Dot />}
        <div>
          {!thisQuestionSatisfied && (
            <div>
              <small>
                <strong
                  css={`
                    color: var(--lightColor);
                    line-height: 1rem;
                  `}
                >
                  Dernière question !
                </strong>
              </small>
            </div>
          )}
          <label>
            <span>Pour un revenu fiscal </span>{' '}
            <RevenuInput
              type="select"
              engine={engine}
              situation={situation}
              value={currentValue == null ? '' : currentValue}
              onChange={onChange}
              disableInstruction={false}
            />
            .
          </label>
        </div>
      </section>
    )
  }
  return (
    <section>
      <Image
        src={sablier}
        alt="Un icône sablier représentant une question en attente"
        css={`
          @media (max-width: 400px) {
            margin-right: 0.5rem !important;
          }
        `}
      />
      Votre niveau de revenu
    </section>
  )
}

// Cette question se pose pour le PAR+ uniquement accessible au ménage très modeste et modeste
// On leur facilite un maximum la tâche en posant une question Oui/Non sur le montant max du ménage modeste
// plutôt que la liste déroulante de choix des revenus
export const RevenuMaxQuestion = ({
  answeredQuestions,
  setSearchParams,
  engine,
  situation,
}) => {
  const answered = answeredQuestions.includes('ménage . revenu . classe')
  // On doit trouver la valeur pour la classe modeste
  const revenuMax = getRevenusList(situation, engine)[1]
  if (revenuQuestionDependenciesSatisfied(answeredQuestions)) {
    const currentValue = situation['ménage . revenu']
    const onChange = (value) => {
      if (value === '') return
      const encodedSituation = encodeSituation(
        {
          'ménage . revenu': value == undefined ? undefined : value,
        },
        false,
        ['ménage . revenu'],
      )
      setSearchParams(encodedSituation)
    }

    return (
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <Dot />
        <YesNoQuestionStyle>
          <span>
            Avec un revenu fiscal inférieur à{' '}
            <strong>{formatValue(revenuMax)}€</strong> ?
          </span>
          <section>
            <label>
              <input
                id="rfr"
                type="radio"
                checked={
                  answered &&
                  situation['ménage . revenu . classe'] === '"modeste"'
                }
                onChange={() => {
                  push(['trackEvent', 'PAR', 'Interaction', 'classe éligible'])
                  setSearchParams({
                    [encodeDottedName('ménage . revenu . classe')]:
                      '"modeste"*',
                  })
                }}
              />
              <span>Oui</span>
            </label>
            <label>
              <input
                id="rfr"
                type="radio"
                checked={
                  answered &&
                  situation['ménage . revenu . classe'] === '"intermédiaire"'
                }
                onChange={() => {
                  push([
                    'trackEvent',
                    'PAR',
                    'Interaction',
                    'classe non éligible',
                  ])
                  setSearchParams({
                    [encodeDottedName('ménage . revenu . classe')]:
                      '"intermédiaire"*',
                  })
                }}
              />
              <span>Non</span>
            </label>
          </section>
        </YesNoQuestionStyle>
      </div>
    )
  }

  return (
    <section>
      <Dot />
      Avec un revenu fiscal inférieur à
    </section>
  )
}

export const PeriodeConstructionQuestion = ({
  setSearchParams,
  situation,
  answeredQuestions,
  periode,
}) => {
  const answered = answeredQuestions.includes('logement . ' + periode)
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <Dot />
      <YesNoQuestionStyle>
        <span>Il a été achevé depuis {periode}</span>
        <section>
          <label>
            <input
              id={`idf`}
              type="radio"
              checked={answered && situation['logement . ' + periode] === 'oui'}
              onChange={() => {
                push([
                  'trackEvent',
                  'PAR',
                  'Interaction',
                  'période construction oui',
                ])
                setSearchParams({
                  [encodeDottedName('logement . ' + periode)]: 'oui*',
                })
              }}
            />
            <span>Oui</span>
          </label>
          <label>
            <input
              id={`idf`}
              type="radio"
              checked={answered && situation['logement . ' + periode] === 'non'}
              onChange={() => {
                push([
                  'trackEvent',
                  'PAR',
                  'Interaction',
                  'période construction non',
                ])
                setSearchParams({
                  [encodeDottedName('logement . ' + periode)]: 'non*',
                })
              }}
            />
            <span>Non</span>
          </label>
        </section>
      </YesNoQuestionStyle>
    </div>
  )
}

export const YesNoQuestion = ({
  setSearchParams,
  situation,
  answeredQuestions,
  rules,
  rule,
  text,
}) => {
  const answered = answeredQuestions.includes(rule)
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <Dot />
      <YesNoQuestionStyle>
        <span>{text || rules[rule]['question']}</span>
        <section>
          <label>
            <input
              id={`idf`}
              type="radio"
              checked={answered && situation[rule] === 'oui'}
              onChange={() => {
                push(['trackEvent', 'Module', 'Interaction', rule + ' oui'])
                setSearchParams({
                  [encodeDottedName(rule)]: 'oui*',
                })
              }}
            />
            <span>Oui</span>
          </label>
          <label>
            <input
              id={`idf`}
              type="radio"
              checked={answered && situation[rule] === 'non'}
              onChange={() => {
                push(['trackEvent', 'Module', 'Interaction', rule + ' non'])
                setSearchParams({
                  [encodeDottedName(rule)]: 'non*',
                })
              }}
            />
            <span>Non</span>
          </label>
        </section>
      </YesNoQuestionStyle>
    </div>
  )
}

export const IdFQuestion = ({
  setSearchParams,
  isMobile,
  situation,
  answeredQuestions,
  rule = 'logement . région . IdF',
  dot = true,
}) => {
  // Ici, il faut savoir si l'on parle du ménage ou du logement
  if (situation['logement . résidence principale propriétaire'] == 'non') {
    rule = 'ménage . région . IdF'
  }
  const answered = answeredQuestions.includes(rule)
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      {dot && <Dot />}
      <YesNoQuestionStyle>
        <span>
          {rule == 'ménage . région . IdF'
            ? 'Votre résidence principale est située'
            : 'Il est situé'}
          &nbsp;:
        </span>
        <section>
          <label>
            <input
              id={`idf`}
              type="radio"
              checked={answered && situation[rule]?.includes('oui')}
              onChange={() => {
                push(['trackEvent', 'Module', 'Interaction', 'idf oui'])
                setSearchParams({
                  [encodeDottedName(rule)]: 'oui*',
                })
              }}
            />
            <span>En Île-de-France</span>
          </label>
          <label>
            <input
              id={`idf`}
              type="radio"
              checked={answered && situation[rule]?.includes('non')}
              onChange={() => {
                push(['trackEvent', 'Module', 'Interaction', 'idf non'])
                setSearchParams({
                  [encodeDottedName(rule)]: 'non*',
                })
              }}
            />
            <span>Dans une autre région</span>
          </label>
        </section>
      </YesNoQuestionStyle>
    </div>
  )
}

export const TypeTravaux = ({
  setSearchParams,
  situation,
  rules,
  rule = 'logement . type travaux',
}) => (
  <section>
    <Dot />
    <label htmlFor="">
      {rules[rule]['question']}:{' '}
      <Select
        css={`
          background: #f5f5fe;
          max-width: 90vw;
        `}
        disableInstruction={false}
        onChange={(e) => {
          push(['trackEvent', 'Module', 'Interaction', 'travaux ' + e])
          setSearchParams({
            [encodeDottedName(rule)]: '"' + e + '"*',
          })
        }}
        value={situation[rule]?.replaceAll('"', '')}
        values={rules[rule]['une possibilité parmi']['possibilités'].map(
          (i) => rules['logement . ' + i],
        )}
      />
    </label>
  </section>
)

export const DureeLocation = ({
  setSearchParams,
  situation,
  rules,
  rule = 'denormandie . années de location',
}) => (
  <section>
    <Dot />
    <label htmlFor="">
      {rules[rule]['question']}{' '}
      <Select
        css={`
          background: #f5f5fe;
          max-width: 90vw;
        `}
        onChange={(e) => {
          if (!e) return
          push(['trackEvent', 'Module', 'Interaction', 'travaux ' + e])
          setSearchParams({
            [encodeDottedName(rule)]: e + '*',
          })
        }}
        disableInstruction={false}
        value={situation[rule]?.replaceAll('"', '')}
        values={rules[rule]['une possibilité parmi']['possibilités'].map(
          (i) => ({ titre: i + ' ans', valeur: i }),
        )}
      />
    </label>
  </section>
)

export const QuestionList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  li {
    margin: 1.2rem 0;
    display: flex;
    align-items: center;
    line-height: 1.6rem;
    input {
      min-width: 1.4rem;
      min-height: 1.4rem;
      margin-right: 0.6rem;
    }
    input[type='number'] {
      height: 1.75rem !important;
    }
    img {
      width: 1rem;
      height: auto;
      margin-right: 1rem;
      margin-left: 0.2rem;
      vertical-align: sub;
    }
  }
`

export const Li = styled.li`
  border-left: 3px solid #ddd;
  padding-left: 0.6rem;
  margin-left: -0.4rem !important;

  filter: none;
  ${({ $next, $touched }) =>
    $touched
      ? `border-left: 3px solid var(--lightColor);`
      : $next
        ? ''
        : `filter: grayscale(0.9) opacity(0.4)`};
`

export const YesNoQuestionStyle = styled.div`
  > section {
    margin-left: 1rem;
    label {
      display: inline-flex;
      align-items: center;
      margin-right: 1rem;
    }
    input[type='radio'] {
      width: 1.2rem !important;
      height: 1.2rem !important;
    }
    input[type='radio'],
    input[type='radio'] + label {
      cursor: pointer;
      &:hover {
        background: var(--lighterColor);
      }
    }
  }
`

export const Dot = () => (
  <Image
    src={rightArrow}
    alt="Icône d'une flèche vers la droite"
    css={`
      @media (max-width: 400px) {
        display: none;
      }
    `}
  />
)
