'use client'
import rules from '@/app/règles/rules'
import DPELabel from '@/components/DPELabel'
import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import { CTA, InternalLink } from '@/components/UI'
import { createExampleSituation } from '@/components/ampleur/AmpleurSummary'
import useSyncAmpleurSituation from '@/components/ampleur/useSyncAmpleurSituation'
import { enrichSituationWithConstructionYear } from '@/components/personas/enrichSituation'
import useEnrichSituation from '@/components/personas/useEnrichSituation'
import {
  encodeDottedName,
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import electriciteIcon from '@/public/chauffage.svg'
import logo from '@/public/logo.svg'
import { DOMParser } from 'xmldom'
import * as xpath from 'xpath'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { Labels } from '../LandingUI'
import { Title } from '../LayoutUI'
import AmpleurCTA from './AmpleurCTA'
import { EvaluationValue, EvaluationValueWrapper } from './AmpleurEvaluation'
import { ampleurQuestionsAnswered, usageLogementValues } from './AmpleurInputs'
import {
  IdFQuestion,
  Li,
  PersonnesQuestion,
  QuestionList,
  RevenuQuestion,
  TypeResidence,
} from './AmpleurQuestions'
import { AmpleurWrapper } from './AmpleurUI'
import UserData from './UserData'
import data from '@/components/DPE.yaml'
import { format } from '../couts/Geste'
import { Key } from '@/components/explications/ExplicationUI'
import { Select } from '@/components/InputUI'
import { userInputDottedNames } from './AmpleurInputs'
import { omit } from '@/components/utils'

const engine = new Publicodes(rules)

export default function Ampleur() {
  const [montantFactureActuelle, setMontantFactureActuelle] = useState(null)
  const [montantFactureEstime, setMontantFactureEstime] = useState(null)
  const [selectedDpe, setSelectedDpe] = useState(null)
  const [currentDPE, setCurrentDPE] = useState(null)
  const [targetDPE, setTargetDPE] = useState(null)
  const [dpeList, setDpeList] = useState([])
  const setSearchParams = useSetSearchParams()
  const isMobile = useMediaQuery('(max-width: 400px)')

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const { persona: selectedPersona = 0, ...situationSearchParams } =
    searchParams

  const rawUserSituation = getSituation(situationSearchParams, rules)

  const userSituation = useMemo(
    () => enrichSituationWithConstructionYear(rawUserSituation, engine),
    [rawUserSituation],
  )

  const answeredQuestionsFromUrl = getAnsweredQuestions(
    situationSearchParams,
    rules,
  )
  const answeredSituation = Object.fromEntries(
    answeredQuestionsFromUrl.map((dottedName) => [
      dottedName,
      userSituation[dottedName],
    ]),
  )

  const savedSituation = useSyncAmpleurSituation(answeredSituation)

  const answeredQuestions = savedSituation
    ? Object.keys(savedSituation)
    : answeredQuestionsFromUrl

  //const currentDPE = +userSituation['DPE . actuel']
  // const targetDPE =
  //   +userSituation['projet . DPE visé'] || Math.max(currentDPE - 2, 1)

  const extremeSituation = createExampleSituation(engine, {}, true)

  const defaultSituation = {
    ...extremeSituation, // pour déclencher Denormandie, taxe foncière, etc
    ...usageLogementValues[0].situation,
    'vous . propriétaire . condition': 'oui',
    'ménage . revenu': 25000, // Le revenu médian est de 20 000, mais le mettre à 25 000 permet de faire en sorte qu'il y ait une différence entre IdF et hors IdF pour que la case à cocher ait un effet
    'ménage . personnes': 2,
    'ménage . région . IdF': 'non',
  }

  const rawSituation = useMemo(
    () => ({
      ...defaultSituation,
      'DPE . actuel': currentDPE,
      'projet . DPE visé': targetDPE,
      ...savedSituation,
      ...userSituation,
    }),
    [rawSearchParams.toString(), JSON.stringify(savedSituation)],
  )

  const enrichedSituation = useEnrichSituation(rawSituation)
  const situation = enrichedSituation || rawSituation

  const communeKey = 'logement . commune . nom'
  const commune = situation[communeKey]
  const noDefaultSituation = {
    ...savedSituation,
    ...userSituation,
    ...(commune ? { [communeKey]: commune } : {}),
  }

  // if (!currentDPE || isNaN(currentDPE))
  //   return (
  //     <p>
  //       Un DPE est nécessaire pour estimer les aides à la rénovation d'ampleur.
  //     </p>
  //   )

  useEffect(() => {
    const fetchDPEList = async () => {
      const response = await fetch(
        `https://koumoul.com/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?size=20&page=1&q_mode=simple&truncate=200&select=N°DPE,Etiquette_DPE`,
      )

      const json = await response.json()
      const dpeList = json.results
        .filter((elt) => !['A', 'B', 'C'].includes(elt['Etiquette_DPE']))
        .map((elt) => elt['N°DPE'])
      setDpeList(dpeList)
      setSelectedDpe(dpeList[0])
    }
    fetchDPEList()
  }, [])

  useEffect(() => {
    console.log('selectedDpe', selectedDpe)
    if (!selectedDpe) return

    setSearchParams(
      encodeSituation(omit(userInputDottedNames, situation), true, []),
      'url',
      true,
    )

    const fetchDPEData = async () => {
      try {
        const response = await fetch(
          'https://koumoul.com/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?q_mode=simple&truncate=200&&qs=N°DPE:"' +
            selectedDpe +
            '"',
        )
        const result = (await response.json()).results[0]
        console.log('result', result)
        const montantFactureActuelle = result['Coût_total_5_usages']
        const consoActuelle = result['Conso_5_usages_par_m²_é_primaire']
        const classeEnergie = result['Etiquette_DPE']
        const classeGes = result['Etiquette_GES']

        const classeRetenu =
          classeEnergie.charCodeAt(0) > classeGes.charCodeAt(0)
            ? classeEnergie
            : classeGes

        const currentDPE = data.indexOf(
          data.find((d) => d.lettre == classeRetenu),
        )
        setCurrentDPE(currentDPE)
        userSituation['DPE . actuel'] = currentDPE
        const targetDPE =
          +userSituation['projet . DPE visé'] || Math.max(currentDPE - 2, 1)

        setTargetDPE(targetDPE)
        const moyenneConsoClasseDPE =
          (data[targetDPE]['énergie'] + data[targetDPE - 1]['énergie']) / 2

        const pourcentageEconomieVise = consoActuelle / moyenneConsoClasseDPE
        const montantFactureEstime =
          montantFactureActuelle / pourcentageEconomieVise

        setMontantFactureActuelle(montantFactureActuelle)
        setMontantFactureEstime(montantFactureEstime)
      } catch (err) {
        console.error('Erreur lors de la récupération des données du DPE:', err)
      }
    }

    fetchDPEData()
  }, [selectedDpe, targetDPE, situation])
  const onChange =
    (dottedName) =>
    ({ target: { value } }) =>
      setSearchParams({
        [encodeDottedName(dottedName)]: value + '*',
      })

  return (
    <>
      <div
        css={`
          margin: 1rem;
        `}
      >
        Choisir un DPE:{' '}
        <Select onChange={(e) => setSelectedDpe(e.target.value)}>
          {dpeList.map((dpe) => (
            <option key={dpe} value={dpe}>
              {dpe}
            </option>
          ))}
        </Select>
      </div>
      {targetDPE && (
        <AmpleurWrapper
          css={`
            max-width: 800px;
          `}
        >
          <header>
            <div>
              <Labels
                css={`
                  margin: 0;
                  li  {
                    background: #fdf8db;

                    color: #6e4444;
                  }
                `}
              >
                {[' ⭐️ Rénovation énergétique'].map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </Labels>
              <h2>Vos aides pour une rénovation d'ampleur</h2>
            </div>
            <InternalLink
              href="https://mesaidesreno.beta.gouv.fr"
              css={`
                text-decoration: none;
                color: inherit;
                &:hover {
                  background: 0;
                }
                > div {
                  @media (max-width: 400px) {
                    top: 0rem;
                    right: 0.4rem;
                    img {
                      width: 2rem !important;
                    }
                    span {
                      line-height: 0.8rem;
                      font-size: 80%;
                      width: 2rem;
                    }

                    position: absolute;
                  }
                }
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                  font-size: 90%;
                `}
              >
                <Image
                  src={logo}
                  alt="Logo de Mes Aides Réno"
                  css={`
                    width: 2.6rem !important;
                  `}
                />
                <Title>
                  Mes <strong>Aides Réno</strong>
                </Title>
              </div>
            </InternalLink>
          </header>
          <div>
            <p>
              {!isMobile
                ? "Pour bénéficier des aides pour une rénovation d'ampleur, v"
                : 'V'}
              ous devez viser un saut d'au moins 2{' '}
              {isMobile ? 'DPE' : 'classes de DPE'}, soit passer du DPE actuel{' '}
              {currentDPE && (
                <>
                  <DPELabel index={currentDPE - 1} /> à{isMobile ? '' : ' un '}
                  <DPEQuickSwitch
                    oldIndex={targetDPE - 1}
                    prefixText={''}
                    prefixDPE={isMobile ? false : true}
                    dottedName="projet . DPE visé"
                    situation={situation}
                    possibilities={[0, 1, 2, 3, 4, 5, 6].filter(
                      (index) => index < currentDPE - 2,
                    )}
                  />
                </>
              )}
              .
            </p>
            <QuestionList>
              <Li
                key="typeResidence"
                $next={true}
                $touched={answeredQuestions.includes(
                  'logement . résidence principale propriétaire',
                )}
              >
                <TypeResidence
                  {...{ setSearchParams, situation, answeredQuestions }}
                />
              </Li>
              <Li
                $next={answeredQuestions.includes(
                  'logement . résidence principale propriétaire',
                )}
                $touched={answeredQuestions.includes('ménage . région . IdF')}
                key="IdF"
              >
                <IdFQuestion
                  {...{
                    setSearchParams,
                    isMobile,
                    situation,
                    answeredQuestions,
                  }}
                />
              </Li>
              <Li
                key="personnes"
                $next={answeredQuestions.includes('ménage . région . IdF')}
                $touched={answeredQuestions.includes('ménage . personnes')}
              >
                <PersonnesQuestion
                  {...{
                    defaultSituation,
                    onChange,
                    answeredQuestions,
                    situation,
                  }}
                />
              </Li>
              <Li
                key="revenu"
                $next={answeredQuestions.includes('ménage . personnes')}
                $touched={answeredQuestions.includes('ménage . revenu')}
              >
                <RevenuQuestion
                  {...{
                    answeredQuestions,
                    situation,
                    engine,
                    setSearchParams,
                  }}
                />
              </Li>
            </QuestionList>
            <UserData {...{ setSearchParams, situation }} />
            <section>
              <h3
                css={`
                  margin: 0 !important;
                `}
              >
                Parmi vos aides :
              </h3>
              <EvaluationValue {...{ engine, situation }} />
              {montantFactureActuelle && (
                <EvaluationValueWrapper>
                  <div>
                    <Image src={electriciteIcon} alt="Icone électricité" />
                  </div>
                  <div
                    css={`
                      width: 100%;
                    `}
                  >
                    {/* La facture énergétique annuelle actuelle est estimée à{' '}
                    <Key $state={'final'}>
                      {format(montantFactureActuelle)}€
                    </Key>
                    <br /> */}
                    En visant un DPE <DPELabel index={targetDPE - 1} />, le
                    montant estimé de votre facture d'énergie annuelle se
                    situera{' '}
                    <Key $state={'prime'}>
                      entre {format(0.9 * montantFactureEstime)}€ et{' '}
                      {format(1.1 * montantFactureEstime)}€
                    </Key>
                  </div>
                </EvaluationValueWrapper>
              )}
            </section>
            <section>
              {ampleurQuestionsAnswered(answeredQuestions) && (
                <CTA
                  css={`
                    margin-bottom: 0;
                    a  {
                      display: flex;
                      font-size: 85% !important;
                      align-items: center;
                      img {
                        height: 2rem;
                        width: auto;
                        margin-right: 0.6rem;
                      }
                    }
                  `}
                >
                  <AmpleurCTA {...{ situation: noDefaultSituation }} />
                </CTA>
              )}
            </section>
          </div>
          <FooterModule isMobile={isMobile} />
        </AmpleurWrapper>
      )}
    </>
  )
}

export const FooterModule = () => {
  const isMobile = useMediaQuery('(max-width: 400px)')
  return (
    <footer
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: -1rem;

        p {
          margin: 0;
          margin-right: 1rem;
        }
      `}
    >
      <p>
        <small
          css={`
            line-height: 1rem;
            color: gray;
            display: block;
          `}
        >
          Une initiative construite avec France&nbsp;Rénov{"'"}
          {isMobile
            ? '.'
            : ` pour simplifier
            l'information sur les aides à la rénovation énergétique.`}
        </small>
      </p>

      <Image
        src={logoFranceRenov}
        alt="Logo de France Rénov"
        css={`
          width: 6.5rem !important;
          margin-right: 1rem;
          @media (max-width: 400px) {
            width: 5rem !important;
            margin: 0;
          }
        `}
      />
    </footer>
  )
}
