import ExplanationValue from '@/components/explications/Value'
import informationIcon from '@/public/information.svg'
import starIcon from '@/public/star-full-gold.svg'
import Image from 'next/image'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from '../CustomQuestionUI'
import DPEQuickSwitch from '../DPEQuickSwitch'
import MapBehindCTA from '../MapBehindCTA'
import PaymentTypeBlock, { PaymentType } from '../PaymentTypeBlock'
import { Card, PrimeStyle } from '../UI'
import { compute } from '../explications/Aide'
import DPEScenario from '../mpra/DPEScenario'
import QuestionsRéponses from '../mpra/QuestionsRéponses'
import TargetDPETabs from '../mpra/TargetDPETabs'
import { roundToThousands } from '../utils'
import Value from '../Value'

export default function AidesAmpleur({
  setSearchParams,
  situation: givenSituation,
  currentQuestion,
  answeredQuestions,
  engine,
  rules,
}) {
  const situation = //omit(['projet . travaux'], givenSituation)
    givenSituation

  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

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
        <h2>Financer une rénovation d’ampleur de votre logement</h2>
      </header>
      <p>Vous êtes éligibles à plusieurs aides. Elles sont cumulables.</p>

      <section>
        <header
          css={`
            > h3 {
              margin: 0;
              color: var(--darkColor0);
            }
            margin: 4vh 0 0;
            font-size: 140%;
            img {
              width: 1.3rem;
              height: auto;
              margin-right: 1rem;
            }
            display: flex;
            align-items: center;
          `}
        >
          <Image
            src={starIcon}
            alt="Icône étoile signalant le parcours recommandé"
          />
          <h3>MaPrimeRénov’ Parcours accompagné</h3>
        </header>
        <Card>
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
                    Votre conseiller local France Rénov’ vous accompagne{' '}
                    <strong>gratuitement</strong> pour vous guider dans les
                    premières étapes de votre projet.
                  </li>
                  <li>
                    Un Accompagnateur Rénov’ réalisera un audit énergétique de
                    votre logement pour définir le projet de travaux vous
                    permettant d’atteindre le DPE visé.{' '}
                    <a href="https://france-renov.gouv.fr/preparer-projet/faire-accompagner/mon-accompagnateur-renov">
                      En savoir plus
                    </a>
                    .
                  </li>
                </ul>
              </section>
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
              }}
            />
          </section>
        </Card>
        <h3>Exonération fiscale</h3>

        <Card>
          <br />
          <p>
            Vous pouvez obtenir une exonération d'impôt jusqu'à{' '}
            <PrimeStyle>23 000 €</PrimeStyle>, soit{' '}
            <PrimeStyle>1 250 € / an</PrimeStyle> sur 8 ans.
          </p>
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
                  {...{
                    engine,
                    rules,
                    situation,
                    choice,
                    exampleSituation,
                  }}
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

          <h4>Comment toucher cette aide ?</h4>
          <section>
            <p>
              Votre conseiller local France Rénov’ vous accompagne{' '}
              <strong>gratuitement</strong> pour vous guider dans les premières
              étapes de votre projet.
            </p>
            <MapBehindCTA
              {...{
                codeInsee: situation['ménage . commune']?.replace(/'/g, ''),

                what: 'trouver-conseiller-renov',
                text: 'Trouver mon conseiller',
                link: 'https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov',
              }}
            />
          </section>
          <PaymentTypeBlock>
            <p>
              Cette aide est un <PaymentType>crédit d'impôt</PaymentType>.
            </p>
          </PaymentTypeBlock>
        </Card>
      </section>
      <h3>Éco-prêt à taux zéro</h3>
      <Card>
        <p>
          Vous êtes éligible à l'
          <a href="https://france-renov.gouv.fr/aides/eco-pret-taux-zero">
            éco-prêt à taux zéro
          </a>{' '}
          pour emprunter jusqu'à 50 000 € sur 20 ans.
        </p>
      </Card>

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
      <div>
        <p>Cette aide sera un remboursement</p>
        <small> vous devrez avancer l'argent des travaux.</small>
      </div>
    )
  return (
    <ol>
      <li>
        Une avance de{' '}
        <Value
          {...{
            engine,
            choice,
            situation: { ...exampleSituation, 'projet . DPE visé': choice + 1 },
            dottedName: 'MPR . accompagnée . avance',
            state: 'final',
          }}
        />{' '}
        <span>
          (70&nbsp;%) en tant que ménage
          <ExplanationValue {...{ evaluation, state: 'none' }} />
        </span>
      </li>
      <li>
        Un remboursement de{' '}
        <Value
          {...{
            engine,
            choice,
            situation: { ...exampleSituation, 'projet . DPE visé': choice + 1 },
            dottedName: 'MPR . accompagnée . remboursement',
            state: 'final',
          }}
        />{' '}
        <span>(30&nbsp;%)</span> après les travaux
      </li>
    </ol>
  )
}