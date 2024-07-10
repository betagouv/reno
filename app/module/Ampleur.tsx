'use client'
import rules from '@/app/règles/rules'
import DPELabel from '@/components/DPELabel'
import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import { CTA, CTAWrapper } from '@/components/UI'
import logo from '@/public/logo.svg'
import dotIcon from '@/public/point.svg'
import Image from 'next/image'
import Publicodes, { formatValue } from 'publicodes'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import { parse } from 'yaml'
import { BlueEm } from '../LandingUI'
import marianne from '@/public/marianne-sans-texte.svg'

const engine = new Publicodes(rules)

export default function Ampleur() {
  const [yaml, setYaml] = useState(`
DPE . actuel: 6
conditions communes: oui
`)
  const [debouncedYaml] = useDebounce(yaml, 500)

  const [mpra, situation] = useMemo(() => {
    console.log('memo')
    try {
      const json = parse(debouncedYaml)
      const evaluation = engine
        .setSituation(json)
        .evaluate('MPR . accompagnée . montant')
      return [formatValue(evaluation, { precision: 0 }), json]
    } catch (e) {
      console.log(e)
      return e
    }
  }, [debouncedYaml])

  const onChange = () => null

  const currentDPE = +situation['DPE . actuel']
  const targetDPE = Math.max(currentDPE - 2, 1)
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
      <h3>Les données d'entrée de votre plateforme d'annonce</h3>
      <ul>
        {personas.map((situation) => (
          <li key={JSON.stringify(situation)}>{situation['DPE . actuel']}</li>
        ))}
      </ul>
      <section>
        <TextArea
          value={yaml}
          onChange={(e) => console.log('onchange') || setYaml(e.target.value)}
        />
        <h3>Le module de simulation que verra l'usager</h3>
        <div
          css={`
            border: 1px solid var(--color);
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
            h2 {
              margin-top: 0.8rem;
            }
            h2,
            h3 {
              font-size: 140%;
              font-weight: 500;
            }
            h3 {
              margin-top: 2.5rem;
              margin-bottom: 0.6rem;
            }
            ul {
              list-style-type: none;
              li {
                margin: 1.2rem 0;
              }
            }
            > img {
              height: 4rem;
              width: auto;
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              top: -0.7rem;
            }
          `}
        >
          <Image
            src={marianne}
            alt="Iconographie officielle Marianne, symbole de la république française"
          />
          <h2>
            Quelles <BlueEm>aides publiques</BlueEm> pour une rénovation
            d'ampleur ?
          </h2>
          <ul>
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
                  <div>Usage comme résidence principale</div>
                  <small>la votre ou celle de votre locataire</small>
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
                  <DPELabel index={currentDPE} /> vers un{' '}
                  <DPEQuickSwitch oldIndex={targetDPE} prefixText={''} />
                </span>{' '}
              </label>
            </li>
          </ul>
          <h3>Pour ce bien, vous pouvez toucher :</h3>
          <EvaluationValue>
            <small>MaPrimeRénov' parcours accompagné</small>{' '}
            <div>
              Jusqu'à{' '}
              {typeof mpra === 'string' ? mpra : <p>{mpra.toString()}</p>}
            </div>
          </EvaluationValue>
          <CTAWrapper
            $justify="right"
            css={`
              margin-bottom: 0;
            `}
          >
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
                <Image src={logo} alt="Logo Mes Aides Réno" />
                <span>Faire une simulation complète</span>
              </a>
            </CTA>
          </CTAWrapper>
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
      margin-right: 1rem;
      margin-left: 0.25rem;
      height: 1rem;
      width: auto;
      vertical-align: sub;
    `}
  />
)

export const TextArea = styled.textarea`
  padding: 0.6rem;
  font-size: 110%;
  width: 25rem;
  height: 10rem;
  border: 2px solid var(--color);
  margin-right: 2rem;
`

export const EvaluationValue = styled.div`
  font-size: 150%;
  background: var(--color);
  color: #356e3e;
  background: #bef2c5;
  border: 1px solid #356e3e4d;
  padding: 1rem 2rem;
  text-align: center;
  small {
    margin-bottom: 0.4rem;
  }
`
