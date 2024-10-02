import Link from 'next/link'
import {
  createExampleSituation,
  getNeSaisPasEtNonEligibles,
} from './AmpleurSummary'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from '../CustomQuestionUI'
import FatConseiller from '../FatConseiller'
import QuestionsRéponses from '../mpra/QuestionsRéponses'
import { encodeDottedName } from '../publicodes/situationUtils'
import Copro from './Copro'
import Denormandie from './Denormandie'
import EcoPTZ from './EcoPTZ'
import PAR from './PAR'
import CEEAmpleur from './CEEAmpleur'
import MPRA from './MPRA'
import TaxeFoncière from './TaxeFoncière'
import { useAides } from './useAides'
import AideMAR from './AideMAR'
import StatusIcon from './StatusIcon'
import AidesLocales from './AidesLocales'
import { AideSummary } from './AideSummary'

const correspondance = {
  'MPR . accompagnée': MPRA,
  'MPR . accompagnée . prise en charge MAR': AideMAR,
  PTZ: EcoPTZ,
  PAR: PAR,
  'aides locales': AidesLocales,
  'ampleur . prime individuelle copropriété': Copro,
  'taxe foncière': TaxeFoncière,
  denormandie: Denormandie,
  "CEE . rénovation d'ampleur": CEEAmpleur,
}

export default function AidesAmpleur({
  setSearchParams,
  situation: givenSituation,
  currentQuestion,
  answeredQuestions,
  engine,
  rules,
  searchParams,
}) {
  const situation = //omit(['projet . travaux'], givenSituation)
    givenSituation

  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

  const exampleSituation = createExampleSituation(engine, situation, false)
  const extremeSituation = createExampleSituation(engine, situation, true)
  const aides = useAides(engine, extremeSituation) // TODO which situation

  const eligibles = aides.filter((aide) => aide.status === true)
  const nonEligibles = aides.filter((aide) => aide.status === false)
  const neSaisPas = aides.filter((aide) => aide.status === null)

  return (
    <CustomQuestionWrapper>
      <BtnBackToParcoursChoice
        {...{
          setSearchParams,
          situation,
          answeredQuestions,
        }}
      />
      <header
        css={`
          font-size: 100%;
        `}
      >
        <h1>Financer une rénovation d’ampleur</h1>
      </header>

      {false && ( // on pourra mettre un sommaire si besoin
        <ul>
          {eligibles.map((aide) => {
            return (
              <li>
                <Link href={'#' + 'aide-' + encodeDottedName(aide.dottedName)}>
                  {aide.marque || aide['complément de marque']}
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {eligibles.length > 0 && (
        <header
          css={`
            display: flex;
            align-items: center;
            img {
              width: 2rem;
              height: auto;
              margin-right: 0.4rem;
            }
            p {
              margin: 0;
            }
            margin: 1rem 0 0 0;
          `}
        >
          <StatusIcon status={true} />
          <p>Vous êtes éligibles à plusieurs aides. Elles sont cumulables.</p>
        </header>
      )}

      <section>
        {eligibles.map((aide) => {
          const AideComponent = correspondance[aide.baseDottedName]

          if (AideComponent)
            return (
              <AideComponent
                {...{
                  oldIndex,
                  choice,
                  setSearchParams,
                  answeredQuestions,
                  engine,
                  situation,
                  exampleSituation,
                  searchParams,
                  rules,
                }}
              />
            )
          return (
            <p>
              Composant pas trouvé pour {aide.baseDottedName} {aide.dottedName}
            </p>
          )
        })}
      </section>

      <FatConseiller situation={situation} />
      {neSaisPas.length > 0 && (
        <div title="Aides pour lesquelles nous n'avons pu déterminer votre éligibilité">
          <header
            css={`
              display: flex;
              align-items: center;
              img {
                width: 2rem;
                height: auto;
                margin-right: 0.4rem;
              }
              p {
                margin: 0;
              }
              margin: 4rem 0 0 0;
              font-size: 130%;
            `}
          >
            <h2>Aides potentielles</h2>
          </header>
          <p>
            Nous n'avons pas pu déterminer votre éligibilité à ces aides, c'est
            à vous de vous renseigner.
          </p>
          {neSaisPas.map((aide) => {
            const AideComponent = correspondance[aide.baseDottedName]

            console.log('yellow', AideComponent)

            if (AideComponent)
              return (
                <AideComponent
                  {...{
                    oldIndex,
                    choice,
                    setSearchParams,
                    answeredQuestions,
                    engine,
                    situation,
                    exampleSituation,
                    searchParams,
                    rules,
                  }}
                />
              )
            return (
              <p>
                Composant pas trouvé pour {aide.baseDottedName}{' '}
                {aide.dottedName}
              </p>
            )
            return (
              <AideSummary
                key={aide.dottedName}
                {...{
                  ...aide,
                  icon: aide.icône,
                  text,
                  text2,
                  type: aide.type,
                  expanded: false,
                  small: true,
                }}
              />
            )
          })}
        </div>
      )}
      {nonEligibles.length > 0 && (
        <div title="Aides auxquelles vous n'êtes pas éligible">
          <header
            css={`
              display: flex;
              align-items: center;
              img {
                width: 2rem;
                height: auto;
                margin-right: 0.4rem;
              }
              p {
                margin: 0;
              }
              margin: 4rem 0 0 0;
              font-size: 130%;
            `}
          >
            <h2>Aides non disponibles</h2>
          </header>
          <p>
            Nous avons déterminé que vous n'êtes pas éligible à ces aides. Si
            vous avez un doute, n'hésitez pas à contacter gratuitement votre
            conseiller France Rénov'.
          </p>
          <br />
          {nonEligibles.map((aide) => {
            const text = aide.marque,
              text2 = aide['complément de marque']
            return (
              <AideSummary
                key={aide.dottedName}
                {...{
                  ...aide,
                  icon: aide.icône,
                  text,
                  text2,
                  type: aide.type,
                  expanded: false,
                  small: true,
                }}
              />
            )
          })}
        </div>
      )}

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
