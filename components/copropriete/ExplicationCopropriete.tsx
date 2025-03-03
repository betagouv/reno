'use client'

import { Card, CTA, CTAWrapper, PrimeStyle, Section } from '@/components/UI'
import rules from '@/app/règles/rules'
import {
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Publicodes, { formatValue } from 'publicodes'
import { useMemo } from 'react'
import Image from 'next/image'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import Input from '../Input'
import calculatorIcon from '@/public/calculator-empty.svg'
import { roundToThousands } from '../utils'
import checkIcon from '@/public/check.svg'
import informationIcon from '@/public/information.svg'
import Link from 'next/link'
import MprCategory from '../MprCategory'
import { omit } from '@/components/utils'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from '../CustomQuestionUI'
import Value from '../Value'
import CopyButton from '../CopyButton'

export default function ExplicationCopropriete() {
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [...getAnsweredQuestions(searchParams, rules)]
  const situation = {
    ...getSituation(searchParams, rules),
  }
  const setSearchParams = useSetSearchParams()

  const isEligibile = engine
    .setSituation(situation)
    .evaluate('copropriété . condition éligibilité').nodeValue

  const exampleSituation = isEligibile && {
    ...situation,
    'copropriété . montant travaux': roundToThousands(
      engine
        .setSituation({
          'copropriété . nombre de logement':
            situation['copropriété . nombre de logement'],
        })
        .evaluate('copropriété . montant travaux').nodeValue,
      5,
    ),
  }
  const evaluation = isEligibile && engine.setSituation(exampleSituation)
  const isFragile =
    isEligibile &&
    evaluation.evaluate('copropriété . bonus copropriété fragile').nodeValue
  const isPassoire =
    isEligibile &&
    evaluation.evaluate('copropriété . bonus sortie passoire').nodeValue
  const primeMaxCoproIndividuelle =
    isEligibile &&
    formatValue(
      engine
        .setSituation(omit(['ménage . revenu'], situation))
        .evaluate('copropriété . prime individuelle totale'),
    )

  return (
    <Section>
      <CustomQuestionWrapper>
        <div
          css={`
            display: flex;
            justify-content: space-between;
          `}
        >
          <BtnBackToParcoursChoice
            {...{
              setSearchParams,
              situation,
              answeredQuestions: answeredQuestions.slice(0, -1),
            }}
          />
          <CopyButton searchParams={searchParams} />
        </div>
        <header>
          <small>MaPrimeRénov’ Copropriété</small>
          <h2>Financer une rénovation d’ampleur de votre copropriété</h2>
        </header>
        {!isEligibile ? (
          <>
            <p>
              Votre copropriété{' '}
              <PrimeStyle $red={true}>
                <strong>n'est pas éligible</strong>
              </PrimeStyle>{' '}
              au dispositif <strong>MaPrimeRénov' Copropriété</strong>
            </p>
            <div
              css={`
                background-image: linear-gradient(0deg, #2a82dd, #2a82dd);
                background-position: 0 0;
                background-repeat: no-repeat;
                background-size: 0.25rem 100%;
                font-size: 1rem;
                line-height: 1.5rem;
                padding-left: 1.25rem;
                margin-bottom: 0.8rem;
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                  margin-bottom: 0.4rem;
                  color: #2a82dd;
                  font-weight: 500;
                  img {
                    margin-right: 0.4rem;
                  }
                `}
              >
                <Image src={informationIcon} alt="infobulle" width="25" />
                <span>Ce n'est pas fini!</span>
              </div>
              <p>
                Les copropriétaires sont{' '}
                <strong>peut-être éligibles individuellement</strong> à d'autres
                aides à la rénovation.
                <br />
                C'est pourquoi, nous vous invitons à refaire une simulation pour
                avoir un aperçu de l'ensemble de vos aides.
              </p>
            </div>
            <CTAWrapper $justify="center">
              <CTA $fontSize="normal">
                <Link href="/simulation">
                  ➞&nbsp;&nbsp;Simulez l'ensemble de vos aides
                </Link>
              </CTA>
            </CTAWrapper>
          </>
        ) : (
          <Card>
            <h3
              css={`
                margin-top: 1rem;
              `}
            >
              <Image src={checkIcon} alt="Icône case cochée" /> Bonne nouvelle
            </h3>
            <p>
              Votre copropriété est{' '}
              <PrimeStyle>
                <strong>éligible</strong>
              </PrimeStyle>{' '}
              au dispositif <strong>MaPrimeRénov' Copropriété</strong>.
            </p>
            <div
              css={`
                display: flex;
                align-items: center;
                margin-top: 1rem;
              `}
            >
              <Image
                src={calculatorIcon}
                alt="Icône calculette"
                css={`
                  width: 3rem !important;
                  height: auto !important;
                  margin-right: 0.8rem !important;
                `}
              />
              <p
                css={`
                  line-height: 1.9rem;
                `}
              >
                Par exemple : pour une enveloppe de travaux de rénovation
                énergétique de{' '}
                <label>
                  <Input
                    css={`
                      vertical-align: text-bottom;
                      padding: 0.2rem 0.3rem 0 0;
                      max-width: 6rem !important;
                    `}
                    autoFocus={false}
                    value={exampleSituation['copropriété . montant travaux']}
                    placeholder="mes travaux"
                    min="0"
                    onChange={(rawValue) => {
                      const value = +rawValue === 0 ? undefined : rawValue
                      setSearchParams(
                        encodeSituation({
                          'copropriété . montant travaux': value,
                        }),
                        'replace',
                        false,
                      )
                    }}
                    step="100"
                    css={`
                      border-bottom: 2px solid #d1d1fb !important;
                    `}
                  />
                  €{' '}
                </label>
                <span>, la copropriété touchera un total d'aides de </span>
                <PrimeStyle>
                  <strong>
                    {formatValue(engine.evaluate('copropriété . montant'))}
                  </strong>
                </PrimeStyle>
              </p>
            </div>
            <Card
              css={`
                background: transparent;
                border: none;
                border-left: 3px solid #dfdff1;
                border-radius: 0;
                padding: 0rem 0 0rem 0.8rem;
                margin: 2vh 0 3vh;
              `}
            >
              <h4
                css={`
                  text-align: left;
                  margin: 0rem 0 0.8rem 0;
                  color: gray;
                  font-weight: 400;
                `}
              >
                Explications
              </h4>
              L'aide de l'état financera{' '}
              <PrimeStyle>
                <strong>
                  {formatValue(
                    evaluation.evaluate("copropriété . pourcentage d'aide"),
                  )}
                </strong>
              </PrimeStyle>{' '}
              du montant total de vos travaux. Ce pourcentage se décompose de la
              manière suivante:
              <ul
                css={`
                  margin: 1.1rem 0;
                `}
              >
                <li
                  css={`
                    margin: 5px 0;
                  `}
                >
                  <Value
                    {...{
                      engine,
                      situation: exampleSituation,
                      dottedName: 'copropriété . pourcentage gain énergétique',
                      state: 'final',
                    }}
                  />{' '}
                  car votre gain énergétique est estimé à{' '}
                  <Value
                    {...{
                      engine,
                      situation: exampleSituation,
                      dottedName: 'copropriété . gain énergétique',
                      state: 'final',
                    }}
                  />
                </li>
                <li
                  css={`
                    margin: 5px 0;
                  `}
                >
                  <Value
                    {...{
                      engine,
                      situation: exampleSituation,
                      dottedName: 'copropriété . pourcentage sortie passoire',
                      state: 'final',
                    }}
                  />{' '}
                  car{' '}
                  <PrimeStyle $red={!isPassoire}>
                    {!isPassoire
                      ? 'vous ne bénéficieriez pas'
                      : 'vous bénéficieriez'}
                  </PrimeStyle>{' '}
                  du bonus <strong>"Sortie de passoire"</strong>
                </li>
                <li
                  css={`
                    margin: 5px 0;
                  `}
                >
                  <Value
                    {...{
                      engine,
                      situation: exampleSituation,
                      dottedName:
                        'copropriété . pourcentage copropriété fragile',
                      state: 'final',
                    }}
                  />{' '}
                  car{' '}
                  <PrimeStyle $red={!isFragile}>
                    {!isFragile
                      ? 'vous ne bénéficieriez pas'
                      : 'vous bénéficieriez'}
                  </PrimeStyle>{' '}
                  du bonus{' '}
                  <strong>"Copropriété fragile ou en difficulté"</strong>
                </li>
              </ul>
              <p>
                Elle est plafonnée à{' '}
                <Value
                  {...{
                    engine,
                    situation: exampleSituation,
                    dottedName: 'copropriété . montant . plafond par logement',
                    state: 'final',
                  }}
                />{' '}
                par logement. Pour votre copropriété de{' '}
                <Value
                  {...{
                    engine,
                    situation: exampleSituation,
                    dottedName: 'copropriété . nombre de logement',
                    state: 'final',
                  }}
                />{' '}
                logements, cela représente un montant de{' '}
                <Value
                  {...{
                    engine,
                    situation: exampleSituation,
                    dottedName: 'copropriété . montant . plafond',
                    state: 'final',
                  }}
                />
              </p>
            </Card>
            <div
              css={`
                background-image: linear-gradient(0deg, #2a82dd, #2a82dd);
                background-position: 0 0;
                background-repeat: no-repeat;
                background-size: 0.25rem 100%;
                font-size: 1rem;
                line-height: 1.5rem;
                padding-left: 1.25rem;
                margin-bottom: 0.8rem;
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                  margin-bottom: 0.4rem;
                  color: #2a82dd;
                  font-weight: 500;
                  img {
                    margin-right: 0.4rem;
                  }
                `}
              >
                <Image src={informationIcon} alt="infobulle" width="25" />
                <span>Ce n'est pas tout!</span>
              </div>
              <p>
                Les copropriétaires sont potentiellement éligibles à{' '}
                <PrimeStyle>
                  <strong>{primeMaxCoproIndividuelle}</strong>
                </PrimeStyle>{' '}
                d'aide supplémentaire.
              </p>
              <p>
                En effet, chaque copropriétaire peut bénéficier individuellement
                d'une prime pouvant s'élever à{' '}
                <PrimeStyle>
                  <strong>
                    {rules['copropriété . prime individuelle']['par défaut']}
                  </strong>
                </PrimeStyle>{' '}
                par logement en fonction de ses revenus.
              </p>
            </div>
            <MprCategory
              {...{
                engine,
                situation,
                setSearchParams,
                answeredQuestions,
              }}
            ></MprCategory>
          </Card>
        )}
      </CustomQuestionWrapper>
    </Section>
  )
}
