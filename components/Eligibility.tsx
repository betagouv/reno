import { No, Results, Yes } from '@/components/ResultUI'
import checkIcon from '@/public/check.svg'
import Image from 'next/image'
import { useMemo } from 'react'
import AmpleurSummary from './ampleur/AmpleurSummary'
import AutresAides from './AutresAides'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import PersonaBar from './PersonaBar'
import { Avis } from './explications/Éligibilité'
import { encodeDottedName } from './publicodes/situationUtils'
import ÀlaCarteSummary from './ÀlaCarteSummary'
import Answers from '@/app/simulation/Answers'
import { useIsCompact } from './useIsInIframe'
import Feedback from '@/app/contact/Feedback'

export default function Eligibility({
  setSearchParams,
  situation,
  rules,
  engine,
  answeredQuestions,
  nextQuestions,
  currentQuestion,
  expanded,
  searchParams,
}) {
  const isCompact = useIsCompact()
  const nextLink = (value) => {
    const url = setSearchParams(
      {
        [encodeDottedName("parcours d'aide")]: `"${encodeDottedName(value)}"*`,
      },
      'url',
      false,
    )
    return url
  }

  const [mpraEvaluation, mprgEvaluation, ceeConditionsEvaluation] =
      useMemo(() => {
        const newEngine = engine.setSituation(situation)
        return [
          newEngine.evaluate('MPR . accompagnée . éligible'),
          newEngine.evaluate('MPR . non accompagnée . éligible'),
          newEngine.evaluate('CEE . conditions'),
        ]
      }, [situation, engine]),
    mpra = mpraEvaluation.nodeValue,
    mprg = mprgEvaluation.nodeValue,
    ceeConditions = ceeConditionsEvaluation.nodeValue

  const both = mpra && mprg,
    noMpr = !mpra && !mprg,
    some = mpra || mprg || ceeConditions

  const showPersonaBar = searchParams.personas != null
  return (
    <section
      css={`
        ${showPersonaBar && `margin-top: 4rem`}
      `}
    >
      <PersonaBar
        startShown={showPersonaBar}
        selectedPersona={searchParams.persona}
        engine={engine}
      />
      <CustomQuestionWrapper>
        {isCompact && (
          <Answers
            {...{
              answeredQuestions,
              nextQuestions,
              currentQuestion,
              rules,
              situation,
            }}
          />
        )}
        <header>
          <small>Découvrez vos aides</small>
          <h2>
            {some ? (
              <span
                css={`
                  display: flex;
                  align-items: center;
                  img {
                    margin-right: 0.4rem;
                    width: 1.8rem;
                    height: auto;
                  }
                `}
              >
                <Image src={checkIcon} alt="Icône case cochée" /> Bonne nouvelle
                !
              </span>
            ) : (
              'Votre éligibilité'
            )}
          </h2>
        </header>
        {noMpr && !ceeConditions && (
          <p>
            Nous n'avons <No>pas trouvé d'aide</No> à laquelle vous êtes
            éligible, mais vous pouvez explorer les aides listées ci-dessous qui
            ne sont pas encore calculées par Mes Aides Réno.
          </p>
        )}
        {noMpr && ceeConditions && (
          <p>
            <Yes>
              <a href="#parcours-gestes">Vous êtes éligible</a>
            </Yes>{' '}
            au parcours par geste via le dispositif CEE.
            <br />
            Cependant, vous n'êtes{' '}
            <No>
              <a href="#parcours-ampleur">pas éligible</a>
            </No>{' '}
            à MaPrimeRénov'.
          </p>
        )}
        {!noMpr && !mpra && (
          <p>
            <Yes>
              <a href="#parcours-gestes">Vous êtes éligible</a>
            </Yes>{' '}
            au parcours par geste (MaPrimeRénov' et CEE).
            <br />
            Cependant, vous n'êtes{' '}
            <No>
              <a href="#parcours-ampleur">pas éligible</a>
            </No>{' '}
            au parcours accompagné.
          </p>
        )}
        {!noMpr && !mprg && (
          <p>
            Vous êtes{' '}
            <Yes>
              <a href="#parcours-ampleur">éligible</a>
            </Yes>{' '}
            au parcours accompagné, vous êtes aussi{' '}
            <Yes>
              <a href="#parcours-gestes">éligible</a>
            </Yes>{' '}
            au parcours par geste mais seulement via le dispositif CEE. Vous
            devez choisir l'un des deux parcours.
          </p>
        )}
        {both && (
          <>
            <p>
              Vous êtes <Yes>éligible</Yes> au <Yes>deux</Yes> parcours d'aide.
              Vous devez en choisir un.
            </p>
            <Avis {...{ situation, engine }} />
          </>
        )}

        <Results>
          <li id="parcours-ampleur">
            <AmpleurSummary
              {...{
                engine,
                url: nextLink('ampleur'),
                situation,
                expanded,
                setSearchParams,
              }}
            />
          </li>
          <li id="parcours-gestes">
            <ÀlaCarteSummary
              {...{
                engine,
                rules,
                url: nextLink('à la carte'),
                situation,
              }}
            />
          </li>
        </Results>
        <Feedback title="Avez-vous bien compris les deux parcours d'éligibilité ?" />
        <AutresAides />
      </CustomQuestionWrapper>
    </section>
  )
}
