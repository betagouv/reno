import Link from 'next/link'
import { createExampleSituation } from './AmpleurSummary'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from '../CustomQuestionUI'
import FatConseiller from '../FatConseiller'
import QuestionsRéponses from '../mpra/QuestionsRéponses'
import { encodeDottedName } from '../publicodes/situationUtils'
import Copro from './Copro'
import Denormandie from './Denormandie'
import EcoPTZ from './EcoPTZ'
import MPRA from './MPRA'
import TaxeFoncière from './TaxeFoncière'
import { useAides } from './useAides'

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
  const aides = useAides(engine, exampleSituation) // TODO which situation

  const eligibles = aides.filter((aide) => aide.status === true)

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
          return (
            <li>
              <Link href={'#' + 'aide-' + encodeDottedName(aide.dottedName)}>
                {aide.marque || aide['complément de marque']}
              </Link>
            </li>
          )
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
            searchParams,
          }}
        />

        <EcoPTZ />

        <Copro {...{ engine, situation, searchParams }} />
        <TaxeFoncière
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
        <Denormandie
          {...{
            rules,
            oldIndex,
            choice,
            setSearchParams,
            answeredQuestions,
            engine,
            situation,
            exampleSituation,
          }}
        />
      </section>
      <FatConseiller codeInsee={situation['ménage . commune']} />
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
