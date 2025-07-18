import RevenuInput from '@/components/RevenuInput'
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
import { formatValue, serializeUnit } from 'publicodes'
import AddressSearch from '@/components/AddressSearch'
import { formatNumberWithSpaces } from '@/components/utils'
import Select from '@codegouvfr/react-dsfr/Select'
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons'
import Input from '@codegouvfr/react-dsfr/Input'

export const CommuneLogement = ({
  situation,
  onChange,
  text = 'Ce logement est situé à',
}) => (
  <AddressSearch
    {...{
      label: text + ' :',
      type: 'logement . commune',
      setChoice: (result) => {
        onChange(result)
      },
      situation,
    }}
  />
)

export const TypeResidence = ({
  setSearchParams,
  situation,
  answeredQuestions,
}) => {
  const value = answeredQuestions.includes(
    Object.keys(usageLogementValues[0].situation)[0],
  )
    ? usageLogement(situation)
    : ''
  return (
    <Select
      label="Ce logement sera :"
      nativeSelectProps={{
        onChange: (e) => {
          const additionalSituation = usageLogementValues.find(
            ({ valeur }) => valeur == e.target.value,
          ).situation
          push(['trackEvent', 'Module', 'Interaction', 'usage ' + e])
          const encodedSituation = encodeSituation(additionalSituation, true, [
            ...Object.keys(additionalSituation),
          ])
          setSearchParams(encodedSituation)
        },
        value: value,
      }}
      state={value !== '' ? 'success' : 'default'}
    >
      <option value="" disabled>
        Sélectionnez une option
      </option>
      {usageLogementValues.map((usage, i) => (
        <option key={i} value={usage.valeur}>
          {usage.titre}
        </option>
      ))}
    </Select>
  )
}

export const LogementType = ({
  setSearchParams,
  situation,
  text,
  rule = 'logement . type',
  disabled,
}) => (
  <RadioButtons
    legend={text ? text : rules[rule]['question']}
    options={[
      {
        label: 'Une maison',
        nativeInputProps: {
          value: 'maison',
          checked: situation[rule] === '"maison"',
          onChange: () => {
            push([
              'trackEvent',
              'Plus value',
              'Interaction',
              'type logement maison',
            ])
            setSearchParams({
              [encodeDottedName(rule)]: '"maison"*',
            })
          },
        },
      },
      {
        label: 'Un appartement',
        nativeInputProps: {
          value: 'appartement',
          checked: situation[rule] === '"appartement"',
          onChange: () => {
            push([
              'trackEvent',
              'Plus value',
              'Interaction',
              'type logement appartement',
            ])
            setSearchParams({
              [encodeDottedName(rule)]: '"appartement"*',
            })
          },
        },
      },
    ]}
    name={`radio-${encodeDottedName(rule)}`}
    disabled={disabled}
    state={situation[rule] && !disabled && 'success'}
    stateRelatedMessage=""
    orientation="horizontal"
  />
)

export const PersonnesQuestion = ({
  situation,
  onChange,
  answeredQuestions,
  disabled,
  text = 'Dans un ménage de',
}) => {
  const rule = 'ménage . personnes'
  return (
    <Input
      nativeInputProps={{
        pattern: '[1-9]+',
        type: 'number',
        value: situation[rule],
        name: 'nbpersonne',
        onChange: (e) => {
          const { value } = e.target
          const invalid = isNaN(value) || value <= 0
          if (invalid) return
          push(['trackEvent', 'Module', 'Interaction', 'personne ' + value])
          onChange(rule)(e)
        },
      }}
      state={answeredQuestions.includes(rule) && 'success'}
      disabled={disabled}
      stateRelatedMessage=""
      label={text}
      autoFocus={true}
      addon={situation[rule] > 1 ? 'personnes' : 'personne'}
    />
  )
}
export const MontantQuestion = ({
  situation,
  setSearchParams,
  answeredQuestions,
  rule,
  text,
  disabled,
}) => {
  return (
    <Input
      nativeInputProps={{
        pattern: '\d+',
        type: 'text',
        value: answeredQuestions.includes(rule)
          ? formatNumberWithSpaces(situation[rule])
          : undefined,
        name: 'montant',
        inputMode: 'numeric',
        onChange: (e) => {
          const price = e.target.value.replace(/\s/g, '')
          const invalid = isNaN(price) || price <= 0
          if (invalid) return
          push(['trackEvent', 'Module', 'Interaction', 'prix achat ' + price])
          setSearchParams({
            [encodeDottedName(rule)]: price + '*',
          })
          e.target.value = formatNumberWithSpaces(price)
        },
      }}
      state={answeredQuestions.includes(rule) && 'success'}
      disabled={disabled}
      stateRelatedMessage=""
      label={text + ' :'}
      addon="€"
    />
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
  disabled,
}) => {
  const thisQuestionSatisfied = answeredQuestions.includes('ménage . revenu')
  if (revenuQuestionDependenciesSatisfied(answeredQuestions)) {
    const currentValue = situation['ménage . revenu']
    const onChange = (e) => {
      const value = e.target.value
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
        <RevenuInput
          label="Pour un revenu fiscal"
          type="select"
          disabled={disabled}
          engine={engine}
          situation={situation}
          value={currentValue == null ? '' : currentValue}
          onChange={onChange}
        />
      </div>
    )
  }
  return (
    <section
      css={`
        display: flex;
        align-items: center;
        gap: 0.5em;
      `}
    >
      <Image
        src={sablier}
        alt="Un icône sablier représentant une question en attente"
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
  disabled,
}) => {
  const rule = 'ménage . revenu . classe'
  const answered = answeredQuestions.includes(rule)
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
  }
  return (
    <RadioButtons
      legend={
        <>
          Avec un revenu fiscal inférieur à{' '}
          <strong>{disabled ? '...' : formatValue(revenuMax)}€</strong> ?
        </>
      }
      name={`radio-${encodeDottedName(rule)}`}
      options={[
        {
          label: 'Oui',
          nativeInputProps: {
            value: 'oui',
            checked: answered && situation[rule] === '"modeste"',
            onChange: () => {
              push(['trackEvent', 'PAR', 'Interaction', 'classe éligible'])
              setSearchParams({
                [encodeDottedName(rule)]: '"modeste"*',
              })
            },
          },
        },
        {
          label: 'Non',
          nativeInputProps: {
            value: 'non',
            checked: answered && situation[rule] === '"intermédiaire"',
            onChange: () => {
              push(['trackEvent', 'PAR', 'Interaction', 'classe non éligible'])
              setSearchParams({
                [encodeDottedName('ménage . revenu . classe')]:
                  '"intermédiaire"*',
              })
            },
          },
        },
      ]}
      disabled={disabled}
      state={answered && !disabled && 'success'}
      stateRelatedMessage=""
      orientation="horizontal"
    />
  )
}

export const PeriodeConstructionQuestion = ({
  setSearchParams,
  situation,
  answeredQuestions,
  periode,
  disabled,
}) => {
  const answered = answeredQuestions.includes('logement . ' + periode)
  return (
    <RadioButtons
      legend={`Il a été achevé depuis ${periode}`}
      name="radio"
      options={[
        {
          label: 'Oui',
          nativeInputProps: {
            value: 'oui',
            checked: answered && situation['logement . ' + periode] === 'oui',
            onChange: () => {
              push([
                'trackEvent',
                'PAR',
                'Interaction',
                'période construction oui',
              ])
              setSearchParams({
                [encodeDottedName('logement . ' + periode)]: 'oui*',
              })
            },
          },
        },
        {
          label: 'Non',
          nativeInputProps: {
            value: 'non',
            checked: answered && situation['logement . ' + periode] === 'non',
            onChange: () => {
              push([
                'trackEvent',
                'PAR',
                'Interaction',
                'période construction non',
              ])
              setSearchParams({
                [encodeDottedName('logement . ' + periode)]: 'non*',
              })
            },
          },
        },
      ]}
      disabled={disabled}
      state={answered && !disabled && 'success'}
      stateRelatedMessage=""
      orientation="horizontal"
    />
  )
}

export const YesNoQuestion = ({
  setSearchParams,
  situation,
  answeredQuestions,
  rules,
  rule,
  text,
  disabled,
}) => {
  const answered = answeredQuestions.includes(rule)
  return (
    <RadioButtons
      legend={text || rules[rule]['question']}
      name={`radio-${encodeDottedName(rule)}`}
      options={[
        {
          label: 'Oui',
          nativeInputProps: {
            value: 'oui',
            checked: answered && situation[rule] === 'oui',
            onChange: () => {
              push(['trackEvent', 'Module', 'Interaction', rule + ' oui'])
              setSearchParams({
                [encodeDottedName(rule)]: 'oui*',
              })
            },
          },
        },
        {
          label: 'Non',
          nativeInputProps: {
            value: 'non',
            checked: answered && situation[rule] === 'non',
            onChange: () => {
              push(['trackEvent', 'Module', 'Interaction', rule + ' non'])
              setSearchParams({
                [encodeDottedName(rule)]: 'non*',
              })
            },
          },
        },
      ]}
      disabled={disabled}
      state={answered && !disabled && 'success'}
      stateRelatedMessage=""
      orientation="horizontal"
    />
  )
}

export const IdFQuestion = ({
  setSearchParams,
  situation,
  answeredQuestions,
  rule = 'logement . région . IdF',
  disabled,
}) => {
  // Ici, il faut savoir si l'on parle du ménage ou du logement
  if (situation['logement . résidence principale propriétaire'] == 'non') {
    rule = 'ménage . région . IdF'
  }
  const answered = answeredQuestions.includes(rule)
  return (
    <RadioButtons
      legend={
        rule == 'ménage . région . IdF'
          ? 'Votre résidence principale est située'
          : 'Il est situé'
      }
      name={`radio-${encodeDottedName(rule)}`}
      options={[
        {
          label: 'En Île-de-France',
          nativeInputProps: {
            value: 'oui',
            checked: answered && situation[rule] === 'oui',
            onChange: () => {
              push(['trackEvent', 'Module', 'Interaction', rule + ' oui'])
              setSearchParams({
                [encodeDottedName(rule)]: 'oui*',
              })
            },
          },
        },
        {
          label: 'Dans une autre région',
          nativeInputProps: {
            value: 'non',
            checked: answered && situation[rule] === 'non',
            onChange: () => {
              push(['trackEvent', 'Module', 'Interaction', rule + ' non'])
              setSearchParams({
                [encodeDottedName(rule)]: 'non*',
              })
            },
          },
        },
      ]}
      disabled={disabled}
      state={answered && !disabled && 'success'}
      stateRelatedMessage=""
      orientation="horizontal"
    />
  )
}

export const TypeTravaux = ({
  setSearchParams,
  situation,
  rules,
  rule = 'logement . type travaux',
  disabled,
}) => (
  <Select
    label={`${rules[rule]['question']} :`}
    disabled={disabled}
    nativeSelectProps={{
      onChange: (e) => {
        push([
          'trackEvent',
          'Module',
          'Interaction',
          'travaux ' + e.target.value,
        ])
        setSearchParams({
          [encodeDottedName(rule)]: '"' + e.target.value + '"*',
        })
      },
      value: situation[rule]?.replaceAll('"', ''),
    }}
    state={situation[rule] && !disabled && 'success'}
  >
    <option value="">Sélectionnez une option</option>
    {rules[rule]['une possibilité parmi']['possibilités'].map((usage, i) => (
      <option key={i} value={rules['logement . ' + usage].valeur}>
        {rules['logement . ' + usage].titre}
      </option>
    ))}
  </Select>
)

export const DureeLocation = ({
  setSearchParams,
  situation,
  rules,
  rule = 'denormandie . années de location',
  disabled,
}) => (
  <Select
    label={rules[rule]['question']}
    disabled={disabled}
    nativeSelectProps={{
      onChange: (e) => {
        if (!e) return
        push(['trackEvent', 'Module', 'Interaction', 'travaux ' + e])
        setSearchParams({
          [encodeDottedName(rule)]: e.target.value + '*',
        })
      },
      value: situation[rule]?.replaceAll('"', ''),
    }}
    state={situation[rule] && !disabled && 'success'}
  >
    <option value="">Sélectionnez une option</option>
    {rules[rule]['une possibilité parmi']['possibilités'].map((i) => (
      <option key={i} value={i}>
        {i + ' ans'}
      </option>
    ))}
  </Select>
)

export const QuestionList = styled.form``

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
