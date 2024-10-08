import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import DPEScenario from '@/components/mpra/DPEScenario'
import TargetDPETabs from '@/components/mpra/TargetDPETabs'
import AideAmpleur, { InformationBlock } from './AideAmpleur'
import { Card } from '../UI'
import PaymentTypeBlock from '../PaymentTypeBlock'
import Avance from '@/components/mpra/Avance'
import MapBehindCTA from '../MapBehindCTA'
import rules from '@/app/règles/rules'
import AideCTAs from './AideCTAs'

export default function MPRA({
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  exampleSituation,
  searchParams,
  expanded
}) {
  const dottedName = 'MPR . accompagnée'
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice
  return (
    <AideAmpleur {...{
      dottedName, 
      setSearchParams,
      situation,
      answeredQuestions,
      exampleSituation,
      expanded
    }}>
      <p>C'est la principal aide. Elle est versée après vos travaux de rénovation.</p>
      <p>Vous devez viser un saut d’au moins deux classes DPE.</p>
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
          { expanded && (
            <>
              <InformationBlock>
                <div
                  dangerouslySetInnerHTML={{
                    __html: rules[dottedName].informationsUtilesHtml,
                  }}
                />
              </InformationBlock>
              <PaymentTypeBlock>
                <Avance
                  {...{
                    engine,
                    rules,
                    situation,
                    choice,
                    exampleSituation,
                  }}
                />
              </PaymentTypeBlock> 
              <section>
                <MapBehindCTA
                  {...{
                    situation,
                    searchParams,
                    what: 'trouver-conseiller-renov',
                    text: 'Obtenir cette aide',
                    importance: 'secondary',
                  }}
                />
              </section>
            </>
          )}
        </>
      )}
    </AideAmpleur>
  )
}
