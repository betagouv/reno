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
import calculatorIcon from '@/public/calculator-black.svg'
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
import editIcon from '@/public/crayon.svg'
import Select from '../Select'

export default function ExplicationCopropriete() {
  useSyncUrlLocalStorage()
  const isMobile = window.innerWidth <= 600
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

  // Si le montant des travaux n'est pas précisé, on l'estime
  if (!situation['copropriété . montant travaux']) {
    situation['copropriété . montant travaux'] = roundToThousands(
      engine.evaluate('copropriété . montant travaux').nodeValue,
    )
  }
  let bonusFragile = null
  let bonusSortiePassoire = null
  if (isEligibile) {
    const evaluation = engine.setSituation(situation)
    bonusFragile = evaluation.evaluate(
      'copropriété . pourcentage copropriété fragile',
    ).nodeValue
    bonusSortiePassoire = evaluation.evaluate(
      'copropriété . pourcentage sortie passoire',
    ).nodeValue
  }

  const primeMaxCoproIndividuelle = formatValue(
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
        {isEligibile ? (
          <>
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
          </>
        ) : (
          <>
            <p>
              Votre copropriété{' '}
              <PrimeStyle $red={true}>
                <strong>n'est pas éligible</strong>
              </PrimeStyle>{' '}
              au dispositif <strong>MaPrimeRénov' Copropriété</strong>
            </p>
          </>
        )}
        <>
          <Card
            css={`
              background: linear-gradient(180deg, #f7f7f7 0%, #e6f7fb 100%);
              box-shadow: 1px 4px 6px 0px #ccd0d5;
              margin-bottom: 2rem;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
                h3 {
                  margin: 0.5rem 0;
                }
              `}
            >
              <Image src={calculatorIcon} alt="icone calculatrice" />{' '}
              <h3>À vos calculs !</h3>
            </div>
            <div
              css={`
                display: flex;
                ${isMobile && 'flex-direction: column;'}
                justify-content: space-between;
                gap: 1rem;
              `}
            >
              <div
                css={`
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                `}
              >
                <div>Nombre de logement:</div>
                <div>
                  <Input
                    css={`
                      line-height: 1.5rem;
                      border: 2px solid var(--color) !important;
                      border-radius: 0.3rem !important;
                      padding: 0.7rem !important;
                      box-shadow: var(--shadow-elevation-medium) !important;
                      font-weight: bold;
                      font-size: 100% !important;
                      height: auto !important;
                      color: #000;
                    `}
                    autoFocus={false}
                    value={situation['copropriété . nombre de logement']}
                    placeholder="0"
                    min="1"
                    onChange={(rawValue) => {
                      const value = rawValue !== 'undefined' ? rawValue : 0
                      setSearchParams(
                        encodeSituation({
                          'copropriété . nombre de logement': value + '*',
                        }),
                        'replace',
                        false,
                      )
                    }}
                    step="1"
                  />
                </div>
              </div>
              <div
                css={`
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                `}
              >
                <div>Gain énergétique:</div>
                <div>
                  <Select
                    value={situation[
                      'copropriété . gain énergétique'
                    ].replaceAll('"', "'")}
                    values={rules['copropriété . gain énergétique'][
                      'une possibilité parmi'
                    ]['possibilités'].map(
                      (i) => rules['copropriété . gain énergétique . ' + i],
                    )}
                    onChange={(e) =>
                      setSearchParams(
                        encodeSituation({
                          'copropriété . gain énergétique': e + '*',
                        }),
                        'replace',
                        false,
                      )
                    }
                    css={`
                      border: 2px solid var(--color);
                      border-radius: 0.3rem;
                      padding: 0.7rem;
                      box-shadow: var(--shadow-elevation-medium);
                      font-weight: bold;
                      font-size: 100%;
                      color: #000;
                    `}
                  />{' '}
                </div>
              </div>
              <div
                css={`
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                `}
              >
                <div>Votre budget de travaux de rénovation:</div>
                <div
                  css={`
                    margin: auto;
                    border: 2px solid var(--color);
                    width: 100%;
                    color: var(--color);
                    text-align: center;
                    border-radius: 0.3rem;
                    padding: 0.7rem;
                    box-shadow: var(--shadow-elevation-medium);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  `}
                >
                  <div
                    css={`
                      flex-grow: 1;
                    `}
                  >
                    <input
                      id="budget-travaux"
                      css={`
                        border: none;
                        background: transparent;
                        -webkit-appearance: none;
                        outline: none;
                        color: var(--color);
                        font-size: 110%;
                        max-width: 4rem;
                      `}
                      autoFocus={false}
                      value={situation['copropriété . montant travaux']}
                      placeholder="mes travaux"
                      min="0"
                      max="999999"
                      onChange={(e) => {
                        const rawValue = e.target.value
                        const startPos = e.target.selectionStart
                        const value = +rawValue === 0 ? 0 : rawValue
                        setSearchParams(
                          encodeSituation({
                            'copropriété . montant travaux': value + '*',
                          }),
                          'replace',
                          false,
                        )
                        requestAnimationFrame(() => {
                          const inputBudget =
                            document.querySelector('#budget-travaux')
                          inputBudget.selectionStart = startPos
                          inputBudget.selectionEnd = startPos
                        })
                      }}
                      step="100"
                    />
                    <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                      € HT
                    </span>
                  </div>
                  <Image
                    css={`
                      cursor: pointer;
                      margin-left: auto;
                    `}
                    src={editIcon}
                    alt="Icône crayon pour éditer"
                    onClick={() =>
                      document.querySelector('#budget-travaux').focus()
                    }
                  />
                </div>
              </div>
            </div>
            <div
              css={`
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 0.5rem;
                margin-top: 1rem;
              `}
            >
              <div>Vous toucherez un total d'aides de :</div>
              <div
                css={`
                  margin-top: 0.5rem;
                  text-align: center;
                  background: var(
                    ${isEligibile ? '--validColor1' : '--warningColor'}
                  );
                  color: var(
                    ${isEligibile ? '--validColor' : '--warningColor'}
                  );
                  padding: 0.5rem;
                  em {
                    color: black;
                  }
                `}
              >
                <Value
                  {...{
                    engine,
                    situation: situation,
                    dottedName: 'copropriété . montant',
                  }}
                />
              </div>
            </div>
          </Card>
          {isEligibile ? (
            <>
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
                du montant total de vos travaux. Ce pourcentage se décompose de
                la manière suivante:
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
                        situation,
                        dottedName:
                          'copropriété . pourcentage gain énergétique',
                        state: 'final',
                      }}
                    />{' '}
                    car votre gain énergétique est estimé à{' '}
                    <Value
                      {...{
                        engine,
                        situation,
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
                        situation,
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
                        situation,
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
                      situation,
                      dottedName:
                        'copropriété . montant . plafond par logement',
                      state: 'final',
                    }}
                  />{' '}
                  par logement. Pour votre copropriété de{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'copropriété . nombre de logement',
                      state: 'final',
                    }}
                  />{' '}
                  logements, cela représente un montant de{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'copropriété . montant . plafond',
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
                  En effet, chaque copropriétaire peut bénéficier
                  individuellement d'une prime pouvant s'élever à{' '}
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
              />
            </>
          ) : (
            <>
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
                  <strong>peut-être éligibles individuellement</strong> à
                  d'autres aides à la rénovation.
                  <br />
                  C'est pourquoi, nous vous invitons à refaire une simulation
                  pour avoir un aperçu de l'ensemble de vos aides.
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
          )}
        </>
      </CustomQuestionWrapper>
    </Section>
  )
}
