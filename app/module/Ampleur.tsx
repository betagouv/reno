'use client'
import rules from '@/app/règles/rules'
import DPELabel from '@/components/DPELabel'
import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import Select from '@/components/Select'
import { CTA } from '@/components/UI'
import { createExampleSituation } from '@/components/ampleur/AmpleurSummary'
import useEnrichSituation from '@/components/personas/useEnrichSituation'
import {
  encodeDottedName,
  encodeSituation,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import rightArrow from '@/public/flèche-vers-droite.svg'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import logo from '@/public/logo.svg'
import { push } from '@socialgouv/matomo-next'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { Labels } from '../LandingUI'
import { Title } from '../LayoutUI'
import AmpleurCTA from './AmpleurCTA'
import { EvaluationValue } from './AmpleurEvaluation'
import { usageLogement, usageLogementValues } from './AmpleurInputs'
import useSyncAmpleurSituation from '@/components/ampleur/useSyncAmpleurSituation'

const engine = new Publicodes(rules)

export default function Ampleur() {
  const setSearchParams = useSetSearchParams()
  const isMobile = useMediaQuery('(max-width: 400px)')

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const { persona: selectedPersona = 0, ...situationSearchParams } =
    searchParams

  const userSituation = getSituation(situationSearchParams, rules)
  const currentDPE = +userSituation['DPE . actuel']
  const targetDPE =
    +userSituation['projet . DPE visé'] || Math.max(currentDPE - 2, 1)

  const extremeSituation = createExampleSituation(engine, {}, true)

  const defaultSituation = {
    ...extremeSituation, // pour déclencher Denormandie, taxe foncière, etc
    ...usageLogementValues[0].situation,
    'vous . propriétaire . condition': 'oui',
    'ménage . revenu': 25000, // Le revenu médian est de 20 000, mais le mettre à 25 000 permet de faire en sorte qu'il y ait une différence entre IdF et hors IdF pour que la case à cocher ait un effet
    'ménage . personnes': 2,
    'ménage . région . IdF': 'non',
  }

  const rawSituation = useMemo(
    () => ({
      ...defaultSituation,
      'projet . DPE visé': targetDPE,
      ...userSituation,
    }),
    [rawSearchParams.toString()],
  )

  const enrichedSituation = useEnrichSituation(rawSituation)
  const situation = enrichedSituation || rawSituation

  const savedSituation = useSyncAmpleurSituation(situation)

  if (!currentDPE || isNaN(currentDPE))
    return (
      <p>
        Un DPE est nécessaire pour utiliser estimer les aides à la rénovation
        d'ampleur.
      </p>
    )

  const onChange =
    (dottedName) =>
    ({ target: { value } }) =>
      setSearchParams({
        [encodeDottedName(dottedName)]: value + '*',
      })

  push(['trackEvent', 'Iframe', 'Page', 'Module Ampleur DPE ' + currentDPE])

  return (
    <div
      css={`
        background: white;
        padding: 1rem;
        position: relative;
        height: 100%;

        @media (min-width: 400px) {
          > div {
            padding-left: 4rem;
          }
          header,
          footer {
            margin-left: 4rem;
          }
          footer {
            margin-top: 1rem;
          }
        }
        > div {
          max-width: 40rem;
        }
        header {
          display: flex;
          align-items: center;
          gap: 4vw;

          justify-content: space-between;
          img {
          }
        }
        h2,
        h3 {
          font-size: 120%;
          font-weight: 500;
        }
        h2 {
          margin-top: 0.6rem;
          margin-bottom: 0.8rem;
          font-size: 130%;
          font-weight: 600;
        }
        h3 {
          margin-bottom: 0.6rem;
          @media (max-width: 400px) {
            margin-top: 0.6rem;
          }
        }
      `}
    >
      <header>
        <div>
          <Labels
            css={`
              margin: 0;
              li  {
                background: #fdf8db;

                color: #6e4444;
              }
            `}
          >
            {[' ⭐️ Rénovation énergétique'].map((text) => (
              <li key={text}>{text}</li>
            ))}
          </Labels>
          <h2>Vos aides pour une rénovation d'ampleur</h2>
        </div>
        <a
          href="https://mesaidesreno.beta.gouv.fr"
          css={`
            text-decoration: none;
            color: inherit;
            > div {
              @media (max-width: 400px) {
                top: 0rem;
                right: 0.4rem;
                img {
                  width: 2rem !important;
                }
                h1 {
                  line-height: 0.8rem;
                  font-size: 80%;
                  width: 2rem;
                }

                position: absolute;
              }
            }
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              font-size: 90%;
            `}
          >
            <Image
              src={logo}
              alt="Logo de Mes Aides Réno"
              css={`
                width: 2.6rem !important;
              `}
            />
            <Title>
              Mes <strong>Aides Réno</strong>
            </Title>
          </div>
        </a>
      </header>
      <div>
        <p>
          {!isMobile
            ? "Pour bénéficier des aides pour une rénovation d'ampleur, v"
            : 'V'}
          ous devez viser un saut d'au moins 2{' '}
          {isMobile ? 'DPE' : 'classes de DPE'}, soit passer du DPE actuel{' '}
          <DPELabel index={currentDPE - 1} /> à{isMobile ? '' : ' un '}
          <DPEQuickSwitch
            oldIndex={targetDPE - 1}
            prefixText={''}
            prefixDPE={isMobile ? false : true}
            dottedName="projet . DPE visé"
            situation={situation}
          />
          .
        </p>
        <ul
          css={`
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
          `}
        >
          <li>
            <Dot />
            <label htmlFor="">
              Ce logement sera :{' '}
              <Select
                css={`
                  background: #f5f5fe;
                  max-width: 90vw;
                `}
                onChange={(e) => {
                  push(['trackEvent', 'Iframe', 'Interaction', 'usage ' + e])
                  const encodedSituation = encodeSituation(
                    {
                      ...situation,
                      ...usageLogementValues.find(({ valeur }) => valeur == e)
                        .situation,
                    },
                    true,
                    //answeredQuestions,
                  )
                  setSearchParams(encodedSituation, 'replace', false)
                }}
                value={usageLogement(situation)}
                values={usageLogementValues}
              />
            </label>
          </li>
          <li key="personnes">
            <Dot />
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
                  push([
                    'trackEvent',
                    'Iframe',
                    'Interaction',
                    'personne ' + value,
                  ])
                  onChange('ménage . personnes')(e)
                }}
                css={`
                  width: 3rem !important;
                `}
              />{' '}
              personnes{' '}
              <label>
                <span>pour un revenu fiscal de </span>{' '}
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder={defaultSituation['ménage . revenu']}
                  onChange={(e) => {
                    const { value } = e.target
                    const invalid = isNaN(value) || value <= 0
                    if (invalid) return
                    push([
                      'trackEvent',
                      'Iframe',
                      'Interaction',
                      'revenu ' + value,
                    ])
                    onChange('ménage . revenu')(e)
                  }}
                  css={`
                    width: 5rem !important;
                  `}
                />{' '}
                €.
              </label>
            </label>
          </li>
          <li
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
            <Dot />
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
                      (situation['ménage . région . IdF'] === 'oui'
                        ? 'non'
                        : 'oui') + '*',
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
                      push([
                        'trackEvent',
                        'Iframe',
                        'Interaction',
                        'idf desktop oui',
                      ])
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
                      push([
                        'trackEvent',
                        'Iframe',
                        'Interaction',
                        'idf desktop non',
                      ])
                      setSearchParams({
                        [encodeDottedName('ménage . région . IdF')]: 'non*',
                      })
                    }}
                  />
                  <span>Non</span>
                </label>
              </section>
            )}
          </li>
        </ul>
        <h3>Parmi vos aides :</h3>
        <EvaluationValue {...{ engine, situation }} />
        <section>
          <CTA
            css={`
              margin-bottom: 0;
              a  {
                display: flex;
                font-size: 85% !important;
                align-items: center;
                img {
                  height: 2rem;
                  width: auto;
                  margin-right: 0.6rem;
                }
              }
            `}
          >
            <AmpleurCTA {...{ situation }} />
          </CTA>
        </section>
      </div>
      <footer
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: -1rem;

          p {
            margin: 0;
            margin-right: 1rem;
          }
        `}
      >
        <p>
          <small
            css={`
              line-height: 1rem;
              color: gray;
              display: block;
            `}
          >
            Une initiative construite avec France&nbsp;Rénov{"'"}
            {isMobile
              ? '.'
              : ` pour simplifier
            l'information sur les aides à la rénovation énergétique.`}
          </small>
        </p>

        <Image
          src={logoFranceRenov}
          alt="Logo de France Rénov"
          css={`
            width: 6.5rem !important;
            margin-right: 1rem;
            @media (max-width: 400px) {
              width: 5rem !important;
              margin: 0;
            }
          `}
        />
      </footer>
    </div>
  )
}

const Dot = () => (
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
