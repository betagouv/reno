import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import DPEScenario from '@/components/mpra/DPEScenario'
import TargetDPETabs from '@/components/mpra/TargetDPETabs'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
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
    <AideAmpleur dottedName={'taxe foncière'}>
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
        <AideCTA text="Obtenir l'exonération">
          <p>
            Vous devez adresser au service des impôts correspondant au lieu de
            situation du bien, avant le 1 er janvier de la première année au
            titre de laquelle l’exonération est applicable, une déclaration
            comportant tous les éléments d’identification du bien, dont la date
            d’achèvement du logement.
          </p>
          <a href="https://www.impots.gouv.fr/particulier/questions/ai-je-droit-pour-ma-taxe-fonciere-lexoneration-en-faveur-des-economies">
            Plus d'infos sur impots.gouv.fr
          </a>
        </AideCTA>
      </div>
    </AideAmpleur>
  )
}
