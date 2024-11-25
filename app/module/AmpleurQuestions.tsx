import Select from '@/components/Select'
import {
  encodeDottedName,
  encodeSituation,
} from '@/components/publicodes/situationUtils'
import { usageLogement, usageLogementValues } from './AmpleurInputs'
import { push } from '@socialgouv/matomo-next'
import styled from 'styled-components'

export const TypeResidence = ({
  setSearchParams,
  situation,
  answeredQuestions,
}) => (
  <label htmlFor="">
    Ce logement sera :{' '}
    <Select
      css={`
        background: #f5f5fe;
        max-width: 90vw;
      `}
      onChange={(e) => {
        const additionalSituation = usageLogementValues.find(
          ({ valeur }) => valeur == e,
        ).situation
        push(['trackEvent', 'Iframe', 'Interaction', 'usage ' + e])
        const encodedSituation = encodeSituation(
          {
            ...situation,
            ...additionalSituation,
          },
          true,
          [...answeredQuestions, ...Object.keys(additionalSituation)],
        )
        setSearchParams(encodedSituation, 'replace', false)
      }}
      value={usageLogement(situation)}
      values={usageLogementValues}
    />
  </label>
)

export const PersonnesQuestion = ({ defaultSituation, onChange }) => (
  <label>
    <span>Votre ménage est composé de </span>{' '}
    <input
      type="number"
      min="1"
      inputMode="numeric"
      pattern="[1-9]+"
      placeholder={defaultSituation['ménage . personnes']}
      onChange={(e) => {
        const { value } = e.target
        const invalid = isNaN(value) || value <= 0
        if (invalid) return
        push(['trackEvent', 'Iframe', 'Interaction', 'personne ' + value])
        onChange('ménage . personnes')(e)
      }}
      css={`
        width: 3rem !important;
      `}
    />{' '}
    personnes.
  </label>
)

export const RevenuQuestion = ({ defaultSituation, onChange }) => (
  <label>
    <span>Pour un revenu fiscal de</span>{' '}
    <input
      type="number"
      min="0"
      inputMode="numeric"
      placeholder={defaultSituation['ménage . revenu']}
      onChange={(e) => {
        const { value } = e.target
        const invalid = isNaN(value) || value <= 0
        if (invalid) return
        push(['trackEvent', 'Iframe', 'Interaction', 'revenu ' + value])
        onChange('ménage . revenu')(e)
      }}
      css={`
        width: 5rem !important;
      `}
    />{' '}
    €.
  </label>
)

export const IdFQuestion = ({ setSearchParams, isMobile, situation }) => (
  <div
    css={`
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
    `}
  >
    {isMobile && (
      <input
        type="checkbox"
        id="idf"
        name={'IDF'}
        defaultChecked={situation['ménage . région . IdF'] === 'non'}
        onChange={() => {
          push([
            'trackEvent',
            'Iframe',
            'Interaction',
            'idf mobile ' + situation['ménage . région . IdF'],
          ])
          setSearchParams({
            [encodeDottedName('ménage . région . IdF')]:
              (situation['ménage . région . IdF'] === 'oui' ? 'non' : 'oui') +
              '*',
          })
        }}
      />
    )}
    <span>
      Vous habitez {isMobile ? '' : 'actuellement'} hors Île-de-France
    </span>
    {!isMobile && (
      <section>
        <label>
          <input
            id={`idf`}
            type="radio"
            checked={situation['ménage . région . IdF'] === 'oui'}
            onChange={() => {
              push(['trackEvent', 'Iframe', 'Interaction', 'idf desktop oui'])
              setSearchParams({
                [encodeDottedName('ménage . région . IdF')]: 'oui*',
              })
            }}
          />
          <span>Oui</span>
        </label>
        <label>
          <input
            id={`idf`}
            type="radio"
            checked={situation['ménage . région . IdF'] === 'non'}
            onChange={() => {
              push(['trackEvent', 'Iframe', 'Interaction', 'idf desktop non'])
              setSearchParams({
                [encodeDottedName('ménage . région . IdF')]: 'non*',
              })
            }}
          />
          <span>Non</span>
        </label>
      </section>
    )}
  </div>
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
      margin-right: 0.6rem;
    }
  }
`

export const Li = styled.li`
  border-left: 3px solid #ddd;
  padding-left: 0.6rem;
  margin-left: -0.4rem !important;
  ${({ $touched }) => $touched && `border-left: 3px solid var(--lightColor)`}
`
