import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from '../CustomQuestionUI'
import MapBehindCTA from '../MapBehindCTA'
import PaymentTypeBlock, { PaymentType } from '../PaymentTypeBlock'
import { Card, PrimeStyle } from '../UI'
import QuestionsRéponses from '../mpra/QuestionsRéponses'
import { roundToThousands } from '../utils'
import { useAides } from './useAides'
import MPRA from './MPRA'

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

  const { eligibles, nonEligibles } = useAides(engine) // TODO which situation

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

      <ul>
        {eligibles.map((aide) => {
          return <li>{aide.marque || aide['complément de marque']}</li>
        })}
      </ul>

      <section>
        <MPRA
          {...{
            oldIndex,
            choice,
            setSearchParams,
            answeredQuestions,
            engine,
            situation,
            exampleSituation,
          }}
        />
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
