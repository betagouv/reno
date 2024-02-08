'use client'
import DPE from './DPE2'
import { encodeSituation } from './publicodes/situationUtils'
import data from '@/components/DPE.yaml'
import css from './css/convertToJs'
import DPELabel from './DPELabel'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import ExplanationValue from '@/components/explications/Value'
import { compute } from './explications/Aide'
import { Card, CTA, CTAWrapper } from './UI'
import Image from 'next/image'
import Link from 'next/link'
import Input from './Input'
import styled from 'styled-components'
import { useState } from 'react'
import dpeData from '@/components/DPE.yaml'
import { Key } from './explications/ExplicationUI'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'usehooks-ts'

console.log('DPE data', data)

export default function ScenariosSelector({
  setSearchParams,
  situation,
  currentQuestion,
  answeredQuestions,
  engine,
  rules,
}) {
  const isMobile = useMediaQuery('(max-width: 800px)')
  const numericalValue = situation[currentQuestion]

  const value = situation['DPE . visé'],
    choice = value ? value - 1 : null

  const doSetSearchParams = (question, value) => {
    const newSituation = encodeSituation(
      {
        ...situation,
        [question]: value,
      },
      false,
      answeredQuestions,
    )
    console.log('girafe', newSituation)
    setSearchParams(newSituation, 'push')
  }
  const isNew = currentQuestion === 'DPE . visé' ? numericalValue : null,
    newLetter = numericalValue && data[+numericalValue - 1].lettre,
    oldLetter = isNew && data[+situation['DPE . actuel'] - 1].lettre

  const oldIndex = +situation['DPE . actuel'] - 1,
    possibilities = data.filter((el, index) => index <= oldIndex - 2)

  const mprg = engine.evaluate('MPR . non accompagnée').nodeValue
  return (
    <div
      css={`
        margin-top: 0.6rem;
        ol {
          margin-top: 1vh;
          list-style-type: none;
          padding: 0;
          border: 1px solid var(--lighterColor0);
          border-radius: 0.3rem;
          li {
            padding: 1.2rem 1vw;
            border-bottom: 1px solid var(--lighterColor0);
            label {
              display: flex;
              justify-content: space-evenly;
              cursor: pointer;
            }
          }
          li:first-child {
            background: var(--lightestColor);
            padding: 0.4rem 1vw;
            font-size: 90%;
            display: flex;
            justify-content: space-evenly;
          }
          li:last-child {
            margin-bottom: 0;
            border-bottom: none;
          }
        }
        h2 {
          img {
            width: 2rem;
            height: auto;
            vertical-align: bottom;
          }
        }
      `}
    >
      <h2>
        <Image
          src="/check.svg"
          width="10"
          height="10"
          alt="Icône case cochée"
        />{' '}
        Vous êtes éligible à MaPrimeRénov' Parcours accompagné
      </h2>
      <p>
        Plus votre rénovation est ambitieuse, plus l’aide est généreuse : le
        montant de l'aide dépend des gains de performance visés.
      </p>
      <p
        css={`
          text-align: right;
          line-height: 1rem;
        `}
      >
        <em> Sélectionnez une ligne pour évaluez votre budget. </em>
      </p>
      <ol>
        <li key="en-tête">
          {isMobile ? <span>Choix</span> : <span>Votre choix</span>}
          <span>Sauts de DPE</span>
          <span>Aide</span>
          {isMobile ? (
            <span>Assiette max.</span>
          ) : (
            <span>Assiette maximum de l'aide</span>
          )}
        </li>
        {possibilities.map(
          (el, index) =>
            console.log('index', index) || (
              <li
                key={el.lettre}
                css={choice === index ? `background: var(--lighterColor2)` : ``}
              >
                <label>
                  <input
                    css={`
                      width: 1.4rem;
                      height: 1.4rem;
                      cursor: pointer;
                      margin-right: 0.4rem;
                    `}
                    type="radio"
                    name={index}
                    checked={index === choice}
                    onChange={() => doSetSearchParams('DPE . visé', index + 1)}
                  />
                  <span>
                    <DPELabel index={oldIndex} />{' '}
                    <span
                      css={`
                        position: relative;
                      `}
                    >
                      <small
                        css={`
                          position: absolute;
                          left: 40%;
                          top: -0.3rem;
                          transform: translateX(-50%);
                          color: #555;
                          font-size: 70%;
                          line-height: 1rem;
                        `}
                      >
                        +{-index + oldIndex}
                      </small>
                      {'⟶ '}
                    </span>
                    <DPELabel index={index} />{' '}
                  </span>
                  <Value
                    {...{
                      engine,
                      index,
                      situation: { ...situation, 'DPE . visé': index + 1 },
                      dottedName: 'MPR . accompagnée . pourcent écrêté',
                      state: 'none',
                    }}
                  />
                  <Value
                    {...{
                      engine,
                      index,
                      situation: { ...situation, 'DPE . visé': index + 1 },
                      dottedName: 'travaux . plafond',
                      state: 'none',
                    }}
                  />
                </label>
              </li>
            ),
        )}
      </ol>
      {false && (
        <p
          css={`
            line-height: 1.2rem;
            text-align: center;
            max-width: 40rem;
            margin: 0 auto;
            margin-top: 0.4rem;
          `}
        >
          <em>
            Lecture : pour {oldIndex} sauts de DPE, vous pouvez demander une
            aide de{' '}
            <Value
              {...{
                engine,
                index: 0,
                situation: { ...situation, 'DPE . visé': 0 + 1 },
                dottedName: 'MPR . accompagnée . pourcent écrêté',
              }}
            />{' '}
            qui s'appliquera à un montant maximum de travaux de{' '}
            <Value
              {...{
                engine,
                index: 0,
                situation: { ...situation, 'DPE . visé': 0 + 1 },
                dottedName: 'travaux . plafond',
              }}
            />
            .
          </em>
        </p>
      )}
      {choice != null && (
        <motion.div
          initial={{ x: -30, scale: 1 }}
          animate={{ x: 0, scale: 1 }}
          key={choice}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 20,
          }}
        >
          <Card
            css={`
              background: var(--lighterColor2);
              padding: 1rem;
              margin: 1rem auto;
              text-align: center;
              input {
                width: 8rem; /* width of "votre apport"*/
                height: 1.6rem !important;
                text-align: right;
                margin-left: 0.2rem;
              }
              max-width: 100%;
              img {
                width: 3.5rem;
                height: auto;
                margin-right: 1rem;
              }
              display: flex;
              align-items: center;
              justify-content: space-evenly;
              flex-wrap: wrap;
            `}
          >
            <Image
              src="/investissement.svg"
              width="30"
              height="30"
              alt="Icône représentant votre apport personnel qui sera complété par les aides"
            />
            <div
              css={`
                text-align: left;
                max-width: 40rem;
                p {
                  margin: 0.6rem 0;
                }
              `}
            >
              <h3>
                Scénario <DPELabel index={choice} />
              </h3>

              <p>
                Vous engagez des travaux permettant de sauter{' '}
                <strong>{-choice + oldIndex} classes DPE</strong> : vous avez
                droit à une aide de{' '}
                <Value
                  {...{
                    engine,
                    index: choice,
                    situation: { ...situation, 'DPE . visé': choice + 1 },
                    dottedName: 'MPR . accompagnée . pourcent écrêté',
                    state: 'emphasize',
                  }}
                />{' '}
                qui s'appliquera à un montant maximum de travaux de{' '}
                <Value
                  {...{
                    engine,
                    index: choice,
                    situation: { ...situation, 'DPE . visé': choice + 1 },
                    dottedName: 'travaux . plafond',
                    state: 'emphasize',
                  }}
                />
                .
              </p>
              <div
                css={`
                  border-left: 8px solid var(--lighterColor0);
                  padding-left: 0.8rem;
                  label {
                    white-space: nowrap;
                  }
                `}
              >
                <p>
                  Par exemple : avec un apport personnel de{' '}
                  <label>
                    <Input
                      autoFocus={false}
                      value={situation['investissement'] || undefined}
                      placeholder="votre apport"
                      onChange={(value) => {
                        console.log('vava', value)
                        setSearchParams(
                          {
                            investissement: value,
                          },
                          'replace',
                          false,
                        )
                      }}
                      step="100"
                    />
                    &nbsp;€
                  </label>
                  <span>, vous pourrez obtenir une aide de </span>
                  <Value
                    {...{
                      engine,
                      choice,
                      situation: { ...situation, 'DPE . visé': choice + 1 },
                      dottedName: 'MPR . accompagnée . montant',
                    }}
                  />
                  .
                </p>
                <p>
                  Votre budget total pour réaliser des travaux sera alors de{' '}
                  <Value
                    {...{
                      engine,
                      choice,
                      situation: { ...situation, 'DPE . visé': choice + 1 },
                      dottedName: 'travaux',
                    }}
                  />
                  .
                </p>
              </div>
              <Avance {...{ engine, rules, situation, choice }} />
              <p>
                En cas de besoin, un éco-prêt à taux zéro vous permet
                d'emprunter 50 000 €.
              </p>
              <p>
                Avec ce prêt, vous devrez avoir à disposition{' '}
                <Value
                  {...{
                    engine,
                    choice,
                    situation: { ...situation, 'DPE . visé': choice + 1 },
                    dottedName: 'somme à engager',
                  }}
                />{' '}
                € pour lancer les travaux.
              </p>
            </div>
          </Card>
        </motion.div>
      )}
      <h2>Je n'arrive pas à me décider</h2>
      <p>
        C'est normal : si vous n'êtes pas encore entouré de professionnels pour
        concrétiser la rénovation en chiffres (coûts et gains), il est difficile
        de choisir entre ces scénarios de sauts qui ouvrent droit à la prime.
      </p>
      <p>
        Bonne nouvelle : l'accompagnement fait partie intégrante de la prime :
        votre <strong>Accompagnateur Rénov'</strong> fera un{' '}
        <AuditStyle>audit énergétique</AuditStyle> de votre logement et vous
        aidera à choisir parmi les scénarios de travaux.
      </p>
      <p>
        <strong></strong>
      </p>
      <h2>À savoir</h2>
      <p>
        Outre les sauts de classe, votre projet de rénovation devra respecter
        les conditions suivantes :
      </p>
      <ul>
        <li>
          Il est obligatoire de réaliser au moins deux gestes d’isolation (murs,
          fenêtres / menuiserie, sols ou toiture).{' '}
        </li>
        <li>
          Il est impossible d’installer un chauffage fonctionnant
          majoritairement aux énergies fossiles (par ex. chaudière à gaz) ou de
          conserver un chauffage fonctionnant au fioul ou au charbon.
        </li>
        <li>
          Vos artisans doivent être{' '}
          <a
            href="https://www.ecologie.gouv.fr/label-reconnu-garant-lenvironnement-rge"
            target="_blank"
          >
            certifiés RGE
          </a>
          .
        </li>
      </ul>
      <div
        css={`
          border: 1px solid var(--lighterColor);
          padding: 4vh 4vw;
          margin: 4vh 0;
          details:first-child summary {
            border-top: 1px solid var(--lighterColor);
          }
          details {
            summary {
              font-size: 130%;
              color: var(--color);
              border-bottom: 1px solid var(--lighterColor);
              padding: 0.8rem;
            }
            p {
              padding: 1rem;
              border-top: none;
            }
          }
        `}
      >
        <details>
          <summary open={false}>Quelle est la procédure ?</summary>
          <p>À remplir</p>
        </details>
        <details>
          <summary open={false}>Quels sont les délais ?</summary>
          <p>À remplir</p>
        </details>
        <details>
          <summary open={false}>Y a-t-il des aides locales ?</summary>
          <p>
            En fonction de la localisation de votre bien ou de votre ménage,
            vous pouvez être éligibles à des aides locales qui se cumulent aux
            aides nationales.{' '}
          </p>
          <p>
            Nous ne proposons pas encore le calcul de ces aides, il faudra aller
            vous renseigner{' '}
            <a href="https://www.anil.org/aides-locales-travaux/">en ligne</a>{' '}
            ou auprès d'un conseiller d'une agence locale.
          </p>
        </details>
        <details>
          <summary open={false}>C'est trop ambitieux pour moi</summary>
          <p>
            Le parcours accompagné de MaPrimeRénov exige en effet un minimum de
            deux sauts de DPE, en échange d'un montant d'aide important.
          </p>
          {mprg ? (
            <p>
              Bonne nouvelle, vous êtes également éligible au parcours par geste
              de MaPrimeRénov'. Vous pouvez{' '}
              <Link
                href={setSearchParams(
                  { objectif: 'MPR . non accompagnée' },
                  'url',
                )}
              >
                découvrir le parcours par geste
              </Link>
              .
            </p>
          ) : (
            <p>
              Vous n'êtes pas éligible au parcours par geste de MaPrimeRénov'.
              Sous certaines conditions, vous pourriez cependant avoir accès à
              l'
              <a href="https://www.ecologie.gouv.fr/eco-pret-taux-zero-eco-ptz">
                éco-prêt à taux zéro (PTZ)
              </a>
              .
            </p>
          )}
        </details>
      </div>
      <h2>C'est parti ?</h2>
      <p>
        Vous pouvez maintenant contacter un conseiller France Rénov'. Cela ne
        vous engage à rien.
      </p>
      <CTAWrapper>
        <CTA>
          {' '}
          <Link href="https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov">
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
              Trouver mon conseiller
            </span>
          </Link>
        </CTA>
      </CTAWrapper>
    </div>
  )
}

const AuditStyle = ({ children }) => (
  <span
    css={`
      width: 6rem;
      position: relative;
      background: linear-gradient(to right, #eb8235, #52b153);
      padding: 0;
      padding-bottom: 0.3rem;
      > span {
        background: white;
        color: black;
        padding: 0 0.3rem;
      }
    `}
  >
    <span>{children}</span>
  </span>
)
const Avance = ({ engine, rules, choice, situation }) => {
  const evaluation = compute('ménage . revenu . classe', engine, rules)
  if (!['modeste', 'très modeste'].includes(evaluation.value))
    return (
      <p>
        Votre prime rénov sera un remboursement : vous devrez avancer l'argent
        des travaux.
      </p>
    )
  return (
    <p>
      En tant que ménage au revenu <ExplanationValue {...{ evaluation }} />,
      vous pourrez bénéficier d'une avance de <strong>70 %</strong> de la prime,
      soit{' '}
      <Value
        {...{
          engine,
          choice,
          situation: { ...situation, 'DPE . visé': choice + 1 },
          dottedName: 'MPR . accompagnée . avance',
        }}
      />
      , le reste sera un remboursement.
    </p>
  )
}

const Value = ({ engine, index, situation, dottedName, state }) => {
  const evaluation = engine.setSituation(situation).evaluate(dottedName),
    value = formatValue(evaluation, { precision: 0 })
  const missingVariables = evaluation.missingVariables
  const missing = Object.entries(missingVariables)

  return (
    <Key $state={state || (missing.length > 0 ? 'inProgress' : 'final')}>
      {missing.length > 0 ? '...' : value}
    </Key>
  )
}
