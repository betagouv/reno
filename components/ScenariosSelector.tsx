import data from '@/components/DPE.yaml'
import ExplanationValue from '@/components/explications/Value'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMediaQuery } from 'usehooks-ts'
import DPELabel from './DPELabel'
import DPEQuickSwitch from './DPEQuickSwitch'
import Input from './Input'
import MapBehindCTA from './MapBehindCTA'
import { Card } from './UI'
import { compute } from './explications/Aide'
import { Key } from './explications/ExplicationUI'
import QuestionsRéponses from './mpra/QuestionsRéponses'
import { encodeSituation } from './publicodes/situationUtils'
import { omit } from './utils'

console.log('DPE data', data)

export default function ScenariosSelector({
  setSearchParams,
  situation: givenSituation,
  currentQuestion,
  answeredQuestions,
  engine,
  rules,
}) {
  const situation = omit(['projet . travaux'], givenSituation)
  const isMobile = useMediaQuery('(max-width: 800px)')

  const value = situation['projet . DPE visé'],
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

  const oldIndex = +situation['DPE . actuel'] - 1,
    possibilities = data.filter((el, index) => index <= oldIndex - 2)

  return (
    <div
      css={`
        margin-top: 0.6rem;
        h2 {
          img {
            width: 2rem;
            height: auto;
            vertical-align: bottom;
          }
          margin-bottom: 2vh;
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
      <DPEQuickSwitch oldIndex={oldIndex} />
      <p>
        Plus votre rénovation est ambitieuse, plus l’aide du parcours accompagné
        est généreuse : son montant dépend des gains de performance visés.
      </p>
      <p>
        Vous serez accompagné par un Accompagnateur Rénov’ pour vous aider à
        construire votre projet, choisir les bon travaux à engager et garantir
        leur efficacité.
      </p>
      <p
        css={`
          margin-top: 1.5vh;
          text-align: right;
          line-height: 1rem;
        `}
      >
        <small>
          <em> Sélectionnez une ligne pour évaluer votre budget. </em>
        </small>
      </p>
      <ol
        css={`
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
        `}
      >
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
                    onChange={() =>
                      doSetSearchParams('projet . DPE visé', index + 1)
                    }
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
                      situation: {
                        ...situation,
                        'projet . DPE visé': index + 1,
                      },
                      dottedName: 'MPR . accompagnée . pourcent dont bonus',
                      state: 'none',
                    }}
                  />
                  <Value
                    {...{
                      engine,
                      index,
                      situation: {
                        ...situation,
                        'projet . DPE visé': index + 1,
                      },
                      dottedName: 'projet . travaux . plafond',
                      state: 'none',
                    }}
                  />
                </label>
              </li>
            ),
        )}
      </ol>
      {oldIndex < 2 && (
        <Card
          css={`
            margin: 0.6rem 0;
          `}
        >
          👌 Votre logement est trop performant (A&nbsp;ou&nbsp;B) pour
          bénéficier du parcours accompagné.
        </Card>
      )}
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
                situation: { ...situation, 'projet . DPE visé': 0 + 1 },
                dottedName: 'MPR . accompagnée . pourcent dont bonus',
              }}
            />{' '}
            qui s'appliquera à un montant maximum de travaux de{' '}
            <Value
              {...{
                engine,
                index: 0,
                situation: { ...situation, 'projet . DPE visé': 0 + 1 },
                dottedName: 'projet . travaux . plafond',
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
                Vers un DPE <DPELabel index={choice} />
              </h3>

              <p>
                Vous engagez des travaux permettant de sauter{' '}
                <strong>{-choice + oldIndex} classes DPE</strong> : vous avez
                droit à une aide de{' '}
                <Value
                  {...{
                    engine,
                    index: choice,
                    situation: {
                      ...situation,
                      'projet . DPE visé': choice + 1,
                    },
                    dottedName: 'MPR . accompagnée . pourcent dont bonus',
                    state: 'emphasize',
                  }}
                />{' '}
                qui s'appliquera à un montant maximum de travaux de{' '}
                <Value
                  {...{
                    engine,
                    index: choice,
                    situation: {
                      ...situation,
                      'projet . DPE visé': choice + 1,
                    },
                    dottedName: 'projet . travaux . plafond',
                    state: 'emphasize',
                  }}
                />
                .
              </p>
              <div
                css={`
                  margin-top: 2.5vh;
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
                      value={situation['projet . investissement'] || undefined}
                      placeholder="votre apport"
                      onChange={(rawValue) => {
                        const value = +rawValue === 0 ? undefined : rawValue
                        setSearchParams(
                          encodeSituation({
                            'projet . investissement': value,
                          }),
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
                      situation: {
                        ...situation,
                        'projet . DPE visé': choice + 1,
                      },
                      dottedName:
                        'MPR . accompagnée . montant avant écrêtement',
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
                      situation: {
                        ...situation,
                        'projet . DPE visé': choice + 1,
                      },
                      dottedName: 'projet . travaux',
                    }}
                  />{' '}
                  HT .
                </p>
              </div>
              <section
                css={`
                  margin-top: 4vh !important;
                `}
              >
                <h4>💡 À savoir :</h4>
                <ul>
                  <li key="avance">
                    <Avance {...{ engine, rules, situation, choice }} />
                  </li>
                  <li key="écrêtement">
                    <p>
                      Le montant total de vos aides ne peut pas dépasser{' '}
                      <Value
                        {...{
                          engine,
                          choice,
                          situation: {
                            ...situation,
                            'projet . DPE visé': choice + 1,
                          },
                          dottedName:
                            "MPR . accompagnée . pourcent d'écrêtement",
                          state: 'none',
                        }}
                      />{' '}
                      de la dépense TTC (par exemple{' '}
                      <Value
                        {...{
                          engine,
                          choice,
                          situation: {
                            ...situation,
                            'projet . DPE visé': choice + 1,
                          },
                          dottedName: 'projet . travaux . TTC',
                          state: 'none',
                        }}
                      />{' '}
                      pour une TVA à 5,5 %, soit une aide maximale de{' '}
                      <Value
                        {...{
                          engine,
                          choice,
                          situation: {
                            ...situation,
                            'projet . DPE visé': choice + 1,
                          },
                          dottedName: 'MPR . accompagnée . montant',
                          state: 'none',
                        }}
                      />
                      ).
                    </p>
                  </li>
                </ul>
              </section>
            </div>
          </Card>

          <Card
            css={`
              display: flex;
              align-items: center;
              img {
                width: 4rem;
                height: auto;
                margin-right: 1rem;
              }
            `}
          >
            <Image
              src="/ptz.svg"
              alt="Icône représentant le prêt à taux zéro"
              width="10"
              height="10"
            />
            <div>
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
                    situation: {
                      ...situation,
                      'projet . DPE visé': choice + 1,
                    },
                    dottedName: 'somme à engager',
                  }}
                />{' '}
                € pour lancer les travaux, et une somme mensuelle sur une durée
                d'emprunt d'au maximum 20 ans.
              </p>
            </div>
          </Card>
        </motion.div>
      )}
      <h2>Engager la démarche</h2>
      <p>
        Avec France Rénov’, vous êtes entouré de professionnels pour affiner et
        concrétiser votre projet. Ils vous aideront à choisir entre ces
        scénarios de sauts de DPE qui ouvrent droit à la prime.
      </p>
      <h3>Vous avez des question sur les aides et les prochaines étapes ?</h3>
      <p>
        Profitez gratuitement des conseils personnalisés de votre conseiller
        local France Rénov’. Cela ne vous engage à rien. Vous pouvez également
        consulter notre FAQ en pied de page.
      </p>
      <MapBehindCTA
        {...{
          codeInsee: situation['ménage . commune']?.replace(/'/g, ''),

          what: 'trouver-conseiller-renov',
          text: 'Trouver mon conseiller',
          link: 'https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov',
        }}
      />
      <h3>Vous voulez lancer votre projet ?</h3>
      <p>
        L'<strong>accompagnateur rénov'</strong> est un interlocuteur de
        confiance agréé par l’ANAH. Il vous accompagne de bout-en-bout dans
        votre parcours de travaux en proposant un{' '}
        <AuditStyle>audit énergétique</AuditStyle>, un appui technique,
        administratif, financier et social. Il est obligatoire pour bénéficier
        de Ma Prime Rénov’ Accompagné.
      </p>

      <MapBehindCTA
        {...{
          codeInsee: situation['ménage . commune']?.replace(/'/g, ''),

          text: 'Trouver mon accompagnateur',
          link: 'https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov',
        }}
      />
      <QuestionsRéponses
        {...{
          engine,
          situation,
          oldIndex,
          choice,
        }}
      />
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
      padding-bottom: 0.15rem;
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
          situation: { ...situation, 'projet . DPE visé': choice + 1 },
          dottedName: 'MPR . accompagnée . avance',
        }}
      />
      , le reste sera un remboursement.
    </p>
  )
}

export const Value = ({ engine, situation, dottedName, state }) => {
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
