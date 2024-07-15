'use client'
import rules from '@/app/règles/rules'
import DPELabel from '@/components/DPELabel'
import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import personas from './examplePersonas.yaml'
import { CTA, CTAWrapper, Card } from '@/components/UI'
import logo from '@/public/logo.svg'
import dotIcon from '@/public/point.svg'
import Image from 'next/image'
import Publicodes, { formatValue } from 'publicodes'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import { parse } from 'yaml'
import { BlueEm, Labels } from '../LandingUI'
import marianne from '@/public/marianne.svg'
import { PrimeStyle } from '@/components/Geste'
import { roundToThousands } from '@/components/utils'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import { getSituation } from '@/components/publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'

const engine = new Publicodes(rules)

export default function Ampleur() {
  const setSearchParams = useSetSearchParams()

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const { persona: selectedPersona = 0, ...situationSearchParams } =
    searchParams

  const userSituation = getSituation(situationSearchParams, rules)
  const personaSituation = personas[selectedPersona].situation
  const currentDPE = +personaSituation['DPE . actuel']
  console.log('userSituation', userSituation, situationSearchParams)
  const targetDPE =
    +userSituation['projet . DPE visé'] || Math.max(currentDPE - 2, 1)
  const situation = {
    ...personaSituation,
    'projet . DPE visé': targetDPE,
    ...userSituation,
  }

  const mpra = useMemo(() => {
    console.log('memo')
    try {
      const evaluation = engine
        .setSituation(situation)
        .evaluate('MPR . accompagnée . montant')
      return evaluation.nodeValue
    } catch (e) {
      console.log(e)
      return e
    }
  }, [situation])

  const onChange = () => null

  return (
    <div
      css={`
        margin: 2rem 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
      `}
    >
      <h3>La situation d'entrée de votre plateforme d'annonce</h3>
      <div
        css={`
          max-width: 90vw;
          overflow: scroll hidden;
          white-space: nowrap;
          height: 12rem;
          scrollbar-width: none;
          ul {
            list-style-type: none;

            display: flex;
            align-items: center;
            gap: 1rem;
            li {
              min-width: 12rem;
              height: 10rem;
              white-space: wrap;
              a {
                text-decoration: none;
                > div {
                  height: 100%;
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                }
              }
            }
          }
        `}
      >
        <ul>
          {personas.map(({ nom, situation }, i) => (
            <li key={nom}>
              <Link
                href={setSearchParams({ persona: i }, 'url')}
                scroll={false}
              >
                <Card
                  css={`
                    ${selectedPersona == i && `border: 2px solid var(--color)`}
                  `}
                >
                  <div>{nom}</div>
                  <div>
                    DPE : <DPELabel index={situation['DPE . actuel'] - 1} />
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <section>
        <h3>Le module de simulation que verra l'usager</h3>
        <div
          css={`
            --shadow-color: 0deg 0% 63%;
            --shadow-elevation-low: 0.3px 0.5px 0.7px
                hsl(var(--shadow-color) / 0.34),
              0.4px 0.8px 1px -1.2px hsl(var(--shadow-color) / 0.34),
              1px 2px 2.5px -2.5px hsl(var(--shadow-color) / 0.34);
            --shadow-elevation-medium: 0.3px 0.5px 0.7px
                hsl(var(--shadow-color) / 0.36),
              0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
              2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
              5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
            box-shadow: var(--shadow-elevation-medium);
            background: white;
            padding: 1.6rem;
            width: 45rem;
            border-radius: 0.4rem;
            position: relative;
            h2 + hr {
              width: 4rem;
              background: var(--color);
              height: 4px;
              margin-bottom: 2.6rem;
            }
            h2,
            h3 {
              font-size: 140%;
              font-weight: 500;
            }
            h2 {
              margin-top: 0.6rem;
              margin-bottom: 0.8rem;
              font-size: 160%;
              font-weight: 600;
            }
            h3 {
              margin-top: 2.5rem;
              margin-bottom: 0.6rem;
            }
          `}
        >
          <Labels
            css={`
              margin: 0;
            `}
          >
            {['⚡️ En 2024, les aides évoluent'].map((text) => (
              <li key={text}>{text}</li>
            ))}
          </Labels>
          <h2>
            Quelles <BlueEm>aides</BlueEm> pour une rénovation d'ampleur ?
          </h2>
          <hr />
          <ul
            css={`
              list-style-type: none;
              li {
                margin: 1.2rem 0;
              }
            `}
          >
            <li>
              <label
                css={`
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  margin-bottom: 0.6rem;
                  small {
                    margin-left: 0.1rem;
                  }
                `}
              >
                <input
                  css={`
                    width: 1.4rem;
                    height: 1.4rem;
                    cursor: pointer;
                    margin-right: 0.6rem;
                  `}
                  type="checkbox"
                  name={'revenu'}
                  value={true}
                  checked={true}
                  onChange={() => onChange()}
                />
                <div>
                  <div>
                    Le logement sera votre résidence principale ou celle de
                    votre locataire
                  </div>
                </div>
              </label>
            </li>
            <li>
              <label
                css={`
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  margin-bottom: 0.6rem;
                `}
              >
                <input
                  css={`
                    width: 1.4rem;
                    height: 1.4rem;
                    cursor: pointer;
                    margin-right: 0.6rem;
                  `}
                  type="checkbox"
                  name={'IDF'}
                  value={true}
                  checked={true}
                  onChange={() => onChange()}
                />
                <div>
                  <div>Vous habitez actuellement hors Île-de-France</div>
                </div>
              </label>
            </li>
            <li key="personnes">
              <Dot />
              <label>
                <span>Votre ménage est composé de </span>{' '}
                <input
                  type="number"
                  placeholder="2"
                  css={`
                    width: 4rem !important;
                  `}
                />{' '}
                personnes
              </label>
            </li>
            <li key="revenu">
              <Dot />
              <label>
                <span>Le revenu de votre ménage est de </span>{' '}
                <input type="number" placeholder="Votre revenu" /> €
              </label>
            </li>
            <li key="DPE">
              <Dot />
              <label>
                <span>
                  Vos travaux font passer le DPE actuel{' '}
                  <DPELabel index={currentDPE - 1} /> vers un{' '}
                  <DPEQuickSwitch
                    oldIndex={targetDPE - 1}
                    prefixText={''}
                    dottedName="projet . DPE visé"
                  />
                </span>{' '}
              </label>
            </li>
          </ul>
          <h3>Pour ce bien, vous pouvez toucher :</h3>
          <EvaluationValue>
            <Image
              src={'/investissement.svg'}
              alt="Icône argent dans la main"
              width="10"
              height="10"
            />
            <div>
              <div>
                Jusqu'à{' '}
                <PrimeStyle>
                  {typeof mpra === 'string' ? (
                    mpra
                  ) : (
                    <span>
                      {roundToThousands(mpra).toLocaleString('fr-FR')} €
                    </span>
                  )}
                </PrimeStyle>{' '}
                d'aides
              </div>
              <small
                css={`
                  display: block;
                  font-size: 70%;
                  margin: 0 auto;
                  margin-top: 0.4rem;
                `}
              >
                avec{' '}
                <BlueEm>
                  <strong>MaPrimeRénov'</strong>
                </BlueEm>{' '}
              </small>{' '}
            </div>
          </EvaluationValue>
          <section
            css={`
              margin-bottom: 0;
              display: flex;
              align-items: center;
              background: var(--lightestColor);
              justify-content: space-evenly;
              padding: 1.2rem 1rem;
              p {
                margin: 0;
                margin-right: 2rem;
              }
              margin-top: 2rem;
            `}
          >
            <p>
              Découvrez toutes les aides pour une rénovation énergétique votre
              logement
            </p>
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
              <a
                target="_blank"
                href="https://mesaidesreno.beta.gouv.fr/simulation"
              >
                <span>➞&nbsp;&nbsp;J'affine ma simulation</span>
              </a>
            </CTA>
          </section>

          <footer
            css={`
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: -1rem;
              margin-top: 1rem;

              > img {
                height: 5.5rem;
                width: auto;
                margin-right: 1rem;
              }
              p {
                margin: 0;
                margin-left: 2rem;
              }
              margin-top: 1rem;
            `}
          >
            <Image
              src={marianne}
              alt="Iconographie officielle Marianne, symbole de la république française"
            />

            <Image
              src={logoFranceRenov}
              alt="Logo de France Rénov"
              css={`
                width: 6.5rem !important;
              `}
            />
            <p>Un service proposé par l'État.</p>
          </footer>
        </div>
      </section>
    </div>
  )
}

const Dot = () => (
  <Image
    src={dotIcon}
    alt=""
    width="10"
    height="10"
    css={`
      display: none;
      margin-right: 1rem;
      margin-left: 0.25rem;
      height: 1rem;
      width: auto;
      vertical-align: sub;
    `}
  />
)

export const EvaluationValue = styled.div`
  img {
    width: 4rem;
    height: auto;
    margin-right: 1rem;
  }
  margin: 1.6rem auto;
  display: flex;
  align-items: center;
  font-size: 150%;
  width: fit-content;
  background: var(--lightestColor);
  border-bottom: 4px solid var(--color);

  padding: 1rem 2rem;
  text-align: center;
  small {
    margin-bottom: 0.4rem;
  }
`
