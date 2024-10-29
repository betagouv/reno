import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import DPEScenario from '@/components/mpra/DPEScenario'
import TargetDPETabs from '@/components/mpra/TargetDPETabs'
import AideAmpleur from './AideAmpleur'
import { Card } from '../UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import Value from '../Value'
import DPELabel from '../DPELabel'
import { Key } from '../explications/ExplicationUI'
import { Écrêtement } from '@/components/explications/Écrêtement'

export default function MPRA({
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  exampleSituation,
  expanded,
}) {
  const dottedName = 'MPR . accompagnée'
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

  const revenuClasseValue = engine
    .setSituation(situation)
    .evaluate('ménage . revenu . classe').nodeValue

  const isModeste = revenuClasseValue.includes('modeste')

  return (
    <AideAmpleur
      {...{
        engine,
        dottedName,
        setSearchParams,
        situation,
        answeredQuestions,
        expanded,
      }}
    >
      <DPEQuickSwitch oldIndex={oldIndex} situation={situation} />.
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
              expanded,
            }}
          />
          {isModeste && (
            <div
              css={`
                background: #fdf8db;
                padding: 1rem;
                margin: 1rem 0;
              `}
            >
              🍀 <strong>Bonus :</strong> En tant que ménage{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'ménage . revenu . classe',
                  state: 'prime-black',
                }}
              />{' '}
              , <strong>70 %</strong> de cette aide peut vous être versée en
              avance de vos travaux.
            </div>
          )}
          {expanded && (
            <>
              <h3>Comment est calculée l'aide ?</h3>
              <p>
                Vous êtes éligible à une aide de{' '}
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName: 'MPR . accompagnée . pourcent brut',
                    state: 'prime-black',
                  }}
                />{' '}
                du coût de vos travaux avec un plafond de{' '}
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName: 'projet . travaux . plafond',
                    state: 'prime-black',
                  }}
                />{' '}
                de travaux.
              </p>
              <p>
                Une bonification de <Key state="prime-black">10 %</Key> s'ajoute
                à ce taux si votre logement est une passoire énergétique
                (logements avec une étiquette <DPELabel index="5" /> ou{' '}
                <DPELabel index="6" />) et que le programme de travaux vous
                permet d’atteindre une étiquette <DPELabel index="3" /> au
                minimum.
              </p>
              <Écrêtement {...{ engine, rules, situation }} />
              <h3>Les principales conditions d'éligibilité ?</h3>
              <div
                css={`
                  list-style-image: url(${checkIcon.src});
                  li {
                    margin: 1rem 0;
                    ul {
                      list-style-image: none;
                    }
                  }
                `}
                dangerouslySetInnerHTML={{
                  __html: rules[dottedName].conditionsEligibilitesHTML,
                }}
              />
            </>
          )}
        </>
      )}
    </AideAmpleur>
  )
}
