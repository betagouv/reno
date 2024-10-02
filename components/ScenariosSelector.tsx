import ExplanationValue from '@/components/explications/Value'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import DPEQuickSwitch from './DPEQuickSwitch'
import MapBehindCTA from './MapBehindCTA'
import { Card } from './UI'
import { compute } from './explications/Aide'
import { Key } from './explications/ExplicationUI'
import DPEScenario from './mpra/DPEScenario'
import QuestionsRéponses from './mpra/QuestionsRéponses'
import TargetDPETabs from './mpra/TargetDPETabs'
import { roundToThousands } from './utils'

export const getAmpleurDPEChoice = (situation) => {
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice
  return choice
}

export default function ScenariosSelector({
  setSearchParams,
  situation: givenSituation,
  currentQuestion,
  answeredQuestions,
  engine,
  rules,
  searchParams,
}) {
  console.log('indigo plop', givenSituation)
  const situation = //omit(['projet . travaux'], givenSituation)
    givenSituation

  const oldIndex = +situation['DPE . actuel'] - 1,
    choice = getAmpleurDPEChoice(situation)

  const exampleSituation = {
    'projet . travaux': roundToThousands(
      engine.evaluate('projet . enveloppe estimée').nodeValue,
      5,
    ),
    ...situation,
  }

  return (
    <CustomQuestionWrapper>
      <BtnBackToParcoursChoice
        {...{
          setSearchParams,
          situation,
          answeredQuestions,
        }}
      />
      <header>
        <small>MaPrimeRénov’ Parcours accompagné</small>
        <h2>Financer une rénovation d’ampleur de votre logement</h2>
      </header>
      <p>
        Pour bénéficier de cette aide, vous devez viser un saut d’au moins deux
        classes DPE.
      </p>
      <DPEQuickSwitch oldIndex={oldIndex} />
      <TargetDPETabs
        {...{
          oldIndex,
          setSearchParams,
          answeredQuestions,
          choice,
          engine,
          situation,
        }}
      />
      {oldIndex < 2 ? (
        <Card
          css={`
            margin: 0.6rem 0;
          `}
        >
          👌 Votre logement est trop performant (A&nbsp;ou&nbsp;B) pour
          bénéficier du parcours accompagné.
        </Card>
      ) : (
        <>
          <DPEScenario
            {...{
              rules,
              choice,
              oldIndex,
              engine,
              situation,
              setSearchParams,

              exampleSituation,
            }}
          />

          <section
            css={`
              margin-top: 2vh !important;

              header {
                display: flex;
                align-items: center;
                h4 {
                  color: #0359bf;
                  margin: 0;

                  font-weight: 500;
                }
                margin-bottom: 1.5vh !important;
              }
              ul li {
                margin: 0.6rem 0;
              }
            `}
          >
            <header>
              <Image
                src={informationIcon}
                width="25"
                css={`
                  margin-right: 0.4rem;
                `}
              />
              <h4>Informations utiles</h4>
            </header>
            <ul>
              <li>
                Un Accompagnateur Rénov’ réalisera un audit énergétique de votre
                logement pour définir le projet de travaux vous permettant
                d’atteindre le DPE visé.{' '}
                <a href="https://france-renov.gouv.fr/preparer-projet/faire-accompagner/mon-accompagnateur-renov">
                  En savoir plus
                </a>
                .
              </li>
              <li>
                <Avance
                  {...{ engine, rules, situation, choice, exampleSituation }}
                />
              </li>
              <li>
                <p>
                  Vous êtes éligible à l'
                  <a href="https://france-renov.gouv.fr/aides/eco-pret-taux-zero">
                    éco-prêt à taux zéro
                  </a>{' '}
                  pour emprunter jusqu'à 50 000 € sur 20 ans.
                </p>
              </li>
            </ul>
          </section>
        </>
      )}
      {oldIndex < 2 && null}
      <h2>Comment toucher cette aide ?</h2>
      <section>
        <p>
          Votre conseiller local France Rénov’ vous accompagne{' '}
          <strong>gratuitement</strong> pour vous guider dans les premières
          étapes de votre projet.
        </p>
        <MapBehindCTA
          {...{
            codeInsee: situation['ménage . commune']?.replace(/'/g, ''),
            searchParams,
            what: 'trouver-conseiller-renov',
            text: 'Trouver mon conseiller',
            link: 'https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov',
          }}
        />
      </section>
      <QuestionsRéponses
        {...{
          engine,
          situation,
          oldIndex,
          choice,
        }}
      />
    </CustomQuestionWrapper>
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

export const Avance = ({
  engine,
  rules,
  choice,
  situation,
  exampleSituation,
}) => {
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
      En tant que ménage au revenu{' '}
      <ExplanationValue {...{ evaluation, state: 'none' }} />, vous pourrez
      bénéficier d'une avance de <strong>70&nbsp;%</strong> de la prime, soit{' '}
      <Value
        {...{
          engine,
          choice,
          situation: { ...exampleSituation, 'projet . DPE visé': choice + 1 },
          dottedName: 'MPR . accompagnée . avance',
          state: 'final',
        }}
      />
      , le reste sera un remboursement.
    </p>
  )
}

export const Value = ({ engine, situation, dottedName, state = 'none' }) => {
  const evaluation = engine.setSituation(situation).evaluate(dottedName),
    value = formatValue(evaluation, { precision: 0 })
  const missingVariables = evaluation.missingVariables
  const missing = Object.entries(missingVariables)

  console.log('vv', value, missingVariables)

  return (
    <Key $state={state || (missing.length > 0 ? 'inProgress' : 'final')}>
      {false && missing.length > 0 ? (
        <span
          css={`
            display: inline-block;
            padding: 0 1rem;
            background: var(--lighterColor);
            border-radius: 0.3rem;
            font-weight: 300;
          `}
        >
          ... €
        </span>
      ) : (
        value
      )}
    </Key>
  )
}
