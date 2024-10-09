import Link from 'next/link'
import {
  createExampleSituation,
  getNeSaisPasEtNonEligibles,
} from './AmpleurSummary'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from '../CustomQuestionUI'
import FatConseiller from '../FatConseiller'
import QuestionsRéponses from '../mpra/QuestionsRéponses'
import { encodeDottedName, encodeSituation, getSituation } from '../publicodes/situationUtils'
import { useAides } from './useAides'
import { AideSummary } from './AideSummary'
import { Key } from '../explications/ExplicationUI'
import { omit } from '@/components/utils'
import { Card, CTA, CTAWrapper } from '../UI'
import VoirSynthese from './VoirSynthese'

export default function AidesAmpleur({
  setSearchParams,
  situation: givenSituation,
  answeredQuestions,
  engine,
  rules,
  searchParams,
  correspondance
}) {

  
  const situation = //omit(['projet . travaux'], givenSituation)
    givenSituation

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
          situation: omit(["parcours d'aide"], situation),
          answeredQuestions,
        }}
      />
      
      <header>
        <small>Aides disponibles</small>
        <h2 css={`
          font-size: 120%;
          margin: 0.5rem 0 !important;
        `}>
          Financer une rénovation d’ampleur
        </h2>
      </header>
      {false && ( // on pourra mettre un sommaire si besoin
        <ul>
          {eligibles.map((aide) => {
            return (
              <li key={aide.dottedName}>
                <Link href={'#' + 'aide-' + encodeDottedName(aide.dottedName)}>
                  {aide.marque || aide['complément de marque']}
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {eligibles.length > 0 && (
        <p
          css={`
            margin: 1rem 0 0 0;
            em {
              min-width: 0;
            }
          `}
        >
          Vous êtes éligible à <Key $state={'final'}>{eligibles.length}</Key> dispositifs cumulables entre eux :
        </p>
      )}

      <section>
        {eligibles.map((aide) => {
          const AideComponent = correspondance[aide.baseDottedName]
          if (AideComponent)
            return (
              <AideComponent
                key={aide.baseDottedName}
                {...{
                  dottedName: aide.baseDottedName,
                  setSearchParams,
                  answeredQuestions,
                  engine,
                  situation,
                  exampleSituation,
                  searchParams,
                  rules,
                  expanded: false
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
      <VoirSynthese {...{
          answeredQuestions,
          searchParams, 
          setSearchParams
        }} 
      />
      {neSaisPas.length > 0 && (
        <div title="Aides pour lesquelles nous n'avons pu déterminer votre éligibilité">
          <header
            css={`
              display: flex;
              align-items: center;
              margin: 2rem 0 0 0;
            `}
          >
            <small>Aides potentielles</small>
          </header>
          <p>
            Nous n'avons pas pu déterminer votre éligibilité à ces aides, c'est
            à vous de vous renseigner.
          </p>
          {neSaisPas.map((aide) => {
            const AideComponent = correspondance[aide.baseDottedName]

            if (AideComponent)
              return (
                <AideComponent
                  key={aide.dottedName}
                  {...{
                    dottedName: aide.dottedName,
                    setSearchParams,
                    answeredQuestions,
                    engine,
                    situation,
                    exampleSituation,
                    searchParams,
                    rules,
                    expanded: false
                  }}
                />
              )
            return (
              <p>
                Composant pas trouvé pour {aide.baseDottedName}{' '}
                {aide.dottedName}
              </p>
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
              margin: 2rem 0 0 0;
            `}
          >
            <small>Aides non disponibles</small>
          </header>
          <p>
            Nous avons déterminé que vous n'êtes pas éligible à ces aides. Si
            vous avez un doute, n'hésitez pas à contacter gratuitement votre
            conseiller France Rénov'.
          </p>
          <Card>
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
          </Card>
        </div>
      )}
      <div>
        <h3>Comment toucher ces aides ?</h3>
        <p>Un conseiller France Rénov' peut répondre à vos questions et vous guider dans votre choix. C'est 100% gratuit !</p>        
        <FatConseiller situation={situation} margin="small" />
      </div>

      {/* <QuestionsRéponses
        {...{
          engine,
          situation
        }}
      /> */}
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
