import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import DPEScenario from '@/components/mpra/DPEScenario'
import TargetDPETabs from '@/components/mpra/TargetDPETabs'
import AideAmpleur, { InformationBlock } from './AideAmpleur'
import { Card } from '../UI'
import PaymentTypeBlock from '../PaymentTypeBlock'
import Avance from '@/components/mpra/Avance'
import MapBehindCTA from '../MapBehindCTA'
import rules from '@/app/règles/rules'

export default function MPRA({
  oldIndex,
  choice,
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  exampleSituation,
}) {
  return (
    <AideAmpleur dottedName={'MPR . accompagnée'}>
      <div>
        <p>
          Pour bénéficier de cette aide, vous devez viser un saut d’au moins
          deux classes DPE.
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

            <InformationBlock>
              <li>
                Votre conseiller local France Rénov’ vous accompagne{' '}
                <strong>gratuitement</strong> pour vous guider dans les
                premières étapes de votre projet.
              </li>
              <li>
                Un Accompagnateur Rénov’ réalisera un audit énergétique de votre
                logement pour définir le projet de travaux vous permettant
                d’atteindre le DPE visé.{' '}
                <a href="https://france-renov.gouv.fr/preparer-projet/faire-accompagner/mon-accompagnateur-renov">
                  En savoir plus
                </a>
                .
              </li>
            </InformationBlock>
          </>
        )}
        {oldIndex < 2 && null}
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
              codeInsee: situation['ménage . commune']?.replace(/'/g, ''),

              what: 'trouver-conseiller-renov',
              text: 'Obtenir cette aide',
              link: 'https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov',
              importance: 'secondary',
            }}
          />
        </section>
      </div>
    </AideAmpleur>
  )
}
