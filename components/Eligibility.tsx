import { No, Yes, Results } from '@/components/ResultUI'
import checkIcon from '@/public/check.svg'
import Image from 'next/image'
import { useMemo } from 'react'
import AutresAides from './AutresAides'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import PersonaBar from './PersonaBar'
import SimplifiedAmpleurSummary from './SimplifiedAmpleurSummary'
import { Avis } from './explications/Éligibilité'
import { encodeDottedName } from './publicodes/situationUtils'
import ÀlaCarteSummary from './ÀlaCarteSummary'
import AmpleurSummary from './AmpleurSummary'

export default function Eligibility({
  setSearchParams,
  situation,
  rules,
  engine,
  expanded,
  searchParams,
}) {
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

  return (
    <section>
      <PersonaBar
        startShown={searchParams.personas != null}
        selectedPersona={searchParams.persona}
      />
      <CustomQuestionWrapper>
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
            Vous n'êtes <No>pas éligible</No> à MaPrimeRénov', mais{' '}
            <Yes>vous êtes éligible</Yes> au parcours par geste via le
            dispositif CEE.
          </p>
        )}
        {!noMpr && !mpra && (
          <p>
            Vous n'êtes <No>pas éligible</No> au parcours accompagné, mais{' '}
            <Yes>vous êtes éligible</Yes> au parcours par geste (MaPrimeRénov'
            et CEE).
          </p>
        )}
        {!noMpr && !mprg && (
          <p>
            Vous êtes <Yes>éligible</Yes> au parcours accompagné, vous êtes
            aussi <Yes>éligible</Yes> au parcours par geste mais seulement via
            le dispositif CEE. Vous devez choisir l'un des deux parcours.
          </p>
        )}
        {both && (
          <>
            <p>
              Vous pouvez choisir l'un ou l'autre des parcours d'aide, mais pas
              les deux.
            </p>
            <Avis {...{ situation, engine }} />
          </>
        )}

        <Results>
          <li>
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
          <li>
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
        <AutresAides />
      </CustomQuestionWrapper>
    </section>
  )
}
