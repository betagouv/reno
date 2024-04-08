import ExplanationValue from '@/components/explications/Value'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Image from 'next/image'
import DPEQuickSwitch from './DPEQuickSwitch'
import MapBehindCTA from './MapBehindCTA'
import { Card } from './UI'
import { compute } from './explications/Aide'
import { Key } from './explications/ExplicationUI'
import QuestionsRéponses from './mpra/QuestionsRéponses'
import { omit } from './utils'
import TargetDPETabs from './mpra/TargetDPETabs'
import DPEScenario from './mpra/DPEScenario'

export default function ScenariosSelector({
  setSearchParams,
  situation: givenSituation,
  currentQuestion,
  answeredQuestions,
  engine,
  rules,
}) {
  const situation = omit(['projet . travaux'], givenSituation)

  const value = situation['projet . DPE visé'],
    choice = value ? value - 1 : null

  const oldIndex = +situation['DPE . actuel'] - 1

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
      <DPEScenario {...{ rules, choice, oldIndex, engine, situation }} />
      <h2>Engager la démarche</h2>
      <p>
        Avec France Rénov’, vous êtes entouré de professionnels pour affiner et
        concrétiser votre projet. Ils vous aideront à choisir entre ces
        scénarios de sauts de DPE qui ouvrent droit à la prime.
      </p>
      <h3>Vous avez des questions sur les aides et les prochaines étapes ?</h3>
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

      <br />
      <p>
        🪙 Pour rappel, le revenu que vous avez saisi vous classe en
        ménage&nbsp;
        <Value
          {...{
            engine,
            index: choice,
            situation: { ...situation },
            dottedName: 'ménage . revenu . classe',
            state: 'emphasize',
          }}
        />
        . Dans ce cas, l'État prend en charge jusqu'à{' '}
        <Value
          {...{
            engine,
            index: choice,
            situation: { ...situation },
            dottedName: 'MPR . accompagnée . prise en charge MAR',
            state: 'emphasize',
          }}
        />{' '}
        de la prestation de votre Accompagnateur Rénov'.
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
export const Avance = ({ engine, rules, choice, situation }) => {
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
